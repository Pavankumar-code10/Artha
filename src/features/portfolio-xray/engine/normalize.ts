import { RawHolding, NormalizedPosition } from '../types/exposure';
import { MarketSecurity, MarketFund } from '../../market-data/types';

export function normalizeHoldings(
    holdings: RawHolding[],
    securitiesData: Map<string, MarketSecurity>,
    fundsData: Map<string, MarketFund>
): { normalizedPositions: NormalizedPosition[]; totalPortfolioValue: number } {
    const normalizedPositions: NormalizedPosition[] = [];
    let totalPortfolioValue = 0;

    for (const holding of holdings) {
        if (holding.type === 'DIRECT') {
            const security = securitiesData.get(holding.assetId);
            if (!security) continue;

            const value = holding.units * security.currentPrice;
            totalPortfolioValue += value;

            normalizedPositions.push({
                securityId: security.id,
                sourceType: 'DIRECT',
                sourceId: security.id,
                sourceName: 'Direct Holding',
                value,
            });
        } else if (holding.type === 'FUND') {
            const fund = fundsData.get(holding.assetId);
            if (!fund) continue;

            const fundValue = holding.units * fund.nav;
            totalPortfolioValue += fundValue;

            for (const constituent of fund.constituents) {
                const exposureValue = fundValue * (constituent.weightPercentage / 100);

                normalizedPositions.push({
                    securityId: constituent.securityId,
                    sourceType: 'FUND',
                    sourceId: fund.id,
                    sourceName: fund.name,
                    value: exposureValue,
                });
            }
        }
    }

    return { normalizedPositions, totalPortfolioValue };
}