import { XRayResult } from '@/features/portfolio-xray/engine';

export function buildAnalystPrompt(xrayData: XRayResult): string {
    return `
You are a Staff Financial Analyst and SEBI-registered Portfolio Intelligence Specialist working for Aartha.
Analyze the following unrolled Portfolio X-Ray dataset and provide structured, objective financial intelligence.

=== PORTFOLIO X-RAY DATA ===
Total Portfolio Value: ₹${xrayData.totalPortfolioValue.toLocaleString('en-IN')}
Concentration HHI Score: ${Math.round(xrayData.concentrationScore.hhi)} (${xrayData.concentrationScore.riskLevel} RISK)

Top Company Exposures (True Weight Unrolled Across Direct Shares + Funds):
${xrayData.companyExposures.slice(0, 5).map(c => `- ${c.name} (${c.ticker}): ${c.percentageOfPortfolio.toFixed(2)}% | Sources: ${c.sources.map(s => s.name).join(', ')}`).join('\n')}

Detected Hidden Overlaps:
${xrayData.hiddenOverlaps.map(o => `- ${o.securityName} (${o.ticker}): Total ${o.totalPercentage.toFixed(2)}% (Held via ${o.heldDirectly ? 'Direct Stock + ' : ''}${o.fundCount} Mutual Funds/ETFs)`).join('\n')}

=== INSTRUCTIONS ===
Provide your response strictly in structured JSON format with the following keys:
1. "executiveSummary": A concise 2-3 sentence high-level narrative of what the user actually owns.
2. "overlapAnalysis": An explanation of their hidden overlap hazards (specifically referencing direct vs fund overlaps).
3. "riskExplanation": An explanation of their HHI concentration risk score and top asset weights.
4. "recommendations": An array of 2-3 structured objects, each containing:
   - "title": Short action title
   - "category": One of "REBALANCING", "OVERLAP_REDUCTION", "SECTOR_DIVERSIFICATION"
   - "impactLevel": "HIGH", "MEDIUM", or "LOW"
   - "explanation": Why this issue matters mathematically
   - "actionableStep": Specific step to resolve the risk

DO NOT include markdown code fences around the JSON. Return raw valid JSON only.
`;
}