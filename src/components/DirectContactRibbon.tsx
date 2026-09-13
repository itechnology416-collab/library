import React from 'react';
import { OFFICIAL_BRAND } from '../data/initialData';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface DirectContactRibbonProps {
  currentLanguage: Language;
  onRequestClick: () => void;
}

export const DirectContactRibbon: React.FC<DirectContactRibbonProps> = ({
  currentLanguage,
  onRequestClick,
}) => {
  const t = translations[currentLanguage];

  return (
    <section className="px-gutter-mobile pb-space-md">
      <div className="max-w-7xl mx-auto">
        <div className="p-space-sm md:p-space-md rounded-xl bg-surface-container-high border border-outline-variant/20 flex flex-col gap-space-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-title-sm text-title-sm font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                headset_mic
              </span>
              <span>{t.directScholarlyDesk}</span>
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              {t.haramayaCampus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
            <a
              className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/10 flex items-center gap-2.5 active:bg-surface-container hover:border-secondary/30 transition-all min-w-0"
              href={`tel:${OFFICIAL_BRAND.phone1.replace(/\s+/g, '')}`}
            >
              <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-[18px]">call</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                  {OFFICIAL_BRAND.phone1}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">
                  {t.primaryDirect}
                </span>
              </div>
            </a>

            <a
              className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/10 flex items-center gap-2.5 active:bg-surface-container hover:border-secondary/30 transition-all min-w-0"
              href={OFFICIAL_BRAND.telegramUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-surface text-[18px]">send</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                  {OFFICIAL_BRAND.telegramHandle}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">
                  {t.telegramDesk}
                </span>
              </div>
            </a>
          </div>

          <div className="flex items-center justify-between pt-0.5 px-1 text-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">phone_iphone</span>
              <span>Alt: {OFFICIAL_BRAND.phone2}</span>
            </span>
            <button
              onClick={onRequestClick}
              className="font-label-sm text-label-sm text-secondary font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{t.requestServiceBtn}</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
