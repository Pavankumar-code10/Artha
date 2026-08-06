// import Link from "next/link";
// import { Wallet } from "lucide-react";

// import { buttonVariants } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// export function EmptyPortfolio() {
//     return (
//         <Card className="border-dashed">
//             <CardContent className="flex flex-col items-center py-16">
//                 <Wallet className="mb-5 h-12 w-12 text-primary" />

//                 <h2 className="text-2xl font-semibold">
//                     No Portfolio Connected
//                 </h2>

//                 <p className="mt-3 max-w-lg text-center text-muted-foreground">
//                     Connect your investment account to analyze hidden overlap,
//                     diversification, concentration risk, and AI-powered
//                     insights.
//                 </p>

//                 <Link
//                     href="/account-aggregator"
//                     className={buttonVariants({ variant: "default", className: "mt-8" })}
//                 >
//                     Connect Account
//                 </Link>
//             </CardContent>
//         </Card>
//     );
// }


import Link from "next/link";

export function EmptyPortfolio() {
    return (
        <div className="flex flex-col items-center py-20">
            <h2 className="text-3xl font-bold">
                No Portfolio Connected
            </h2>

            <p className="mt-4 text-muted-foreground">
                Connect your first investment account.
            </p>

            <Link
                href="/account-aggregator"
                className="mt-8 rounded-lg bg-primary px-5 py-2 text-primary-foreground"
            >
                Connect Account
            </Link>
        </div>
    );
}