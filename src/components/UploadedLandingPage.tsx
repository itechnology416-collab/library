import React, { useState, useMemo } from 'react';
import { Book, Course, Language, ServiceCategory } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';
import { useAuth } from '../context/AuthContext';

interface UploadedLandingPageProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onRequestClick: (category?: ServiceCategory, pages?: number) => void;
  onExploreCourses: () => void;
  onExploreBooks: () => void;
  onOpenSearch: () => void;
  onOpenQuotation: (pages?: number, category?: ServiceCategory) => void;
  onOpenDiagnostic: () => void;
  onOpenThesisSlideStudio: () => void;
  onOpenDOI: () => void;
  onOpenPeerReview: () => void;
  onOpenPlagiarism: () => void;
  onOpenCoverStudio: () => void;
  onOpenCIP: () => void;
  onOpenProofreader: () => void;
  onOpenPosterStudio: () => void;
  onOpenGrantStudio: () => void;
  onOpenGlossary: () => void;
  onOpenVerify: () => void;
  onOpenReader: (book: Book) => void;
  books: Book[];
  courses: Course[];
  onNavigateTab: (tab: string) => void;
  onOpenLogin?: () => void;
}

export const UploadedLandingPage: React.FC<UploadedLandingPageProps> = ({
  currentLanguage,
  onLanguageChange,
  onRequestClick,
  onExploreCourses,
  onExploreBooks,
  onOpenSearch,
  onOpenQuotation,
  onOpenDiagnostic,
  onOpenThesisSlideStudio,
  onOpenDOI,
  onOpenPeerReview,
  onOpenPlagiarism,
  onOpenCoverStudio,
  onOpenCIP,
  onOpenProofreader,
  onOpenPosterStudio,
  onOpenGrantStudio,
  onOpenGlossary,
  onOpenVerify,
  onOpenReader,
  books,
  courses,
  onNavigateTab,
  onOpenLogin,
}) => {
  const { isAuthenticated, user } = useAuth();

  // Translation matrix demonstration state
  const [sourceLang, setSourceLang] = useState<'en' | 'om' | 'am' | 'ar'>('en');
  const [targetLang, setTargetLang] = useState<'en' | 'om' | 'am' | 'ar'>('om');

  // Book filter state
  const [selectedBookLang, setSelectedBookLang] = useState<string>('all');
  const [selectedBookCat, setSelectedBookCat] = useState<string>('all');
  const [bookSearchQuery, setBookSearchQuery] = useState<string>('');

  // Course filter state
  const [selectedCourseCat, setSelectedCourseCat] = useState<string>('all');
  const [selectedCourseLevel, setSelectedCourseLevel] = useState<string>('all');

  // Portfolio filter state
  const [selectedPortfolioCat, setSelectedPortfolioCat] = useState<string>('all');

  // Resources filter state
  const [selectedResLang, setSelectedResLang] = useState<string>('all');
  const [selectedResCat, setSelectedResCat] = useState<string>('all');

  // Blog filter state
  const [selectedBlogCat, setSelectedBlogCat] = useState<string>('all');
  const [blogSearchQuery, setBlogSearchQuery] = useState<string>('');

  // FAQ open states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Form submission state
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [submittedRef, setSubmittedRef] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    telegram: '',
    email: '',
    service: 'ppt',
    language: 'English',
    projectTitle: '',
    description: '',
    format: 'Microsoft PowerPoint (.pptx)',
    deadline: '',
    extra: '',
  });

  // Translation demo text map
  const translationDemos: Record<'en' | 'om' | 'am' | 'ar', string> = {
    en: 'Accuracy and clarity matter in every language.',
    om: 'Qulqullinni fi iftoomni afaan hunda keessatti barbaachisaa dha.',
    am: 'ትክክለኛነት እና ግልጽነት በሁሉም ቋንቋዎች አስፈላጊ ናቸው።',
    ar: 'الدقة والوضوح أمران أساسيان في كل لغة.',
  };

  const langNames: Record<'en' | 'om' | 'am' | 'ar', string> = {
    en: 'English',
    om: 'Afaan Oromoo',
    am: 'አማርኛ (Amharic)',
    ar: 'العربية (Arabic)',
  };

  // Six core services from index-1.html
  const servicesList = [
    {
      id: 'ppt',
      title: 'PowerPoint / PPT Design',
      category: 'ppt' as ServiceCategory,
      badge: 'Academic & Professional',
      desc: 'Master slide templates, academic defense presentations, corporate decks, visual infographics, and multilingual slide typography.',
      icon: 'slideshow',
      highlights: ['Thesis & Dissertation Decks', 'LaTeX & Beamer Conversion', '16:9 Widescreen & Custom 4:3'],
    },
    {
      id: 'en_book',
      title: 'English Book Writing & Development',
      category: 'academic' as ServiceCategory,
      badge: 'Monographs & Textbooks',
      desc: 'Academic monographs, non-fiction manuscript development, grammar practice books, literature compilations, and educational curricula.',
      icon: 'menu_book',
      highlights: ['SGS Style Guidelines', 'APA / Harvard / IEEE References', 'Chapter-by-Chapter Peer Edits'],
    },
    {
      id: 'ar_book',
      title: 'Arabic Writing & Book Development',
      category: 'academic' as ServiceCategory,
      badge: 'Classical & Modern Standard',
      desc: 'Tajweed workbooks, Islamic research treatises, Arabic-English bilingual editions, classical Arabic grammar, and Right-to-Left (RTL) publishing.',
      icon: 'auto_stories',
      highlights: ['Right-to-Left Typesetting', 'Arabic Diacritics (Harakat)', 'Bilingual Cross-Referencing'],
    },
    {
      id: 'om_book',
      title: 'Afaan Oromoo Writing & Development',
      category: 'academic' as ServiceCategory,
      badge: 'Qubee & Cultural Anthologies',
      desc: 'Qubee orthography, Oromo language learning textbooks, cultural research compilations, folklore anthologies, and educational study guides.',
      icon: 'edit_note',
      highlights: ['Standard Qubee Conventions', 'Oromo Linguistic Analysis', 'Dual-Language Glossaries'],
    },
    {
      id: 'am_book',
      title: 'Amharic Writing & Publishing',
      category: 'academic' as ServiceCategory,
      badge: "Ge'ez Script & Monographs",
      desc: "Ge'ez script typography, academic articles, history and policy documents, creative non-fiction, and institutional documentation.",
      icon: 'history_edu',
      highlights: ["Ge'ez Unicode Kerning", 'Ethiopic Numerical Formats', 'Institutional Policy Briefs'],
    },
    {
      id: 'translation',
      title: 'Editing, Proofreading & Translation',
      category: 'translation' as ServiceCategory,
      badge: '4-Way Multilingual Matrix',
      desc: 'Direct translation between English, Afaan Oromoo, Amharic, and Arabic, alongside developmental editing, copyediting, and certificate indexing.',
      icon: 'translate',
      highlights: ['Human Domain-Expertise', 'Contextual Fidelity Verification', 'Direct Source-to-Target Layouts'],
    },
  ];

  // Publishing categories
  const publishingCategories = [
    {
      title: 'English Collection',
      langCode: 'en',
      tag: 'Academic, Research & Skills',
      count: '24+ Publications',
      desc: 'Doctoral dissertations, international conference proceedings, English grammar reference books, and academic research methodologies.',
      color: 'from-blue-900 to-indigo-950',
    },
    {
      title: 'Afaan Oromoo Collection',
      langCode: 'om',
      tag: 'Qubee, Culture & Pedagogy',
      count: '18+ Publications',
      desc: 'Standard Oromo grammar guides, regional historical documentations, folklore anthologies, and bilingual student handbooks.',
      color: 'from-emerald-900 to-teal-950',
    },
    {
      title: 'Amharic Collection',
      langCode: 'am',
      tag: "Ge'ez Script & Literature",
      count: '15+ Publications',
      desc: "Monographs in classical and contemporary Ge'ez script, agricultural research extensions, and Ethiopian literature anthologies.",
      color: 'from-amber-900 to-stone-950',
    },
    {
      title: 'Arabic Collection',
      langCode: 'ar',
      tag: 'Tajweed & Classical Works',
      count: '12+ Publications',
      desc: 'Quranic Arabic linguistics, Tajweed phonetics guides, classical text commentary, and bilingual English-Arabic study materials.',
      color: 'from-cyan-950 to-slate-950',
    },
  ];

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchLang = selectedBookLang === 'all' || b.language.toLowerCase() === selectedBookLang.toLowerCase();
      const matchCat = selectedBookCat === 'all' || b.category.toLowerCase() === selectedBookCat.toLowerCase();
      const matchSearch =
        !bookSearchQuery ||
        b.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(bookSearchQuery.toLowerCase());
      return matchLang && matchCat && matchSearch;
    });
  }, [books, selectedBookLang, selectedBookCat, bookSearchQuery]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchCat = selectedCourseCat === 'all' || c.category.toLowerCase().includes(selectedCourseCat.toLowerCase());
      const matchLevel = selectedCourseLevel === 'all' || c.level.toLowerCase() === selectedCourseLevel.toLowerCase();
      return matchCat && matchLevel;
    });
  }, [courses, selectedCourseCat, selectedCourseLevel]);

  // Portfolio items
  const portfolioItems = [
    {
      id: 1,
      title: 'Haramaya University Agronomy PhD Defense Master Deck',
      category: 'Presentation Design',
      client: 'College of Agriculture & Environmental Sciences',
      language: 'English & Latin Scientific',
      tag: 'LaTeX / PPTX Widescreen',
      desc: '16:9 animated LaTeX & PowerPoint defense slides with multi-panel agronomy charts, soil nutrient matrices, and SGS committee layouts.',
    },
    {
      id: 2,
      title: 'Essential Afaan Oromoo Academic Vocabulary Handbook',
      category: 'Book Publishing',
      client: 'Institute of Oromo Studies (IOS)',
      language: 'Afaan Oromoo & English',
      tag: 'Print & Digital Monograph',
      desc: '260-page comprehensive student handbook with standardized Qubee orthography, etymological trees, and subject index.',
    },
    {
      id: 3,
      title: 'Tajweed Phonetics with English-Arabic Transliteration',
      category: 'Arabic Publishing',
      client: 'Islamic Studies & Linguistics Department',
      language: 'Arabic & English',
      tag: 'Right-to-Left (RTL) Typesetting',
      desc: 'Color-coded phonetic articulation diagrams, classical calligraphy plates, and bilingual vocalization rules.',
    },
    {
      id: 4,
      title: 'Amharic-English Agricultural Extension Field Guide',
      category: 'Translation & Typesetting',
      client: 'Community Extension Services Hub',
      language: 'Amharic & English',
      tag: 'Field Handbook',
      desc: 'Dual-column translation guide for field agronomists, complete with crop pest diagnostics, local terminology, and farmer advisories.',
    },
  ];

  const filteredPortfolio = useMemo(() => {
    if (selectedPortfolioCat === 'all') return portfolioItems;
    return portfolioItems.filter((item) => item.category.toLowerCase().includes(selectedPortfolioCat.toLowerCase()));
  }, [selectedPortfolioCat]);

  // Educational resources
  const resourcesList = [
    {
      id: 1,
      title: '500 Essential Academic English Vocabulary List',
      category: 'Vocabulary & Lexicon',
      language: 'English',
      format: 'PDF Guide • 32 Pages',
      downloads: '1,420+',
    },
    {
      id: 2,
      title: 'Afaan Oromoo Grammar Quick Reference Chart',
      category: 'Grammar Reference',
      language: 'Afaan Oromoo',
      format: 'Printable Vector Sheet • 2 Pages',
      downloads: '980+',
    },
    {
      id: 3,
      title: 'Tajweed Pronunciation (Makharij) Illustrated Guide',
      category: 'Arabic Linguistics',
      language: 'Arabic & English',
      format: 'Color Diagram PDF • 18 Pages',
      downloads: '1,150+',
    },
    {
      id: 4,
      title: 'Academic Thesis Defense Presentation 16:9 Template',
      category: 'Presentation Design',
      language: 'Multilingual',
      format: 'Editable PPTX & Keynote • 45 Slides',
      downloads: '2,890+',
    },
  ];

  const filteredResources = useMemo(() => {
    return resourcesList.filter((r) => {
      const matchLang = selectedResLang === 'all' || r.language.toLowerCase().includes(selectedResLang.toLowerCase());
      const matchCat = selectedResCat === 'all' || r.category.toLowerCase().includes(selectedResCat.toLowerCase());
      return matchLang && matchCat;
    });
  }, [selectedResLang, selectedResCat]);

  // Blog articles
  const blogArticles = [
    {
      id: 1,
      title: '10 Essential Principles of High-Impact Academic PowerPoint Design',
      category: 'Presentation Design',
      readTime: '6 min read',
      date: 'May 12, 2026',
      author: 'Mr. Feysal Hussein',
      summary: 'Learn how to transform cluttered graduate research into clear, compelling slide decks that impress defense committees.',
    },
    {
      id: 2,
      title: 'Mastering Afaan Oromoo Orthography: Practical Writing Tips',
      category: 'Language & Writing',
      readTime: '8 min read',
      date: 'April 28, 2026',
      author: 'Editorial Desk',
      summary: 'A deep dive into standard Qubee rules, compound word formation, and avoiding common grammatical pitfalls.',
    },
    {
      id: 3,
      title: 'Right-to-Left (RTL) Typography in Multilingual Book Publishing',
      category: 'Publishing Craft',
      readTime: '7 min read',
      date: 'April 14, 2026',
      author: 'Linguistics Team',
      summary: 'How to manage bidirectional text, Arabic font pairing, and complex paragraph formatting in professional layouts.',
    },
    {
      id: 4,
      title: 'Preparing Your Manuscript for Academic Peer Review & SGS Clearance',
      category: 'Academic Research',
      readTime: '10 min read',
      date: 'March 30, 2026',
      author: 'Academic Board',
      summary: 'A step-by-step roadmap from initial draft to final DOI registry, institutional clearance, and archival indexing.',
    },
  ];

  const filteredBlog = useMemo(() => {
    return blogArticles.filter((b) => {
      const matchCat = selectedBlogCat === 'all' || b.category.toLowerCase().includes(selectedBlogCat.toLowerCase());
      const matchSearch =
        !blogSearchQuery ||
        b.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
        b.summary.toLowerCase().includes(blogSearchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedBlogCat, blogSearchQuery]);

  // FAQs
  const faqList = [
    {
      q: 'What languages do you support for writing, publishing, and translation?',
      a: 'We provide full native and academic support in four working languages: English, Afaan Oromoo, Amharic, and Arabic. We also handle bidirectional right-to-left (RTL) layout for Arabic and Ge’ez script formatting for Amharic.',
    },
    {
      q: 'How do I request a service and receive a formal pro-forma quotation?',
      a: 'You can submit your brief directly via the "Request a Service" form on this page, or call our team (+251 927 650 724 / +251 961 189 074) or contact Telegram (@FEYSAL_8). Our system generates an instant reference code and formal pro-forma invoice.',
    },
    {
      q: 'Can you help with thesis defense presentations and graduate monographs?',
      a: 'Yes, we specialize in Haramaya University School of Graduate Studies (SGS) compliant thesis defense slide decks, LaTeX Beamer setups, and full monograph book layouts with APA/IEEE referencing.',
    },
    {
      q: 'What formats are delivered upon completion?',
      a: 'We deliver editable Microsoft Word (.docx), editable PowerPoint (.pptx), print-ready vector PDF with crop marks, and interactive digital editions compatible with our built-in book reader.',
    },
    {
      q: 'How does the online book reader and e-learning system work?',
      a: 'You can browse featured titles in our online reader with full table of contents, bookmarking, and RTL Arabic view. In the e-learning academy, you can enroll in courses, take quizzes, and earn verifiable completion certificates.',
    },
  ];

  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.projectTitle || !formData.description) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    const ref = `WKI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(ref);
    setFormSubmitted(true);
  };

  const handleSwapTranslation = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  return (
    <div className="w-full flex flex-col bg-surface text-on-surface">
      {/* ========================================================================= */}
      {/* HERO SECTION — NETFLIX-INSPIRED CINEMATIC ATMOSPHERE                      */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden min-h-[580px] lg:min-h-[640px] flex items-center py-12 sm:py-16 lg:py-20 px-4 sm:px-8 border-b border-outline-variant/30 transition-colors">
        {/* 1. Cinematic Video Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center opacity-40 dark:opacity-45 scale-105 transition-opacity duration-700"
            poster="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23050505'/></svg>"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-34533-large.mp4"
              type="video/mp4"
            />
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-charts-and-data-31912-large.mp4"
              type="video/mp4"
            />
          </video>

          {/* 2. Cinematic Layered Vignette Overlays (Video remains clearly visible behind) */}
          {/* Base Horizontal Atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent dark:from-[#050505]/95 dark:via-[#050505]/75 dark:to-[#050505]/40 pointer-events-none"></div>

          {/* Vertical Horizon Blend */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/60 dark:from-[#050505] dark:via-transparent dark:to-black/60 pointer-events-none"></div>

          {/* Cinematic Radial Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.4)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.75)_100%)] pointer-events-none"></div>

          {/* Ambient Micro-Grid */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        </div>

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10 w-full">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container/90 dark:bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Wirtuu Kompiitaraa Ilillii • Haramaya University</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5.5xl font-extrabold font-serif tracking-tight leading-[1.12] text-on-surface">
              Transform Your Ideas Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 dark:from-amber-300 dark:via-amber-400 dark:to-amber-200">
                Professional Books, Presentations & Learning Materials
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed font-sans max-w-2xl">
              Professional writing, publishing, graduate presentation design, manuscript auditing, peer editing, translation, and educational curricula in English, Afaan Oromoo, Amharic, and Arabic.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => onRequestClick('ppt', 25)}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg hover:shadow-amber-500/25 active:scale-98 flex items-center gap-2 cursor-pointer border border-amber-400/50"
              >
                <span className="material-symbols-outlined text-[18px]">edit_document</span>
                <span>Request a Service</span>
              </button>

              <button
                onClick={onExploreCourses}
                className="px-6 py-3.5 rounded-xl bg-surface-container/90 dark:bg-black/50 hover:bg-surface-container-high dark:hover:bg-black/70 backdrop-blur-md text-on-surface font-bold text-sm transition-all border border-outline-variant/40 active:scale-98 flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-500">school</span>
                <span>Explore Learning Platform</span>
              </button>

              <a
                href="#contact-section"
                className="px-5 py-3.5 rounded-xl bg-transparent hover:bg-surface-container/50 text-on-surface-variant hover:text-on-surface font-bold text-sm transition-all border border-outline-variant/30 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">contact_support</span>
                <span>Contact Us</span>
              </a>
            </div>

            {/* Multilingual Support Badges */}
            <div className="pt-4 border-t border-outline-variant/20 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
              <span className="font-semibold text-on-surface mr-1">Supported Languages:</span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container/80 dark:bg-black/50 border border-outline-variant/20 text-on-surface font-medium">English</span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container/80 dark:bg-black/50 border border-outline-variant/20 text-on-surface font-medium">Afaan Oromoo</span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container/80 dark:bg-black/50 border border-outline-variant/20 text-on-surface font-medium font-serif">አማርኛ</span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container/80 dark:bg-black/50 border border-outline-variant/20 text-on-surface font-medium" dir="rtl">
                العربية
              </span>
            </div>
          </div>

          {/* Right: Transparent Glowing Information Card with Animated Rotating Perimeter Beam */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl p-[1.5px] animated-border-beam shadow-[0_0_35px_rgba(245,158,11,0.18)] dark:shadow-[0_0_40px_rgba(245,158,11,0.15)] group">
              {/* Inner Translucent Glass Card (Background video is visible through it!) */}
              <div className="relative rounded-2xl bg-white/80 dark:bg-black/55 backdrop-blur-xl border border-white/40 dark:border-white/10 p-5 sm:p-6 text-on-surface space-y-4">
                {/* Header with Live Beacon */}
                <div className="flex items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    </span>
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface font-mono">
                        Institutional Intelligence Hub
                      </h3>
                      <p className="text-[10px] text-on-surface-variant">Haramaya University • SGS Accredited</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live</span>
                  </span>
                </div>

                {/* Cyber & Academic Telemetry Blocks */}
                <div className="space-y-2.5">
                  {/* Item 1: Threat & Phishing Detection */}
                  <div className="p-3 rounded-xl bg-surface-container/70 dark:bg-white/[0.04] border border-outline-variant/25 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px]">shield</span>
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-on-surface truncate">Phishing & Link Threat Shield</div>
                        <div className="text-[10px] text-on-surface-variant truncate font-mono">0 Vulnerabilities • SSL/SGS Active</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold shrink-0">
                      SECURE
                    </span>
                  </div>

                  {/* Item 2: Plagiarism & Originality Radar */}
                  <div className="p-3 rounded-xl bg-surface-container/70 dark:bg-white/[0.04] border border-outline-variant/25 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px]">policy</span>
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-on-surface truncate">Academic Integrity & Plagiarism</div>
                        <div className="text-[10px] text-on-surface-variant truncate font-mono">99.4% Originality • Pre-Check Ready</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold shrink-0">
                      PASSED
                    </span>
                  </div>

                  {/* Item 3: Doctoral Defense Studio */}
                  <div className="p-3 rounded-xl bg-surface-container/70 dark:bg-white/[0.04] border border-outline-variant/25 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px]">slideshow</span>
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-on-surface truncate">Doctoral PPT & Beamer Studio</div>
                        <div className="text-[10px] text-on-surface-variant truncate font-mono">16:9 Widescreen • LaTeX Synced</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold shrink-0">
                      READY
                    </span>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-2">
                  <button
                    onClick={onOpenDiagnostic}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">spellcheck</span>
                    <span>Audit Manuscript</span>
                  </button>
                  <button
                    onClick={onOpenPlagiarism}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high dark:bg-white/[0.08] dark:hover:bg-white/[0.12] text-on-surface font-semibold text-xs transition-all border border-outline-variant/30 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px] text-amber-500">qr_code_scanner</span>
                    <span>Scan Plagiarism</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TRUST STRIP */}
      {/* ========================================================================= */}
      <section className="py-6 px-4 sm:px-8 bg-surface-container-low border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-outline-variant/20 shadow-xs">
            <span className="p-2 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 shrink-0">
              <span className="material-symbols-outlined text-[20px]">translate</span>
            </span>
            <div>
              <h4 className="font-bold text-xs text-on-surface">Multilingual by Design</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">
                Authentic translation across 4 languages with RTL Arabic.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-outline-variant/20 shadow-xs">
            <span className="p-2 rounded-lg bg-blue-500/15 text-blue-700 dark:text-blue-400 shrink-0">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </span>
            <div>
              <h4 className="font-bold text-xs text-on-surface">Education Focused</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">
                Curricula and learning materials structured for classroom use.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-outline-variant/20 shadow-xs">
            <span className="p-2 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 shrink-0">
              <span className="material-symbols-outlined text-[20px]">auto_stories</span>
            </span>
            <div>
              <h4 className="font-bold text-xs text-on-surface">Professional Publishing</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">
                Typesetting, ISBN registry, and print-ready production.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-outline-variant/20 shadow-xs">
            <span className="p-2 rounded-lg bg-purple-500/15 text-purple-700 dark:text-purple-400 shrink-0">
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </span>
            <div>
              <h4 className="font-bold text-xs text-on-surface">Direct Communication</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">
                Reach Mr. Feysal Hussein directly via phone or Telegram.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ABOUT SECTION */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Visual Badge */}
          <div className="lg:col-span-5 relative">
            <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/30 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400">
                <span className="material-symbols-outlined text-[32px]">account_balance</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Academic Affiliation
                </span>
                <h3 className="text-xl font-bold font-serif text-on-surface">Mr. Feysal Hussein</h3>
                <p className="text-xs text-on-surface-variant">
                  Founder & Director • Wirtuu Kompiitaraa Ilillii • Haramaya University
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-surface text-xs text-on-surface-variant border border-outline-variant/20 leading-relaxed">
                Dedicated to helping researchers, authors, students, and institutions transform ideas into high-quality
                written and digital materials with SGS precision.
              </div>
              <div className="flex items-center gap-2 pt-2">
                <a
                  href="tel:+251927650724"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-amber-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>Call Director</span>
                </a>
                <a
                  href="https://t.me/FEYSAL_8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs flex items-center gap-1 transition-colors border border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Telegram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Text Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                About WKI Publishing
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-on-surface leading-tight">
                Turning ideas into high-quality written and digital materials
              </h2>
            </div>

            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Wirtuu Kompiitaraa Ilillii Publishing Services is a professional writing, publishing, presentation design,
              editing, translation, and educational content service dedicated to helping individuals and organizations
              transform ideas into high-quality written and digital materials.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Professional Quality</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Every manuscript and slide deck is reviewed for accuracy, consistency, and presentation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">public</span>
                  <span>Multilingual Capability</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Four working languages with correct script rendering, typography, and page direction.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">devices</span>
                  <span>Modern Technology</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Editable source files, digital publishing formats, and built-in interactive book reader.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
                  <span>Attention to Detail</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Formatting, references, diagrams, and layout handled with rigorous editorial care.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onRequestClick('academic', 30)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Start Your Project
              </button>
              <a
                href="#services-section"
                className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-colors border border-outline-variant/20"
              >
                See Our Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SERVICES DASHBOARD & INTERACTIVE TRANSLATION DEMO */}
      {/* ========================================================================= */}
      <section id="services-section" className="py-14 sm:py-20 px-4 sm:px-8 bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              Service Dashboard
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-on-surface">
              Professional services across six areas of expertise
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Choose the service that matches your project. Each one covers the full path from your first draft or brief to a finished, delivery-ready file.
            </p>
          </div>

          {/* 6 Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((service) => (
              <div
                key={service.id}
                className="p-6 rounded-2xl bg-surface border border-outline-variant/30 hover:border-amber-500/50 transition-all shadow-sm flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="p-3 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <span className="material-symbols-outlined text-[24px]">{service.icon}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-on-surface group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{service.desc}</p>

                  <div className="space-y-1.5 pt-2 border-t border-outline-variant/20">
                    {service.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-on-surface font-medium">
                        <span className="material-symbols-outlined text-[14px] text-amber-600">check_circle</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-outline-variant/20">
                  <button
                    onClick={() => onRequestClick(service.category, 25)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Request This Service</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Translation Matrix Showcase */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  Live Translation Demo
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  See how we move a text between languages
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pick a source and target language to preview the translation pairings we support. All professional projects undergo human verification with domain-specific terminology.
                </p>

                {/* Supported pairings pills */}
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400 pt-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">English ↔ Afaan Oromoo</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">English ↔ Amharic</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">English ↔ Arabic</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Oromoo ↔ Amharic</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Oromoo ↔ Arabic</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Amharic ↔ Arabic</span>
                </div>
              </div>

              {/* Interactive Matrix Output Panel */}
              <div className="lg:col-span-7 space-y-4">
                {/* Language Selectors and Swap */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">From:</span>
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value as any)}
                      className="bg-slate-900 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 outline-none"
                    >
                      <option value="en">English</option>
                      <option value="om">Afaan Oromoo</option>
                      <option value="am">አማርኛ (Amharic)</option>
                      <option value="ar">العربية (Arabic)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSwapTranslation}
                    className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-amber-400 transition-colors cursor-pointer flex items-center justify-center"
                    title="Swap Translation Direction"
                  >
                    <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">To:</span>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value as any)}
                      className="bg-slate-900 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 outline-none"
                    >
                      <option value="om">Afaan Oromoo</option>
                      <option value="en">English</option>
                      <option value="am">አማርኛ (Amharic)</option>
                      <option value="ar">العربية (Arabic)</option>
                    </select>
                  </div>
                </div>

                {/* Source Output Box */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Source • {langNames[sourceLang]}
                  </span>
                  <p
                    className="text-sm font-medium text-slate-100"
                    dir={sourceLang === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {translationDemos[sourceLang]}
                  </p>
                </div>

                {/* Target Output Box */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                    Target • {langNames[targetLang]}
                  </span>
                  <p
                    className="text-sm font-bold text-amber-300"
                    dir={targetLang === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {translationDemos[targetLang]}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onRequestClick('translation', 20)}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">translate</span>
                    <span>Translate My Document</span>
                  </button>
                  <span className="text-[11px] text-slate-400">Accurate grammar & terminology guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PUBLISHING CATEGORIES */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Publishing Categories
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-on-surface">
              Four language collections, one publishing standard
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl">
              Each collection is developed with the script, typography, and conventions of its language — from Ge'ez and Latin script through to right-to-left Arabic setting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {publishingCategories.map((cat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      {cat.tag}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface text-on-surface-variant font-bold">
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-serif text-on-surface">{cat.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{cat.desc}</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedBookLang(cat.langCode);
                    const el = document.getElementById('book-library-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold transition-colors cursor-pointer border border-outline-variant/20 flex items-center justify-center gap-1"
                >
                  <span>Explore Collection</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. ONLINE BOOK LIBRARY SHOWCASE & READER INTEGRATION */}
      {/* ========================================================================= */}
      <section id="book-library-section" className="py-14 sm:py-20 px-4 sm:px-8 bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                Digital Library
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-on-surface">
                Featured books & digital publications
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Browse titles by language and category. Every book opens in our online reader with table of contents and progress tracking.
              </p>
            </div>

            <button
              onClick={onExploreBooks}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">local_library</span>
              <span>Full Book Catalogue ({books.length})</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-surface border border-outline-variant/20 flex flex-wrap items-center justify-between gap-4">
            {/* Language Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-on-surface-variant mr-1">Language:</span>
              {['all', 'english', 'afaan oromoo', 'amharic', 'arabic'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedBookLang(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedBookLang === lang
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {lang === 'all' ? 'All Languages' : lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Search publications..."
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.slice(0, 6).map((book) => (
              <div
                key={book.id}
                className="p-5 rounded-3xl bg-surface border border-outline-variant/30 hover:border-amber-500/50 transition-all shadow-sm flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                      {book.category}
                    </span>
                    <span className="text-[10px] font-mono text-on-surface-variant font-bold">
                      {book.language.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-on-surface group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">{book.description}</p>
                </div>

                <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                  <div className="text-xs text-on-surface font-semibold truncate max-w-[140px]">{book.author}</div>
                  <button
                    onClick={() => onOpenReader(book)}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">menu_book</span>
                    <span>Read Book</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. E-LEARNING & FEATURED COURSES SECTION */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Top Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
                E-Learning Academy
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white leading-tight">
                Learn language, writing and academic skills in one place
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Our learning environment brings courses, video and text lessons, PDF resources, quizzes, and progress tracking together — so you can start a course, continue where you left off, and earn completion certificates.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <span className="material-symbols-outlined text-[18px] text-amber-400">videocam</span>
                  <span>Video & Text Lessons</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <span className="material-symbols-outlined text-[18px] text-amber-400">quiz</span>
                  <span>Quizzes & Progress</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <span className="material-symbols-outlined text-[18px] text-amber-400">workspace_premium</span>
                  <span>Certificates of Merit</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <span className="material-symbols-outlined text-[18px] text-amber-400">bookmarks</span>
                  <span>Saved Reference Books</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onExploreCourses}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Start Learning Now
                </button>
                <button
                  onClick={() => onNavigateTab('student')}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700 cursor-pointer"
                >
                  Scholar Dashboard
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Academy Statistics</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">Live</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-2xl font-extrabold font-serif text-amber-400">14+</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Specialized Courses</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-2xl font-extrabold font-serif text-amber-400">4</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Working Languages</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-2xl font-extrabold font-serif text-amber-400">100%</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Verifiable Certificates</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-2xl font-extrabold font-serif text-amber-400">SGS</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Academic Compliance</div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Courses Carousel / Grid */}
          <div className="space-y-6 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-serif text-white">Featured Course Catalogue</h3>
              <button
                onClick={onExploreCourses}
                className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
              >
                View all courses &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCourses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all shadow-md flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                        {course.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{course.level}</span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{course.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      <span>{course.lessons.length} Lessons</span> • <span>{course.duration}</span>
                    </div>
                    <button
                      onClick={onExploreCourses}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. HOW IT WORKS (4 CLEAR STEPS) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              Workflow Pipeline
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-on-surface">
              From your first idea to final delivery
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Four clear steps with direct communication and milestone validation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/30 space-y-3 relative shadow-xs">
              <span className="text-3xl font-extrabold font-serif text-amber-600/40">01</span>
              <h3 className="font-serif font-bold text-base text-on-surface">Tell Us Your Idea</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Submit your project requirements, page count, and language preferences through our online form.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/30 space-y-3 relative shadow-xs">
              <span className="text-3xl font-extrabold font-serif text-amber-600/40">02</span>
              <h3 className="font-serif font-bold text-base text-on-surface">Discuss Your Project</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Clarify language, formatting specifications, timeline, reference styles, and deliverable format with our editorial director.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/30 space-y-3 relative shadow-xs">
              <span className="text-3xl font-extrabold font-serif text-amber-600/40">03</span>
              <h3 className="font-serif font-bold text-base text-on-surface">Professional Craft</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Writing, designing, LaTeX coding, editing, translation, formatting, or presentation development begins under SGS rigor.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/30 space-y-3 relative shadow-xs">
              <span className="text-3xl font-extrabold font-serif text-amber-600/40">04</span>
              <h3 className="font-serif font-bold text-base text-on-surface">Review & Delivery</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Receive the completed professional files, conduct revision passes, and download final print-ready source archives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. PORTFOLIO SHOWCASE */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              Work Showcase
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-on-surface">
              Examples of the work we produce
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl">
              Browse examples across academic defense presentations, published monographs, and multilingual translation guides.
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPortfolio.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-surface border border-outline-variant/30 space-y-3 shadow-xs hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-on-surface-variant">{item.tag}</span>
                </div>
                <h3 className="text-lg font-bold font-serif text-on-surface">{item.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-on-surface-variant border-t border-outline-variant/20">
                  <span>Client: {item.client}</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{item.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FREE EDUCATIONAL RESOURCES */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Open Educational Resources
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-on-surface">
              Free study materials and templates
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl">
              Vocabulary lists, grammar notes, idioms, proverbs, study guides, and presentation templates available for student and researcher use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="p-5 rounded-3xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    {res.category}
                  </span>
                  <h3 className="font-serif font-bold text-sm text-on-surface">{res.title}</h3>
                  <p className="text-xs text-on-surface-variant font-mono">{res.format}</p>
                </div>

                <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant">{res.downloads} downloads</span>
                  <button
                    onClick={() => {
                      alert(`Downloading "${res.title}"... Free student resource package provided by WKI Publishing.`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">download</span>
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. KNOWLEDGE CENTER / BLOG */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                Knowledge Center
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-on-surface">
                Writing, language & publishing insights
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Practical articles on grammar, vocabulary, presentation design, and scholarly publishing.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('blog')}
              className="px-5 py-2.5 rounded-xl bg-surface hover:bg-surface-container text-on-surface text-xs font-bold transition-colors border border-outline-variant/30 cursor-pointer shrink-0"
            >
              Browse All Articles &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBlog.map((article) => (
              <div
                key={article.id}
                className="p-5 rounded-3xl bg-surface border border-outline-variant/30 space-y-3 shadow-xs hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
                    <span className="font-bold text-amber-600 dark:text-amber-400">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-on-surface line-clamp-2">{article.title}</h3>
                  <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">{article.summary}</p>
                </div>

                <div className="pt-3 border-t border-outline-variant/20 text-[11px] text-on-surface-variant flex items-center justify-between">
                  <span>{article.author}</span>
                  <span>{article.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. REQUEST A SERVICE FORM WITH LIVE SUBMISSION */}
      {/* ========================================================================= */}
      <section id="request-section" className="py-14 sm:py-20 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              Request a Service
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-on-surface">
              Tell us about your project
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Complete the form and our team will review your requirements, prepare an official pro-forma brief, and contact you directly.
            </p>
          </div>

          {!formSubmitted ? (
            <form
              onSubmit={handleFormSubmit}
              className="p-6 sm:p-8 rounded-3xl bg-surface-container border border-outline-variant/30 space-y-6 shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Abebe Tadesse"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+251 9... / 09..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Telegram Username (optional)</label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Email Address (optional)</label>
                  <input
                    type="email"
                    placeholder="name@haramaya.edu.et"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">
                    Select Service <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-amber-500"
                  >
                    <option value="ppt">PowerPoint / PPT Presentation Design</option>
                    <option value="book_writing">Book Writing & Development</option>
                    <option value="translation">Translation (English, Oromo, Amharic, Arabic)</option>
                    <option value="editing">Academic Editing & Proofreading</option>
                    <option value="arabic">Arabic Typesetting & Publishing</option>
                    <option value="elearning">E-Learning Curriculum Development</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">
                    Language Selection <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-amber-500"
                  >
                    <option value="English">English</option>
                    <option value="Afaan Oromoo">Afaan Oromoo</option>
                    <option value="Amharic">Amharic (አማርኛ)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                    <option value="English & Afaan Oromoo">English & Afaan Oromoo</option>
                    <option value="English & Amharic">English & Amharic</option>
                    <option value="English & Arabic">English & Arabic</option>
                    <option value="Multilingual">Multilingual (All 4 Languages)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">
                  Project Title / Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agronomy Doctoral Defense Slide Deck & Monograph"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">
                  Project Description & Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your audience, approximate slide count or page length, referencing style (APA, SGS), and specific expectations..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Required Delivery Format</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-amber-500"
                  >
                    <option>Microsoft PowerPoint (.pptx)</option>
                    <option>Microsoft Word (.docx)</option>
                    <option>Print-ready Vector PDF</option>
                    <option>Interactive Digital Edition</option>
                    <option>LaTeX / Beamer Source Files</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Expected Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-md cursor-pointer"
                >
                  Submit Service Request
                </button>
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
                  <span>Confidentiality & SGS standard guaranteed</span>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <h3 className="text-2xl font-bold font-serif text-on-surface">Thank You! Your Request is Received</h3>
              <p className="text-xs text-on-surface-variant max-w-lg mx-auto">
                Your project brief has been registered in the WKI editorial desk. Mr. Feysal Hussein and the team will review your requirements and reach out to your phone/Telegram shortly.
              </p>
              <div className="inline-block px-4 py-2 rounded-xl bg-surface border border-outline-variant/30 font-mono text-xs font-bold text-amber-600">
                Official Reference: {submittedRef}
              </div>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => onNavigateTab('portal')}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                >
                  Track in Client Portal
                </button>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-5 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-bold border border-outline-variant/20 hover:bg-surface-container-high transition-colors"
                >
                  Submit Another Brief
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14. CONTACT & COMPREHENSIVE FAQ */}
      {/* ========================================================================= */}
      <section id="contact-section" className="py-14 sm:py-20 px-4 sm:px-8 bg-surface-container-low border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Direct Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                Direct Contact
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface">
                Talk to us about your project
              </h2>
              <p className="text-xs text-on-surface-variant">
                Call, message on Telegram, or submit a request — whichever is easiest for you.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface border border-outline-variant/30 space-y-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="p-2.5 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </span>
                <div>
                  <div className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">Contact Person</div>
                  <div className="font-bold text-sm text-on-surface">Mr. Feysal Hussein</div>
                  <div className="text-xs text-on-surface-variant">Founder & Director • Haramaya University</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-2.5 rounded-xl bg-blue-500/15 text-blue-700 dark:text-blue-400 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </span>
                <div>
                  <div className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">Phone Lines</div>
                  <a href="tel:+251927650724" className="block text-xs font-mono font-bold text-on-surface hover:text-amber-600">
                    +251 927 650 724
                  </a>
                  <a href="tel:+251961189074" className="block text-xs font-mono font-bold text-on-surface hover:text-amber-600">
                    +251 961 189 074
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </span>
                <div>
                  <div className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">Telegram</div>
                  <a
                    href="https://t.me/FEYSAL_8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    @FEYSAL_8 (Direct Chat)
                  </a>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="tel:+251927650724"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>Call Director Now</span>
                </a>
                <a
                  href="https://t.me/FEYSAL_8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Message on Telegram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right FAQ Accordion */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-bold font-serif text-on-surface">Frequently Asked Questions</h3>

            <div className="space-y-3">
              {faqList.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-surface border border-outline-variant/30 overflow-hidden shadow-xs"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-on-surface hover:text-amber-600 transition-colors cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <span className="material-symbols-outlined text-[18px] shrink-0 text-on-surface-variant">
                        {isOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 15. INSTITUTIONAL EXTENSION & HU-BIIC CONNECTIVITY BANNER */}
      {/* ========================================================================= */}
      <section className="py-10 px-4 sm:px-8 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl text-center md:text-left">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
              Academic Ecosystem Hub
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
              Explore WKI Institutional Dashboards & Research Services
            </h3>
            <p className="text-xs text-slate-300">
              Access the Scholar Workspace, Tech Transfer Hub, Institutional Repository (ETD), Peer Review Portal, and Grant Management Studio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('tech_transfer')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Tech Transfer Hub
            </button>
            <button
              onClick={() => onNavigateTab('dashboards')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700 cursor-pointer"
            >
              All Dashboards &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
