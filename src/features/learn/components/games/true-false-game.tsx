'use client';

import { useState } from 'react';
import { TrueFalseQuestion } from '../../constants';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

export function TrueFalseGame({ question, onComplete }: { question: TrueFalseQuestion; onComplete: (correct: boolean) => void }) {
    const [selected, setSelected] = useState<boolean | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const correct = submitted && selected === question.answer;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Statement card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-700/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Is this statement true or false?</p>
                <p className="text-base font-semibold text-zinc-100 leading-relaxed">"{question.statement}"</p>
            </div>

            {/* True / False buttons */}
            <div className="grid grid-cols-2 gap-4">
                {[true, false].map((val) => {
                    const label = val ? 'TRUE' : 'FALSE';
                    const emoji = val ? '✅' : '❌';

                    let cls = 'bg-zinc-900/60 border-zinc-700 text-zinc-400 hover:scale-105';
                    if (selected === val && !submitted) cls = val
                        ? 'bg-emerald-900/50 border-emerald-500 text-emerald-200 scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : 'bg-red-900/40 border-red-500 text-red-200 scale-105 shadow-[0_0_20px_rgba(239,68,68,0.3)]';
                    if (submitted && val === question.answer) cls = 'bg-emerald-900/50 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
                    if (submitted && selected === val && val !== question.answer) cls = 'bg-red-900/30 border-red-500/70 text-red-400 opacity-70';

                    return (
                        <button
                            key={String(val)}
                            disabled={submitted}
                            onClick={() => setSelected(val)}
                            className={`py-8 rounded-2xl border-2 text-center flex flex-col items-center gap-2 transition-all duration-300 font-black text-lg ${cls} disabled:cursor-default`}
                        >
                            <span className="text-3xl">{emoji}</span>
                            <span>{label}</span>
                            {submitted && val === question.answer && <CheckCircle2 size={18} />}
                            {submitted && selected === val && val !== question.answer && <XCircle size={18} />}
                        </button>
                    );
                })}
            </div>

            {/* Explanation */}
            {submitted && (
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-in slide-in-from-top-2 ${correct ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300' : 'bg-red-950/30 border-red-800/50 text-red-300'}`}>
                    <span className="font-bold">{correct ? '✓ Correct!' : `✗ It was ${question.answer ? 'TRUE' : 'FALSE'}.`}</span>{' '}
                    {question.explanation}
                </div>
            )}

            {/* Actions */}
            {!submitted ? (
                <button
                    onClick={() => setSubmitted(true)}
                    disabled={selected === null}
                    className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-900 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                    Confirm Answer <ChevronRight size={15} />
                </button>
            ) : (
                <button
                    onClick={() => onComplete(correct)}
                    className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', boxShadow: '0 4px 15px rgba(124,58,237,0.35)' }}
                >
                    Next Challenge <ChevronRight size={15} />
                </button>
            )}
        </div>
    );
}
