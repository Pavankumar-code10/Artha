'use client';

import { useState, useEffect, useCallback } from 'react';
import { ScoredMarketplaceAsset } from '../types';
import { BrainCircuit, CheckCircle2, ShieldAlert, Sparkles, RefreshCcw, Check } from 'lucide-react';
import { generateAssetQuiz, DynamicQuiz } from '../server/quiz-actions';

interface ProofOfKnowledgeProps {
    asset: ScoredMarketplaceAsset;
    onSuccess: () => void;
}

export function ProofOfKnowledge({ asset, onSuccess }: ProofOfKnowledgeProps) {
    const [quiz, setQuiz] = useState<DynamicQuiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<number | null>(null);
    const [status, setStatus] = useState<'IDLE' | 'INCORRECT' | 'CORRECT'>('IDLE');

    // Abstract the fetch logic so we can trigger it multiple times
    const fetchNewQuiz = useCallback(() => {
        setLoading(true);
        setQuiz(null); // Clears old state to force the UI back to the Sparkles loader
        generateAssetQuiz(asset)
            .then(setQuiz)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [asset]);

    // Initial load
    useEffect(() => {
        fetchNewQuiz();
    }, [fetchNewQuiz]);

    const handleVerify = () => {
        if (selected === null || !quiz) return;
        if (selected === quiz.answerIndex) {
            setStatus('CORRECT');
        } else {
            setStatus('INCORRECT');
        }
    };

    // The Magic: Trigger AI to generate a brand new question on failure
    const handleTryAgain = () => {
        setSelected(null);
        setStatus('IDLE');
        fetchNewQuiz();
    };

    if (loading || !quiz) {
        return (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                    <Sparkles className="relative text-purple-400 animate-pulse" size={32} />
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-zinc-200">Gemini AI is analyzing {asset.ticker}</p>
                    <p className="text-xs text-zinc-500 mt-1">Generating custom SEBI-compliant risk assessment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between mb-2 border-b border-zinc-800/50 pb-3">
                <div className="flex items-center gap-2 text-purple-400">
                    <BrainCircuit size={18} />
                    <h4 className="text-sm font-semibold uppercase tracking-wider">Proof of Knowledge</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/30 text-purple-300 border border-purple-800/30">
                    AI GENERATED
                </span>
            </div>

            {status === 'CORRECT' ? (
                <div className="space-y-4 animate-in zoom-in-95">
                    <div className="flex items-start gap-3 p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl text-emerald-400">
                        <CheckCircle2 size={24} className="shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-sm mb-1">Knowledge Verified!</h4>
                            <p className="text-xs text-emerald-300/80 leading-relaxed">{quiz.explanation}</p>
                        </div>
                    </div>
                    <button
                        onClick={onSuccess}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        Confirm Investment
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-sm text-zinc-200 font-medium leading-relaxed">{quiz.question}</p>

                    <div className="space-y-2.5 mt-4">
                        {quiz.options.map((opt, idx) => (
                            <button
                                key={idx}
                                disabled={status === 'INCORRECT'}
                                onClick={() => setSelected(idx)}
                                className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all duration-200 ${selected === idx && status !== 'INCORRECT'
                                    ? 'bg-purple-900/20 border-purple-500/50 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                    : selected === idx && status === 'INCORRECT'
                                        ? 'bg-red-900/20 border-red-500/50 text-red-200'
                                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
                                    } ${status === 'INCORRECT' && selected !== idx ? 'opacity-50' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <span className="font-mono text-zinc-600 font-bold opacity-50">{String.fromCharCode(65 + idx)}.</span>
                                    <span>{opt}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {status === 'INCORRECT' && (
                        <div className="flex items-start gap-2 p-3 bg-red-950/30 border border-red-900/50 rounded-lg text-red-400 text-xs font-medium animate-in slide-in-from-top-2">
                            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                            <span>Incorrect answer. Review the risk profile and try again to proceed.</span>
                        </div>
                    )}

                    {status === 'INCORRECT' ? (
                        <button
                            onClick={handleTryAgain}
                            className="w-full py-3 mt-2 bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm font-semibold rounded-xl hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCcw size={16} />
                            Generate New Question
                        </button>
                    ) : (
                        <button
                            onClick={handleVerify}
                            disabled={selected === null}
                            className="w-full py-3 mt-2 bg-zinc-100 text-zinc-900 text-sm font-bold rounded-xl hover:bg-white disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors"
                        >
                            Verify Answer
                        </button>
                    )}
                </>
            )}
        </div>
    );
}