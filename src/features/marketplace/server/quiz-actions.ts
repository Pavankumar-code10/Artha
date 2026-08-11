'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ScoredMarketplaceAsset } from '../types';

export interface DynamicQuiz {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
}

export async function generateAssetQuiz(asset: ScoredMarketplaceAsset): Promise<DynamicQuiz> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured.');
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-3.6-flash',
            generationConfig: {
                responseMimeType: 'application/json',
            },
        });

        const prompt = `
    You are a SEBI-registered financial compliance educator. 
    Generate a single, multiple-choice question to test a retail investor's understanding of the risks, regulatory structure, or return mechanism of the following specific asset:
    
    Asset Name: ${asset.name}
    Asset Category: ${asset.category} (e.g., REIT, InvIT, SGB, Corporate Bond)
    Sector: ${asset.sector}
    
    The question should be highly educational, objective, and focus on investor protection or market realities specific to this asset type in India. 
    Provide 3 or 4 options. Only ONE option must be entirely correct.
    
    Return STRICTLY valid JSON with this exact schema:
    {
      "question": "The question text",
      "options": ["Option 1", "Option 2", "Option 3"],
      "answerIndex": 0, // The integer array index of the correct option
      "explanation": "A 1-2 sentence explanation of why the answer is correct according to SEBI/market principles."
    }
    `;

        const response = await model.generateContent(prompt);
        const text = response.response.text();
        return JSON.parse(text) as DynamicQuiz;

    } catch (error) {
        console.error('[AI_QUIZ_ERROR] Failed to generate dynamic quiz:', error);
        // Bulletproof Fallback: Never block the user from transacting if the AI API times out
        return {
            question: `As an investor in a ${asset.category} like ${asset.name}, what is the primary risk consideration?`,
            options: [
                "Returns are absolutely guaranteed by SEBI.",
                "It carries inherent market and liquidity risks.",
                "There is no lock-in period or price volatility."
            ],
            answerIndex: 1,
            explanation: "All market-linked alternative assets carry inherent market and liquidity risks. SEBI mandates strict disclosure of these risks, but does not guarantee returns."
        };
    }
}