import React from 'react';
import { OFFICIAL_BRAND } from '../data/initialData';

export const HaramayaCredentials: React.FC = () => {
  return (
    <section className="px-gutter-mobile py-space-md">
      <div className="max-w-7xl mx-auto">
        <div className="p-space-md md:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-surface flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[28px]">account_balance</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="font-title-sm text-title-sm text-on-surface font-bold truncate">
                {OFFICIAL_BRAND.affiliation} Hub
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Main Campus Digital Innovation & Academic Press Center
              </p>
            </div>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            {OFFICIAL_BRAND.fullName} operates under rigorous academic publishing standards,
            supporting university faculty, postgraduate candidates, regional researchers, and
            cultural institutions with certified manuscript workflows across Latin, Ethiopic, and
            Arabic scripts.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-surface-container-high text-center">
            <div className="flex flex-col items-center">
              <span className="font-title-md text-title-md font-bold text-secondary">
                500+
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant text-[11px]">
                Decks & Theses
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-title-md text-title-md font-bold text-secondary">
                4
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant text-[11px]">
                Languages
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-title-md text-title-md font-bold text-secondary">
                100%
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant text-[11px]">
                Peer Precision
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
