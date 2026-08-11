import { ChatInterface } from '@/features/ai-copilot/components/chat-interface';

export const metadata = {
    title: 'AI Copilot | Aartha',
};

export default function CopilotPage() {
    return (
        <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-6">
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                    AI Financial Copilot
                </h1>
                <p className="text-sm text-zinc-400">
                    Ask questions, clarify doubts, and learn about advanced portfolio strategies.
                </p>
            </header>
            <main>
                <ChatInterface />
            </main>
        </div>
    );
}