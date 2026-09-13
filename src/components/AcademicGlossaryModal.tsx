import React, { useState, useMemo } from 'react';
import { AcademicGlossaryTerm, Language } from '../types';
import { ACADEMIC_GLOSSARY_TERMS } from '../data/academicToolsData';
import { speakAcademicTerm } from '../utils/speechUtils';

interface AcademicGlossaryModalProps {
  onClose: () => void;
  onRequestPublishing?: () => void;
}

export const AcademicGlossaryModal: React.FC<AcademicGlossaryModalProps> = ({
  onClose,
  onRequestPublishing,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);
  const [activeSpeaking, setActiveSpeaking] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'research', label: 'Research & Methodology' },
    { id: 'publishing', label: 'Publishing & Typesetting' },
    { id: 'computing', label: 'Computing & Defense' },
    { id: 'islamic_arabic', label: 'Islamic & Arabic Studies' },
  ];

  const filteredTerms = useMemo(() => {
    return ACADEMIC_GLOSSARY_TERMS.filter((term) => {
      const matchesCat = selectedCategory === 'all' || term.category === selectedCategory;
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        term.en.toLowerCase().includes(q) ||
        term.or.toLowerCase().includes(q) ||
        term.am.toLowerCase().includes(q) ||
        term.ar.toLowerCase().includes(q) ||
        term.definition.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTerm(label);
    setTimeout(() => setCopiedTerm(null), 2500);
  };

  const handleSpeak = async (text: string, lang: 'en' | 'or' | 'am' | 'ar', id: string) => {
    setActiveSpeaking(id);
    await speakAcademicTerm(text, lang);
    setActiveSpeaking(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-[24px]">translate</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span>4-Way Multilingual Academic Glossary</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-bold">
                  Haramaya Scholarly Lexicon
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant">
                Harmonized terminology across English • Afaan Oromoo • አማርኛ • العربية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-4 bg-surface-container-lowest border-b border-outline-variant/20 space-y-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Search terminology in English, Afaan Oromoo, Amharic, or Arabic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs font-medium text-on-surface focus:outline-hidden focus:border-secondary transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Glossary Terms List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {copiedTerm && (
            <div className="p-2.5 rounded-xl bg-secondary/15 border border-secondary text-secondary text-xs font-bold text-center animate-in fade-in">
              Copied "{copiedTerm}" to clipboard!
            </div>
          )}

          {filteredTerms.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant space-y-2">
              <span className="material-symbols-outlined text-[36px] opacity-40">menu_book</span>
              <p className="text-sm font-semibold">No academic terms matched your search.</p>
              <p className="text-xs opacity-75">Try searching with a different keyword or switch categories.</p>
            </div>
          ) : (
            filteredTerms.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs hover:border-secondary/40 transition-all space-y-3"
              >
                {/* 4 Languages Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {/* English */}
                  <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/15 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                      English (Academic)
                    </span>
                    <div className="font-bold text-on-surface text-sm mt-0.5">{item.en}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleSpeak(item.en, 'en', `en-${item.id}`)}
                        className={`text-[10px] flex items-center gap-1 cursor-pointer transition-colors ${
                          activeSpeaking === `en-${item.id}`
                            ? 'text-blue-600 font-bold'
                            : 'text-on-surface-variant hover:text-blue-600'
                        }`}
                        title="Pronounce in English"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {activeSpeaking === `en-${item.id}` ? 'volume_up' : 'volume_down'}
                        </span>
                        <span>Listen</span>
                      </button>
                      <span className="text-[10px] text-outline">•</span>
                      <button
                        onClick={() => handleCopy(item.en, item.en)}
                        className="text-[10px] text-on-surface-variant hover:text-secondary flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[12px]">content_copy</span>
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Afaan Oromoo */}
                  <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/15 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                      Afaan Oromoo (Qubee)
                    </span>
                    <div className="font-bold text-on-surface text-sm mt-0.5">{item.or}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleSpeak(item.or, 'or', `or-${item.id}`)}
                        className={`text-[10px] flex items-center gap-1 cursor-pointer transition-colors ${
                          activeSpeaking === `or-${item.id}`
                            ? 'text-emerald-600 font-bold'
                            : 'text-on-surface-variant hover:text-emerald-600'
                        }`}
                        title="Pronounce in Afaan Oromoo"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {activeSpeaking === `or-${item.id}` ? 'volume_up' : 'volume_down'}
                        </span>
                        <span>Listen</span>
                      </button>
                      <span className="text-[10px] text-outline">•</span>
                      <button
                        onClick={() => handleCopy(item.or, item.or)}
                        className="text-[10px] text-on-surface-variant hover:text-secondary flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[12px]">content_copy</span>
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Amharic */}
                  <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/15 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                      Amharic (አማርኛ Fidel)
                    </span>
                    <div className="font-bold text-on-surface text-sm mt-0.5">{item.am}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleSpeak(item.am, 'am', `am-${item.id}`)}
                        className={`text-[10px] flex items-center gap-1 cursor-pointer transition-colors ${
                          activeSpeaking === `am-${item.id}`
                            ? 'text-amber-600 font-bold'
                            : 'text-on-surface-variant hover:text-amber-600'
                        }`}
                        title="Pronounce in Amharic"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {activeSpeaking === `am-${item.id}` ? 'volume_up' : 'volume_down'}
                        </span>
                        <span>Listen</span>
                      </button>
                      <span className="text-[10px] text-outline">•</span>
                      <button
                        onClick={() => handleCopy(item.am, item.am)}
                        className="text-[10px] text-on-surface-variant hover:text-secondary flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[12px]">content_copy</span>
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Arabic */}
                  <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/15 flex flex-col justify-between" dir="rtl">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block text-right">
                      Arabic (العربية / تخصص)
                    </span>
                    <div className="font-bold text-on-surface text-base font-serif mt-0.5 text-right">{item.ar}</div>
                    <div className="flex items-center gap-2 mt-1 justify-end">
                      <button
                        onClick={() => handleSpeak(item.ar, 'ar', `ar-${item.id}`)}
                        className={`text-[10px] flex items-center gap-1 cursor-pointer transition-colors ${
                          activeSpeaking === `ar-${item.id}`
                            ? 'text-purple-600 font-bold'
                            : 'text-on-surface-variant hover:text-purple-600'
                        }`}
                        title="Pronounce in Arabic"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {activeSpeaking === `ar-${item.id}` ? 'volume_up' : 'volume_down'}
                        </span>
                        <span>استماع</span>
                      </button>
                      <span className="text-[10px] text-outline">•</span>
                      <button
                        onClick={() => handleCopy(item.ar, item.ar)}
                        className="text-[10px] text-on-surface-variant hover:text-secondary flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[12px]">content_copy</span>
                        <span>نسخ</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Definition & Academic Context */}
                <div className="pt-1 text-xs space-y-1">
                  <p className="text-on-surface-variant leading-relaxed">
                    <strong className="text-on-surface font-semibold">Scholarly Definition:</strong> {item.definition}
                  </p>
                  {item.example && (
                    <p className="text-on-surface-variant/80 italic text-[11px]">
                      <strong className="font-semibold text-secondary not-italic">Example Context:</strong> "{item.example}"
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 bg-surface-container border-t border-outline-variant/20 flex items-center justify-between">
          <div className="text-xs text-on-surface-variant">
            Showing {filteredTerms.length} harmonized academic terms • Compiled by Director Mr. Feysal Hussein
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface font-bold text-xs cursor-pointer"
            >
              Close
            </button>
            {onRequestPublishing && (
              <button
                onClick={() => {
                  onClose();
                  onRequestPublishing();
                }}
                className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs hover:brightness-105"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span>Request Publishing Service</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
