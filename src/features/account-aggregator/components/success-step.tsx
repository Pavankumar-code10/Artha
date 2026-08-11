"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import type { Bank } from "../types/account-aggregator";

interface SuccessStepProps {
    bank: Bank;
}

export function SuccessStep({
    bank,
}: SuccessStepProps) {

    return (
        <div className="flex flex-col items-center justify-center p-12 bg-zinc-950 border border-emerald-900/40 rounded-2xl space-y-6 text-center">
            
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                <div className="relative h-20 w-20 bg-emerald-950/40 border border-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="text-emerald-400" size={40} />
                </div>
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-zinc-100">
                    Sync Successful
                </h2>
                <p className="text-sm text-zinc-400 max-w-sm">
                    Your portfolio from <strong className="text-zinc-200 font-semibold">{bank.name}</strong> has been securely imported into Aartha.
                </p>
            </div>
            
            <div className="w-full max-w-sm pt-4">
                <button
                    type="button"
                    onClick={() => {
                        window.location.href = "/portfolio";
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-semibold text-white transition-all hover:bg-emerald-700"
                >
                    View Portfolio Command Center <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}