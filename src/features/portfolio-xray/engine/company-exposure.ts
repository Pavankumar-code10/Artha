import { NormalizedPosition, SecurityExposure, HiddenOverlap } from '../types/exposure';
import { MarketSecurity } from '../../market-data/types';

export function calculateCompanyExposures(
    positions: NormalizedPosition[],
    totalPortfolioValue: number,
    securitiesData: Map<string, MarketSecurity>
): { exposures: SecurityExposure[]; overlaps: HiddenOverlap[] } {
    const exposureMap = new Map<string, SecurityExposure>();

    for (const pos of positions) {
        const security = securitiesData.get(pos.securityId);
        if (!security) continue;

        const existing = exposureMap.get(pos.securityId);
        const sourceData = {
            type: pos.sourceType,
            name: pos.sourceName,
            value: pos.value,
            percentageContribution: (pos.value / totalPortfolioValue) * 100,
        };

        if (existing) {
            existing.totalValue += pos.value;
            existing.percentageOfPortfolio = (existing.totalValue / totalPortfolioValue) * 100;
            existing.sources.push(sourceData);
        } else {
            exposureMap.set(pos.securityId, {
                securityId: security.id,
                ticker: security.ticker,
                name: security.name,
                sector: security.sector,
                totalValue: pos.value,
                percentageOfPortfolio: (pos.value / totalPortfolioValue) * 100,
                sources: [sourceData],
            });
        }
    }

    const exposures = Array.from(exposureMap.values()).sort((a, b) => b.totalValue - a.totalValue);

    const overlaps: HiddenOverlap[] = exposures
        .filter(exp => exp.sources.length > 1)
        .map(exp => ({
            securityName: exp.name,
            ticker: exp.ticker,
            totalPercentage: exp.percentageOfPortfolio,
            fundCount: exp.sources.filter(s => s.type === 'FUND').length,
            heldDirectly: exp.sources.some(s => s.type === 'DIRECT'),
        }))
        .sort((a, b) => b.totalPercentage - a.totalPercentage);

    return { exposures, overlaps };
}