import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getCurrentDatabaseUser() {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        return null;
    }

    return prisma.user.findUnique({
        where: {
            clerkId,
        },
    });
}