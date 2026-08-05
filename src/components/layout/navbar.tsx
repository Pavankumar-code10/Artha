import { Bell, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
            {/* Left */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                <span>Search Aartha</span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>

                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "h-9 w-9",
                        },
                    }}
                />
            </div>
        </header>
    );
}