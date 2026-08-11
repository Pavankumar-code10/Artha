// Plain data file — no "use server" directive.
// This file is safe to import from both client and server components.

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface ModuleDef {
    id: string;
    title: string;
    description: string;
    difficulty: Difficulty;
    xpReward: number;
    prerequisiteId: string | null;
}

export interface DynamicLesson {
    conceptExplanation: string;
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
}

export const ACADEMY_MODULES: ModuleDef[] = [
    { id: 'MOD_BASICS', title: 'Market Fundamentals', description: 'Understand equities, bonds, and market cycles.', difficulty: 'BEGINNER', xpReward: 100, prerequisiteId: null },
    { id: 'MOD_DIVERSIFY', title: 'Asset Allocation', description: 'Learn why putting all eggs in one basket is fatal.', difficulty: 'BEGINNER', xpReward: 150, prerequisiteId: 'MOD_BASICS' },
    { id: 'MOD_ALTS', title: 'Alternative Assets', description: 'Deep dive into REITs, InvITs, and SGBs.', difficulty: 'INTERMEDIATE', xpReward: 200, prerequisiteId: 'MOD_DIVERSIFY' },
    { id: 'MOD_RISK_HHI', title: 'Advanced Risk & HHI', description: 'Master the Herfindahl-Hirschman Index for portfolios.', difficulty: 'ADVANCED', xpReward: 300, prerequisiteId: 'MOD_ALTS' },
];
