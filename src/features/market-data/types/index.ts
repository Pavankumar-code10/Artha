export interface CompanyExposure {
    symbol: string;
    name: string;
    sector: string;
    weight: number;
}

export interface MarketSecurity {
    id: string;
    ticker: string;
    name: string;
    sector: string;
    currentPrice: number;
}

export interface FundConstituent {
    securityId: string;
    weightPercentage: number;
}

export interface MarketFund {
    id: string;
    ticker: string;
    name: string;
    nav: number;
    constituents: FundConstituent[];
}

export interface IMarketDataProvider {
    getSecurities(ids: string[]): Promise<Map<string, MarketSecurity>>;
    getFunds(ids: string[]): Promise<Map<string, MarketFund>>;
}