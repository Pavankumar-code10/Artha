import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function Home() {
  return (
    <Link
      href="/portfolio"
      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
    >
      Get Started
    </Link>
  );
}