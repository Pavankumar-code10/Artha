import { getUserProfileDetails } from '@/features/profile/server/profile-actions';
import { ShieldCheck, Trophy, User, Mail, Calendar, Link2, CheckCircle2, Award, Zap, Activity, BrainCircuit } from 'lucide-react';
import Image from 'next/image';
import { AAControls, AIPreferencesToggle } from '@/features/profile/components/profile-controls';

export const metadata = {
    title: 'Investor Profile | Aartha',
};

export default async function ProfilePage() {
    const profile = await getUserProfileDetails();

    if (!profile) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center text-zinc-400">
                Please sign in to view your investor profile.
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                    Investor Profile & Settings
                </h1>
                <p className="text-sm text-zinc-400">
                    Manage your regulatory profile, broker connections, and academy achievements.
                </p>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: User Card & Regulatory Status */}
                <div className="space-y-6">
                    <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-6 shadow-lg flex flex-col items-center text-center">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-purple-500/50 bg-zinc-900 flex items-center justify-center text-purple-400">
                            {profile.imageUrl ? (
                                <Image src={profile.imageUrl} alt={profile.fullName} fill className="object-cover" />
                            ) : (
                                <User size={40} />
                            )}
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-lg font-bold text-zinc-100">{profile.fullName}</h2>
                            <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                                <Mail size={12} />
                                <span className="truncate max-w-[200px]">{profile.email}</span>
                            </div>
                        </div>

                        <div className="w-full pt-4 border-t border-zinc-800/80 space-y-2.5 text-xs text-left">
                            <div className="flex justify-between text-zinc-400">
                                <span className="flex items-center gap-1.5"><Calendar size={13} /> Member Since</span>
                                <span className="font-mono text-zinc-200">{profile.createdAt}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> KYC Status</span>
                                <span className={`font-bold flex items-center gap-1 ${(profile.kycStatus || 'UNVERIFIED') === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    <CheckCircle2 size={12} /> SEBI {profile.kycStatus || 'UNVERIFIED'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Regulatory Profile & Risk Suitability */}
                    <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4 shadow-lg">
                        <div className="flex items-center gap-2 text-blue-400 border-b border-zinc-800/80 pb-3">
                            <Activity size={18} />
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-100">Regulatory Risk Profile</h3>
                        </div>
                        <div className="space-y-4 pt-2">
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-semibold">Investor Classification</p>
                                <p className="text-sm font-bold text-zinc-200 mt-0.5">{(profile.investorType || 'RETAIL').replace('_', ' ')}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-semibold flex justify-between">
                                    Risk Tolerance Index
                                    <span className="text-blue-400 font-mono">{profile.riskToleranceScore || 50}/100</span>
                                </p>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${(profile.suitabilityCategory || 'MODERATE') === 'CONSERVATIVE' ? 'bg-emerald-500' : (profile.suitabilityCategory || 'MODERATE') === 'MODERATE' ? 'bg-blue-500' : 'bg-rose-500'}`} 
                                        style={{ width: `${profile.riskToleranceScore || 50}%` }} 
                                    />
                                </div>
                                <p className="text-xs font-semibold text-zinc-400 mt-2">Suitability: <span className="text-zinc-200">{profile.suitabilityCategory || 'MODERATE'}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right 2 Columns: Status Panels */}
                <div className="md:col-span-2 space-y-6">
                    {/* Account Aggregator Status */}
                    <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4 shadow-lg">
                        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                            <div className="flex items-center gap-2 text-purple-400">
                                <Link2 size={18} />
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-100">Account Aggregator Feed</h3>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${profile.hasConnectedAA
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}>
                                {profile.hasConnectedAA ? 'LIVE SYNC ACTIVE' : 'PENDING CONNECTION'}
                            </span>
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Your financial holdings are synchronized via Sahamati Account Aggregator network to ensure privacy-first SEBI X-Ray analysis.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                            <div className="p-3 bg-zinc-900/50 border border-zinc-800/60 rounded-lg col-span-2 md:col-span-1">
                                <p className="text-[10px] text-zinc-500 uppercase font-semibold">Active Holdings</p>
                                <p className="text-lg font-mono font-bold text-zinc-200 mt-0.5">{profile.holdingsCount} Assets</p>
                            </div>
                            <div className="p-3 bg-zinc-900/50 border border-zinc-800/60 rounded-lg col-span-2 md:col-span-1">
                                <p className="text-[10px] text-zinc-500 uppercase font-semibold">FIP Handle</p>
                                <p className="text-sm font-mono font-bold text-zinc-200 mt-1 truncate">{profile.aaConsentDetails?.fipName || 'None'}</p>
                            </div>
                            <div className="p-3 bg-zinc-900/50 border border-zinc-800/60 rounded-lg col-span-2">
                                <p className="text-[10px] text-zinc-500 uppercase font-semibold">Last Synced</p>
                                <p className="text-sm font-mono font-bold text-zinc-200 mt-1">{profile.aaConsentDetails?.lastSyncedAt || 'Never'}</p>
                            </div>
                        </div>

                        <AAControls hasConnectedAA={profile.hasConnectedAA} />
                    </div>

                    {/* Academy Rank & Gamification */}
                    <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4 shadow-lg">
                        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                            <div className="flex items-center gap-2 text-yellow-400">
                                <Trophy size={18} />
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-100">Investor Academy Rank</h3>
                            </div>
                            <span className="text-xs font-mono font-bold text-yellow-400 flex items-center gap-1">
                                <Zap size={14} fill="currentColor" /> {profile.totalXp} XP
                            </span>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-950/30 to-indigo-950/20 border border-purple-800/30 rounded-xl">
                            <span className="text-3xl">{profile.rank.icon}</span>
                            <div>
                                <p className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">Current Status</p>
                                <h4 className="text-lg font-bold text-zinc-100" style={{ color: profile.rank.color }}>
                                    {profile.rank.name}
                                </h4>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-zinc-400 pt-1">
                            <span className="flex items-center gap-1"><Award size={14} className="text-purple-400" /> Completed Modules</span>
                            <span className="font-mono font-bold text-zinc-200">{profile.completedModulesCount} / 6</span>
                        </div>
                    </div>

                    {/* AI & System Preferences */}
                    <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4 shadow-lg">
                        <div className="flex items-center gap-2 text-purple-400 border-b border-zinc-800/80 pb-3">
                            <BrainCircuit size={18} />
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-100">System Preferences</h3>
                        </div>
                        
                        <AIPreferencesToggle initialConsent={profile.aiContextConsent ?? true} />
                    </div>
                </div>
            </div>
        </div>
    );
}