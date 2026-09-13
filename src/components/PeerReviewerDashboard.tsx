import React, { useState } from 'react';
import { Book, Language } from '../types';

interface ReviewAssignment {
  id: string;
  manuscriptTitle: string;
  journal: 'EAJS' | 'HJAS' | 'HLR';
  trackingCode: string;
  authorsAnonymized: string;
  submissionDate: string;
  deadlineDate: string;
  status: 'Pending Review' | 'In Progress' | 'Submitted' | 'Overdue';
  pages: number;
  wordCount: number;
  abstract: string;
  currentScores?: {
    novelty: number; // 0-25
    methodology: number; // 0-25
    citations: number; // 0-25
    presentation: number; // 0-25
  };
  recommendation?: 'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject';
  authorFeedback?: string;
  confidentialEditorialNotes?: string;
  doi?: string;
}

interface PeerReviewerDashboardProps {
  currentLanguage: Language;
  onOpenDOIStudio?: () => void;
  onOpenPlagiarismScanner?: () => void;
  onOpenProofreader?: () => void;
  onNavigateHome: () => void;
  onShowToast?: (msg: string) => void;
}

export const PeerReviewerDashboard: React.FC<PeerReviewerDashboardProps> = ({
  currentLanguage,
  onOpenDOIStudio,
  onOpenPlagiarismScanner,
  onOpenProofreader,
  onNavigateHome,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'active_review' | 'completed' | 'journals' | 'guidelines'>('queue');

  // Reviewer Profile
  const [reviewer] = useState({
    name: 'Prof. Tadesse Bekele, PhD',
    affiliation: 'College of Agriculture & Environmental Sciences • Haramaya University',
    orcid: '0000-0002-8419-7721',
    assignedJournals: ['East African Journal of Sciences (EAJS)', 'Haramaya Journal of Agricultural Sciences (HJAS)'],
    totalCompletedReviews: 28,
    averageReviewDays: 5.4,
    recognitionBadge: 'Senior Editorial Referee • Tier 1',
  });

  // Mock Review Assignments
  const [assignments, setAssignments] = useState<ReviewAssignment[]>([
    {
      id: 'rev-01',
      manuscriptTitle: 'Spatial Heterogeneity in Soil Organic Carbon Across Highland Agroforestry Systems in Eastern Hararghe',
      journal: 'HJAS',
      trackingCode: 'HJAS-2026-084-DOC',
      authorsAnonymized: 'Double-Blind Anonymized (Authors ID: #HU-AUTH-992)',
      submissionDate: '2026-08-28',
      deadlineDate: '2026-09-22',
      status: 'In Progress',
      pages: 18,
      wordCount: 6420,
      abstract:
        'This study assesses spatial variability of soil organic carbon (SOC) stocks under indigenous legume-cereal intercropping in Mayu and Kersa woredas. Core samples (N=360) were analyzed using multivariate geostatistical interpolation and Sentinel-2 vegetation indices.',
      currentScores: {
        novelty: 22,
        methodology: 24,
        citations: 21,
        presentation: 23,
      },
      recommendation: 'Minor Revision',
      authorFeedback:
        'The empirical dataset is robust and well-grounded in local Hararghe ecological zones. Recommend adding error bands to Figure 3 and clarifying the Sentinel-2 cloud masking algorithm in Section 2.4.',
      confidentialEditorialNotes:
        'Strong candidate for publication in Volume 20, Issue 2. Originality score verified at 97.4% by WKI plagiarism scanner.',
      doi: '10.20372/hjas.2026.084',
    },
    {
      id: 'rev-02',
      manuscriptTitle: 'Comparative Phonology and Morphosyntactic Alignment in Eastern Oromo Dialects',
      journal: 'EAJS',
      trackingCode: 'EAJS-2026-112-REV',
      authorsAnonymized: 'Double-Blind Anonymized (Authors ID: #HU-AUTH-419)',
      submissionDate: '2026-09-02',
      deadlineDate: '2026-09-28',
      status: 'Pending Review',
      pages: 24,
      wordCount: 8150,
      abstract:
        'A synchronic analysis of tone and vowel duration in Harar and Dire Dawa speech communities. Investigates dialectal isoglosses and standardized Qubee orthography alignment in university publications.',
      currentScores: {
        novelty: 20,
        methodology: 21,
        citations: 19,
        presentation: 22,
      },
    },
    {
      id: 'rev-03',
      manuscriptTitle: 'Legal Constraints on Cross-Border Agrarian Land Leases in Regional State Jurisdictions',
      journal: 'HLR',
      trackingCode: 'HLR-2026-029-JUR',
      authorsAnonymized: 'Double-Blind Anonymized (Authors ID: #HU-AUTH-773)',
      submissionDate: '2026-08-10',
      deadlineDate: '2026-09-05',
      status: 'Submitted',
      pages: 31,
      wordCount: 11200,
      abstract:
        'Examines federal vs. regional constitutional prerogatives regarding large-scale commercial agricultural investments and communal land rights in the Horn of Africa.',
      currentScores: {
        novelty: 24,
        methodology: 23,
        citations: 25,
        presentation: 24,
      },
      recommendation: 'Accept',
      authorFeedback: 'Exemplary legal scholarship with thorough constitutional analysis.',
      confidentialEditorialNotes: 'Recommended for lead article in the upcoming Haramaya Law Review issue.',
      doi: '10.20372/hlr.2026.029',
    },
  ]);

  const [selectedAssignment, setSelectedAssignment] = useState<ReviewAssignment>(assignments[0]);
  const [rubricScores, setRubricScores] = useState({
    novelty: selectedAssignment.currentScores?.novelty || 22,
    methodology: selectedAssignment.currentScores?.methodology || 23,
    citations: selectedAssignment.currentScores?.citations || 21,
    presentation: selectedAssignment.currentScores?.presentation || 22,
  });
  const [recommendation, setRecommendation] = useState<'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject'>(
    selectedAssignment.recommendation || 'Minor Revision'
  );
  const [feedbackText, setFeedbackText] = useState<string>(selectedAssignment.authorFeedback || '');
  const [confidentialNotes, setConfidentialNotes] = useState<string>(
    selectedAssignment.confidentialEditorialNotes || ''
  );

  const totalScore = rubricScores.novelty + rubricScores.methodology + rubricScores.citations + rubricScores.presentation;

  const handleSelectAssignment = (item: ReviewAssignment) => {
    setSelectedAssignment(item);
    setRubricScores({
      novelty: item.currentScores?.novelty || 20,
      methodology: item.currentScores?.methodology || 20,
      citations: item.currentScores?.citations || 20,
      presentation: item.currentScores?.presentation || 20,
    });
    setRecommendation(item.recommendation || 'Minor Revision');
    setFeedbackText(item.authorFeedback || '');
    setConfidentialNotes(item.confidentialEditorialNotes || '');
    setActiveTab('active_review');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ReviewAssignment = {
      ...selectedAssignment,
      status: 'Submitted',
      currentScores: rubricScores,
      recommendation,
      authorFeedback: feedbackText,
      confidentialEditorialNotes: confidentialNotes,
    };

    setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelectedAssignment(updated);
    if (onShowToast) {
      onShowToast(`Editorial review for ${updated.trackingCode} submitted successfully to Editor-in-Chief.`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-gutter-mobile py-4 animate-in fade-in duration-200">
      {/* Top Banner & Reviewer Credentials */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              Double-Blind Peer Review Portal
            </span>
            <span className="text-xs text-indigo-200/70 font-mono">ORCID: {reviewer.orcid}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">{reviewer.name}</h1>
          <p className="text-xs sm:text-sm text-indigo-100/80">{reviewer.affiliation}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="p-3 rounded-2xl bg-indigo-900/40 border border-indigo-700/30 text-center">
            <div className="text-xl font-bold text-amber-300 font-mono">{reviewer.totalCompletedReviews}</div>
            <div className="text-[10px] text-indigo-200">Reviews Done</div>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-900/40 border border-indigo-700/30 text-center">
            <div className="text-xl font-bold text-emerald-400 font-mono">{reviewer.averageReviewDays}d</div>
            <div className="text-[10px] text-indigo-200">Avg Turnaround</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-outline-variant/30">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">inbox</span>
            <span>Review Queue ({assignments.filter((a) => a.status !== 'Submitted').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('active_review')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'active_review'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">rate_review</span>
            <span>Review Rubric & Scoring</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">task_alt</span>
            <span>Completed Submissions</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onOpenDOIStudio && (
            <button
              onClick={onOpenDOIStudio}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-indigo-500">link</span>
              <span>DOI Studio</span>
            </button>
          )}
          {onOpenPlagiarismScanner && (
            <button
              onClick={onOpenPlagiarismScanner}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-rose-500">policy</span>
              <span>Plagiarism</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: REVIEW QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assignments.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectAssignment(item)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  selectedAssignment.id === item.id
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-surface-container-low border-outline-variant/30 hover:border-indigo-400'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold">
                      {item.journal} • {item.trackingCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'In Progress'
                          ? 'bg-amber-500/10 text-amber-600'
                          : item.status === 'Submitted'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-indigo-500/10 text-indigo-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-on-surface line-clamp-2">
                    {item.manuscriptTitle}
                  </h3>
                  <p className="text-[11px] text-on-surface-variant line-clamp-3">
                    {item.abstract}
                  </p>
                </div>

                <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span>Deadline: {item.deadlineDate}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {item.pages} pgs ({item.wordCount} words)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE REVIEW & SCORING RUBRIC */}
      {activeTab === 'active_review' && (
        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Manuscript Summary & Metadata */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold">
                    {selectedAssignment.journal} • {selectedAssignment.trackingCode}
                  </span>
                  <span className="text-xs text-on-surface-variant">Due: {selectedAssignment.deadlineDate}</span>
                </div>

                <h3 className="font-serif font-bold text-base text-on-surface">
                  {selectedAssignment.manuscriptTitle}
                </h3>
                <p className="text-xs text-on-surface-variant font-mono">
                  {selectedAssignment.authorsAnonymized}
                </p>

                <div className="p-3 rounded-xl bg-surface text-xs text-on-surface-variant leading-relaxed space-y-1">
                  <div className="font-bold text-on-surface">Abstract:</div>
                  <p>{selectedAssignment.abstract}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span>Scope: {selectedAssignment.pages} Pages</span>
                  <span>Word Count: {selectedAssignment.wordCount}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Double-Blind Evaluation Rubric */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-on-surface">
                      Editorial Evaluation Rubric (100-Point Scale)
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Haramaya University Journal Quality Standards
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                      {totalScore} <span className="text-xs font-sans text-on-surface-variant">/ 100</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      {totalScore >= 85 ? 'High Merit' : totalScore >= 70 ? 'Moderate Merit' : 'Major Revision'}
                    </span>
                  </div>
                </div>

                {/* Rubric Sliders */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>1. Originality & Theoretical Contribution:</span>
                      <span className="font-mono text-indigo-600">{rubricScores.novelty} / 25</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={rubricScores.novelty}
                      onChange={(e) => setRubricScores({ ...rubricScores, novelty: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>2. Methodological Rigor & Data Integrity:</span>
                      <span className="font-mono text-indigo-600">{rubricScores.methodology} / 25</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={rubricScores.methodology}
                      onChange={(e) => setRubricScores({ ...rubricScores, methodology: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>3. Literature Context & APA 7th Referencing:</span>
                      <span className="font-mono text-indigo-600">{rubricScores.citations} / 25</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={rubricScores.citations}
                      onChange={(e) => setRubricScores({ ...rubricScores, citations: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>4. Orthography, Typesetting & Layout:</span>
                      <span className="font-mono text-indigo-600">{rubricScores.presentation} / 25</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={rubricScores.presentation}
                      onChange={(e) => setRubricScores({ ...rubricScores, presentation: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Final Recommendation Radio */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/20">
                  <label className="text-xs font-bold text-on-surface">Editorial Recommendation</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Accept', 'Minor Revision', 'Major Revision', 'Reject'] as const).map((rec) => (
                      <button
                        type="button"
                        key={rec}
                        onClick={() => setRecommendation(rec)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                          recommendation === rec
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-surface text-on-surface border-outline-variant/30 hover:bg-surface-container'
                        }`}
                      >
                        {rec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback for Authors */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface">
                    Constructive Feedback for Authors (Shared Anonymously)
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Provide detailed comments on structure, data presentation, and needed revisions..."
                    className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
                  />
                </div>

                {/* Confidential Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface">
                    Confidential Notes to Editor-in-Chief (Not Shared with Authors)
                  </label>
                  <textarea
                    rows={2}
                    value={confidentialNotes}
                    onChange={(e) => setConfidentialNotes(e.target.value)}
                    placeholder="Editorial assessment, plagiarism flags, or recommendations regarding volume placement..."
                    className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>Submit Review Decision</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: COMPLETED SUBMISSIONS */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30">
            <h3 className="text-sm font-bold text-on-surface mb-3">Archived Editorial Decisions</h3>
            <div className="space-y-3">
              {assignments
                .filter((a) => a.status === 'Submitted')
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-surface border border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-indigo-600">{item.trackingCode}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                          {item.recommendation}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-xs text-on-surface">{item.manuscriptTitle}</h4>
                      {item.doi && <p className="text-[10px] font-mono text-on-surface-variant">DOI: {item.doi}</p>}
                    </div>

                    <span className="text-xs font-bold text-emerald-600 shrink-0">Certified Complete</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
