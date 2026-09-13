import React from 'react';
import { Language } from '../types';

interface ELearningBannerProps {
  currentLanguage: Language;
  onStartLearning: () => void;
  onBrowseCourses: () => void;
}

export const ELearningBanner: React.FC<ELearningBannerProps> = ({
  currentLanguage,
  onStartLearning,
  onBrowseCourses,
}) => {
  return (
    <section className="px-gutter-mobile py-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl bg-gradient-to-br from-primary-container via-slate-900 to-primary-container text-surface overflow-hidden shadow-xl border border-secondary/20 p-6 md:p-8">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">school</span>
                <span>Interactive Learning Suite</span>
              </div>

              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-3xl font-bold text-white leading-tight">
                E-Learning: Learn at your own pace with our online courses
              </h2>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                Empowering university students, researchers, and language learners with video lectures, scientific presentation coaching, and accredited academic certificates.
              </p>

              {/* Feature Checklist */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {[
                  'Video lessons & presentations',
                  'Interactive module quizzes',
                  'Real-time progress tracking',
                  'Certificates of completion',
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-secondary/30 text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={onStartLearning}
                  className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-sm hover:brightness-105 active:scale-95 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">play_circle</span>
                  <span>Start Learning</span>
                </button>
                <button
                  onClick={onBrowseCourses}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  <span>Browse All Courses</span>
                </button>
              </div>
            </div>

            {/* Right Visual Card with Student & Progress Preview */}
            <div className="w-full lg:w-96 flex flex-col items-center">
              <div className="w-full rounded-2xl bg-surface-container-lowest/90 backdrop-blur-md p-4 text-on-surface shadow-2xl border border-white/20 space-y-3">
                {/* Course Thumbnail */}
                <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                    alt="E-Learning Student"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button
                      onClick={onStartLearning}
                      className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[28px]">play_arrow</span>
                    </button>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                    18 min • HD
                  </span>
                </div>

                {/* Progress bar and details */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-on-surface">English Language Beginner</span>
                    <span className="font-bold text-secondary">60% Complete</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '60%' }} />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-on-surface-variant">
                    <span>Instructor: Mr. Feysal Hussein</span>
                    <span className="text-secondary font-semibold">Lesson 3 of 5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
