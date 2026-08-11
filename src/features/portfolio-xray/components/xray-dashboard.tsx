'use client';

import { useEffect, useState } from 'react';
import { getPortfolioXRay } from '../server/actions';
import { XRayResult } from '../engine';
import { ResponsiveContainer, Treemap, Tooltip as RechartsTooltip } from 'recharts';
import { AlertTriangle, Layers, PieChart, ShieldAlert, Activity } from 'lucide-react';
import { AIAnalystCard } from '@/features/ai-analyst/components/AIAnalystCard';

export function XRayDashboard() {
    const [data, setData] = useState<XRayResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getPortfolioXRay()
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[600px] bg-zinc-950 border border-zinc-800 rounded-lg animate-pulse flex items-center justify-center">
                <Activity className="text-zinc-600 animate-spin" size={32} />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-6 bg-red-950/20 border border-red-900/50 rounded-lg text-red-400 text-sm font-mono">
                [SYS_ERR] {error || 'Failed to initialize X-Ray Engine.'}
            </div>
        );
    }

    // Aggregate true sector exposure for the Treemap
    const sectorMap = new Map<string, { name: string; size: number; value: number }>();
    data.companyExposures.forEach(exp => {
        const existing = sectorMap.get(exp.sector) || { name: exp.sector, size: 0, value: 0 };
        existing.size += exp.percentageOfPortfolio;
        existing.value += exp.totalValue;
        sectorMap.set(exp.sector, existing);
    });
    const treeMapData = Array.from(sectorMap.values());

    return (
        <div className="space-y-6 font-sans text-zinc-100">
            {/* Top Metrics Cards */}
            {/* ... existing metric cards ... */}

            {/* Treemap & Critical Overlaps */}
            {/* ... existing treemap & table grid ... */}

            {/* Phase 3: AI Intelligence Integration */}
            <AIAnalystCard />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-zinc-400 mb-3">
                        <PieChart size={14} />
                        <h3 className="text-xs font-semibold uppercase tracking-wider">True Portfolio Value</h3>
                    </div>
                    <p className="text-3xl font-medium tabular-nums tracking-tight">
                        ₹{data.totalPortfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                </div>

                <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Layers size={14} />
                            <h3 className="text-xs font-semibold uppercase tracking-wider">Hidden Overlaps</h3>
                        </div>
                        {data.hiddenOverlaps.length > 0 && (
                            <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                        )}
                    </div>
                    <p className="text-3xl font-medium tabular-nums tracking-tight">{data.hiddenOverlaps.length}</p>
                    <p className="text-xs text-zinc-500 mt-2">Assets held across multiple sources</p>
                </div>

                <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-zinc-400 mb-3">
                        <ShieldAlert size={14} />
                        <h3 className="text-xs font-semibold uppercase tracking-wider">Concentration (HHI)</h3>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <p className="text-3xl font-medium tabular-nums tracking-tight">
                            {Math.round(data.concentrationScore.hhi)}
                        </p>
                        <span className={`text-xs font-bold px-2 py-1 rounded bg-zinc-900 border ${data.concentrationScore.riskLevel === 'HIGH' ? 'text-red-400 border-red-900/50' :
                            data.concentrationScore.riskLevel === 'MEDIUM' ? 'text-yellow-400 border-yellow-900/50' :
                                'text-emerald-400 border-emerald-900/50'
                            }`}>
                            {data.concentrationScore.riskLevel} RISK
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* True Sector Allocation Treemap */}
                <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">
                        True Sector Allocation
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <Treemap
                                data={treeMapData}
                                dataKey="size"
                                aspectRatio={4 / 3}
                                stroke="#18181b"
                                fill="#27272a"
                            >
                                <RechartsTooltip
                                    formatter={(value: any) => [`${Number(value).toFixed(2)}%`, 'True Exposure']}
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', fontSize: '12px' }}
                                    itemStyle={{ color: '#f4f4f5' }}
                                />
                            </Treemap>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Hidden Overlaps Data Table */}
                <div className="lg:col-span-3 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                            Critical Overlaps Detected
                        </h3>
                        <AlertTriangle className="text-yellow-500" size={16} />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-950 border-b border-zinc-800">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Underlying Asset</th>
                                    <th className="px-5 py-3 font-medium">Exposure Sources</th>
                                    <th className="px-5 py-3 font-medium text-right">True Weight</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {data.hiddenOverlaps.map((overlap) => (
                                    <tr key={overlap.ticker} className="hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-zinc-200">{overlap.securityName}</div>
                                            <div className="text-xs text-zinc-500 font-mono mt-0.5">{overlap.ticker}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                {overlap.heldDirectly && (
                                                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                                                        Direct
                                                    </span>
                                                )}
                                                {overlap.fundCount > 0 && (
                                                    <span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                                                        {overlap.fundCount} {overlap.fundCount === 1 ? 'Fund' : 'Funds'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right tabular-nums font-medium text-zinc-200">
                                            {overlap.totalPercentage.toFixed(2)}%
                                        </td>
                                    </tr>
                                ))}
                                {data.hiddenOverlaps.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-5 py-8 text-center text-zinc-500">
                                            No hidden overlaps detected in your portfolio.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}