import { XRayDashboard } from '@/features/portfolio-xray/components/xray-dashboard';

export const metadata = {
    title: 'Portfolio X-Ray | Aartha',
    description: 'AI-powered Portfolio Intelligence and Hidden Overlap Detection',
};

export default function PortfolioXRayPage() {
    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                    Portfolio X-Ray
                </h1>
                <p className="text-sm text-zinc-400">
                    Deep analysis of your true market exposure, hidden overlaps, and concentration risk.
                </p>
            </header>

            <main>
                <XRayDashboard />
            </main>
        </div>
    );
}