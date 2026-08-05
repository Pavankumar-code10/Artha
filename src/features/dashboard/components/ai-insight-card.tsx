import { BrainCircuit, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function AIInsightCard() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <BrainCircuit className="h-5 w-5" />
                        Aartha Intelligence
                    </CardTitle>

                    <Badge variant="secondary">
                        <Sparkles className="mr-1 h-3 w-3" />
                        AI Insight
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                    Your portfolio appears diversified across multiple funds, but
                    several funds share the same underlying companies. This creates
                    hidden concentration risk that is not obvious from fund names alone.
                </p>

                <div className="mt-5 rounded-lg border bg-muted/40 p-4">
                    <p className="text-sm font-medium">
                        Primary concern
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Reliance Industries represents an estimated 18.4% of your
                        effective equity exposure.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}