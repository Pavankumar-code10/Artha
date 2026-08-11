'use server';

import { auth } from '@clerk/nextjs/server';
import { PortfolioXRayService } from '../services/xray.service';
import { XRayResult } from '../engine';

export async function getPortfolioXRay(): Promise<XRayResult> {
    const { userId: clerkUserId } = await auth();

    // Market-ready: unauthenticated users get a clear error, not a fake fallback
    if (!clerkUserId) {
        throw new Error('You must be signed in to view your Portfolio X-Ray.');
    }

    const xrayService = new PortfolioXRayService();

    // Use the corrected method that resolves DB user via clerkId
    return xrayService.generateXRayForClerkUser(clerkUserId);
}