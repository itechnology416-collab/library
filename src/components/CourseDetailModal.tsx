import React, { useState } from 'react';
import { Course } from '../types';

interface CourseDetailModalProps {
  course: Course;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
  onStartLearning: (course: Course) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  onEnroll,
  onStartLearning,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');

  const whatYouWillLearn = [
    'Parts of speech and fundamental sentence structures',
    'Verb tenses, irregular verb conjugations & aspect rules',
    'Common academic & spoken grammatical pitfalls to avoid',
    'Doctoral and master’s thesis level transition phrases',
    'Interactive self-assessment exercises with answer rationales',
  ];

  const courseFeatures = [
    { icon: 'smart_display', text: 'Video & audio lessons' },
    { icon: 'article', text: 'Interactive text lectures' },
    { icon: 'picture_as_pdf', text: 'Downloadable PDF guides' },
    { icon: 'quiz', text: 'End-of-module assessment quizzes' },
    { icon: 'trending_up', text: 'Real-time progress tracking' },
    { icon: 'workspace_premium', text: 'Haramaya academic certificate' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center overflow-y-auto">
      <div className="bg-surface-container-lowest w-full max-w-4xl rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-outline-variant/15 flex items-center justify-between bg-surface-container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant truncate">
            <span>Home</span>
            <span>/</span>
            <span>Courses</span>
            <span>/</span>
            <span className="text-secondary font-bold truncate">{course.title}</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-highest hover:bg-surface-container flex items-center justify-center text-on-surface cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Hero Banner inside detail view */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-secondary text-on-secondary text-[11px] font-bold uppercase tracking-wider">
                  {course.level}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface text-[11px] font-semibold">
                  {course.duration}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface text-[11px] font-semibold">
                  {course.lessons.length} Lessons
                </span>
              </div>

              <h2 className="font-headline-sm text-headline-sm sm:text-2xl font-bold text-on-surface">
                {course.title}
              </h2>

              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                {course.description}
              </p>

              {/* Instructor Card */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  FH
                </div>
                <div>
                  <h4 className="font-title-sm text-xs font-bold text-on-surface">
                    {course.instructor}
                  </h4>
                  <p className="text-[11px] text-secondary font-semibold">
                    Academic Director • Haramaya University
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                {course.enrolled ? (
                  <button
                    onClick={() => {
                      onClose();
                      onStartLearning(course);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-sm hover:brightness-105 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                    <span>Continue Learning ({course.progress}%)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onEnroll(course.id)}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                    <span>Enroll Now (Free Access)</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>

            {/* Course Visual Card */}
            <div className="w-full lg:w-80 rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-outline-variant/20 shrink-0">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-4 space-y-3 bg-surface-container-lowest text-on-surface">
                <h4 className="font-title-sm text-xs font-bold uppercase tracking-wider text-secondary">
                  Course Features Included
                </h4>
                <div className="space-y-2 text-xs">
                  {courseFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        {feat.icon}
                      </span>
                      <span>{feat.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-outline-variant/15">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'curriculum', label: `Curriculum (${course.lessons.length})` },
              { id: 'reviews', label: 'Student Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-container">
                <h4 className="font-title-sm text-sm font-bold text-on-surface mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    task_alt
                  </span>
                  <span>What You'll Learn in This Course</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-on-surface">
                      <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0 mt-0.5">
                        check
                      </span>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-2">
              <h4 className="font-title-sm text-sm font-bold text-on-surface mb-2">
                Lessons & Interactive Syllabus
              </h4>
              <div className="space-y-2">
                {course.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="p-3 rounded-xl bg-surface-container flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-secondary/15 text-secondary font-bold flex items-center justify-center text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-on-surface">{lesson.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span>{lesson.duration}</span>
                      {lesson.completed && (
                        <span className="material-symbols-outlined text-emerald-600 text-[16px]">
                          check_circle
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-surface-container space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-on-surface">Dr. Getachew T. (Agriculture Faculty)</span>
                  <span className="text-amber-500 text-xs">★★★★★</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  "The slide hierarchy principles and cognitive layout rules completely transformed my defense delivery. Highly recommended for any researcher."
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface-container space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-on-surface">Fatima M. (Linguistics Graduate)</span>
                  <span className="text-amber-500 text-xs">★★★★★</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  "Clear, practical examples and excellent Tajweed phonetic breakdowns that cannot be found elsewhere."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
