import React, { useState, useMemo } from 'react';
import { Language, ManuscriptDiagnosticResult, ServiceCategory } from '../types';
import { SAMPLE_MANUSCRIPTS } from '../data/academicToolsData';

interface ManuscriptDiagnosticModalProps {
  onClose: () => void;
  onSubmitForEditing?: (text: string, estimatedPages: number, category: ServiceCategory) => void;
}

export const ManuscriptDiagnosticModal: React.FC<ManuscriptDiagnosticModalProps> = ({
  onClose,
  onSubmitForEditing,
}) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_MANUSCRIPTS[0].text);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_MANUSCRIPTS[0].id);

  // Diagnostic Audit Algorithm
  const diagnostic: ManuscriptDiagnosticResult = useMemo(() => {
    const text = inputText.trim();
    if (!text) {
      return {
        wordCount: 0,
        charCount: 0,
        estimatedPages: 0,
        estimatedSlides: 0,
        readingTimeMinutes: 0,
        dominantLanguage: 'English',
        scriptBreakdown: { englishPct: 100, oromoPct: 0, amharicPct: 0, arabicPct: 0 },
        citationStyleDetected: 'None Detected',
        citationCount: 0,
        hasRTLOrDiacritics: false,
        readabilityScore: 0,
        readabilityGrade: 'N/A',
        recommendations: ['Paste your manuscript draft to begin diagnostic analysis.'],
      };
    }

    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const charCount = text.length;
    const estimatedPages = Math.max(1, Math.ceil(wordCount / 250));
    const estimatedSlides = Math.max(1, Math.ceil(wordCount / 55));
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

    // Script Analysis
    const geEzMatches = text.match(/[\u1200-\u137F]/g) || [];
    const arabicMatches = text.match(/[\u0600-\u06FF]/g) || [];
    const latinMatches = text.match(/[a-zA-Z]/g) || [];
    
    // Check for Afaan Oromoo indicators (hudhaa/apostrophes between vowels, double vowels)
    const oromoIndicators = text.match(/(aa|ee|ii|oo|uu|dh|ny|ph|sh|ch|[aeiou]'[aeiou])/gi) || [];
    const hasOromoNuance = oromoIndicators.length > 5;

    const totalScriptChars = (geEzMatches.length + arabicMatches.length + latinMatches.length) || 1;
    let amharicPct = Math.round((geEzMatches.length / totalScriptChars) * 100);
    let arabicPct = Math.round((arabicMatches.length / totalScriptChars) * 100);
    let latinPct = 100 - (amharicPct + arabicPct);

    let oromoPct = 0;
    let englishPct = latinPct;
    if (hasOromoNuance && latinPct > 30) {
      oromoPct = Math.round(latinPct * 0.7);
      englishPct = latinPct - oromoPct;
    }

    // Dominant Language
    let dominantLanguage = 'English (Scholarly Latin)';
    if (arabicPct > 40) dominantLanguage = 'Arabic (العربية / Tajweed)';
    else if (amharicPct > 40) dominantLanguage = 'Amharic (አማርኛ Fidel)';
    else if (oromoPct > 30) dominantLanguage = 'Afaan Oromoo (Qubee)';

    // Citation Style
    const apaMatches = text.match(/\([A-Z][a-zA-Z]+(?:\s*&|\s+and)?\s*[A-Z]?[a-zA-Z]*,?\s*\d{4}[a-z]?\)/g) || [];
    const ieeeMatches = text.match(/\[\d+\]/g) || [];
    const harvardMatches = text.match(/[A-Z][a-zA-Z]+\s+\(\d{4}\)/g) || [];

    let citationStyleDetected: 'APA' | 'IEEE' | 'Harvard' | 'None Detected' = 'None Detected';
    let citationCount = 0;
    if (apaMatches.length > 0) {
      citationStyleDetected = 'APA';
      citationCount = apaMatches.length;
    } else if (ieeeMatches.length > 0) {
      citationStyleDetected = 'IEEE';
      citationCount = ieeeMatches.length;
    } else if (harvardMatches.length > 0) {
      citationStyleDetected = 'Harvard';
      citationCount = harvardMatches.length;
    }

    // Has RTL or Diacritics
    const hasRTLOrDiacritics = arabicMatches.length > 0 || /[\u064B-\u065F]/.test(text);

    // Readability & Recommendations
    const sentences = text.split(/[.!?؛。]+/).filter(Boolean);
    const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 15;
    
    let readabilityScore = 85;
    let readabilityGrade = 'Doctoral / Post-Graduate Level';
    if (avgWordsPerSentence > 28) {
      readabilityScore = 78;
      readabilityGrade = 'Dense Academic Monograph';
    } else if (avgWordsPerSentence < 14) {
      readabilityScore = 92;
      readabilityGrade = 'Accessible Scholarly Paper';
    }

    const recs: string[] = [];
    if (citationStyleDetected !== 'None Detected') {
      recs.push(`Identified ${citationCount} ${citationStyleDetected}-style in-text citation(s). Our editors will verify all bibliography cross-references.`);
    } else {
      recs.push('No standard citations detected. Ensure in-text references follow APA 7th or IEEE guidelines before formal defense.');
    }

    if (arabicMatches.length > 0) {
      recs.push('Arabic right-to-left glyphs detected. We will apply specialized OpenType diacritic anchor kerning (Amiri/Lateef typefaces).');
    }
    if (geEzMatches.length > 0) {
      recs.push("Amharic Ge'ez Fidel text detected. Standardized Ethiopic word division (፡) and punctuation (።) will be validated.");
    }
    if (oromoPct > 20) {
      recs.push("Afaan Oromoo text detected. Verification of Qubee apostrophes ('hudhaa') and vowel length harmony will be prioritized.");
    }
    if (avgWordsPerSentence > 25) {
      recs.push('Consider breaking complex compound sentences into concise declarative propositions for thesis defense clarity.');
    }
    if (wordCount > 1500) {
      recs.push(`Manuscript volume (${wordCount} words) exceeds standard article length; recommend multi-chapter hierarchical structuring.`);
    }

    return {
      wordCount,
      charCount,
      estimatedPages,
      estimatedSlides,
      readingTimeMinutes,
      dominantLanguage,
      scriptBreakdown: { englishPct, oromoPct, amharicPct, arabicPct },
      citationStyleDetected,
      citationCount,
      hasRTLOrDiacritics,
      readabilityScore,
      readabilityGrade,
      recommendations: recs,
    };
  }, [inputText]);

  const handleSelectSample = (sample: (typeof SAMPLE_MANUSCRIPTS)[0]) => {
    setSelectedSampleId(sample.id);
    setInputText(sample.text);
  };

  const handleProceedToRequest = () => {
    if (!onSubmitForEditing) return;
    let cat: ServiceCategory = 'ppt';
    if (diagnostic.dominantLanguage.includes('Arabic')) cat = 'arabic_book';
    else if (diagnostic.dominantLanguage.includes('Oromoo')) cat = 'oromoo_book';
    else if (diagnostic.dominantLanguage.includes('Amharic')) cat = 'amharic_book';
    else if (diagnostic.estimatedSlides > 15) cat = 'ppt';
    else cat = 'english_book';

    onSubmitForEditing(inputText, diagnostic.estimatedPages, cat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary/15 text-tertiary flex items-center justify-center border border-tertiary/30">
              <span className="material-symbols-outlined text-[24px]">spellcheck</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span>Manuscript Pre-Flight Quality & Diagnostic Audit</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-bold">
                  Automated Linguistic Engine
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant">
                Analyze academic manuscripts for volume, citations, 4-language script integrity & defense readiness
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Sample Preset Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                Load Academic Sample Preset
              </label>
              <span className="text-[11px] text-on-surface-variant">
                Or paste your own manuscript text below
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {SAMPLE_MANUSCRIPTS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2.5 rounded-xl text-left text-xs transition-all border cursor-pointer truncate ${
                    selectedSampleId === sample.id
                      ? 'bg-secondary/15 border-secondary text-on-surface font-bold shadow-xs'
                      : 'bg-surface-container-lowest border-outline-variant/20 text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      {sample.language === 'ar' ? 'translate' : sample.language === 'or' ? 'menu_book' : sample.language === 'am' ? 'history_edu' : 'school'}
                    </span>
                    <span className="truncate font-semibold">{sample.title.split(':')[0]}</span>
                  </div>
                  <div className="text-[10px] opacity-75 truncate">{sample.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Text Area & Live Diagnostics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Input Text Column */}
            <div className="lg:col-span-7 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-on-surface">
                <span>Manuscript Draft Input</span>
                <span className="font-mono text-secondary">
                  {diagnostic.wordCount.toLocaleString()} Words • {diagnostic.charCount.toLocaleString()} Chars
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setSelectedSampleId('');
                }}
                rows={14}
                dir={diagnostic.hasRTLOrDiacritics && diagnostic.scriptBreakdown.arabicPct > 40 ? 'rtl' : 'ltr'}
                placeholder="Paste your thesis abstract, book chapter, or slide content here..."
                className="w-full p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono text-on-surface focus:outline-hidden focus:border-secondary transition-all resize-y leading-relaxed"
              />
              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span>Supports English, Afaan Oromoo, Amharic Fidel, and Arabic RTL</span>
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="text-error hover:underline cursor-pointer"
                >
                  Clear Draft
                </button>
              </div>
            </div>

            {/* Diagnostic Metrics Scorecard Column */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Readiness Score Badge */}
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    Editorial Readiness Score
                  </span>
                  <div className="text-2xl font-black text-secondary flex items-baseline gap-1 mt-0.5">
                    <span>{diagnostic.readabilityScore}</span>
                    <span className="text-xs text-on-surface-variant font-normal">/ 100</span>
                  </div>
                  <span className="text-xs font-medium text-on-surface">
                    {diagnostic.readabilityGrade}
                  </span>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-secondary/30 border-t-secondary flex items-center justify-center text-secondary font-bold text-sm">
                  {diagnostic.readabilityScore}%
                </div>
              </div>

              {/* Volume Benchmarks */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                  <span className="text-[10px] text-on-surface-variant block">Typeset Pages</span>
                  <span className="text-base font-extrabold text-on-surface font-mono">
                    ~{diagnostic.estimatedPages}
                  </span>
                  <span className="text-[9px] text-on-surface-variant block">@ 250 w/p</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                  <span className="text-[10px] text-on-surface-variant block">Defense Slides</span>
                  <span className="text-base font-extrabold text-secondary font-mono">
                    ~{diagnostic.estimatedSlides}
                  </span>
                  <span className="text-[9px] text-on-surface-variant block">@ 55 w/slide</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                  <span className="text-[10px] text-on-surface-variant block">Reading Duration</span>
                  <span className="text-base font-extrabold text-tertiary font-mono">
                    {diagnostic.readingTimeMinutes} min
                  </span>
                  <span className="text-[9px] text-on-surface-variant block">Paced vocal</span>
                </div>
              </div>

              {/* Script Distribution Analysis */}
              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-on-surface">
                  <span>Language & Script Composition</span>
                  <span className="text-secondary">{diagnostic.dominantLanguage}</span>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full rounded-full bg-surface-container-highest overflow-hidden flex">
                  {diagnostic.scriptBreakdown.englishPct > 0 && (
                    <div
                      style={{ width: `${diagnostic.scriptBreakdown.englishPct}%` }}
                      className="bg-blue-600 h-full"
                      title={`English: ${diagnostic.scriptBreakdown.englishPct}%`}
                    />
                  )}
                  {diagnostic.scriptBreakdown.oromoPct > 0 && (
                    <div
                      style={{ width: `${diagnostic.scriptBreakdown.oromoPct}%` }}
                      className="bg-emerald-600 h-full"
                      title={`Afaan Oromoo: ${diagnostic.scriptBreakdown.oromoPct}%`}
                    />
                  )}
                  {diagnostic.scriptBreakdown.amharicPct > 0 && (
                    <div
                      style={{ width: `${diagnostic.scriptBreakdown.amharicPct}%` }}
                      className="bg-amber-600 h-full"
                      title={`Amharic: ${diagnostic.scriptBreakdown.amharicPct}%`}
                    />
                  )}
                  {diagnostic.scriptBreakdown.arabicPct > 0 && (
                    <div
                      style={{ width: `${diagnostic.scriptBreakdown.arabicPct}%` }}
                      className="bg-purple-600 h-full"
                      title={`Arabic: ${diagnostic.scriptBreakdown.arabicPct}%`}
                    />
                  )}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-1 text-[11px] text-on-surface-variant pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>English ({diagnostic.scriptBreakdown.englishPct}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Oromoo ({diagnostic.scriptBreakdown.oromoPct}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    <span>Amharic ({diagnostic.scriptBreakdown.amharicPct}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span>Arabic ({diagnostic.scriptBreakdown.arabicPct}%)</span>
                  </div>
                </div>
              </div>

              {/* Citation & Integrity Badge */}
              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-1.5 text-xs">
                <div className="flex justify-between items-center font-bold text-on-surface">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">format_quote</span>
                    <span>Citation Engine</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-mono font-semibold">
                    {diagnostic.citationStyleDetected} ({diagnostic.citationCount} found)
                  </span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant text-[11px]">
                  <span>RTL Diacritic / Tashkeel Anchor:</span>
                  <span className={diagnostic.hasRTLOrDiacritics ? 'text-emerald-600 font-bold' : 'text-on-surface-variant'}>
                    {diagnostic.hasRTLOrDiacritics ? 'Active / Detected' : 'None Required'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Actionable Editorial Recommendations */}
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-2">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">tips_and_updates</span>
              <span>Editorial Recommendations from Mr. Feysal Hussein</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-on-surface-variant">
              {diagnostic.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[15px] text-secondary shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-surface-container border-t border-outline-variant/20 flex items-center justify-between">
          <div className="text-xs text-on-surface-variant">
            Analyzed via Haramaya University Academic Standard Metrics
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface font-bold text-xs cursor-pointer"
            >
              Close
            </button>
            {onSubmitForEditing && (
              <button
                onClick={handleProceedToRequest}
                className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-2 shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Submit with Diagnostic Report ({diagnostic.estimatedPages} Pages)</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
