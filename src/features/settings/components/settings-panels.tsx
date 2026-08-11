'use client';

import { useState, useTransition } from 'react';
import {
    updateDisplaySettings, updatePrivacySettings,
    updateNotificationSettings, exportUserData, deleteAccount, clearChatHistory
} from '../server/settings-actions';
import { setGlobalTheme } from './theme-provider';
import {
    Monitor, Sun, Moon, Shield, Database, Trash2,
    Download, RefreshCw, CheckCircle2, AlertTriangle, Lock,
    BrainCircuit, Activity, Layers, Bell
} from 'lucide-react';

type Settings = Awaited<ReturnType<typeof import('../server/settings-actions').getUserSettings>>;

// ── Reusable Toggle ───────────────────────────────────────────────────────────
function Toggle({ value, onChange, disabled }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
    return (
        <button
            onClick={() => onChange(!value)}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${value ? 'bg-purple-600' : 'bg-zinc-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ icon, title, color, children }: {
    icon: React.ReactNode; title: string; color: string; children: React.ReactNode;
}) {
    return (
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl shadow-lg space-y-5">
            <div className={`flex items-center gap-2 border-b border-zinc-800/80 pb-3 ${color}`}>
                {icon}
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-100">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function Row({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
                <p className="text-sm font-medium text-zinc-200">{label}</p>
                {sublabel && <p className="text-xs text-zinc-500">{sublabel}</p>}
            </div>
            {children}
        </div>
    );
}

function SaveBtn({ pending, onClick }: { pending: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            disabled={pending}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
        >
            {pending ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
            {pending ? 'Saving…' : 'Save Changes'}
        </button>
    );
}

// ── MODULE 1: Display Preferences ─────────────────────────────────────────────
export function DisplayPanel({ initial }: { initial: Pick<Settings, 'theme' | 'numberFormat' | 'timezone'> }) {
    const [theme, setTheme] = useState(initial.theme);
    const [numberFormat, setNumberFormat] = useState(initial.numberFormat);
    const [timezone, setTimezone] = useState(initial.timezone);
    const [pending, start] = useTransition();
    const [saved, setSaved] = useState(false);

    const save = () => start(async () => {
        await updateDisplaySettings({ theme: theme as any, numberFormat: numberFormat as any, timezone });
        // apply number format globally
        document.documentElement.setAttribute('data-number-format', numberFormat);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    });

    const handleThemeChange = (val: string) => {
        setTheme(val as any);
        // Apply immediately — no save required for preview
        setGlobalTheme(val as any);
        // persist preference locally so next reload keeps it before DB responds
        try { localStorage.setItem('aartha-theme', val); } catch {}
    };

    const themes = [
        { value: 'SYSTEM', label: 'System', icon: <Monitor size={14} /> },
        { value: 'LIGHT', label: 'Light', icon: <Sun size={14} /> },
        { value: 'DARK', label: 'Bloomberg Dark', icon: <Moon size={14} /> },
    ];

    return (
        <Section icon={<Monitor size={18} />} title="Platform & Display" color="text-blue-400">
            <Row label="Theme" sublabel="Click to preview instantly. Hit Save Changes to persist.">
                <div className="flex gap-2">
                    {themes.map(t => (
                        <button
                            key={t.value}
                            onClick={() => handleThemeChange(t.value)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${theme === t.value ? 'bg-purple-600 border-purple-500 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>
            </Row>
            <Row label="Number Format" sublabel="How monetary values are displayed">
                <div className="flex gap-2">
                    {[{ value: 'INDIAN', label: '₹1,00,000' }, { value: 'WESTERN', label: '₹100,000' }].map(f => (
                        <button
                            key={f.value}
                            onClick={() => setNumberFormat(f.value as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${numberFormat === f.value ? 'bg-purple-600 border-purple-500 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </Row>
            <Row label="Timezone" sublabel="Used for alert scheduling and timestamps">
                <select
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                >
                    <option value="Asia/Kolkata">IST — Asia/Kolkata (UTC+5:30)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">EST — New York</option>
                    <option value="Europe/London">GMT — London</option>
                </select>
            </Row>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                {saved && <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} />Saved</span>}
                {!saved && <span />}
                <SaveBtn pending={pending} onClick={save} />
            </div>
        </Section>
    );
}

// ── MODULE 2: AI & Privacy Controls ───────────────────────────────────────────
export function PrivacyPanel({ initial }: { initial: Pick<Settings, 'sharePortfolioWithAI' | 'storeChatHistory' | 'allowAnonymousTelemetry'> }) {
    const [share, setShare] = useState(initial.sharePortfolioWithAI);
    const [history, setHistory] = useState(initial.storeChatHistory);
    const [telemetry, setTelemetry] = useState(initial.allowAnonymousTelemetry);
    const [pending, start] = useTransition();
    const [clearPending, startClear] = useTransition();
    const [saved, setSaved] = useState(false);

    const save = () => start(async () => {
        await updatePrivacySettings({ sharePortfolioWithAI: share, storeChatHistory: history, allowAnonymousTelemetry: telemetry });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    });

    const clearHistory = () => startClear(async () => {
        await clearChatHistory();
        alert('Chat history cleared successfully.');
    });

    return (
        <Section icon={<BrainCircuit size={18} />} title="AI Copilot & Privacy" color="text-purple-400">
            <Row label="Portfolio Context Sharing" sublabel="Allow Gemini AI to read real-time holdings for personalized answers">
                <Toggle value={share} onChange={setShare} />
            </Row>
            <Row label="Store Chat History" sublabel="Retain AI conversation logs for continuity across sessions">
                <Toggle value={history} onChange={setHistory} />
            </Row>
            <Row label="Anonymous Telemetry" sublabel="Share anonymized usage patterns to improve the platform (DPDPA compliant)">
                <Toggle value={telemetry} onChange={setTelemetry} />
            </Row>
            <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg flex items-start gap-2.5">
                <Shield size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-300/80">
                    Your financial data is <strong>never</strong> used to train foundational AI models.
                    This is guaranteed under India&apos;s DPDP Act, 2023.
                </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                <button
                    onClick={clearHistory}
                    disabled={clearPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 border border-red-900/50 bg-red-950/20 hover:bg-red-900/30 rounded-lg transition-colors"
                >
                    <Trash2 size={12} /> {clearPending ? 'Clearing…' : 'Clear Chat History'}
                </button>
                <div className="flex items-center gap-3">
                    {saved && <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} />Saved</span>}
                    <SaveBtn pending={pending} onClick={save} />
                </div>
            </div>
        </Section>
    );
}

// ── MODULE 3: Notification Preferences ────────────────────────────────────────
export function NotificationsPanel({ initial }: {
    initial: Pick<Settings, 'hhiAlertsEnabled' | 'hhiThreshold' | 'sectorConcentrationPct' | 'newAssetListings' | 'sebiCirculars' | 'emailAlertsEnabled' | 'pushNotifications' | 'inAppAlerts'>
}) {
    const [s, setS] = useState(initial);
    const [pending, start] = useTransition();
    const [saved, setSaved] = useState(false);
    const set = (k: keyof typeof s, v: any) => setS(prev => ({ ...prev, [k]: v }));

    const save = () => start(async () => {
        await updateNotificationSettings(s as any);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    });

    return (
        <Section icon={<Bell size={18} />} title="Risk Alerts & Notifications" color="text-yellow-400">
            <p className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Portfolio Alerts</p>
            <Row label="HHI Concentration Alert" sublabel="Trigger when portfolio HHI exceeds threshold">
                <Toggle value={s.hhiAlertsEnabled} onChange={v => set('hhiAlertsEnabled', v)} />
            </Row>
            {s.hhiAlertsEnabled && (
                <div className="pl-4 border-l-2 border-zinc-800 space-y-3">
                    <Row label={`HHI Threshold: ${s.hhiThreshold}`} sublabel="Recommended: below 2,500 for diversified portfolios">
                        <input
                            type="range" min={500} max={10000} step={100}
                            value={s.hhiThreshold}
                            onChange={e => set('hhiThreshold', Number(e.target.value))}
                            className="w-32 accent-purple-500"
                        />
                    </Row>
                    <Row label={`Sector Cap: ${s.sectorConcentrationPct}%`} sublabel="Alert if any single sector exceeds this % of NAV">
                        <input
                            type="range" min={10} max={80} step={5}
                            value={s.sectorConcentrationPct}
                            onChange={e => set('sectorConcentrationPct', Number(e.target.value))}
                            className="w-32 accent-purple-500"
                        />
                    </Row>
                </div>
            )}
            <p className="text-xs text-zinc-500 uppercase font-semibold tracking-wider pt-2">Market Updates</p>
            <Row label="New Asset Listings" sublabel="Get notified when new REITs, InvITs, or bonds appear in Marketplace">
                <Toggle value={s.newAssetListings} onChange={v => set('newAssetListings', v)} />
            </Row>
            <Row label="SEBI Circular Summaries" sublabel="AI-summarized regulatory updates from SEBI">
                <Toggle value={s.sebiCirculars} onChange={v => set('sebiCirculars', v)} />
            </Row>
            <p className="text-xs text-zinc-500 uppercase font-semibold tracking-wider pt-2">Delivery Channels</p>
            <Row label="Email Alerts" sublabel="Receive alerts via registered email address">
                <Toggle value={s.emailAlertsEnabled} onChange={v => set('emailAlertsEnabled', v)} />
            </Row>
            <Row label="Push Notifications" sublabel="Browser push notifications (requires permission)">
                <Toggle value={s.pushNotifications} onChange={v => set('pushNotifications', v)} />
            </Row>
            <Row label="In-App Dashboard Alerts" sublabel="Show alert banners inside the platform">
                <Toggle value={s.inAppAlerts} onChange={v => set('inAppAlerts', v)} />
            </Row>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                {saved && <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} />Saved</span>}
                {!saved && <span />}
                <SaveBtn pending={pending} onClick={save} />
            </div>
        </Section>
    );
}

// ── MODULE 4: Data Sovereignty & Compliance ───────────────────────────────────
export function DataSovereigntyPanel({ email }: { email: string }) {
    const [exporting, startExport] = useTransition();
    const [deleting, startDelete] = useTransition();

    const handleExport = () => startExport(async () => {
        const json = await exportUserData();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aartha-data-export-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    const handleDelete = () => startDelete(async () => {
        const confirmed = confirm(
            `⚠️ IRREVERSIBLE ACTION\n\nThis will permanently delete your account, all portfolio data, and learning progress.\n\nType your email to confirm: ${email}`
        );
        if (!confirmed) return;
        await deleteAccount();
        window.location.href = '/';
    });

    return (
        <Section icon={<Database size={18} />} title="Data Sovereignty & DPDPA Compliance" color="text-emerald-400">
            <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg flex items-start gap-2.5">
                <Lock size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-emerald-300/80">
                    Your data is stored exclusively on Indian servers in compliance with SEBI data localization
                    guidelines and the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>.
                </p>
            </div>
            <Row label="Export Your Data" sublabel="Download a full JSON archive of portfolio, X-Ray history, and progress">
                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-semibold text-zinc-300 transition-colors"
                >
                    {exporting ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
                    {exporting ? 'Generating…' : 'Export JSON'}
                </button>
            </Row>
            <Row label="Account Aggregator Consent" sublabel="Revoke all Sahamati FIU data sharing permissions">
                <a
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-semibold text-zinc-300 transition-colors"
                >
                    <Layers size={13} /> Manage in Profile →
                </a>
            </Row>
            <div className="pt-4 border-t border-red-900/30">
                <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle size={16} />
                        <h3 className="text-sm font-bold">Right to be Forgotten</h3>
                    </div>
                    <p className="text-xs text-zinc-400">
                        Permanently deletes your Aartha account, all portfolio data, learning progress, and removes
                        your Clerk authentication record. This action is <strong className="text-red-400">irreversible</strong>.
                    </p>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/60 border border-red-700/50 rounded-lg text-xs font-bold text-red-400 transition-colors"
                    >
                        {deleting ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        {deleting ? 'Deleting Account…' : 'Delete My Account Permanently'}
                    </button>
                </div>
            </div>
        </Section>
    );
}

// ── MODULE 5: Audit Log ───────────────────────────────────────────────────────
export function AuditLogPanel({ logs }: { logs: Settings['auditLogs'] }) {
    const ACTION_COLORS: Record<string, string> = {
        DATA_EXPORTED: 'text-blue-400',
        PRIVACY_SETTINGS_UPDATED: 'text-purple-400',
        NOTIFICATION_PREFS_UPDATED: 'text-yellow-400',
        DISPLAY_PREFS_UPDATED: 'text-zinc-400',
        CHAT_HISTORY_CLEARED: 'text-red-400',
        MFA_ENABLED: 'text-emerald-400',
    };

    return (
        <Section icon={<Activity size={18} />} title="Compliance Audit Log" color="text-zinc-400">
            <p className="text-xs text-zinc-500">Last 10 security and settings events for your account.</p>
            {logs.length === 0 ? (
                <p className="text-sm text-zinc-600 text-center py-4">No events logged yet.</p>
            ) : (
                <div className="space-y-2">
                    {logs.map(log => (
                        <div key={log.id} className="flex items-start justify-between p-3 bg-zinc-900/50 border border-zinc-800/60 rounded-lg">
                            <div className="space-y-0.5">
                                <p className={`text-xs font-mono font-bold ${ACTION_COLORS[log.actionType] ?? 'text-zinc-300'}`}>
                                    {log.actionType}
                                </p>
                                {log.metadata && (
                                    <p className="text-[10px] text-zinc-600 truncate max-w-xs">{log.metadata}</p>
                                )}
                            </div>
                            <span className="text-[10px] text-zinc-600 font-mono whitespace-nowrap ml-4">{log.createdAt}</span>
                        </div>
                    ))}
                </div>
            )}
        </Section>
    );
}
