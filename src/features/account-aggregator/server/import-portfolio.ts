"use server";

import { syncAccountAggregator } from "@/features/portfolio/server/sync-actions";
import { prisma } from "@/lib/prisma";
import { getOrProvisionUser } from "@/features/portfolio/server/sync-actions";

export async function importMockPortfolio(
    institution: string
) {
    const dbUser = await getOrProvisionUser();
    if (!dbUser) throw new Error("Unauthorized");

    // We reuse the robust sync logic that seeds realistic Indian market data
    await syncAccountAggregator(institution);

    const portfolio = await prisma.portfolio.findFirst({
        where: { userId: dbUser.id },
        orderBy: { lastSyncedAt: 'desc' }
    });
    
    return portfolio?.id || null;
}