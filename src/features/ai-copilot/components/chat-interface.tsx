'use client';

import { Bot, User, Send, Sparkles, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isLoading) return;

        setError(null);
        setInput('');

        const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text };
        const history = [...messages, userMsg];
        setMessages(history);

        // Add an empty assistant bubble that we'll fill as chunks arrive
        const asstId = `a-${Date.now()}`;
        setMessages(prev => [...prev, { id: asstId, role: 'assistant', content: '' }]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: history.map(m => ({ role: m.role, content: m.content })),
                }),
            });

            if (!res.ok) {
                const body = await res.text().catch(() => `HTTP ${res.status}`);
                throw new Error(body || `HTTP ${res.status}`);
            }

            if (!res.body) throw new Error('Empty response body from server');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                setMessages(prev =>
                    prev.map(m => (m.id === asstId ? { ...m, content: m.content + chunk } : m))
                );
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            console.error('[COPILOT_ERROR]', err);
            setError(msg);
            // Remove the empty assistant placeholder on failure
            setMessages(prev => prev.filter(m => m.id !== asstId));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[75vh] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 bg-zinc-900/50 border-b border-zinc-800 flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-zinc-100">Aartha AI Copilot</h2>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">SEBI-Compliant Financial Educator</p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 && !error && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-3">
                        <Bot size={48} className="opacity-20" />
                        <p className="text-sm text-center leading-relaxed">
                            Ask me anything — portfolio diversification, HHI scores,<br />
                            REITs, InvITs, SGBs, or risk management.
                        </p>
                    </div>
                )}

                {messages.map(m => (
                    <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center shrink-0 border border-purple-500/30 text-purple-400 mt-1">
                                <Bot size={16} />
                            </div>
                        )}
                        <div className={`max-w-[80%] rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                            m.role === 'user'
                                ? 'bg-zinc-100 text-zinc-900 rounded-tr-none font-medium'
                                : 'bg-zinc-900/80 border border-zinc-800 text-zinc-200 rounded-tl-none'
                        }`}>
                            {/* Show bouncing dots in the assistant bubble while it's empty (waiting for first chunk) */}
                            {m.content === '' && m.role === 'assistant' ? (
                                <span className="flex gap-1 items-center h-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
                                </span>
                            ) : (
                                m.content
                            )}
                        </div>
                        {m.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700 text-zinc-300 mt-1">
                                <User size={16} />
                            </div>
                        )}
                    </div>
                ))}

                {error && (
                    <div className="flex items-start gap-2 text-red-400 text-xs font-mono mx-1 bg-red-950/30 border border-red-900/50 p-3 rounded-lg">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>
                            <b>Error:</b> {error}
                            <br />
                            <span className="text-red-400/60 text-[10px]">Check that GEMINI_API_KEY is valid in .env.local</span>
                        </span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-zinc-900/30 border-t border-zinc-800">
                <div className="relative flex items-center">
                    <input
                        id="copilot-input"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        placeholder="Ask anything — e.g., What is an HHI concentration score?"
                        autoComplete="off"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-4 pr-12 py-3 text-sm text-zinc-100 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-zinc-600 disabled:opacity-50"
                    />
                    <button
                        id="copilot-send"
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}