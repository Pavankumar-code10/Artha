import { prisma } from "@/lib/prisma";

import { normalizeHoldings } from "../engine/normalize";
import { calculateConcentration } from "../engine/concentration";
import { calculateDiversification } from "../engine/diversification";

export async function generatePortfolioXRay(
    portfolioId: string
) {

    const portfolio =
        await prisma.portfolio.findUnique({

            where: {
                id: portfolioId,
            },

            include: {
                holdings: true,
            },

        });

    if (!portfolio) {
        throw new Error("Portfolio not found");
    }

    const normalized =
        normalizeHoldings(portfolio.holdings);

    const totalValue =
        normalized.reduce(
            (sum, holding) =>
                sum + holding.currentValue,
            0
        );

    return {

        totalValue,

        diversificationScore:
            calculateDiversification(normalized),

        concentrationScore:
            calculateConcentration(normalized),

        overlapScore: 0,

        topHoldings:

            [...normalized]

                .sort(
                    (a, b) =>
                        b.currentValue -
                        a.currentValue
                )

                .slice(0, 5),

    };
}