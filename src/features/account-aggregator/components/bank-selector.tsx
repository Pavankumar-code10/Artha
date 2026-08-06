"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";

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
            <Input
                placeholder="Search bank or broker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid gap-3">
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
                className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
                Continue
            </button>
        </div>
    );
}