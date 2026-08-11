export type AssetCategory = 'REIT' | 'INVIT' | 'SGB' | 'CORPORATE_BOND' | 'PEER_TO_PEER';

export interface MarketplaceAsset {
    id: string;
    name: string;
    ticker: string;
    category: AssetCategory;
    sector: string;
    expectedReturn: number; // Percentage
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    minInvestment: number;
    description: string;
}

export interface ScoredMarketplaceAsset extends MarketplaceAsset {
    diversificationScore: number; // 0 to 100
    matchReason: string;
    isHighlyRecommended: boolean;
}