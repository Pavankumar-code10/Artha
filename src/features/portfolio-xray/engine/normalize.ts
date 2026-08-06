import { Holding } from "@prisma/client";

import { NormalizedHolding } from "../types";

export function normalizeHoldings(
    holdings: Holding[]
): NormalizedHolding[] {

    const totalValue = holdings.reduce(
        (sum, holding) => sum + holding.currentValue,
        0
    );

    return holdings.map((holding) => ({

        symbol: holding.symbol,

        name: holding.assetName,

        type: holding.assetType,

        quantity: holding.quantity,

        investedValue: holding.investedValue,

        currentValue: holding.currentValue,

        allocation:
            totalValue === 0
                ? 0
                : (holding.currentValue / totalValue) * 100,

    }));
}