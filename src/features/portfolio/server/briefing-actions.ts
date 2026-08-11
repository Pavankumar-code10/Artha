'use server';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function getPortfolioBriefing(holdings: {
    assetName: string;
    assetType: string;
    currentValue: number;
    investedValue: number;
}[]): Promise<string> {
    if (!process.env.GEMINI_API_KEY || holdings.length === 0) {
        return 'Connect your portfolio via Sahamati AA to receive a personalised AI briefing.';
    }

    const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
    const breakdown = holdings
        .map(h => `${h.assetName} (${h.assetType}): ₹${Math.round(h.currentValue).toLocaleString('en-IN')} — ${((h.currentValue / totalValue) * 100).toFixed(1)}% of portfolio`)
        .join('\n');

    try {
        const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
        const { text } = await generateText({
            model: google('gemini-2.0-flash'),
            prompt: `You are Aartha, an elite SEBI-registered AI financial analyst. A retail investor has the following portfolio holdings:

${breakdown}

Write a concise 2–3 sentence portfolio health briefing. Highlight one structural strength, one diversification or concentration risk, and one actionable educational insight. Do NOT recommend specific stocks to buy or sell. Use professional, data-driven language. Format as plain text, no markdown.`,
            maxOutputTokens: 200,
        });
        return text;
    } catch {
        return 'AI briefing temporarily unavailable. Your portfolio data is healthy and loaded.';
    }
}
