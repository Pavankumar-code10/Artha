// 'use client'; // Error boundaries must be Client Components

// import { useEffect } from 'react';
// import { AlertOctagon, RefreshCcw, ShieldAlert } from 'lucide-react';

// export default function DashboardError({
//     error,
//     reset,
// }: {
//     error: Error & { digest?: string };
//     reset: () => void;
// }) {
//     useEffect(() => {
//         // In a real app, this sends the error to Sentry or Datadog
//         console.error('[AARTHA_SYS_ERR]', error);
//     }, [error]);

//     return (
//         <div className="h-[75vh] w-full flex flex-col items-center justify-center p-6 space-y-6 animate-in zoom-in-95 duration-300">
//             <div className="h-20 w-20 bg-red-950/20 border border-red-900/50 rounded-2xl flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.15)] transform rotate-3">
//                 <AlertOctagon size={36} strokeWidth={1.5} />
//             </div>

//             <div className="text-center space-y-3 max-w-md">
//                 <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">System Interruption</h2>
//                 <p className="text-sm text-zinc-400 leading-relaxed">
//                     The intelligence engine encountered an unexpected anomaly while processing your request. Secure connection has been maintained.
//                 </p>
//             </div>

//             {process.env.NODE_ENV === 'development' && (
//                 <div className="w-full max-w-md p-4 bg-zinc-950/50 border border-zinc-800/80 rounded-lg text-left overflow-hidden">
//                     <div className="flex items-center gap-2 text-red-400 mb-2">
//                         <ShieldAlert size={14} />
//                         <span className="text-[10px] font-bold uppercase tracking-wider">Dev Trace</span>
//                     </div>
//                     <p className="text-xs font-mono text-zinc-500 truncate">
//                         {error.message || "Unknown execution failure"}
//                     </p>
//                 </div>
//             )}

//             <button
//                 onClick={() => reset()}
//                 className="flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-lg transition-colors shadow-lg"
//             >
//                 <RefreshCcw size={16} />
//                 Reboot Session
//             </button>
//         </div>
//     );
// }

'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // In production, this would fire off to Sentry or Datadog
        console.error('[GLOBAL_ERROR_BOUNDARY]', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 space-y-6">
            <div className="h-16 w-16 bg-red-950/20 border border-red-900/50 rounded-full flex items-center justify-center text-red-400">
                <AlertTriangle size={32} />
            </div>

            <div className="text-center space-y-2 max-w-md">
                <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">System Interruption</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    A fault occurred while rendering this interface. Our error boundaries have isolated the crash to protect your session.
                </p>
            </div>

            <button
                onClick={() => reset()}
                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-lg transition-colors"
            >
                <RefreshCcw size={16} />
                Attempt Recovery
            </button>
        </div>
    );
}