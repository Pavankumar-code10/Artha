import { prisma } from "@/lib/prisma";
import type { PortfolioMetrics } from "../types";

export async function getPortfolioDashboard(databaseUserId: string) {
    const portfolios = await prisma.portfolio.findMany({
        where: {
            userId: databaseUserId,
        },
        include: {
            holdings: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    const holdings = portfolios.flatMap((portfolio) => portfolio.holdings);

    const investedValue = holdings.reduce(
        (sum, h) => sum + h.investedValue,
        0
    );

    const currentValue = holdings.reduce(
        (sum, h) => sum + h.currentValue,
        0
    );

    const gainLoss = currentValue - investedValue;

    const metrics: PortfolioMetrics = {
        investedValue,
        currentValue,
        gainLoss,
        gainLossPercentage:
            investedValue === 0 ? 0 : (gainLoss / investedValue) * 100,
        holdingsCount: holdings.length,
        portfoliosCount: portfolios.length,
    };

    return {
        metrics,
        portfolios,
        lastSyncedAt: portfolios[0]?.lastSyncedAt ?? null,
    };
}