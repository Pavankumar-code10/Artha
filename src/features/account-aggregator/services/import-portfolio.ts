import { prisma } from "@/lib/prisma";

export async function importPortfolio(
    userId: string
) {
    return prisma.portfolio.create({
        data: {
            userId,
            name: "Primary Portfolio",
        },
    });
}