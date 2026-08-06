import Link from "next/link";

import { Button } from "@/components/ui/button";

export function ConnectButton() {
    return (
        <Link href="/account-aggregator">
            <Button size="lg">
                Connect Account
            </Button>
        </Link>
    );
}