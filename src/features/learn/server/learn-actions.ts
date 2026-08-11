'use server';

import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LessonPack, GameQuestion } from '../constants';

// ── Auth Helper ──────────────────────────────────────────────────────────────

async function getResolvedUserId(): Promise<string | null> {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) return null;

    let dbUser = await prisma.user.findUnique({ where: { clerkId: clerkUserId } });
    if (!dbUser) {
        const user = await currentUser();
        dbUser = await prisma.user.create({
            data: {
                id: clerkUserId,
                clerkId: clerkUserId,
                email: user?.emailAddresses[0]?.emailAddress || `${clerkUserId}@aartha.fin`,
                firstName: user?.firstName || 'Retail',
                lastName: user?.lastName || 'Investor',
            },
        });
    }
    return dbUser.id;
}

// ── Progress Actions ─────────────────────────────────────────────────────────

export async function getUserProgress() {
    const userId = await getResolvedUserId();
    if (!userId) return { completedModuleIds: [], totalXp: 0, rank: 'Guest', isAuthenticated: false };

    const progress = await prisma.learningProgress.findMany({ where: { userId } });
    const completedModuleIds = progress.map(p => p.module);
    const totalXp = progress.reduce((sum, p) => sum + (p.score || 0), 0);

    let rank = 'Novice Investor';
    if (totalXp >= 150) rank = 'Market Apprentice';
    if (totalXp >= 300) rank = 'Astute Allocator';
    if (totalXp >= 500) rank = 'Risk Manager';
    if (totalXp >= 750) rank = 'Market Master';
    if (totalXp >= 1000) rank = 'SEBI Elite';

    return { completedModuleIds, totalXp, rank, isAuthenticated: true };
}

export async function completeAcademyModule(moduleId: string, xpReward: number) {
    const userId = await getResolvedUserId();
    if (!userId) throw new Error('You must be signed in to save progress.');

    const existing = await prisma.learningProgress.findFirst({ where: { userId, module: moduleId } });
    if (!existing) {
        await prisma.learningProgress.create({
            data: { userId, module: moduleId, completed: true, score: xpReward },
        });
    }
}

// ── AI Lesson Pack Generation ────────────────────────────────────────────────

const FALLBACK_PACK = (topic: string): LessonPack => ({
    conceptExplanation: `In Indian financial markets, ${topic} is regulated under SEBI's Investor Protection Framework. Understanding it enables retail investors to navigate NSE and BSE with confidence, managing both systemic and unsystematic risk. This knowledge directly impacts long-term wealth creation and capital preservation.`,
    questions: [
        {
            type: 'MCQ',
            question: `Which regulatory body oversees ${topic} in India?`,
            options: ['Reserve Bank of India (RBI)', 'Securities and Exchange Board of India (SEBI)', 'IRDAI', 'Ministry of Finance'],
            answerIndex: 1,
            explanation: 'SEBI is the apex regulator for securities markets in India, overseeing stock exchanges, mutual funds, and investor protection.',
        },
        {
            type: 'BUBBLE_CONNECT',
            instruction: 'Match each term to its definition',
            pairs: [
                { term: 'NSE', definition: 'National Stock Exchange of India' },
                { term: 'BSE', definition: 'Bombay Stock Exchange' },
                { term: 'SEBI', definition: 'Market regulator of India' },
                { term: 'NAV', definition: 'Net Asset Value of a fund' },
            ],
            explanation: 'These are foundational acronyms every Indian investor must know when navigating the markets.',
        },
        {
            type: 'TRUE_FALSE',
            statement: `SEBI was established in 1992 as a statutory body to regulate Indian securities markets.`,
            answer: true,
            explanation: 'SEBI was given statutory powers through the SEBI Act, 1992, replacing the earlier non-statutory body formed in 1988.',
        },
        {
            type: 'FILL_BLANK',
            template: `The _____ Act of 1992 empowered SEBI to regulate the Indian securities market.`,
            answer: 'SEBI',
            hint: 'The act is named after the regulator itself (4 letters)',
            explanation: 'The SEBI Act, 1992 is the primary legislation that gives SEBI statutory authority to regulate and develop the securities market.',
        },
    ] as GameQuestion[],
});

// Replace ONLY the generateLessonPack function in learn-actions.ts

export async function generateLessonPack(topic: string, difficulty: string, clientSeed: number): Promise<LessonPack> {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('GEMINI_API_KEY missing.');

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-3.6-flash',
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.9, // 🔥 CRITICAL: Forces Gemini to be highly creative and diverse
            },
        });

        const prompt = `
You are an elite SEBI-certified financial educator. Generate a multi-game lesson pack for Indian retail investors.
CRITICAL INSTRUCTION: This must be COMPLETELY UNIQUE. Do not repeat standard textbook examples. Invent new scenarios involving fictional Indian retail investors (e.g., Arjun, Priya, Rahul) making market decisions.

Topic: "${topic}"
Difficulty: ${difficulty}
Randomization Seed: ${clientSeed}-${Date.now()}

Return ONLY valid JSON matching EXACTLY this structure:
{
  "conceptExplanation": "3-sentence explanation using a unique real-world Indian market scenario or analogy.",
  "questions": [
    {
      "type": "MCQ",
      "question": "A practical, scenario-based question about ${topic} involving a fictional Indian investor making a decision.",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 1,
      "explanation": "Detailed explanation of the correct answer"
    },
    {
      "type": "BUBBLE_CONNECT",
      "instruction": "Match each term to its definition",
      "pairs": [
        { "term": "TERM_1", "definition": "Brief 4-6 word definition" },
        { "term": "TERM_2", "definition": "Brief 4-6 word definition" },
        { "term": "TERM_3", "definition": "Brief 4-6 word definition" },
        { "term": "TERM_4", "definition": "Brief 4-6 word definition" }
      ],
      "explanation": "Why knowing these specific terms matters for this topic"
    },
    {
      "type": "TRUE_FALSE",
      "statement": "A counter-intuitive or myth-busting factual statement about ${topic} that is definitively true or false",
      "answer": true,
      "explanation": "Explanation of why the statement is true or false"
    },
    {
      "type": "FILL_BLANK",
      "template": "A unique sentence with exactly one _____ placeholder about ${topic}.",
      "answer": "1 to 3 word answer",
      "hint": "First letter and length hint",
      "explanation": "Why this is the correct answer"
    }
  ]
}

RULES:
- BUBBLE_CONNECT terms must be short (2-5 chars, prefer acronyms like SIP, NAV, BSE)
- BUBBLE_CONNECT definitions must be 4-7 words max
- FILL_BLANK answer must be 1-3 words only
- answerIndex must be 0, 1, 2, or 3
- Exactly 4 questions in order: MCQ, BUBBLE_CONNECT, TRUE_FALSE, FILL_BLANK
`;

        const response = await model.generateContent(prompt);
        const raw = response.response.text().trim()
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();

        const parsed = JSON.parse(raw) as LessonPack;

        // Validate structure
        if (!parsed.conceptExplanation || !Array.isArray(parsed.questions) || parsed.questions.length < 4) {
            throw new Error('Invalid lesson pack structure from AI');
        }

        return parsed;
    } catch (e) {
        console.error('[AI_LESSON_PACK_ERROR]', e);
        return FALLBACK_PACK(topic);
    }
}

