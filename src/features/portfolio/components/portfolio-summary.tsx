import {
    Building2,
    IndianRupee,
    Layers3,
    TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioMetrics } from "../types";

interface PortfolioSummaryProps {
    metrics: PortfolioMetrics;
    lastSyncedAt?: Date | null;
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
}

export function PortfolioSummary({
    metrics,
    lastSyncedAt,
}: PortfolioSummaryProps) {
    const cards = [
        {
            title: "Current Value",
            value: formatCurrency(metrics.currentValue),
            subtitle: "Live portfolio value",
            icon: IndianRupee,
        },
        {
            title: "Invested",
            value: formatCurrency(metrics.investedValue),
            subtitle: "Total invested amount",
            icon: TrendingUp,
        },
        {
            title: "Profit / Loss",
            value: formatCurrency(metrics.gainLoss),
            subtitle: `${metrics.gainLossPercentage.toFixed(2)}% overall`,
            icon: TrendingUp,
        },
        {
            title: "Holdings",
            value: metrics.holdingsCount.toString(),
            subtitle: "Assets imported",
            icon: Layers3,
        },
        {
            title: "Accounts",
            value: metrics.portfoliosCount.toString(),
            subtitle: "Connected institutions",
            icon: Building2,
        },
        {
            title: "Last Sync",
            value: lastSyncedAt
                ? new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                }).format(lastSyncedAt)
                : "Never",
            subtitle: "Account Aggregator",
            icon: Building2,
        },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {card.title}
                            </CardTitle>

                            <Icon className="h-5 w-5 text-primary" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {card.value}
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {card.subtitle}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </section>
    );
}