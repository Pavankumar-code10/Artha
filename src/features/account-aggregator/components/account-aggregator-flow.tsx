"use client";

import { useState } from "react";

import type { Bank } from "../types/account-aggregator";
import { BankSelector } from "./bank-selector";
import { ConsentStep } from "./consent-step";
import { ImportProgress } from "./import-progress";
import { OTPForm } from "./otp-form";
import { SuccessStep } from "./success-step";

export type FlowStep =
    | "BANK"
    | "OTP"
    | "CONSENT"
    | "IMPORTING"
    | "SUCCESS";

export function AccountAggregatorFlow() {
    const [step, setStep] = useState<FlowStep>("BANK");
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

    switch (step) {
        case "BANK":
            return (
                <BankSelector
                    onContinue={(bank) => {
                        setSelectedBank(bank);
                        setStep("OTP");
                    }}
                />
            );

        case "OTP":
            return (
                <OTPForm
                    bank={selectedBank!}
                    onSuccess={() => setStep("CONSENT")}
                />
            );

        case "CONSENT":
            return (
                <ConsentStep
                    bank={selectedBank!}
                    onContinue={() => setStep("IMPORTING")}
                />
            );

        case "IMPORTING":
            return (
                <ImportProgress
                    bank={selectedBank!}
                    onCompleted={() => setStep("SUCCESS")}
                />
            );

        case "SUCCESS":
            return <SuccessStep bank={selectedBank!} />;

        default:
            return null;
    }
}