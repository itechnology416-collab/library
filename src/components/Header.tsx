import React, { useState, useEffect } from 'react';
import { Language, ThemeMode } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';
import { translations } from '../utils/translations';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSearch: () => void;
  onRequestClick: () => void;
  onOpenVerify?: () => void;
  onOpenQuotation?: () => void;
  onOpenDiagnostic?: () => void;
  onOpenGlossary?: () => void;
  onOpenCitation?: () => void;
  onOpenThesisSlideStudio?: () => void;
  onOpenPeerReview?: () => void;
  onOpenCoverStudio?: () => void;
  onOpenCIP?: () => void;
  onOpenProofreader?: () => void;
  onOpenPosterStudio?: () => void;
  onOpenPlagiarism?: () => void;
  onOpenGrantStudio?: () => void;
  onOpenDOI?: () => void;
  onOpenJournalWorkflow?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  theme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
  pendingRequestsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange,
  onOpenSearch,
  onRequestClick,
  onOpenVerify,
  onOpenQuotation,
  onOpenDiagnostic,
  onOpenGlossary,
  onOpenCitation,
  onOpenThesisSlideStudio,
  onOpenPeerReview,
  onOpenCoverStudio,
  onOpenCIP,
  onOpenProofreader,
  onOpenPosterStudio,
  onOpenPlagiarism,
  onOpenGrantStudio,
  onOpenDOI,
  onOpenJournalWorkflow,
  darkMode,
  onToggleDarkMode,
  theme,
  onThemeChange,
  pendingRequestsCount,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Derive current theme mode
  const currentTheme: ThemeMode = theme || (darkMode ? 'dark' : 'light');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = translations[currentLanguage];

  const themeOptions: { id: ThemeMode; label: string; icon: string; desc: string; color: string }[] = [
    { id: 'light', label: 'Light Mode', icon: 'light_mode', desc: 'Clean institutional light palette', color: 'text-amber-500' },
    { id: 'dark', label: 'Black Mode', icon: 'dark_mode', desc: 'Deep cinematic black & gold', color: 'text-slate-300' },
    { id: 'netflix', label: 'Netflix Mode', icon: 'movie', desc: 'Cinematic streaming & red glow', color: 'text-red-500' },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'or', label: 'Afaan Oromoo', flag: 'OR' },
    { code: 'am', label: 'አማርኛ', flag: 'AM' },
    { code: 'ar', label: 'العربية (RTL)', flag: 'AR' },
  ];

  const navItems = [
    { id: 'home', label: t.homeNav || 'Home', icon: 'home' },
    { id: 'dashboards', label: 'Dashboards Hub', icon: 'dashboard' },
    { id: 'computer_training', label: 'Computer Training', icon: 'computer' },
    { id: 'portal', label: 'Author Portal', icon: 'assignment' },
    { id: 'student', label: 'Scholar Portal', icon: 'school' },
    { id: 'peer_review', label: 'Reviewer Portal', icon: 'rate_review' },
    { id: 'faculty', label: 'Faculty & Grants', icon: 'account_balance_wallet' },
    { id: 'admin', label: t.adminNav || 'Admin Desk', icon: 'admin_panel_settings' },
    { id: 'repository', label: 'E-Repository & ETD', icon: 'auto_stories' },
    { id: 'irb', label: 'Ethics & IRB Desk', icon: 'verified_user' },
    { id: 'tech_transfer', label: 'Tech Transfer & Ext', icon: 'hub' },
    { id: 'services', label: t.servicesNav || 'Services', icon: 'design_services' },
    { id: 'books', label: t.booksNav || 'Books', icon: 'menu_book' },
    { id: 'elearning', label: t.elearnNav || 'E-Learning', icon: 'local_library' },
    { id: 'resources', label: 'Resources', icon: 'folder_open' },
    { id: 'about', label: 'About', icon: 'info' },
    { id: 'contact', label: 'Contact', icon: 'call' },
  ];

  // Primary navigation for large viewports
  const primaryDesktopNav = navItems.slice(0, 6);
  const overflowDesktopNav = navItems.slice(3); // Includes items 3+ for xl screens and 6+ for 2xl screens

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 transition-colors">
      {/* Click-outside backdrop for open dropdowns */}
      {(showLangMenu || showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[0.5px]"
          onClick={() => {
            setShowLangMenu(false);
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 1. TOPMOST: INSTITUTIONAL CONTACT & UTILITY BAR (h-8 / 32px)               */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#0f172a] dark:bg-[#050505] text-slate-200 text-xs border-b border-slate-800 dark:border-[#1a1a1a] transition-colors shadow-xs relative z-50">
        <div className="w-full h-8 px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 text-[11px] font-medium overflow-x-hidden">
          {/* Institutional Affiliation & Tagline */}
          <div className="flex items-center gap-2 min-w-0 shrink">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] sm:text-[11px] border border-amber-400/30 tracking-wide uppercase shrink-0">
              <span className="material-symbols-outlined text-[13px] text-amber-400">school</span>
              <span>Haramaya University</span>
            </span>
            <span className="hidden md:inline-flex items-center text-slate-400 text-[10px] lg:text-[11px] truncate">
              <span className="mx-1.5 opacity-40">•</span>
              <span className="text-slate-300 truncate">Your Ideas. Our Skills. Professional Results.</span>
            </span>
          </div>

          {/* Contact Numbers, Telegram & Hubs Shortcut */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0 text-[11px]">
            <a
              href="tel:+251927650724"
              className="flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors font-mono"
              title="Direct Telephone"
            >
              <span className="material-symbols-outlined text-[13px] text-amber-400 shrink-0">call</span>
              <span className="hidden xs:inline">+251 927 650 724</span>
              <span className="xs:hidden">Call</span>
            </a>

            <a
              href="tel:+251961189074"
              className="hidden md:flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors font-mono"
              title="Secondary Telephone"
            >
              <span className="material-symbols-outlined text-[13px] text-amber-400 shrink-0">call</span>
              <span>+251 961 189 074</span>
            </a>

            <span className="hidden sm:inline text-slate-700">|</span>

            <a
              href="https://t.me/FEYSAL_8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors"
              title="Official Telegram Channel / Contact"
            >
              <span className="material-symbols-outlined text-[13px] text-amber-400 shrink-0">send</span>
              <span className="font-semibold hidden sm:inline">Telegram: @FEYSAL_8</span>
              <span className="font-semibold sm:hidden">@FEYSAL_8</span>
            </a>

            <button
              onClick={() => onTabChange('dashboards')}
              className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 dark:bg-[#151515] hover:bg-slate-700 dark:hover:bg-[#202020] text-slate-200 text-[10px] font-bold transition-all border border-slate-700 dark:border-white/10 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[12px] text-amber-400 shrink-0">apps</span>
              <span>Institutional Hubs</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN NAVIGATION & ACTION BAR (h-14 / 56px)                              */}
      {/* ========================================================================= */}
      <div
        className={`w-full transition-all duration-300 relative z-50 ${
          currentTheme === 'netflix'
            ? isScrolled
              ? 'bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_6px_30px_rgba(0,0,0,0.85)]'
              : 'bg-black/65 backdrop-blur-md border-b border-white/10'
            : 'bg-surface/90 dark:bg-[#050505]/90 backdrop-blur-xl border-b border-outline-variant/20 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)]'
        }`}
      >
        <div className="h-14 px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 w-full">
          {/* 1. Left: Single Clean Brand */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 min-w-0 cursor-pointer flex-shrink-0 group select-none"
            onClick={() => {
              onTabChange('home');
              setShowMobileMenu(false);
            }}
          >
            <img
              alt="Wirtuu Kompiitaraa Ilillii Logo"
              className="h-8 sm:h-9 w-auto object-contain flex-shrink-0 rounded-md transition-transform group-hover:scale-105"
              src={OFFICIAL_BRAND.logoUrl}
              referrerPolicy="no-referrer"
            />
            <span className="font-bold text-xs sm:text-[13.5px] lg:text-[14.5px] text-on-surface leading-none tracking-tight whitespace-nowrap truncate max-w-[150px] xs:max-w-[190px] sm:max-w-none">
              {OFFICIAL_BRAND.name}
            </span>
          </div>

          {/* 2. Center: Flexible Desktop Navigation (flex-1 min-w-0) */}
          <nav className="hidden xl:flex flex-1 min-w-0 items-center justify-center gap-0.5 2xl:gap-1 px-2">
            {primaryDesktopNav.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-2 2xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  idx >= 3 ? 'hidden 2xl:inline-block' : 'inline-block'
                } ${
                  activeTab === item.id
                    ? 'bg-secondary text-on-secondary shadow-xs font-bold'
                    : 'text-on-surface/90 hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* More Dropdown for Desktop */}
            <div className="relative group shrink-0">
              <button className="px-2 2xl:px-2.5 py-1.5 rounded-lg text-xs font-semibold text-on-surface/90 hover:text-on-surface hover:bg-surface-container flex items-center gap-0.5 cursor-pointer whitespace-nowrap">
                <span>More</span>
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
              </button>

              <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xl p-1.5 hidden group-hover:block z-50">
                {overflowDesktopNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                      activeTab === item.id
                        ? 'bg-secondary text-on-secondary font-bold'
                        : 'text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="border-t border-outline-variant/20 pt-1 mt-1 space-y-0.5">
                  {onOpenQuotation && (
                    <button
                      onClick={onOpenQuotation}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-secondary hover:bg-secondary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                      <span>Pro-Forma Quotation</span>
                    </button>
                  )}
                  {onOpenDiagnostic && (
                    <button
                      onClick={onOpenDiagnostic}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-tertiary hover:bg-tertiary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">spellcheck</span>
                      <span>Manuscript Audit</span>
                    </button>
                  )}
                  {onOpenGlossary && (
                    <button
                      onClick={onOpenGlossary}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">translate</span>
                      <span>4-Way Glossary</span>
                    </button>
                  )}
                  {onOpenCitation && (
                    <button
                      onClick={onOpenCitation}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-secondary hover:bg-secondary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">format_quote</span>
                      <span>Citation Studio (BibTeX/APA)</span>
                    </button>
                  )}
                  {onOpenThesisSlideStudio && (
                    <button
                      onClick={onOpenThesisSlideStudio}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-secondary hover:bg-secondary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">slideshow</span>
                      <span>Thesis Slide & LaTeX Studio</span>
                    </button>
                  )}
                  {onOpenPeerReview && (
                    <button
                      onClick={onOpenPeerReview}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">rate_review</span>
                      <span>Peer-Review Matrix</span>
                    </button>
                  )}
                  {onOpenCoverStudio && (
                    <button
                      onClick={onOpenCoverStudio}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-secondary hover:bg-secondary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">book_online</span>
                      <span>Monograph Jacket & Spine Studio</span>
                    </button>
                  )}
                  {onOpenCIP && (
                    <button
                      onClick={onOpenCIP}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                      <span>CIP Data & ISBN Barcode</span>
                    </button>
                  )}
                  {onOpenProofreader && (
                    <button
                      onClick={onOpenProofreader}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-tertiary hover:bg-tertiary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">spellcheck</span>
                      <span>Multilingual Proofreader & Linter</span>
                    </button>
                  )}
                  {onOpenPosterStudio && (
                    <button
                      onClick={onOpenPosterStudio}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-secondary hover:bg-secondary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">view_quilt</span>
                      <span>Conference Poster Studio (A0/A1)</span>
                    </button>
                  )}
                  {onOpenPlagiarism && (
                    <button
                      onClick={onOpenPlagiarism}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">policy</span>
                      <span>Plagiarism & Originality Index</span>
                    </button>
                  )}
                  {onOpenGrantStudio && (
                    <button
                      onClick={onOpenGrantStudio}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-secondary hover:bg-secondary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">account_balance</span>
                      <span>Research Grant & Budget Studio</span>
                    </button>
                  )}
                  {onOpenDOI && (
                    <button
                      onClick={onOpenDOI}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">tag</span>
                      <span>DOI & CrossRef Schema Studio</span>
                    </button>
                  )}
                  {onOpenJournalWorkflow && (
                    <button
                      onClick={onOpenJournalWorkflow}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-tertiary hover:bg-tertiary/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                      <span>Journal Editorial & Galley Pipeline</span>
                    </button>
                  )}
                  {onOpenVerify && (
                    <button
                      onClick={onOpenVerify}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-left text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Verify Certificate</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* 3. Right: Protected Action Controls (flex-shrink-0) */}
          <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 flex-shrink-0 ml-auto lg:ml-0 relative">
            {/* Quick Request Button (Desktop / Tablet) */}
            <button
              onClick={onRequestClick}
              className="hidden md:flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 active:scale-95 transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              <span>{t.requestServiceBtn || 'Request a Service'}</span>
            </button>

            {/* Multilingual Switcher */}
            <div className="relative shrink-0">
              <button
                aria-label="Multilingual Switcher"
                onClick={() => {
                  setShowLangMenu(!showLangMenu);
                  setShowNotifications(false);
                  setShowUserMenu(false);
                }}
                className="h-8 sm:h-8.5 px-2 sm:px-2.5 rounded-lg flex items-center justify-center gap-1 bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20 shrink-0"
              >
                <span className="material-symbols-outlined text-[14px] sm:text-[15px] text-secondary">
                  translate
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                  {currentLanguage.toUpperCase()}
                </span>
              </button>

              {showLangMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 max-w-[calc(100vw-24px)] rounded-xl bg-surface-container-lowest shadow-2xl border border-outline-variant/30 p-1.5 z-50 animate-in fade-in duration-100"
                  dir="ltr"
                >
                  <div className="px-2 py-1 text-[11px] font-bold text-secondary uppercase tracking-wider">
                    Select Language
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        currentLanguage === lang.code
                          ? 'bg-surface-container text-secondary font-bold'
                          : 'text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {currentLanguage === lang.code && (
                        <span className="material-symbols-outlined text-[14px] text-secondary">
                          check
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Selector (Light / Black / Netflix) */}
            <div className="relative shrink-0">
              <button
                aria-label="Theme Mode Selector"
                onClick={() => {
                  setShowThemeMenu(!showThemeMenu);
                  setShowLangMenu(false);
                  setShowNotifications(false);
                  setShowUserMenu(false);
                }}
                className={`h-8 sm:h-8.5 px-2 sm:px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
                  currentTheme === 'netflix'
                    ? 'bg-black/70 text-red-500 border-red-500/50 hover:bg-black/90 shadow-[0_0_12px_rgba(229,9,20,0.35)]'
                    : currentTheme === 'dark'
                    ? 'bg-surface-container text-amber-400 hover:bg-surface-container-high border-outline-variant/30'
                    : 'bg-surface-container text-amber-600 hover:bg-surface-container-high border-outline-variant/20'
                }`}
                title={`Theme: ${currentTheme.toUpperCase()} (Click to change)`}
              >
                <span className="material-symbols-outlined text-[15px] sm:text-[17px]">
                  {currentTheme === 'netflix' ? 'movie' : currentTheme === 'dark' ? 'dark_mode' : 'light_mode'}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hidden xs:inline">
                  {currentTheme === 'netflix' ? 'Netflix' : currentTheme === 'dark' ? 'Black' : 'Light'}
                </span>
                <span className="material-symbols-outlined text-[12px] opacity-70">expand_more</span>
              </button>

              {showThemeMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-24px)] rounded-xl bg-surface-container-lowest dark:bg-[#0f0f0f] shadow-2xl border border-outline-variant/30 dark:border-white/15 p-1.5 z-50 animate-in fade-in duration-100"
                  dir="ltr"
                >
                  <div className="px-2 py-1 text-[10px] font-bold text-secondary uppercase tracking-wider">
                    Select Theme Mode
                  </div>
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        if (onThemeChange) {
                          onThemeChange(opt.id);
                        } else if (onToggleDarkMode) {
                          onToggleDarkMode();
                        }
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        currentTheme === opt.id
                          ? opt.id === 'netflix'
                            ? 'bg-red-500/15 text-red-500 font-bold border border-red-500/30'
                            : 'bg-surface-container text-secondary font-bold'
                          : 'text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-[16px] ${opt.color}`}>
                          {opt.icon}
                        </span>
                        <div>
                          <div className="leading-tight font-bold">{opt.label}</div>
                          <div className="text-[10px] opacity-60 font-normal leading-tight">{opt.desc}</div>
                        </div>
                      </div>
                      {currentTheme === opt.id && (
                        <span className="material-symbols-outlined text-[14px] text-secondary">
                          check
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Global Search Button */}
            <button
              aria-label="Search Catalog & Courses"
              onClick={onOpenSearch}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer shrink-0"
              title="Search"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">search</span>
            </button>

            {/* Notification Button & Anchored Responsive Dropdown */}
            <div className="relative shrink-0">
              <button
                aria-label="Academic Notifications"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowLangMenu(false);
                  setShowUserMenu(false);
                }}
                className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg flex items-center justify-center text-on-surface relative hover:bg-surface-container transition-colors cursor-pointer shrink-0"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">notifications</span>
                {pendingRequestsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface animate-ping"></span>
                )}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] xs:w-80 max-w-[360px] rounded-2xl bg-surface-container-lowest shadow-2xl border border-outline-variant/30 p-3.5 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2.5 border-b border-outline-variant/15">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">campaign</span>
                      <span className="font-bold text-xs text-on-surface">
                        Press Notifications
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-2 max-h-72 overflow-y-auto">
                    <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/15 text-xs text-on-surface transition-colors hover:border-secondary/30">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-bold text-secondary text-xs">Haramaya Academic Desk Active</p>
                        <span className="text-[10px] text-on-surface-variant/70 font-mono">Now</span>
                      </div>
                      <p className="text-on-surface-variant mt-1 text-[11px] leading-relaxed">
                        Direct submissions for doctoral and thesis presentations are open.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/15 text-xs text-on-surface transition-colors hover:border-secondary/30">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-bold text-on-surface text-xs">New Digital Release Available</p>
                        <span className="text-[10px] text-on-surface-variant/70 font-mono">New</span>
                      </div>
                      <p className="text-on-surface-variant mt-1 text-[11px] leading-relaxed">
                        "Mastering English Phrasal Verbs & Idioms" full reader is now live.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 mt-2.5 border-t border-outline-variant/15 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onTabChange('dashboards');
                      }}
                      className="text-[11px] font-bold text-secondary hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Institutional Hubs</span>
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[11px] font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Authentication Status / Login Button (Protected & Always Visible) */}
            {isAuthenticated && user ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowLangMenu(false);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface transition-all cursor-pointer shrink-0"
                >
                  <div className="w-6.5 h-6.5 rounded-lg bg-secondary text-on-secondary font-bold text-[11px] flex items-center justify-center uppercase shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden lg:flex flex-col text-left min-w-0 max-w-[100px]">
                    <span className="text-xs font-bold text-on-surface truncate leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[9px] font-mono text-secondary uppercase font-semibold truncate leading-none">
                      {user.role}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[15px] text-on-surface-variant shrink-0">
                    expand_more
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] rounded-2xl bg-surface-container-lowest shadow-2xl border border-outline-variant/30 p-3 z-50 animate-in fade-in duration-150">
                    <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-1 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-on-surface truncate">{user.name}</div>
                          <div className="text-[10px] text-on-surface-variant truncate font-mono">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded-md bg-secondary/15 text-secondary text-[10px] font-bold uppercase">
                          Role: {user.role}
                        </span>
                        {user.staffOrStudentId && (
                          <span className="px-2 py-0.5 rounded-md bg-surface-container-highest text-on-surface-variant text-[10px] font-mono">
                            {user.staffOrStudentId}
                          </span>
                        )}
                      </div>
                      {user.affiliation && (
                        <p className="text-[10px] text-on-surface-variant/80 pt-1 line-clamp-1">
                          {user.affiliation}
                        </p>
                      )}
                    </div>

                    {/* Dashboard Shortcuts */}
                    <div className="space-y-1 py-1 border-y border-outline-variant/15">
                      <button
                        onClick={() => {
                          onTabChange('dashboards');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer text-left"
                      >
                        <span className="material-symbols-outlined text-[16px] text-secondary">dashboard</span>
                        <span>Dashboards Hub</span>
                      </button>
                      <button
                        onClick={() => {
                          onTabChange('portal');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer text-left"
                      >
                        <span className="material-symbols-outlined text-[16px] text-secondary">assignment</span>
                        <span>Author Submission Portal</span>
                      </button>
                      <button
                        onClick={() => {
                          onTabChange('student');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer text-left"
                      >
                        <span className="material-symbols-outlined text-[16px] text-primary">school</span>
                        <span>Scholar Workspace</span>
                      </button>
                      <button
                        onClick={() => {
                          onTabChange('peer_review');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer text-left"
                      >
                        <span className="material-symbols-outlined text-[16px] text-secondary">rate_review</span>
                        <span>Peer Reviewer Workspace</span>
                      </button>
                      <button
                        onClick={() => {
                          onTabChange('faculty');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer text-left"
                      >
                        <span className="material-symbols-outlined text-[16px] text-amber-600">account_balance_wallet</span>
                        <span>Faculty & Research Grants</span>
                      </button>
                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            onTabChange('admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer text-left"
                        >
                          <span className="material-symbols-outlined text-[16px] text-rose-600">admin_panel_settings</span>
                          <span>Registrar & Admin Desk</span>
                        </button>
                      )}
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-2">
                      <button
                        onClick={async () => {
                          setShowUserMenu(false);
                          await logout();
                          onTabChange('home');
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">logout</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onTabChange('login')}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-secondary">login</span>
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Button (Hidden on Desktop) */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle Navigation Menu"
              className="xl:hidden w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                {showMobileMenu ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {showMobileMenu && (
        <div className="xl:hidden bg-surface-container-lowest border-b border-outline-variant/20 px-4 py-3 shadow-2xl max-h-[75vh] overflow-y-auto relative z-50 animate-in slide-in-from-top-2 duration-150">
          {/* Mobile User Profile or Sign In Banner */}
          <div className="mb-3 p-3 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-between gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center uppercase shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-on-surface truncate">{user.name}</div>
                    <div className="text-[10px] text-secondary font-semibold uppercase">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    setShowMobileMenu(false);
                    await logout();
                    onTabChange('home');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[14px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-secondary">account_circle</span>
                  <span className="text-xs font-bold text-on-surface">Institutional Access</span>
                </div>
                <button
                  onClick={() => {
                    onTabChange('login');
                    setShowMobileMenu(false);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">login</span>
                  <span>Sign In</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Theme Selector Strip */}
          <div className="mb-3 p-2 rounded-2xl bg-surface-container/60 border border-outline-variant/20 flex items-center justify-between gap-1.5">
            <span className="text-[11px] font-bold text-on-surface px-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-secondary">palette</span>
              <span>Theme:</span>
            </span>
            <div className="flex items-center gap-1">
              {themeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    if (onThemeChange) {
                      onThemeChange(opt.id);
                    } else if (onToggleDarkMode) {
                      onToggleDarkMode();
                    }
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    currentTheme === opt.id
                      ? opt.id === 'netflix'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-secondary text-on-secondary shadow-xs'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{opt.icon}</span>
                  <span>{opt.id === 'netflix' ? 'Netflix' : opt.id === 'dark' ? 'Black' : 'Light'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setShowMobileMenu(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-secondary text-on-secondary shadow-xs font-bold'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 mt-3 border-t border-outline-variant/15 space-y-2">
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-1.5">
              {onOpenQuotation && (
                <button
                  onClick={() => {
                    onOpenQuotation();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">receipt_long</span>
                  <span>Quote</span>
                </button>
              )}
              {onOpenDiagnostic && (
                <button
                  onClick={() => {
                    onOpenDiagnostic();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-tertiary text-[18px]">spellcheck</span>
                  <span>Audit</span>
                </button>
              )}
              {onOpenGlossary && (
                <button
                  onClick={() => {
                    onOpenGlossary();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-primary text-[18px]">translate</span>
                  <span>Glossary</span>
                </button>
              )}
              {onOpenCitation && (
                <button
                  onClick={() => {
                    onOpenCitation();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">format_quote</span>
                  <span>Cite</span>
                </button>
              )}
              {onOpenThesisSlideStudio && (
                <button
                  onClick={() => {
                    onOpenThesisSlideStudio();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">slideshow</span>
                  <span>Slides</span>
                </button>
              )}
              {onOpenPeerReview && (
                <button
                  onClick={() => {
                    onOpenPeerReview();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-primary text-[18px]">rate_review</span>
                  <span>Review</span>
                </button>
              )}
              {onOpenCoverStudio && (
                <button
                  onClick={() => {
                    onOpenCoverStudio();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">book_online</span>
                  <span>Cover</span>
                </button>
              )}
              {onOpenCIP && (
                <button
                  onClick={() => {
                    onOpenCIP();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-primary text-[18px]">qr_code_2</span>
                  <span>CIP</span>
                </button>
              )}
              {onOpenProofreader && (
                <button
                  onClick={() => {
                    onOpenProofreader();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-tertiary text-[18px]">spellcheck</span>
                  <span>Linter</span>
                </button>
              )}
              {onOpenPosterStudio && (
                <button
                  onClick={() => {
                    onOpenPosterStudio();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">view_quilt</span>
                  <span>Poster</span>
                </button>
              )}
              {onOpenPlagiarism && (
                <button
                  onClick={() => {
                    onOpenPlagiarism();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-primary text-[18px]">policy</span>
                  <span>Similarity</span>
                </button>
              )}
              {onOpenGrantStudio && (
                <button
                  onClick={() => {
                    onOpenGrantStudio();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">account_balance</span>
                  <span>Grant</span>
                </button>
              )}
              {onOpenDOI && (
                <button
                  onClick={() => {
                    onOpenDOI();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-primary text-[18px]">tag</span>
                  <span>DOI</span>
                </button>
              )}
              {onOpenJournalWorkflow && (
                <button
                  onClick={() => {
                    onOpenJournalWorkflow();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-tertiary text-[18px]">menu_book</span>
                  <span>Journals</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {onOpenVerify && (
                <button
                  onClick={() => {
                    onOpenVerify();
                    setShowMobileMenu(false);
                  }}
                  className="w-full py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                  <span>Verify Certificate</span>
                </button>
              )}
              <button
                onClick={() => {
                  onRequestClick();
                  setShowMobileMenu(false);
                }}
                className="w-full py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span>Submit Academic Brief</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
