import React, { useState } from 'react';
import { Book, Course } from '../types';

interface CitationExportModalProps {
  books: Book[];
  courses?: Course[];
  initialBook?: Book | null;
  onClose: () => void;
}

export const CitationExportModal: React.FC<CitationExportModalProps> = ({
  books,
  courses = [],
  initialBook,
  onClose,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<string>(
    initialBook?.id || books[0]?.id || ''
  );
  const [citationFormat, setCitationFormat] = useState<
    'apa7' | 'chicago' | 'harvard' | 'ieee' | 'mla9' | 'bibtex'
  >('apa7');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedBook = books.find((b) => b.id === selectedBookId) || books[0];

  if (!selectedBook) return null;

  // Formatting utilities
  const currentYear = selectedBook.publishedYear || '2024';
  const author = selectedBook.author || 'Hussein, F.';
  const title = selectedBook.title;
  const publisher = selectedBook.affiliation || 'Haramaya University Digital Publishing Press';
  const city = 'Dire Dawa, Ethiopia';
  const pages = selectedBook.pages ? `pp. 1–${selectedBook.pages}` : 'pp. 1–180';
  const doi = `https://doi.org/10.20372/hu.wki.${selectedBook.id.replace(/[^a-zA-Z0-9]/g, '')}`;

  // Formatter mapping
  const generateCitation = (): string => {
    switch (citationFormat) {
      case 'apa7':
        return `${author} (${currentYear}). ${title}. ${publisher}. ${doi}`;
      case 'chicago':
        return `${author}. ${title}. ${city}: ${publisher}, ${currentYear}.`;
      case 'harvard':
        return `${author}, ${currentYear}. ${title}. ${city}: ${publisher}, ${pages}.`;
      case 'ieee':
        return `[1] ${author}, ${title}. ${city}: ${publisher}, ${currentYear}, ${pages}.`;
      case 'mla9':
        return `${author}. ${title}. ${publisher}, ${currentYear}.`;
      case 'bibtex':
        return `@book{wki_${selectedBook.id.replace(/[^a-zA-Z0-9_]/g, '_')},
  author    = {${author}},
  title     = {${title}},
  publisher = {${publisher}},
  address   = {${city}},
  year      = {${currentYear}},
  pages     = {${selectedBook.pages || 180}},
  doi       = {${doi}},
  url       = {https://wki-press.haramaya.edu.et/books/${selectedBook.id}}
}`;
      default:
        return `${author} (${currentYear}). ${title}. ${publisher}.`;
    }
  };

  const citationText = generateCitation();

  const handleCopy = () => {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadBibTeX = () => {
    const blob = new Blob([citationText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedBook.id}_citation.${citationFormat === 'bibtex' ? 'bib' : 'txt'}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl border border-outline-variant/30 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-[11px] font-bold uppercase tracking-wider">
                Academic Citation Generator
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                APA 7 • BibTeX • IEEE
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Cite Haramaya University Monographs & Works
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Export standardized bibliographic references for your thesis, journal papers, or LaTeX documents.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Publication Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface block">
            Select Publication or Course:
          </label>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-xs sm:text-sm font-medium text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none cursor-pointer"
          >
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} — {b.author} ({b.langTag})
              </option>
            ))}
          </select>
        </div>

        {/* Format Selector Pills */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface block">
            Citation Style / Format:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { id: 'apa7', label: 'APA 7th' },
              { id: 'chicago', label: 'Chicago 17' },
              { id: 'harvard', label: 'Harvard' },
              { id: 'ieee', label: 'IEEE' },
              { id: 'mla9', label: 'MLA 9th' },
              { id: 'bibtex', label: 'BibTeX' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setCitationFormat(fmt.id as any)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                  citationFormat === fmt.id
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/20'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Formatted Citation Output Box */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2 relative">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-mono">
            <span className="font-bold text-secondary uppercase tracking-wider">
              {citationFormat.toUpperCase()} Formatted Reference
            </span>
            <span>{citationFormat === 'bibtex' ? 'LaTeX Raw Entry' : 'Rich Text'}</span>
          </div>

          <pre
            className={`font-mono text-xs sm:text-sm text-on-surface whitespace-pre-wrap leading-relaxed overflow-x-auto p-3 rounded-xl bg-surface-container/60 border border-outline-variant/20 ${
              citationFormat === 'bibtex' ? 'text-blue-700 dark:text-blue-300' : ''
            }`}
          >
            {citationText}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
            <span>Accredited Haramaya University Digital Object Identifier (DOI) indexed</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadBibTeX}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-outline-variant/30 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Download .{citationFormat === 'bibtex' ? 'bib' : 'txt'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-secondary hover:brightness-105 text-on-secondary font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Reference'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
