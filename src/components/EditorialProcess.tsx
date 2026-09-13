import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface EditorialProcessProps {
  currentLanguage: Language;
  onRequestClick: () => void;
}

export const EditorialProcess: React.FC<EditorialProcessProps> = ({
  currentLanguage,
  onRequestClick,
}) => {
  const t = translations[currentLanguage];

  const steps = [
    {
      num: '1',
      stepTag: 'STEP 01',
      title: t.step1Title,
      desc: t.step1Desc,
    },
    {
      num: '2',
      stepTag: 'STEP 02',
      title: t.step2Title,
      desc: t.step2Desc,
    },
    {
      num: '3',
      stepTag: 'STEP 03',
      title: t.step3Title,
      desc: t.step3Desc,
    },
    {
      num: '4',
      stepTag: 'STEP 04',
      title: t.step4Title,
      desc: t.step4Desc,
    },
  ];

  return (
    <section className="px-gutter-mobile py-space-md bg-surface-container-low border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto">
        <div className="mb-space-sm">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
            Standard of Excellence
          </span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            {t.howItWorksTitle}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {t.howItWorksSubtitle}
          </p>
        </div>

        <div className="relative pl-6 space-y-space-md before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/40">
          {steps.map((step) => (
            <div key={step.num} className="relative">
              <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[10px] font-bold shadow-xs">
                {step.num}
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-lowest border border-outline-variant/15 shadow-sm hover:border-secondary/30 transition-all">
                <span className="font-label-sm text-label-sm text-secondary font-bold">
                  {step.stepTag}
                </span>
                <h3 className="font-title-sm text-title-sm text-on-surface font-semibold mt-0.5">
                  {step.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onRequestClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:opacity-95 active:scale-95 transition-all shadow cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">post_add</span>
            <span>Initiate Project Under Step 1</span>
          </button>
        </div>
      </div>
    </section>
  );
};
