import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Book } from '../types';

interface BookReaderModalProps {
  book: Book;
  onClose: () => void;
  onToggleBookmark?: (bookId: string) => void;
  onOpenCitation?: (book: Book) => void;
  onOpenCoverStudio?: (book: Book) => void;
  onOpenCIP?: (book: Book) => void;
  onOpenProofreader?: () => void;
  onOpenPosterStudio?: (book: Book) => void;
  onOpenPlagiarism?: (book: Book) => void;
  onOpenGrantStudio?: () => void;
  onOpenDOI?: (book: Book) => void;
  onOpenJournalWorkflow?: () => void;
}

interface ReaderAnnotation {
  id: string;
  chapterIndex: number;
  chapterTitle: string;
  textSelection: string;
  note: string;
  tag: 'insight' | 'hypothesis' | 'critique' | 'citation';
  timestamp: string;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({
  book,
  onClose,
  onToggleBookmark,
  onOpenCitation,
  onOpenCoverStudio,
  onOpenCIP,
  onOpenProofreader,
  onOpenPosterStudio,
  onOpenPlagiarism,
  onOpenGrantStudio,
  onOpenDOI,
  onOpenJournalWorkflow,
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'dyslexic' | 'mono' | 'naskh'>('serif');
  const [lineSpacing, setLineSpacing] = useState<'compact' | 'standard' | 'relaxed'>('standard');
  const [columnWidth, setColumnWidth] = useState<'narrow' | 'standard' | 'wide' | 'twopage'>('standard');
  const [textAlign, setTextAlign] = useState<'left' | 'justify'>('justify');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'sepia'>('light');
  
  // Drawer & Overlay UI states
  const [showToc, setShowToc] = useState<boolean>(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState<boolean>(false);
  const [showTypographySettings, setShowTypographySettings] = useState<boolean>(false);
  const [showAudioDrawer, setShowAudioDrawer] = useState<boolean>(false);
  const [showOfflineManager, setShowOfflineManager] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(!!book.bookmarked);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'flow' | 'epub' | 'pdf'>('epub');

  // Audio / Audiobook / TTS State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState<number>(-1);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [audioVoiceLanguage, setAudioVoiceLanguage] = useState<string>(book.language);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [autoScrollWithAudio, setAutoScrollWithAudio] = useState<boolean>(true);

  // Offline Caching State
  const [isOfflineCached, setIsOfflineCached] = useState<boolean>(() => {
    return !!localStorage.getItem(`wki_offline_book_${book.id}`);
  });
  const [offlineCacheMessage, setOfflineCacheMessage] = useState<string | null>(null);

  // Annotation states
  const [annotations, setAnnotations] = useState<ReaderAnnotation[]>([
    {
      id: 'note-1',
      chapterIndex: 0,
      chapterTitle: book.chapters[0]?.title || 'Introduction',
      textSelection: 'Academic publishing standards require systematic verification of orthography.',
      note: 'Cross-reference this rule with Haramaya University Directorate thesis guidelines.',
      tag: 'insight',
      timestamp: '2026-09-12 14:20',
    },
  ]);
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [newNoteQuote, setNewNoteQuote] = useState<string>('');
  const [newNoteTag, setNewNoteTag] = useState<'insight' | 'hypothesis' | 'critique' | 'citation'>('insight');
  const [showAddNoteModal, setShowAddNoteModal] = useState<boolean>(false);

  const currentChapter = book.chapters[activeChapterIndex] || book.chapters[0];
  const isRtl = book.language === 'ar' || fontFamily === 'naskh';
  const progressPercent = Math.round(
    ((activeChapterIndex + 1) / Math.max(book.chapters.length, 1)) * 100
  );

  // Sentences broken for Audiobook karaoke highlighting
  const chapterSentences = useMemo(() => {
    if (!currentChapter?.content) return [];
    // Split into readable sentences or punctuated segments
    return currentChapter.content
      .split(/(?<=[.?!؟\n])\s+/)
      .filter((s) => s.trim().length > 0);
  }, [currentChapter]);

  // Audio timer & Speech synthesis loop
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeSentenceRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!isPlayingAudio) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (currentSpeakingIndex < 0) {
      setCurrentSpeakingIndex(0);
      return;
    }

    if (currentSpeakingIndex >= chapterSentences.length) {
      setIsPlayingAudio(false);
      setCurrentSpeakingIndex(-1);
      return;
    }

    const currentSentence = chapterSentences[currentSpeakingIndex];
    if (!currentSentence) return;

    // Scroll sentence into view
    if (autoScrollWithAudio && activeSentenceRef.current) {
      activeSentenceRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Try native Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentSentence);
      utterance.rate = audioSpeed;
      if (audioVoiceLanguage === 'ar') utterance.lang = 'ar-SA';
      else if (audioVoiceLanguage === 'or') utterance.lang = 'om-ET';
      else if (audioVoiceLanguage === 'am') utterance.lang = 'am-ET';
      else utterance.lang = 'en-US';

      utterance.onend = () => {
        if (isPlayingAudio) {
          setCurrentSpeakingIndex((prev) => prev + 1);
        }
      };

      utterance.onerror = () => {
        // Fallback simulated duration based on word count
        const wordCount = currentSentence.split(/\s+/).length;
        const durationMs = Math.max(1500, (wordCount * 300) / audioSpeed);
        const timer = setTimeout(() => {
          if (isPlayingAudio) {
            setCurrentSpeakingIndex((prev) => prev + 1);
          }
        }, durationMs);
        return () => clearTimeout(timer);
      };

      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer simulation
      const wordCount = currentSentence.split(/\s+/).length;
      const durationMs = Math.max(1500, (wordCount * 300) / audioSpeed);
      const timer = setTimeout(() => {
        if (isPlayingAudio) {
          setCurrentSpeakingIndex((prev) => prev + 1);
        }
      }, durationMs);
      return () => clearTimeout(timer);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlayingAudio, currentSpeakingIndex, audioSpeed, chapterSentences, audioVoiceLanguage, autoScrollWithAudio]);

  // Handle Offline Caching
  const handleToggleOffline = () => {
    if (isOfflineCached) {
      localStorage.removeItem(`wki_offline_book_${book.id}`);
      setIsOfflineCached(false);
      setOfflineCacheMessage('Removed from offline cache.');
    } else {
      const bookData = JSON.stringify({
        ...book,
        cachedAt: new Date().toISOString(),
        storedSizeKB: Math.round(JSON.stringify(book).length / 1024) + 42,
      });
      localStorage.setItem(`wki_offline_book_${book.id}`, bookData);
      setIsOfflineCached(true);
      setOfflineCacheMessage('Complete manuscript & audio transcripts saved for offline reading!');
    }
    setTimeout(() => setOfflineCacheMessage(null), 4000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    onToggleBookmark?.(book.id);
  };

  const themeStyles = {
    light: {
      bg: 'bg-[#faf9f5]',
      text: 'text-[#1c2434]',
      card: 'bg-white border-[#e5e1d8]',
    },
    dark: {
      bg: 'bg-[#0f172a]',
      text: 'text-[#e2e8f0]',
      card: 'bg-[#1e293b] border-[#334155]',
    },
    sepia: {
      bg: 'bg-[#f4ecd8]',
      text: 'text-[#433422]',
      card: 'bg-[#ede3cc] border-[#d8cbb0]',
    },
  };

  const currentTheme = themeStyles[themeMode];

  // Font family css class mapper
  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'sans':
        return 'font-sans';
      case 'dyslexic':
        return 'font-sans tracking-wide leading-loose';
      case 'mono':
        return 'font-mono text-xs';
      case 'naskh':
        return 'font-serif text-lg';
      case 'serif':
      default:
        return 'font-serif';
    }
  };

  // Line spacing style
  const getLineHeight = () => {
    if (lineSpacing === 'compact') return 1.5;
    if (lineSpacing === 'relaxed') return 2.1;
    return 1.85;
  };

  // Max width container for reflowable engine
  const getContainerWidthClass = () => {
    if (columnWidth === 'narrow') return 'max-w-xl';
    if (columnWidth === 'wide') return 'max-w-4xl';
    if (columnWidth === 'twopage') return 'max-w-6xl';
    return 'max-w-2xl';
  };

  // Calculate estimated reading time
  const totalWords = useMemo(() => {
    return (currentChapter?.content || '').split(/\s+/).length;
  }, [currentChapter]);
  const estimatedReadMinutes = Math.max(1, Math.ceil(totalWords / 200));

  // Search occurrence highlight in text
  const renderHighlightedContent = (text: string) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
      {/* Reader Header */}
      <header className="h-16 px-4 bg-surface-container-lowest/95 backdrop-blur border-b border-outline-variant/30 flex items-center justify-between text-on-surface z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
            title="Exit Reader"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col min-w-0">
            <h3 className="font-title-sm text-title-sm font-bold text-on-surface truncate">
              {book.title}
            </h3>
            <span className="text-[11px] text-on-surface-variant truncate">
              {book.author} • {book.category} • {book.pages} Pages
            </span>
          </div>
        </div>

        {/* Reader Controls Toolbar */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-end">
          {/* Table of Contents */}
          <button
            onClick={() => setShowToc(!showToc)}
            className={`h-9 px-2.5 rounded-lg flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${
              showToc
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
            title="Table of Contents"
          >
            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            <span className="hidden md:inline">Chapters</span>
          </button>

          {/* Audiobook / TTS Recitation Mode Trigger */}
          <button
            onClick={() => {
              if (isPlayingAudio) {
                setIsPlayingAudio(false);
              } else {
                setIsPlayingAudio(true);
                if (currentSpeakingIndex < 0) setCurrentSpeakingIndex(0);
              }
              setShowAudioDrawer(true);
            }}
            className={`h-9 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-emerald-600 text-white shadow-md animate-pulse'
                : showAudioDrawer
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
            title="Listen to Audiobook & Synchronized Recitation"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPlayingAudio ? 'volume_up' : 'headphones'}
            </span>
            <span className="hidden sm:inline">
              {isPlayingAudio ? 'Listening...' : 'Audiobook'}
            </span>
          </button>

          {/* EPUB / Typography Settings */}
          <button
            onClick={() => setShowTypographySettings(!showTypographySettings)}
            className={`h-9 px-2.5 rounded-lg flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${
              showTypographySettings
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
            title="Reflowable EPUB & Typography Settings"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span className="hidden lg:inline">Typography</span>
          </button>

          {/* Search within Book */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors cursor-pointer ${
              showSearch
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
            title="Search in Text"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
          </button>

          {/* View Mode: EPUB vs Flow vs Simulated PDF */}
          <div className="hidden sm:flex items-center bg-surface-container rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('epub')}
              className={`px-2 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                viewMode === 'epub' ? 'bg-secondary text-on-secondary shadow-xs' : 'text-on-surface-variant'
              }`}
              title="Reflowable EPUB Layout"
            >
              EPUB
            </button>
            <button
              onClick={() => setViewMode('flow')}
              className={`px-2 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                viewMode === 'flow' ? 'bg-secondary text-on-secondary shadow-xs' : 'text-on-surface-variant'
              }`}
              title="Continuous Vertical Scroll"
            >
              Flow
            </button>
            <button
              onClick={() => setViewMode('pdf')}
              className={`px-2 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                viewMode === 'pdf' ? 'bg-secondary text-on-secondary shadow-xs' : 'text-on-surface-variant'
              }`}
              title="Print Proof / PDF Layout"
            >
              PDF Layout
            </button>
          </div>

          {/* Offline Sync Status */}
          <button
            onClick={handleToggleOffline}
            className={`h-9 px-2.5 rounded-lg flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
              isOfflineCached
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
            title={isOfflineCached ? 'Cached Offline (Click to remove)' : 'Save for Offline Reading'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isOfflineCached ? 'cloud_done' : 'cloud_download'}
            </span>
            <span className="hidden xl:inline">{isOfflineCached ? 'Offline Ready' : 'Save Offline'}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500 text-white'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
            title="Bookmark this Book"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isBookmarked ? 'bookmark_added' : 'bookmark_add'}
            </span>
          </button>

          {/* Marginal Annotations / Research Notes Drawer Trigger */}
          <button
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            className={`h-9 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
              showNotesDrawer
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
            title="Scholarly Marginal Notes & Annotations"
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span className="hidden xl:inline">Notes</span>
            {annotations.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-mono font-bold">
                {annotations.length}
              </span>
            )}
          </button>

          {/* Citation Generator */}
          {onOpenCitation && (
            <button
              onClick={() => onOpenCitation(book)}
              className="h-9 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer"
              title="Cite this Publication (APA 7th, BibTeX, IEEE)"
            >
              <span className="material-symbols-outlined text-[18px]">format_quote</span>
              <span className="hidden 2xl:inline">Cite</span>
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex w-9 h-9 rounded-lg bg-surface-container items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
            title="Fullscreen"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>

          {/* Download if allowed */}
          {book.downloadAllowed && (
            <button
              onClick={() => alert(`Starting download for: ${book.title} (Academic Edition PDF)`)}
              className="h-9 px-3 rounded-lg bg-secondary text-on-secondary text-xs font-bold flex items-center gap-1 hover:brightness-105 transition-all cursor-pointer shadow-xs"
              title="Download Full Publication"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span className="hidden lg:inline">PDF</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors text-error cursor-pointer"
            title="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </header>

      {/* Offline Toast Banner */}
      {offlineCacheMessage && (
        <div className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between z-30 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{offlineCacheMessage}</span>
          </div>
          <button onClick={() => setOfflineCacheMessage(null)} className="text-white hover:opacity-80">
            ✕
          </button>
        </div>
      )}

      {/* Search Bar Flyout */}
      {showSearch && (
        <div className="px-4 py-2 bg-surface-container-high border-b border-outline-variant/30 flex items-center gap-2 z-20">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Search keywords within this chapter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg bg-surface text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-on-surface-variant hover:text-on-surface"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Audiobook Floating Player Ribbon (when audio active) */}
      {showAudioDrawer && (
        <div className="px-4 py-3 bg-surface-container-high border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-3 z-20 shadow-md animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">
                {isPlayingAudio ? 'equalizer' : 'play_arrow'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface">
                  Synchronized Academic Audiobook
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  Sentence {currentSpeakingIndex >= 0 ? currentSpeakingIndex + 1 : 1} of {chapterSentences.length}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant line-clamp-1">
                {currentSpeakingIndex >= 0 && chapterSentences[currentSpeakingIndex]
                  ? `"${chapterSentences[currentSpeakingIndex].slice(0, 65)}..."`
                  : 'Click play to start word-synchronized recitation.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Sentence */}
            <button
              onClick={() => setCurrentSpeakingIndex((idx) => Math.max(0, idx - 1))}
              className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center hover:bg-surface-container-highest text-on-surface cursor-pointer"
              title="Previous Sentence"
            >
              <span className="material-symbols-outlined text-[18px]">skip_previous</span>
            </button>

            {/* Play / Pause */}
            <button
              onClick={() => {
                if (isPlayingAudio) {
                  setIsPlayingAudio(false);
                } else {
                  setIsPlayingAudio(true);
                  if (currentSpeakingIndex < 0) setCurrentSpeakingIndex(0);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlayingAudio ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlayingAudio ? 'Pause' : 'Play'}</span>
            </button>

            {/* Next Sentence */}
            <button
              onClick={() => setCurrentSpeakingIndex((idx) => Math.min(chapterSentences.length - 1, idx + 1))}
              className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center hover:bg-surface-container-highest text-on-surface cursor-pointer"
              title="Next Sentence"
            >
              <span className="material-symbols-outlined text-[18px]">skip_next</span>
            </button>

            {/* Speed Selector */}
            <div className="flex items-center bg-surface-container rounded-lg p-0.5 text-xs">
              {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setAudioSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                    audioSpeed === spd
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Voice Accent */}
            <select
              value={audioVoiceLanguage}
              onChange={(e) => setAudioVoiceLanguage(e.target.value)}
              className="px-2 py-1 text-xs rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface focus:outline-none"
            >
              <option value="en">Academic English</option>
              <option value="or">Afaan Oromoo</option>
              <option value="am">Amharic (አማርኛ)</option>
              <option value="ar">Arabic Tajweed (العربية)</option>
            </select>

            {/* Auto-scroll toggle */}
            <button
              onClick={() => setAutoScrollWithAudio(!autoScrollWithAudio)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer ${
                autoScrollWithAudio
                  ? 'bg-secondary/20 text-secondary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
              title={autoScrollWithAudio ? 'Auto-scroll is ON' : 'Auto-scroll is OFF'}
            >
              <span className="material-symbols-outlined text-[18px]">vertical_align_center</span>
            </button>

            <button
              onClick={() => {
                setIsPlayingAudio(false);
                setShowAudioDrawer(false);
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface"
              title="Close Audio Bar"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Typography & Reflowable Settings Drawer */}
      {showTypographySettings && (
        <div className="px-4 py-3 bg-surface-container-high border-b border-outline-variant/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 z-20 shadow-md animate-in slide-in-from-top duration-200 text-xs">
          {/* Font Family */}
          <div className="space-y-1">
            <span className="font-bold text-on-surface-variant block uppercase tracking-wider text-[10px]">
              Typography Style:
            </span>
            <div className="flex items-center gap-1">
              {[
                { id: 'serif', label: 'Serif' },
                { id: 'sans', label: 'Modern Sans' },
                { id: 'dyslexic', label: 'Clean' },
                { id: 'mono', label: 'Mono' },
                { id: 'naskh', label: 'Naskh' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFontFamily(f.id as any)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    fontFamily === f.id
                      ? 'bg-secondary text-on-secondary font-bold'
                      : 'bg-surface-container hover:bg-surface-container-highest text-on-surface'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Spacing & Width */}
          <div className="space-y-1">
            <span className="font-bold text-on-surface-variant block uppercase tracking-wider text-[10px]">
              Line Spacing & Columns:
            </span>
            <div className="flex items-center gap-1">
              {[
                { id: 'compact', label: 'Compact' },
                { id: 'standard', label: 'Standard' },
                { id: 'relaxed', label: 'Relaxed' },
              ].map((ls) => (
                <button
                  key={ls.id}
                  onClick={() => setLineSpacing(ls.id as any)}
                  className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                    lineSpacing === ls.id
                      ? 'bg-secondary text-on-secondary font-bold'
                      : 'bg-surface-container text-on-surface'
                  }`}
                >
                  {ls.label}
                </button>
              ))}
              <button
                onClick={() => setColumnWidth(columnWidth === 'twopage' ? 'standard' : 'twopage')}
                className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                  columnWidth === 'twopage'
                    ? 'bg-amber-600 text-white'
                    : 'bg-surface-container text-on-surface'
                }`}
                title="Toggle 2-Page Book Spread"
              >
                2-Pages
              </button>
            </div>
          </div>

          {/* Theme Palette */}
          <div className="space-y-1">
            <span className="font-bold text-on-surface-variant block uppercase tracking-wider text-[10px]">
              Reading Canvas Color:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setThemeMode('light')}
                className={`flex-1 py-1 rounded border text-center font-bold cursor-pointer ${
                  themeMode === 'light'
                    ? 'border-secondary bg-white text-slate-800'
                    : 'border-outline-variant/30 bg-white/60 text-slate-700'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setThemeMode('sepia')}
                className={`flex-1 py-1 rounded border text-center font-bold cursor-pointer ${
                  themeMode === 'sepia'
                    ? 'border-secondary bg-[#f4ecd8] text-[#433422]'
                    : 'border-outline-variant/30 bg-[#f4ecd8]/60 text-[#433422]'
                }`}
              >
                Sepia
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`flex-1 py-1 rounded border text-center font-bold cursor-pointer ${
                  themeMode === 'dark'
                    ? 'border-secondary bg-slate-900 text-white'
                    : 'border-outline-variant/30 bg-slate-800/60 text-slate-300'
                }`}
              >
                Night
              </button>
            </div>
          </div>

          {/* Reading Statistics */}
          <div className="space-y-1 flex flex-col justify-center bg-surface-container/60 p-2 rounded-xl">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-on-surface-variant">Chapter Words:</span>
              <span className="font-bold font-mono text-on-surface">{totalWords}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-on-surface-variant">Est. Reading Time:</span>
              <span className="font-bold text-secondary font-mono">~{estimatedReadMinutes} min</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Line */}
      <div className="w-full bg-surface-container h-1 relative z-20">
        <div
          className="bg-secondary h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Reading Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table of Contents Drawer */}
        {showToc && (
          <aside className="w-72 sm:w-80 bg-surface-container-lowest border-r border-outline-variant/30 p-4 overflow-y-auto z-10 shadow-xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
              <span className="font-title-sm text-title-sm font-bold text-on-surface">
                Contents ({book.chapters.length})
              </span>
              <button
                onClick={() => setShowToc(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="space-y-1">
              {book.chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChapterIndex(idx);
                    setCurrentSpeakingIndex(0);
                    setShowToc(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-start gap-2 ${
                    activeChapterIndex === idx
                      ? 'bg-secondary text-on-secondary font-bold shadow-xs'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="opacity-70 mt-0.5">#{idx + 1}</span>
                  <span className="truncate flex-1">{ch.title}</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Text Scroll View or Simulated PDF Layout */}
        <main
          className={`flex-1 overflow-y-auto px-4 sm:px-12 py-8 transition-colors ${currentTheme.bg} ${currentTheme.text}`}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {viewMode === 'epub' || viewMode === 'flow' ? (
            <article className={`${getContainerWidthClass()} mx-auto ${getFontFamilyClass()}`}>
              {/* Chapter Header */}
              <div className="mb-6 pb-4 border-b border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-secondary font-bold">
                    Chapter {activeChapterIndex + 1} of {book.chapters.length}
                  </span>
                  <span className="text-xs font-mono opacity-70">
                    ~{estimatedReadMinutes} min read
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md font-bold mt-1 text-inherit">
                  {currentChapter ? currentChapter.title : book.title}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-xs opacity-75 font-sans">
                  <span>Language: {book.langTag}</span>
                  <span>•</span>
                  <span>Imprint: Wirtuu Kompiitaraa Ilillii</span>
                  <span>•</span>
                  <span>Haramaya Press</span>
                  {isOfflineCached && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold">Offline Stored</span>
                    </>
                  )}
                </div>
              </div>

              {/* Reading Content with Karaoke Highlighting */}
              <div
                className={`leading-relaxed space-y-3 ${
                  columnWidth === 'twopage' ? 'sm:columns-2 sm:gap-8' : ''
                }`}
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: getLineHeight(),
                  textAlign: textAlign === 'justify' ? 'justify' : 'left',
                }}
              >
                {chapterSentences.length > 0 ? (
                  chapterSentences.map((sentence, sIdx) => {
                    const isSpeaking = isPlayingAudio && currentSpeakingIndex === sIdx;
                    return (
                      <span
                        key={sIdx}
                        ref={isSpeaking ? activeSentenceRef : null}
                        onClick={() => {
                          setCurrentSpeakingIndex(sIdx);
                          setIsPlayingAudio(true);
                          setShowAudioDrawer(true);
                        }}
                        className={`inline transition-all duration-200 cursor-pointer rounded px-0.5 ${
                          isSpeaking
                            ? 'bg-amber-400/35 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/50 shadow-xs font-semibold'
                            : 'hover:bg-secondary/10'
                        }`}
                        title="Click to play audio from here"
                      >
                        {renderHighlightedContent(sentence)}{' '}
                      </span>
                    );
                  })
                ) : (
                  <p>No chapter content currently configured.</p>
                )}
              </div>

              {/* Research Annotation Action Bar */}
              <div className="mt-8 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/25 flex flex-wrap items-center justify-between gap-3 font-sans">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-secondary">stylus_note</span>
                  <span className="text-xs font-bold text-on-surface">
                    Scholarly Margin Annotations ({annotations.filter((a) => a.chapterIndex === activeChapterIndex).length} for this chapter)
                  </span>
                </div>
                <button
                  onClick={() => {
                    setNewNoteQuote(currentChapter?.content.slice(0, 120) + '...');
                    setShowAddNoteModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 hover:brightness-105 transition-all cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">add_comment</span>
                  <span>Add Margin Note</span>
                </button>
              </div>

              {/* End of Chapter Navigation Box */}
              <div className="mt-12 pt-6 border-t border-outline-variant/20 flex items-center justify-between gap-4 font-sans">
                <button
                  disabled={activeChapterIndex === 0}
                  onClick={() => {
                    setActiveChapterIndex((i) => Math.max(0, i - 1));
                    setCurrentSpeakingIndex(0);
                  }}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors text-xs sm:text-sm font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isRtl ? 'arrow_forward' : 'arrow_back'}
                  </span>
                  <span>Previous Chapter</span>
                </button>

                <span className="text-xs opacity-70 font-medium font-mono">
                  Chapter {activeChapterIndex + 1} of {book.chapters.length}
                </span>

                <button
                  disabled={activeChapterIndex >= book.chapters.length - 1}
                  onClick={() => {
                    setActiveChapterIndex((i) =>
                      Math.min(book.chapters.length - 1, i + 1)
                    );
                    setCurrentSpeakingIndex(0);
                  }}
                  className="px-4 py-2 rounded-lg bg-secondary text-on-secondary disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-colors text-xs sm:text-sm font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>Next Chapter</span>
                  <span className="material-symbols-outlined text-[18px]">
                    {isRtl ? 'arrow_back' : 'arrow_forward'}
                  </span>
                </button>
              </div>
            </article>
          ) : (
            /* Simulated PDF Page Layout */
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-8 sm:p-12 rounded-2xl shadow-xl border border-outline-variant/30 bg-white text-slate-900 font-serif min-h-[700px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 text-xs text-slate-500 font-sans uppercase tracking-wider">
                    <span>{book.title}</span>
                    <span>Page {activeChapterIndex + 1}</span>
                  </div>

                  <div className="mt-8 mb-6">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block font-sans">
                      Section {activeChapterIndex + 1}
                    </span>
                    <h3 className="text-2xl font-bold mt-1 font-serif text-slate-900">
                      {currentChapter ? currentChapter.title : book.title}
                    </h3>
                  </div>

                  <div className="text-sm sm:text-base leading-loose whitespace-pre-line text-slate-800">
                    {currentChapter ? renderHighlightedContent(currentChapter.content) : ''}
                  </div>
                </div>

                <div className="pt-6 mt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-sans">
                  <span>Wirtuu Kompiitaraa Ilillii Academic Press • Haramaya</span>
                  <span>Document Hash: WKI-PUB-{(activeChapterIndex + 1) * 1042}</span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Marginal Notes & Study Annotations Drawer */}
        {showNotesDrawer && (
          <aside className="w-80 sm:w-96 bg-surface-container-lowest border-l border-outline-variant/30 p-4 overflow-y-auto z-20 shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col justify-between font-sans">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">edit_note</span>
                  <span className="font-bold text-xs text-on-surface">
                    Marginal Annotations ({annotations.length})
                  </span>
                </div>
                <button
                  onClick={() => setShowNotesDrawer(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              {/* Add Note Button */}
              <button
                onClick={() => {
                  setNewNoteQuote(currentChapter?.content.slice(0, 100) + '...');
                  setShowAddNoteModal(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-secondary/25 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>New Annotation for Ch. {activeChapterIndex + 1}</span>
              </button>

              {/* Annotations List */}
              <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {annotations.length === 0 ? (
                  <div className="py-8 text-center text-xs text-on-surface-variant">
                    No margin annotations recorded yet. Select text or click &quot;Add Annotation&quot;.
                  </div>
                ) : (
                  annotations.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 text-xs space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            ann.tag === 'insight'
                              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                              : ann.tag === 'hypothesis'
                              ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                              : ann.tag === 'critique'
                              ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                              : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {ann.tag}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-mono">
                          Ch. {ann.chapterIndex + 1}
                        </span>
                      </div>

                      {ann.textSelection && (
                        <blockquote className="pl-2 border-l-2 border-secondary/50 text-[11px] text-on-surface-variant italic line-clamp-2">
                          &quot;{ann.textSelection}&quot;
                        </blockquote>
                      )}

                      <p className="text-on-surface text-xs leading-relaxed">
                        {ann.note}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-on-surface-variant pt-1 border-t border-outline-variant/10">
                        <span>{ann.timestamp}</span>
                        <button
                          onClick={() => setAnnotations((prev) => prev.filter((a) => a.id !== ann.id))}
                          className="text-error hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Export Notes Button */}
            <div className="pt-3 border-t border-outline-variant/20">
              <button
                onClick={() => {
                  const exportContent = `# Scholarly Reading Annotations & Margin Notes\nBook: ${book.title}\nAuthor: ${book.author}\nDate: ${new Date().toLocaleDateString()}\n\n` +
                    annotations.map(
                      (a, i) =>
                        `## Note ${i + 1} [${a.tag.toUpperCase()}] - Chapter ${a.chapterIndex + 1}: ${a.chapterTitle}\n> "${a.textSelection}"\n\n**Annotation:** ${a.note}\n*Recorded on ${a.timestamp}*\n`
                    ).join('\n---\n\n');
                  const blob = new Blob([exportContent], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${book.title.replace(/\s+/g, '_')}_Research_Annotations.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-secondary border border-secondary/30 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export Notes (.MD / Markdown)</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Add Note Modal Overlay */}
      {showAddNoteModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAddNoteModal(false)}
        >
          <div
            className="bg-surface w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4 font-sans text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">stylus_note</span>
                <h3 className="font-bold text-sm text-on-surface">
                  Add Research Margin Annotation
                </h3>
              </div>
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">
                Excerpted Text / Quotation:
              </label>
              <textarea
                rows={2}
                value={newNoteQuote}
                onChange={(e) => setNewNoteQuote(e.target.value)}
                placeholder="Text excerpt from chapter..."
                className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface italic resize-none"
              />
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">
                Scholarly Commentary / Research Note:
              </label>
              <textarea
                rows={3}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Type your hypothesis, critique, or cross-reference citation..."
                className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface resize-none focus:border-secondary focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Annotation Category:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'insight', label: 'Insight' },
                  { id: 'hypothesis', label: 'Hypothesis' },
                  { id: 'critique', label: 'Critique' },
                  { id: 'citation', label: 'Citation' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setNewNoteTag(t.id as any)}
                    className={`py-1.5 rounded-lg border text-center font-bold text-[11px] transition-all cursor-pointer ${
                      newNoteTag === t.id
                        ? 'border-secondary bg-secondary/15 text-secondary'
                        : 'border-outline-variant/20 text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!newNoteText.trim()}
                onClick={() => {
                  const newEntry: ReaderAnnotation = {
                    id: `ann-${Date.now()}`,
                    chapterIndex: activeChapterIndex,
                    chapterTitle: currentChapter?.title || `Chapter ${activeChapterIndex + 1}`,
                    textSelection: newNoteQuote.trim(),
                    note: newNoteText.trim(),
                    tag: newNoteTag,
                    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  };
                  setAnnotations((prev) => [newEntry, ...prev]);
                  setNewNoteText('');
                  setNewNoteQuote('');
                  setShowAddNoteModal(false);
                  setShowNotesDrawer(true);
                }}
                className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs disabled:opacity-40 cursor-pointer shadow-xs"
              >
                Save Annotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reader Footer Bar */}
      <footer className="h-12 px-4 bg-surface-container-lowest/95 backdrop-blur border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant z-20">
        <span className="truncate font-sans">
          Reading: {book.title} • {progressPercent}% completed
        </span>
        <span className="font-semibold text-secondary flex items-center gap-1 font-sans">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>Wirtuu Kompiitaraa Ilillii Press</span>
        </span>
      </footer>
    </div>
  );
};
