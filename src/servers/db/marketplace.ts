import { prisma } from "@/lib/prisma";

export async function getMarketplaceAssets() {
    return prisma.marketplaceAsset.findMany();
}