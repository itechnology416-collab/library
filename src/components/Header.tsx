import React, { useState } from 'react';
import { Language } from '../types';
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
  pendingRequestsCount,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const t = translations[currentLanguage];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'or', label: 'Afaan Oromoo', flag: 'OR' },
    { code: 'am', label: 'አማርኛ', flag: 'AM' },
    { code: 'ar', label: 'العربية (RTL)', flag: 'AR' },
  ];

  const navItems = [
    { id: 'home', label: t.homeNav || 'Home', icon: 'home' },
    { id: 'dashboards', label: 'Dashboards Hub', icon: 'dashboard' },
    { id: 'portal', label: 'Author Portal', icon: 'assignment' },
    { id: 'student', label: 'Scholar Portal', icon: 'school' },
    { id: 'peer_review', label: 'Reviewer Portal', icon: 'rate_review' },
    { id: 'faculty', label: 'Faculty & Grants', icon: 'account_balance_wallet' },
    { id: 'admin', label: t.adminNav || 'Admin Desk', icon: 'admin_panel_settings' },
    { id: 'services', label: t.servicesNav || 'Services', icon: 'design_services' },
    { id: 'books', label: t.booksNav || 'Books', icon: 'menu_book' },
    { id: 'elearning', label: t.elearnNav || 'E-Learning', icon: 'local_library' },
    { id: 'resources', label: 'Resources', icon: 'folder_open' },
    { id: 'about', label: 'About', icon: 'info' },
    { id: 'contact', label: 'Contact', icon: 'call' },
  ];

  const primaryDesktopNav = navItems.slice(0, 6);
  const overflowDesktopNav = navItems.slice(6);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe transition-colors border-b border-outline-variant/10">
      <div className="h-20 px-gutter-mobile flex items-center justify-between gap-space-sm max-w-7xl mx-auto">
        {/* Brand & Affiliation */}
        <div
          className="flex items-center gap-space-sm min-w-0 cursor-pointer"
          onClick={() => {
            onTabChange('home');
            setShowMobileMenu(false);
          }}
        >
          <img
            alt="Wirtuu Kompiitaraa Ilillii Logo"
            className="h-8 w-auto object-contain flex-shrink-0"
            src={OFFICIAL_BRAND.logoUrl}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs">
              <span className="font-title-sm text-title-sm text-on-surface font-bold truncate leading-tight tracking-tight">
                {OFFICIAL_BRAND.name}
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
                Haramaya Univ.
              </span>
              <span className="text-outline font-label-sm text-label-sm">•</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate capitalize">
                {navItems.find((n) => n.id === activeTab)?.label || activeTab}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {primaryDesktopNav.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === item.id
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* More Dropdown for Desktop */}
          <div className="relative group">
            <button className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-1 cursor-pointer">
              <span>More</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>

            <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xl p-1.5 hidden group-hover:block z-50">
              {overflowDesktopNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-secondary text-on-secondary'
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

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 relative">
          {/* Quick Request Button (Desktop) */}
          <button
            onClick={onRequestClick}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-secondary text-on-secondary font-label-sm text-xs font-bold hover:brightness-105 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span>{t.requestServiceBtn || 'Request Service'}</span>
          </button>

          {/* Multilingual Switcher */}
          <div className="relative">
            <button
              aria-label="Multilingual Switcher"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="h-9 px-2.5 rounded-lg flex items-center justify-center gap-1 bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">
                translate
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {currentLanguage.toUpperCase()}
              </span>
            </button>

            {showLangMenu && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl bg-surface-container-lowest shadow-2xl border border-outline-variant/30 p-1.5 z-50"
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

          {/* Dark Mode Toggle */}
          <button
            aria-label="Toggle Dark Mode"
            onClick={onToggleDarkMode}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Global Search Button */}
          <button
            aria-label="Search Catalog & Courses"
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              aria-label="Academic Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface relative hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              {pendingRequestsCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface animate-ping"></span>
              )}
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-surface-container-lowest shadow-2xl border border-outline-variant/30 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
                  <span className="font-title-sm text-xs font-bold text-on-surface">
                    Press Notifications
                  </span>
                  <span className="text-[10px] text-secondary font-bold uppercase">
                    Live
                  </span>
                </div>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  <div className="p-2 rounded-lg bg-surface-container text-xs text-on-surface">
                    <p className="font-semibold text-secondary">Haramaya Academic Desk Active</p>
                    <p className="text-on-surface-variant mt-0.5 text-[11px]">
                      Direct submissions for doctoral and thesis presentations are open.
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container text-xs text-on-surface">
                    <p className="font-semibold text-on-surface">
                      New Digital Release Available
                    </p>
                    <p className="text-on-surface-variant mt-0.5 text-[11px]">
                      "Mastering English Phrasal Verbs & Idioms" full reader is now live.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Authentication Status / Login Button (Desktop) */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-secondary text-on-secondary font-bold text-[11px] flex items-center justify-center uppercase">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden lg:flex flex-col text-left min-w-0 max-w-[120px]">
                  <span className="text-xs font-bold text-on-surface truncate leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[9px] font-mono text-secondary uppercase font-semibold truncate leading-none">
                    {user.role}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                  expand_more
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-surface-container-lowest shadow-2xl border border-outline-variant/30 p-3 z-50 animate-in fade-in duration-150">
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs font-bold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">login</span>
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle Navigation Menu"
            className="xl:hidden w-9 h-9 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              {showMobileMenu ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {showMobileMenu && (
        <div className="xl:hidden bg-surface-container-lowest border-b border-outline-variant/20 px-4 py-3 shadow-xl max-h-[75vh] overflow-y-auto">
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
