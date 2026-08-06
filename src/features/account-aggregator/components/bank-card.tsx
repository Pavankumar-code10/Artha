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
                "group relative flex w-full items-center gap-4 rounded-xl border bg-background p-4 text-left transition-all",
                "hover:border-primary hover:shadow-md",
                selected && "border-primary ring-2 ring-primary/20"
            )}
        >
            <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
                style={{
                    backgroundColor: bank.color,
                }}
            >
                {bank.name.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                    {bank.name}
                </p>

                <p className="text-sm text-muted-foreground">
                    Account Aggregator Supported
                </p>
            </div>

            {selected && (
                <Check className="h-5 w-5 text-primary" />
            )}
        </button>
    );
}