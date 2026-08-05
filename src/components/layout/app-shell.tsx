import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({
    children,
}: AppShellProps) {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Navbar />

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}