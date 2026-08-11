export interface RawHolding {
    id: string;
    type: 'DIRECT' | 'FUND';
    assetId: string;
    units: number;
}

export interface NormalizedPosition {
    securityId: string;
    sourceType: 'DIRECT' | 'FUND';
    sourceId: string;
    sourceName: string;
    value: number;
}

export interface SecurityExposure {
    securityId: string;
    ticker: string;
    name: string;
    sector: string;
    totalValue: number;
    percentageOfPortfolio: number;
    sources: {
        type: 'DIRECT' | 'FUND';
        name: string;
        value: number;
        percentageContribution: number;
    }[];
}

export interface HiddenOverlap {
    securityName: string;
    ticker: string;
    totalPercentage: number;
    fundCount: number;
    heldDirectly: boolean;
}