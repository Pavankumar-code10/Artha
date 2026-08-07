import { CompanyExposure } from "../types";

export interface MarketDataProvider {
    getFundConstituents(fundSymbol: string): Promise<CompanyExposure[]>;

}