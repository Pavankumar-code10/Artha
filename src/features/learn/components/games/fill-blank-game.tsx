'use client';

import { useState, useRef } from 'react';
import { FillBlankQuestion } from '../../constants';
import { ChevronRight, Lightbulb } from 'lucide-react';

export function FillBlankGame({ question, onComplete }: { question: FillBlankQuestion; onComplete: (correct: boolean) => void }) {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const normalize = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const correct = normalize(value) === normalize(question.answer) ||
        normalize(value).includes(normalize(question.answer)) ||
        normalize(question.answer).includes(normalize(value));

    // Render sentence with blank as styled input
    const parts = question.template.split('_____');

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Fill-blank sentence */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-700/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Fill in the Blank</p>
                <p className="text-base font-medium text-zinc-200 leading-relaxed flex flex-wrap items-center gap-1">
                    <span>{parts[0]}</span>
                    <span
                        className={`inline-block min-w-[120px] px-3 py-1 rounded-lg border-b-2 font-bold text-center transition-all
                            ${!submitted ? 'border-violet-500 bg-violet-950/20 text-violet-200' :
                                correct ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300' :
                                    'border-red-500 bg-red-950/20 text-red-300'}`}
                    >
                        {submitted ? (correct ? value : question.answer) : (value || '___')}
                    </span>
                    {parts[1] && <span>{parts[1]}</span>}
                </p>
            </div>

            {/* Input field */}
            {!submitted && (
                <div className="space-y-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && value.trim()) setSubmitted(true); }}
                        placeholder="Type your answer..."
                        autoFocus
                        className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                    />

                    {/* Hint */}
                    <button
                        onClick={() => setShowHint(p => !p)}
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-400 transition-colors"
                    >
                        <Lightbulb size={12} /> {showHint ? question.hint : 'Show hint'}
                    </button>
                </div>
            )}

            {/* Explanation */}
            {submitted && (
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-in slide-in-from-top-2 ${correct ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300' : 'bg-red-950/30 border-red-800/50 text-red-300'}`}>
                    {!correct && (
                        <p className="font-bold mb-1">✗ The correct answer was: <span className="font-black">{question.answer}</span></p>
                    )}
                    {correct && <span className="font-bold">✓ Correct! </span>}
                    {question.explanation}
                </div>
            )}

            {/* Actions */}
            {!submitted ? (
                <button
                    onClick={() => setSubmitted(true)}
                    disabled={!value.trim()}
                    className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-900 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                    Check Answer <ChevronRight size={15} />
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
