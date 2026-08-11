import { XRayResult } from '@/features/portfolio-xray/engine';
import { MarketplaceAsset, ScoredMarketplaceAsset } from '../types';

export function scoreAssetsForDiversification(
    assets: MarketplaceAsset[],
    xray: XRayResult
): ScoredMarketplaceAsset[] {
    // Extract user's current sector exposures
    const userSectors = new Map(
        xray.companyExposures.map(exp => [exp.sector, exp.percentageOfPortfolio])
    );

    return assets.map(asset => {
        let score = 100;
        let reason = '';

        const existingExposure = userSectors.get(asset.sector) || 0;

        if (existingExposure > 20) {
            // Heavily penalized if they already own too much of this sector
            score -= 60;
            reason = `Warning: You already have ${existingExposure.toFixed(1)}% exposure to ${asset.sector}.`;
        } else if (existingExposure > 0) {
            // Mildly penalized
            score -= 30;
            reason = `You have minor exposure to ${asset.sector}.`;
        } else {
            // Boosted for true diversification
            reason = `Excellent Diversification: You have 0% exposure to ${asset.sector}.`;
        }

        // Risk balancing: If portfolio HHI is high, prefer LOW/MEDIUM risk assets
        if (xray.concentrationScore.riskLevel === 'HIGH' && asset.riskLevel === 'HIGH') {
            score -= 20;
        }

        return {
            ...asset,
            diversificationScore: Math.max(0, Math.min(100, score)),
            matchReason: reason,
            isHighlyRecommended: score >= 80,
        };
    }).sort((a, b) => b.diversificationScore - a.diversificationScore);
}