import { prisma } from '@/lib/prisma';
import { PortfolioXRayEngine, XRayResult } from '../engine';
import { RawHolding } from '../types/exposure';
import { MockMarketDataProvider } from '../../market-data/providers/mock-provider';

export class PortfolioXRayService {
    private engine: PortfolioXRayEngine;
    private marketDataProvider: MockMarketDataProvider;

    constructor() {
        this.engine = new PortfolioXRayEngine();
        this.marketDataProvider = new MockMarketDataProvider();
    }

    /**
     * Accepts the Clerk user ID (clerkId), resolves the internal DB user,
     * then fetches the portfolio using the correct cuid-based `id`.
     * This prevents the id ≠ clerkUserId mismatch.
     */
    public async generateXRayForClerkUser(clerkUserId: string): Promise<XRayResult> {
        // 1. Resolve internal DB user from Clerk ID
        const dbUser = await prisma.user.findFirst({
            where: { clerkId: clerkUserId },
            select: { id: true },
        });

        if (!dbUser) {
            throw new Error('User not found in database. Please connect your portfolio first.');
        }

        // 2. Fetch portfolio using the correct internal DB user id
        const portfolio = await prisma.portfolio.findFirst({
            where: { userId: dbUser.id },
            include: { holdings: true },
        });

        if (!portfolio || portfolio.holdings.length === 0) {
            throw new Error('No portfolio holdings found. Please sync your account first.');
        }

        // 3. Map DB Holdings to Engine-compatible RawHoldings
        const rawHoldings: RawHolding[] = portfolio.holdings.map((h) => ({
            id: h.id,
            type: (h.assetType === 'MUTUAL_FUND' || h.assetType === 'ETF') ? 'FUND' : 'DIRECT',
            assetId: h.symbol || h.fundId || '',
            units: h.quantity,
        }));

        // 4. Extract Asset IDs for market data fetch
        const directSecurityIds = rawHoldings
            .filter(h => h.type === 'DIRECT')
            .map(h => h.assetId);

        const fundIds = rawHoldings
            .filter(h => h.type === 'FUND')
            .map(h => h.assetId);

        // 5. Fetch Market Data
        const fundsData = await this.marketDataProvider.getFunds(fundIds);

        const underlyingSecurityIds = Array.from(fundsData.values()).flatMap(f =>
            f.constituents.map(c => c.securityId)
        );

        const allSecurityIds = [...new Set([...directSecurityIds, ...underlyingSecurityIds])];
        const securitiesData = await this.marketDataProvider.getSecurities(allSecurityIds);

        // 6. Execute Pure Engine Analysis
        return this.engine.analyze(rawHoldings, securitiesData, fundsData);
    }
}