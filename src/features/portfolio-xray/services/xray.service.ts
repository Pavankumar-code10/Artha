import { prisma } from "@/lib/prisma";

import { calculateConcentration } from "../engine/concentration";
import { calculateDiversification } from "../engine/diversification";
import { normalizeHoldings } from "../engine/normalize";
import { calculateRisk } from "../engine/risk";

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

    const diversification =
        calculateDiversification(normalized);

    const concentration =
        calculateConcentration(normalized);

    return {

        totalValue:
            normalized.reduce(
                (sum, h) =>
                    sum + h.currentValue,
                0
            ),

        diversificationScore:
            diversification,

        concentrationScore:
            concentration,

        overlapScore: 0,

        risk:
            calculateRisk(
                diversification,
                concentration
            ),

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