'use server';

import { auth } from '@clerk/nextjs/server';
import { MarketplaceService } from '../services/marketplace.service';
import { ScoredMarketplaceAsset } from '../types';

export async function getMarketplaceAssets(): Promise<ScoredMarketplaceAsset[]> {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
        throw new Error('You must be signed in to view the marketplace.');
    }

    const service = new MarketplaceService();

    try {
        return await service.getPersonalizedMarketplace(clerkUserId);
    } catch (error) {
        // If user has no portfolio yet, return un-personalized asset list
        console.warn('[MARKETPLACE] No portfolio found, returning generic catalogue:', error);
        return service.getPersonalizedMarketplace(clerkUserId).catch(() => {
            throw new Error('Failed to load marketplace. Please sync your portfolio first.');
        });
    }
}