import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { PeerReviewAssignment } from '../types';
import { Modal, Button, Badge } from './ui';

interface ManuscriptReaderModalProps {
  assignment: PeerReviewAssignment;
  onClose: () => void;
  onOpenScoring?: () => void;
  onShowToast?: (msg: string) => void;
}

export const ManuscriptReaderModal: React.FC<ManuscriptReaderModalProps> = ({
  assignment,
  onClose,
  onOpenScoring,
  onShowToast,
}) => {
  const [activeSection, setActiveSection] = useState<'abstract' | 'intro' | 'methods' | 'results' | 'discussion'>(
    'abstract'
  );
  const [copied, setCopied] = useState(false);

  const sections = [
    { id: 'abstract', label: 'Abstract & Keywords' },
    { id: 'intro', label: '1. Introduction' },
    { id: 'methods', label: '2. Materials & Methods' },
    { id: 'results', label: '3. Results & Empirical Tables' },
    { id: 'discussion', label: '4. Discussion & Conclusion' },
  ] as const;

  const handleCopyCitation = () => {
    const citation = `[Double-Blind Submission ${assignment.trackingCode}]. "${assignment.manuscriptTitle}". Submitted to ${assignment.journalFullName} (Haramaya University Press, 2026).`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    if (onShowToast) {
      onShowToast('Anonymized tracking citation copied to clipboard.');
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center border border-indigo-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-base md:text-lg text-on-surface">
                Double-Blind Manuscript Reader
              </span>
              <Badge variant="secondary" className="font-mono text-[10px]">
                {assignment.journal} • {assignment.trackingCode}
              </Badge>
              <Badge variant="success" className="text-[10px]">
                {assignment.pages} Pages • {assignment.wordCount} Words
              </Badge>
            </div>
            <p className="text-xs text-on-surface-variant font-normal">
              {assignment.authorsAnonymized}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Manuscript Header Banner */}
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-serif font-bold text-base text-on-surface">
              {assignment.manuscriptTitle}
            </span>
            <button
              onClick={handleCopyCitation}
              className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-xs font-semibold cursor-pointer shrink-0 ml-3"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Cite'}</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-on-surface-variant font-medium">Keywords:</span>
            {assignment.keywords.map((kw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-surface border border-outline-variant/30 text-[10px] text-on-surface-variant font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-outline-variant/20">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSection === s.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-surface hover:bg-surface-container text-on-surface border border-outline-variant/20'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Section Reading Container */}
        <div className="p-6 rounded-2xl bg-surface border border-outline-variant/20 text-on-surface leading-relaxed text-sm font-serif min-h-[280px] max-h-[440px] overflow-y-auto space-y-4 shadow-inner">
          {activeSection === 'abstract' && (
            <div className="space-y-4 font-sans">
              <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-1">
                  Structured Abstract
                </h4>
                <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                  {assignment.abstract}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-sans">
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <span className="font-bold block text-on-surface">Target Journal</span>
                  <span className="text-on-surface-variant">{assignment.journalFullName}</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <span className="font-bold block text-on-surface">Submission Date</span>
                  <span className="text-on-surface-variant">{assignment.submissionDate}</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <span className="font-bold block text-on-surface">Review Deadline</span>
                  <span className="text-on-surface-variant text-amber-600 font-semibold">{assignment.deadlineDate}</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <span className="font-bold block text-on-surface">Plagiarism Index</span>
                  <span className="text-emerald-600 font-semibold">
                    {assignment.similarityScorePct !== undefined ? `${assignment.similarityScorePct}% Similarity (Passed)` : 'Verified'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'intro' && (
            <div className="space-y-3">
              <h3 className="font-bold text-base text-on-surface font-sans">1. Introduction & Research Problem</h3>
              <p className="text-xs sm:text-sm text-on-surface/90 leading-relaxed indent-6">
                {assignment.sampleSections?.introduction ||
                  'The research investigation is situated within the contemporary agro-ecological and socio-economic transformation of eastern Ethiopia. Emerging empirical questions demand precise methodological delineation.'}
              </p>
              <p className="text-xs sm:text-sm text-on-surface/90 leading-relaxed indent-6">
                Prior literature from regional agricultural research centers has emphasized the imperative of sustainable resource management under erratic precipitation patterns. This paper addresses the gap by establishing a high-resolution baseline dataset.
              </p>
            </div>
          )}

          {activeSection === 'methods' && (
            <div className="space-y-3">
              <h3 className="font-bold text-base text-on-surface font-sans">2. Materials, Experimental Design & Methods</h3>
              <p className="text-xs sm:text-sm text-on-surface/90 leading-relaxed indent-6">
                {assignment.sampleSections?.methodology ||
                  'Field sampling and analytical determinations were conducted under strict protocol adherence. Randomized complete block designs (RCBD) were replicated across spatial treatment units.'}
              </p>
              <div className="p-3 rounded-xl bg-surface-container text-xs font-mono border border-outline-variant/30 space-y-1">
                <div className="font-bold text-on-surface">Experimental Matrix Parameters:</div>
                <div>• Factor A: Agroforestry canopy proximity (0m, 5m, 15m, control)</div>
                <div>• Factor B: Soil depth strata (0-15cm, 15-30cm, 30-60cm)</div>
                <div>• Analytical Method: Walkley-Black wet oxidation & Sentinel-2 BOA reflectance</div>
              </div>
            </div>
          )}

          {activeSection === 'results' && (
            <div className="space-y-3">
              <h3 className="font-bold text-base text-on-surface font-sans">3. Results & Empirical Analysis</h3>
              <p className="text-xs sm:text-sm text-on-surface/90 leading-relaxed indent-6">
                {assignment.sampleSections?.results ||
                  'Empirical measurements revealed statistically significant differences across spatial sampling intervals. All statistical comparisons were computed at alpha = 0.05 significance.'}
              </p>
              {/* Sample Data Table */}
              <div className="overflow-x-auto rounded-xl border border-outline-variant/30 text-xs font-sans">
                <table className="w-full text-left">
                  <thead className="bg-surface-container font-semibold text-on-surface">
                    <tr>
                      <th className="p-2.5">Treatment Unit</th>
                      <th className="p-2.5">Sample N</th>
                      <th className="p-2.5">Mean Metric ± SE</th>
                      <th className="p-2.5">F-Value</th>
                      <th className="p-2.5">P-Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    <tr>
                      <td className="p-2.5 font-medium">Canopy Sub-plot A</td>
                      <td className="p-2.5 font-mono">120</td>
                      <td className="p-2.5 font-mono">2.84 ± 0.32</td>
                      <td className="p-2.5 font-mono">48.2</td>
                      <td className="p-2.5 font-mono text-emerald-600">&lt; 0.001</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Intermediate Zone B</td>
                      <td className="p-2.5 font-mono">120</td>
                      <td className="p-2.5 font-mono">1.96 ± 0.21</td>
                      <td className="p-2.5 font-mono">24.7</td>
                      <td className="p-2.5 font-mono text-emerald-600">0.002</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Open Monoculture Control</td>
                      <td className="p-2.5 font-mono">120</td>
                      <td className="p-2.5 font-mono">1.18 ± 0.14</td>
                      <td className="p-2.5 font-mono">—</td>
                      <td className="p-2.5 font-mono">Ref</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'discussion' && (
            <div className="space-y-3">
              <h3 className="font-bold text-base text-on-surface font-sans">4. Discussion & Policy Implications</h3>
              <p className="text-xs sm:text-sm text-on-surface/90 leading-relaxed indent-6">
                {assignment.sampleSections?.discussion ||
                  'The findings corroborate the fundamental hypothesis regarding agro-ecological integration and provide actionable baseline evidence for regional development planning.'}
              </p>
              <p className="text-xs sm:text-sm text-on-surface/90 leading-relaxed indent-6">
                In comparison with previous studies conducted across the Rift Valley and Bale mountains, the Hararghe highland agroforestry systems display greater resiliency to seasonal precipitation fluctuations.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Double-blind protocol active: author identity and institutions encrypted.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1 sm:flex-none cursor-pointer"
            >
              Close Reader
            </Button>
            {onOpenScoring && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenScoring();
                }}
                leftIcon={<Sliders className="w-4 h-4" />}
                className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              >
                Proceed to Scoring Rubric
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
