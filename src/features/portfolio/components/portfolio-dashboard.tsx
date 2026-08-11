'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import {
    Wallet, TrendingUp, TrendingDown, ArrowRight,
    BarChart2, Zap, Shield, RefreshCw, ShieldCheck,
    BrainCircuit, Activity, AlertTriangle, CheckCircle2, Link2
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { syncAccountAggregator } from '../server/sync-actions';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Holding {
    id: string;
    assetName: string;
    symbol: string | null;
    assetType: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    investedValue: number;
    currentValue: number;
}

interface DashboardData {
    user: { firstName: string | null; riskCategory: string };
    holdings: Holding[];
    lastSyncedAt: string | null;
    hasConnectedAA: boolean;
    fipName: string | null;
    briefing: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const ASSET_COLORS: Record<string, string> = {
    STOCK: '#7c3aed', MUTUAL_FUND: '#3b82f6', ETF: '#0ea5e9',
    BOND: '#10b981', REIT: '#f59e0b', INVIT: '#f97316',
    GOLD: '#eab308', CASH: '#6b7280',
};
const ASSET_LABELS: Record<string, string> = {
    STOCK: 'Stocks', MUTUAL_FUND: 'Mutual Funds', ETF: 'ETFs',
    BOND: 'Bonds', REIT: 'REITs', INVIT: 'InvITs', GOLD: 'Gold', CASH: 'Cash',
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent }: {
    label: string; value: string; sub?: string;
    icon: React.ReactNode; accent: string;
}) {
    return (
        <div className="p-5 rounded-2xl border bg-zinc-950 flex flex-col gap-3" style={{ borderColor: `${accent}30` }}>
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</span>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}18` }}>
                    <span style={{ color: accent }}>{icon}</span>
                </div>
            </div>
            <div>
                <p className="text-2xl font-black font-mono" style={{ color: accent }}>{value}</p>
                {sub && <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

function PieTooltipContent({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 shadow-2xl">
            <p className="text-xs font-bold text-zinc-200">{payload[0].name}</p>
            <p className="text-xs text-zinc-400">₹{payload[0].value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            <p className="text-xs font-bold" style={{ color: payload[0].payload.fill }}>{payload[0].payload.percent}%</p>
        </div>
    );
}

function PnlBadge({ invested, current }: { invested: number; current: number }) {
    const diff = current - invested;
    const pct = invested > 0 ? (diff / invested) * 100 : 0;
    const isUp = diff >= 0;
    return (
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {isUp ? '+' : ''}{pct.toFixed(2)}%
        </span>
    );
}

// ── HHI Calculator ────────────────────────────────────────────────────────────
function computeHHI(holdings: Holding[]): { hhi: number; topSector: string; topPct: number; level: 'LOW' | 'MEDIUM' | 'HIGH' } {
    const total = holdings.reduce((s, h) => s + h.currentValue, 0);
    if (total === 0) return { hhi: 0, topSector: 'N/A', topPct: 0, level: 'LOW' };
    const map: Record<string, number> = {};
    for (const h of holdings) {
        map[h.assetType] = (map[h.assetType] || 0) + h.currentValue;
    }
    const hhi = Object.values(map).reduce((s, v) => s + Math.pow((v / total) * 100, 2), 0);
    const [topSector, topVal] = Object.entries(map).sort((a, b) => b[1] - a[1])[0] ?? ['N/A', 0];
    const topPct = (topVal / total) * 100;
    const level = hhi > 2500 ? 'HIGH' : hhi > 1500 ? 'MEDIUM' : 'LOW';
    return { hhi: Math.round(hhi), topSector, topPct, level };
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
    const [isPending, startTransition] = useTransition();
    const [done, setDone] = useState(false);

    const handleConnect = () => startTransition(async () => {
        await syncAccountAggregator();
        setDone(true);
        window.location.href = '/portfolio';
    });

    return (
        <div className="flex flex-col items-center justify-center p-12 bg-zinc-950 border border-zinc-800 rounded-2xl max-w-2xl mx-auto mt-8 space-y-6 text-center shadow-2xl">
            <div className="h-16 w-16 bg-purple-900/20 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-400">
                <Link2 size={32} />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-zinc-100">No Portfolio Connected</h2>
                <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
                    Connect your broker securely via the Sahamati Account Aggregator network to import your holdings and unlock AI-powered X-Ray insights.
                </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/30 border border-emerald-900/50 rounded-full text-emerald-400 text-xs font-medium">
                <ShieldCheck size={14} />
                SEBI Regulated &amp; 256-bit Encrypted Sync
            </div>
            <button
                onClick={handleConnect}
                disabled={isPending || done}
                className="mt-2 w-full max-w-sm py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
                {isPending ? <><RefreshCw size={16} className="animate-spin" /> Syncing Brokers…</> :
                 done ? 'Sync Complete! Loading…' : 'Connect via Account Aggregator'}
            </button>
            <div className="grid grid-cols-3 gap-3 w-full text-center pt-2">
                {['Zerodha', 'Groww', 'HDFC Demat'].map(b => (
                    <div key={b} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-500">{b}</div>
                ))}
            </div>
        </div>
    );
}

// ── AA Sync Status Bar ────────────────────────────────────────────────────────
function SyncStatusBar({ lastSyncedAt, fipName }: { lastSyncedAt: string | null; fipName: string | null }) {
    const [syncing, startSync] = useTransition();

    const handleReSync = () => startSync(async () => {
        await syncAccountAggregator();
        window.location.reload();
    });

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl">
            <div className="flex items-center gap-3">
                <div className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                    <p className="text-xs font-bold text-emerald-400">Sahamati AA Feed — LIVE SYNC</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                        {fipName ?? 'Zerodha / Groww / HDFC'} · Last synced: {lastSyncedAt ?? 'Never'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] text-emerald-500 bg-emerald-950/40 border border-emerald-900/40 px-2 py-1 rounded-full">
                    <ShieldCheck size={10} /> 256-bit SEBI Encrypted
                </span>
                <button
                    onClick={handleReSync}
                    disabled={syncing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-semibold text-zinc-300 transition-colors"
                >
                    <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
                    {syncing ? 'Syncing…' : 'Re-Sync'}
                </button>
            </div>
        </div>
    );
}

// ── AI Briefing Card ──────────────────────────────────────────────────────────
function AIBriefingCard({ briefing }: { briefing: string }) {
    return (
        <div className="p-5 bg-gradient-to-br from-purple-950/30 to-indigo-950/20 border border-purple-800/30 rounded-2xl flex gap-4">
            <div className="h-10 w-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 flex-shrink-0">
                <BrainCircuit size={20} />
            </div>
            <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-purple-300 uppercase tracking-wider">AI Copilot Daily Briefing</p>
                    <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-purple-400">Gemini Flash</span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{briefing}</p>
                <Link href="/copilot" className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-1 transition-colors">
                    Ask AI Copilot a question <ArrowRight size={11} />
                </Link>
            </div>
        </div>
    );
}

// ── HHI Risk Snapshot ─────────────────────────────────────────────────────────
function RiskSnapshot({ holdings }: { holdings: Holding[] }) {
    const { hhi, topSector, topPct, level } = computeHHI(holdings);
    const LEVEL_COLORS = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#f43f5e' };
    const color = LEVEL_COLORS[level];

    return (
        <div className="p-5 bg-zinc-950 border border-zinc-800/60 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-zinc-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Concentration Risk (HHI)</h3>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full font-bold border" style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
                    {level} RISK
                </span>
            </div>
            <div>
                <p className="text-3xl font-black font-mono" style={{ color }}>{hhi.toLocaleString()}</p>
                <p className="text-xs text-zinc-500 mt-1">SEBI safe zone: below 1,500</p>
            </div>
            {level !== 'LOW' && (
                <div className="flex items-start gap-2 p-3 bg-amber-950/20 border border-amber-900/30 rounded-lg">
                    <AlertTriangle size={13} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-300/80">
                        {ASSET_LABELS[topSector] ?? topSector} accounts for <strong>{topPct.toFixed(1)}%</strong> of your portfolio — exceeds recommended sector cap.
                    </p>
                </div>
            )}
            {level === 'LOW' && (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 size={13} />
                    Portfolio is well-diversified across asset classes.
                </div>
            )}
            <Link
                href="/portfolio-xray"
                className="flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: 'white' }}
            >
                <Zap size={13} /> Run Full X-Ray Analysis
            </Link>
        </div>
    );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export function PortfolioDashboard({ data }: { data: DashboardData }) {
    const { holdings, lastSyncedAt, hasConnectedAA, fipName, briefing, user } = data;

    const totalInvested = useMemo(() => holdings.reduce((s, h) => s + h.investedValue, 0), [holdings]);
    const totalCurrent = useMemo(() => holdings.reduce((s, h) => s + h.currentValue, 0), [holdings]);
    const totalPnl = totalCurrent - totalInvested;
    const totalPnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
    const isProfit = totalPnl >= 0;

    const allocationData = useMemo(() => {
        const map: Record<string, number> = {};
        for (const h of holdings) map[h.assetType] = (map[h.assetType] || 0) + h.currentValue;
        return Object.entries(map).map(([type, value]) => ({
            name: ASSET_LABELS[type] || type,
            value: Math.round(value),
            fill: ASSET_COLORS[type] || '#6b7280',
            percent: totalCurrent > 0 ? ((value / totalCurrent) * 100).toFixed(1) : '0',
        }));
    }, [holdings, totalCurrent]);

    const [search, setSearch] = useState('');
    const filteredHoldings = useMemo(() =>
        holdings.filter(h =>
            h.assetName.toLowerCase().includes(search.toLowerCase()) ||
            (h.symbol ?? '').toLowerCase().includes(search.toLowerCase())
        ), [holdings, search]);

    if (holdings.length === 0) return <EmptyState />;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* ── AA Sync Status Bar ── */}
            {hasConnectedAA && (
                <SyncStatusBar lastSyncedAt={lastSyncedAt} fipName={fipName} />
            )}

            {/* ── AI Daily Briefing ── */}
            <AIBriefingCard briefing={briefing} />

            {/* ── Module 1: Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Net Worth"
                    value={`₹${Math.round(totalCurrent).toLocaleString('en-IN')}`}
                    sub={`Across ${holdings.length} holdings`}
                    icon={<Wallet size={16} />} accent="#7c3aed"
                />
                <StatCard
                    label="Total Invested"
                    value={`₹${Math.round(totalInvested).toLocaleString('en-IN')}`}
                    sub="Capital deployed"
                    icon={<BarChart2 size={16} />} accent="#3b82f6"
                />
                <StatCard
                    label="Unrealised P&L"
                    value={`${isProfit ? '+' : ''}₹${Math.round(totalPnl).toLocaleString('en-IN')}`}
                    sub={`${isProfit ? '+' : ''}${totalPnlPct.toFixed(2)}% overall return`}
                    icon={isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    accent={isProfit ? '#10b981' : '#f43f5e'}
                />
                <StatCard
                    label="Asset Classes"
                    value={`${allocationData.length}`}
                    sub={`Risk profile: ${user.riskCategory}`}
                    icon={<Shield size={16} />} accent="#f59e0b"
                />
            </div>

            {/* ── Module 3: Allocation Chart + HHI Risk + X-Ray CTA ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Pie Chart */}
                <div className="lg:col-span-3 bg-zinc-950 border border-zinc-800/60 rounded-2xl p-5">
                    <div className="mb-4">
                        <h3 className="font-bold text-zinc-100">Asset Allocation</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">Portfolio distribution by asset class</p>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={allocationData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                                {allocationData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} stroke="transparent" />
                                ))}
                            </Pie>
                            <Tooltip content={<PieTooltipContent />} />
                            <Legend iconType="circle" iconSize={8}
                                wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }}
                                formatter={val => <span style={{ color: '#a1a1aa' }}>{val}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* HHI Risk + X-Ray CTA */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <RiskSnapshot holdings={holdings} />
                    {/* Quick allocation breakdown */}
                    <div className="bg-zinc-950 border border-zinc-800/60 rounded-2xl p-4 space-y-2">
                        {allocationData.slice(0, 5).map(a => (
                            <div key={a.name} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: a.fill }} />
                                    <span className="text-xs text-zinc-400 truncate">{a.name}</span>
                                </div>
                                <span className="text-xs font-bold font-mono" style={{ color: a.fill }}>{a.percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Module 5: Holdings Ledger Table ── */}
            <div className="bg-zinc-950 border border-zinc-800/60 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800/60 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="font-bold text-zinc-100">Holdings Ledger</h3>
                        <p className="text-xs text-zinc-500">{holdings.length} assets · Live AA data</p>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or ticker…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 w-56"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 border-b border-zinc-800/50">
                                <th className="px-5 py-3 text-left">Asset</th>
                                <th className="px-5 py-3 text-left">Type</th>
                                <th className="px-5 py-3 text-right">Qty</th>
                                <th className="px-5 py-3 text-right">Avg Price</th>
                                <th className="px-5 py-3 text-right">Current</th>
                                <th className="px-5 py-3 text-right">Value</th>
                                <th className="px-5 py-3 text-right">Allocation</th>
                                <th className="px-5 py-3 text-right">P&L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHoldings.map(h => {
                                const alloc = totalCurrent > 0 ? ((h.currentValue / totalCurrent) * 100).toFixed(1) : '0';
                                return (
                                    <tr key={h.id} className="border-b border-zinc-800/30 hover:bg-zinc-900/30 transition-colors group">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                                                    style={{ background: `${ASSET_COLORS[h.assetType] || '#6b7280'}20`, color: ASSET_COLORS[h.assetType] || '#6b7280' }}
                                                >
                                                    {(h.symbol || h.assetName).slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-zinc-200 text-xs leading-tight">{h.assetName}</p>
                                                    <p className="text-[10px] text-zinc-600 font-mono">{h.symbol ?? '—'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-[10px] px-2 py-0.5 rounded font-bold border"
                                                style={{ color: ASSET_COLORS[h.assetType], borderColor: `${ASSET_COLORS[h.assetType]}30`, background: `${ASSET_COLORS[h.assetType]}10` }}>
                                                {ASSET_LABELS[h.assetType] ?? h.assetType}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right font-mono text-zinc-400 text-xs">{h.quantity}</td>
                                        <td className="px-5 py-3.5 text-right font-mono text-zinc-400 text-xs">₹{h.averagePrice.toLocaleString('en-IN')}</td>
                                        <td className="px-5 py-3.5 text-right font-mono text-zinc-300 text-xs">₹{h.currentPrice.toLocaleString('en-IN')}</td>
                                        <td className="px-5 py-3.5 text-right font-mono font-bold text-zinc-100 text-xs">₹{Math.round(h.currentValue).toLocaleString('en-IN')}</td>
                                        <td className="px-5 py-3.5 text-right font-mono text-zinc-400 text-xs">{alloc}%</td>
                                        <td className="px-5 py-3.5 text-right">
                                            <PnlBadge invested={h.investedValue} current={h.currentValue} />
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredHoldings.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-8 text-center text-zinc-600 text-sm">
                                        No holdings match &quot;{search}&quot;
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}