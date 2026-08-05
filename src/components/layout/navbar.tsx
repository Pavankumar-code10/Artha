import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                <span>Search Aartha</span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                </Button>

                <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    A
                </div>
            </div>
        </header>
    );
}