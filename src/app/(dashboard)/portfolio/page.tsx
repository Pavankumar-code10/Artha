import { getDashboardData } from '@/features/portfolio/server/sync-actions';
import { getPortfolioBriefing } from '@/features/portfolio/server/briefing-actions';
import { PortfolioDashboard } from '@/features/portfolio/components/portfolio-dashboard';

export const metadata = {
    title: 'Portfolio Dashboard | Aartha',
    description: 'Unified wealth command center — net worth, holdings, risk snapshot, and AI briefing.',
};

export default async function PortfolioPage() {
    const data = await getDashboardData();

    if (!data) {
        // Unauthenticated — layout will redirect, but handle gracefully
        return null;
    }

    // Fetch AI briefing server-side (won't block render if it fails — action handles errors)
    const briefing = await getPortfolioBriefing(
        data.holdings.map(h => ({
            assetName: h.assetName,
            assetType: h.assetType,
            currentValue: h.currentValue,
            investedValue: h.investedValue,
        }))
    );

    return (
        <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                    Wealth Overview
                </h1>
                <p className="text-sm text-zinc-400">
                    Your centralized command center for asset tracking and portfolio health.
                </p>
            </header>

            <PortfolioDashboard data={{
                user: data.user,
                holdings: data.holdings,
                lastSyncedAt: data.lastSyncedAt,
                hasConnectedAA: data.hasConnectedAA,
                fipName: data.fipName,
                briefing,
            }} />
        </div>
    );
}