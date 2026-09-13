import React, { useState } from 'react';

interface PeerReviewModalProps {
  onClose: () => void;
  onRequestRemediation?: (notes: string) => void;
}

export const PeerReviewModal: React.FC<PeerReviewModalProps> = ({
  onClose,
  onRequestRemediation,
}) => {
  const [paperTitle, setPaperTitle] = useState<string>(
    'Comparative Analysis of Machine Translation on Low-Resource Horn of Africa Languages'
  );
  const [authorName, setAuthorName] = useState<string>('Candidate / Author: Dr. Jemal Abdi');
  const [reviewerName, setReviewerName] = useState<string>('Prof. K. Kebede (Senior Faculty Reviewer)');
  const [reviewDate, setReviewDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Rubric Scores (1 to 5)
  const [scores, setScores] = useState<{ [key: string]: number }>({
    methodology: 4.5,
    citations: 5,
    typography: 4,
    multilingual: 4.5,
    figures: 4,
  });

  const [reviewNotes, setReviewNotes] = useState<string>(
    'The manuscript demonstrates exceptional research rigor and pioneering contribution to Afaan Oromoo NLP. Minor recommendations: ensure IEEE citation format consistency in Chapter 4 and increase DPI on Figure 3.'
  );

  const [verdict, setVerdict] = useState<'accept' | 'minor' | 'major' | 'reject'>('minor');

  const criteria = [
    {
      id: 'methodology',
      label: 'Methodological Rigor & Theoretical Foundation',
      desc: 'Clarity of research design, statistical sampling, and analytical reproducibility.',
      weight: 0.25,
    },
    {
      id: 'citations',
      label: 'Bibliographic Rigor & Citation Integrity',
      desc: 'Adherence to APA 7th / IEEE style with active CrossRef DOIs and complete references.',
      weight: 0.20,
    },
    {
      id: 'typography',
      label: 'Typographic Hierarchy & Layout Precision',
      desc: 'Consistent font pairings, margins, heading depths, and page break aesthetics.',
      weight: 0.20,
    },
    {
      id: 'multilingual',
      label: 'Multilingual Orthography & Script Harmonization',
      desc: 'Flawless Qubee orthography, Amharic Fidel ligatures, and Arabic diacritics.',
      weight: 0.20,
    },
    {
      id: 'figures',
      label: 'Data Visualization & High-Resolution Figures',
      desc: 'Vector graphics legibility, labeled axes, and print-ready 300+ DPI chart assets.',
      weight: 0.15,
    },
  ];

  // Calculate weighted score (0 - 100%)
  const calculateTotalScore = () => {
    let sum = 0;
    criteria.forEach((c) => {
      const score = scores[c.id] || 4;
      sum += (score / 5) * (c.weight * 100);
    });
    return Math.round(sum * 10) / 10;
  };

  const totalScore = calculateTotalScore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-4xl rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-surface-container border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-[24px]">rate_review</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-on-surface">
                  Manuscript Peer-Review & Editorial Appraisal Matrix
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container font-bold text-[10px]">
                  Board Rubric
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Standardized academic evaluation rubric for Haramaya University Press and Graduate Theses.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20">
            <div>
              <label className="font-bold text-on-surface block mb-1">Manuscript / Thesis Title:</label>
              <input
                type="text"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 text-on-surface font-medium focus:outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label className="font-bold text-on-surface block mb-1">Candidate / Author Affiliation:</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 text-on-surface font-medium focus:outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label className="font-bold text-on-surface block mb-1">Designated Reviewer / Examiner:</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 text-on-surface font-medium focus:outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label className="font-bold text-on-surface block mb-1">Evaluation Date:</label>
              <input
                type="date"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 text-on-surface font-medium focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          {/* Score Summary Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-secondary/15 via-primary/10 to-transparent border border-secondary/30 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                Composite Quality Index
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-serif text-on-surface">
                  {totalScore}%
                </span>
                <span className="text-xs text-on-surface-variant font-bold">
                  {totalScore >= 85
                    ? '★ Meets High Publishing Standards'
                    : totalScore >= 70
                    ? '▲ Acceptable with Minor Revisions'
                    : '⚠ Requires Comprehensive Structural Revision'}
                </span>
              </div>
            </div>

            {/* Verdict Selector */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'accept', label: 'Accept As-Is', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                { id: 'minor', label: 'Minor Editorial Revisions', color: 'text-blue-700 bg-blue-50 border-blue-200' },
                { id: 'major', label: 'Major Structural Revisions', color: 'text-amber-700 bg-amber-50 border-amber-200' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVerdict(v.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    verdict === v.id
                      ? `${v.color} shadow-xs ring-2 ring-secondary/50 font-black`
                      : 'bg-surface border-outline-variant/20 text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rubric Criteria Sliders */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">checklist</span>
              <span>Individual Academic Criteria Scoring</span>
            </h3>

            <div className="space-y-3">
              {criteria.map((crit) => {
                const currentScore = scores[crit.id] ?? 4;
                return (
                  <div
                    key={crit.id}
                    className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 space-y-2 hover:border-secondary/40 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-xs text-on-surface">{crit.label}</span>
                        <p className="text-[11px] text-on-surface-variant">{crit.desc}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface border border-outline-variant/30 text-secondary">
                          {currentScore} / 5.0
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-mono">
                          (Weight: {crit.weight * 100}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-on-surface-variant font-mono">1.0</span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={currentScore}
                        onChange={(e) =>
                          setScores((prev) => ({
                            ...prev,
                            [crit.id]: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full accent-secondary cursor-pointer"
                      />
                      <span className="text-[10px] text-on-surface-variant font-mono">5.0</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Qualitative Editorial Feedback Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface block">
              Specific Examiner / Reviewer Comments & Page-Specific Feedback:
            </label>
            <textarea
              rows={3}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full p-3 rounded-2xl bg-surface border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-secondary resize-none"
              placeholder="Provide constructive guidance on citations, orthography, and presentation..."
            />
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-surface-container border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
            <span>Haramaya University Press Quality Assurance Standard</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Appraisal Report</span>
            </button>
            {onRequestRemediation && (
              <button
                onClick={() => {
                  onClose();
                  onRequestRemediation(reviewNotes);
                }}
                className="px-4 py-2 rounded-xl bg-secondary hover:brightness-105 text-on-secondary font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                <span>Request Remediation Typesetting</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
