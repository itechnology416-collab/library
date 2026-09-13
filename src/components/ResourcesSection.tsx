import React, { useState } from 'react';
import { Language } from '../types';

interface ResourcesSectionProps {
  currentLanguage: Language;
  onOpenQuotation?: () => void;
  onOpenDiagnostic?: () => void;
  onOpenGlossary?: () => void;
}

interface ResourceItem {
  id: string;
  title: string;
  category:
    | 'Vocabulary lists'
    | 'Grammar notes'
    | 'Idioms'
    | 'Phrasal verbs'
    | 'Proverbs'
    | 'Riddles'
    | 'Study guides'
    | 'PDF resources'
    | 'Presentation templates'
    | 'Writing guides'
    | 'Language-learning materials';
  language: 'English' | 'Afaan Oromoo' | 'Amharic' | 'Arabic' | 'Multilingual';
  format: 'PDF' | 'PPTX' | 'DOCX';
  size: string;
  downloads: string;
  description: string;
  previewContent?: string[];
  tags: string[];
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  currentLanguage,
  onOpenQuotation,
  onOpenDiagnostic,
  onOpenGlossary,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadedFeedback, setDownloadedFeedback] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<ResourceItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'Presentation templates', label: 'Presentation templates' },
    { id: 'Phrasal verbs', label: 'Phrasal verbs' },
    { id: 'Idioms', label: 'Idioms' },
    { id: 'Vocabulary lists', label: 'Vocabulary lists' },
    { id: 'Grammar notes', label: 'Grammar notes' },
    { id: 'Proverbs', label: 'Proverbs' },
    { id: 'Riddles', label: 'Riddles' },
    { id: 'Study guides', label: 'Study guides' },
    { id: 'Writing guides', label: 'Writing guides' },
    { id: 'PDF resources', label: 'PDF resources' },
    { id: 'Language-learning materials', label: 'Language-learning' },
  ];

  const resources: ResourceItem[] = [
    {
      id: 'res-1',
      title: 'Haramaya University Doctoral Defense PPTX Template (16:9)',
      category: 'Presentation templates',
      language: 'English',
      format: 'PPTX',
      size: '5.4 MB',
      downloads: '1,420',
      description: 'Accredited university slide layout with title, methodology graphs, hypothesis matrix, and results table templates.',
      previewContent: [
        'Slide 1: Title, Candidate & Committee Credentials',
        'Slide 2: Research Problem Statement & Significance',
        'Slide 3: Theoretical Framework & Conceptual Model',
        'Slide 4-8: Methodology, Sampling & Analytical Rigor',
        'Slide 9-16: Key Empirical Findings & Visual Regression Curves',
        'Slide 17-20: Policy Implications, Limitations & Defense Takeaways',
      ],
      tags: ['Defense', 'Doctoral', 'PowerPoint', '16:9'],
    },
    {
      id: 'res-2',
      title: 'High-Frequency Academic Phrasal Verbs Compendium',
      category: 'Phrasal verbs',
      language: 'English',
      format: 'PDF',
      size: '2.1 MB',
      downloads: '3,890',
      description: '150+ categorized high-yield phrasal verbs with scholarly contextual sentences and common error alerts.',
      previewContent: [
        'account for: to explain or give reasons (e.g. "Climate variables account for 45% of variance.")',
        'carry out: to execute or conduct an experiment (e.g. "We carried out randomized field trials.")',
        'draw upon: to utilize existing literature (e.g. "The framework draws upon institutional theory.")',
        'point out: to highlight a critical observation',
        'sum up: to synthesize concluding deductions',
      ],
      tags: ['English', 'Grammar', 'Phrasal Verbs', 'Publishing'],
    },
    {
      id: 'res-3',
      title: 'Afaan Oromoo Classical Proverbs & Cultural Wisdom (Mammaaksa)',
      category: 'Proverbs',
      language: 'Afaan Oromoo',
      format: 'PDF',
      size: '1.8 MB',
      downloads: '2,450',
      description: '200 authentic Oromo proverbs transcribed in Qubee with contextual moral lessons and English translations.',
      previewContent: [
        '1. "Haati waan lafatti dhabde manatti barbaaddi." (One searches at home for what was lost in the open.)',
        '2. "Abbaan daadhii dhugeef abbaan bishaan dhuge qomoon tokko." (Truth and dignity unite people beyond superficial differences.)',
        '3. "Kan qotetti rooba." (Rain favors the one who has already plowed.)',
        '4. "Waan qalbii hin qabneef harree wajjin hin deemin."',
      ],
      tags: ['Oromo', 'Mammaaksa', 'Aadaa', 'Heritage'],
    },
    {
      id: 'res-4',
      title: 'Arabic Tajweed Articulation Points (Makharij al-Huruf) Chart',
      category: 'Language-learning materials',
      language: 'Arabic',
      format: 'PDF',
      size: '3.8 MB',
      downloads: '1,950',
      description: 'High-resolution anatomical phonetics chart illustrating correct articulation of Arabic letters with diacritics.',
      previewContent: [
        'Al-Halq (The Throat): Hamzah, Haa, Ayn, Haa, Ghayn, Khaa',
        'Al-Lisaan (The Tongue): Qaaf, Kaaf, Jeem, Sheen, Yaa, Daad, Laam, Noon, Raa',
        'Ash-Shafatayn (The Lips): Faa, Baa, Meem, Waaw',
        'Al-Khayshoom (Nasal Cavity): Ghunnah phonetics',
      ],
      tags: ['Arabic', 'Tajweed', 'Phonetics', 'Makharij'],
    },
    {
      id: 'res-5',
      title: 'Essential Academic & Research Idioms Handbook',
      category: 'Idioms',
      language: 'English',
      format: 'PDF',
      size: '1.9 MB',
      downloads: '2,780',
      description: '120 idiomatic expressions suitable for academic discourse, essays, presentations, and international exams.',
      previewContent: [
        'shed light on: to clarify or illuminate complex phenomena',
        'a double-edged sword: a factor with both advantageous and detrimental effects',
        'the tip of the iceberg: a small evident part of a much larger underlying problem',
        'at the cutting edge: at the most advanced stage of scientific research',
      ],
      tags: ['Idioms', 'Vocabulary', 'Academic Writing'],
    },
    {
      id: 'res-6',
      title: 'Afaan Oromoo Riddles & Educational Thought Puzzles (Hibboo)',
      category: 'Riddles',
      language: 'Afaan Oromoo',
      format: 'PDF',
      size: '1.4 MB',
      downloads: '1,890',
      description: 'Traditional Hibboo riddles designed for linguistic development, classroom engagement, and cognitive agility.',
      previewContent: [
        'Hibboo: "Galgala manatti gala, ganama dirretti baha." -> Deebii: Gaaddidduu (Shadow)',
        'Hibboo: "Mukarra teessi, nama miti; afaan qabdi, dubbatti." -> Deebii: Sinbira (Bird)',
        'Hibboo: "Kalloo adii mukatti rarraate." -> Deebii: Ji\'a (Moon in branches)',
      ],
      tags: ['Hibboo', 'Riddles', 'Oromo', 'Education'],
    },
    {
      id: 'res-7',
      title: 'Amharic Postgraduate Thesis Abstract & Style Checklist',
      category: 'Writing guides',
      language: 'Amharic',
      format: 'PDF',
      size: '1.2 MB',
      downloads: '1,640',
      description: 'Step-by-step structural checklist for converting English thesis summaries into standardized academic Amharic.',
      previewContent: [
        '1. የመመረቂያ ፅሁፍ ርዕስ ትክክለኛ የፊደል አጠቃቀም',
        '2. የጥናቱ አላማ እና ችግር ማብራሪያ (Research Problem & Objectives)',
        '3. የጥናቱ ዘዴ እና ናሙና አወሳሰድ (Methodology & Sampling)',
        '4. ዋና ዋና ግኝቶች እና ድምዳሜዎች (Key Findings & Policy Conclusions)',
      ],
      tags: ['Amharic', 'Abstract', 'Thesis', 'Fidel'],
    },
    {
      id: 'res-8',
      title: 'Scientific Poster Presentation Template (A0 Portrait & Landscape)',
      category: 'Presentation templates',
      language: 'English',
      format: 'PPTX',
      size: '6.2 MB',
      downloads: '980',
      description: 'Print-ready vector scientific poster layout for agriculture, health, engineering, and social science symposia.',
      previewContent: [
        'A0 Format (841 x 1189 mm) calibrated at 300 DPI vector scale',
        '3-Column and 4-Column flexible structural modular grids',
        'Color palette meeting WCAG AA visual accessibility contrast standards',
        'Vector chart and institutional logo placeholder modules',
      ],
      tags: ['Poster', 'Symposium', 'Design', 'PPTX'],
    },
    {
      id: 'res-9',
      title: 'Scholarly Grammar Reference & Syntax Master Notes',
      category: 'Grammar notes',
      language: 'English',
      format: 'PDF',
      size: '2.5 MB',
      downloads: '3,120',
      description: 'Comprehensive syntax handbook covering subjunctive mood, dangling modifiers, parallel structure, and relative clauses.',
      previewContent: [
        'Chapter 1: Subject-Verb Concord in Complex Compound Clauses',
        'Chapter 2: Active vs. Passive Voice in Scientific Methodologies',
        'Chapter 3: Avoiding Dangling and Misplaced Participial Modifiers',
        'Chapter 4: Semicolon, Colon, and Em-dash Typographical Standards',
      ],
      tags: ['Grammar', 'Syntax', 'Writing', 'English'],
    },
    {
      id: 'res-10',
      title: 'Essential Multilingual Academic Terminology Word Lists',
      category: 'Vocabulary lists',
      language: 'Multilingual',
      format: 'PDF',
      size: '3.1 MB',
      downloads: '2,630',
      description: 'Categorized core academic vocabulary across quantitative research, qualitative analysis, statistics, and humanities.',
      previewContent: [
        'Empirical, Qualitative, Quantitative, Hypothesis, Triangulation, Variance',
        'Afaan Oromoo equivalents: Qorannoo, Tilmaama, Bu\'aa, Ragaa, Madaallii',
        'Amharic equivalents: ጥናት፣ መላ-ምት፣ ውጤት፣ ማስረጃ፣ ግምገማ',
        'Arabic equivalents: دراسة، فرضية، نتيجة، برهان، تقييم',
      ],
      tags: ['Vocabulary', 'Multilingual', 'Terminology'],
    },
  ];

  const filtered = resources.filter((res) => {
    const matchesCategory = filterCategory === 'all' || res.category === filterCategory;
    const matchesLanguage = filterLanguage === 'all' || res.language === filterLanguage;
    const matchesSearch =
      searchQuery === '' ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesLanguage && matchesSearch;
  });

  const handleDownload = (res: ResourceItem) => {
    setDownloadedFeedback(res.title);
    setTimeout(() => setDownloadedFeedback(null), 3500);
  };

  return (
    <section className="px-gutter-mobile py-10 bg-surface" id="resources">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
              Educational Resource Center
            </span>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-3xl md:text-4xl text-on-surface font-bold">
              Free Academic & Language Learning Resources
            </h1>
            <p className="font-body-sm text-sm text-on-surface-variant max-w-2xl">
              Download free study guides, vocabulary lists, grammar notes, presentation templates, proverbs, and writing tools developed by our academic team.
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {downloadedFeedback && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Downloading "{downloadedFeedback}" to your device...</span>
            </div>
            <span className="text-[11px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded">Ready</span>
          </div>
        )}

        {/* Pre-Submission Tools Banner */}
        <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Scholarly Utilities
              </span>
              <h2 className="text-lg font-bold text-on-surface">
                Interactive Pre-Submission & Author Utilities
              </h2>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">
              Editorial Desk • Haramaya University
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Tool 1 */}
            <div
              onClick={onOpenQuotation}
              className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-secondary/50 shadow-xs cursor-pointer transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </div>
                <h3 className="font-bold text-sm text-on-surface mb-1">
                  Pro-Forma Quotation Generator
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Calculate itemized costs for doctoral slides, monographs, and 4-way translation with official university letterhead.
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs font-bold text-secondary">
                <span>Generate Official Quote</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>

            {/* Tool 2 */}
            <div
              onClick={onOpenDiagnostic}
              className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-tertiary/50 shadow-xs cursor-pointer transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-tertiary/15 text-tertiary flex items-center justify-center mb-3 group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">spellcheck</span>
                </div>
                <h3 className="font-bold text-sm text-on-surface mb-1">
                  Manuscript Quality & Script Audit
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Test your manuscript for word count, citation density (APA/IEEE), Qubee apostrophes, and Arabic Tajweed diacritics.
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs font-bold text-tertiary">
                <span>Run Diagnostic Audit</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>

            {/* Tool 3 */}
            <div
              onClick={onOpenGlossary}
              className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/50 shadow-xs cursor-pointer transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">translate</span>
                </div>
                <h3 className="font-bold text-sm text-on-surface mb-1">
                  4-Way Scholarly Terminology Matrix
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Instant search across academic research, publishing, and Islamic studies terms in English, Afaan Oromoo, Amharic & Arabic.
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs font-bold text-primary">
                <span>Explore Lexicon</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
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
                placeholder="Search resources, topics, keywords or formats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
              />
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-on-surface-variant shrink-0">Language:</span>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
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
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterCategory === cat.id
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
          <span>Showing <strong>{filtered.length}</strong> resources</span>
          {(filterCategory !== 'all' || filterLanguage !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setFilterCategory('all');
                setFilterLanguage('all');
                setSearchQuery('');
              }}
              className="text-secondary font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Resources Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-surface-container-lowest border border-outline-variant/20 space-y-3">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">
              menu_book
            </span>
            <p className="text-sm font-semibold text-on-surface">No educational resources found.</p>
            <p className="text-xs text-on-surface-variant">Try adjusting your search query or language filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((res) => (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs hover:border-secondary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
                        res.format === 'PPTX'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}
                    >
                      {res.format}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-surface-container text-secondary">
                        {res.language}
                      </span>
                      <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">download</span>
                        <span>{res.downloads}</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-title-sm text-sm font-bold text-on-surface line-clamp-2">
                      {res.title}
                    </h3>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 line-clamp-3 leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {res.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded bg-surface-container text-[10px] text-on-surface font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-outline-variant/10 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewItem(res)}
                    className="text-secondary text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Study Preview</span>
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-on-surface-variant font-mono">{res.size}</span>
                    <button
                      onClick={() => handleDownload(res)}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-semibold text-xs hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Study Preview Modal */}
        {previewItem && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
            <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 border border-outline-variant/30 shadow-2xl space-y-4 my-8">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-secondary">
                  Study Guide Preview • {previewItem.category}
                </span>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div>
                <h3 className="font-title-lg text-lg font-bold text-on-surface">
                  {previewItem.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant">
                  <span className="font-bold text-secondary">{previewItem.language}</span>
                  <span>•</span>
                  <span>Format: {previewItem.format}</span>
                  <span>•</span>
                  <span>Size: {previewItem.size}</span>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                {previewItem.description}
              </p>

              {previewItem.previewContent && previewItem.previewContent.length > 0 && (
                <div className="space-y-2 p-3.5 rounded-xl bg-surface-container border border-outline-variant/20">
                  <span className="text-xs font-bold text-on-surface block">
                    Sample Excerpts / Structure:
                  </span>
                  <div className="space-y-1.5">
                    {previewItem.previewContent.map((line, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-on-surface font-mono">
                        <span className="text-secondary font-bold">›</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-xs font-semibold text-on-surface cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(previewItem);
                    setPreviewItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Download Resource</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
