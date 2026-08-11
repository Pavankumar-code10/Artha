import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return new Response(
                JSON.stringify({ error: 'GEMINI_API_KEY is not configured.' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const google = createGoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const result = streamText({
            model: google('gemini-3.6-flash'),
            system: 'You are Aartha, an elite SEBI-registered AI financial assistant. Your goal is to educate the user on portfolio diversification, risk management (like HHI scores), and Indian market concepts (REITs, InvITs, SGBs). Keep answers concise, highly professional, and format with Markdown. Never provide direct stock-picking advice; strictly focus on financial education and risk analysis.',
            messages, // Passing messages directly without the converter function
        });

        return result.toTextStreamResponse();

    } catch (error) {
        console.error('[CHAT_API_ERROR]', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error processing chat' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}