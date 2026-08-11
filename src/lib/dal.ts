import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

/**
 * Data Access Layer (DAL)
 * Acts as an L1 request cache during the React render pass.
 * Securely handles authentication and resolves Clerk ID to internal Database User record.
 */

export const getResolvedUser = cache(async () => {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) return null;

    const dbUser = await prisma.user.findFirst({
        where: { clerkId: clerkUserId }
    });

    return dbUser;
});

export const getResolvedUserId = cache(async (): Promise<string | null> => {
    const user = await getResolvedUser();
    return user ? user.id : null;
});

export const getActivePortfolio = cache(async () => {
    const dbUserId = await getResolvedUserId();
    if (!dbUserId) return null;

    const portfolio = await prisma.portfolio.findFirst({
        where: { userId: dbUserId },
        include: { holdings: true }
    });

    return portfolio;
});