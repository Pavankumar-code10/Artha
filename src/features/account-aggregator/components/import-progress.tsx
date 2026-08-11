"use client";

import { useEffect, useState } from "react";
import { Loader2, Database } from "lucide-react";

import { importMockPortfolio } from "../server/import-portfolio";
import type { Bank } from "../types/account-aggregator";

interface Props {
    bank: Bank;
    onCompleted: () => void;
}

export function ImportProgress({
    bank,
    onCompleted,
}: Props) {
    const [statusText, setStatusText] = useState("Establishing secure connection...");

    useEffect(() => {
        let isMounted = true;
        
        async function runImport() {
            try {
                // Simulate progressive loading states for UX
                setTimeout(() => { if (isMounted) setStatusText("Decrypting payload via Sahamati AA..."); }, 1000);
                setTimeout(() => { if (isMounted) setStatusText("Syncing holdings into Portfolio engine..."); }, 2500);
                
                await importMockPortfolio(bank.name);
                
                if (isMounted) {
                    setStatusText("Sync completed successfully!");
                    setTimeout(onCompleted, 500); // small delay to show completion text
                }
            } catch (error) {
                console.error("Import failed", error);
                if (isMounted) setStatusText("Failed to sync. Please try again.");
            }
        }

        runImport();
        
        return () => { isMounted = false; };
    }, [bank, onCompleted]);

    return (
        <div className="flex flex-col items-center justify-center p-12 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-6 text-center">
            <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                <div className="relative h-16 w-16 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Database className="text-purple-400 animate-pulse" size={28} />
                </div>
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-bold text-zinc-100 flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin text-purple-500" />
                    Importing Wealth Data
                </h2>
                <p className="text-sm text-zinc-400 max-w-sm">
                    {statusText}
                </p>
            </div>
            
            <div className="w-full max-w-xs bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-purple-500 animate-[progress_3s_ease-in-out_infinite]" />
            </div>
        </div>
    );
}