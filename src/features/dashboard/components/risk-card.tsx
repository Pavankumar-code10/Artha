import { ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function RiskCard() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle className="text-base">
                        Portfolio Risk
                    </CardTitle>

                    <p className="mt-1 text-sm text-muted-foreground">
                        AI-powered portfolio assessment
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                    <ShieldAlert className="h-5 w-5 text-red-500" />
                </div>
            </CardHeader>

            <CardContent>
                <div className="mb-4 flex items-end justify-between">
                    <div>
                        <span className="text-4xl font-bold">
                            72
                        </span>

                        <span className="text-muted-foreground">
                            /100
                        </span>
                    </div>

                    <Badge variant="destructive">
                        High Risk
                    </Badge>
                </div>

                <Progress value={72} />

                <p className="mt-4 text-sm text-muted-foreground">
                    High concentration detected across overlapping equity holdings.
                </p>
            </CardContent>
        </Card>
    );
}