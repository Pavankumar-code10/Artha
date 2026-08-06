import { AccountAggregatorFlow } from "@/features/account-aggregator/components/account-aggregator-flow";

export default function AccountAggregatorPage() {
    return (
        <div className="mx-auto flex max-w-3xl flex-col space-y-8">
            <div>
                <p className="text-sm font-medium text-primary">
                    Account Aggregator
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Connect Investment Account
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Securely connect your broker or bank to import your investment portfolio.
                </p>
            </div>

            <AccountAggregatorFlow />
        </div>
    );
}