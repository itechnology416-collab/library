import React, { useState } from 'react';
import { Language, ServiceCategory } from '../types';
import { translations } from '../utils/translations';

interface WorkloadEstimatorProps {
  currentLanguage: Language;
  onEstimateSubmit: (pages: number, category: ServiceCategory) => void;
  onOpenQuotation?: (pages: number, category: ServiceCategory) => void;
  onOpenDiagnostic?: () => void;
}

export const WorkloadEstimator: React.FC<WorkloadEstimatorProps> = ({
  currentLanguage,
  onEstimateSubmit,
  onOpenQuotation,
  onOpenDiagnostic,
}) => {
  const [pages, setPages] = useState<number>(25);
  const [selectedService, setSelectedService] = useState<ServiceCategory>('ppt');

  const t = translations[currentLanguage];

  const getTimeline = (count: number): string => {
    if (count <= 15) return '1 - 2 Days';
    if (count <= 40) return '3 - 5 Days';
    if (count <= 80) return '6 - 9 Days';
    return '10 - 14 Days';
  };

  const getIntensityBadge = (count: number): { label: string; color: string } => {
    if (count <= 15) return { label: 'Rapid Track', color: 'text-tertiary-container bg-tertiary-fixed' };
    if (count <= 40) return { label: 'Standard Peer Review', color: 'text-secondary bg-secondary-fixed' };
    return { label: 'Comprehensive Monograph', color: 'text-primary bg-primary-fixed' };
  };

  const badge = getIntensityBadge(pages);

  return (
    <section className="px-gutter-mobile py-space-sm">
      <div className="max-w-7xl mx-auto">
        <div className="p-space-md rounded-2xl bg-surface-container border border-outline-variant/20 flex flex-col gap-space-sm shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">
                calculate
              </span>
              <h3 className="font-title-sm text-title-sm font-bold text-on-surface">
                {t.publishingEstimatorTitle}
              </h3>
            </div>
            <span className="text-label-sm font-label-sm text-secondary font-semibold">
              {t.instantQuote}
            </span>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {t.estimatorSubtitle}
          </p>

          <div className="space-y-3 pt-1">
            {/* Service Scope Selection */}
            <div>
              <label className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 block">
                Select Service Scope
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  { id: 'ppt' as ServiceCategory, label: 'PPT / Thesis Slides' },
                  { id: 'english_book' as ServiceCategory, label: 'English Workbook' },
                  { id: 'oromoo_book' as ServiceCategory, label: 'Afaan Oromoo Book' },
                  { id: 'arabic_book' as ServiceCategory, label: 'Arabic & Tajweed' },
                  { id: 'amharic_book' as ServiceCategory, label: 'Amharic Monograph' },
                  { id: 'translation' as ServiceCategory, label: '4-Way Translation' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedService(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-left truncate cursor-pointer ${
                      selectedService === item.id
                        ? 'bg-secondary text-on-secondary shadow-sm'
                        : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div>
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                <span>{t.manuscriptVolume}</span>
                <span className="text-secondary font-bold" id="pageCountDisplay">
                  {pages} {t.pagesOrSlides}
                </span>
              </div>
              <input
                className="w-full accent-secondary h-2.5 bg-surface-container-highest rounded-lg cursor-pointer transition-all"
                id="pageSlider"
                max={150}
                min={5}
                type="range"
                value={pages}
                onChange={(e) => setPages(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-[11px] text-on-surface-variant px-0.5 mt-1">
                <span>5 Pages / Slides</span>
                <span>75 Pages</span>
                <span>150 Pages (Max)</span>
              </div>
            </div>

            {/* Estimates Grid */}
            <div className="grid grid-cols-3 gap-space-xs text-center pt-1">
              <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/10 shadow-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant block text-[11px]">
                  {t.estimatedTimeline}
                </span>
                <span
                  className="font-title-sm text-title-sm text-on-surface font-bold mt-0.5 block"
                  id="timelineEstimate"
                >
                  {getTimeline(pages)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/10 shadow-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant block text-[11px]">
                  {t.languageHandling}
                </span>
                <span className="font-title-sm text-title-sm text-secondary font-bold mt-0.5 block">
                  Bilingual / RTL
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/10 shadow-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant block text-[11px]">
                  Pace Tier
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold mt-0.5 inline-block ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={() => onEstimateSubmit(pages, selectedService)}
                className="flex-1 h-11 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition-all shadow cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Submit Estimate ({pages} Pages)</span>
              </button>

              {onOpenQuotation && (
                <button
                  type="button"
                  onClick={() => onOpenQuotation(pages, selectedService)}
                  className="px-4 h-11 rounded-lg bg-surface-container-highest hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 border border-outline-variant/30 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">receipt_long</span>
                  <span>Pro-Forma Quotation</span>
                </button>
              )}

              {onOpenDiagnostic && (
                <button
                  type="button"
                  onClick={onOpenDiagnostic}
                  className="px-3 h-11 rounded-lg bg-surface-container-highest hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 border border-outline-variant/30 cursor-pointer transition-colors"
                  title="Run Pre-Flight Linguistic Audit on your draft"
                >
                  <span className="material-symbols-outlined text-tertiary text-[18px]">spellcheck</span>
                  <span>Manuscript Audit</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
