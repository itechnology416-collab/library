import React, { useState } from 'react';
import { motion } from 'motion/react';
import { JournalSubmission } from '../types';

interface JournalWorkflowModalProps {
  onClose: () => void;
  onRequestTypesetting?: (manuscriptTitle: string) => void;
}

const INITIAL_SUBMISSIONS: JournalSubmission[] = [
  {
    id: 'sub-1',
    journalName: 'East African Journal of Sciences (EAJS)',
    manuscriptTitle: 'Assessment of Soil Organic Carbon Stocks Under Different Agroforestry Shade Regimes in Hararghe',
    trackingNumber: 'EAJS-2026-0042',
    authors: 'Abebe T., Gemechu K. & Fatima I.',
    leadAffiliation: 'College of Agriculture & Environmental Sciences, Haramaya University',
    submittedAt: '2026-08-14',
    category: 'Research Article',
    stage: 'Under Review',
    reviewersAssigned: [
      {
        id: 'rev-1',
        name: 'Prof. Kassahun Tesfaye',
        institution: 'Institute of Biotechnology, AAU',
        status: 'Review Completed',
        recommendation: 'Minor Revision',
        score: 86,
      },
      {
        id: 'rev-2',
        name: 'Dr. Zeleke Mekuriaw',
        institution: 'ILRI / Hawassa University',
        status: 'Accepted',
        recommendation: 'Minor Revision',
        score: 82,
      },
      {
        id: 'rev-3',
        name: 'Dr. Nigatu Mulatu',
        institution: 'Jimma University College of Agriculture',
        status: 'Invited',
      },
    ],
    editorInCharge: 'Prof. Mengistu Urge (Editor-in-Chief)',
    targetVolume: '18',
    targetIssue: '2',
    doi: '10.20372/eajs.v18i2.04',
  },
  {
    id: 'sub-2',
    journalName: 'Haramaya Journal of Agricultural Sciences (HJAS)',
    manuscriptTitle: 'Prevalence and Antibiogram of Salmonella enterica in Raw Camel Milk in Eastern Lowlands of Ethiopia',
    trackingNumber: 'HJAS-2026-0118',
    authors: 'Farah H., Mohammed Y. & Redda Y.',
    leadAffiliation: 'School of Animal & Range Sciences, Haramaya University',
    submittedAt: '2026-08-28',
    category: 'Research Article',
    stage: 'In Copyediting',
    reviewersAssigned: [
      {
        id: 'rev-4',
        name: 'Dr. Wondimu Daniel',
        institution: 'National Veterinary Institute (NVI), Debre Zeit',
        status: 'Review Completed',
        recommendation: 'Accept',
        score: 91,
      },
      {
        id: 'rev-5',
        name: 'Prof. Berhanu Shibru',
        institution: 'Faculty of Veterinary Medicine, HU',
        status: 'Review Completed',
        recommendation: 'Accept',
        score: 89,
      },
    ],
    editorInCharge: 'Dr. Benti Deresa (Managing Editor)',
    targetVolume: '12',
    targetIssue: '1',
    doi: '10.20372/hjas.v12i1.02',
  },
  {
    id: 'sub-3',
    journalName: 'Haramaya Law Review (HLR)',
    manuscriptTitle: 'Customary Land Tenure Systems and Investment-Induced Displacement in the Somali Regional State',
    trackingNumber: 'HLR-2026-0019',
    authors: 'Guled A. & Tadesse W.',
    leadAffiliation: 'College of Law, Haramaya University',
    submittedAt: '2026-09-02',
    category: 'Policy Brief',
    stage: 'Desk Screening',
    reviewersAssigned: [],
    editorInCharge: 'Dean of HU College of Law',
    targetVolume: '9',
    targetIssue: '1',
  },
  {
    id: 'sub-4',
    journalName: 'East African Journal of Sciences (EAJS)',
    manuscriptTitle: 'Computational Morphological Disambiguation for Low-Resource Cushitic Languages Using Neural Transformers',
    trackingNumber: 'EAJS-2026-0056',
    authors: 'Gudeta D. & Tolasa M.',
    leadAffiliation: 'Department of Computing, Haramaya University',
    submittedAt: '2026-07-22',
    category: 'Research Article',
    stage: 'Galley Proof',
    reviewersAssigned: [
      {
        id: 'rev-6',
        name: 'Dr. Solomon Atnafu',
        institution: 'AAU School of Information Technology',
        status: 'Review Completed',
        recommendation: 'Accept',
        score: 95,
      },
    ],
    editorInCharge: 'Prof. Mengistu Urge (Editor-in-Chief)',
    targetVolume: '18',
    targetIssue: '2',
    doi: '10.20372/eajs.v18i2.06',
  },
];

export const JournalWorkflowModal: React.FC<JournalWorkflowModalProps> = ({
  onClose,
  onRequestTypesetting,
}) => {
  const [submissions, setSubmissions] = useState<JournalSubmission[]>(INITIAL_SUBMISSIONS);
  const [selectedJournal, setSelectedJournal] = useState<string>('All Journals');
  const [selectedStage, setSelectedStage] = useState<string>('All Stages');
  const [activeSubmissionId, setActiveSubmissionId] = useState<string>('sub-1');
  const [showDecisionComposer, setShowDecisionComposer] = useState<boolean>(false);
  const [decisionType, setDecisionType] = useState<'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject'>('Minor Revision');

  const filteredSubmissions = submissions.filter((sub) => {
    const matchJournal = selectedJournal === 'All Journals' || sub.journalName === selectedJournal;
    const matchStage = selectedStage === 'All Stages' || sub.stage === selectedStage;
    return matchJournal && matchStage;
  });

  const activeSubmission = submissions.find((s) => s.id === activeSubmissionId) || submissions[0];

  const handleAdvanceStage = (id: string, nextStage: JournalSubmission['stage']) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, stage: nextStage } : s))
    );
  };

  return (
    <div
      id="journal-workflow-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-6xl h-[92vh] max-h-[920px] bg-surface-container-lowest dark:bg-surface rounded-2xl shadow-2xl border border-outline/20 flex flex-col overflow-hidden text-on-surface"
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-outline/15 flex items-center justify-between bg-surface-container/50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">menu_book</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-serif truncate">
                  Institutional Journal Submissions & Editorial Workflow Dashboard
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-tertiary text-on-tertiary">
                  HU Journal Office
                </span>
              </div>
              <p className="text-xs text-on-surface-variant truncate">
                East African Journal of Sciences (EAJS), HJAS, HLR peer-review lifecycle & galley pipeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
            title="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-6 py-3 border-b border-outline/10 bg-surface flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-on-surface-variant uppercase text-[10px] tracking-wider">
              Filter by Journal:
            </span>
            <select
              value={selectedJournal}
              onChange={(e) => setSelectedJournal(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-surface-container border border-outline/15 focus:outline-hidden"
            >
              <option value="All Journals">All Institutional Journals (4)</option>
              <option value="East African Journal of Sciences (EAJS)">East African Journal of Sciences (EAJS)</option>
              <option value="Haramaya Journal of Agricultural Sciences (HJAS)">Haramaya Journal of Agricultural Sciences (HJAS)</option>
              <option value="Haramaya Law Review (HLR)">Haramaya Law Review (HLR)</option>
            </select>

            <span className="font-bold text-on-surface-variant uppercase text-[10px] tracking-wider ml-2">
              Stage:
            </span>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-surface-container border border-outline/15 focus:outline-hidden"
            >
              <option value="All Stages">All Pipeline Stages</option>
              <option value="Desk Screening">Desk Screening</option>
              <option value="Under Review">Under Review</option>
              <option value="Revision Requested">Revision Requested</option>
              <option value="In Copyediting">In Copyediting</option>
              <option value="Galley Proof">Galley Proof</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <div className="text-xs text-on-surface-variant font-mono">
            Showing <strong>{filteredSubmissions.length}</strong> active submissions
          </div>
        </div>

        {/* Main Content Layout: Left 5 cols (list) + Right 7 cols (inspector) */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-outline/15 overflow-hidden">
          {/* Left Column: Submissions List */}
          <div className="lg:col-span-5 flex flex-col min-h-0 bg-surface-container/30">
            <div className="p-3 border-b border-outline/10 text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
              <span>Manuscripts in Review Queue</span>
              <span className="material-symbols-outlined text-[16px]">dynamic_feed</span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => setActiveSubmissionId(sub.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    activeSubmissionId === sub.id
                      ? 'bg-surface shadow-sm border-tertiary ring-1 ring-tertiary/50'
                      : 'bg-surface/70 border-outline/15 hover:bg-surface hover:border-outline/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[10px] text-tertiary font-bold">
                      {sub.trackingNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.stage === 'Desk Screening'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                          : sub.stage === 'Under Review'
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
                          : sub.stage === 'In Copyediting'
                          ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {sub.stage}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-on-surface line-clamp-2 mb-1 leading-snug">
                    {sub.manuscriptTitle}
                  </h4>

                  <div className="text-[11px] text-on-surface-variant flex items-center justify-between">
                    <span className="truncate pr-2">{sub.authors}</span>
                    <span className="font-mono text-[10px] flex-shrink-0">{sub.submittedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Active Manuscript Editorial Inspector */}
          {activeSubmission ? (
            <div className="lg:col-span-7 flex flex-col min-h-0 bg-surface overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Header & Meta */}
              <div className="space-y-2 border-b border-outline/10 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-tertiary font-mono">
                    {activeSubmission.journalName}
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono">
                    ID: {activeSubmission.trackingNumber}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold font-serif text-on-surface leading-snug">
                  {activeSubmission.manuscriptTitle}
                </h3>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-on-surface-variant">
                  <span>
                    <strong>Authors:</strong> {activeSubmission.authors}
                  </span>
                  <span>
                    <strong>Lead Affiliation:</strong> {activeSubmission.leadAffiliation}
                  </span>
                  {activeSubmission.doi && (
                    <span className="font-mono text-primary">
                      <strong>DOI:</strong> {activeSubmission.doi}
                    </span>
                  )}
                </div>
              </div>

              {/* Stage Progress Tracker */}
              <div className="p-4 rounded-xl bg-surface-container/50 border border-outline/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Current Stage: <span className="text-tertiary font-mono">{activeSubmission.stage}</span>
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Assigned Editor: <strong>{activeSubmission.editorInCharge}</strong>
                  </span>
                </div>

                {/* Pipeline Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['Desk Screening', 'Under Review', 'Revision Requested', 'In Copyediting', 'Galley Proof', 'Published'] as const).map(
                    (stage) => (
                      <button
                        key={stage}
                        onClick={() => handleAdvanceStage(activeSubmission.id, stage)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          activeSubmission.stage === stage
                            ? 'bg-tertiary text-on-tertiary shadow-xs'
                            : 'bg-surface border border-outline/15 hover:bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {stage}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Peer Reviewers Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">rate_review</span>
                    Assigned Peer Reviewers ({activeSubmission.reviewersAssigned.length})
                  </h4>
                  <button
                    onClick={() =>
                      alert(`Reviewer invitation portal opened for: ${activeSubmission.manuscriptTitle}`)
                    }
                    className="text-xs text-primary font-bold hover:underline cursor-pointer"
                  >
                    + Invite Reviewer
                  </button>
                </div>

                {activeSubmission.reviewersAssigned.length === 0 ? (
                  <div className="p-4 rounded-xl bg-surface-container/40 border border-outline/10 text-xs text-center text-on-surface-variant">
                    No peer reviewers currently assigned. Click &ldquo;+ Invite Reviewer&rdquo; to send invitations.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeSubmission.reviewersAssigned.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3 rounded-xl bg-surface-container/40 border border-outline/15 text-xs flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-semibold text-on-surface flex items-center gap-2">
                            <span>{rev.name}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                rev.status === 'Review Completed'
                                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              {rev.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-on-surface-variant">{rev.institution}</div>
                        </div>

                        {rev.recommendation && (
                          <div className="text-right">
                            <span className="font-bold text-tertiary block">{rev.recommendation}</span>
                            <span className="text-[10px] font-mono text-on-surface-variant">
                              Score: {rev.score}/100
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons: Decision Letter & Typesetting */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-outline/10">
                <button
                  onClick={() => setShowDecisionComposer(!showDecisionComposer)}
                  className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-container border border-outline/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span>{showDecisionComposer ? 'Hide Decision Letter' : 'Compose Decision Letter'}</span>
                </button>

                {onRequestTypesetting && (
                  <button
                    onClick={() => {
                      onRequestTypesetting(activeSubmission.manuscriptTitle);
                      handleAdvanceStage(activeSubmission.id, 'In Copyediting');
                    }}
                    className="px-4 py-2 rounded-xl bg-tertiary text-on-tertiary text-xs font-bold hover:bg-tertiary/90 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    <span>Send to WKI Pre-Press Typesetting</span>
                  </button>
                )}
              </div>

              {/* Decision Letter Composer Box */}
              {showDecisionComposer && (
                <div className="p-4 rounded-xl bg-surface-container/60 border border-outline/20 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-tertiary">
                      Official Decision Notice:
                    </span>
                    <div className="flex items-center gap-1">
                      {(['Accept', 'Minor Revision', 'Major Revision', 'Reject'] as const).map((dec) => (
                        <button
                          key={dec}
                          onClick={() => setDecisionType(dec)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                            decisionType === dec
                              ? 'bg-tertiary text-on-tertiary'
                              : 'bg-surface text-on-surface-variant border border-outline/10'
                          }`}
                        >
                          {dec}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-surface border border-outline/15 font-serif text-xs leading-relaxed space-y-2">
                    <p>Dear {activeSubmission.authors.split(',')[0]},</p>
                    <p>
                      Thank you for submitting your manuscript entitled <strong>&ldquo;{activeSubmission.manuscriptTitle}&rdquo;</strong> (Ref: {activeSubmission.trackingNumber}) to the <em>{activeSubmission.journalName}</em>.
                    </p>
                    <p>
                      Based on the recommendations of the peer review committee, we are pleased to inform you that your manuscript has been categorized for <strong>{decisionType.toUpperCase()}</strong>.
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant italic">
                      Please address all reviewer comments and submit your revised manuscript and point-by-point rebuttal table within 21 days.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Decision letter (${decisionType}) dispatched to ${activeSubmission.authors}!`);
                      setShowDecisionComposer(false);
                    }}
                    className="w-full py-2 rounded-lg bg-tertiary text-on-tertiary text-xs font-bold cursor-pointer hover:bg-tertiary/90 transition-colors"
                  >
                    Dispatch Official Decision Notice
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="lg:col-span-7 flex items-center justify-center p-8 text-xs text-on-surface-variant">
              Select a manuscript to view editorial reviews and workflow actions.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
