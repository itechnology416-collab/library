import React, { useState } from 'react';
import { Book, Language } from '../types';
import { translations } from '../utils/translations';

interface BookLibraryProps {
  currentLanguage: Language;
  books: Book[];
  onOpenReader: (book: Book) => void;
  onOpenPreview: (book: Book) => void;
  onToggleBookmark: (bookId: string) => void;
  selectedLanguage?: string;
  onLanguageFilterChange?: (lang: string) => void;
}

export const BookLibrary: React.FC<BookLibraryProps> = ({
  currentLanguage,
  books,
  onOpenReader,
  onOpenPreview,
  onToggleBookmark,
  selectedLanguage,
  onLanguageFilterChange,
}) => {
  const [internalFilterLang, setInternalFilterLang] = useState<string>('all');
  const filterLang = selectedLanguage !== undefined ? selectedLanguage : internalFilterLang;
  const setFilter = (lang: string) => {
    if (onLanguageFilterChange) {
      onLanguageFilterChange(lang);
    } else {
      setInternalFilterLang(lang);
    }
  };
  const t = translations[currentLanguage];

  const filteredBooks = books.filter((b) => {
    if (filterLang === 'all') return true;
    return b.language === filterLang;
  });

  return (
    <section className="px-gutter-mobile py-space-md" id="books">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-space-sm">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
              University Catalog
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              {t.digitalLibraryTitle}
            </h2>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All (4)' },
              { id: 'en', label: 'English' },
              { id: 'or', label: 'Afaan Oromoo' },
              { id: 'am', label: 'አማርኛ' },
              { id: 'ar', label: 'العربية (RTL)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  filterLang === f.id
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Publications List / Cards */}
        <div className="space-y-space-md">
          {filteredBooks.map((book) => {
            const isRtl = book.language === 'ar';
            return (
              <div
                key={book.id}
                dir={isRtl ? 'rtl' : 'ltr'}
                className="p-space-sm rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex gap-space-sm hover:border-secondary/30 transition-all"
              >
                {/* Book Cover */}
                <div
                  className="w-24 h-36 rounded-lg overflow-hidden shrink-0 shadow-sm relative bg-surface-container cursor-pointer group"
                  onClick={() => onOpenReader(book)}
                  title="Click to Read Online"
                >
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={book.title}
                    src={book.coverUrl}
                  />
                  <span
                    className={`absolute top-1 ${
                      isRtl ? 'right-1' : 'left-1'
                    } px-1.5 py-0.5 rounded ${
                      book.language === 'ar'
                        ? 'bg-tertiary-container text-on-tertiary-container'
                        : book.language === 'or'
                        ? 'bg-secondary text-on-secondary'
                        : book.language === 'am'
                        ? 'bg-surface-variant text-on-surface'
                        : 'bg-primary/80 text-surface'
                    } text-[10px] font-bold font-label-sm shadow-xs`}
                  >
                    {book.langTag}
                  </span>
                </div>

                {/* Book Details */}
                <div
                  className={`flex flex-col justify-between flex-1 min-w-0 py-0.5 ${
                    isRtl ? 'text-right' : 'text-left'
                  }`}
                >
                  <div>
                    <span className="text-label-sm font-label-sm text-secondary font-semibold uppercase tracking-wider">
                      {book.category}
                    </span>
                    <h3
                      className="font-title-sm text-title-sm font-bold text-on-surface truncate mt-0.5 hover:text-secondary transition-colors cursor-pointer"
                      onClick={() => onOpenReader(book)}
                    >
                      {book.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                      {book.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
                      <span>{book.pages} Pages</span>
                      <span>•</span>
                      <span>{book.publishedYear}</span>
                      <span>•</span>
                      <span className="truncate">{book.author}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenPreview(book)}
                        className="px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface text-label-sm font-label-sm font-semibold hover:bg-surface-container-highest transition-colors cursor-pointer"
                      >
                        {t.preview}
                      </button>
                      <button
                        onClick={() => onOpenReader(book)}
                        className="px-2.5 py-1 rounded-lg bg-secondary text-on-secondary text-label-sm font-label-sm font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          auto_stories
                        </span>
                        <span>{t.readOnline}</span>
                      </button>
                    </div>

                    <button
                      aria-label="Bookmark Publication"
                      onClick={() => onToggleBookmark(book.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        book.bookmarked
                          ? 'text-secondary bg-secondary-fixed/50'
                          : 'text-on-surface-variant hover:text-secondary hover:bg-surface-container'
                      }`}
                      title={book.bookmarked ? 'Bookmarked' : 'Save to bookmarks'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {book.bookmarked ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
