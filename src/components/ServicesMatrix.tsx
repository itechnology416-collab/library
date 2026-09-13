import React from 'react';
import { Language, ServiceCategory } from '../types';
import { translations } from '../utils/translations';

interface ServicesMatrixProps {
  currentLanguage: Language;
  onRequestCategory: (category: ServiceCategory) => void;
}

export const ServicesMatrix: React.FC<ServicesMatrixProps> = ({
  currentLanguage,
  onRequestCategory,
}) => {
  const t = translations[currentLanguage];

  const services: {
    id: ServiceCategory;
    title: string;
    badge: string;
    badgeBg: string;
    icon: string;
    iconBg: string;
    arabicSub?: string;
    description: string;
    tags: string[];
  }[] = [
    {
      id: 'ppt',
      title: 'PowerPoint & Scientific Presentation Design',
      badge: t.defenseReady,
      badgeBg: 'bg-surface-container text-secondary',
      icon: 'slideshow',
      iconBg: 'bg-surface-variant text-on-surface',
      description:
        'Academic thesis, doctoral defense, conference seminars, research visualization, data redesign, and master slide typography.',
      tags: ['Thesis Defense', 'Keynote Graphics', 'Infographics', '16:9 Academic Grid'],
    },
    {
      id: 'english_book',
      title: 'English Book Writing & Pedagogical Guides',
      badge: t.englishCurricula,
      badgeBg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
      icon: 'spellcheck',
      iconBg: 'bg-secondary-fixed text-on-secondary-fixed',
      description:
        'Specialized manuscripts on Phrasal Verbs, Advanced Grammar, Idiomatic Expressions, Academic Workbooks, and Spoken Fluency.',
      tags: ['Phrasal Verbs', 'Idioms', 'Workbooks', 'Conversational Drills'],
    },
    {
      id: 'arabic_book',
      title: 'Arabic Writing, Tajweed & Publishing',
      badge: t.rtlCertified,
      badgeBg: 'bg-surface-container text-secondary',
      icon: 'menu_book',
      iconBg: 'bg-surface-container-highest text-on-surface',
      arabicSub: 'نشر باللغة العربية (RTL)',
      description:
        'Arabic digital typesetting, manuscript conversion, Tajweed manuals, Du’a compendiums, Salat handbooks, and Islamic education volumes.',
      tags: ['تجويد', 'Salat Guides', 'RTL Formatting', 'Islamic Studies'],
    },
    {
      id: 'oromoo_book',
      title: 'Afaan Oromoo Book Development',
      badge: t.aadaaSeenaa,
      badgeBg: 'bg-secondary-fixed text-on-secondary-fixed',
      icon: 'history_edu',
      iconBg: 'bg-surface-variant text-on-surface',
      description:
        'Seenaa Dhuunfaa (Biographies), Aadaa fi Duudhaa Oromoo, folkloric stories, Mammaaksa (Proverbs), and educational instructional literature.',
      tags: ['Seenaa Dhuunfaa', 'Mammaaksa', 'Gadaa Studies', 'Safuu fi Seera'],
    },
    {
      id: 'amharic_book',
      title: 'Amharic Writing & Literary Composition',
      badge: t.amharicComposition,
      badgeBg: 'bg-surface-container text-on-surface-variant',
      icon: 'edit_document',
      iconBg: 'bg-surface-container-highest text-on-surface',
      description:
        'Advanced Amharic text typing, monograph preparation, academic journals, analytical essays, and higher education course packages.',
      tags: ['የጥናት ጽሑፍ', 'Articles', 'Text Editing', 'Monographs'],
    },
    {
      id: 'translation',
      title: 'Cross-Lingual Translation & Peer Editing',
      badge: t.fourWayTranslation,
      badgeBg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
      icon: 'g_translate',
      iconBg: 'bg-secondary-fixed text-on-secondary-fixed',
      description:
        'Rigorous 4-way scholarly translation: English ↔ Afaan Oromoo ↔ Amharic ↔ Arabic with grammar harmonization and thesis-level proofreading.',
      tags: ['Scholarly Proofreading', 'Glossary Concordance', 'Thesis Validation'],
    },
  ];

  return (
    <section className="px-gutter-mobile py-space-sm" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-space-sm">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
              {t.coreCapabilities}
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              {t.corePublishingServices}
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
            {t.areasCount}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-sm">
          {services.map((s) => (
            <div
              key={s.id}
              className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex flex-col justify-between gap-3 hover:border-secondary/40 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-lg ${s.iconBg} flex items-center justify-center`}
                  >
                    <span className="material-symbols-outlined text-[24px]">{s.icon}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-lg ${s.badgeBg} text-label-sm font-label-sm font-semibold`}
                  >
                    {s.badge}
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-secondary transition-colors">
                      {s.title}
                    </h3>
                  </div>
                  {s.arabicSub && (
                    <span
                      className="font-title-sm text-title-sm text-secondary font-bold block mt-0.5"
                      dir="rtl"
                    >
                      {s.arabicSub}
                    </span>
                  )}
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mt-1">
                  {s.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-surface-container-high text-on-surface text-label-sm font-label-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onRequestCategory(s.id)}
                className="mt-2 w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-secondary font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Request This Service</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
