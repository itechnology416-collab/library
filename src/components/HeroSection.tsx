import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface HeroSectionProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onRequestClick: () => void;
  onExploreLearningClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLanguage,
  onLanguageChange,
  onRequestClick,
  onExploreLearningClick,
}) => {
  const t = translations[currentLanguage];

  const languages: { code: Language; label: string; rtl?: boolean }[] = [
    { code: 'en', label: 'English' },
    { code: 'or', label: 'Afaan Oromoo' },
    { code: 'am', label: 'አማርኛ' },
    { code: 'ar', label: 'العربية (RTL)', rtl: true },
  ];

  return (
    <section className="px-gutter-mobile pt-space-md pb-space-lg bg-surface transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="p-space-md md:p-8 rounded-2xl bg-primary-container text-on-primary-container shadow-xl relative overflow-hidden">
          {/* Archival Pattern Glow */}
          <div className="absolute -right-8 -bottom-8 w-56 h-56 rounded-full bg-secondary/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-tertiary-container/30 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-space-sm max-w-3xl">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-lg bg-secondary text-on-secondary text-label-sm font-label-sm font-bold tracking-wider uppercase shadow-sm">
              <span className="material-symbols-outlined text-[14px]">auto_stories</span>
              <span>{t.tagline}</span>
            </div>

            {/* Headline */}
            <h1 className="font-headline-lg-mobile md:font-display-lg-mobile text-headline-lg-mobile md:text-3xl text-surface font-semibold tracking-tight leading-tight">
              {t.heroHeadline}
            </h1>

            {/* Description */}
            <p className="font-body-sm md:font-body-md text-body-sm md:text-base text-surface-container-high leading-relaxed">
              {t.heroSubtext}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-space-xs sm:gap-space-sm pt-space-xs">
              <button
                onClick={onRequestClick}
                className="h-11 px-space-md rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg font-semibold flex items-center justify-center gap-space-xs active:scale-[0.98] hover:brightness-105 transition-all shadow-md cursor-pointer"
                id="heroRequestBtn"
              >
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                <span>{t.requestServiceBtn}</span>
              </button>
              <button
                onClick={onExploreLearningClick}
                className="h-11 px-space-md rounded-lg bg-surface-container-highest text-on-surface font-label-lg text-label-lg font-semibold flex items-center justify-center gap-space-xs active:scale-[0.98] hover:bg-surface-container transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">local_library</span>
                <span>{t.exploreLearningBtn}</span>
              </button>
            </div>

            {/* Multilingual Language Selector Bar */}
            <div className="pt-space-xs mt-2 border-t border-white/10">
              <p className="font-label-sm text-label-sm text-surface-variant font-medium mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary-container">
                  language
                </span>
                <span>{t.selectLanguageEdition}</span>
              </p>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1" id="languagePills">
                {languages.map((lang) => {
                  const isActive = currentLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => onLanguageChange(lang.code)}
                      dir={lang.rtl ? 'rtl' : 'ltr'}
                      className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-surface text-on-surface shadow-md'
                          : 'bg-surface-container/60 text-surface hover:bg-surface-container/90'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {isActive && (
                        <span className="material-symbols-outlined text-[13px] text-secondary">
                          check
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
