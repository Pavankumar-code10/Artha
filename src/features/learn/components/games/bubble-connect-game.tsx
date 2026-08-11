'use client';

import { useState, useMemo } from 'react';
import { BubbleConnectQuestion } from '../../constants';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

const PAIR_COLORS = [
    { bg: 'bg-emerald-900/50', border: 'border-emerald-500', text: 'text-emerald-300', dot: 'bg-emerald-500' },
    { bg: 'bg-violet-900/50',  border: 'border-violet-500',  text: 'text-violet-300',  dot: 'bg-violet-500' },
    { bg: 'bg-amber-900/50',   border: 'border-amber-500',   text: 'text-amber-300',   dot: 'bg-amber-500' },
    { bg: 'bg-sky-900/50',     border: 'border-sky-500',     text: 'text-sky-300',     dot: 'bg-sky-500' },
];

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

export function BubbleConnectGame({ question, onComplete }: { question: BubbleConnectQuestion; onComplete: (correct: boolean) => void }) {
    const shuffledDefs = useMemo(() => shuffle(question.pairs.map((p, i) => ({ ...p, origIdx: i }))), [question]);

    // matches: termIdx → defOrigIdx
    const [matches, setMatches] = useState<Record<number, number>>({});
    const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
    const [flash, setFlash] = useState<{ termIdx: number; defIdx: number; ok: boolean } | null>(null);
    const [done, setDone] = useState(false);

    const matchedTermIdxs = Object.keys(matches).map(Number);
    const matchedDefOrigIdxs = Object.values(matches);

    const handleTermClick = (termIdx: number) => {
        if (matchedTermIdxs.includes(termIdx)) return;
        setSelectedTerm(prev => (prev === termIdx ? null : termIdx));
    };

    const handleDefClick = (defOrigIdx: number, shuffledIdx: number) => {
        if (selectedTerm === null) return;
        if (matchedDefOrigIdxs.includes(defOrigIdx)) return;

        const isCorrect = defOrigIdx === selectedTerm;
        setFlash({ termIdx: selectedTerm, defIdx: shuffledIdx, ok: isCorrect });

        setTimeout(() => {
            setFlash(null);
            if (isCorrect) {
                const newMatches = { ...matches, [selectedTerm]: defOrigIdx };
                setMatches(newMatches);
                if (Object.keys(newMatches).length === question.pairs.length) setDone(true);
            }
            setSelectedTerm(null);
        }, 600);
    };

    return (
        <div className="space-y-5 animate-in fade-in duration-300">
            <p className="text-xs text-zinc-400 font-medium">{question.instruction}</p>

            <div className="grid grid-cols-2 gap-3">
                {/* Terms — left column */}
                <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Terms</p>
                    {question.pairs.map((pair, termIdx) => {
                        const matchColor = matchedTermIdxs.includes(termIdx) ? PAIR_COLORS[termIdx % 4] : null;
                        const isSelected = selectedTerm === termIdx;
                        const isFlashing = flash?.termIdx === termIdx;

                        return (
                            <button
                                key={termIdx}
                                onClick={() => handleTermClick(termIdx)}
                                disabled={!!matchColor}
                                className={`w-full px-4 py-3 rounded-xl border text-sm font-bold transition-all duration-300 flex items-center gap-2
                                    ${matchColor ? `${matchColor.bg} ${matchColor.border} ${matchColor.text}` :
                                        isFlashing ? (flash!.ok ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300' : 'bg-red-900/40 border-red-500 text-red-300 animate-bounce') :
                                            isSelected ? 'bg-violet-900/40 border-violet-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] scale-105' :
                                                'bg-zinc-900/60 border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
                            >
                                {matchColor && <div className={`h-2 w-2 rounded-full ${matchColor.dot} flex-shrink-0`} />}
                                {matchColor && <CheckCircle2 size={13} className="flex-shrink-0" />}
                                <span className="truncate">{pair.term}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Definitions — right column */}
                <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Definitions</p>
                    {shuffledDefs.map((def, shuffledIdx) => {
                        const matchedByTermIdx = matchedTermIdxs.find(ti => matches[ti] === def.origIdx);
                        const matchColor = matchedByTermIdx !== undefined ? PAIR_COLORS[matchedByTermIdx % 4] : null;
                        const isFlashing = flash?.defIdx === shuffledIdx;

                        return (
                            <button
                                key={shuffledIdx}
                                onClick={() => handleDefClick(def.origIdx, shuffledIdx)}
                                disabled={!!matchColor}
                                className={`w-full px-3 py-3 rounded-xl border text-xs text-left transition-all duration-300
                                    ${matchColor ? `${matchColor.bg} ${matchColor.border} ${matchColor.text}` :
                                        isFlashing ? (flash!.ok ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300' : 'bg-red-900/40 border-red-500 text-red-300') :
                                            selectedTerm !== null && !matchColor ? 'bg-zinc-900/60 border-zinc-600 text-zinc-300 hover:border-violet-500/50 hover:bg-violet-900/10 cursor-pointer' :
                                                'bg-zinc-900/60 border-zinc-700/50 text-zinc-500'}`}
                            >
                                {def.definition}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-2 text-xs text-zinc-500">
                {PAIR_COLORS.slice(0, question.pairs.length).map((c, i) => (
                    <div key={i} className={`h-2 w-2 rounded-full transition-all ${matchedTermIdxs.includes(i) ? c.dot : 'bg-zinc-700'}`} />
                ))}
                <span className="ml-1">{matchedTermIdxs.length}/{question.pairs.length} matched</span>
            </div>

            {/* Explanation + Next */}
            {done && (
                <div className="space-y-3 animate-in slide-in-from-bottom-2">
                    <div className="p-3.5 rounded-xl border bg-emerald-950/30 border-emerald-800/50 text-xs text-emerald-300 leading-relaxed">
                        <span className="font-bold">✓ All matched!</span> {question.explanation}
                    </div>
                    <button
                        onClick={() => onComplete(true)}
                        className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', boxShadow: '0 4px 15px rgba(124,58,237,0.35)' }}
                    >
                        Next Challenge <ChevronRight size={15} />
                    </button>
                </div>
            )}
        </div>
    );
}
