'use client';

import { useState, useEffect, useRef } from 'react';
import { generateLessonPack, completeAcademyModule } from '../server/learn-actions';
import { ModuleDef, LessonPack, GameQuestion } from '../constants';
import { X, Sparkles, BookOpen, Trophy, Loader2, Zap, Target, Hash } from 'lucide-react';
import { MCQGame } from './games/mcq-game';
import { BubbleConnectGame } from './games/bubble-connect-game';
import { TrueFalseGame } from './games/true-false-game';
import { FillBlankGame } from './games/fill-blank-game';

// ── Confetti ──────────────────────────────────────────────────────────────────

function Confetti() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const c = ref.current; if (!c) return;
        const ctx = c.getContext('2d'); if (!ctx) return;
        c.width = c.offsetWidth; c.height = c.offsetHeight;
        const clrs = ['#7c3aed', '#10b981', '#f59e0b', '#3b82f6', '#f43f5e'];
        const ps = Array.from({ length: 80 }, () => ({
            x: c.width / 2, y: c.height / 2,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.5) * 14 - 5,
            color: clrs[Math.floor(Math.random() * clrs.length)],
            size: Math.random() * 8 + 4,
            rot: Math.random() * 360, vr: (Math.random() - 0.5) * 10,
            op: 1,
        }));
        let id: number;
        const draw = () => {
            ctx.clearRect(0, 0, c.width, c.height);
            let alive = false;
            ps.forEach(p => {
                p.x += p.vx; p.y += p.vy; p.vy += 0.35;
                p.rot += p.vr; p.op -= 0.014;
                if (p.op > 0) {
                    alive = true;
                    ctx.save(); ctx.globalAlpha = Math.max(0, p.op);
                    ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                    ctx.restore();
                }
            });
            if (alive) id = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(id);
    }, []);
    return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none z-20" />;
}

// ── Game Type Badge ───────────────────────────────────────────────────────────

const GAME_META: Record<string, { label: string; icon: string; color: string }> = {
    MCQ: { label: 'Multiple Choice', icon: '🎯', color: 'text-violet-400' },
    BUBBLE_CONNECT: { label: 'Connect the Pairs', icon: '🫧', color: 'text-sky-400' },
    TRUE_FALSE: { label: 'True or False', icon: '⚡', color: 'text-amber-400' },
    FILL_BLANK: { label: 'Fill in the Blank', icon: '✍️', color: 'text-emerald-400' },
};

// ── Question Progress Bar ─────────────────────────────────────────────────────

function QProgress({ total, current, results }: { total: number; current: number; results: boolean[] }) {
    return (
        <div className="flex items-center gap-1.5">
            {Array.from({ length: total }, (_, i) => (
                <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < results.length
                        ? results[i] ? 'bg-emerald-500' : 'bg-red-500'
                        : i === current ? 'bg-violet-500 animate-pulse' : 'bg-zinc-800'}`}
                />
            ))}
        </div>
    );
}

// ── Main Modal ────────────────────────────────────────────────────────────────

type Phase = 'LOADING' | 'CONCEPT' | 'PLAYING' | 'SUMMARY' | 'SAVING';

export function LessonModal({ module, onClose, onSuccess }: {
    module: ModuleDef | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [pack, setPack] = useState<LessonPack | null>(null);
    const [phase, setPhase] = useState<Phase>('LOADING');
    const [qIdx, setQIdx] = useState(0);
    const [results, setResults] = useState<boolean[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);
    // Key to force remount of game component on question change
    const [gameKey, setGameKey] = useState(0);

    // Inside lesson-modal.tsx, replace the existing useEffect hook with this:

    useEffect(() => {
        if (!module) return;
        setPhase('LOADING');
        setPack(null);
        setQIdx(0);
        setResults([]);

        // Pass Math.random() as the clientSeed to absolutely guarantee cache-busting
        generateLessonPack(module.title, module.difficulty, Math.random())
            .then(p => { setPack(p); setPhase('CONCEPT'); })
            .catch(() => onClose());
    }, [module, onClose]);
    if (!module) return null;

    const handleAnswer = (correct: boolean) => {
        const newResults = [...results, correct];
        setResults(newResults);

        if (qIdx + 1 < (pack?.questions.length ?? 0)) {
            setQIdx(i => i + 1);
            setGameKey(k => k + 1);
        } else {
            // All questions done — show summary
            const numCorrect = newResults.filter(Boolean).length;
            if (numCorrect >= Math.ceil(newResults.length / 2)) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            }
            setPhase('SUMMARY');
        }
    };

    const handleClaim = async () => {
        setPhase('SAVING');
        try {
            await completeAcademyModule(module.id, module.xpReward);
            onSuccess();
        } catch {
            setPhase('SUMMARY');
            alert('Could not save progress. Please sign in and try again.');
        }
    };

    const q: GameQuestion | undefined = pack?.questions[qIdx];
    const numCorrect = results.filter(Boolean).length;
    const totalQ = pack?.questions.length ?? 4;
    const xpEarned = module.xpReward;

    const diffBadge: Record<string, string> = {
        BEGINNER: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
        INTERMEDIATE: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        ADVANCED: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
        EXPERT: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 animate-in zoom-in-95 duration-200">
                {showConfetti && <Confetti />}

                {/* ── Header ── */}
                <div className="relative p-4 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="text-2xl flex-shrink-0">{module.icon}</div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <BookOpen size={11} className="text-purple-400 flex-shrink-0" />
                                <span className="text-[10px] font-bold tracking-widest uppercase text-purple-400 truncate">AI-Powered Mission</span>
                            </div>
                            <h3 className="text-sm font-bold text-zinc-100 truncate">{module.title}</h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`hidden sm:flex px-2 py-0.5 rounded-lg border text-[10px] font-bold tracking-wider uppercase ${diffBadge[module.difficulty]}`}>
                            {module.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold font-mono text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-lg">
                            <Trophy size={11} /> +{xpEarned}
                        </span>
                        {phase !== 'SAVING' && (
                            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="p-5 min-h-[400px] flex flex-col justify-center">

                    {/* LOADING */}
                    {phase === 'LOADING' && (
                        <div className="flex flex-col items-center justify-center gap-5 py-10">
                            <div className="relative h-16 w-16 rounded-2xl bg-violet-950/50 border border-violet-700/50 flex items-center justify-center">
                                <Sparkles className="text-purple-400 animate-pulse" size={28} />
                                <div className="absolute inset-0 rounded-2xl border border-violet-500/30 animate-ping opacity-20" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-zinc-200">Gemini is crafting your missions…</p>
                                <p className="text-xs text-zinc-500 mt-1">Generating 4 unique challenges on <span className="text-purple-400">{module.title}</span></p>
                            </div>
                        </div>
                    )}

                    {/* SAVING */}
                    {phase === 'SAVING' && (
                        <div className="flex flex-col items-center justify-center gap-5 py-10">
                            <div className="h-16 w-16 rounded-2xl bg-emerald-950/50 border border-emerald-700/50 flex items-center justify-center">
                                <Loader2 className="text-emerald-400 animate-spin" size={28} />
                            </div>
                            <p className="text-sm text-zinc-400">Saving XP and unlocking next module…</p>
                        </div>
                    )}

                    {/* CONCEPT */}
                    {phase === 'CONCEPT' && pack && (
                        <div className="space-y-5 animate-in fade-in duration-300">
                            <div className="p-4 rounded-xl border border-purple-800/30 bg-gradient-to-br from-purple-950/30 to-indigo-950/20 relative overflow-hidden">
                                <div className="absolute top-1 right-3 text-purple-800/10 text-6xl font-black select-none pointer-events-none">AI</div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Target size={13} className="text-purple-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Concept Briefing</span>
                                </div>
                                <p className="text-sm text-purple-100/90 leading-relaxed">{pack.conceptExplanation}</p>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {pack.questions.map((q, i) => {
                                    const m = GAME_META[q.type];
                                    return (
                                        <div key={i} className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/50 text-center">
                                            <span className="text-lg">{m.icon}</span>
                                            <span className={`text-[9px] font-bold ${m.color} leading-tight`}>{m.label}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => { setPhase('PLAYING'); setGameKey(k => k + 1); }}
                                className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', boxShadow: '0 4px 15px rgba(124,58,237,0.4)' }}
                            >
                                <Zap size={15} fill="white" /> Start 4-Challenge Mission
                            </button>
                        </div>
                    )}

                    {/* PLAYING */}
                    {phase === 'PLAYING' && pack && q && (
                        <div className="space-y-4">
                            {/* Progress + question type */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 font-bold">
                                        <span className="text-base">{GAME_META[q.type]?.icon}</span>
                                        <span className={GAME_META[q.type]?.color}>{GAME_META[q.type]?.label}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-zinc-500 font-mono">
                                        <Hash size={11} />
                                        <span>{qIdx + 1}</span>
                                        <span className="text-zinc-700">/</span>
                                        <span>{totalQ}</span>
                                    </div>
                                </div>
                                <QProgress total={totalQ} current={qIdx} results={results} />
                            </div>

                            {/* Game component */}
                            <div key={gameKey}>
                                {q.type === 'MCQ' && <MCQGame question={q} onComplete={handleAnswer} />}
                                {q.type === 'BUBBLE_CONNECT' && <BubbleConnectGame question={q} onComplete={handleAnswer} />}
                                {q.type === 'TRUE_FALSE' && <TrueFalseGame question={q} onComplete={handleAnswer} />}
                                {q.type === 'FILL_BLANK' && <FillBlankGame question={q} onComplete={handleAnswer} />}
                            </div>
                        </div>
                    )}

                    {/* SUMMARY */}
                    {phase === 'SUMMARY' && (
                        <div className="flex flex-col items-center justify-center gap-6 py-4 animate-in zoom-in-95 duration-300">
                            <div className="relative">
                                <div
                                    className={`h-24 w-24 rounded-2xl flex items-center justify-center shadow-2xl border-2 ${numCorrect >= Math.ceil(totalQ / 2) ? 'bg-emerald-950/50 border-emerald-500/80' : 'bg-amber-950/50 border-amber-500/80'}`}
                                    style={{ boxShadow: numCorrect >= Math.ceil(totalQ / 2) ? '0 0 40px rgba(16,185,129,0.4)' : '0 0 40px rgba(245,158,11,0.4)' }}
                                >
                                    <span className="text-5xl">{numCorrect >= Math.ceil(totalQ / 2) ? '🏆' : '🎖️'}</span>
                                </div>
                                <div className="absolute -top-2 -right-2 h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-black text-yellow-950 shadow-lg animate-bounce">
                                    {numCorrect}/{totalQ}
                                </div>
                            </div>

                            <div className="text-center space-y-2 max-w-sm">
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Mission Complete</p>
                                <h3 className="text-3xl font-black text-emerald-400" style={{ textShadow: '0 0 30px rgba(16,185,129,0.4)' }}>
                                    +{xpEarned} XP
                                </h3>
                                <p className="text-sm text-zinc-400">
                                    You answered <span className="text-zinc-200 font-bold">{numCorrect} of {totalQ}</span> challenges correctly.
                                </p>
                            </div>

                            {/* Per-question result pills */}
                            <div className="flex items-center gap-2">
                                {results.map((ok, i) => (
                                    <div key={i} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-xs font-bold ${ok ? 'bg-emerald-900/30 border-emerald-700/50 text-emerald-400' : 'bg-red-900/20 border-red-800/50 text-red-400'}`}>
                                        <span>{pack?.questions[i] ? GAME_META[pack.questions[i].type]?.icon : '?'}</span>
                                        <span>{ok ? '✓' : '✗'}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleClaim}
                                className="w-full max-w-xs py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                                style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', boxShadow: '0 6px 25px rgba(16,185,129,0.4)' }}
                            >
                                <Zap size={16} fill="white" /> Claim XP & Continue
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}