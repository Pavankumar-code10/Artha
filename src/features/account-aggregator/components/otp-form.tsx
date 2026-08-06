"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        <div className="space-y-6">

            <h2 className="text-2xl font-bold">
                Verify {bank.name}
            </h2>

            <p className="text-muted-foreground">
                Enter the 6-digit OTP.
            </p>

            <Input
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
            />

            <Button
                disabled={otp.length !== 6}
                onClick={onSuccess}
            >
                Verify OTP
            </Button>

        </div>
    );
}