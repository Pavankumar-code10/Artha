import { RiskLevel } from "@prisma/client";

export function calculateRisk(
    diversification: number,
    concentration: number
): RiskLevel {

    if (diversification >= 75 && concentration <= 20) {
        return RiskLevel.LOW;
    }

    if (diversification >= 50 && concentration <= 35) {
        return RiskLevel.MEDIUM;
    }

    return RiskLevel.HIGH;
}