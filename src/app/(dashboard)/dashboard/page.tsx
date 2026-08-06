// import { getCurrentDatabaseUser } from "@/lib/auth";

// import { EmptyPortfolio, PortfolioSummary } from "@/features/portfolio/components";
// import { getPortfolioDashboard } from "@/features/portfolio/services/portfolio.service";

// export default async function DashboardPage() {
//     const user = await getCurrentDatabaseUser();

//     if (!user) {
//         return null;
//     }

//     const dashboard = await getPortfolioDashboard(user.id);

//     return (
//         <div className="mx-auto w-full max-w-7xl space-y-8">
//             <section>
//                 <p className="text-sm font-medium text-primary">
//                     Portfolio Overview
//                 </p>

//                 <h1 className="mt-1 text-3xl font-bold tracking-tight">
//                     Financial Intelligence
//                 </h1>

//                 <p className="mt-2 text-muted-foreground">
//                     Understand what you actually own and where your portfolio
//                     risk comes from.
//                 </p>
//             </section>

//             {dashboard.portfolios.length === 0 ? (
//                 <EmptyPortfolio />
//             ) : (
//                 <PortfolioSummary
//                     metrics={dashboard.metrics}
//                     lastSyncedAt={dashboard.lastSyncedAt}
//                 />
//             )}
//         </div>
//     );
// }


import { EmptyPortfolio } from "@/features/portfolio/components/empty-portfolio";

export default function DashboardPage() {
    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <section>
                <p className="text-sm font-medium text-primary">
                    Portfolio Overview
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                    Financial Intelligence
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Understand what you actually own and where your portfolio
                    risk comes from.
                </p>
            </section>

            <EmptyPortfolio />
        </div>
    );
}