import Link from "next/link";
import { Landmark } from "lucide-react";

export function Logo() {
    return (
        <Link
            href="/portfolio"
            className="flex items-center gap-2"
        >
            <Landmark className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold tracking-tight">
                Aartha
            </span>
        </Link>
    );
}