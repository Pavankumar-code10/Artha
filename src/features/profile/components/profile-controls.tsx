'use client';

import { useState, useTransition } from 'react';
import { ShieldAlert, RefreshCw, Trash2, CheckCircle2, Lock, Shield } from 'lucide-react';
import { revokeAAConsent, updateAIPreferences } from '../server/profile-actions';
import { syncAccountAggregator } from '@/features/portfolio/server/sync-actions';

export function AAControls({ hasConnectedAA }: { hasConnectedAA: boolean }) {
    const [isPending, startTransition] = useTransition();

    if (!hasConnectedAA) {
        return (
            <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800/80">
                <button
                    onClick={() => {
                        startTransition(async () => {
                            await syncAccountAggregator();
                            window.location.reload();
                        });
                    }}
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-950/20 hover:bg-emerald-900/40 border border-emerald-900/50 rounded-lg text-xs font-semibold text-emerald-400 transition-colors"
                >
                    <RefreshCw size={14} className={isPending ? 'animate-spin' : ''} />
                    Connect Sahamati AA
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800/80">
            <button
                onClick={() => {
                    startTransition(async () => {
                        await syncAccountAggregator();
                        window.location.reload();
                    });
                }}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 transition-colors"
            >
                <RefreshCw size={14} className={isPending ? 'animate-spin' : ''} />
                Re-sync Feed
            </button>
            <button
                onClick={() => {
                    if (confirm('Are you sure you want to revoke consent? This will delete your synced portfolio.')) {
                        startTransition(async () => {
                            await revokeAAConsent();
                            window.location.reload();
                        });
                    }
                }}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-950/20 hover:bg-red-900/40 border border-red-900/50 rounded-lg text-xs font-semibold text-red-400 transition-colors"
            >
                <Trash2 size={14} />
                Revoke Consent
            </button>
        </div>
    );
}

export function AIPreferencesToggle({ initialConsent }: { initialConsent: boolean }) {
    const [consent, setConsent] = useState(initialConsent);
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        const newConsent = !consent;
        setConsent(newConsent);
        startTransition(async () => {
            await updateAIPreferences(newConsent);
        });
    };

    return (
        <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
            <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <Shield size={14} className="text-purple-400" /> AI Portfolio Processing
                </h4>
                <p className="text-xs text-zinc-400 max-w-sm">
                    Allow the AI Copilot to analyze your portfolio state for personalized insights.
                </p>
            </div>
            <button
                onClick={handleToggle}
                disabled={isPending}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${consent ? 'bg-purple-600' : 'bg-zinc-700'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${consent ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );
}
