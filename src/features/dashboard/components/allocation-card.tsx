import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const allocations = [
    {
        name: "Equity",
        percentage: 60,
    },
    {
        name: "Debt",
        percentage: 25,
    },
    {
        name: "Gold",
        percentage: 10,
    },
    {
        name: "Cash",
        percentage: 5,
    },
];

export function AllocationCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">
                    Asset Allocation
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
                {allocations.map((asset) => (
                    <div
                        key={asset.name}
                        className="space-y-2"
                    >
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                                {asset.name}
                            </span>

                            <span className="text-muted-foreground">
                                {asset.percentage}%
                            </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                    width: `${asset.percentage}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}