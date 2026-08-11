import { MarketplaceDashboard } from '@/features/marketplace/components/marketplace-dashboard';
import { Metadata } from 'next';
import { Activity } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Marketplace | Aartha',
};

export default function MarketplacePage() {
    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                        Alternative Marketplace
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Curated assets scored mathematically against your Portfolio X-Ray to ensure true diversification.
                    </p>
                </div>

                {/* Live Market Indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shrink-0">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-mono font-medium text-emerald-400 tracking-wider">
                        NSE / BSE LIVE FEED
                    </span>
                </div>
            </header>

            <main>
                <MarketplaceDashboard />
            </main>
        </div>
    );
}