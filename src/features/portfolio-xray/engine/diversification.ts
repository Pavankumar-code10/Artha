import { NormalizedHolding } from "../types";

export function calculateDiversification(
    holdings: NormalizedHolding[]
) {

    if (holdings.length === 0) {
        return 0;
    }

    const hhi = holdings.reduce(
        (sum, holding) =>
            sum + Math.pow(holding.allocation / 100, 2),
        0
    );

    const normalizedHHI =
        (hhi - 1 / holdings.length) /
        (1 - 1 / holdings.length);

    return Math.round(
        (1 - normalizedHHI) * 100
    );
}