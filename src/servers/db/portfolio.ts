import { prisma } from "@/lib/prisma";

export async function getPortfolio(
    userId: string
) {
    return prisma.portfolio.findMany({
        where: {
            userId,
        },
        include: {
            holdings: true,
        },
    });
}