import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950">
      <h1 className="text-5xl font-bold text-white">Aartha</h1>

      <Button>Get Started</Button>
    </main>
  );
}