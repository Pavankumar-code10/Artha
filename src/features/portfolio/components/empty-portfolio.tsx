'use client';

import { useState, useTransition } from 'react';
import { syncAccountAggregator } from '../server/sync-actions';
import { Link2, ShieldCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function EmptyPortfolio() {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const router = useRouter(); // Initialize the Next.js router

    const handleConnect = () => {
        startTransition(async () => {
            try {
                await syncAccountAggregator();
                setSuccess(true);
                // FORCE SERVER RE-RENDER: A hard navigation guarantees the client-side router 
                // cache is busted and the new DB state is fetched.
                window.location.href = '/portfolio';
            } catch (error) {
                console.error("Sync failed", error);
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-center p-12 bg-zinc-950 border border-zinc-800 rounded-xl max-w-2xl mx-auto mt-10 space-y-6 text-center shadow-2xl">
            <div className="h-16 w-16 bg-purple-900/20 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-400 mb-2">
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
                SEBI Regulated & Encrypted Sync
            </div>

            <button
                onClick={handleConnect}
                disabled={isPending || success}
                className="mt-4 w-full max-w-sm py-3 px-4 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
                {isPending ? (
                    <><Loader2 size={18} className="animate-spin" /> Syncing Brokers...</>
                ) : success ? (
                    "Sync Complete! Loading Dashboard..."
                ) : (
                    "Connect via Account Aggregator"
                )}
            </button>
        </div>
    );
}