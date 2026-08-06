"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentDatabaseUser } from "@/lib/auth";

import { MOCK_PORTFOLIO } from "../mock/portfolio";

export async function importMockPortfolio(
    institution: string
) {
    const user = await getCurrentDatabaseUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    return prisma.$transaction(async (tx) => {

        await tx.holding.deleteMany({
            where: {
                portfolio: {
                    userId: user.id,
                },
            },
        });

        await tx.portfolio.deleteMany({
            where: {
                userId: user.id,
            },
        });

        const portfolio = await tx.portfolio.create({
            data: {
                userId: user.id,
                name: "Primary Portfolio",
                institution,
                accountMasked: "XXXX4321",
                consentGiven: true,
                lastSyncedAt: new Date(),
            },
        });

        await tx.holding.createMany({
            data: MOCK_PORTFOLIO.map((holding) => ({
                portfolioId: portfolio.id,
                ...holding,
            })),
        });

        return portfolio.id;
    });
}