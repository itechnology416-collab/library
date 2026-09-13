import React, { useState } from 'react';
import { Language } from '../types';

interface PortfolioSectionProps {
  currentLanguage: Language;
  onRequestClick: () => void;
}

interface PortfolioItem {
  id: string;
  title: string;
  category:
    | 'Book Design'
    | 'Book Writing'
    | 'PPT Presentations'
    | 'Arabic Publications'
    | 'Afaan Oromoo Publications'
    | 'Amharic Publications'
    | 'English Publications'
    | 'Translation'
    | 'Educational Materials';
  language: 'English' | 'Afaan Oromoo' | 'Amharic' | 'Arabic' | 'Multilingual';
  description: string;
  image: string;
  completionDate?: string;
  deliverables: string[];
  keyHighlights: string[];
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  currentLanguage,
  onRequestClick,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLanguage, setActiveLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const portfolioCategories = [
    { id: 'all', label: 'All Portfolio' },
    { id: 'PPT Presentations', label: 'PPT Presentations' },
    { id: 'Book Writing', label: 'Book Writing' },
    { id: 'Book Design', label: 'Book Design' },
    { id: 'English Publications', label: 'English Publications' },
    { id: 'Arabic Publications', label: 'Arabic Publications' },
    { id: 'Afaan Oromoo Publications', label: 'Afaan Oromoo Publications' },
    { id: 'Amharic Publications', label: 'Amharic Publications' },
    { id: 'Translation', label: 'Translation' },
    { id: 'Educational Materials', label: 'Educational Materials' },
  ];

  const projects: PortfolioItem[] = [
    {
      id: 'p-1',
      title: 'Doctoral Defense: Climate Resilience & Agronomic Modeling',
      category: 'PPT Presentations',
      language: 'English',
      completionDate: '2024-06-15',
      image:
        'https://images.unsplash.com/photo-1542744094-3a31727201ec?auto=format&fit=crop&w=800&q=80',
      description:
        '42-slide high-impact doctoral defense deck with regression models, vector maps, and 3-second result takeaways.',
      deliverables: ['Custom 16:9 Presentation (PPTX)', 'Vector Agronomy Maps', 'Speaker Cue Cards & Handouts'],
      keyHighlights: ['Pass with Very High Distinction', 'Clear data hierarchy', 'Custom statistical plots'],
    },
    {
      id: 'p-2',
      title: 'Seenaa fi Aadaa Oromoo: Historical Treatise in Qubee',
      category: 'Afaan Oromoo Publications',
      language: 'Afaan Oromoo',
      completionDate: '2024-03-20',
      image:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      description:
        '320-page full monograph typesetting, Sirna Gadaa lineage tables, and archival binding layout.',
      deliverables: ['Print-Ready PDF (A5)', 'Qubee Orthography Verification', 'Foil Stamp Hardcover Layout'],
      keyHighlights: ['Standard Qubee orthography', 'Archival genealogical diagrams', 'ISBN/CIP schema included'],
    },
    {
      id: 'p-3',
      title: 'Tuhfatul Atfaal & Tajweed Rules with Phonetic Diagrams',
      category: 'Arabic Publications',
      language: 'Arabic',
      completionDate: '2023-11-10',
      image:
        'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80',
      description:
        '180-page bilingual Arabic-English manual with vocal tract diagrams and color-coded Tajweed verse markers.',
      deliverables: ['Right-to-Left (RTL) Typeset PDF', 'Color-Coded Tajweed Rules', 'Companion Audio Alignment'],
      keyHighlights: ['Exact Tashkeel voweling', 'Makharij phonetics diagrams', 'Bilingual layout'],
    },
    {
      id: 'p-4',
      title: 'Academic Phrasal Verbs & Transition Phrases Compendium',
      category: 'English Publications',
      language: 'English',
      completionDate: '2024-01-18',
      image:
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
      description:
        '210-page reference book compiling over 500 academic phrasal verbs, idioms, and sentence connectors with practical exercises.',
      deliverables: ['Complete Print & E-Book Layout', 'Index & Glossary Section', 'Practice Workbook Inserts'],
      keyHighlights: ['Categorized by scholarly function', 'CEFR B2-C2 level coverage', 'Grammar notes included'],
    },
    {
      id: 'p-5',
      title: 'Agricultural Economics Terminology Dictionary (4-Language Matrix)',
      category: 'Translation',
      language: 'Multilingual',
      completionDate: '2024-05-02',
      image:
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      description:
        'Comprehensive 4-way translation compendium mapping 1,200 agronomic terms across English, Afaan Oromoo, Amharic, and Arabic.',
      deliverables: ['Four-Language Concordance Matrix', 'Digital Searchable PDF', 'Alphabetical Index in 4 Scripts'],
      keyHighlights: ['Peer-verified terminology', 'Ge\'ez & Arabic script typography', 'University curriculum ready'],
    },
    {
      id: 'p-6',
      title: 'Amharic Academic Writing & Thesis Structure Guide',
      category: 'Amharic Publications',
      language: 'Amharic',
      completionDate: '2023-09-25',
      image:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      description:
        '160-page academic guidebook on Ge\'ez typography standards, citation formats, and scholarly abstract writing in Amharic.',
      deliverables: ['Custom Fidel Typeset Layout', 'Chapter Summary Checklists', 'Digital Student Edition'],
      keyHighlights: ['Authentic Ge\'ez typography', 'Standardized academic tone', 'Ethiopic punctuation rules'],
    },
    {
      id: 'p-7',
      title: 'International Public Health Conference Symposium Slide Deck',
      category: 'PPT Presentations',
      language: 'English',
      completionDate: '2024-07-08',
      image:
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
      description:
        '28-slide keynote presentation condensing 5-year epidemiological cohort findings for international health delegates.',
      deliverables: ['High-contrast Visual Deck', 'Animated Infographics & Charts', 'Executive Summary PDF'],
      keyHighlights: ['WHO visual design standards', 'Complex statistical epidemiology simplified', 'Full speaker notes'],
    },
    {
      id: 'p-8',
      title: 'Interactive Spoken English & Workplace Dialogue Workbook',
      category: 'Educational Materials',
      language: 'English',
      completionDate: '2024-04-12',
      image:
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      description:
        'Interactive workbook featuring real-world conversation scenarios, role-play scripts, vocabulary builders, and quizzes.',
      deliverables: ['Interactive PDF with form fields', 'Print-Ready Classroom Edition', 'Teacher Answer Key'],
      keyHighlights: ['Scenario-based learning', 'Self-assessment quizzes', 'Classroom ready'],
    },
    {
      id: 'p-9',
      title: 'Contemporary Botanical & Herbal Medicine Monograph Cover Design',
      category: 'Book Design',
      language: 'Multilingual',
      completionDate: '2023-12-14',
      image:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      description:
        'Complete jacket, spine, back cover, and interior page master layout design for an ethnobotanical reference book.',
      deliverables: ['High-Resolution Print Jacket PDF', '3D Photorealistic Mockup', 'Interior Typography Grid'],
      keyHighlights: ['Mathematically calculated spine width', 'CMYK color profile', 'Custom vector botanical art'],
    },
  ];

  const filtered = projects.filter((proj) => {
    const matchesCategory = activeCategory === 'all' || proj.category === activeCategory;
    const matchesLanguage = activeLanguage === 'all' || proj.language === activeLanguage;
    const matchesSearch =
      searchQuery === '' ||
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLanguage && matchesSearch;
  });

  return (
    <section className="px-gutter-mobile py-10 bg-surface" id="portfolio">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
              Published Works & Technical Deliverables
            </span>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-3xl md:text-4xl text-on-surface font-bold">
              Professional Portfolio Showcase
            </h1>
            <p className="font-body-sm text-sm text-on-surface-variant max-w-2xl">
              Explore completed presentations, published books, multilingual publications, and educational materials developed by Wirtuu Kompiitaraa Ilillii.
            </p>
          </div>

          <button
            onClick={onRequestClick}
            className="h-10 px-5 rounded-xl bg-secondary text-on-secondary text-xs font-bold flex items-center gap-2 hover:brightness-105 transition-all shadow-xs shrink-0 self-start md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Start Your Project</span>
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Search projects by title, keywords, or deliverables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
              />
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-on-surface-variant shrink-0">Language:</span>
              <select
                value={activeLanguage}
                onChange={(e) => setActiveLanguage(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none font-semibold cursor-pointer"
              >
                <option value="all">All Languages</option>
                <option value="English">English</option>
                <option value="Afaan Oromoo">Afaan Oromoo</option>
                <option value="Amharic">Amharic</option>
                <option value="Arabic">Arabic</option>
                <option value="Multilingual">Multilingual</option>
              </select>
            </div>
          </div>

          {/* Category Chips Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {portfolioCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-secondary text-on-secondary shadow-xs font-bold'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
          <span>Showing <strong>{filtered.length}</strong> completed projects</span>
          {(activeCategory !== 'all' || activeLanguage !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveLanguage('all');
                setSearchQuery('');
              }}
              className="text-secondary font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Portfolio Cards Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-surface-container-lowest border border-outline-variant/20 space-y-3">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">
              folder_off
            </span>
            <p className="text-sm font-semibold text-on-surface">No publications matching this filter.</p>
            <p className="text-xs text-on-surface-variant">Try resetting filters to explore all portfolio categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs hover:border-secondary/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end justify-between p-3.5 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary px-2 py-0.5 rounded">
                        {proj.category}
                      </span>
                      {proj.completionDate && (
                        <span className="text-[11px] font-mono font-semibold bg-black/50 px-2 py-0.5 rounded">
                          {proj.completionDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-secondary">
                        {proj.language}
                      </span>
                    </div>
                    <h3 className="font-title-sm text-sm font-bold text-on-surface line-clamp-2 leading-snug">
                      {proj.title}
                    </h3>
                    <p className="font-body-sm text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-outline-variant/10 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedItem(proj)}
                      className="text-secondary text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Project</span>
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                    </button>
                    <button
                      onClick={onRequestClick}
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-secondary hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Request Similar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
            <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 border border-outline-variant/30 shadow-2xl space-y-4 my-8">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-secondary">
                  Project Specification • {selectedItem.category}
                </span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="h-44 rounded-xl overflow-hidden relative">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-title-lg text-lg font-bold text-on-surface">
                  {selectedItem.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold text-secondary">{selectedItem.language}</span>
                  {selectedItem.completionDate && (
                    <>
                      <span className="text-on-surface-variant">•</span>
                      <span className="text-[11px] text-on-surface-variant">Completed: {selectedItem.completionDate}</span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                {selectedItem.description}
              </p>

              <div className="space-y-2">
                <span className="text-xs font-bold text-on-surface block">
                  Delivered Components:
                </span>
                <div className="space-y-1">
                  {selectedItem.deliverables.map((del, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-on-surface block">
                  Key Technical Highlights:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.keyHighlights.map((hl, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-surface-container text-[11px] text-on-surface-variant font-medium">
                      {hl}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-xs font-semibold text-on-surface cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    onRequestClick();
                  }}
                  className="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold cursor-pointer"
                >
                  Request a Service
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
