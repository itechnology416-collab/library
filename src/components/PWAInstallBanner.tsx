import React, { useState, useEffect } from 'react';

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback advice if browser doesn't expose prompt event (e.g., iOS Safari)
      alert('To install WKI Press: tap your browser Share button and select "Add to Home Screen".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallSuccess(true);
      setIsInstallable(false);
      setTimeout(() => setInstallSuccess(false), 4000);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner && isOnline) return null;

  return (
    <aside aria-label="Application status and installation" className="w-full">
      {/* Offline Status Alert */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="material-symbols-outlined text-[18px] animate-pulse">cloud_off</span>
            <span>
              <strong>Offline Mode Active:</strong> You can continue reading cached books, syllabus outlines, and terminology definitions offline.
            </span>
          </div>
        </div>
      )}

      {/* PWA Install Opportunity Ribbon */}
      {isInstallable && showBanner && isOnline && (
        <div className="bg-surface-container-high border-b border-outline-variant/30 px-4 py-2.5 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">install_mobile</span>
              </div>
              <div>
                <span className="font-bold text-on-surface block">
                  Install WKI Press App
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  Get instant offline access to academic monographs, defense slides, and courses directly from your home screen.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowBanner(false)}
                className="px-2.5 py-1 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 rounded-xl bg-secondary hover:brightness-105 text-on-secondary font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Install App</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {installSuccess && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center">
          WKI Press has been installed successfully to your device!
        </div>
      )}
    </aside>
  );
};
