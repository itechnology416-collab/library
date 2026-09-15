import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  BookOpen,
  Headphones,
  Bookmark,
  Search,
  Sun,
  Moon,
  Type,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';
import { saveReadingProgress, getReadingProgress } from '../../lib/offlineCache';

interface InteractiveReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  permission?: any;
}

export const InteractiveReaderModal: React.FC<InteractiveReaderModalProps> = ({
  isOpen,
  onClose,
  product,
  permission,
}) => {
  if (!isOpen || !product) return null;

  const isAudio = product.productType?.toLowerCase().includes('audio') || product.fileFormat?.toLowerCase() === 'mp3';

  // Reading states
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = product.previewData?.totalPages || 48;
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [themeMode, setThemeMode] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); // 0 to 100
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [activeChapter, setActiveChapter] = useState(0);

  // Load saved progress
  useEffect(() => {
    if (product?.id) {
      const saved = getReadingProgress(product.id);
      if (saved) {
        setCurrentPage(saved.currentPage || 1);
        setBookmarks(saved.bookmarks || []);
        if (saved.audioPlaybackPosition) {
          setAudioProgress(saved.audioPlaybackPosition);
        }
      }
    }
  }, [product?.id]);

  // Save progress on change
  useEffect(() => {
    if (product?.id) {
      saveReadingProgress({
        productId: product.id,
        currentPage,
        totalPages,
        lastReadAt: new Date().toISOString(),
        bookmarks,
        audioPlaybackPosition: audioProgress,
      });
    }
  }, [currentPage, bookmarks, audioProgress, product?.id, totalPages]);

  // Audio simulation timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5 * audioSpeed;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, audioSpeed]);

  const toggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter((p) => p !== currentPage));
    } else {
      setBookmarks([...bookmarks, currentPage].sort((a, b) => a - b));
    }
  };

  const sampleChapters = [
    { title: 'Chapter 1: Introduction & Institutional Context', time: '00:00', duration: '12:30' },
    { title: 'Chapter 2: Core Methodology & Field Research', time: '12:30', duration: '18:45' },
    { title: 'Chapter 3: Afaan Oromoo Terminology Framework', time: '31:15', duration: '15:20' },
    { title: 'Chapter 4: Implementation & Case Studies', time: '46:35', duration: '22:10' },
  ];

  const sampleTextContent = product.previewData?.excerpt || product.description || `
    WIRTUUKOMPIITARAA ILILLII — HARAMAYA UNIVERSITY PRESS
    ACADEMIC PUBLISHING & DIGITAL PRESS RELEASE

    Section 1: Executive Summary
    This academic digital release represents strategic scholarship from Haramaya University Press. 
    The curriculum integrates rigorous methodology with localized contextual frameworks designed for higher education students and faculty researchers.

    Section 2: Key Theoretical Foundations
    Modern digital transformation in higher education requires robust open access frameworks combined with localized language assets. 
    Afaan Oromoo technical terminology and computer science concepts are systematically cataloged to facilitate technical literacy and research publication.

    Section 3: Practical Implementation in Ethiopian Universities
    By deploying server-authoritative digital rights management and responsive mobile interfaces, educational institutions can securely distribute high-grade peer-reviewed literature across regional campuses while supporting low-bandwidth offline access.
  `;

  const getThemeBg = () => {
    if (themeMode === 'light') return 'bg-amber-50/95 text-slate-900 border-amber-200';
    if (themeMode === 'sepia') return 'bg-[#f8f1e5] text-[#433422] border-[#e6d7c3]';
    return 'bg-slate-950 text-slate-100 border-slate-800';
  };

  const getFontSizeClass = () => {
    if (fontSize === 'sm') return 'text-xs leading-relaxed';
    if (fontSize === 'lg') return 'text-lg leading-relaxed';
    if (fontSize === 'xl') return 'text-xl leading-loose';
    return 'text-sm leading-relaxed';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4">
      <div
        className={`w-full max-w-5xl h-[92vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${getThemeBg()}`}
      >
        {/* Header Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-inherit bg-black/10 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold shrink-0">
              {isAudio ? <Headphones className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            </div>
            <div className="truncate">
              <h3 className="text-sm font-bold truncate">{product.title}</h3>
              <p className="text-[11px] opacity-70 truncate">
                {product.author} • {product.fileFormat} • Version {product.version || '1.0'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Theme selector */}
            {!isAudio && (
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-black/20 border border-inherit">
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`p-1.5 rounded ${themeMode === 'dark' ? 'bg-sky-600 text-white' : 'opacity-70 hover:opacity-100'}`}
                  title="Dark Mode"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setThemeMode('sepia')}
                  className={`p-1.5 rounded ${themeMode === 'sepia' ? 'bg-amber-700 text-white' : 'opacity-70 hover:opacity-100'}`}
                  title="Sepia Mode"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setThemeMode('light')}
                  className={`p-1.5 rounded ${themeMode === 'light' ? 'bg-amber-200 text-slate-900' : 'opacity-70 hover:opacity-100'}`}
                  title="Light Mode"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Font size picker */}
            {!isAudio && (
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-black/20 border border-inherit text-xs">
                {(['sm', 'base', 'lg', 'xl'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    className={`px-1.5 py-0.5 rounded font-serif ${fontSize === s ? 'bg-sky-600 text-white font-bold' : 'opacity-70 hover:opacity-100'}`}
                  >
                    A{s === 'sm' ? '-' : s === 'xl' ? '+' : ''}
                  </button>
                ))}
              </div>
            )}

            {/* Bookmark button */}
            {!isAudio && (
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-lg border transition ${
                  bookmarks.includes(currentPage)
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-black/20 border-inherit opacity-70 hover:opacity-100'
                }`}
                title="Bookmark Current Page"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-black/20 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-inherit transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isAudio ? (
            /* AUDIOBOOK INTERACTIVE PLAYER VIEW */
            <div className="max-w-3xl mx-auto space-y-6 py-4">
              {/* Album Cover & Animated Waveform */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-black/30 border border-inherit">
                <img
                  src={product.thumbnailUrl}
                  alt={product.title}
                  className="w-36 h-36 rounded-xl object-cover shadow-2xl border border-inherit shrink-0"
                />
                <div className="space-y-3 text-center sm:text-left flex-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    <Headphones className="w-3 h-3" />
                    <span>Afaan Oromoo Audio Masterclass</span>
                  </span>
                  <h2 className="text-xl font-bold">{product.title}</h2>
                  <p className="text-xs opacity-80">{product.author} • {product.authorAffiliation || 'Haramaya Press'}</p>

                  {/* Waveform visualizer bars */}
                  <div className="flex items-center justify-center sm:justify-start gap-1 h-8 pt-2">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isPlaying ? 'bg-sky-400 animate-pulse' : 'bg-slate-700'
                        }`}
                        style={{
                          height: isPlaying ? `${Math.max(20, Math.sin(i + audioProgress) * 100)}%` : '30%',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-2 p-4 rounded-xl bg-black/20 border border-inherit">
                <div className="flex items-center justify-between text-xs font-semibold opacity-80">
                  <span>
                    {Math.floor((audioProgress * 45 * 60) / 100 / 60)}:
                    {String(Math.floor(((audioProgress * 45 * 60) / 100) % 60)).padStart(2, '0')}
                  </span>
                  <span>45:00 Total</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioProgress}
                  onChange={(e) => setAudioProgress(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 py-2">
                <button
                  onClick={() => setAudioSpeed(audioSpeed === 2.0 ? 0.75 : audioSpeed + 0.25)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-black/30 border border-inherit hover:bg-black/50 transition"
                  title="Playback Speed"
                >
                  {audioSpeed}x Speed
                </button>

                <button
                  onClick={() => setAudioProgress((p) => Math.max(0, p - 5))}
                  className="p-3 rounded-full bg-black/30 border border-inherit hover:bg-black/50 transition"
                  title="Rewind 15s"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 rounded-full bg-sky-600 hover:bg-sky-500 text-white shadow-xl transition active:scale-95"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => setAudioProgress((p) => Math.min(100, p + 5))}
                  className="p-3 rounded-full bg-black/30 border border-inherit hover:bg-black/50 transition"
                  title="Forward 15s"
                >
                  <RotateCw className="w-5 h-5" />
                </button>

                <span className="text-xs opacity-70 font-mono hidden sm:inline">24-bit HD</span>
              </div>

              {/* Chapter Tracklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-70">Chapters & Outline</h4>
                <div className="space-y-1.5">
                  {sampleChapters.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveChapter(idx);
                        setAudioProgress((idx / sampleChapters.length) * 100);
                        setIsPlaying(true);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition ${
                        activeChapter === idx
                          ? 'bg-sky-500/20 border-sky-500/40 font-semibold text-sky-400'
                          : 'bg-black/20 border-inherit hover:bg-black/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-black/30 border border-inherit flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{ch.title}</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-70 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{ch.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* EBOOK / DOCUMENT TEXT READER VIEW */
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Document Banner info */}
              <div className="p-4 rounded-xl bg-black/20 border border-inherit flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>
                    Reading <strong>Page {currentPage}</strong> of {totalPages}
                  </span>
                </div>
                {bookmarks.length > 0 && (
                  <span className="opacity-70">
                    Bookmarked pages: {bookmarks.join(', ')}
                  </span>
                )}
              </div>

              {/* Reading Content */}
              <div className={`p-6 sm:p-8 rounded-2xl border border-inherit shadow-sm space-y-4 font-serif ${getFontSizeClass()}`}>
                <h2 className="text-xl font-bold font-sans tracking-tight mb-4 border-b border-inherit pb-2">
                  {product.title} — Section {currentPage}
                </h2>

                <p className="whitespace-pre-line leading-relaxed">
                  {sampleTextContent}
                </p>

                <p className="whitespace-pre-line leading-relaxed">
                  Additional Academic Excerpt (Haramaya Press Curriculum Archive):
                  The digital publishing engine enforces strict server-side permissions while allowing students and researchers to perform full-text searching, localized keyword annotations, and responsive reading across desktop and mobile devices.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isAudio && (
          <div className="px-4 py-3 border-t border-inherit bg-black/10 flex items-center justify-between shrink-0 text-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/20 border border-inherit hover:bg-black/40 disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <div className="flex items-center gap-2 font-mono">
              <span>
                Page {currentPage} / {totalPages}
              </span>
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/20 border border-inherit hover:bg-black/40 disabled:opacity-30 transition"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
