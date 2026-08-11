'use client';

import { useState } from 'react';
import { MCQQuestion } from '../../constants';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

const LABELS = ['A', 'B', 'C', 'D'];

export function MCQGame({ question, onComplete }: { question: MCQQuestion; onComplete: (correct: boolean) => void }) {
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const correct = submitted && selected === question.answerIndex;
    const wrong = submitted && selected !== question.answerIndex;

    const handleSubmit = () => {
        if (selected === null) return;
        setSubmitted(true);
    };

    return (
        <div className="space-y-5 animate-in fade-in duration-300">
            {/* Question */}
            <p className="text-sm font-semibold text-zinc-200 leading-relaxed">{question.question}</p>

            {/* Options */}
            <div className="space-y-2.5">
                {question.options.map((opt, i) => {
                    let cls = 'bg-zinc-900/60 border-zinc-700/50 text-zinc-400 hover:bg-zinc-800/60 hover:border-zinc-600 hover:text-zinc-200';
                    if (selected === i && !submitted) cls = 'bg-violet-900/40 border-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]';
                    if (submitted && i === question.answerIndex) cls = 'bg-emerald-900/40 border-emerald-500 text-emerald-200';
                    if (submitted && selected === i && i !== question.answerIndex) cls = 'bg-red-900/30 border-red-500/70 text-red-400';

                    return (
                        <button
                            key={i}
                            disabled={submitted}
                            onClick={() => setSelected(i)}
                            className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all duration-200 flex items-center gap-3 disabled:cursor-default ${cls}`}
                        >
                            <span className={`flex-shrink-0 h-7 w-7 rounded-lg border font-bold text-xs flex items-center justify-center transition-all
                                ${selected === i && !submitted ? 'bg-violet-600 border-violet-500 text-white' :
                                    submitted && i === question.answerIndex ? 'bg-emerald-600 border-emerald-500 text-white' :
                                        submitted && selected === i ? 'bg-red-600 border-red-500 text-white' :
                                            'border-zinc-700 text-zinc-500'}`}>
                                {LABELS[i]}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {submitted && i === question.answerIndex && <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />}
                            {submitted && selected === i && i !== question.answerIndex && <XCircle size={15} className="text-red-400 flex-shrink-0" />}
                        </button>
                    );
                })}
            </div>

            {/* Explanation */}
            {submitted && (
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-in slide-in-from-top-2 ${correct ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300' : 'bg-red-950/30 border-red-800/50 text-red-300'}`}>
                    <span className="font-bold">{correct ? '✓ Correct!' : '✗ Not quite.'}</span> {question.explanation}
                </div>
            )}

            {/* Actions */}
            {!submitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={selected === null}
                    className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-900 text-sm font-bold flex items-center justify-center gap-2 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    Submit Answer <ChevronRight size={15} />
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
