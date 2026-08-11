'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ScoredMarketplaceAsset } from '../types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Enterprise JIT (Just-In-Time) User Provisioning.
 * Ensures that any Clerk-authenticated user has a corresponding
 * database record and an active portfolio before transacting.
 */
async function requireProvisionedUser(): Promise<string> {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
        throw new Error('Unauthorized: You must be logged in to invest.');
    }

    // 1. Check if user exists in the local database — must look up by clerkId (unique),
    //    NOT id, because id is a cuid() auto-generated on first create.
    let dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUserId }
    });

    // 2. Provision User if missing (Simulating Webhook Sync)
    if (!dbUser) {
        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress || `${clerkUserId}@aartha.fin`;

        // FIX: Mapped exactly to Prisma schema expectations
        const firstName = user?.firstName || 'Retail';
        const lastName = user?.lastName || 'Investor';

        dbUser = await prisma.user.create({
            data: {
                id: clerkUserId,
                clerkId: clerkUserId,
                email: email,
                firstName: firstName,
                lastName: lastName,
            }
        });
    }

    // 3. Ensure an active portfolio exists to receive the investment
    let portfolio = await prisma.portfolio.findFirst({
        where: { userId: dbUser.id }
    });

    if (!portfolio) {
        portfolio = await prisma.portfolio.create({
            data: {
                userId: dbUser.id,
                name: 'Core Portfolio',
                institution: 'Aartha Platform',
                accountMasked: 'XXXX',
            }
        });
    }

    return dbUser.id;
}

export async function checkKnowledgeStatus(category: string): Promise<boolean> {
    const activeUserId = await requireProvisionedUser();

    const progress = await prisma.learningProgress.findFirst({
        where: {
            userId: activeUserId,
            module: category,
            completed: true
        },
    });

    return !!progress;
}

export async function markQuizCompleted(category: string): Promise<void> {
    const activeUserId = await requireProvisionedUser();

    await prisma.learningProgress.create({
        data: {
            userId: activeUserId,
            module: category,
            completed: true,
            score: 100,
        },
    });
}

/**
 * Maps a marketplace asset category to the correct Prisma AssetType enum.
 * Critical for X-Ray accuracy — wrong type = wrong sector bucket = wrong HHI score.
 */
function resolveAssetType(category: string): 'STOCK' | 'MUTUAL_FUND' | 'ETF' | 'BOND' | 'REIT' | 'INVIT' | 'GOLD' | 'CASH' {
    switch (category) {
        case 'REIT':           return 'REIT';
        case 'INVIT':          return 'INVIT';
        case 'SGB':            return 'GOLD';     // Sovereign Gold Bond → Gold asset class
        case 'CORPORATE_BOND': return 'BOND';
        case 'MUTUAL_FUND':    return 'MUTUAL_FUND';
        case 'ETF':            return 'ETF';
        default:               return 'STOCK';
    }
}

export async function executeInvestment(asset: ScoredMarketplaceAsset, amount: number) {
    const activeUserId = await requireProvisionedUser();

    const portfolio = await prisma.portfolio.findFirst({
        where: { userId: activeUserId },
    });

    if (!portfolio) throw new Error('Portfolio provisioning failed.');

    const security = await prisma.security.upsert({
        where: { symbol: asset.ticker },
        update: {},
        create: {
            id: asset.id,
            symbol: asset.ticker,
            name: asset.name,
            sector: asset.sector,
        },
    });

    // Calculate units based on a simulated NAV (₹100 per unit)
    const simulatedNav = 100;
    const unitsToBuy = amount / simulatedNav;

    // Resolve the correct asset type from the marketplace category
    const assetType = resolveAssetType(asset.category);

    await prisma.holding.create({
        data: {
            portfolioId: portfolio.id,
            symbol: security.symbol,
            assetName: security.name,
            assetType,              // ← Correctly typed: REIT, INVIT, GOLD, BOND, etc.
            quantity: unitsToBuy,
            averagePrice: simulatedNav,
            currentPrice: simulatedNav,
            investedValue: amount,
            currentValue: amount,
        },
    });

    revalidatePath('/portfolio');
    revalidatePath('/portfolio-xray');
    redirect('/portfolio-xray');
}