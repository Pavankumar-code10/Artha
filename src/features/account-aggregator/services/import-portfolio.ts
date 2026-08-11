import { prisma } from "@/lib/prisma";

export async function importPortfolio(
    userId: string,
    institution: string = 'Unknown',
    accountMasked: string = 'XXXX'
) {
    return prisma.portfolio.create({
        data: {
            userId,
            name: "Primary Portfolio",
            institution,
            accountMasked,
        },
    });
}