import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Bank } from "../types/account-aggregator";

interface BankCardProps {
    bank: Bank;
    selected: boolean;
    onSelect: (bank: Bank) => void;
}

export function BankCard({
    bank,
    selected,
    onSelect,
}: BankCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(bank)}
            className={cn(
                "group relative flex w-full items-center gap-4 rounded-xl border bg-zinc-950 p-4 text-left transition-all",
                "hover:border-purple-500/50 hover:bg-zinc-900",
                selected ? "border-purple-500 ring-1 ring-purple-500/50 bg-purple-950/20" : "border-zinc-800"
            )}
        >
            <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm"
                style={{ backgroundColor: bank.color }}
            >
                {bank.name.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-zinc-200 text-sm">
                    {bank.name}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                    Sahamati AA Supported
                </p>
            </div>

            {selected && (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white">
                    <Check className="h-3 w-3" />
                </div>
            )}
        </button>
    );
}