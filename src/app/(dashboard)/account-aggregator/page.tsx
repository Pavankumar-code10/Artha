import { AccountAggregatorFlow } from "@/features/account-aggregator/components/account-aggregator-flow";
import { Link2 } from "lucide-react";

export const metadata = {
    title: "Account Aggregator | Aartha",
};

export default function AccountAggregatorPage() {
    return (
        <div className="mx-auto flex max-w-3xl flex-col space-y-8 p-6 lg:p-8 animate-in fade-in duration-500">
            <header className="space-y-2">
                <div className="flex items-center gap-2 text-purple-400">
                    <Link2 size={20} />
                    <p className="text-sm font-bold uppercase tracking-widest">
                        Sahamati Account Aggregator
                    </p>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
                    Connect Investment Account
                </h1>
                <p className="text-sm text-zinc-400">
                    Securely connect your broker or bank via SEBI's Account Aggregator framework to import your portfolio.
                </p>
            </header>

            <AccountAggregatorFlow />
        </div>
    );
}