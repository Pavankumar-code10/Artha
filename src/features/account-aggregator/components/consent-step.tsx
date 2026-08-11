"use client";

import { CheckCircle2, ShieldAlert } from "lucide-react";
import type { Bank } from "../types/account-aggregator";

interface Props {
    bank: Bank;
    onContinue: () => void;
}

export function ConsentStep({
    bank,
    onContinue,
}: Props) {
    return (
        <div className="space-y-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 lg:p-8">
            <div>
                <h2 className="text-xl font-bold text-zinc-100">
                    Data Consent Form
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                    Please review the permissions before allowing Aartha to connect with {bank.name}.
                </p>
            </div>

            <div className="space-y-3 bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3 uppercase tracking-wider">
                    Aartha will have access to:
                </h3>
                
                <div className="flex items-start gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="text-purple-500 mt-0.5 shrink-0" size={16} />
                    <p>Read-only access to your mutual fund, equity, and ETF holdings.</p>
                </div>
                <div className="flex items-start gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="text-purple-500 mt-0.5 shrink-0" size={16} />
                    <p>Read-only access to historical transaction data for P&L calculation.</p>
                </div>
            </div>

            <div className="space-y-3 bg-amber-950/10 border border-amber-900/30 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-amber-500 mb-3 uppercase tracking-wider">
                    Aartha will NEVER:
                </h3>
                
                <div className="flex items-start gap-3 text-sm text-zinc-300">
                    <ShieldAlert className="text-amber-500 mt-0.5 shrink-0" size={16} />
                    <p>Make trades or modify your portfolio in any way.</p>
                </div>
                <div className="flex items-start gap-3 text-sm text-zinc-300">
                    <ShieldAlert className="text-amber-500 mt-0.5 shrink-0" size={16} />
                    <p>Share your financial data with third-party marketers.</p>
                </div>
            </div>

            <p className="text-xs text-zinc-500 text-center px-4 leading-relaxed">
                By clicking "I Agree", you consent to the Digital Personal Data Protection Act (DPDPA) compliant data sharing framework governed by SEBI.
            </p>

            <button
                type="button"
                onClick={onContinue}
                className="w-full rounded-xl bg-purple-600 py-3.5 font-semibold text-white transition-all hover:bg-purple-700"
            >
                I Agree & Proceed
            </button>
        </div>
    );
}