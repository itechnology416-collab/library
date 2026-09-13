import React from 'react';
import { Book } from '../types';

interface BookPreviewModalProps {
  book: Book;
  onClose: () => void;
  onReadOnline: () => void;
  onOpenCitation?: (book: Book) => void;
}

export const BookPreviewModal: React.FC<BookPreviewModalProps> = ({
  book,
  onClose,
  onReadOnline,
  onOpenCitation,
}) => {
  const isRtl = book.language === 'ar';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-150">
      <div
        className="bg-surface w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-outline-variant/30 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-outline-variant/20">
          <div className="flex gap-3">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-16 h-24 rounded-lg object-cover shadow-sm shrink-0"
            />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-secondary font-bold">
                {book.category}
              </span>
              <h3 className="font-title-md text-title-md font-bold text-on-surface mt-0.5">
                {book.title}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                {book.author} • {book.affiliation}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="font-bold text-on-surface block mb-1">Scholarly Abstract:</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {book.description}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-container space-y-1.5">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Language:</span>
              <span className="font-bold text-on-surface">{book.langTag}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Pages:</span>
              <span className="font-bold text-on-surface">{book.pages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Release Year:</span>
              <span className="font-bold text-on-surface">{book.publishedYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Access:</span>
              <span className="text-emerald-700 font-bold">Open Access Academic Press</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-on-surface block mb-1">
              Sample Chapter Preview ({book.chapters[0]?.title}):
            </span>
            <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 font-serif leading-relaxed line-clamp-4 text-on-surface">
              {book.chapters[0]?.content}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-outline-variant/20">
          <div>
            {onOpenCitation && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCitation(book);
                }}
                className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                title="Generate APA 7th / BibTeX Citation"
              >
                <span className="material-symbols-outlined text-[16px]">format_quote</span>
                <span>Cite Book</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onReadOnline();
              }}
              className="px-4 py-2 rounded-lg bg-secondary text-on-secondary text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">auto_stories</span>
              <span>Launch Full Reader</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
