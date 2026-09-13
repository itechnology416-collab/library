import React, { useState, useEffect } from 'react';
import { Book, Course, Language, ServiceCategory } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';
import { translations } from '../utils/translations';
import { useAuth } from '../context/AuthContext';

interface ModernLandingPageProps {
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

export const ModernLandingPage: React.FC<ModernLandingPageProps> = ({
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
  const { user, isAuthenticated } = useAuth();
  const t = translations[currentLanguage];

  // Hero interactive showcase state
  const [heroActiveTab, setHeroActiveTab] = useState<'slides' | 'monograph' | 'doi' | 'plagiarism'>('slides');
  const [heroSlidePage, setHeroSlidePage] = useState<number>(1);

  // Before & After comparison slider state
  const [comparisonView, setComparisonView] = useState<'after' | 'before' | 'split'>('after');
  const [splitPosition, setSplitPosition] = useState<number>(50);

  // Quick estimator state
  const [estService, setEstService] = useState<ServiceCategory>('ppt');
  const [estPages, setEstPages] = useState<number>(25);
  const [estUrgency, setEstUrgency] = useState<'standard' | 'express' | 'super'>('standard');
  const [estScript, setEstScript] = useState<'latin' | 'geez' | 'arabic'>('latin');

  // Interactive slide preview content
  const heroSlides = [
    {
      page: 1,
      title: 'Multivariate Agrobiodiversity Dynamics in Eastern Oromia',
      subtitle: 'Doctoral Defense • Haramaya University College of Agriculture',
      author: 'Candidate: Gemechu Tadesse (PhD Fellow) • Supervisor: Prof. Fatuma Ahmed',
      badge: 'LaTeX Beamer 16:9 • SGS Compliant',
      points: [
        'Longitudinal 5-Year Empirical Dataset (N=420 Smallholder Plots)',
        'Sentinel-2 Multi-spectral NDVI & Soil Organic Carbon Indices',
        'Spatial Autocorrelation via GeoPandas & R Biometrics Engine',
      ],
      footerNote: 'Haramaya University School of Graduate Studies • Defence Ready',
    },
    {
      page: 2,
      title: 'Methodological Architecture & Spatial Sampling Matrix',
      subtitle: 'Section 2.3: Stratified Multi-Stage Cluster Sampling',
      author: 'Maya, Kombolcha, and Kersa Woredas Agro-Ecological Zones',
      badge: 'Empirical Verification Matrix',
      points: [
        'Phase I: High-Resolution Orthomosaic Drone Mapping (0.05m GSD)',
        'Phase II: Core Soil Sampling & Isotopic Carbon Tracing',
        'Phase III: Double-Blind Farmer Participatory Resilience Index',
      ],
      footerNote: 'Accredited by Haramaya Research & Extension Directorate',
    },
    {
      page: 3,
      title: 'Empirical Regression Findings & Policy Implications',
      subtitle: 'Section 4.1: Yield Stability under Climate Shocks (p < 0.001)',
      author: 'Statistical Modeling: R-Studio Multivariate ANOVA Suite',
      badge: 'Key Research Highlight',
      points: [
        'Intercropping enhanced Soil Organic Carbon by +28.4% (p < 0.001)',
        'Seasonal yield volatility decreased from 0.42 to 0.79 index value',
        'Direct adoption pathway into National Extension Extension Manuals',
      ],
      footerNote: 'Published in East African Journal of Sciences (EAJS)',
    },
  ];

  // Calculate live estimate in ETB and USD
  const baseRateMap: Record<ServiceCategory, number> = {
    ppt: 140,
    english_book: 190,
    oromoo_book: 190,
    amharic_book: 190,
    arabic_book: 210,
    translation: 160,
    editing: 85,
    formatting: 95,
    elearning: 120,
    other: 100,
  };

  const urgencyMultiplier = estUrgency === 'super' ? 1.5 : estUrgency === 'express' ? 1.25 : 1.0;
  const scriptMultiplier = estScript === 'arabic' ? 1.2 : estScript === 'geez' ? 1.1 : 1.0;
  const unitRate = Math.round((baseRateMap[estService] || 140) * urgencyMultiplier * scriptMultiplier);
  const totalCostETB = unitRate * estPages;
  const totalCostUSD = Math.round((totalCostETB / 135) * 10) / 10;
  const estDays = estUrgency === 'super' ? Math.max(1, Math.ceil(estPages / 35)) : estUrgency === 'express' ? Math.max(2, Math.ceil(estPages / 20)) : Math.max(3, Math.ceil(estPages / 12));

  const languages: { code: Language; label: string; flag: string; rtl?: boolean }[] = [
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'or', label: 'Afaan Oromoo', flag: 'OR' },
    { code: 'am', label: 'አማርኛ', flag: 'AM' },
    { code: 'ar', label: 'العربية (RTL)', flag: 'AR', rtl: true },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 animate-in fade-in duration-300">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION: ADVANCED & INTERACTIVE */}
      {/* ------------------------------------------------------------- */}
      <section className="relative px-gutter-mobile pt-2 sm:pt-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero Container Card */}
          <div className="relative rounded-3xl bg-linear-to-br from-[#072418] via-[#0d3b28] to-[#04170f] text-white p-6 sm:p-8 lg:p-12 shadow-2xl border border-emerald-900/40 overflow-hidden">
            {/* Ambient Background Glows & Vector Geometry */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#1b5e20_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Headline, Value Proposition & Action Triggers */}
              <div className="lg:col-span-6 space-y-6">
                {/* Institutional Badge & Language Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Haramaya University Press Partner</span>
                  </div>
                  <span className="text-xs text-emerald-200/70 font-medium">
                    • Official Publishing Center
                  </span>
                </div>

                {/* Primary Display Title */}
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-[1.15] text-white">
                    {currentLanguage === 'or' ? (
                      <>Qorannoo fi Maxxansa <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-emerald-200 to-teal-200">Barnoota Olaanoo</span></>
                    ) : currentLanguage === 'am' ? (
                      <>የከፍተኛ ትምህርት <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-emerald-200 to-teal-200">ጥናትና ህትመት ማዕከል</span></>
                    ) : currentLanguage === 'ar' ? (
                      <>منصة النشر <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-emerald-200 to-teal-200">الأكاديمي والبحث العلمي</span></>
                    ) : (
                      <>Academic Publishing, <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-emerald-200 to-teal-200">Thesis Defense Decks</span> & Digital Press</>
                    )}
                  </h1>
                  <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed max-w-xl font-normal">
                    {t.heroSubtext ||
                      'Specialized multilingual academic typesetting, LaTeX Beamer defense slide decomposition, Crossref DOI registration, and peer-reviewed monograph publishing for Ethiopian scholars and researchers.'}
                  </p>
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => onRequestClick('ppt', 25)}
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit_document</span>
                    <span>{t.requestServiceBtn || 'Submit Project Brief'}</span>
                  </button>

                  <button
                    onClick={() => onOpenQuotation(25, 'ppt')}
                    className="px-5 py-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 text-white font-semibold text-sm flex items-center gap-2 border border-emerald-600/40 backdrop-blur-md active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[19px] text-amber-300">calculate</span>
                    <span>Instant Price Quotation</span>
                  </button>

                  {/* Real Authentication Button / Status */}
                  {isAuthenticated && user ? (
                    <button
                      onClick={() => onNavigateTab('dashboards')}
                      className="px-4 py-3 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 border border-emerald-400/40 transition-all cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[18px] text-amber-300">dashboard</span>
                      <span>Workspace ({user.name.split(' ')[0]})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (onOpenLogin) {
                          onOpenLogin();
                        } else {
                          onNavigateTab('login');
                        }
                      }}
                      className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm flex items-center gap-2 border border-white/20 transition-all cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[19px] text-amber-300">login</span>
                      <span>Sign In</span>
                    </button>
                  )}

                  <button
                    onClick={onOpenSearch}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer flex items-center justify-center"
                    title="Open Command Palette (Cmd + K)"
                  >
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </button>
                </div>

                {/* Multilingual Switcher Strip */}
                <div className="pt-2 border-t border-emerald-800/40">
                  <div className="flex items-center gap-2 text-xs text-emerald-200/80 mb-2 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-amber-300">translate</span>
                    <span>Institutional Language Editions:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {languages.map((lang) => {
                      const isActive = currentLanguage === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => onLanguageChange(lang.code)}
                          dir={lang.rtl ? 'rtl' : 'ltr'}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isActive
                              ? 'bg-amber-400 text-slate-950 shadow-xs font-bold'
                              : 'bg-emerald-950/60 text-emerald-100 hover:bg-emerald-900 border border-emerald-800/40'
                          }`}
                        >
                          <span className="text-[11px] opacity-75 font-mono">{lang.flag}</span>
                          <span>{lang.label}</span>
                          {isActive && (
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Trust Metrics Pill Bar */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/30 text-center">
                    <div className="text-base sm:text-lg font-bold text-amber-300 font-mono">340+</div>
                    <div className="text-[10px] text-emerald-200/70 font-medium">Theses Formatted</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/30 text-center">
                    <div className="text-base sm:text-lg font-bold text-amber-300 font-mono">100%</div>
                    <div className="text-[10px] text-emerald-200/70 font-medium">SGS Compliant</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/30 text-center">
                    <div className="text-base sm:text-lg font-bold text-amber-300 font-mono">48-Hr</div>
                    <div className="text-[10px] text-emerald-200/70 font-medium">Express Turnaround</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive Manuscript & Beamer Showcase Box */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl bg-slate-950/90 border border-emerald-700/40 shadow-2xl p-4 sm:p-5 flex flex-col space-y-4 backdrop-blur-xl">
                  {/* Top Switcher Tabs */}
                  <div className="flex items-center justify-between gap-1 pb-2 border-b border-emerald-900/60 overflow-x-auto scrollbar-none">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setHeroActiveTab('slides')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                          heroActiveTab === 'slides'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">slideshow</span>
                        <span>Defense Slide Deck</span>
                      </button>

                      <button
                        onClick={() => setHeroActiveTab('monograph')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                          heroActiveTab === 'monograph'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">menu_book</span>
                        <span>Monograph Typeset</span>
                      </button>

                      <button
                        onClick={() => setHeroActiveTab('doi')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                          heroActiveTab === 'doi'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">link</span>
                        <span>Crossref DOI</span>
                      </button>

                      <button
                        onClick={() => setHeroActiveTab('plagiarism')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                          heroActiveTab === 'plagiarism'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">policy</span>
                        <span>Similarity 96.8%</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline-block">
                      LIVE PREVIEW
                    </span>
                  </div>

                  {/* TAB 1: DEFENSE SLIDE DECK LIVE PREVIEW */}
                  {heroActiveTab === 'slides' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      {/* Slide Canvas Simulator */}
                      <div className="aspect-16/9 w-full rounded-xl bg-slate-900 border border-emerald-600/30 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-inner text-slate-100">
                        {/* Slide Header */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-700/40">
                              {heroSlides[heroSlidePage - 1].badge}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              SLIDE {heroSlidePage} / {heroSlides.length}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold font-serif text-amber-200 line-clamp-2">
                            {heroSlides[heroSlidePage - 1].title}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {heroSlides[heroSlidePage - 1].subtitle}
                          </p>
                        </div>

                        {/* Slide Body Key Points */}
                        <div className="space-y-1.5 my-2">
                          {heroSlides[heroSlidePage - 1].points.map((pt, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                              <span className="material-symbols-outlined text-[15px] text-amber-400 shrink-0 mt-0.5">
                                arrow_right
                              </span>
                              <span className="text-[11px] sm:text-xs">{pt}</span>
                            </div>
                          ))}
                        </div>

                        {/* Slide Footer */}
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="truncate">{heroSlides[heroSlidePage - 1].author}</span>
                          <span className="text-emerald-400 font-medium shrink-0 ml-2">WKI Press v4.2</span>
                        </div>
                      </div>

                      {/* Slide Controls & Quick Actions */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setHeroSlidePage((p) => (p > 1 ? p - 1 : heroSlides.length))}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
                            <span>Prev</span>
                          </button>
                          <button
                            onClick={() => setHeroSlidePage((p) => (p < heroSlides.length ? p + 1 : 1))}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Next</span>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={onOpenThesisSlideStudio}
                            className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                            <span>Open Slide Studio</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: MONOGRAPH TYPESETTING PREVIEW */}
                  {heroActiveTab === 'monograph' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="aspect-16/9 w-full rounded-xl bg-slate-900 border border-emerald-600/30 p-4 sm:p-5 flex flex-col justify-between text-slate-100 relative overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div>
                            <span className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">
                              Haramaya Monograph Series #48
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold font-serif text-white">
                              Linguistic Documentation of East Oromo Dialects
                            </h4>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-mono border border-blue-800">
                            ISBN 978-99944-72-88-1
                          </span>
                        </div>

                        <div className="space-y-1.5 text-[11px] text-slate-300 font-serif leading-relaxed line-clamp-4 my-2">
                          <p>
                            "Orthographic standardization in Horn of Africa multilingual corpora demands rigorous alignment between Latin-based Qubee orthography and Ge'ez fidel syllabics. The WKI automated typesetting kernel ensures mathematical baseline consistency across cross-script abstracts..."
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                          <span>Authors: Mr. Feysal Hussein & Research Fellows</span>
                          <span className="text-emerald-400 font-bold">Dewey: 070.50963</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={onOpenCoverStudio}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">art_track</span>
                          <span>Spine & Cover Studio</span>
                        </button>
                        <button
                          onClick={onOpenCIP}
                          className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                          <span>Generate CIP Block</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CROSSREF DOI PREVIEW */}
                  {heroActiveTab === 'doi' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="aspect-16/9 w-full rounded-xl bg-slate-900 border border-emerald-600/30 p-4 sm:p-5 flex flex-col justify-between text-slate-100 font-mono text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            <span className="text-emerald-300 font-bold">Crossref Deposit Verified</span>
                          </div>
                          <span className="text-slate-400 text-[10px]">Schema v5.3.1</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                          <div className="text-amber-300">DOI: 10.20372/hu-mono.2026.042</div>
                          <div className="text-slate-300 truncate">Target: https://press.haramaya.edu.et/article/42</div>
                          <div className="text-slate-400">Depositor: Haramaya University Digital Press (WKI)</div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>Metadata Status: Live in Crossref Index</span>
                          <span className="text-emerald-400 font-bold">200 OK</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-1">
                        <button
                          onClick={onOpenDOI}
                          className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          <span>Open DOI Minting Studio</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: PLAGIARISM PREVIEW */}
                  {heroActiveTab === 'plagiarism' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="aspect-16/9 w-full rounded-xl bg-slate-900 border border-emerald-600/30 p-4 sm:p-5 flex flex-col justify-between text-slate-100">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
                            <span className="font-bold text-xs">SGS Originality Clearance</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                            PASSED (3.2% Match)
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center my-1">
                          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                            <div className="text-lg font-bold text-emerald-400 font-mono">96.8%</div>
                            <div className="text-[10px] text-slate-400">Originality</div>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                            <div className="text-lg font-bold text-amber-300 font-mono">2.1%</div>
                            <div className="text-[10px] text-slate-400">Haramaya IR</div>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                            <div className="text-lg font-bold text-sky-400 font-mono">1.1%</div>
                            <div className="text-[10px] text-slate-400">AJOL Index</div>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                          <span>Audit: Turnitin Equivalent Multi-Pass</span>
                          <span className="text-emerald-300">Certificate HU-SGS-992</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-1">
                        <button
                          onClick={onOpenPlagiarism}
                          className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">policy</span>
                          <span>Launch Full Scanner</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. INSTANT TOOL ACCESS BAR (QUICK LAUNCH DOCK) */}
      {/* ------------------------------------------------------------- */}
      <section className="px-gutter-mobile">
        <div className="max-w-7xl mx-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  Instant Academic Tool Suites
                </span>
                <h3 className="text-base sm:text-lg font-bold text-on-surface">
                  Direct Tools for Researchers, Authors & Reviewers
                </h3>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">
                No software download required • Direct in-browser generation
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <button
                onClick={() => onOpenQuotation(25, 'ppt')}
                className="p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 flex flex-col items-center text-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">calculate</span>
                </div>
                <span className="text-xs font-bold text-on-surface">Cost Estimator</span>
                <span className="text-[10px] text-on-surface-variant">ETB / USD Pro-Forma</span>
              </button>

              <button
                onClick={onOpenDiagnostic}
                className="p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 flex flex-col items-center text-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">analytics</span>
                </div>
                <span className="text-xs font-bold text-on-surface">Diagnostic Audit</span>
                <span className="text-[10px] text-on-surface-variant">Scripts & Word Counts</span>
              </button>

              <button
                onClick={onOpenThesisSlideStudio}
                className="p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 flex flex-col items-center text-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">slideshow</span>
                </div>
                <span className="text-xs font-bold text-on-surface">Thesis Slides</span>
                <span className="text-[10px] text-on-surface-variant">LaTeX Beamer 16:9</span>
              </button>

              <button
                onClick={onOpenDOI}
                className="p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 flex flex-col items-center text-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">link</span>
                </div>
                <span className="text-xs font-bold text-on-surface">DOI Studio</span>
                <span className="text-[10px] text-on-surface-variant">Crossref 10.20372</span>
              </button>

              <button
                onClick={onOpenPlagiarism}
                className="p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 flex flex-col items-center text-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-500/15 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">policy</span>
                </div>
                <span className="text-xs font-bold text-on-surface">Plagiarism Scan</span>
                <span className="text-[10px] text-on-surface-variant">SGS Clearance Hash</span>
              </button>

              <button
                onClick={onOpenPosterStudio}
                className="p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 flex flex-col items-center text-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-500/15 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">brush</span>
                </div>
                <span className="text-xs font-bold text-on-surface">Poster Studio</span>
                <span className="text-[10px] text-on-surface-variant">A0 Symposia Prints</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. BEFORE VS AFTER COMPARISON (TRANSFORM YOUR MANUSCRIPT) */}
      {/* ------------------------------------------------------------- */}
      <section className="px-gutter-mobile">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-wider">
              Quality Transformation Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface">
              See the Difference: Raw Draft vs. WKI Publishing Standard
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Every slide, monograph page, and journal submission is re-architected to eliminate visual clutter and ensure academic compliance.
            </p>
          </div>

          <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 overflow-hidden shadow-md">
            {/* View Mode Switcher */}
            <div className="p-4 bg-surface-container border-b border-outline-variant/20 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setComparisonView('before')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    comparisonView === 'before'
                      ? 'bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-500/40'
                      : 'bg-surface-container-high text-on-surface'
                  }`}
                >
                  Raw Draft (Word / Untypeset)
                </button>
                <button
                  onClick={() => setComparisonView('after')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    comparisonView === 'after'
                      ? 'bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40'
                      : 'bg-surface-container-high text-on-surface'
                  }`}
                >
                  WKI Standard (Haramaya SGS)
                </button>
              </div>

              <span className="text-xs font-medium text-on-surface-variant">
                Standard: Haramaya Postgraduate Studies Directorate 2026
              </span>
            </div>

            {/* Comparison Display Canvas */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Box 1: Before (Cluttered raw text) */}
              <div
                className={`p-6 rounded-2xl border transition-all ${
                  comparisonView === 'before' || comparisonView === 'split'
                    ? 'bg-red-50/40 dark:bg-red-950/20 border-red-300 dark:border-red-900/50 opacity-100'
                    : 'opacity-40 border-outline-variant/30 bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-red-200 dark:border-red-900/40">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs">
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    <span>Typical Raw Submission Issues</span>
                  </div>
                  <span className="text-[10px] text-red-500 font-mono">Unformatted Draft</span>
                </div>

                <div className="space-y-3 font-sans text-xs text-on-surface leading-relaxed">
                  <div className="font-bold text-red-900 dark:text-red-300">
                    Chapter 4: Results and Discussions on Soil Nitrogen
                  </div>
                  <p className="bg-red-100/50 dark:bg-red-900/20 p-2 rounded text-red-950 dark:text-red-200 text-[11px]">
                    ⚠️ Wall of unbulleted text, missing APA commas (Bekele 2024), low-contrast 4:3 stretched diagrams, mixed font sizes (Times vs Calibri), missing Ethiopic punctuation standards.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-on-surface-variant text-[11px]">
                    <li>Overcrowded slide with 180 words per page</li>
                    <li>Unverified citation bibliography with dead links</li>
                    <li>Inconsistent Afaan Oromoo glottal 'hudhaa' marks</li>
                  </ul>
                </div>
              </div>

              {/* Box 2: After (WKI Professional Standard) */}
              <div
                className={`p-6 rounded-2xl border transition-all ${
                  comparisonView === 'after' || comparisonView === 'split'
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-800 opacity-100 shadow-sm'
                    : 'opacity-40 border-outline-variant/30 bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-200 dark:border-emerald-900/40">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>WKI University Press Standard</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold">100% Compliant</span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="font-serif font-bold text-sm text-emerald-950 dark:text-emerald-200">
                    4.2 Soil Organic Nitrogen & Moisture Retention Coefficients
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-100/60 dark:bg-emerald-900/30 border border-emerald-300/40 text-emerald-950 dark:text-emerald-100 text-[11px] space-y-1 font-serif">
                    <div className="font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                      <span>Decomposed 16:9 Widescreen Defense Architecture</span>
                    </div>
                    <p>
                      • Standardized APA 7th notation: (Bekele, 2024, p. 114) with Crossref DOI resolver.<br />
                      • High-contrast vector charts with confidence interval bands.<br />
                      • Verified Afaan Oromoo & Amharic bilingual abstract layout.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-emerald-700 dark:text-emerald-300 font-mono pt-1">
                    <span>LaTeX Beamer 3.4.1</span>
                    <span>Defense Score: Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. LIVE INTERACTIVE COST ESTIMATOR ON LANDING PAGE */}
      {/* ------------------------------------------------------------- */}
      <section className="px-gutter-mobile">
        <div className="max-w-7xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-surface-container to-surface-container-high border border-outline-variant/30 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Form Controls */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                    Transparent Institutional Rates
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-on-surface">
                    Live Project Workload & Budget Calculator
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Select your academic service requirements to calculate standardized Ethiopian Birr (ETB) and USD rates.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Service Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface">Service Type</label>
                    <select
                      value={estService}
                      onChange={(e) => setEstService(e.target.value as ServiceCategory)}
                      className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/40 text-xs font-semibold text-on-surface cursor-pointer"
                    >
                      <option value="ppt">Thesis Defense Slides (16:9 Beamer)</option>
                      <option value="english_book">English Monograph & Book Typesetting</option>
                      <option value="oromoo_book">Afaan Oromoo Monograph Typesetting</option>
                      <option value="amharic_book">Amharic Ge'ez Book Typesetting</option>
                      <option value="arabic_book">Arabic Monograph Typesetting</option>
                      <option value="translation">Multilingual Academic Translation</option>
                      <option value="formatting">Postgraduate Dissertation Formatting</option>
                      <option value="editing">Orthographic Proofreading & Editing</option>
                      <option value="elearning">Curriculum & Course Deck Creation</option>
                    </select>
                  </div>

                  {/* Language Script Tier */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface">Primary Script Engine</label>
                    <select
                      value={estScript}
                      onChange={(e) => setEstScript(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/40 text-xs font-semibold text-on-surface cursor-pointer"
                    >
                      <option value="latin">Latin / Qubee (Afaan Oromoo, English)</option>
                      <option value="geez">Ge'ez Fidel (Amharic / Tigrinya)</option>
                      <option value="arabic">Arabic Script (Right-to-Left / Tajweed)</option>
                    </select>
                  </div>
                </div>

                {/* Page Count Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-on-surface">Document Scope (Pages / Slides):</span>
                    <span className="font-mono font-bold text-secondary text-sm">{estPages} Units</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={estPages}
                    onChange={(e) => setEstPages(parseInt(e.target.value))}
                    className="w-full accent-secondary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                    <span>5 Units</span>
                    <span>50 Units</span>
                    <span>100 Units</span>
                    <span>200 Units</span>
                  </div>
                </div>

                {/* Urgency Tier */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface">Turnaround Speed Tier</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setEstUrgency('standard')}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        estUrgency === 'standard'
                          ? 'bg-secondary text-on-secondary border-secondary'
                          : 'bg-surface text-on-surface border-outline-variant/30 hover:bg-surface-container'
                      }`}
                    >
                      Standard (3-5 Days)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEstUrgency('express')}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        estUrgency === 'express'
                          ? 'bg-secondary text-on-secondary border-secondary'
                          : 'bg-surface text-on-surface border-outline-variant/30 hover:bg-surface-container'
                      }`}
                    >
                      Express 48-Hr (+25%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEstUrgency('super')}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        estUrgency === 'super'
                          ? 'bg-secondary text-on-secondary border-secondary'
                          : 'bg-surface text-on-surface border-outline-variant/30 hover:bg-surface-container'
                      }`}
                    >
                      24-Hr Rush (+50%)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Output Card */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-surface border border-outline-variant/40 shadow-sm space-y-5 text-center sm:text-left">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Official Pro-Forma Projection
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-secondary font-mono">
                    {totalCostETB.toLocaleString()} <span className="text-sm font-sans font-bold text-on-surface">ETB</span>
                  </div>
                  <div className="text-xs text-on-surface-variant font-mono">
                    ≈ ${totalCostUSD} USD • Rate @ {unitRate} ETB / Unit
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container text-xs space-y-1.5 border border-outline-variant/20">
                  <div className="flex justify-between text-on-surface">
                    <span>Estimated Completion:</span>
                    <span className="font-bold text-emerald-600">{estDays} Business Days</span>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>SGS Compliance Seal:</span>
                    <span className="font-bold text-secondary">Included Free</span>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>Revision Rounds:</span>
                    <span className="font-bold text-on-surface">2 Dedicated Passes</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => onRequestClick(estService, estPages)}
                    className="w-full py-3 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-2 hover:brightness-105 active:scale-98 transition-all shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>Proceed With This Brief</span>
                  </button>
                  <p className="text-[10px] text-on-surface-variant text-center">
                    CBE Account & Telebirr verified upon brief registration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. PUBLISHING SHOWCASE & E-LEARNING HIGHLIGHT */}
      {/* ------------------------------------------------------------- */}
      <section className="px-gutter-mobile">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
                Digital Press & Learning Academy
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface mt-1">
                Featured Scholarly Monograph Publications
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onExploreBooks}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors cursor-pointer border border-outline-variant/20"
              >
                Browse All Books ({books.length})
              </button>
              <button
                onClick={onExploreCourses}
                className="px-4 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Explore Courses ({courses.length})
              </button>
            </div>
          </div>

          {/* 3 Featured Books Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {books.slice(0, 3).map((book) => (
              <div
                key={book.id}
                className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-secondary/40 transition-all shadow-xs flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">
                      {book.category}
                    </span>
                    <span className="text-[10px] font-mono text-on-surface-variant font-bold">
                      {book.language.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-on-surface group-hover:text-secondary transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {book.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between">
                  <span className="text-xs text-on-surface font-semibold truncate">
                    {book.author}
                  </span>
                  <button
                    onClick={() => onOpenReader(book)}
                    className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold flex items-center gap-1 hover:brightness-105 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">menu_book</span>
                    <span>Read</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. HARAMAYA UNIVERSITY CREDENTIALS FOOTPRINT */}
      {/* ------------------------------------------------------------- */}
      <section className="px-gutter-mobile">
        <div className="max-w-7xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface-container border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl text-center md:text-left">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                Direct Directorate Affiliation
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-on-surface">
                Wirtuu Kompiitaraa Ilillii (WKI) • Haramaya University
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Supervised under the academic directorship of Mr. Feysal Hussein, ensuring all monographs, defense decks, and journal papers meet institutional School of Graduate Studies (SGS) standards.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigateTab('portal')}
                className="px-5 py-2.5 rounded-xl bg-surface-container-highest hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors cursor-pointer border border-outline-variant/20"
              >
                Track My Briefs
              </button>
              <button
                onClick={() => onNavigateTab('admin')}
                className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Admin Control Desk
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
