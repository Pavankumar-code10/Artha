import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface StatsCardProps {
    title: string;
    value: string;
    description: string;
    change?: number;
    icon: LucideIcon;
}

export function StatsCard({
    title,
    value,
    description,
    change,
    icon: Icon,
}: StatsCardProps) {
    const isPositive = change !== undefined && change >= 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>

            <CardContent>
                <div className="text-2xl font-bold tracking-tight">
                    {value}
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs">
                    {change !== undefined && (
                        <span
                            className={
                                isPositive
                                    ? "flex items-center text-emerald-600"
                                    : "flex items-center text-red-600"
                            }
                        >
                            {isPositive ? (
                                <ArrowUpRight className="mr-1 h-3 w-3" />
                            ) : (
                                <ArrowDownRight className="mr-1 h-3 w-3" />
                            )}

                            {Math.abs(change)}%
                        </span>
                    )}

                    <span className="text-muted-foreground">
                        {description}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}