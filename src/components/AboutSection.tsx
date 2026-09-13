import React from 'react';
import { Language } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';

interface AboutSectionProps {
  currentLanguage: Language;
  onRequestClick: () => void;
  onExploreCourses: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  currentLanguage,
  onRequestClick,
  onExploreCourses,
}) => {
  const corePillars = [
    {
      title: 'Professional Quality',
      desc: 'Rigorous editorial standards, academic accuracy, and polished design for books, research manuscripts, and high-stakes presentation decks.',
      icon: 'verified',
    },
    {
      title: 'Multilingual Capability',
      desc: 'Seamless native handling across English, Afaan Oromoo, Amharic, and Arabic with true Right-to-Left (RTL) formatting and Qubee orthography.',
      icon: 'translate',
    },
    {
      title: 'Educational Focus',
      desc: 'Pedagogically sound learning materials, structured curriculum workbooks, interactive quizzes, and e-learning resources.',
      icon: 'school',
    },
    {
      title: 'Modern Technology',
      desc: 'Cutting-edge digital publishing pipelines, vector infographic design, digital book readers, and responsive e-learning portals.',
      icon: 'devices',
    },
    {
      title: 'Clear Communication',
      desc: 'Transparent project milestones, direct author-editor consultation via phone and Telegram, and structured feedback loops.',
      icon: 'forum',
    },
    {
      title: 'Attention to Detail',
      desc: 'Exacting typographical grids, diacritic positioning in Tajweed, bibliographic concordance, and meticulous proofreading.',
      icon: 'rule',
    },
    {
      title: 'Customer-Focused Service',
      desc: 'Tailored turnaround times, revision workflows, dedicated client project portals, and direct support from project inception to delivery.',
      icon: 'support_agent',
    },
  ];

  return (
    <section className="px-gutter-mobile py-10 bg-surface" id="about">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
            About Us
          </span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-3xl md:text-4xl text-on-surface font-bold">
            Wirtuu Kompiitaraa Ilillii Publishing Services
          </h1>
          <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
            Wirtuu Kompiitaraa Ilillii Publishing Services is a professional writing, publishing, presentation design, editing, translation, and educational content service dedicated to helping individuals and organizations transform ideas into high-quality written and digital materials.
          </p>
        </div>

        {/* Founder & Institution Profile */}
        <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-80 rounded-2xl overflow-hidden bg-surface-container shadow-md shrink-0 aspect-[4/5] relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
              alt="Mr. Feysal Hussein"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
              <h3 className="font-bold text-lg">{OFFICIAL_BRAND.founder}</h3>
              <p className="text-xs text-secondary-fixed font-semibold">
                Founder & Contact Person
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {OFFICIAL_BRAND.affiliation}, Ethiopia
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Publishing & Educational Leadership</span>
            </div>

            <h3 className="font-headline-sm text-2xl font-bold text-on-surface">
              Transforming Ideas Into Professional Results
            </h3>

            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              Based at <strong>Haramaya University</strong>, Wirtuu Kompiitaraa Ilillii Publishing Services is led by <strong>Mr. Feysal Hussein</strong>. We collaborate with students, teachers, authors, researchers, businesses, and educational institutions to produce exceptional publications and digital learning content.
            </p>

            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              Whether you need high-impact thesis defense PowerPoint design, comprehensive English or Afaan Oromoo book development, certified Arabic typography with Tajweed, Amharic academic writing, or 4-way translation, we deliver with precision and care.
            </p>

            {/* Direct Contact Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-surface-container flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px]">call</span>
                <div>
                  <span className="text-[11px] text-on-surface-variant block font-medium">Direct Phone</span>
                  <a href={`tel:${OFFICIAL_BRAND.phone1.replace(/\s+/g, '')}`} className="font-bold text-on-surface hover:text-secondary underline">
                    {OFFICIAL_BRAND.phone1}
                  </a>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface-container flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px]">send</span>
                <div>
                  <span className="text-[11px] text-on-surface-variant block font-medium">Telegram</span>
                  <a href={OFFICIAL_BRAND.telegramUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-secondary hover:underline">
                    {OFFICIAL_BRAND.telegramHandle}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onRequestClick}
                className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-105 transition-all shadow-sm cursor-pointer"
              >
                Request a Service
              </button>
              <button
                onClick={onExploreCourses}
                className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors cursor-pointer"
              >
                Explore Learning Platform
              </button>
            </div>
          </div>
        </div>

        {/* 7 Core Emphasis Points (Section 12 of PDF) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="font-headline-sm text-xl font-bold text-on-surface">
              Core Principles & Guiding Values
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Every project we undertake is guided by seven fundamental commitments to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {corePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-2 hover:border-secondary/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">{pillar.icon}</span>
                </div>
                <h4 className="font-title-sm text-sm font-bold text-on-surface">
                  {pillar.title}
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
