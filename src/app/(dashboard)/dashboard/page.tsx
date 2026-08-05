import {
    IndianRupee,
    Layers3,
    TrendingUp,
} from "lucide-react";

import { AIInsightCard } from "@/features/dashboard/components/ai-insight-card";
import { AllocationCard } from "@/features/dashboard/components/allocation-card";
import { RiskCard } from "@/features/dashboard/components/risk-card";
import { StatsCard } from "@/features/dashboard/components/stats-card";

export default function DashboardPage() {
    return (
        <div className="mx-auto w-full max-w-7xl space-y-8">
            <section>
                <p className="text-sm font-medium text-primary">
                    Portfolio Overview
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                    Financial Intelligence
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Understand what you actually own and where your portfolio risk
                    comes from.
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <StatsCard
                    title="Net Worth"
                    value="₹12,45,000"
                    change={8.2}
                    description="vs. last month"
                    icon={IndianRupee}
                />

                <StatsCard
                    title="Invested Value"
                    value="₹9,75,000"
                    change={4.6}
                    description="across 21 assets"
                    icon={TrendingUp}
                />

                <StatsCard
                    title="Diversification"
                    value="68 / 100"
                    change={-3.4}
                    description="needs attention"
                    icon={Layers3}
                />
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <RiskCard />
                <AllocationCard />
            </section>

            <section>
                <AIInsightCard />
            </section>
        </div>
    );
}