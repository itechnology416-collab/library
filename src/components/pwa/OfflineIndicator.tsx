import React, { useEffect, useState } from 'react';
import { WifiOff, ShieldCheck } from 'lucide-react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-500/95 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-2xl border border-amber-400 animate-bounce">
      <WifiOff className="w-4 h-4 shrink-0" />
      <div>
        <span>Offline Mode Active</span>
        <span className="block text-[10px] font-normal opacity-90">Using cached eBooks & DRM library</span>
      </div>
      <ShieldCheck className="w-4 h-4 text-emerald-950 shrink-0 ml-1" />
    </div>
  );
};
