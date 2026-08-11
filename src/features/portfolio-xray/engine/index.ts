import { RawHolding, SecurityExposure, HiddenOverlap } from '../types/exposure';
import { MarketSecurity, MarketFund } from '../../market-data/types';
import { normalizeHoldings } from './normalize';
import { calculateCompanyExposures } from './company-exposure';
import { calculateConcentration, ConcentrationScore } from './concentration';

export interface XRayResult {
    totalPortfolioValue: number;
    companyExposures: SecurityExposure[];
    hiddenOverlaps: HiddenOverlap[];
    concentrationScore: ConcentrationScore;
}

export class PortfolioXRayEngine {
    public analyze(
        holdings: RawHolding[],
        securitiesData: Map<string, MarketSecurity>,
        fundsData: Map<string, MarketFund>
    ): XRayResult {
        // 1. Flatten the portfolio hierarchy
        const { normalizedPositions, totalPortfolioValue } = normalizeHoldings(
            holdings,
            securitiesData,
            fundsData
        );

        // 2. Aggregate true exposures and detect overlaps
        const { exposures, overlaps } = calculateCompanyExposures(
            normalizedPositions,
            totalPortfolioValue,
            securitiesData
        );

        // 3. Compute risk mathematics
        const concentrationScore = calculateConcentration(exposures);

        return {
            totalPortfolioValue,
            companyExposures: exposures,
            hiddenOverlaps: overlaps,
            concentrationScore,
        };
    }
}