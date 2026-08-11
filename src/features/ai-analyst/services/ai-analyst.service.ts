import { XRayResult } from '@/features/portfolio-xray/engine';
import { AIAnalysisResult } from '../types';
import { buildAnalystPrompt } from '../prompts/analyst-prompt';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIAnalystService {
    private genAI: GoogleGenerativeAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is not configured.');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    public async analyzeXRay(xrayData: XRayResult): Promise<AIAnalysisResult> {
        // FIX: Updated model string to the current production version (Gemini 3.5 Flash)
        const model = this.genAI.getGenerativeModel({
            model: 'gemini-3.5-flash',
            generationConfig: {
                responseMimeType: 'application/json',
            },
        });

        const prompt = buildAnalystPrompt(xrayData);
        const response = await model.generateContent(prompt);
        const text = response.response.text();

        try {
            const parsed = JSON.parse(text);
            return {
                ...parsed,
                generatedAt: new Date().toISOString(),
            };
        } catch (err) {
            console.error('[AI_PARSER_ERROR] Failed to parse Gemini response:', text);
            throw new Error('Failed to generate structured AI analysis.');
        }
    }
}