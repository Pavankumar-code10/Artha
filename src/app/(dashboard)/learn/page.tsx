import { LearnDashboard } from '@/features/learn/components/learn-dashboard';
import { GraduationCap, Zap } from 'lucide-react';

export const metadata = {
    title: 'Investor Academy | Aartha',
    description: 'Master financial concepts, earn XP, and unlock advanced alternative asset classes with AI-powered lessons.',
};

export default function LearnPage() {
    return (
        <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
            {/* Page Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
                        <GraduationCap size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-zinc-100 leading-tight">Investor Academy</h1>
                        <p className="text-xs text-zinc-500">Master markets. Earn XP. Unlock alternatives.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-4 py-2 rounded-xl">
                    <Zap size={13} className="text-violet-400" />
                    AI-Powered Missions
                </div>
            </header>

            <main>
                <LearnDashboard />
            </main>
        </div>
    );
}