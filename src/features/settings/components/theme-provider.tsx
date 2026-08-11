'use client';

import { useEffect } from 'react';

type ThemeValue = 'SYSTEM' | 'LIGHT' | 'DARK';

function resolveTheme(theme: ThemeValue): 'dark' | 'light' {
    if (theme === 'DARK') return 'dark';
    if (theme === 'LIGHT') return 'light';
    // SYSTEM — match OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: ThemeValue) {
    const resolved = resolveTheme(theme);
    const html = document.documentElement;
    html.classList.remove('dark', 'light');
    html.classList.add(resolved);
    // Store for next hard-navigation before server responds
    try { localStorage.setItem('aartha-theme', theme); } catch {}
}

/** Called by DisplayPanel immediately on theme button click — no page reload needed */
export function setGlobalTheme(theme: ThemeValue) {
    applyTheme(theme);
}

/**
 * Drop this into the layout. It runs once on the client,
 * reconciling the persisted DB theme (passed from server) with the DOM.
 */
export function ThemeProvider({ theme }: { theme: ThemeValue }) {
    useEffect(() => {
        applyTheme(theme);

        // If SYSTEM, also watch for OS changes at runtime
        if (theme === 'SYSTEM') {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = () => applyTheme('SYSTEM');
            mq.addEventListener('change', handler);
            return () => mq.removeEventListener('change', handler);
        }
    }, [theme]);

    return null;
}

/**
 * Inline script injected into <head> — runs before React hydration
 * so there is ZERO flash of wrong theme on hard reload.
 */
export function ThemeScript() {
    const script = `
(function(){
  try {
    var t = localStorage.getItem('aartha-theme') || 'DARK';
    var resolved = t === 'DARK' ? 'dark' : t === 'LIGHT' ? 'light'
      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.add(resolved);
  } catch(e){}
})();
`;
    return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
