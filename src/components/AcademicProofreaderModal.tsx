import React, { useState, useMemo } from 'react';
import { Language } from '../types';

interface ProofreadIssue {
  id: string;
  type: 'orthography' | 'punctuation' | 'citation' | 'style' | 'gemination';
  severity: 'error' | 'warning' | 'suggestion';
  title: string;
  explanation: string;
  originalText: string;
  suggestedText: string;
  position: { start: number; end: number };
}

interface AcademicProofreaderModalProps {
  onClose: () => void;
  onRequestHumanEditorial?: (text: string, lang: Language) => void;
}

const SAMPLE_TEXTS: Record<Language, string> = {
  en: `According to (Tadesse 2024), the multi-lingual publication paradigm in higher education institute has demonstrated substantial growth. However, many authors utilizes inconsistent citation formatting (e.g. ibid. without page numbers) and lacks proper oxford commas in lists. Therefore it is recommended to standardize the institutional typesetting framework for all postgraduate thesis submissions.`,
  or: `Qorannoon kun kan xiyyeeffatu sirna maxxansa barnoota olaanoo irratti dha. Haa ta'u malee, barreeffamoota hedduu keessatti dogongorri qubee akka hudhaa dhabamuu (fkn 'ta'u' bakka 'tau'), fi dubbachiiftuu dheeraa sirriitti barreessuu dhabuun ni mul'ata. Kanaafuu Yunivarsiitiin Haramayaa qajeelfama waraqaa qorannoo qopheessuu qaba.`,
  am: `ይህ ጥናት የሚያተኩረው በከፍተኛ ትምህርት ተቋማት ውስጥ ባለው የህትመት ጥራት ላይ ነው። ይሁን እንጂ በብዙ ፅሁፎች ውስጥ የፊደላት አጠቃቀም መምታታት (ለምሳሌ፡ በ 'ሀ'፣ 'ሐ' እና 'ኀ' መካከል ወይም በ 'ሰ' እና 'ሠ' መካከል) ይስተዋላል። በተጨማሪም የስርዓተ-ነጥብ አጠቃቀም (እንደ ፡ ፣ ፤ ።) ወጥ መሆን ይኖርበታል።`,
  ar: `تركز هذه الدراسة على معايير النشر الأكاديمي والطباعة في جامعة هرميا. ومع ذلك، هناك بعض الأخطاء الشائعة في استخدام الهمزات (مثل استخدام ا بدلا من أ أو إ) والخلط بين الهاء والتاء المربوطة، بالإضافة إلى التوثيق غير المكتمل للمراجع العلمية.`,
};

export const AcademicProofreaderModal: React.FC<AcademicProofreaderModalProps> = ({
  onClose,
  onRequestHumanEditorial,
}) => {
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXTS.en);
  const [activeTab, setActiveTab] = useState<'editor' | 'report'>('editor');
  const [ignoredIssueIds, setIgnoredIssueIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<boolean>(false);

  // Analysis engine based on language heuristics
  const detectedIssues = useMemo<ProofreadIssue[]>(() => {
    const text = inputText;
    const issues: ProofreadIssue[] = [];
    if (!text.trim()) return issues;

    if (selectedLang === 'en') {
      // English rules
      // 1. Missing comma after transitional adverbs
      const transMatches = [...text.matchAll(/\b(Therefore|However|Furthermore|Moreover|Consequently|In addition)\s+([A-Za-z])/gi)];
      transMatches.forEach((m, idx) => {
        if (m.index !== undefined && !m[0].includes(',')) {
          issues.push({
            id: `en-trans-${idx}`,
            type: 'punctuation',
            severity: 'warning',
            title: 'Missing Comma After Transitional Adverb',
            explanation: `In academic prose, adverbs like "${m[1]}" must be followed by a comma when introducing a clause.`,
            originalText: m[0],
            suggestedText: `${m[1]}, ${m[2]}`,
            position: { start: m.index, end: m.index + m[0].length },
          });
        }
      });

      // 2. Subject-verb agreement (common typos: authors utilizes, data shows vs data show)
      const svMatches = [...text.matchAll(/\b(authors|researchers|studies|students)\s+(utilizes|demonstrates|shows|indicates|lacks)\b/gi)];
      svMatches.forEach((m, idx) => {
        if (m.index !== undefined) {
          const pluralVerb = m[2].replace(/s$/, '');
          issues.push({
            id: `en-sv-${idx}`,
            type: 'orthography',
            severity: 'error',
            title: 'Subject-Verb Agreement Mismatch',
            explanation: `Plural noun "${m[1]}" requires plural verb form "${pluralVerb}" instead of singular "${m[2]}".`,
            originalText: m[0],
            suggestedText: `${m[1]} ${pluralVerb}`,
            position: { start: m.index, end: m.index + m[0].length },
          });
        }
      });

      // 3. In-text citation format
      const citeMatches = [...text.matchAll(/\(([A-Z][a-z]+)\s+(\d{4})\)/g)];
      citeMatches.forEach((m, idx) => {
        if (m.index !== undefined) {
          issues.push({
            id: `en-cite-${idx}`,
            type: 'citation',
            severity: 'suggestion',
            title: 'APA 7th In-Text Citation Comma',
            explanation: `APA 7th guidelines require a comma separating author surname and publication year: (${m[1]}, ${m[2]}).`,
            originalText: m[0],
            suggestedText: `(${m[1]}, ${m[2]})`,
            position: { start: m.index, end: m.index + m[0].length },
          });
        }
      });

      // 4. "multi-lingual" hyphenation style
      const hyphenMatches = [...text.matchAll(/\bmulti-lingual\b/gi)];
      hyphenMatches.forEach((m, idx) => {
        if (m.index !== undefined) {
          issues.push({
            id: `en-hyphen-${idx}`,
            type: 'style',
            severity: 'suggestion',
            title: 'Standard Compound Spelling',
            explanation: 'Modern academic publishing prefers the unhyphenated form "multilingual".',
            originalText: m[0],
            suggestedText: 'multilingual',
            position: { start: m.index, end: m.index + m[0].length },
          });
        }
      });
    } else if (selectedLang === 'or') {
      // Afaan Oromoo (Qubee) rules
      // 1. Hudhaa (glottal stop / apostrophe) check
      const hudhaaMatches = [...text.matchAll(/\b(tau|tahe|taa|bahu|dhabamu)\b/gi)];
      hudhaaMatches.forEach((m, idx) => {
        if (m.index !== undefined) {
          const corrected = m[0] === 'tau' ? "ta'u" : m[0] === 'tahe' ? "ta'e" : m[0] === 'bahu' ? "ba'u" : m[0];
          issues.push({
            id: `or-hudhaa-${idx}`,
            type: 'gemination',
            severity: 'error',
            title: 'Hudhaa (Glottal Apostrophe) Omission',
            explanation: `Afaan Oromoo orthography requires the hudhaa character (') in "${corrected}" to signify phonemic glottal stop.`,
            originalText: m[0],
            suggestedText: corrected,
            position: { start: m.index, end: m.index + m[0].length },
          });
        }
      });

      // 2. Double vowel harmony check
      const vowelMatches = [...text.matchAll(/\b(heddu|olanoo|waraqa)\b/gi)];
      vowelMatches.forEach((m, idx) => {
        if (m.index !== undefined) {
          const corrected = m[0] === 'heddu' ? 'hedduu' : m[0] === 'olanoo' ? 'olaanoo' : 'waraqaa';
          issues.push({
            id: `or-vowel-${idx}`,
            type: 'orthography',
            severity: 'warning',
            title: 'Qubee Vowel Length Consistency',
            explanation: `Long vowel cadence requires double vowel orthography: "${corrected}".`,
            originalText: m[0],
            suggestedText: corrected,
            position: { start: m.index, end: m.index + m[0].length },
          });
        }
      });

      // 3. Citation abbreviation standard
      const fknMatches = [...text.matchAll(/\b(fkn)\b(?!\.)/gi)];
      fknMatches.forEach((m, idx) => {
        if (m.index !== undefined) {
          issues.push({
            id: `or-abbr-${idx}`,
            type: 'punctuation',
            severity: 'suggestion',
            title: 'Scholarly Abbreviation Period',
            explanation: 'The academic abbreviation for "fakkeenyaaf" is standardized as "fkn." with a trailing period.',
            originalText: m[0],
            suggestedText: 'fkn.',
            position: { start: m.index, end: m.index + m[0].length },
          });
        }
      });
    } else if (selectedLang === 'am') {
      // Amharic (Ethiopic Fidel) rules
      // 1. Ethiopic word separator check (using latin comma or space instead of Ethiopic comma/colon)
      const punctMatches = [...text.matchAll(/([ሀ-ፖ])(\s*,\s*)([ሀ-ፖ])/g)];
      punctMatches.forEach((m, idx) => {
        if (m.index !== undefined) {
          issues.push({
            id: `am-punct-${idx}`,
            type: 'punctuation',
            severity: 'warning',
            title: 'Ethiopic Punctuation Standard',
            explanation: 'Academic Ge\'ez typesetting prefers the Ethiopic Neteb comma (፣) instead of Western Latin comma.',
            originalText: m[0],
            suggestedText: `${m[1]}፣ ${m[3]}`,
            position: { start: m.index, end: m.index + m[0].length },
          });
        }
      });

      // 2. Homophone character harmonization
      const homoMatches = [...text.matchAll(/(ፅሁፍ|ፅሑፍ|ጽሑፍ)/g)];
      homoMatches.forEach((m, idx) => {
        if (m.index !== undefined && m[0] !== 'ጽሑፍ') {
          issues.push({
            id: `am-homo-${idx}`,
            type: 'orthography',
            severity: 'suggestion',
            title: 'Ethiopic Orthographic Standardization',
            explanation: 'Haramaya University Press guidelines standardize "ጽሑፍ" (Tse-hay ጸ) for formal research monographs.',
            originalText: m[0],
            suggestedText: 'ጽሑፍ',
            position: { start: m.index, end: m.index + m[0].length },
          });
        }
      });
    } else if (selectedLang === 'ar') {
      // Arabic rules
      // 1. Hamza on Alif
      const hamzaMatches = [...text.matchAll(/\b(اخطاء|استخدام|اصدار)\b/g)];
      hamzaMatches.forEach((m, idx) => {
        if (m.index !== undefined && m[0] === 'اخطاء') {
          issues.push({
            id: `ar-hamza-${idx}`,
            type: 'orthography',
            severity: 'error',
            title: 'Hamzat al-Qat\' Omission',
            explanation: 'The noun "أخطاء" requires an explicit Hamza above the Alif (همزة قطع).',
            originalText: m[0],
            suggestedText: 'أخطاء',
            position: { start: m.index, end: m.index + m[0].length },
          });
        }
      });

      // 2. Ta Marbuta vs Ha
      const taMatches = [...text.matchAll(/\b(هرميا)\b/g)];
      taMatches.forEach((m, idx) => {
        if (m.index !== undefined) {
          issues.push({
            id: `ar-ta-${idx}`,
            type: 'orthography',
            severity: 'suggestion',
            title: 'Institutional Transliteration Standardization',
            explanation: 'Standard Ethiopian Arabic institutional nomenclature uses "هارامايا" or "هرمايا".',
            originalText: m[0],
            suggestedText: 'هرمايا',
            position: { start: m.index, end: m.index + m[0].length },
          });
        }
      });
    }

    return issues;
  }, [inputText, selectedLang]);

  const activeIssues = detectedIssues.filter((i) => !ignoredIssueIds.has(i.id));

  // Word & character stats
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 180));
  const qualityScore = Math.max(
    50,
    Math.min(100, Math.round(100 - activeIssues.length * 8))
  );

  const handleApplyFix = (issue: ProofreadIssue) => {
    setInputText((prev) => prev.replace(issue.originalText, issue.suggestedText));
    setIgnoredIssueIds((prev) => new Set([...prev, issue.id]));
  };

  const handleApplyAllFixes = () => {
    let updated = inputText;
    activeIssues.forEach((issue) => {
      updated = updated.replace(issue.originalText, issue.suggestedText);
    });
    setInputText(updated);
    setIgnoredIssueIds(new Set(detectedIssues.map((i) => i.id)));
  };

  const handleCopyClean = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-6xl rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden max-h-[94vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary/15 text-tertiary flex items-center justify-center border border-tertiary/30">
              <span className="material-symbols-outlined text-[24px]">spellcheck</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-on-surface">
                  Multilingual Academic Proofreader & Orthographic Linter
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-tertiary-container text-on-tertiary-container font-bold text-[10px] uppercase">
                  4-Script Audit
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Qubee Afaan Oromoo gemination, Ethiopic Fidel homophones, Arabic Hamzat al-Qat, and APA 7th syntax engine.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex rounded-xl bg-surface-container-high p-0.5 border border-outline-variant/20">
              {(['en', 'or', 'am', 'ar'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLang(lang);
                    setInputText(SAMPLE_TEXTS[lang]);
                    setIgnoredIssueIds(new Set());
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedLang === lang
                      ? 'bg-surface text-secondary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {lang === 'en' ? 'English' : lang === 'or' ? 'Oromo' : lang === 'am' ? 'Amharic' : 'Arabic'}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-2 bg-surface-container-low border-b border-outline-variant/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-on-surface-variant">
            <span>Words: <strong className="text-on-surface font-mono">{wordCount}</strong></span>
            <span>Characters: <strong className="text-on-surface font-mono">{charCount}</strong></span>
            <span>Est. Reading: <strong className="text-on-surface font-mono">{readingTimeMin} min</strong></span>
            <span className="flex items-center gap-1">
              Quality Index:
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  qualityScore >= 85
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                    : qualityScore >= 70
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                    : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                }`}
              >
                {qualityScore}%
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeIssues.length > 0 && (
              <button
                onClick={handleApplyAllFixes}
                className="px-3 py-1 rounded-xl bg-secondary/15 hover:bg-secondary/25 text-secondary font-bold text-xs flex items-center gap-1 cursor-pointer border border-secondary/30 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                <span>Auto-Apply All Fixes ({activeIssues.length})</span>
              </button>
            )}
            <button
              onClick={handleCopyClean}
              className="px-3 py-1 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[14px] text-secondary">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy Clean Text'}</span>
            </button>
          </div>
        </div>

        {/* Main Proofreader Workspace */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-outline-variant/20">
          
          {/* Left Text Editor */}
          <div className="lg:col-span-7 p-5 flex flex-col justify-between space-y-3 bg-surface">
            <div className="space-y-1.5 flex-1 flex flex-col">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">edit_document</span>
                  <span>Manuscript Source Text</span>
                </label>
                <button
                  onClick={() => setInputText(SAMPLE_TEXTS[selectedLang])}
                  className="text-secondary hover:underline font-medium text-[11px]"
                >
                  Reset Sample
                </button>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setIgnoredIssueIds(new Set());
                }}
                dir={selectedLang === 'ar' ? 'rtl' : 'ltr'}
                rows={14}
                className={`w-full flex-1 p-4 rounded-2xl bg-surface-container/50 border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:border-secondary resize-none font-serif leading-relaxed ${
                  selectedLang === 'ar' ? 'font-arabic text-base' : ''
                }`}
                placeholder="Paste your academic manuscript, research article, or thesis abstract here..."
              />
            </div>

            <div className="text-[11px] text-on-surface-variant flex items-center justify-between pt-2 border-t border-outline-variant/15">
              <span>Supports live orthography parsing for Latin, Ethiopic, and Arabic scripts.</span>
              <span className="font-mono text-secondary">WKI Engine v3.2</span>
            </div>
          </div>

          {/* Right Issues Inspector Panel */}
          <div className="lg:col-span-5 p-5 space-y-3 bg-surface-container-lowest overflow-y-auto flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">find_replace</span>
                  <span>Orthographic & Stylistic Findings ({activeIssues.length})</span>
                </h3>
                {ignoredIssueIds.size > 0 && (
                  <button
                    onClick={() => setIgnoredIssueIds(new Set())}
                    className="text-[11px] text-secondary hover:underline"
                  >
                    Reset Ignored ({ignoredIssueIds.size})
                  </button>
                )}
              </div>

              {activeIssues.length === 0 ? (
                <div className="py-12 px-4 rounded-2xl bg-surface-container/60 border border-emerald-500/20 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">verified</span>
                  </div>
                  <h4 className="font-bold text-sm text-on-surface">Pristine Academic Copy</h4>
                  <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                    No orthographic deviations, glottal omission, or citation syntax anomalies detected in this excerpt.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[calc(94vh-300px)] overflow-y-auto pr-1">
                  {activeIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-3.5 rounded-2xl bg-surface border border-outline-variant/25 shadow-xs space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              issue.severity === 'error'
                                ? 'bg-rose-500'
                                : issue.severity === 'warning'
                                ? 'bg-amber-500'
                                : 'bg-blue-500'
                            }`}
                          />
                          <span className="font-bold text-on-surface">{issue.title}</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container text-on-surface-variant uppercase">
                          {issue.type}
                        </span>
                      </div>

                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        {issue.explanation}
                      </p>

                      <div className="p-2 rounded-xl bg-surface-container-low border border-outline-variant/20 grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div>
                          <span className="text-rose-600 dark:text-rose-400 font-bold block mb-0.5">Found:</span>
                          <span className="line-through text-on-surface-variant">{issue.originalText}</span>
                        </div>
                        <div>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">Suggested:</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-300">{issue.suggestedText}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setIgnoredIssueIds((prev) => new Set([...prev, issue.id]))}
                          className="px-2.5 py-1 rounded-lg text-on-surface-variant hover:bg-surface-container text-[11px] font-medium cursor-pointer"
                        >
                          Ignore
                        </button>
                        <button
                          onClick={() => handleApplyFix(issue)}
                          className="px-3 py-1 rounded-lg bg-secondary text-on-secondary font-bold text-[11px] flex items-center gap-1 hover:brightness-105 transition-all cursor-pointer shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[14px]">done</span>
                          <span>Apply Fix</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Service Transition */}
            <div className="pt-3 border-t border-outline-variant/20 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                <span>Need complete dissertation copy-editing?</span>
                <span className="font-bold text-secondary">Haramaya Directorate Certified</span>
              </div>
              {onRequestHumanEditorial && (
                <button
                  onClick={() => {
                    onClose();
                    onRequestHumanEditorial(inputText, selectedLang);
                  }}
                  className="w-full py-2 rounded-xl bg-secondary hover:brightness-105 text-on-secondary font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">support_agent</span>
                  <span>Submit to Professional Human Editorial Queue</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
