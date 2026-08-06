import { NormalizedHolding } from "../types";

export function calculateConcentration(
    holdings: NormalizedHolding[]
) {

    const largestHolding = Math.max(
        ...holdings.map((holding) => holding.allocation),
        0
    );

    return largestHolding;
}