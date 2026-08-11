'use server';

import { prisma } from '@/lib/prisma';
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// ── JIT helper ────────────────────────────────────────────────────────────────
async function getOrCreateDbUser() {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error('Unauthorized');

    const clerkUser = await currentUser();

    let dbUser = await prisma.user.findFirst({ where: { clerkId: clerkUserId } });
    if (!dbUser) {
        dbUser = await prisma.user.create({
            data: {
                id: clerkUserId,
                clerkId: clerkUserId,
                email: clerkUser?.emailAddresses[0]?.emailAddress ?? `${clerkUserId}@aartha.fin`,
                firstName: clerkUser?.firstName ?? 'Retail',
                lastName: clerkUser?.lastName ?? 'Investor',
            },
        });
    }
    return { dbUser, clerkUserId, clerkUser };
}

// ── Audit logger ──────────────────────────────────────────────────────────────
async function logAudit(userId: string, actionType: string, metadata?: string) {
    await prisma.auditLog.create({ data: { userId, actionType, metadata } });
}

// ── GET settings ──────────────────────────────────────────────────────────────
export async function getUserSettings() {
    const { dbUser, clerkUser } = await getOrCreateDbUser();

    // JIT-provision UserSettings if missing
    let settings = await prisma.userSettings.findUnique({ where: { userId: dbUser.id } });
    if (!settings) {
        settings = await prisma.userSettings.create({ data: { userId: dbUser.id } });
    }

    // Last 10 audit events
    const auditLogs = await prisma.auditLog.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
    });

    return {
        // Identity
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? 'N/A',
        fullName: `${clerkUser?.firstName ?? ''} ${clerkUser?.lastName ?? ''}`.trim(),
        // Display prefs
        theme: settings.theme,
        numberFormat: settings.numberFormat,
        timezone: settings.timezone,
        // AI & Privacy
        sharePortfolioWithAI: settings.sharePortfolioWithAI,
        storeChatHistory: settings.storeChatHistory,
        allowAnonymousTelemetry: settings.allowAnonymousTelemetry,
        // Notifications
        hhiAlertsEnabled: settings.hhiAlertsEnabled,
        hhiThreshold: settings.hhiThreshold,
        sectorConcentrationPct: settings.sectorConcentrationPct,
        newAssetListings: settings.newAssetListings,
        sebiCirculars: settings.sebiCirculars,
        emailAlertsEnabled: settings.emailAlertsEnabled,
        pushNotifications: settings.pushNotifications,
        inAppAlerts: settings.inAppAlerts,
        // Audit
        auditLogs: auditLogs.map(l => ({
            id: l.id,
            actionType: l.actionType,
            metadata: l.metadata,
            createdAt: l.createdAt.toLocaleString('en-IN'),
        })),
    };
}

// ── UPDATE display preferences ────────────────────────────────────────────────
export async function updateDisplaySettings(data: {
    theme: 'SYSTEM' | 'LIGHT' | 'DARK';
    numberFormat: 'INDIAN' | 'WESTERN';
    timezone: string;
}) {
    const { dbUser } = await getOrCreateDbUser();
    await prisma.userSettings.upsert({
        where: { userId: dbUser.id },
        create: { userId: dbUser.id, ...data },
        update: data,
    });
    await logAudit(dbUser.id, 'DISPLAY_PREFS_UPDATED', JSON.stringify(data));
    revalidatePath('/settings');
    return { success: true };
}

// ── UPDATE AI / Privacy settings ──────────────────────────────────────────────
export async function updatePrivacySettings(data: {
    sharePortfolioWithAI: boolean;
    storeChatHistory: boolean;
    allowAnonymousTelemetry: boolean;
}) {
    const { dbUser } = await getOrCreateDbUser();
    await prisma.userSettings.upsert({
        where: { userId: dbUser.id },
        create: { userId: dbUser.id, ...data },
        update: data,
    });
    // Mirror aiContextConsent on User model as well
    await prisma.user.update({
        where: { id: dbUser.id },
        data: { aiContextConsent: data.sharePortfolioWithAI },
    });
    await logAudit(dbUser.id, 'PRIVACY_SETTINGS_UPDATED', JSON.stringify(data));
    revalidatePath('/settings');
    revalidatePath('/profile');
    return { success: true };
}

// ── UPDATE notification preferences ──────────────────────────────────────────
export async function updateNotificationSettings(data: {
    hhiAlertsEnabled: boolean;
    hhiThreshold: number;
    sectorConcentrationPct: number;
    newAssetListings: boolean;
    sebiCirculars: boolean;
    emailAlertsEnabled: boolean;
    pushNotifications: boolean;
    inAppAlerts: boolean;
}) {
    const { dbUser } = await getOrCreateDbUser();
    await prisma.userSettings.upsert({
        where: { userId: dbUser.id },
        create: { userId: dbUser.id, ...data },
        update: data,
    });
    await logAudit(dbUser.id, 'NOTIFICATION_PREFS_UPDATED');
    revalidatePath('/settings');
    return { success: true };
}

// ── EXPORT user data (JSON) ───────────────────────────────────────────────────
export async function exportUserData() {
    const { dbUser } = await getOrCreateDbUser();

    const [user, portfolios, progress, settings, auditLogs] = await Promise.all([
        prisma.user.findUnique({ where: { id: dbUser.id } }),
        prisma.portfolio.findMany({ where: { userId: dbUser.id }, include: { holdings: true } }),
        prisma.learningProgress.findMany({ where: { userId: dbUser.id } }),
        prisma.userSettings.findUnique({ where: { userId: dbUser.id } }),
        prisma.auditLog.findMany({ where: { userId: dbUser.id }, orderBy: { createdAt: 'desc' } }),
    ]);

    await logAudit(dbUser.id, 'DATA_EXPORTED');

    return JSON.stringify(
        { exportedAt: new Date().toISOString(), user, portfolios, learningProgress: progress, settings, auditLogs },
        null,
        2
    );
}

// ── DELETE account (Right to be Forgotten) ────────────────────────────────────
export async function deleteAccount() {
    const { dbUser, clerkUserId } = await getOrCreateDbUser();

    // Cascade delete from Postgres (holdings, portfolios, progress, settings, auditLogs all cascade)
    await prisma.user.delete({ where: { id: dbUser.id } });

    // Delete from Clerk
    const client = await clerkClient();
    await client.users.deleteUser(clerkUserId);

    return { success: true };
}

// ── CLEAR chat history ─────────────────────────────────────────────────────────
export async function clearChatHistory() {
    const { dbUser } = await getOrCreateDbUser();
    // Chat history persistence is not yet in DB — this is a placeholder that logs the intent
    await logAudit(dbUser.id, 'CHAT_HISTORY_CLEARED');
    return { success: true };
}
