export interface Bank {
    id: string;
    name: string;
    logo: string;
    color: string;
}

export interface ImportedHolding {
    symbol: string;
    assetName: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    investedValue: number;
    currentValue: number;
    assetType:
    | "STOCK"
    | "MUTUAL_FUND"
    | "ETF"
    | "BOND"
    | "REIT"
    | "INVIT"
    | "GOLD"
    | "CASH";
}

export interface ImportPortfolioPayload {
    bank: Bank;
    holdings: ImportedHolding[];
}