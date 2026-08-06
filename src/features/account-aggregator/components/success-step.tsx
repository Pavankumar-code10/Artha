// "use client";

// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// import type { Bank } from "../types/account-aggregator";

// interface Props {
//     bank: Bank;
// }

// export function SuccessStep({
//     bank,
// }: Props) {

//     const router = useRouter();

//     return (
//         <div className="space-y-6">

//             <h2 className="text-3xl font-bold">
//                 Portfolio Imported
//             </h2>

//             <p className="text-muted-foreground">
//                 Your {bank.name} portfolio has been imported successfully.
//             </p>

//             <Button
//                 onClick={() => router.push("/dashboard")}
//             >
//                 Go to Dashboard
//             </Button>

//         </div>
//     );
// }


"use client";

import { useRouter } from "next/navigation";

import type { Bank } from "../types/account-aggregator";

interface SuccessStepProps {
    bank: Bank;
}

export function SuccessStep({
    bank,
}: SuccessStepProps) {
    const router = useRouter();

    return (
        <div className="space-y-6 rounded-xl border p-8">
            <div>
                <h2 className="text-3xl font-bold">
                    Portfolio Imported Successfully
                </h2>

                <p className="mt-2 text-muted-foreground">
                    Your portfolio from <strong>{bank.name}</strong> has been
                    imported successfully.
                </p>
            </div>

            <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground hover:opacity-90"
            >
                Go to Dashboard
            </button>
        </div>
    );
}