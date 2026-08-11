'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ── JIT provision helper (shared) ─────────────────────────────────────────────
export async function getOrProvisionUser() {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) return null;

    let dbUser = await prisma.user.findFirst({ where: { clerkId: clerkUserId } });
    if (!dbUser) {
        const clerkUser = await currentUser();
        dbUser = await prisma.user.create({
            data: {
                id: clerkUserId,
                clerkId: clerkUserId,
                email: clerkUser?.emailAddresses[0]?.emailAddress ?? `${clerkUserId}@aartha.fin`,
                firstName: clerkUser?.firstName ?? 'Retail',
                lastName: clerkUser?.lastName ?? 'Investor',
            },
        });
    }
    return dbUser;
}

// ── Get full dashboard data ────────────────────────────────────────────────────
export async function getDashboardData() {
    const dbUser = await getOrProvisionUser();
    if (!dbUser) return null;

    const portfolio = await prisma.portfolio.findFirst({
        where: { userId: dbUser.id },
        include: { holdings: true },
    });

    return {
        user: {
            firstName: dbUser.firstName,
            riskCategory: dbUser.suitabilityCategory,
        },
        portfolio: portfolio ?? null,
        holdings: portfolio?.holdings ?? [],
        lastSyncedAt: portfolio?.lastSyncedAt?.toLocaleString('en-IN') ?? null,
        hasConnectedAA: portfolio?.consentGiven ?? false,
        fipName: portfolio?.fipName ?? null,
    };
}

// ── Sync / re-sync Account Aggregator ─────────────────────────────────────────
export async function syncAccountAggregator(fipName: string = 'Zerodha / Groww / HDFC Demat') {
    const dbUser = await getOrProvisionUser();
    if (!dbUser) throw new Error('Unauthorized');

    let portfolio = await prisma.portfolio.findFirst({ where: { userId: dbUser.id } });
    if (!portfolio) {
        portfolio = await prisma.portfolio.create({
            data: {
                userId: dbUser.id,
                name: 'Core Portfolio',
                institution: 'Sahamati AA Network',
                accountMasked: 'XXXX-XXXX',
                consentGiven: true,
                fipName: fipName,
                consentStatus: 'ACTIVE',
                lastSyncedAt: new Date(),
            },
        });
    } else {
        // Update sync timestamp
        portfolio = await prisma.portfolio.update({
            where: { id: portfolio.id },
            data: { consentGiven: true, fipName: fipName, lastSyncedAt: new Date(), consentStatus: 'ACTIVE' },
        });
    }

    // Create AAConsent Ledger Record
    const consentHandle = `AA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    await prisma.aAConsent.create({
        data: {
            userId: dbUser.id,
            consentHandle,
            fipId: fipName.toUpperCase().replace(/\s+/g, '_'),
            status: 'ACTIVE',
            frequency: 'ONE_TIME',
            dateRange: 'LAST_1_YEAR',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
    });

    const existingCount = await prisma.holding.count({ where: { portfolioId: portfolio.id } });
    if (existingCount === 0) {
        const MOCK_HOLDINGS = [
            { assetName: 'Reliance Industries Ltd',      symbol: 'RELIANCE', assetType: 'STOCK'       as const, quantity: 50,  averagePrice: 2850.50, currentPrice: 2940.75, investedValue: 50  * 2850.50, currentValue: 50  * 2940.75 },
            { assetName: 'HDFC Bank Ltd',                symbol: 'HDFCBANK', assetType: 'STOCK'       as const, quantity: 120, averagePrice: 1445.20, currentPrice: 1512.80, investedValue: 120 * 1445.20, currentValue: 120 * 1512.80 },
            { assetName: 'Infosys Ltd',                  symbol: 'INFY',     assetType: 'STOCK'       as const, quantity: 80,  averagePrice: 1620.00, currentPrice: 1748.50, investedValue: 80  * 1620.00, currentValue: 80  * 1748.50 },
            { assetName: 'Mirae Asset Large Cap Fund',   symbol: 'MIRAELC',  assetType: 'MUTUAL_FUND' as const, quantity: 500, averagePrice: 98.40,   currentPrice: 107.20,  investedValue: 500 * 98.40,   currentValue: 500 * 107.20  },
            { assetName: 'Bharat Bond ETF – Apr 2032',   symbol: 'BBNDETF',  assetType: 'ETF'         as const, quantity: 200, averagePrice: 1000.00, currentPrice: 1125.60, investedValue: 200 * 1000.00, currentValue: 200 * 1125.60 },
            { assetName: 'Sovereign Gold Bond 2025',     symbol: 'SGB2025',  assetType: 'GOLD'        as const, quantity: 4,   averagePrice: 5820.00, currentPrice: 6210.50, investedValue: 4   * 5820.00, currentValue: 4   * 6210.50 },
            { assetName: 'Embassy Office Parks REIT',    symbol: 'EMBASSY',  assetType: 'REIT'        as const, quantity: 100, averagePrice: 348.00,  currentPrice: 362.40,  investedValue: 100 * 348.00,  currentValue: 100 * 362.40  },
            { assetName: 'India Grid InvIT',             symbol: 'INDIGRID', assetType: 'INVIT'       as const, quantity: 200, averagePrice: 152.00,  currentPrice: 168.40,  investedValue: 200 * 152.00,  currentValue: 200 * 168.40  },
        ];
        await prisma.holding.createMany({
            data: MOCK_HOLDINGS.map(h => ({ portfolioId: portfolio.id, ...h })),
            skipDuplicates: true,
        });
    }

    // Create SyncLog
    const holdingsCount = await prisma.holding.count({ where: { portfolioId: portfolio.id } });
    await prisma.syncLog.create({
        data: {
            portfolioId: portfolio.id,
            status: 'SUCCESS',
            recordsImported: holdingsCount,
        }
    });

    revalidatePath('/portfolio');
    revalidatePath('/portfolio-xray');
    revalidatePath('/profile');
}