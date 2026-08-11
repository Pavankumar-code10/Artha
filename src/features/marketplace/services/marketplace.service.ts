// import { MarketplaceAsset, ScoredMarketplaceAsset } from '../types';
// import { PortfolioXRayService } from '@/features/portfolio-xray/services/xray.service';
// import { scoreAssetsForDiversification } from '../engine/scoring';

// const MOCK_ASSETS: MarketplaceAsset[] = [
//     {
//         id: 'MKT_REIT_01',
//         name: 'Embassy Office Parks REIT',
//         ticker: 'EMBASSY',
//         category: 'REIT',
//         sector: 'Real Estate',
//         expectedReturn: 7.5,
//         riskLevel: 'MEDIUM',
//         minInvestment: 15000,
//         description: 'India’s first publicly listed REIT, offering exposure to premium commercial real estate.'
//     },
//     {
//         id: 'MKT_SGB_01',
//         name: 'Sovereign Gold Bond 2026',
//         ticker: 'SGBAUG26',
//         category: 'SGB',
//         sector: 'Precious Metals',
//         expectedReturn: 2.5, // Fixed + Capital Appreciation
//         riskLevel: 'LOW',
//         minInvestment: 6500,
//         description: 'Government-backed gold bonds. Zero default risk with bi-annual interest payouts.'
//     },
//     {
//         id: 'MKT_BOND_01',
//         name: 'HDFC Tier II Corporate Bond',
//         ticker: 'HDFCBOND',
//         category: 'CORPORATE_BOND',
//         sector: 'Financials',
//         expectedReturn: 8.2,
//         riskLevel: 'LOW',
//         minInvestment: 100000,
//         description: 'High-grade corporate bonds issued by HDFC Bank.'
//     },
//     {
//         id: 'MKT_INVIT_01',
//         name: 'PowerGrid Infra InvIT',
//         ticker: 'PGINVIT',
//         category: 'INVIT',
//         sector: 'Infrastructure',
//         expectedReturn: 9.1,
//         riskLevel: 'MEDIUM',
//         minInvestment: 25000,
//         description: 'Infrastructure investment trust owning power transmission networks.'
//     }
// ];

// export class MarketplaceService {
//     public async getPersonalizedMarketplace(userId: string): Promise<ScoredMarketplaceAsset[]> {
//         const xrayService = new PortfolioXRayService();

//         // Get the user's exact portfolio mathematical state
//         const xrayResult = await xrayService.generateXRayForUser(userId);

//         // Score the marketplace assets against the user's X-Ray
//         return scoreAssetsForDiversification(MOCK_ASSETS, xrayResult);
//     }
// }


import { MarketplaceAsset, ScoredMarketplaceAsset } from '../types';
import { PortfolioXRayService } from '@/features/portfolio-xray/services/xray.service';
import { scoreAssetsForDiversification } from '../engine/scoring';

// Real-world Indian Alternative Assets
const MARKET_CATALOG: MarketplaceAsset[] = [
    {
        id: 'MKT_REIT_01', name: 'Embassy Office Parks REIT', ticker: 'EMBASSY', category: 'REIT', sector: 'Real Estate',
        expectedReturn: 7.2, riskLevel: 'MEDIUM', minInvestment: 15000,
        description: 'India’s first publicly listed REIT, offering exposure to premium commercial real estate across major IT hubs.'
    },
    {
        id: 'MKT_REIT_02', name: 'Mindspace Business Parks', ticker: 'MINDSPACE', category: 'REIT', sector: 'Real Estate',
        expectedReturn: 6.8, riskLevel: 'MEDIUM', minInvestment: 14500,
        description: 'Backed by K Raheja Corp, featuring Grade-A office spaces in Mumbai, Pune, Hyderabad, and Chennai.'
    },
    {
        id: 'MKT_REIT_03', name: 'Nexus Select Trust', ticker: 'NXST', category: 'REIT', sector: 'Real Estate',
        expectedReturn: 8.1, riskLevel: 'MEDIUM', minInvestment: 10000,
        description: 'India’s first retail REIT, managing 17 Grade-A urban consumption centers (malls) across 14 cities.'
    },
    {
        id: 'MKT_INVIT_01', name: 'India Grid Trust', ticker: 'INDIGRID', category: 'INVIT', sector: 'Infrastructure',
        expectedReturn: 10.5, riskLevel: 'MEDIUM', minInvestment: 25000,
        description: 'India’s first power sector InvIT. Owns 35 power transmission lines and 13 substations.'
    },
    {
        id: 'MKT_INVIT_02', name: 'IRB InvIT Fund', ticker: 'IRBINVIT', category: 'INVIT', sector: 'Infrastructure',
        expectedReturn: 9.8, riskLevel: 'HIGH', minInvestment: 30000,
        description: 'Owns, operates, and maintains a portfolio of toll-road assets across Indian national highways.'
    },
    {
        id: 'MKT_SGB_01', name: 'Sovereign Gold Bond (Series I)', ticker: 'SGB2425', category: 'SGB', sector: 'Precious Metals',
        expectedReturn: 2.5, riskLevel: 'LOW', minInvestment: 6500,
        description: 'RBI-issued bonds denominated in grams of gold. Offers 2.5% fixed interest + capital appreciation.'
    },
    {
        id: 'MKT_SGB_02', name: 'SGB Dec 2029 Tranche', ticker: 'SGBDEC29', category: 'SGB', sector: 'Precious Metals',
        expectedReturn: 2.5, riskLevel: 'LOW', minInvestment: 6800,
        description: 'Secondary market traded sovereign gold bond nearing its 5-year lock-in exit window.'
    },
    {
        id: 'MKT_BOND_01', name: 'SBI Tier II Infra Bond', ticker: 'SBIBOND29', category: 'CORPORATE_BOND', sector: 'Financials',
        expectedReturn: 7.4, riskLevel: 'LOW', minInvestment: 100000,
        description: 'AAA-rated infrastructure bonds issued by State Bank of India. Highly secure fixed income.'
    },
    {
        id: 'MKT_BOND_02', name: 'Tata Motors NCD', ticker: 'TATAMOTNCD', category: 'CORPORATE_BOND', sector: 'Consumer Discretionary',
        expectedReturn: 8.8, riskLevel: 'MEDIUM', minInvestment: 50000,
        description: 'Non-convertible debentures issued by Tata Motors. Higher yield for medium market risk.'
    }
];

export class MarketplaceService {
    /**
     * Simulates a live market feed by injecting micro-fluctuations into yields
     * and simulating network latency (vital for testing Suspense boundaries).
     */
    private async fetchLiveMarketData(): Promise<MarketplaceAsset[]> {
        // 1. Simulate network latency (800ms - 1500ms)
        const latency = Math.floor(Math.random() * 700) + 800;
        await new Promise(resolve => setTimeout(resolve, latency));

        // 2. Apply stochastic volatility to simulate live market pricing
        return MARKET_CATALOG.map(asset => {
            const volatility = (Math.random() * 0.4) - 0.2; // +/- 0.2% fluctuation
            return {
                ...asset,
                expectedReturn: Number((asset.expectedReturn + volatility).toFixed(2))
            };
        });
    }

    public async getPersonalizedMarketplace(clerkUserId: string): Promise<ScoredMarketplaceAsset[]> {
        const xrayService = new PortfolioXRayService();

        // Fetch live market data and user's X-Ray concurrently
        const [liveAssets, xrayResult] = await Promise.all([
            this.fetchLiveMarketData(),
            xrayService.generateXRayForClerkUser(clerkUserId),  // correct: resolves DB id via clerkId
        ]);

        // Score the live marketplace assets against the user's X-Ray mathematically
        return scoreAssetsForDiversification(liveAssets, xrayResult);
    }
}