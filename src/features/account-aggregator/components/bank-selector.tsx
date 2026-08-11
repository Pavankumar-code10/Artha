"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { BANKS } from "../mock/banks";
import type { Bank } from "../types/account-aggregator";
import { BankCard } from "./bank-card";

interface BankSelectorProps {
    onContinue: (bank: Bank) => void;
}

export function BankSelector({
    onContinue,
}: BankSelectorProps) {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Bank | null>(null);

    const filteredBanks = useMemo(() => {
        return BANKS.filter((bank) =>
            bank.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
                <input
                    type="text"
                    placeholder="Search for your bank or broker..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredBanks.map((bank) => (
                    <BankCard
                        key={bank.id}
                        bank={bank}
                        selected={selected?.id === bank.id}
                        onSelect={setSelected}
                    />
                ))}
            </div>

            <button
                type="button"
                disabled={!selected}
                onClick={() => selected && onContinue(selected)}
                className="w-full rounded-xl bg-purple-600 py-3 font-semibold text-white transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Continue securely
            </button>
        </div>
    );
}