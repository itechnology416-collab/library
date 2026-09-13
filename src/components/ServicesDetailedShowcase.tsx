import React from 'react';
import { Language, ServiceCategory } from '../types';

interface ServicesDetailedShowcaseProps {
  currentLanguage: Language;
  onRequestCategory: (category: ServiceCategory) => void;
}

export const ServicesDetailedShowcase: React.FC<ServicesDetailedShowcaseProps> = ({
  currentLanguage,
  onRequestCategory,
}) => {
  const serviceDetails = [
    {
      id: 'ppt' as ServiceCategory,
      title: 'PowerPoint / Presentation Design',
      tagline: 'Academic, scientific & defense presentation mastery',
      image:
        'https://images.unsplash.com/photo-1542744094-3a31727201ec?auto=format&fit=crop&w=800&q=80',
      description:
        'Custom-engineered slide decks built for doctoral examinations, university lectures, and corporate symposiums. We eliminate text clutter, re-render statistical charts, and enforce high-contrast typographical grids.',
      bullets: [
        'Academic presentations & defenses',
        'Business & corporate presentations',
        'Seminar & keynote presentations',
        'Research & empirical presentations',
        'Master’s & doctoral thesis decks',
        'Project & grant proposal slides',
        'Training & workshop presentations',
        'International conference presentations',
        'Custom animation & slide transitions',
        'Data charts, tables & graph redesign',
        'Vector infographics & flowcharts',
        'Fully editable PPTX and PDF files',
      ],
      btnText: 'Request PPT Design',
      badge: 'Academic Standard',
      accent: 'border-secondary/30',
    },
    {
      id: 'english_book' as ServiceCategory,
      title: 'English Book Writing & Development',
      tagline: 'Pedagogical grammar manuals, vocabulary guides & monographs',
      image:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      description:
        'Comprehensive pedagogical content authoring developed under university-level linguistic supervision. From foundational grammar to advanced doctoral discourse markers and phrasal verb compendiums.',
      bullets: [
        'Phrasal verbs comprehensive books',
        'Academic & conversational idioms books',
        'Modern slang & idiomatic expressions',
        'Folklore & contextual reading books',
        'Dialogue & daily conversation books',
        'Thematic academic vocabulary books',
        'Higher education learning materials',
        'Exam drills & self-assessment practice',
        'Beginner to advanced proficiencies',
        'Full digital typesetting & indexing',
      ],
      btnText: 'Start English Book Project',
      badge: 'Curriculum Ready',
      accent: 'border-blue-500/30',
    },
    {
      id: 'arabic_book' as ServiceCategory,
      title: 'Arabic Writing & Book Development',
      tagline: 'Arabic typesetting, Tajweed articulation & Islamic education',
      image:
        'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80',
      description:
        'Certified right-to-left (RTL) Arabic typography, Islamic studies authoring, and phonetic Tajweed manuals. Perfect Arabic diacritics, Quranic verse typesetting, and scholarly verification.',
      bullets: [
        'High-speed Arabic text typing & proofing',
        'Handwritten manuscript digital conversion',
        'Professional book formatting & layout',
        'Tajweed rules & phonetic guides',
        'Salat handbooks & prayer guides',
        'Du’a compendiums with commentary',
        'Islamic education curriculum books',
        'Higher studies instructional materials',
        'Editorial peer-review & proofreading',
        'Audio-synchronized transcriptions',
      ],
      btnText: 'Request Arabic Book Service',
      badge: 'RTL Certified',
      accent: 'border-emerald-500/30',
    },
    {
      id: 'translation' as ServiceCategory,
      title: 'Cross-Lingual Translation & Proofreading',
      tagline: 'Scholarly 4-way translation & academic editing',
      image:
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
      description:
        'Rigorous 4-way translation across English, Afaan Oromoo, Amharic, and Arabic. We ensure terminology concordance, cultural precision, and thesis-grade academic consistency.',
      bullets: [
        'English ↔ Afaan Oromoo academic translation',
        'English ↔ Amharic institutional translation',
        'Arabic ↔ English / Oromoo translation',
        'Afaan Oromoo Seenaa & Aadaa literature',
        'Amharic research journal composition',
        'Peer-level grammar harmonization',
        'Doctoral thesis abstract editing',
        'Proofreading for syntactic accuracy',
      ],
      btnText: 'Request Multilingual Service',
      badge: '4-Way Harmonized',
      accent: 'border-purple-500/30',
    },
  ];

  return (
    <section className="px-gutter-mobile py-8 bg-surface">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
            Detailed Service Capabilities
          </span>
          <h2 className="font-headline-sm md:font-headline-md text-headline-sm md:text-2xl text-on-surface font-semibold">
            Tailored Scholarly Solutions For Every Project
          </h2>
          <p className="font-body-sm text-on-surface-variant text-sm">
            Whether you are preparing for a master’s thesis defense or authoring a multi-volume cultural book, our dedicated editorial team delivers university-accredited excellence.
          </p>
        </div>

        <div className="space-y-8">
          {serviceDetails.map((service, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <div
                key={service.id}
                className={`p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex flex-col lg:flex-row items-center gap-8 ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image Illustration */}
                <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-md bg-surface-container aspect-video sm:aspect-[4/3] lg:aspect-auto lg:h-96 relative group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-5">
                    <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                      {service.badge}
                    </span>
                  </div>
                </div>

                {/* Details and Checklist */}
                <div className="w-full lg:w-1/2 space-y-4">
                  <div>
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                      {service.tagline}
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1">
                      {service.title}
                    </h3>
                    <p className="font-body-sm text-sm text-on-surface-variant mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Bullets Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-outline-variant/15">
                    {service.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-on-surface">
                        <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span className="leading-tight">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action CTA */}
                  <div className="pt-3">
                    <button
                      onClick={() => onRequestCategory(service.id)}
                      className="px-6 py-2.5 rounded-xl bg-secondary text-on-secondary font-semibold text-sm hover:brightness-105 active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <span>{service.btnText}</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
