import React, { useState, useEffect, useRef } from 'react';
import { Book, Course, Language, ResourceItem, ServiceCategory } from '../types';

interface GlobalSearchModalProps {
  books: Book[];
  courses: Course[];
  resources: ResourceItem[];
  currentLanguage: Language;
  onClose: () => void;
  onSelectBook: (book: Book) => void;
  onSelectCourse: (course: Course) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenQuotation?: (pages?: number, category?: ServiceCategory) => void;
  onOpenDiagnostic?: () => void;
  onOpenGlossary?: () => void;
  onOpenCitation?: (book?: Book) => void;
  onOpenThesisSlideStudio?: () => void;
  onOpenPeerReview?: () => void;
  onOpenCoverStudio?: (book?: Book) => void;
  onOpenCIP?: (book?: Book) => void;
  onOpenProofreader?: () => void;
  onOpenPosterStudio?: () => void;
  onOpenPlagiarism?: () => void;
  onOpenGrantStudio?: () => void;
  onOpenDOI?: () => void;
  onOpenJournalWorkflow?: () => void;
  onOpenVerify?: () => void;
  onRequestService?: () => void;
  onToggleDarkMode?: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  books,
  courses,
  resources,
  currentLanguage,
  onClose,
  onSelectBook,
  onSelectCourse,
  onNavigateTab,
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
  onOpenVerify,
  onRequestService,
  onToggleDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'books' | 'courses' | 'resources' | 'actions'>('all');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const q = searchQuery.toLowerCase().trim();

  // Quick Action Commands definition
  const quickActions = [
    {
      id: 'act-quote',
      title: 'Generate Pro-Forma Quotation',
      subtitle: 'Calculate institutional rates for PPT, typesetting & thesis',
      icon: 'receipt_long',
      category: 'Financial Tools',
      action: () => {
        onOpenQuotation?.(25, 'ppt');
        onClose();
      },
    },
    {
      id: 'act-diagnostic',
      title: 'Audit Manuscript / Word Count Diagnostic',
      subtitle: 'Analyze readability, script breakdown, RTL diacritics & citations',
      icon: 'spellcheck',
      category: 'Editorial Tools',
      action: () => {
        onOpenDiagnostic?.();
        onClose();
      },
    },
    {
      id: 'act-glossary',
      title: 'Open 4-Way Academic Glossary',
      subtitle: 'Search multilingual terminology in English, Oromo, Amharic & Arabic',
      icon: 'translate',
      category: 'Linguistics Tools',
      action: () => {
        onOpenGlossary?.();
        onClose();
      },
    },
    {
      id: 'act-citation',
      title: 'Generate Academic Citation (BibTeX / APA 7th)',
      subtitle: 'Export LaTeX citations, Chicago 17, and IEEE bibliographic entries',
      icon: 'format_quote',
      category: 'Scholarly Tools',
      action: () => {
        onOpenCitation?.();
        onClose();
      },
    },
    {
      id: 'act-thesis-slides',
      title: 'Thesis Defense Slide & LaTeX Beamer Studio',
      subtitle: 'Compose 16:9 defense slide decks, Overleaf .tex, and School of Graduate Studies front-matter',
      icon: 'slideshow',
      category: 'Scholarly Tools',
      action: () => {
        onOpenThesisSlideStudio?.();
        onClose();
      },
    },
    {
      id: 'act-peer-review',
      title: 'Manuscript Peer-Review & Editorial Appraisal Matrix',
      subtitle: 'Score methodological rigor, citations, typography, and generate board appraisals',
      icon: 'rate_review',
      category: 'Editorial Tools',
      action: () => {
        onOpenPeerReview?.();
        onClose();
      },
    },
    {
      id: 'act-cover-studio',
      title: 'Monograph Book Jacket & Spine Caliper Studio',
      subtitle: 'Calculate spine width, paper calipers, and design 3D case hardcovers',
      icon: 'book_online',
      category: 'Publishing Pre-Press',
      action: () => {
        onOpenCoverStudio?.(books[0] || null);
        onClose();
      },
    },
    {
      id: 'act-cip-generator',
      title: 'Cataloging-in-Publication (CIP) & ISBN Barcode Studio',
      subtitle: 'Format Ethiopian National Library CIP verso copyright page and EAN-13 barcodes',
      icon: 'qr_code_2',
      category: 'Library Cataloging',
      action: () => {
        onOpenCIP?.(books[0] || null);
        onClose();
      },
    },
    {
      id: 'act-proofreader',
      title: 'Multilingual Academic Proofreader & Orthographic Linter',
      subtitle: 'Audit Qubee Afaan Oromoo, Ethiopic Fidel, and Arabic orthography & APA 7th syntax',
      icon: 'spellcheck',
      category: 'Publishing Pre-Press',
      action: () => {
        onOpenProofreader?.();
        onClose();
      },
    },
    {
      id: 'act-poster-studio',
      title: 'Academic Symposia & Conference Poster Studio',
      subtitle: 'Design A0/A1 scientific research posters with 3-column layouts and SVG export',
      icon: 'view_quilt',
      category: 'Scholarly Presentations',
      action: () => {
        onOpenPosterStudio?.();
        onClose();
      },
    },
    {
      id: 'act-plagiarism',
      title: 'Academic Plagiarism & Originality Index Estimator',
      subtitle: 'Scrutinize manuscript similarity against Horn of Africa repositories (HU, AAU, Jimma, AJOL)',
      icon: 'policy',
      category: 'Graduate Research Directorate',
      action: () => {
        onOpenPlagiarism?.();
        onClose();
      },
    },
    {
      id: 'act-grant-studio',
      title: 'Research Grant Proposal & Budget Studio',
      subtitle: 'Build multi-currency project budgets, field DSA per-diems, and institutional clearance dossier',
      icon: 'account_balance',
      category: 'Graduate Research Directorate',
      action: () => {
        onOpenGrantStudio?.();
        onClose();
      },
    },
    {
      id: 'act-doi',
      title: 'DOI & CrossRef Schema Studio',
      subtitle: 'Generate official IDF/CrossRef 5.3.1 deposit XML, DataCite JSON-LD, and ORCID registries',
      icon: 'tag',
      category: 'Academic Metadata & Indexing',
      action: () => {
        onOpenDOI?.();
        onClose();
      },
    },
    {
      id: 'act-journal-workflow',
      title: 'Institutional Journal Submissions & Editorial Workflow',
      subtitle: 'Manage EAJS, HJAS, and HLR peer-review lifecycle, reviewer scoring, and galley proofs',
      icon: 'menu_book',
      category: 'Institutional Journals Directorate',
      action: () => {
        onOpenJournalWorkflow?.();
        onClose();
      },
    },
    {
      id: 'act-verify',
      title: 'Verify Official Digital Certificate',
      subtitle: 'Validate digital checksums & Haramaya Press director approvals',
      icon: 'verified',
      category: 'Credential Verification',
      action: () => {
        onOpenVerify?.();
        onClose();
      },
    },
    {
      id: 'act-request',
      title: 'Submit New Service Request',
      subtitle: 'Place an order for slide decks, book publishing, or translation',
      icon: 'edit_note',
      category: 'Publishing Operations',
      action: () => {
        onRequestService?.();
        onClose();
      },
    },
    {
      id: 'act-student',
      title: 'Open Student Scholar Portal',
      subtitle: 'Access enrolled courses, lesson matrix, and digital scholar ID badge',
      icon: 'account_circle',
      category: 'Portal Navigation',
      action: () => {
        onNavigateTab?.('student');
        onClose();
      },
    },
    {
      id: 'act-admin',
      title: 'Open Admin Management Console',
      subtitle: 'Supervise manuscript queues, verify bank slips, and author curriculum',
      icon: 'admin_panel_settings',
      category: 'Portal Navigation',
      action: () => {
        onNavigateTab?.('admin');
        onClose();
      },
    },
    {
      id: 'act-theme',
      title: 'Toggle Color Theme (Dark / Light)',
      subtitle: 'Switch between warm academic parchment and high-contrast night mode',
      icon: 'dark_mode',
      category: 'Preferences',
      action: () => {
        onToggleDarkMode?.();
        onClose();
      },
    },
  ];

  // Filter Matching
  const matchingBooks = books.filter(
    (b) =>
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      (b.titleLocalized?.or && b.titleLocalized.or.toLowerCase().includes(q)) ||
      (b.titleLocalized?.am && b.titleLocalized.am.toLowerCase().includes(q)) ||
      (b.titleLocalized?.ar && b.titleLocalized.ar.toLowerCase().includes(q))
  );

  const matchingCourses = courses.filter(
    (c) =>
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.level.toLowerCase().includes(q)
  );

  const matchingResources = resources.filter(
    (r) =>
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.fileType.toLowerCase().includes(q)
  );

  const matchingActions = quickActions.filter(
    (a) =>
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.subtitle.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
  );

  // Export Academic Study Bundle
  const handleExportStudyBundle = () => {
    const studyBundle = {
      institution: 'Wirtuu Kompiitaraa Ilillii (WKI)',
      director: 'Mr. Feysal Hussein',
      affiliation: 'Haramaya University Digital Publishing Press',
      generatedAt: new Date().toISOString(),
      catalogOverview: {
        totalBooks: books.length,
        totalCourses: courses.length,
        totalResources: resources.length,
      },
      publications: books.map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        category: b.category,
        pages: b.pages,
        language: b.langTag,
        description: b.description,
      })),
      curriculum: courses.map((c) => ({
        id: c.id,
        title: c.title,
        level: c.level,
        instructor: c.instructor,
        duration: c.duration,
        lessonsCount: c.lessons.length,
        lessons: c.lessons.map((l) => ({ id: l.id, title: l.title, duration: l.duration })),
      })),
      academicResources: resources.map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        fileType: r.fileType,
        pages: r.pages,
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(studyBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `WKI_Academic_Study_Bundle_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess('Offline Academic Study Package (.json) successfully exported!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const totalResults =
    (activeFilter === 'all' || activeFilter === 'actions' ? matchingActions.length : 0) +
    (activeFilter === 'all' || activeFilter === 'books' ? matchingBooks.length : 0) +
    (activeFilter === 'all' || activeFilter === 'courses' ? matchingCourses.length : 0) +
    (activeFilter === 'all' || activeFilter === 'resources' ? matchingResources.length : 0);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-3 sm:p-6 flex items-start justify-center pt-12 sm:pt-20 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-3xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-outline-variant/30 flex flex-col gap-4 max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/20">
          <span className="material-symbols-outlined text-secondary text-[26px]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type anything (e.g., 'Tajweed', 'Defense Slides', 'Quotation', 'Gadaa', 'LaTeX')..."
            className="w-full text-base sm:text-lg font-medium text-on-surface bg-transparent focus:outline-none placeholder:text-outline"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer text-xs"
              title="Clear input"
            >
              <span className="material-symbols-outlined text-[18px]">backspace</span>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-md bg-surface-container text-on-surface-variant">
            <span>ESC to close</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Filter Navigation & Export Action */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto text-xs pb-1 border-b border-outline-variant/15">
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { id: 'all', label: `All (${totalResults})` },
              { id: 'actions', label: `Tools (${matchingActions.length})` },
              { id: 'books', label: `Books (${matchingBooks.length})` },
              { id: 'courses', label: `Courses (${matchingCourses.length})` },
              { id: 'resources', label: `Repository (${matchingResources.length})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === f.id
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportStudyBundle}
            className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-secondary font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 border border-secondary/20 transition-all"
            title="Download full offline syllabus and catalog metadata pack"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span className="hidden sm:inline">Export Study Bundle</span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Results Stream Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {/* Quick Actions & Tools */}
          {(activeFilter === 'all' || activeFilter === 'actions') && matchingActions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-secondary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  Academic Tools & Platform Shortcuts
                </span>
                <span className="text-[11px] text-on-surface-variant font-mono">
                  {matchingActions.length} available
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingActions.map((a) => (
                  <div
                    key={a.id}
                    onClick={a.action}
                    className="p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 flex items-start gap-3 hover:border-secondary/40 transition-all cursor-pointer group shadow-xs"
                  >
                    <span className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">{a.icon}</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-title-sm text-title-sm font-bold text-on-surface truncate group-hover:text-secondary transition-colors">
                          {a.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                        {a.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Digital Books & Publications */}
          {(activeFilter === 'all' || activeFilter === 'books') && matchingBooks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-secondary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  Digital Publications & Monographs
                </span>
                <span className="text-[11px] text-on-surface-variant font-mono">
                  {matchingBooks.length} items
                </span>
              </div>
              <div className="space-y-2">
                {matchingBooks.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      onSelectBook(b);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 flex items-center justify-between gap-3 hover:border-secondary/40 transition-all cursor-pointer group shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={b.coverUrl}
                        alt={b.title}
                        className="w-10 h-14 rounded-lg object-cover shadow-xs shrink-0 border border-outline-variant/30"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-secondary/15 text-secondary">
                            {b.langTag}
                          </span>
                          <span className="text-[11px] text-on-surface-variant font-semibold truncate">
                            {b.category}
                          </span>
                        </div>
                        <h4 className="font-title-sm text-title-sm font-bold text-on-surface truncate group-hover:text-secondary transition-colors mt-0.5">
                          {b.title}
                        </h4>
                        <span className="text-[11px] text-on-surface-variant truncate block">
                          Author: {b.author} • {b.pages} Pages • Haramaya Press
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:flex items-center gap-1 text-[11px] text-secondary font-bold">
                        <span>Read Book</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* E-Learning Courses */}
          {(activeFilter === 'all' || activeFilter === 'courses') && matchingCourses.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-secondary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  E-Learning Curriculum & Lessons
                </span>
                <span className="text-[11px] text-on-surface-variant font-mono">
                  {matchingCourses.length} courses
                </span>
              </div>
              <div className="space-y-2">
                {matchingCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectCourse(c);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 flex items-center justify-between gap-3 hover:border-secondary/40 transition-all cursor-pointer group shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[22px]">school</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-surface-container-highest text-on-surface">
                            {c.level}
                          </span>
                          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold truncate">
                            {c.category}
                          </span>
                        </div>
                        <h4 className="font-title-sm text-title-sm font-bold text-on-surface truncate group-hover:text-secondary transition-colors mt-0.5">
                          {c.title}
                        </h4>
                        <span className="text-[11px] text-on-surface-variant truncate block">
                          Instructor: {c.instructor} • {c.duration} • {c.lessons.length} Modules
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:flex items-center gap-1 text-[11px] text-secondary font-bold">
                        <span>Launch LMS</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic Repository Resources */}
          {(activeFilter === 'all' || activeFilter === 'resources') && matchingResources.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-secondary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">folder_open</span>
                  Syllabi, Templates & Citation Guides
                </span>
                <span className="text-[11px] text-on-surface-variant font-mono">
                  {matchingResources.length} files
                </span>
              </div>
              <div className="space-y-2">
                {matchingResources.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onNavigateTab?.('resources');
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 flex items-center justify-between gap-3 hover:border-secondary/40 transition-all cursor-pointer shadow-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                          {r.fileType}
                        </span>
                        <span className="text-[11px] text-on-surface-variant font-semibold">
                          {r.category}
                        </span>
                      </div>
                      <h4 className="font-title-sm text-title-sm font-bold text-on-surface truncate mt-0.5">
                        {r.title}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant line-clamp-1">
                        {r.description}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0">
                      download
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {totalResults === 0 && (
            <div className="py-14 text-center space-y-3">
              <span className="material-symbols-outlined text-outline text-[48px]">search_off</span>
              <div>
                <h4 className="font-title-sm text-title-sm font-bold text-on-surface">
                  No academic matches found for "{searchQuery}"
                </h4>
                <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                  Try searching with terms like "Phrasal", "Tajweed", "LaTeX Thesis", "Defense", or launch one of the quick tools.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Hotkey Guide */}
        <div className="pt-3 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-on-surface-variant">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[10px] font-bold border border-outline-variant/30">Ctrl + K</kbd> anytime</span>
            <span>•</span>
            <span>Multilingual Index: EN / OR / AM / AR</span>
          </div>
          <span className="font-bold text-secondary">
            Wirtuu Kompiitaraa Ilillii • Haramaya University
          </span>
        </div>
      </div>
    </div>
  );
};
