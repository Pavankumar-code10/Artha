"use client";

import { Button } from "@/components/ui/button";

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
        <div className="space-y-6">

            <h2 className="text-2xl font-bold">
                Consent
            </h2>

            <p className="text-muted-foreground">
                Allow Aartha to securely read your holdings from {bank.name}.
            </p>

            <Button
                onClick={onContinue}
            >
                I Agree
            </Button>

        </div>
    );
}