import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
    "/portfolio(.*)",
    "/marketplace(.*)",
    "/learn(.*)",
    "/profile(.*)",
    "/settings(.*)",
    "/copilot(.*)",
    "/account-aggregator(.*)",
    "/portfolio-xray(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        "/((?!_next|.*\\..*).*)",
        "/(api|trpc)(.*)",
    ],
};