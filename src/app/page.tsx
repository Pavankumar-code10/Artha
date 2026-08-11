import Link from 'next/link';
import { ArrowRight, BrainCircuit, ShieldCheck, TrendingUp, Landmark, ShieldAlert, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-purple-500/30 overflow-x-hidden">
            
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
            </div>

            {/* Navigation Bar */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Landmark className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Aartha</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/sign-in" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                        Sign In
                    </Link>
                    <Link href="/portfolio">
                        <Button className="rounded-full bg-white text-zinc-950 hover:bg-zinc-200 font-semibold px-6 shadow-sm">
                            Open App
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center text-center pt-24 pb-16 px-6 max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    <ShieldCheck size={14} />
                    SEBI & DPDPA Compliant Platform
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                    Next-Gen Wealth <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-500">
                        Command Center
                    </span>
                </h1>
                
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
                    Aartha unifies your fragmented investments through the Sahamati Account Aggregator network and provides institutional-grade AI analysis for retail investors.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link href="/portfolio">
                        <Button size="lg" className="rounded-full h-14 px-8 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-0 shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all hover:scale-105 font-bold">
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </main>

            {/* Features Grid */}
            <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl hover:border-purple-500/50 transition-colors group">
                        <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <BrainCircuit className="h-6 w-6 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-100 mb-3">AI Financial Copilot</h3>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            Powered by Gemini 2.0 Flash. Ask natural questions about your portfolio, market events, and macroeconomic impacts in real-time.
                        </p>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl hover:border-blue-500/50 transition-colors group">
                        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Code className="h-6 w-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-100 mb-3">Sahamati AA Network</h3>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            Connect multiple brokers instantly using SEBI's Account Aggregator framework. Zero credential sharing, 100% cryptographic security.
                        </p>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl hover:border-emerald-500/50 transition-colors group">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <TrendingUp className="h-6 w-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-100 mb-3">Deep Portfolio X-Ray</h3>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            Uncover hidden sector overlaps in your mutual funds. Monitor your HHI concentration risk and prevent silent overexposure.
                        </p>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-zinc-900 mt-10">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <ShieldAlert size={16} />
                        <span>Aartha does not store your banking credentials. 256-bit AES encryption.</span>
                    </div>
                    <div className="text-zinc-600 text-sm">
                        © {new Date().getFullYear()} Aartha Financial.
                    </div>
                </div>
            </footer>

        </div>
    );
}