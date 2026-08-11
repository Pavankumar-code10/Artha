export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface ModuleDef {
    id: string;
    title: string;
    description: string;
    difficulty: Difficulty;
    xpReward: number;
    prerequisiteId: string | null;
    icon: string;
    color: string;
}

// ── Game Question Types ──────────────────────────────────────────────────────

export interface MCQQuestion {
    type: 'MCQ';
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
}

export interface BubblePair {
    term: string;
    definition: string;
}

export interface BubbleConnectQuestion {
    type: 'BUBBLE_CONNECT';
    instruction: string;
    pairs: BubblePair[];
    explanation: string;
}

export interface TrueFalseQuestion {
    type: 'TRUE_FALSE';
    statement: string;
    answer: boolean;
    explanation: string;
}

export interface FillBlankQuestion {
    type: 'FILL_BLANK';
    template: string;   // uses _____ as the blank placeholder
    answer: string;     // 1–3 word exact answer
    hint: string;       // e.g. "Starts with S (4 letters)"
    explanation: string;
}

export type GameQuestion =
    | MCQQuestion
    | BubbleConnectQuestion
    | TrueFalseQuestion
    | FillBlankQuestion;

export interface LessonPack {
    conceptExplanation: string;
    questions: GameQuestion[];   // always 4: MCQ, BUBBLE_CONNECT, TRUE_FALSE, FILL_BLANK
}

// Legacy single-lesson type (kept for fallback)
export interface DynamicLesson {
    conceptExplanation: string;
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
}

// ── Academy Modules ──────────────────────────────────────────────────────────

export const ACADEMY_MODULES: ModuleDef[] = [
    {
        id: 'MOD_BASICS',
        title: 'Market Fundamentals',
        description: 'Understand equities, bonds, and how NSE & BSE market cycles drive wealth creation.',
        difficulty: 'BEGINNER',
        xpReward: 100,
        prerequisiteId: null,
        icon: '📈',
        color: 'from-blue-600 to-cyan-500',
    },
    {
        id: 'MOD_DIVERSIFY',
        title: 'Asset Allocation',
        description: 'Master why diversification across asset classes is the foundation of resilient portfolios.',
        difficulty: 'BEGINNER',
        xpReward: 150,
        prerequisiteId: 'MOD_BASICS',
        icon: '🧩',
        color: 'from-violet-600 to-purple-500',
    },
    {
        id: 'MOD_SEBI',
        title: 'SEBI Regulations',
        description: "Navigate India's regulatory landscape — SEBI circulars, investor rights, and grievance mechanisms.",
        difficulty: 'INTERMEDIATE',
        xpReward: 200,
        prerequisiteId: 'MOD_DIVERSIFY',
        icon: '⚖️',
        color: 'from-amber-600 to-yellow-500',
    },
    {
        id: 'MOD_ALTS',
        title: 'Alternative Assets',
        description: "Deep dive into REITs, InvITs, SGBs, and MLDs — India's emerging alternative investment universe.",
        difficulty: 'INTERMEDIATE',
        xpReward: 200,
        prerequisiteId: 'MOD_SEBI',
        icon: '🏗️',
        color: 'from-emerald-600 to-teal-500',
    },
    {
        id: 'MOD_DERIVATIVES',
        title: 'Futures & Options',
        description: 'Demystify F&O contracts on NSE — hedging strategies, Greeks, and risk management frameworks.',
        difficulty: 'ADVANCED',
        xpReward: 300,
        prerequisiteId: 'MOD_ALTS',
        icon: '🎯',
        color: 'from-orange-600 to-red-500',
    },
    {
        id: 'MOD_RISK_HHI',
        title: 'Advanced Risk & HHI',
        description: 'Master the Herfindahl-Hirschman Index, VaR, and concentration risk in Indian portfolios.',
        difficulty: 'EXPERT',
        xpReward: 400,
        prerequisiteId: 'MOD_DERIVATIVES',
        icon: '🧠',
        color: 'from-rose-600 to-pink-500',
    },
];

// ── Rank System ──────────────────────────────────────────────────────────────

export const RANK_TIERS = [
    { name: 'Novice Investor',    minXp: 0,    color: '#6b7280', icon: '🌱' },
    { name: 'Market Apprentice',  minXp: 150,  color: '#3b82f6', icon: '📚' },
    { name: 'Astute Allocator',   minXp: 300,  color: '#8b5cf6', icon: '⚡' },
    { name: 'Risk Manager',       minXp: 500,  color: '#f59e0b', icon: '🛡️' },
    { name: 'Market Master',      minXp: 750,  color: '#10b981', icon: '🏆' },
    { name: 'SEBI Elite',         minXp: 1000, color: '#f43f5e', icon: '👑' },
];

export function getRankForXp(xp: number) {
    let rank = RANK_TIERS[0];
    for (const tier of RANK_TIERS) {
        if (xp >= tier.minXp) rank = tier;
    }
    return rank;
}

export function getNextRank(xp: number) {
    for (const tier of RANK_TIERS) {
        if (xp < tier.minXp) return tier;
    }
    return null;
}