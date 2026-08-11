// 'use client';

// import { useState, useEffect, useTransition } from 'react';
// import { ScoredMarketplaceAsset } from '../types';
// import { ProofOfKnowledge } from './proof-of-knowledge';
// import { checkKnowledgeStatus, markQuizCompleted, executeInvestment } from '../server/invest-actions';
// import { X, ShieldCheck, AlertTriangle, TrendingUp, Building2, Shield, Info, Loader2 } from 'lucide-react';

// interface AssetDetailModalProps {
//     asset: ScoredMarketplaceAsset | null;
//     onClose: () => void;
// }

// export function AssetDetailModal({ asset, onClose }: AssetDetailModalProps) {
//     const [mode, setMode] = useState<'DETAILS' | 'QUIZ' | 'PROCESSING'>('DETAILS');
//     const [isUnlocked, setIsUnlocked] = useState(false);
//     const [isPending, startTransition] = useTransition();

//     // Check if user has already passed the quiz for this category
//     useEffect(() => {
//         if (asset) {
//             setMode('DETAILS');
//             checkKnowledgeStatus(asset.category).then(setIsUnlocked);
//         }
//     }, [asset]);

//     if (!asset) return null;

//     const categoryIcon = (category: string) => {
//         switch (category) {
//             case 'REIT': return <Building2 size={18} />;
//             case 'SGB': return <Shield size={18} />;
//             default: return <TrendingUp size={18} />;
//         }
//     };

//     const handleInvestClick = () => {
//         if (isUnlocked) {
//             handleFinalPurchase();
//         } else {
//             setMode('QUIZ');
//         }
//     };

//     const handleQuizSuccess = async () => {
//         await markQuizCompleted(asset.category);
//         setIsUnlocked(true);
//         handleFinalPurchase();
//     };

//     const handleFinalPurchase = () => {
//         setMode('PROCESSING');
//         startTransition(async () => {
//             // Execute real Prisma database mutation
//             await executeInvestment(asset, asset.minInvestment);
//             // Note: The executeInvestment action calls redirect(), 
//             // so the component will unmount and jump to the X-Ray page.
//         });
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
//             <div
//                 className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden font-sans text-zinc-100 animate-in zoom-in-95 duration-150"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <div className={`p-6 border-b flex items-start justify-between ${asset.isHighlyRecommended ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-zinc-900/40 border-zinc-800'
//                     }`}>
//                     <div className="space-y-1">
//                         <div className="flex items-center gap-2 text-zinc-400">
//                             {categoryIcon(asset.category)}
//                             <span className="text-xs font-bold tracking-wider uppercase">{asset.category}</span>
//                         </div>
//                         <h2 className="text-xl font-semibold text-zinc-100">{asset.name}</h2>
//                     </div>
//                     {mode !== 'PROCESSING' && (
//                         <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg transition-colors">
//                             <X size={18} />
//                         </button>
//                     )}
//                 </div>

//                 <div className="p-6">
//                     {mode === 'PROCESSING' ? (
//                         <div className="py-12 flex flex-col items-center justify-center space-y-4">
//                             <Loader2 className="animate-spin text-zinc-500" size={32} />
//                             <p className="text-sm font-mono text-zinc-400">Executing transaction & updating X-Ray engine...</p>
//                         </div>
//                     ) : mode === 'QUIZ' ? (
//                         <ProofOfKnowledge asset={asset} onSuccess={handleQuizSuccess} />
//                     ) : (
//                         <div className="space-y-6 max-h-[70vh] overflow-y-auto">
//                             {/* Asset Details (Same as before) */}
//                             <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
//                                 <div>
//                                     <p className="text-[10px] text-zinc-500 uppercase font-semibold">Expected Return</p>
//                                     <p className="text-xl font-medium tabular-nums">{asset.expectedReturn}%</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-[10px] text-zinc-500 uppercase font-semibold">Min Investment</p>
//                                     <p className="text-xl font-medium tabular-nums">₹{asset.minInvestment.toLocaleString('en-IN')}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-[10px] text-zinc-500 uppercase font-semibold">Risk Level</p>
//                                     <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded mt-1 ${asset.riskLevel === 'HIGH' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
//                                         }`}>{asset.riskLevel}</span>
//                                 </div>
//                             </div>

//                             <div className="space-y-2">
//                                 <h4 className="text-xs font-semibold uppercase text-zinc-400">Asset Profile</h4>
//                                 <p className="text-sm text-zinc-300 leading-relaxed">{asset.description}</p>
//                             </div>

//                             <div className={`p-4 rounded-xl border space-y-2 ${asset.isHighlyRecommended ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
//                                 }`}>
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
//                                         {asset.diversificationScore < 50 ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
//                                         <span>X-Ray Diversification Score</span>
//                                     </div>
//                                     <span className="text-sm font-bold font-mono">{asset.diversificationScore} / 100</span>
//                                 </div>
//                                 <p className="text-xs leading-relaxed opacity-90">{asset.matchReason}</p>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer */}
//                 {mode === 'DETAILS' && (
//                     <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 flex justify-end gap-3">
//                         <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white">Close</button>
//                         <button
//                             onClick={handleInvestClick}
//                             disabled={isPending}
//                             className="px-5 py-2 text-xs font-semibold bg-zinc-100 text-zinc-900 hover:bg-white rounded-lg transition-colors flex items-center gap-2"
//                         >
//                             {isUnlocked ? 'Confirm Investment' : 'Take SEBI Quiz to Invest'}
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

'use client';

import { useState, useTransition, useEffect } from 'react';
import { ScoredMarketplaceAsset } from '../types';
import { ProofOfKnowledge } from './proof-of-knowledge';
import { markQuizCompleted, executeInvestment } from '../server/invest-actions';
import { X, ShieldCheck, AlertTriangle, TrendingUp, Building2, Shield, Loader2, Info } from 'lucide-react';

interface AssetDetailModalProps {
    asset: ScoredMarketplaceAsset | null;
    onClose: () => void;
}

export function AssetDetailModal({ asset, onClose }: AssetDetailModalProps) {
    const [mode, setMode] = useState<'DETAILS' | 'QUIZ' | 'PROCESSING'>('DETAILS');
    const [isPending, startTransition] = useTransition();

    // Reset modal state if it closes and reopens
    useEffect(() => {
        if (asset) setMode('DETAILS');
    }, [asset]);

    if (!asset) return null;

    const categoryIcon = (category: string) => {
        switch (category) {
            case 'REIT': return <Building2 size={18} />;
            case 'SGB': return <Shield size={18} />;
            default: return <TrendingUp size={18} />;
        }
    };

    const handleQuizSuccess = async () => {
        setMode('PROCESSING');
        startTransition(async () => {
            await markQuizCompleted(asset.category);
            await executeInvestment(asset, asset.minInvestment);
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div
                className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden font-sans text-zinc-100 animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`p-6 border-b flex items-start justify-between ${asset.isHighlyRecommended ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-zinc-900/40 border-zinc-800'
                    }`}>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-400">
                            {categoryIcon(asset.category)}
                            <span className="text-xs font-bold tracking-wider uppercase">{asset.category}</span>
                        </div>
                        <h2 className="text-xl font-semibold text-zinc-100">{asset.name}</h2>
                    </div>
                    {mode !== 'PROCESSING' && (
                        <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg transition-colors">
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-6">
                    {mode === 'PROCESSING' ? (
                        <div className="py-12 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="animate-spin text-zinc-500" size={32} />
                            <p className="text-sm font-mono text-zinc-400">Executing transaction & updating X-Ray engine...</p>
                        </div>
                    ) : mode === 'QUIZ' ? (
                        <ProofOfKnowledge asset={asset} onSuccess={handleQuizSuccess} />
                    ) : (
                        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Expected Return</p>
                                    <p className="text-xl font-medium tabular-nums mt-0.5">{asset.expectedReturn}%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Min Investment</p>
                                    <p className="text-xl font-medium tabular-nums mt-0.5">₹{asset.minInvestment.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Risk Level</p>
                                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded mt-1 ${asset.riskLevel === 'HIGH' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        }`}>{asset.riskLevel}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase text-zinc-400">Asset Profile</h4>
                                <p className="text-sm text-zinc-300 leading-relaxed">{asset.description}</p>
                            </div>

                            <div className={`p-4 rounded-xl border space-y-2 ${asset.isHighlyRecommended ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                                        {asset.diversificationScore < 50 ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
                                        <span>X-Ray Diversification Score</span>
                                    </div>
                                    <span className="text-sm font-bold font-mono">{asset.diversificationScore} / 100</span>
                                </div>
                                <p className="text-xs leading-relaxed opacity-90">{asset.matchReason}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer ONLY displays in DETAILS mode */}
                {mode === 'DETAILS' && (
                    <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white">Close</button>
                        <button
                            onClick={() => setMode('QUIZ')}
                            className="px-5 py-2 text-xs font-semibold bg-zinc-100 text-zinc-900 hover:bg-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            Take SEBI Quiz to Invest
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}