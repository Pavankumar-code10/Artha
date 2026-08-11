import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
    return (
        <div className="h-[75vh] w-full flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center">
                {/* Outer glowing ring */}
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                <Loader2 className="relative animate-spin text-purple-400" size={40} strokeWidth={1.5} />
            </div>
            <div className="space-y-1 text-center">
                <h3 className="text-sm font-semibold text-zinc-200 tracking-wider uppercase">
                    Aartha Engine
                </h3>
                <p className="text-xs font-mono text-zinc-500">
                    Syncing secure data streams...
                </p>
            </div>
        </div>
    );
}