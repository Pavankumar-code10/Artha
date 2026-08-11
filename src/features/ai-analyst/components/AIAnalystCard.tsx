'use client';

import { useEffect, useState } from 'react';
import { generateAIAnalysis } from '../server/actions';
import { AIAnalysisResult } from '../types';
import { Sparkles, BrainCircuit, ArrowUpRight, ShieldCheck, AlertCircle } from 'lucide-react';

export function AIAnalystCard() {
    const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        generateAIAnalysis()
            .then(setAnalysis)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="p-6 bg-zinc-950 border border-purple-900/30 rounded-xl animate-pulse space-y-4">
                <div className="flex items-center gap-2 text-purple-400">
                    <Sparkles className="animate-spin" size={18} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Gemini AI Engine Analyzing X-Ray Data...</span>
                </div>
                <div className="h-4 bg-zinc-800/60 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800/40 rounded w-1/2"></div>
            </div>
        );
    }

    if (error || !analysis) {
        return (
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-500">
                AI Analysis offline. Configure GEMINI_API_KEY in environment variables.
            </div>
        );
    }

    return (
        <div className="bg-zinc-950 border border-purple-900/40 rounded-xl p-6 space-y-6 shadow-lg shadow-purple-950/10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                <div className="flex items-center gap-2 text-purple-400">
                    <BrainCircuit size={20} />
                    <h2 className="text-base font-semibold text-zinc-100">AI Intelligence Summary</h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-800/50">
                    POWERED BY GEMINI
                </span>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Executive Overview</h3>
                <p className="text-sm text-zinc-200 leading-relaxed font-sans">{analysis.executiveSummary}</p>
            </div>

            {/* Risk & Overlap Narrative Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-semibold">
                        <AlertCircle size={14} />
                        <span>Overlap Risk Narrative</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-normal">{analysis.overlapAnalysis}</p>
                </div>

                <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
                        <ShieldCheck size={14} />
                        <span>Concentration & Volatility</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-normal">{analysis.riskExplanation}</p>
                </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Strategic Recommendations</h3>
                <div className="grid grid-cols-1 gap-3">
                    {analysis.recommendations.map((rec, i) => (
                        <div key={i} className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${rec.impactLevel === 'HIGH' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                        }`}>
                                        {rec.impactLevel} IMPACT
                                    </span>
                                    <h4 className="text-sm font-medium text-zinc-200">{rec.title}</h4>
                                </div>
                                <p className="text-xs text-zinc-400">{rec.explanation}</p>
                                <div className="text-xs text-purple-300 font-medium pt-1">
                                    👉 <span className="underline decoration-purple-500/50">{rec.actionableStep}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}