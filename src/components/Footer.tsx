import React from 'react';
import { OFFICIAL_BRAND } from '../data/initialData';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface FooterProps {
  currentLanguage: Language;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLanguage, onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const t = translations[currentLanguage];

  return (
    <footer className="px-gutter-mobile pt-12 pb-24 md:pb-12 bg-surface-container-high text-on-surface border-t border-outline-variant/20 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* 4-Column Layout as specified in Section 27 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src={OFFICIAL_BRAND.logoUrl}
                alt={OFFICIAL_BRAND.name}
                className="h-9 w-auto object-contain"
              />
              <span className="font-title-md text-base font-bold text-on-surface">
                {OFFICIAL_BRAND.name}
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              Publishing, writing, educational and digital services.
            </p>
            <p className="font-body-xs text-[11px] text-secondary font-medium italic">
              &ldquo;{OFFICIAL_BRAND.tagline}&rdquo;
            </p>
            <div className="pt-2 border-t border-outline-variant/20 text-xs text-on-surface-variant space-y-1">
              <p className="font-semibold text-on-surface">{OFFICIAL_BRAND.founder}</p>
              <p className="text-[11px] text-secondary font-medium">{OFFICIAL_BRAND.affiliation}, Ethiopia</p>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-3">
            <h4 className="font-title-sm text-xs font-bold uppercase tracking-wider text-secondary">
              Services
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-secondary hover:underline transition-colors text-left cursor-pointer"
                >
                  PPT Design
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-secondary hover:underline transition-colors text-left cursor-pointer"
                >
                  Book Writing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-secondary hover:underline transition-colors text-left cursor-pointer"
                >
                  Translation (4-Way)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-secondary hover:underline transition-colors text-left cursor-pointer"
                >
                  Editing & Proofreading
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-secondary hover:underline transition-colors text-left cursor-pointer"
                >
                  Arabic Writing & Tajweed
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-secondary hover:underline transition-colors text-left cursor-pointer"
                >
                  Afaan Oromoo Writing & Seenaa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-secondary hover:underline transition-colors text-left cursor-pointer"
                >
                  Amharic Writing
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Learning */}
          <div className="space-y-3">
            <h4 className="font-title-sm text-xs font-bold uppercase tracking-wider text-secondary">
              Learning
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-secondary hover:underline transition-colors text-left cursor-pointer"
                >
                  Courses & Lessons
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('books')}
                  className="hover:text-secondary hover:underline transition-colors text-left cursor-pointer"
                >
                  Books & Digital Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-secondary hover:underline transition-colors text-left cursor-pointer"
                >
                  Educational Resources
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-secondary hover:underline transition-colors text-left cursor-pointer"
                >
                  Blog & Knowledge Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('student')}
                  className="hover:text-secondary hover:underline transition-colors text-left cursor-pointer"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="hover:text-secondary hover:underline transition-colors text-left cursor-pointer"
                >
                  Portfolio Showcase
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Affiliation */}
          <div className="space-y-3">
            <h4 className="font-title-sm text-xs font-bold uppercase tracking-wider text-secondary">
              Contact
            </h4>
            <div className="space-y-2.5 text-xs text-on-surface-variant">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">call</span>
                <a
                  href={`tel:${OFFICIAL_BRAND.phone1.replace(/\s+/g, '')}`}
                  className="hover:text-secondary underline"
                >
                  {OFFICIAL_BRAND.phone1}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">call</span>
                <a
                  href={`tel:${OFFICIAL_BRAND.phone2.replace(/\s+/g, '')}`}
                  className="hover:text-secondary underline"
                >
                  {OFFICIAL_BRAND.phone2}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">send</span>
                <a
                  href={OFFICIAL_BRAND.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-secondary hover:underline"
                >
                  Telegram: {OFFICIAL_BRAND.telegramHandle}
                </a>
              </p>
              <div className="pt-2 border-t border-outline-variant/20">
                <p className="text-[11px] text-on-surface font-semibold">Affiliation</p>
                <p className="text-[11px] text-on-surface-variant">{OFFICIAL_BRAND.founder}</p>
                <p className="text-[11px] text-secondary">{OFFICIAL_BRAND.affiliation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Dynamic Copyright */}
        <div className="pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            © {currentYear} Wirtuu Kompiitaraa Ilillii Publishing Services. All rights reserved.
          </span>
          <div className="flex items-center gap-3 text-xs text-secondary font-semibold">
            <span>English</span>
            <span>•</span>
            <span>Afaan Oromoo</span>
            <span>•</span>
            <span>አማርኛ</span>
            <span>•</span>
            <span>العربية</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
