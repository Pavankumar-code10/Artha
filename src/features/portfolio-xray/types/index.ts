import { RiskLevel } from "@prisma/client";

export interface NormalizedHolding {
    symbol: string;
    name: string;
    type: string;

    quantity: number;

    investedValue: number;

    currentValue: number;

    allocation: number;
}

export interface PortfolioXRayResult {

    totalValue: number;

    diversificationScore: number;

    concentrationScore: number;

    overlapScore: number;

    risk: RiskLevel;

    topHoldings: NormalizedHolding[];
}