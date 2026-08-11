export interface AIAnalysisRecommendation {
    title: string;
    category: 'REBALANCING' | 'OVERLAP_REDUCTION' | 'SECTOR_DIVERSIFICATION';
    impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    explanation: string;
    actionableStep: string;
}

export interface AIAnalysisResult {
    executiveSummary: string;
    overlapAnalysis: string;
    riskExplanation: string;
    recommendations: AIAnalysisRecommendation[];
    generatedAt: string;
}