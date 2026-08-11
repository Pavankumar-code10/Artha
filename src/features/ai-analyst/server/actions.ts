'use server';

import { auth } from '@clerk/nextjs/server';
import { PortfolioXRayService } from '@/features/portfolio-xray/services/xray.service';
import { AIAnalystService } from '../services/ai-analyst.service';
import { AIAnalysisResult } from '../types';

export async function generateAIAnalysis(): Promise<AIAnalysisResult> {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
        throw new Error('You must be signed in to generate an AI analysis.');
    }

    const xrayService = new PortfolioXRayService();
    const xrayData = await xrayService.generateXRayForClerkUser(clerkUserId);

    const aiService = new AIAnalystService();
    return await aiService.analyzeXRay(xrayData);
}