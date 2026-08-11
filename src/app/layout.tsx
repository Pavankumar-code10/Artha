import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ThemeProvider, ThemeScript } from "@/features/settings/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aartha",
  description: "Financial Intelligence Platform",
};

async function getUserTheme(): Promise<"SYSTEM" | "LIGHT" | "DARK"> {
  try {
    const { userId } = await auth();
    if (!userId) return "DARK";
    const dbUser = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!dbUser) return "DARK";
    const settings = await prisma.userSettings.findUnique({ where: { userId: dbUser.id } });
    return (settings?.theme as "SYSTEM" | "LIGHT" | "DARK") ?? "DARK";
  } catch {
    return "DARK";
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getUserTheme();

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <head>
          <ThemeScript />
        </head>
        <body>
          <ThemeProvider theme={theme} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}