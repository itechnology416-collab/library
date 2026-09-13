import React from 'react';
import { OFFICIAL_BRAND } from '../data/initialData';
import { translations } from '../utils/translations';
import { Language } from '../types';

interface TrustBarProps {
  currentLanguage: Language;
}

export const TrustBar: React.FC<TrustBarProps> = ({ currentLanguage }) => {
  const t = translations[currentLanguage];

  return (
    <section className="px-gutter-mobile pt-space-xs pb-space-sm bg-surface-container-low border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-space-xs">
        <div className="flex items-center gap-space-xs min-w-0">
          <span className="w-2 h-2 rounded-full bg-secondary shrink-0 animate-pulse"></span>
          <span className="font-label-sm text-label-sm font-semibold tracking-wide text-on-surface truncate">
            {OFFICIAL_BRAND.founder} • {OFFICIAL_BRAND.affiliation}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-lg bg-surface-container-highest text-secondary text-label-sm font-label-sm font-semibold shrink-0">
          <span className="material-symbols-outlined text-[14px]">verified</span>
          {t.verifiedPress}
        </span>
      </div>
    </section>
  );
};
