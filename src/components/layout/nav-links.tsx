"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function NavLinks() {
    const pathname = usePathname();

    return (
        <nav className="space-y-1">
            {navigation.map((item) => {
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            pathname === item.href
                                ? "bg-blue-600 text-white"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <Icon className="h-5 w-5" />
                        {item.title}
                    </Link>
                );
            })}
        </nav>
    );
}