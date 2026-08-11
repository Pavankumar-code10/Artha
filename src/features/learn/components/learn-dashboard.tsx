'use client';

import { useState, useEffect, useRef } from 'react';
import { getUserProgress } from '../server/learn-actions';
import { ACADEMY_MODULES, ModuleDef, RANK_TIERS, getRankForXp, getNextRank } from '../constants';
import { LessonModal } from './lesson-modal';
import { Trophy, Lock, CheckCircle2, Play, Zap, Star, ChevronRight, Flame } from 'lucide-react';

// --- Particle Canvas for background flair ---
function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = [];
        const colors = ['#7c3aed', '#4f46e5', '#0ea5e9', '#10b981'];

        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2 + 1,
                alpha: Math.random() * 0.4 + 0.1,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        let animId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            animId = requestAnimationFrame(animate);
        };
        animate();

        return () => cancelAnimationFrame(animId);
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// --- XP Progress Bar ---
function XpProgressBar({ totalXp }: { totalXp: number }) {
    const currentRank = getRankForXp(totalXp);
    const nextRank = getNextRank(totalXp);

    const progressPercent = nextRank
        ? Math.min(100, ((totalXp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100)
        : 100;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
                <span style={{ color: currentRank.color }} className="flex items-center gap-1">
                    <span>{currentRank.icon}</span> {currentRank.name}
                </span>
                {nextRank && (
                    <span className="text-zinc-500 flex items-center gap-1">
                        Next: {nextRank.icon} {nextRank.name}
                        <span className="text-zinc-400 font-mono ml-1">({nextRank.minXp - totalXp} XP away)</span>
                    </span>
                )}
                {!nextRank && <span className="text-yellow-400 font-bold">MAX RANK ✨</span>}
            </div>
            <div className="h-3 bg-zinc-800/80 rounded-full overflow-hidden border border-zinc-700/50">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                        width: `${progressPercent}%`,
                        background: `linear-gradient(90deg, ${currentRank.color}, ${nextRank?.color || currentRank.color})`,
                        boxShadow: `0 0 12px ${currentRank.color}88`
                    }}
                />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-600">
                <span>{currentRank.minXp} XP</span>
                <span>{nextRank ? nextRank.minXp : totalXp} XP</span>
            </div>
        </div>
    );
}

// --- Module Card ---
function ModuleCard({
    mod,
    isCompleted,
    isLocked,
    isActive,
    position,
    onClick
}: {
    mod: ModuleDef;
    isCompleted: boolean;
    isLocked: boolean;
    isActive: boolean;
    position: number;
    onClick: () => void;
}) {
    const difficultyConfig: Record<string, { label: string; bg: string; text: string }> = {
        BEGINNER: { label: 'Beginner', bg: 'bg-sky-500/10', text: 'text-sky-400' },
        INTERMEDIATE: { label: 'Intermediate', bg: 'bg-amber-500/10', text: 'text-amber-400' },
        ADVANCED: { label: 'Advanced', bg: 'bg-orange-500/10', text: 'text-orange-400' },
        EXPERT: { label: 'Expert', bg: 'bg-rose-500/10', text: 'text-rose-400' },
    };
    const dc = difficultyConfig[mod.difficulty];

    return (
        <div
            className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden
                ${isLocked
                    ? 'bg-zinc-950/40 border-zinc-800/40 opacity-50'
                    : isCompleted
                        ? 'bg-emerald-950/10 border-emerald-800/30 hover:border-emerald-600/50'
                        : 'bg-zinc-900/60 border-purple-800/30 hover:border-purple-500/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] cursor-pointer'
                }
            `}
            onClick={!isLocked ? onClick : undefined}
            style={{ animationDelay: `${position * 100}ms` }}
        >
            {/* Glow overlay for active modules */}
            {!isLocked && !isCompleted && (
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${mod.color} opacity-[0.03]`} />
            )}

            {/* Completion ribbon */}
            {isCompleted && (
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className="absolute top-2 right-[-18px] w-20 text-center text-[9px] font-bold text-emerald-950 bg-emerald-400 rotate-45 py-0.5">
                        DONE
                    </div>
                </div>
            )}

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`text-3xl p-2.5 rounded-xl bg-gradient-to-br ${isLocked ? 'from-zinc-800 to-zinc-700' : isCompleted ? 'from-emerald-900/50 to-emerald-800/30' : `${mod.color} opacity-90`} ${isLocked ? '' : isCompleted ? '' : 'shadow-lg'}`}
                        style={!isLocked && !isCompleted ? { boxShadow: `0 4px 15px rgba(0,0,0,0.4)` } : {}}>
                        {isLocked ? '🔒' : mod.icon}
                    </div>
                    <div className="text-right space-y-1.5">
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${dc.bg} ${dc.text}`}>
                            {dc.label}
                        </div>
                        <div className="flex items-center justify-end gap-1 text-xs font-bold font-mono text-yellow-400">
                            <Trophy size={12} className="text-yellow-500" />
                            <span>+{mod.xpReward} XP</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <h3 className={`text-base font-bold mb-1.5 ${isLocked ? 'text-zinc-600' : isCompleted ? 'text-emerald-300' : 'text-zinc-100'}`}>
                    {mod.title}
                </h3>
                <p className={`text-xs leading-relaxed mb-5 min-h-[48px] ${isLocked ? 'text-zinc-700' : 'text-zinc-400'}`}>
                    {isLocked ? `Complete the previous module to unlock this.` : mod.description}
                </p>

                {/* CTA Button */}
                <button
                    disabled={isLocked}
                    className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200
                        ${isLocked
                            ? 'bg-zinc-900/50 text-zinc-700 cursor-not-allowed border border-zinc-800/50'
                            : isCompleted
                                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/40 hover:bg-emerald-900/50'
                                : 'text-white border-0 hover:scale-[1.02] active:scale-[0.98]'
                        }
                    `}
                    style={!isLocked && !isCompleted ? {
                        background: `linear-gradient(135deg, var(--tw-gradient-from, #7c3aed), var(--tw-gradient-to, #4f46e5))`,
                        backgroundImage: `linear-gradient(135deg, #7c3aed, #4f46e5)`,
                        boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)'
                    } : {}}
                >
                    {isLocked && <><Lock size={14} /> Locked</>}
                    {isCompleted && <><CheckCircle2 size={14} className="text-emerald-400" /> Review Module</>}
                    {!isLocked && !isCompleted && <><Play size={14} fill="white" /> Begin Mission <ChevronRight size={14} className="ml-auto" /></>}
                </button>
            </div>
        </div>
    );
}

// --- Main Dashboard ---
export function LearnDashboard() {
    const [progress, setProgress] = useState<{
        completedModuleIds: string[];
        totalXp: number;
        rank: string;
        isAuthenticated?: boolean;
    }>({ completedModuleIds: [], totalXp: 0, rank: 'Loading...' });

    const [activeModule, setActiveModule] = useState<ModuleDef | null>(null);
    const [xpFlash, setXpFlash] = useState(false);
    const prevXp = useRef(0);

    const fetchProgress = () => {
        getUserProgress().then((data) => {
            if (data.totalXp > prevXp.current && prevXp.current > 0) {
                setXpFlash(true);
                setTimeout(() => setXpFlash(false), 1000);
            }
            prevXp.current = data.totalXp;
            setProgress(data);
        });
    };

    useEffect(() => { fetchProgress(); }, []);

    const completedCount = progress.completedModuleIds.length;
    const totalModules = ACADEMY_MODULES.length;
    const completionPercent = Math.round((completedCount / totalModules) * 100);
    const currentRank = getRankForXp(progress.totalXp);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* === HERO STATS PANEL === */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800/60 bg-zinc-950">
                <ParticleCanvas />
                {/* Gradient backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-zinc-950/60 to-indigo-950/30" />

                <div className="relative z-10 p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                        {/* Rank Badge */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div
                                    className="h-20 w-20 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-2xl"
                                    style={{
                                        background: `linear-gradient(135deg, ${currentRank.color}40, ${currentRank.color}20)`,
                                        border: `2px solid ${currentRank.color}60`,
                                        boxShadow: `0 0 30px ${currentRank.color}30`
                                    }}
                                >
                                    {currentRank.icon}
                                </div>
                                {completedCount > 0 && (
                                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <span className="text-[9px] font-bold text-white">{completedCount}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Current Rank</p>
                                <h2
                                    className="text-2xl font-black"
                                    style={{ color: currentRank.color, textShadow: `0 0 20px ${currentRank.color}60` }}
                                >
                                    {currentRank.name}
                                </h2>
                                <p className="text-xs text-zinc-500 mt-0.5">{completedCount}/{totalModules} Modules Complete</p>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex-1 grid grid-cols-3 gap-4">
                            <div className="text-center p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/50">
                                <div className={`text-2xl font-black font-mono transition-all duration-300 ${xpFlash ? 'text-yellow-300 scale-110' : 'text-yellow-400'}`}>
                                    {progress.totalXp}
                                </div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
                                    <Zap size={10} className="text-yellow-500" /> Total XP
                                </div>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/50">
                                <div className="text-2xl font-black font-mono text-emerald-400">
                                    {completionPercent}%
                                </div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
                                    <Star size={10} className="text-emerald-500" /> Mastery
                                </div>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/50">
                                <div className="text-2xl font-black font-mono text-purple-400">
                                    {completedCount > 0 ? `${completedCount}🔥` : '0'}
                                </div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
                                    <Flame size={10} className="text-orange-500" /> Streak
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="mt-6">
                        <XpProgressBar totalXp={progress.totalXp} />
                    </div>
                </div>
            </div>

            {/* === RANK ROADMAP === */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {RANK_TIERS.map((tier, i) => {
                    const isReached = progress.totalXp >= tier.minXp;
                    const isCurrent = tier.name === currentRank.name;
                    return (
                        <div key={tier.name} className="flex items-center gap-2 flex-shrink-0">
                            <div
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all ${isCurrent
                                    ? 'border-opacity-60 scale-105'
                                    : isReached
                                        ? 'border-zinc-700/50 opacity-80'
                                        : 'border-zinc-800/30 opacity-40'
                                    }`}
                                style={isCurrent ? {
                                    borderColor: `${tier.color}80`,
                                    background: `${tier.color}10`,
                                    boxShadow: `0 0 15px ${tier.color}20`
                                } : {}}
                            >
                                <span className="text-lg">{tier.icon}</span>
                                <span className="text-[9px] font-bold text-zinc-400 whitespace-nowrap">{tier.name}</span>
                                <span className="text-[8px] font-mono" style={{ color: tier.color }}>{tier.minXp} XP</span>
                            </div>
                            {i < RANK_TIERS.length - 1 && (
                                <div className={`h-0.5 w-6 rounded-full ${isReached ? 'bg-purple-500/50' : 'bg-zinc-800'}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* === MODULE GRID === */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-zinc-100">Mission Board</h2>
                        <p className="text-xs text-zinc-500">Complete missions to earn XP and unlock advanced content</p>
                    </div>
                    <div className="text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
                        {completedCount}/{totalModules} Completed
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {ACADEMY_MODULES.map((mod, idx) => {
                        const isCompleted = progress.completedModuleIds.includes(mod.id);
                        const isLocked = mod.prerequisiteId !== null && !progress.completedModuleIds.includes(mod.prerequisiteId);

                        return (
                            <ModuleCard
                                key={mod.id}
                                mod={mod}
                                isCompleted={isCompleted}
                                isLocked={isLocked}
                                isActive={activeModule?.id === mod.id}
                                position={idx}
                                onClick={() => setActiveModule(mod)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* === LESSON MODAL === */}
            <LessonModal
                module={activeModule}
                onClose={() => setActiveModule(null)}
                onSuccess={() => {
                    setActiveModule(null);
                    fetchProgress();
                }}
            />
        </div>
    );
}