import React, { useState } from 'react';
import { INITIAL_FAQS, OFFICIAL_BRAND } from '../data/initialData';

interface FAQSectionProps {
  onRequestService?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onRequestService }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Publishing', 'PowerPoint', 'Languages', 'Translation', 'Arabic & RTL', 'Portal & Tracking', 'E-Learning'];

  const filteredFaqs = INITIAL_FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="px-gutter-mobile py-space-lg bg-surface" id="faq">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
            Frequently Asked Questions
          </span>
          <h2 className="font-headline-sm sm:font-headline-md text-xl sm:text-2xl text-on-surface font-bold">
            Everything You Need to Know About Our Publishing Desk
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl mx-auto">
            Clear answers on book authoring, doctoral slide design, RTL Arabic typesetting, and manuscript turnaround times.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 text-center text-xs text-on-surface-variant">
              No matching questions found. Feel free to contact Mr. Feysal Hussein directly via Telegram ({OFFICIAL_BRAND.telegramHandle}).
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className="rounded-xl bg-surface-container-lowest border border-outline-variant/20 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-surface-container/40 transition-colors cursor-pointer"
                  >
                    <span className="font-title-sm text-xs sm:text-sm font-bold text-on-surface flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-secondary/15 text-secondary flex items-center justify-center text-xs font-bold shrink-0">
                        Q{index + 1}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <span
                      className={`material-symbols-outlined text-secondary text-[20px] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10 bg-surface-container-lowest animate-in fade-in duration-150">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Call to Action Bar */}
        <div className="p-5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-title-sm text-title-sm font-bold text-on-surface">
              Have a custom academic inquiry or specific deadline?
            </h4>
            <p className="text-xs text-on-surface-variant">
              Mr. Feysal Hussein answers project briefs within 2 hours.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={OFFICIAL_BRAND.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-highest text-xs font-bold text-on-surface flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-secondary text-[16px]">send</span>
              <span>Telegram Desk</span>
            </a>
            {onRequestService && (
              <button
                onClick={onRequestService}
                className="px-4 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                Submit Project Brief
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
