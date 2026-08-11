import { IMarketDataProvider, MarketFund, MarketSecurity } from '../types';

export class MockMarketDataProvider implements IMarketDataProvider {
    // Simulating a database/API latency
    private delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    public async getSecurities(ids: string[]): Promise<Map<string, MarketSecurity>> {
        await this.delay(100);
        const mockDb: Record<string, MarketSecurity> = {
            'RELIANCE': { id: 'RELIANCE', ticker: 'RELIANCE', name: 'Reliance Industries Ltd.', sector: 'Energy', currentPrice: 2940.75 },
            'HDFCBANK': { id: 'HDFCBANK', ticker: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Financials', currentPrice: 1512.80 },
            'INFY': { id: 'INFY', ticker: 'INFY', name: 'Infosys Ltd', sector: 'Technology', currentPrice: 1748.50 },
            'SGB2025': { id: 'SGB2025', ticker: 'SGB2025', name: 'Sovereign Gold Bond 2025', sector: 'Precious Metals', currentPrice: 6210.50 },
            'EMBASSY': { id: 'EMBASSY', ticker: 'EMBASSY', name: 'Embassy Office Parks REIT', sector: 'Real Estate', currentPrice: 362.40 },
            'MINDSPACE': { id: 'MINDSPACE', ticker: 'MINDSPACE', name: 'Mindspace Business Parks', sector: 'Real Estate', currentPrice: 350.00 },
            'NXST': { id: 'NXST', ticker: 'NXST', name: 'Nexus Select Trust', sector: 'Real Estate', currentPrice: 140.00 },
            'INDIGRID': { id: 'INDIGRID', ticker: 'INDIGRID', name: 'India Grid Trust', sector: 'Infrastructure', currentPrice: 135.00 },
            'IRBINVIT': { id: 'IRBINVIT', ticker: 'IRBINVIT', name: 'IRB InvIT Fund', sector: 'Infrastructure', currentPrice: 70.00 },
            'SGB2425': { id: 'SGB2425', ticker: 'SGB2425', name: 'Sovereign Gold Bond', sector: 'Precious Metals', currentPrice: 6300.00 },
            'SGBDEC29': { id: 'SGBDEC29', ticker: 'SGBDEC29', name: 'SGB Dec 2029', sector: 'Precious Metals', currentPrice: 6350.00 },
            'SBIBOND29': { id: 'SBIBOND29', ticker: 'SBIBOND29', name: 'SBI Tier II Infra Bond', sector: 'Financials', currentPrice: 10000.00 },
            'TATAMOTNCD': { id: 'TATAMOTNCD', ticker: 'TATAMOTNCD', name: 'Tata Motors NCD', sector: 'Consumer Discretionary', currentPrice: 1000.00 },
            'SEC_RELIANCE': { id: 'SEC_RELIANCE', ticker: 'RELIANCE', name: 'Reliance Industries Ltd.', sector: 'Energy', currentPrice: 2950.50 },
            'SEC_HDFC': { id: 'SEC_HDFC', ticker: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Financials', currentPrice: 1450.75 },
            'SEC_TCS': { id: 'SEC_TCS', ticker: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology', currentPrice: 3890.00 },
            'SEC_ITC': { id: 'SEC_ITC', ticker: 'ITC', name: 'ITC Ltd.', sector: 'Consumer Staples', currentPrice: 420.25 },
        };

        const result = new Map<string, MarketSecurity>();
        ids.forEach(id => {
            if (mockDb[id]) result.set(id, mockDb[id]);
        });
        return result;
    }

    public async getFunds(ids: string[]): Promise<Map<string, MarketFund>> {
        await this.delay(150);
        const mockDb: Record<string, MarketFund> = {
            'MIRAELC': {
                id: 'MIRAELC',
                ticker: 'MIRAELC',
                name: 'Mirae Asset Large Cap Fund',
                nav: 107.20,
                constituents: [
                    { securityId: 'HDFCBANK', weightPercentage: 9.5 },
                    { securityId: 'RELIANCE', weightPercentage: 8.2 },
                ]
            },
            'BBNDETF': {
                id: 'BBNDETF',
                ticker: 'BBNDETF',
                name: 'Bharat Bond ETF',
                nav: 1125.60,
                constituents: [
                    { securityId: 'SBIBOND29', weightPercentage: 100.0 },
                ]
            },
            'FUND_NIFTYETF': {
                id: 'FUND_NIFTYETF',
                ticker: 'NIFTYBEES',
                name: 'Nippon India Nifty 50 BeES ETF',
                nav: 245.50,
                constituents: [
                    { securityId: 'SEC_HDFC', weightPercentage: 11.5 },
                    { securityId: 'SEC_RELIANCE', weightPercentage: 9.8 },
                    { securityId: 'SEC_TCS', weightPercentage: 4.2 },
                    { securityId: 'SEC_ITC', weightPercentage: 2.8 },
                ]
            },
            'FUND_PPFAS': {
                id: 'FUND_PPFAS',
                ticker: 'PPFAS',
                name: 'Parag Parikh Flexi Cap Fund',
                nav: 72.80,
                constituents: [
                    { securityId: 'SEC_HDFC', weightPercentage: 7.5 },
                    { securityId: 'SEC_ITC', weightPercentage: 5.2 },
                    { securityId: 'SEC_RELIANCE', weightPercentage: 4.1 },
                ]
            }
        };

        const result = new Map<string, MarketFund>();
        ids.forEach(id => {
            if (mockDb[id]) result.set(id, mockDb[id]);
        });
        return result;
    }
}