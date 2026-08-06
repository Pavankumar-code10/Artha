import { ConnectButton } from "@/features/account-aggregator/components/connect-button";

export function EmptyPortfolio() {
    return (
        <div className="flex flex-col items-center rounded-xl border border-dashed py-20">
            <h2 className="text-3xl font-bold">
                No Portfolio Connected
            </h2>

            <p className="mt-4 max-w-lg text-center text-muted-foreground">
                Connect your broker or bank to unlock Portfolio X-Ray,
                diversification analysis and AI insights.
            </p>

            <div className="mt-8">
                <ConnectButton />
            </div>
        </div>
    );
}