import React from 'react';
import { Language } from '../types';

interface PublishingCategoriesProps {
  currentLanguage: Language;
  onSelectCategory: (langFilter: string) => void;
}

export const PublishingCategories: React.FC<PublishingCategoriesProps> = ({
  currentLanguage,
  onSelectCategory,
}) => {
  const categories = [
    {
      id: 'en',
      title: 'English Books',
      titleLocalized: {
        en: 'English Books',
        or: 'Kitaabota Ingiliffaa',
        am: 'የእንግሊዝኛ መጻሕፍት',
        ar: 'الكتب الإنجليزية',
      },
      desc: 'Grammar, vocabulary, phrasal verbs, idioms, spoken fluency & academic reference.',
      badge: 'Academic Curricula',
      icon: 'auto_stories',
      accentColor: 'from-blue-600 to-indigo-700',
      bgGlow: 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200',
      iconBg: 'bg-blue-600 text-white',
      count: '1,200+ Drills',
    },
    {
      id: 'ar',
      title: 'Arabic Books',
      titleLocalized: {
        en: 'Arabic Books',
        or: 'Kitaabota Afaan Arabaa',
        am: 'የዓረብኛ መጻሕፍት',
        ar: 'الكتب والبحوث العربية',
      },
      desc: 'Tajweed manuals, Salat guides, Du’a compendiums, Islamic education & RTL typography.',
      badge: 'RTL Certified',
      icon: 'menu_book',
      accentColor: 'from-emerald-600 to-teal-800',
      bgGlow: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
      count: 'Phonetic Articulation',
    },
    {
      id: 'or',
      title: 'Afaan Oromoo Books',
      titleLocalized: {
        en: 'Afaan Oromoo Books',
        or: 'Kitaabota Afaan Oromoo',
        am: 'የኦሮምኛ መጻሕፍት',
        ar: 'كتب اللغة الأورومية والتراث',
      },
      desc: 'Seenaa Oromoo, Aadaa fi Duudhaa, Mammaaksa, Safuu fi Seera, and educational literature.',
      badge: 'Aadaa fi Seenaa',
      icon: 'history_edu',
      accentColor: 'from-amber-600 to-amber-800',
      bgGlow: 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200',
      iconBg: 'bg-amber-600 text-white',
      count: 'Sirna Gadaa Focus',
    },
    {
      id: 'am',
      title: 'Amharic Books',
      titleLocalized: {
        en: 'Amharic Books',
        or: 'Kitaabota Afaan Amaaraa',
        am: 'የአማርኛ መጻሕፍት',
        ar: 'الكتب والمؤلفات الأمهرية',
      },
      desc: 'Language compositions, scholarly monographs, research abstract writing & analytical essays.',
      badge: 'የጥናት ጽሑፍ',
      icon: 'edit_note',
      accentColor: 'from-purple-600 to-purple-800',
      bgGlow: 'bg-purple-500/10 border-purple-500/30 text-purple-900 dark:text-purple-200',
      iconBg: 'bg-purple-600 text-white',
      count: 'University Formats',
    },
  ];

  return (
    <section className="px-gutter-mobile py-6 bg-surface">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
              Scholarly Disciplines
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Publishing Categories
            </h2>
          </div>
          <span className="text-xs text-on-surface-variant">
            Explore publications across four major academic languages
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs hover:shadow-md hover:border-secondary/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${cat.iconBg}`}
                  >
                    <span className="material-symbols-outlined text-[26px]">{cat.icon}</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${cat.bgGlow}`}
                  >
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-secondary transition-colors">
                    {cat.titleLocalized[currentLanguage] || cat.title}
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed mt-1.5 line-clamp-3">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-outline-variant/10 flex items-center justify-between text-xs font-semibold">
                <span className="text-on-surface-variant text-[11px]">{cat.count}</span>
                <span className="text-secondary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Browse Category</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
