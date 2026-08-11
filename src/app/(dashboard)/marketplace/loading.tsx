import { Activity } from 'lucide-react';

export default function MarketplaceLoading() {
    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                    Alternative Marketplace
                </h1>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                    <Activity size={14} className="animate-pulse" />
                    <span>ESTABLISHING SECURE CONNECTION TO MARKET FEED...</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden h-[340px]">
                        {/* Header Skeleton */}
                        <div className="p-4 border-b border-zinc-800 bg-zinc-900/30">
                            <div className="w-16 h-3 bg-zinc-800 rounded mb-3 animate-pulse"></div>
                            <div className="w-3/4 h-5 bg-zinc-800 rounded mb-2 animate-pulse"></div>
                            <div className="w-1/4 h-3 bg-zinc-800 rounded animate-pulse"></div>
                        </div>
                        {/* Body Skeleton */}
                        <div className="p-4 flex-1 space-y-4">
                            <div className="space-y-2">
                                <div className="w-full h-3 bg-zinc-800 rounded animate-pulse"></div>
                                <div className="w-5/6 h-3 bg-zinc-800 rounded animate-pulse"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-2 border-y border-zinc-800/50">
                                <div className="w-full h-8 bg-zinc-800/50 rounded animate-pulse"></div>
                                <div className="w-full h-8 bg-zinc-800/50 rounded animate-pulse"></div>
                            </div>
                            <div className="w-full h-12 bg-zinc-800/30 rounded animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}