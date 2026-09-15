import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // If already running as an installed PWA
  if (isInstalled || installedSuccess) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>PWA Active</span>
      </span>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={async () => {
          const res = await install();
          if (res) setInstalledSuccess(true);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition active:scale-95"
        title="Install Wirtuu Kompiitaraa Ilillii App on your device for offline reading"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-sky-400" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-sm">
                    WK
                  </div>
                  <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-sky-600/30 text-sky-400 font-bold flex items-center justify-center text-xs shrink-0">1</span>
                  <span>Tap the <strong>Share</strong> button in Safari's bottom toolbar.</span>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-sky-600/30 text-sky-400 font-bold flex items-center justify-center text-xs shrink-0">2</span>
                  <span>Scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-sky-600 hover:bg-sky-500 py-2.5 text-sm font-semibold text-white transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
