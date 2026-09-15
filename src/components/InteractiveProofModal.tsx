import React, { useState } from 'react';
import {
  Tv,
  BookOpen,
  CheckCircle2,
  Flag,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Plus,
  Send,
  Printer,
  Sparkles,
  Award,
  StickyNote,
  HelpCircle,
} from 'lucide-react';
import { InteractiveProof, ProofAnnotation, ServiceRequest } from '../types';
import { Modal, Button, Badge, Textarea } from './ui';

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
  const isBookProject = [
    'english_book',
    'arabic_book',
    'oromoo_book',
    'amharic_book',
    'formatting',
  ].includes(request.serviceCategory);

  const [viewMode, setViewMode] = useState<'slide' | 'book_page'>(
    isBookProject ? 'book_page' : 'slide'
  );
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Default interactive demo slides/pages if none in request
  const defaultProofs: InteractiveProof[] =
    request.proofs && request.proofs.length > 0
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
              `Target Defense Date: ${request.expectedDeadline || 'Academic Term 2026'}`,
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
                comment:
                  'Please change the control group data plot color from gray to navy blue for high-contrast presentation projection.',
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
            title: 'Comparative Treatment Matrix & Field Micrographs',
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
  const [annotationCategory, setAnnotationCategory] = useState<string>('Typography & Layout');
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
    showNotification(`Item ${activeProof.pageNumber} status changed.`);
  };

  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnotationText.trim()) return;

    const newAnn: ProofAnnotation = {
      id: `ann-${Date.now()}`,
      slideOrPageNumber: activeProof.pageNumber,
      snippetTitle: `${annotationCategory}: Page/Slide ${activeProof.pageNumber}`,
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

  const approvedCount = proofs.filter((p) => p.status === 'Approved').length;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="full"
      title={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full pr-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base md:text-lg text-on-surface">
                  Interactive Academic Proof Studio
                </span>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {request.id}
                </Badge>
              </div>
              <p className="text-xs text-on-surface-variant font-normal">
                High-fidelity typesetting inspection with pin-point revision annotations
              </p>
            </div>
          </div>

          {/* View Mode & Zoom Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-surface-container rounded-xl p-1 border border-outline-variant/30 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('slide')}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'slide'
                    ? 'bg-surface text-secondary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>16:9 Deck</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('book_page')}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'book_page'
                    ? 'bg-surface text-secondary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>6x9 Book</span>
              </button>
            </div>

            {/* Zoom */}
            <div className="hidden sm:flex items-center gap-1 bg-surface-container rounded-xl p-1 border border-outline-variant/30 text-xs">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                className="p-1 rounded hover:bg-surface text-on-surface-variant"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1 font-semibold">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="p-1 rounded hover:bg-surface text-on-surface-variant"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs font-semibold"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              <span>Print Proof</span>
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Navigation Filmstrip */}
        <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1 whitespace-nowrap">
              Slides / Pages:
            </span>
            <div className="flex items-center gap-1.5">
              {proofs.map((proof, idx) => {
                const isActive = idx === activeProofIndex;
                return (
                  <button
                    key={proof.id}
                    onClick={() => setActiveProofIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-secondary text-on-secondary shadow-xs scale-105'
                        : 'bg-surface-container-lowest text-on-surface border border-outline-variant/20 hover:border-secondary/40'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    <span className="hidden md:inline font-normal text-[11px] truncate max-w-[100px]">
                      {proof.title}
                    </span>
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
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-on-surface-variant font-mono">
              {activeProofIndex + 1} / {proofs.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={activeProofIndex === 0}
              onClick={() => setActiveProofIndex((i) => Math.max(0, i - 1))}
              className="p-1 h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={activeProofIndex === proofs.length - 1}
              onClick={() => setActiveProofIndex((i) => Math.min(proofs.length - 1, i + 1))}
              className="p-1 h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Inspection Grid: Left is Proof Display, Right is Annotation Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Display Area (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                {viewMode === 'slide' ? (
                  <>
                    <Tv className="w-4 h-4 text-secondary" />
                    <span>16:9 Academic Defense Canvas Preview</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 text-secondary" />
                    <span>6x9 Scholarly Book Layout (A5 Pre-Press Proof)</span>
                  </>
                )}
              </span>

              <button
                type="button"
                onClick={() => handleToggleProofStatus(activeProof.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeProof.status === 'Approved'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-500/30'
                }`}
              >
                {activeProof.status === 'Approved' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Flag className="w-3.5 h-3.5 text-rose-600" />
                )}
                <span>{activeProof.status} (Toggle)</span>
              </button>
            </div>

            {/* Proof Container */}
            <div
              className="w-full flex items-center justify-center p-2 rounded-2xl bg-surface-container overflow-hidden"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {viewMode === 'slide' ? (
                /* 16:9 Presentation Deck Slide */
                <div className="w-full aspect-16/9 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-700 flex flex-col justify-between relative overflow-hidden group">
                  {/* Decorative Accents */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-tr-full pointer-events-none" />

                  {/* Header Bar */}
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                        HARAMAYA UNIVERSITY • DOCTORAL DEFENSE DECK
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      SLIDE {String(activeProof.pageNumber).padStart(2, '0')} /{' '}
                      {String(proofs.length).padStart(2, '0')}
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

                  {/* Footer Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700/80 text-[10px] text-slate-400 relative z-10">
                    <span>Typeset by Wirtuu Kompiitaraa Ilillii • Director Mr. Feysal Hussein</span>
                    <span>Cognitive 3-Second Rule Compliant • Confidential Academic Proof</span>
                  </div>
                </div>
              ) : (
                /* 6x9 Academic Book Interior Page Layout */
                <div className="w-full max-w-xl aspect-[1/1.414] bg-[#fcfbf7] dark:bg-slate-900 rounded-xl p-8 sm:p-10 text-slate-800 dark:text-slate-100 shadow-xl border border-amber-900/20 flex flex-col justify-between font-serif relative">
                  {/* Running Header */}
                  <div className="flex items-center justify-between border-b border-amber-900/20 pb-2 text-[11px] tracking-wider uppercase text-slate-600 dark:text-slate-400">
                    <span>Chapter {activeProof.pageNumber}: {activeProof.title}</span>
                    <span className="font-mono font-bold">{activeProof.pageNumber}</span>
                  </div>

                  {/* Book Interior Body */}
                  <div className="py-4 space-y-4 text-xs leading-relaxed text-justify">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif border-b border-amber-900/10 pb-1">
                      {activeProof.headline}
                    </h3>

                    {/* Classic Drop Cap Paragraph */}
                    <p className="indent-4 leading-relaxed">
                      <span className="float-left text-3xl font-black font-serif leading-none pr-2 pt-1 text-amber-800 dark:text-amber-400">
                        {activeProof.headline.charAt(0)}
                      </span>
                      {activeProof.bulletPoints[0] ||
                        'The empirical baseline indicates rigorous scholarly inquiry into regional pedagogical frameworks, establishing reliable benchmarks across university academic programs.'}
                    </p>

                    {activeProof.bulletPoints.slice(1).map((bp, i) => (
                      <p key={i} className="indent-4 leading-relaxed">
                        {bp}
                      </p>
                    ))}

                    {/* Ethiopic / Ge'ez or Arabic Typesetting Sample if Multilingual */}
                    {request.targetLanguage === 'am' && (
                      <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-xs font-sans text-slate-800 dark:text-slate-200">
                        <strong>የሐረማያ ዩኒቨርሲቲ ማተሚያ ቤት፡</strong> በምርምርና ስነ-ጽሑፍ ዝግጅት ላይ የተመሰረተ የጥራት ደረጃ።
                      </div>
                    )}
                    {request.targetLanguage === 'ar' && (
                      <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs font-sans text-right dir-rtl leading-loose text-slate-800 dark:text-slate-200">
                        <strong>مطبعة جامعة هرمايا:</strong> إعداد الأطروحات والمؤلفات الأكاديمية وضبط المصطلحات العلمية بدقة عالية.
                      </div>
                    )}
                    {request.targetLanguage === 'or' && (
                      <div className="p-2.5 rounded bg-secondary/10 border border-secondary/20 text-xs font-sans text-slate-800 dark:text-slate-200">
                        <strong>Wirtuu Kompiitaraa Ilillii:</strong> Qorannoo fi qophii kitaabaa saayinsawaa Yuunivarsiitii Haramayaa keessatti.
                      </div>
                    )}
                  </div>

                  {/* Footnotes Area */}
                  <div className="pt-3 border-t border-amber-900/20 text-[10px] text-slate-500 space-y-1">
                    <div>1. Typeset in Linotype Palatino / Nyala font with pre-press bleeding margin calibration.</div>
                    <div>2. Wirtuu Kompiitaraa Ilillii Press standard academic release #HU-PRESS-2026.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Typesetter Note */}
            <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 text-xs text-on-surface-variant flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>
                <strong>Typesetter Note:</strong> {activeProof.notes || 'Meets standard university formatting guidelines.'}
              </span>
            </div>
          </div>

          {/* Annotation & Markup Studio (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            {/* Pinned Annotations List */}
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 shadow-xs flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-3">
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <StickyNote className="w-4 h-4 text-secondary" />
                  <span>
                    Item {activeProof.pageNumber} Annotations ({activeProof.annotations.length})
                  </span>
                </h4>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 max-h-52">
                {activeProof.annotations.length === 0 ? (
                  <div className="py-6 text-center text-xs text-on-surface-variant space-y-1">
                    <StickyNote className="w-7 h-7 mx-auto opacity-40" />
                    <p>No annotations pinned on this item yet.</p>
                    <p className="text-[10px] opacity-75">
                      Use the markup form below to submit specific revision requests.
                    </p>
                  </div>
                ) : (
                  activeProof.annotations.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-3 rounded-lg bg-surface border border-outline-variant/30 text-xs space-y-1"
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
              <form onSubmit={handleAddAnnotation} className="pt-3 border-t border-outline-variant/20 space-y-2.5 mt-2">
                <span className="text-[11px] font-bold text-on-surface block">
                  Pin New Modification Request:
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    'Typography & Layout',
                    'Citation & Data',
                    'Fidel / Ge’ez / Arabic',
                    'Figure & Chart',
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setAnnotationCategory(cat)}
                      className={`text-[10px] px-2 py-0.5 rounded transition-all ${
                        annotationCategory === cat
                          ? 'bg-secondary text-on-secondary font-bold'
                          : 'bg-surface text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <Textarea
                  rows={2}
                  placeholder={`Write specific revision note for Slide/Page ${activeProof.pageNumber}...`}
                  value={newAnnotationText}
                  onChange={(e) => setNewAnnotationText(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs font-bold justify-center"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Pin Note to Item {activeProof.pageNumber}</span>
                </Button>
              </form>
            </div>

            {/* Total Revision Package Summary & Final Actions */}
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-on-surface">Overall Review Status:</span>
                <span className="font-mono font-bold text-secondary">
                  {approvedCount} / {proofs.length} Approved
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendAllRevisions}
                  disabled={allAnnotations.length === 0}
                  className="w-full text-xs font-bold justify-center text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span>Submit {allAnnotations.length} Revision Notes to Desk</span>
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onApproveAllProofs();
                    onClose();
                  }}
                  className="w-full text-xs font-bold justify-center shadow-xs"
                >
                  <Award className="w-3.5 h-3.5 mr-1.5" />
                  <span>Sign Off & Issue University Certificate</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Footer */}
        <div className="pt-2 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant gap-2">
          <span>Haramaya Academic Slides & Monograph Studio • Synchronized with Production Desk</span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close Proof Studio
          </Button>
        </div>
      </div>
    </Modal>
  );
};
