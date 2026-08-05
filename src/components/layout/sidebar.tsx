import { Logo } from "./logo";
import { NavLinks } from "./nav-links";

export function Sidebar() {
    return (
        <aside className="hidden w-64 border-r bg-background lg:flex lg:flex-col">
            <div className="border-b p-6">
                <Logo />
            </div>

            <div className="flex-1 p-4">
                <NavLinks />
            </div>
        </aside>
    );
}