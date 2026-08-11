'use client';

import { useEffect, useState } from 'react';
import { getMarketplaceAssets } from '../server/actions';
import { ScoredMarketplaceAsset } from '../types';
import { AssetDetailModal } from './asset-detail-modal';
import { CheckCircle2, AlertTriangle, TrendingUp, Shield, Building2 } from 'lucide-react';

export function MarketplaceDashboard() {
    const [assets, setAssets] = useState<ScoredMarketplaceAsset[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<ScoredMarketplaceAsset | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMarketplaceAssets()
            .then(setAssets)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="animate-pulse h-96 bg-zinc-950 border border-zinc-800 rounded-xl" />;
    }

    const categoryIcon = (category: string) => {
        switch (category) {
            case 'REIT': return <Building2 size={16} />;
            case 'SGB': return <Shield size={16} />;
            default: return <TrendingUp size={16} />;
        }
    };

    return (
        <div className="space-y-6 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => (
                    <div
                        key={asset.id}
                        className={`flex flex-col bg-zinc-950 border rounded-xl overflow-hidden transition-all hover:border-zinc-700 ${asset.isHighlyRecommended ? 'border-emerald-900/50 shadow-lg shadow-emerald-950/10' : 'border-zinc-800'
                            }`}
                    >
                        {/* Header */}
                        <div className={`p-4 border-b ${asset.isHighlyRecommended ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-zinc-900/30 border-zinc-800'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    {categoryIcon(asset.category)}
                                    <span className="text-[10px] font-bold tracking-wider uppercase">{asset.category}</span>
                                </div>
                                {asset.isHighlyRecommended && (
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Top Match
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-100 leading-tight">{asset.name}</h3>
                            <p className="text-xs font-mono text-zinc-500 mt-1">{asset.ticker}</p>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 space-y-4">
                            <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{asset.description}</p>

                            <div className="grid grid-cols-2 gap-4 py-2 border-y border-zinc-800/50">
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Expected Return</p>
                                    <p className="text-lg font-medium text-zinc-200 tabular-nums">{asset.expectedReturn}% <span className="text-xs text-zinc-600 font-normal">p.a.</span></p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Min Investment</p>
                                    <p className="text-lg font-medium text-zinc-200 tabular-nums">₹{asset.minInvestment.toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            {/* X-Ray Intelligence */}
                            <div className={`p-3 rounded-lg border flex items-start gap-2 ${asset.isHighlyRecommended ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300' :
                                asset.diversificationScore < 50 ? 'bg-red-500/5 border-red-500/10 text-red-300' :
                                    'bg-zinc-900 border-zinc-800 text-zinc-300'
                                }`}>
                                {asset.diversificationScore < 50 ? <AlertTriangle size={16} className="mt-0.5 shrink-0" /> : <Shield size={16} className="mt-0.5 shrink-0" />}
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-wider mb-0.5 opacity-80">X-Ray Analysis</p>
                                    <p className="text-xs leading-relaxed">{asset.matchReason}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="p-4 pt-0">
                            <button
                                onClick={() => setSelectedAsset(asset)}
                                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${asset.isHighlyRecommended
                                    ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
                                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                    }`}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Asset Details Modal Trigger */}
            <AssetDetailModal
                asset={selectedAsset}
                onClose={() => setSelectedAsset(null)}
            />
        </div>
    );
}
