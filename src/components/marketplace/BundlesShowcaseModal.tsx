import React, { useState, useEffect } from 'react';
import { MarketplaceBundle } from '../../types/marketplace';

interface BundlesShowcaseModalProps {
  onClose: () => void;
  onSelectBundle: (bundle: MarketplaceBundle) => void;
}

export const BundlesShowcaseModal: React.FC<BundlesShowcaseModalProps> = ({ onClose, onSelectBundle }) => {
  const [bundles, setBundles] = useState<MarketplaceBundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/marketplace/bundles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bundles)) {
          setBundles(data.bundles);
        }
      })
      .catch((err) => console.warn('Could not load bundles:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-secondary/15 text-secondary font-bold text-xs uppercase tracking-wider">
                Institutional Licensing
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 font-bold text-xs">
                Save up to 25%
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-on-surface mt-1">
              Institutional Software Bundles & Campus Passes
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Multi-project commercial suites designed for universities, colleges, and regional healthcare institutions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bundles.map((bundle) => {
              const savings = bundle.originalPriceETB - bundle.discountedPriceETB;
              return (
                <div
                  key={bundle.id}
                  className="rounded-3xl border border-secondary/30 bg-surface-container/40 p-5 flex flex-col justify-between shadow-md relative overflow-hidden space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-secondary text-on-secondary font-extrabold text-[10px] uppercase tracking-wider">
                        {bundle.badge}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 font-bold text-[11px]">
                        Save {savings.toLocaleString()} ETB
                      </span>
                    </div>

                    <h4 className="text-lg font-extrabold text-on-surface leading-tight">
                      {bundle.title}
                    </h4>

                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {bundle.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-outline-variant/15 text-xs">
                      <span className="font-bold text-on-surface text-[11px] block">Included Features:</span>
                      {bundle.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-on-surface-variant text-[11px]">
                          <span className="material-symbols-outlined text-emerald-500 text-[14px] shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-on-surface-variant line-through font-mono">
                        {bundle.originalPriceETB.toLocaleString()} ETB
                      </div>
                      <div className="text-xl font-black text-secondary font-mono">
                        {bundle.discountedPriceETB.toLocaleString()} ETB
                      </div>
                      <div className="text-[9px] text-on-surface-variant font-semibold">
                        {bundle.licenseType}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectBundle(bundle)}
                      className="px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 hover:brightness-105 shadow-md cursor-pointer transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                      <span>Acquire Bundle</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
