import {
    LayoutDashboard,
    PieChart,
    BrainCircuit,
    Landmark,
    GraduationCap,
    User,
    Settings,
} from "lucide-react";

import { NavigationItem } from "@/types/navigation";

export const navigation: NavigationItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Portfolio",
        href: "/portfolio",
        icon: PieChart,
    },
    {
        title: "AI Copilot",
        href: "/copilot",
        icon: BrainCircuit,
    },
    {
        title: "Marketplace",
        href: "/marketplace",
        icon: Landmark,
    },
    {
        title: "Learn",
        href: "/learn",
        icon: GraduationCap,
    },
    {
        title: "Profile",
        href: "/profile",
        icon: User,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];