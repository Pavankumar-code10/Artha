"use client";

import { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import type { Bank } from "../types/account-aggregator";

interface Props {
    bank: Bank;
    onSuccess: () => void;
}

export function OTPForm({
    bank,
    onSuccess,
}: Props) {
    const [otp, setOtp] = useState("");

    return (
        <div className="space-y-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-4 border-b border-zinc-800/60 pb-6">
                <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm"
                    style={{ backgroundColor: bank.color }}
                >
                    {bank.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-zinc-100">
                        Verify {bank.name} Account
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Enter the 6-digit OTP sent to your registered mobile number.
                    </p>
                </div>
            </div>

            <div className="space-y-4 pt-2">
                <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        One Time Password
                    </label>
                    <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="••••••"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-center text-2xl tracking-[0.5em] text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30">
                    <ShieldCheck size={16} />
                    Secured by 256-bit encryption. Aartha does not store your banking credentials.
                </div>
            </div>

            <button
                type="button"
                disabled={otp.length !== 6}
                onClick={onSuccess}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 font-semibold text-white transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Verify & Continue <ArrowRight size={16} />
            </button>
        </div>
    );
}