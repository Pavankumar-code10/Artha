import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "./prisma";

export async function getCurrentDatabaseUser() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    let user = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
    });

    if (user) {
        return user;
    }

    const clerkUser = await currentUser();

    if (!clerkUser) {
        return null;
    }

    user = await prisma.user.create({
        data: {
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
            firstName: clerkUser.firstName ?? null,
            lastName: clerkUser.lastName ?? null,
            imageUrl: clerkUser.imageUrl,
        },
    });

    return user;
}