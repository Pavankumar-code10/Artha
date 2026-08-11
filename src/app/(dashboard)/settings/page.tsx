import { getUserSettings } from '@/features/settings/server/settings-actions';
import {
    DisplayPanel,
    PrivacyPanel,
    NotificationsPanel,
    DataSovereigntyPanel,
    AuditLogPanel,
} from '@/features/settings/components/settings-panels';
import { Settings } from 'lucide-react';

export const metadata = {
    title: 'Settings | Aartha',
    description: 'Configure AI privacy, notification alerts, display preferences, and DPDPA-compliant data controls.',
};

export default async function SettingsPage() {
    const settings = await getUserSettings();

    return (
        <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <header className="space-y-1">
                <div className="flex items-center gap-2.5">
                    <Settings size={22} className="text-purple-400" />
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                        Platform Settings
                    </h1>
                </div>
                <p className="text-sm text-zinc-400 pl-9">
                    Configure AI context boundaries, risk alert thresholds, display preferences, and data sovereignty controls.
                </p>
            </header>

            {/* Module 1 — Display */}
            <DisplayPanel initial={{
                theme: settings.theme,
                numberFormat: settings.numberFormat,
                timezone: settings.timezone,
            }} />

            {/* Module 2 — AI & Privacy */}
            <PrivacyPanel initial={{
                sharePortfolioWithAI: settings.sharePortfolioWithAI,
                storeChatHistory: settings.storeChatHistory,
                allowAnonymousTelemetry: settings.allowAnonymousTelemetry,
            }} />

            {/* Module 3 — Notifications */}
            <NotificationsPanel initial={{
                hhiAlertsEnabled: settings.hhiAlertsEnabled,
                hhiThreshold: settings.hhiThreshold,
                sectorConcentrationPct: settings.sectorConcentrationPct,
                newAssetListings: settings.newAssetListings,
                sebiCirculars: settings.sebiCirculars,
                emailAlertsEnabled: settings.emailAlertsEnabled,
                pushNotifications: settings.pushNotifications,
                inAppAlerts: settings.inAppAlerts,
            }} />

            {/* Module 4 — Data Sovereignty */}
            <DataSovereigntyPanel email={settings.email} />

            {/* Module 5 — Audit Log */}
            <AuditLogPanel logs={settings.auditLogs} />
        </div>
    );
}
