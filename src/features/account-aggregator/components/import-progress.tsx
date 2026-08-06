"use client";

import { useEffect } from "react";

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

    useEffect(() => {

        async function runImport() {

            await importMockPortfolio(bank.name);

            onCompleted();

        }

        runImport();

    }, [bank, onCompleted]);

    return (
        <div className="space-y-6">

            <h2 className="text-3xl font-bold">
                Importing Portfolio
            </h2>

            <p className="text-muted-foreground">
                Importing holdings from {bank.name}...
            </p>

        </div>
    );
}