import React, { useState } from 'react';
import { InteractiveProof, ProofAnnotation, ServiceRequest } from '../types';

interface InteractiveProofModalProps {
  request: ServiceRequest;
  onClose: () => void;
  onSubmitRevisionsFromProofs: (annotations: ProofAnnotation[]) => void;
  onApproveAllProofs: () => void;
}

export const InteractiveProofModal: React.FC<InteractiveProofModalProps> = ({
  request,
  onClose,
  onSubmitRevisionsFromProofs,
  onApproveAllProofs,
}) => {
  // Default interactive demo slides if none in request
  const defaultProofs: InteractiveProof[] = request.proofs && request.proofs.length > 0
    ? request.proofs
    : [
        {
          id: 'prf-1',
          pageNumber: 1,
          title: 'Title Slide & Committee Endorsement',
          previewType: 'slide',
          headline: request.projectTitle,
          bulletPoints: [
            `Principal Investigator: ${request.clientName}`,
            `Institutional Affiliation: ${request.affiliation}`,
            `Editorial Composition: Wirtuu Kompiitaraa Ilillii • Haramaya University`,
            `Target Defense Date: ${request.expectedDeadline || 'September 2026'}`,
          ],
          notes: 'Standardized 16:9 widescreen layout with high-contrast Haramaya green & gold accents.',
          status: 'Approved',
          annotations: [],
        },
        {
          id: 'prf-2',
          pageNumber: 2,
          title: 'Problem Statement & Agro-Ecological Rationale',
          previewType: 'slide',
          headline: 'Critical Limitations in Current Regional Crop Management',
          bulletPoints: [
            'Empirical baseline: 42% nutrient runoff observed in untreated test plots across Eastern Hararghe.',
            'High soil salinity index limits conventional nitrogen uptake by regional sorghum cultivars.',
            'Proposed intervention: Targeted microbial inoculant consortium yielding balanced bio-availability.',
            '3-Second Cognitive Rule applied: Key takeaway highlighted in high-contrast data badge.',
          ],
          notes: 'Includes high-contrast problem callout box and regional map vector.',
          status: 'Approved',
          annotations: [],
        },
        {
          id: 'prf-3',
          pageNumber: 3,
          title: 'Statistical Regression: Inoculant Density vs. Yield (ANOVA)',
          previewType: 'slide',
          headline: 'Significant Yield Enhancement Under Bio-Consortium Treatment',
          bulletPoints: [
            'ANOVA statistical test confirms significance at p < 0.001 across three seasonal harvests.',
            'Treatment 3 (T3: Bio-Inoculant + Organic Compost) achieved +38.4% dry biomass versus control.',
            'Regression coefficient R² = 0.942 indicates robust predictability across varying soil pH levels.',
            'Error bars indicate standard error of the mean (SEM ± 1.84, n = 36).',
          ],
          notes: 'High-resolution SVG regression curve and comparative bar chart embedded.',
          status: 'Needs Revision',
          annotations: [
            {
              id: 'ann-1',
              slideOrPageNumber: 3,
              snippetTitle: 'Regression Legend',
              comment: 'Please change the control group data plot color from gray to navy blue for high-contrast presentation projection.',
              author: request.clientName,
              authorRole: 'client',
              createdAt: '2026-09-11 16:45',
              resolved: false,
            },
          ],
        },
        {
          id: 'prf-4',
          pageNumber: 4,
          title: 'Comparative Treatment Matrix & Field Photographs',
          previewType: 'slide',
          headline: 'Root Morphology & Mycorrhizal Colonization Rates',
          bulletPoints: [
            'Root architecture scans show 2.8x lateral branching expansion in treated sorghum roots.',
            'Mycorrhizal spore colonization density reached 74.2% vs. 21.5% in uninoculated plots.',
            'Photomicrograph figure captions formatted according to Haramaya Thesis Editorial Standard.',
            'Bilingual taxonomic labels provided in Latin botanical nomenclature and Afaan Oromoo/Amharic.',
          ],
          notes: 'Contains side-by-side high-res photomicrograph comparison with 50µm scale bar.',
          status: 'Pending Review',
          annotations: [],
        },
        {
          id: 'prf-5',
          pageNumber: 5,
          title: 'Defense Conclusions & Policy Recommendations',
          previewType: 'slide',
          headline: 'Actionable Framework for Regional Agricultural Extension',
          bulletPoints: [
            'Bio-fertilizer consortium offers scalable, low-cost alternative for smallholder farming communities.',
            'Zero chemical runoff detected in downstream groundwater sampling sites.',
            'Recommend immediate phase-2 multi-location trials across Oromia agricultural bureaus.',
            'Thesis defense question-jump index configured for rapid hyperlinked navigation during committee Q&A.',
          ],
          notes: 'Final slide includes quick-jump buttons to Methodology, Raw Data, and Bibliography appendix.',
          status: 'Pending Review',
          annotations: [],
        },
      ];

  const [proofs, setProofs] = useState<InteractiveProof[]>(defaultProofs);
  const [activeProofIndex, setActiveProofIndex] = useState<number>(0);
  const [newAnnotationText, setNewAnnotationText] = useState<string>('');
  const [annotationCategory, setAnnotationCategory] = useState<string>('Typography / Layout');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const activeProof = proofs[activeProofIndex] || proofs[0];

  const showNotification = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleToggleProofStatus = (proofId: string) => {
    setProofs((prev) =>
      prev.map((p) => {
        if (p.id !== proofId) return p;
        const newStatus = p.status === 'Approved' ? 'Needs Revision' : 'Approved';
        return { ...p, status: newStatus };
      })
    );
    showNotification(`Slide ${activeProof.pageNumber} status updated.`);
  };

  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnotationText.trim()) return;

    const newAnn: ProofAnnotation = {
      id: `ann-${Date.now()}`,
      slideOrPageNumber: activeProof.pageNumber,
      snippetTitle: `${annotationCategory}: Slide ${activeProof.pageNumber}`,
      comment: newAnnotationText.trim(),
      author: request.clientName || 'Dr. Getachew Tadesse',
      authorRole: 'client',
      createdAt: 'Just now',
      resolved: false,
    };

    setProofs((prev) =>
      prev.map((p) => {
        if (p.id !== activeProof.id) return p;
        return {
          ...p,
          status: 'Needs Revision',
          annotations: [...p.annotations, newAnn],
        };
      })
    );

    setNewAnnotationText('');
    showNotification(`Annotation pinned to Slide ${activeProof.pageNumber}!`);
  };

  const allAnnotations = proofs.flatMap((p) => p.annotations);

  const handleSendAllRevisions = () => {
    if (allAnnotations.length === 0) {
      showNotification('No annotations found. Add comments to specific slides before submitting.');
      return;
    }
    onSubmitRevisionsFromProofs(allAnnotations);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 max-w-6xl w-full max-h-[94vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30">
              <span className="material-symbols-outlined text-[24px]">view_carousel</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span>Interactive Proof & Defense Slide Studio</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-mono font-bold">
                  {request.id}
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant">
                Review typeset slides page-by-page, pin precise editorial annotations, or sign off for defense
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Feedback Toast */}
        {feedbackToast && (
          <div className="bg-secondary text-on-secondary px-4 py-2 text-xs font-bold text-center animate-in slide-in-from-top-2">
            {feedbackToast}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Top Carousel Selector */}
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {proofs.map((proof, idx) => (
                <button
                  key={proof.id}
                  onClick={() => setActiveProofIndex(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
                    activeProofIndex === idx
                      ? 'bg-secondary text-on-secondary border-secondary shadow-sm'
                      : 'bg-surface-container-lowest border-outline-variant/20 text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="text-[11px] opacity-80">#{proof.pageNumber}</span>
                  <span className="truncate max-w-[130px]">{proof.title}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      proof.status === 'Approved'
                        ? 'bg-emerald-400'
                        : proof.status === 'Needs Revision'
                        ? 'bg-rose-400'
                        : 'bg-amber-400'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 shrink-0 pl-4">
              <span className="text-xs text-on-surface-variant">
                Slide {activeProofIndex + 1} of {proofs.length}
              </span>
              <button
                disabled={activeProofIndex === 0}
                onClick={() => setActiveProofIndex((i) => Math.max(0, i - 1))}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface disabled:opacity-40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                disabled={activeProofIndex === proofs.length - 1}
                onClick={() => setActiveProofIndex((i) => Math.min(proofs.length - 1, i + 1))}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface disabled:opacity-40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Main Inspection Grid: Slide Display on Left, Markup Panel on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Slide Mockup Canvas (8 cols on lg) */}
            <div className="lg:col-span-8 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">tv</span>
                  <span>16:9 Academic Defense Canvas Preview</span>
                </span>
                <button
                  onClick={() => handleToggleProofStatus(activeProof.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    activeProof.status === 'Approved'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {activeProof.status === 'Approved' ? 'check_circle' : 'flag'}
                  </span>
                  <span>{activeProof.status} (Click to toggle)</span>
                </button>
              </div>

              {/* Realistic High-Res Slide Presentation Card */}
              <div className="w-full aspect-16/9 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-700 flex flex-col justify-between relative overflow-hidden group">
                
                {/* Haramaya Watermark Accent */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-tr-full pointer-events-none" />

                {/* Top Slide Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                      HARAMAYA UNIVERSITY • DOCTORAL DEFENSE DECK
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    SLIDE {String(activeProof.pageNumber).padStart(2, '0')} / {String(proofs.length).padStart(2, '0')}
                  </span>
                </div>

                {/* Center Content */}
                <div className="space-y-4 my-auto relative z-10 py-2">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      {activeProof.title}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-snug tracking-tight font-serif">
                      {activeProof.headline}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {activeProof.bulletPoints.map((bp, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-200"
                      >
                        <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{bp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/80 text-[10px] text-slate-400 relative z-10">
                  <span>Typeset by Wirtuu Kompiitaraa Ilillii • Director Mr. Feysal Hussein</span>
                  <span>Cognitive 3-Second Rule Compliant • Confidential Academic Proof</span>
                </div>
              </div>

              {/* Slide Note */}
              <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-xs text-on-surface-variant flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                  lightbulb
                </span>
                <span>
                  <strong>Typesetter Note:</strong> {activeProof.notes}
                </span>
              </div>
            </div>

            {/* Slide Annotations & Markup Studio (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
              
              {/* Pinned Annotations List */}
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex-1 flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-3">
                  <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">sticky_note_2</span>
                    <span>Slide {activeProof.pageNumber} Annotations ({activeProof.annotations.length})</span>
                  </h4>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 max-h-48">
                  {activeProof.annotations.length === 0 ? (
                    <div className="py-6 text-center text-xs text-on-surface-variant space-y-1">
                      <span className="material-symbols-outlined text-[24px] opacity-40">edit_note</span>
                      <p>No annotations pinned on this slide yet.</p>
                      <p className="text-[10px] opacity-75">Use the form below to submit specific modifications.</p>
                    </div>
                  ) : (
                    activeProof.annotations.map((ann) => (
                      <div
                        key={ann.id}
                        className="p-3 rounded-lg bg-surface-container border border-outline-variant/30 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-secondary">{ann.snippetTitle}</span>
                          <span className="text-on-surface-variant">{ann.createdAt}</span>
                        </div>
                        <p className="text-on-surface leading-relaxed">{ann.comment}</p>
                        <span className="text-[10px] text-on-surface-variant font-medium block">
                          By {ann.author}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Annotation Form */}
                <form onSubmit={handleAddAnnotation} className="pt-3 border-t border-outline-variant/20 space-y-2 mt-2">
                  <span className="text-[11px] font-bold text-on-surface block">
                    Pin New Modification Request:
                  </span>
                  <div className="flex gap-1.5">
                    {['Layout & Color', 'Citation / Data', 'Fidel / Ge’ez / Arabic'].map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setAnnotationCategory(cat)}
                        className={`text-[10px] px-2 py-0.5 rounded transition-all cursor-pointer ${
                          annotationCategory === cat
                            ? 'bg-secondary text-on-secondary font-bold'
                            : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    placeholder={`Write specific revision note for Slide ${activeProof.pageNumber}...`}
                    value={newAnnotationText}
                    onChange={(e) => setNewAnnotationText(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-surface border border-outline-variant/30 text-xs text-on-surface focus:outline-hidden focus:border-secondary transition-all"
                  />

                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-secondary text-on-secondary text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_comment</span>
                    <span>Pin Note to Slide {activeProof.pageNumber}</span>
                  </button>
                </form>
              </div>

              {/* Total Revision Package Summary */}
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-on-surface">Overall Deck Status:</span>
                  <span className="font-mono font-bold text-secondary">
                    {proofs.filter((p) => p.status === 'Approved').length} / {proofs.length} Approved
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleSendAllRevisions}
                    disabled={allAnnotations.length === 0}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>Submit {allAnnotations.length} Revision Notes to Editor</span>
                  </button>

                  <button
                    onClick={() => {
                      onApproveAllProofs();
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Sign Off & Approve All Slides</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface-container border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
          <span>Haramaya Academic Slides Studio • Synchronized with Production Desk</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-bold text-xs cursor-pointer"
          >
            Close Studio
          </button>
        </div>

      </div>
    </div>
  );
};
