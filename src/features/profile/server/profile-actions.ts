'use server';

import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getRankForXp } from '@/features/learn/constants';

export async function getUserProfileDetails() {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) return null;

    const user = await currentUser();

    // 1. Fetch or JIT-provision user in DB
    let dbUser = await prisma.user.findFirst({ where: { clerkId: clerkUserId } });

    if (!dbUser) {
        dbUser = await prisma.user.create({
            data: {
                id: clerkUserId,
                clerkId: clerkUserId,
                email: user?.emailAddresses[0]?.emailAddress || `${clerkUserId}@aartha.fin`,
                firstName: user?.firstName || 'Retail',
                lastName: user?.lastName || 'Investor',
            },
        });
    }

    // 2. Fetch User Portfolio & Holdings Count
    const portfolio = await prisma.portfolio.findFirst({
        where: { userId: dbUser.id },
        include: { holdings: true },
    });

    // 3. Fetch Learning Progress & XP
    const progress = await prisma.learningProgress.findMany({
        where: { userId: dbUser.id },
    });

    const totalXp = progress.reduce((sum, p) => sum + (p.score || 0), 0);
    const rank = getRankForXp(totalXp);

    return {
        id: dbUser.id,
        clerkId: clerkUserId,
        email: user?.emailAddresses[0]?.emailAddress || 'N/A',
        fullName: `${user?.firstName || 'Retail'} ${user?.lastName || 'Investor'}`,
        imageUrl: user?.imageUrl,
        createdAt: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recently',
        
        // Regulatory Profile
        kycStatus: dbUser.kycStatus,
        investorType: dbUser.investorType,
        riskToleranceScore: dbUser.riskToleranceScore,
        suitabilityCategory: dbUser.suitabilityCategory,

        // System Preferences
        aiContextConsent: dbUser.aiContextConsent,
        preferredCurrency: dbUser.preferredCurrency,
        sectorBlacklist: dbUser.sectorBlacklist,

        // Portfolio & AA Consent
        holdingsCount: portfolio?.holdings?.length || 0,
        hasConnectedAA: portfolio?.consentGiven || false,
        aaConsentDetails: portfolio ? {
            consentId: portfolio.consentId,
            fipName: portfolio.fipName,
            status: portfolio.consentStatus,
            lastSyncedAt: portfolio.lastSyncedAt?.toLocaleString('en-IN') || 'Never',
            expiresAt: portfolio.expiresAt?.toLocaleDateString('en-IN') || 'N/A'
        } : null,

        // Gamification
        totalXp,
        rank,
        completedModulesCount: progress.filter(p => p.completed).length,
    };
}

export async function revokeAAConsent() {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error('Unauthorized');

    const dbUser = await prisma.user.findFirst({ where: { clerkId: clerkUserId } });
    if (!dbUser) throw new Error('User not found');

    // Find and delete the portfolio holdings, and reset the AA consent flags
    const portfolio = await prisma.portfolio.findFirst({ where: { userId: dbUser.id } });
    
    if (portfolio) {
        await prisma.holding.deleteMany({
            where: { portfolioId: portfolio.id }
        });
        
        await prisma.portfolio.update({
            where: { id: portfolio.id },
            data: {
                consentGiven: false,
                consentId: null,
                fipName: null,
                consentStatus: 'REVOKED',
                lastSyncedAt: null,
            }
        });
    }

    return { success: true };
}

export async function updateAIPreferences(consent: boolean) {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error('Unauthorized');

    await prisma.user.update({
        where: { clerkId: clerkUserId },
        data: { aiContextConsent: consent }
    });

    return { success: true };
}