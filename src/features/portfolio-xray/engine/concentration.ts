import { SecurityExposure } from '../types/exposure';

export interface ConcentrationScore {
    hhi: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    top10Weight: number;
}

export function calculateConcentration(exposures: SecurityExposure[]): ConcentrationScore {
    // HHI is the sum of the squares of the market shares of all constituents
    const hhi = exposures.reduce((sum, exp) => sum + Math.pow(exp.percentageOfPortfolio, 2), 0);

    // Calculate top 10 holding concentration
    const top10Weight = exposures
        .slice(0, 10)
        .reduce((sum, exp) => sum + exp.percentageOfPortfolio, 0);

    // Industry standard HHI thresholds
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (hhi > 2500 || top10Weight > 60) {
        riskLevel = 'HIGH';
    } else if (hhi > 1500 || top10Weight > 40) {
        riskLevel = 'MEDIUM';
    }

    return { hhi, riskLevel, top10Weight };
}