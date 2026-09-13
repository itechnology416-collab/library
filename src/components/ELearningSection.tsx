import React, { useState } from 'react';
import { Course, Language, Lesson } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';
import { CourseDetailModal } from './CourseDetailModal';

interface ELearningSectionProps {
  currentLanguage: Language;
  courses: Course[];
  onEnrollCourse: (courseId: string) => void;
  onCompleteLesson: (courseId: string, lessonId: string) => void;
}

export const ELearningSection: React.FC<ELearningSectionProps> = ({
  currentLanguage,
  courses,
  onEnrollCourse,
  onCompleteLesson,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(courses[0] || null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(
    courses[0]?.lessons[0] || null
  );

  // Detail Modal
  const [inspectCourse, setInspectCourse] = useState<Course | null>(null);

  // Tabs under player: 'notes' | 'resources' | 'quiz' | 'sandbox'
  const [playerTab, setPlayerTab] = useState<'notes' | 'resources' | 'quiz' | 'sandbox'>('notes');

  // Interactive Notes
  const [lessonNotes, setLessonNotes] = useState<Record<string, string>>({
    'ppt-1': 'The 3-second rule is critical for examiners: headline must contain the conclusion, not just generic topics.',
  });
  const [currentNoteText, setCurrentNoteText] = useState<string>('');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState<boolean>(false);

  // Interactive LaTeX & Scholarly Sandbox State
  const [sandboxCode, setSandboxCode] = useState<string>(
    `% Haramaya University Doctoral Defense TeX Sample\n\\begin{equation}\n  \\mathcal{H}_{\\text{press}} = \\sum_{i=1}^{N} \\alpha_i \\cdot \\nabla \\Phi(\\mathbf{x}_i) + \\lambda \\| \\mathbf{w} \\|_2^2\n\\end{equation}\n\n\\textbf{Abstract Theorem:} For all phonemes in Afaan Oromoo Qubee, the glottal stop /ʔ/ induces minimal pitch deviation.`
  );
  const [sandboxTemplate, setSandboxTemplate] = useState<string>('latex');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('Scholar Abebe K.');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Video playback simulation
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    const firstLesson = course.lessons[0] || null;
    setActiveLesson(firstLesson);
    setCurrentNoteText(firstLesson ? lessonNotes[firstLesson.id] || '' : '');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setShowCertificate(false);
    setIsPlaying(false);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentNoteText(lessonNotes[lesson.id] || '');
    setIsPlaying(false);
  };

  const handleSaveNote = () => {
    if (!activeLesson) return;
    setLessonNotes((prev) => ({
      ...prev,
      [activeLesson.id]: currentNoteText,
    }));
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2500);
  };

  const handlePrevLesson = () => {
    if (!selectedCourse || !activeLesson) return;
    const currentIdx = selectedCourse.lessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIdx > 0) {
      handleSelectLesson(selectedCourse.lessons[currentIdx - 1]);
    }
  };

  const handleNextLesson = () => {
    if (!selectedCourse || !activeLesson) return;
    const currentIdx = selectedCourse.lessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIdx < selectedCourse.lessons.length - 1) {
      handleSelectLesson(selectedCourse.lessons[currentIdx + 1]);
    }
  };

  const handleQuizOptionSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateQuizScore = () => {
    if (!selectedCourse?.quiz) return 0;
    let correct = 0;
    selectedCourse.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) correct++;
    });
    return Math.round((correct / selectedCourse.quiz.length) * 100);
  };

  const currentLessonIdx = selectedCourse?.lessons.findIndex((l) => l.id === activeLesson?.id) ?? 0;

  return (
    <section className="px-gutter-mobile py-space-md" id="elearning">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
              Higher Education & Scholarly Training
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Interactive E-Learning Academy & Course Player
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Doctoral defense techniques, linguistics masterclasses, Arabic Tajweed phonetics, and academic authoring.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-surface-container text-xs font-semibold text-secondary">
              Haramaya Academic Curriculum
            </span>
          </div>
        </div>

        {/* Course Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
          {courses.map((c) => {
            const isSelected = selectedCourse?.id === c.id;
            return (
              <div
                key={c.id}
                className={`p-space-sm rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-surface-container-lowest border-secondary shadow-md ring-2 ring-secondary/20'
                    : 'bg-surface-container-lowest border-outline-variant/20 hover:border-secondary/40 shadow-xs'
                }`}
              >
                <div onClick={() => handleSelectCourse(c)} className="cursor-pointer">
                  <div className="relative h-36 rounded-lg overflow-hidden bg-surface-container mb-2 group">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                      {c.level}
                    </span>
                    {c.enrolled ? (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-secondary text-white text-[10px] font-bold">
                        Enrolled • {c.progress}%
                      </span>
                    ) : (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-semibold">
                        {c.duration}
                      </span>
                    )}
                  </div>
                  <h3 className="font-title-sm text-title-sm font-bold text-on-surface line-clamp-1">
                    {c.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 text-xs mt-1">
                    {c.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10 text-xs">
                  <button
                    onClick={() => setInspectCourse(c)}
                    className="text-secondary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Syllabus</span>
                    <span className="material-symbols-outlined text-[14px]">info</span>
                  </button>
                  <button
                    onClick={() => handleSelectCourse(c)}
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-secondary hover:text-white font-semibold transition-colors cursor-pointer"
                  >
                    {isSelected ? 'Currently Playing' : 'Open Player'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Course Player Suite */}
        {selectedCourse && (
          <div className="p-space-md rounded-2xl bg-surface-container border border-outline-variant/30 shadow-md">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left: Video Player Canvas & Tabs */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Lesson Header and Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-secondary font-bold">
                      {selectedCourse.title} • Lesson {currentLessonIdx + 1} of {selectedCourse.lessons.length}
                    </span>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">
                      {activeLesson?.title || 'Select a lesson'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedCourse.enrolled ? (
                      <button
                        onClick={() => {
                          if (activeLesson) {
                            onCompleteLesson(selectedCourse.id, activeLesson.id);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          activeLesson?.completed
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-secondary text-on-secondary shadow-xs hover:brightness-105'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {activeLesson?.completed ? 'task_alt' : 'check_circle'}
                        </span>
                        <span>
                          {activeLesson?.completed ? 'Lesson Completed' : 'Mark as Complete'}
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onEnrollCourse(selectedCourse.id)}
                        className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        Enroll to Track Progress
                      </button>
                    )}
                  </div>
                </div>

                {/* Interactive Video Player Simulation Canvas */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 text-surface aspect-video flex flex-col justify-between p-4 sm:p-6 shadow-2xl border border-outline-variant/30">
                  {/* Top Bar inside Player */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded bg-black/60 text-white text-xs font-semibold backdrop-blur-md">
                      HD 1080p • {selectedCourse.category}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-secondary/80 text-white text-xs font-bold">
                      {activeLesson?.duration}
                    </span>
                  </div>

                  {/* Center Playback Button */}
                  <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary/90 hover:bg-secondary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[40px] sm:text-[48px]">
                        {isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <p className="text-xs sm:text-sm font-semibold text-white/90 mt-3 drop-shadow">
                      {isPlaying ? 'Lecture Playing...' : 'Click to stream lecture module'}
                    </p>
                  </div>

                  {/* Bottom Video Controls Bar */}
                  <div className="space-y-2 z-10 bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                    {/* Scrub Bar */}
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                      <div
                        className="h-full bg-secondary transition-all duration-300"
                        style={{ width: isPlaying ? '72%' : '25%' }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="hover:text-white"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isPlaying ? 'pause' : 'play_arrow'}
                          </span>
                        </button>
                        <span>04:15 / {activeLesson?.duration}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hover:text-white cursor-pointer font-bold">1.0x</span>
                        <span className="material-symbols-outlined text-[18px] cursor-pointer hover:text-white">
                          volume_up
                        </span>
                        <span className="material-symbols-outlined text-[18px] cursor-pointer hover:text-white">
                          fullscreen
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lesson Navigation (Previous / Next Buttons) */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handlePrevLesson}
                    disabled={currentLessonIdx === 0}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      currentLessonIdx === 0
                        ? 'opacity-40 cursor-not-allowed bg-surface-container text-on-surface-variant'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                    <span>Previous Lesson</span>
                  </button>

                  <button
                    onClick={handleNextLesson}
                    disabled={currentLessonIdx === selectedCourse.lessons.length - 1}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      currentLessonIdx === selectedCourse.lessons.length - 1
                        ? 'opacity-40 cursor-not-allowed bg-surface-container text-on-surface-variant'
                        : 'bg-secondary text-on-secondary hover:brightness-105'
                    }`}
                  >
                    <span>Next Lesson</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>

                {/* Tabs under Player: Notes, Resources, Quiz */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 space-y-4">
                  <div className="flex items-center gap-2 border-b border-outline-variant/15 flex-wrap">
                    {[
                      { id: 'notes', label: 'Lecture Notes', icon: 'edit_note' },
                      { id: 'resources', label: 'Downloadable Resources', icon: 'folder_open' },
                      { id: 'sandbox', label: 'LaTeX & Practice Sandbox', icon: 'terminal' },
                      { id: 'quiz', label: 'Module Assessment Quiz', icon: 'quiz' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setPlayerTab(tab.id as any)}
                        className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                          playerTab === tab.id
                            ? 'border-secondary text-secondary'
                            : 'border-transparent text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab: Notes */}
                  {playerTab === 'notes' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-surface-container text-xs leading-relaxed text-on-surface">
                        <span className="font-bold text-secondary block mb-1">
                          Curriculum Reference Text:
                        </span>
                        <div className="whitespace-pre-line text-on-surface-variant">
                          {activeLesson?.content}
                        </div>
                      </div>

                      {/* Student Interactive Note-taking */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-on-surface flex items-center gap-1">
                            <span className="material-symbols-outlined text-secondary text-[16px]">
                              edit
                            </span>
                            <span>Your Personal Lesson Notes</span>
                          </label>
                          {noteSavedFeedback && (
                            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check</span>
                              <span>Notes Saved!</span>
                            </span>
                          )}
                        </div>

                        <textarea
                          rows={3}
                          value={currentNoteText}
                          onChange={(e) => setCurrentNoteText(e.target.value)}
                          placeholder="Type notes for this lesson here... (e.g., remember to emphasize delta trends on slide 4)"
                          className="w-full p-3 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                        />

                        <div className="flex justify-end">
                          <button
                            onClick={handleSaveNote}
                            className="px-4 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 cursor-pointer shadow-xs"
                          >
                            Save Notes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab: Resources */}
                  {playerTab === 'resources' && (
                    <div className="space-y-2.5">
                      {[
                        {
                          name: 'Lesson Slide Deck & Grid Templates (16:9)',
                          type: 'PPTX',
                          size: '4.2 MB',
                        },
                        {
                          name: 'Phrasal Verbs & Idioms Supplementary Worksheet',
                          type: 'PDF',
                          size: '1.8 MB',
                        },
                        {
                          name: 'Haramaya Academic Defense Checklist',
                          type: 'PDF',
                          size: '950 KB',
                        },
                      ].map((res, rIdx) => (
                        <div
                          key={rIdx}
                          className="p-3 rounded-xl bg-surface-container flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center font-bold text-[11px]">
                              {res.type}
                            </span>
                            <div>
                              <p className="font-bold text-on-surface">{res.name}</p>
                              <span className="text-[11px] text-on-surface-variant">{res.size}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => alert(`Downloading ${res.name}...`)}
                            className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-secondary hover:text-white text-on-surface font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            <span>Download</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab: Sandbox */}
                  {playerTab === 'sandbox' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-secondary text-[16px]">code</span>
                            <span>Scholarly Formatting & LaTeX Sandbox</span>
                          </h4>
                          <p className="text-[11px] text-on-surface-variant">
                            Live practice playground for thesis equations, linguistic phonetics, and academic citations.
                          </p>
                        </div>

                        {/* Template Presets */}
                        <div className="flex items-center gap-1">
                          {[
                            {
                              id: 'latex',
                              label: 'LaTeX Equation',
                              code: `% Haramaya University Doctoral Defense TeX Sample\n\\begin{equation}\n  \\mathcal{H}_{\\text{press}} = \\sum_{i=1}^{N} \\alpha_i \\cdot \\nabla \\Phi(\\mathbf{x}_i) + \\lambda \\| \\mathbf{w} \\|_2^2\n\\end{equation}\n\n\\textbf{Abstract Theorem:} For all phonemes in Afaan Oromoo Qubee, the glottal stop /ʔ/ induces minimal pitch deviation.`,
                            },
                            {
                              id: 'linguistics',
                              label: 'IPA Phonetics',
                              code: `# Afaan Oromoo Phonological Inventory Table\n| Phoneme | IPA Symbol | Orthographic (Qubee) | Example Lexeme | Gloss |\n| :--- | :--- | :--- | :--- | :--- |\n| Ejective alveolar | /tʼ/ | C / c | *Caffee* | Meadow/Assembly |\n| Implosive retroflex | /ᶑ/ | DH / dh | *Dhadhaa* | Butter |\n| Ejective velar | /kʼ/ | Q / q | *Qubee* | Alphabet |`,
                            },
                            {
                              id: 'citation',
                              label: 'APA 7th BibTeX',
                              code: `@book{ilillii2024wirtuu,\n  author    = {Ilillii, Kompiitaraa and Haramaya, Press Faculty},\n  title     = {Advanced Scholarly Monograph Publishing in the Horn of Africa},\n  year      = {2024},\n  publisher = {Wirtuu Kompiitaraa Ilillii Press},\n  address   = {Haramaya University, Ethiopia},\n  doi       = {10.5897/WKI.2024.0884}\n}`,
                            },
                          ].map((tmpl) => (
                            <button
                              key={tmpl.id}
                              type="button"
                              onClick={() => {
                                setSandboxTemplate(tmpl.id);
                                setSandboxCode(tmpl.code);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
                                sandboxTemplate === tmpl.id
                                  ? 'bg-secondary text-on-secondary shadow-xs'
                                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                              }`}
                            >
                              {tmpl.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Code Editor & Live Preview Split */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Editor Box */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
                            <span>Input Buffer ({sandboxTemplate.toUpperCase()}):</span>
                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText(sandboxCode)}
                              className="text-secondary hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              <span className="material-symbols-outlined text-[13px]">content_copy</span>
                              <span>Copy</span>
                            </button>
                          </div>
                          <textarea
                            rows={8}
                            value={sandboxCode}
                            onChange={(e) => setSandboxCode(e.target.value)}
                            className="w-full p-3 rounded-xl bg-surface-container-high font-mono text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none leading-relaxed"
                            placeholder="Type LaTeX or Markdown here..."
                          />
                        </div>

                        {/* Live Formatted Output */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
                            <span>Rendered Preview:</span>
                            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              <span>Realtime Proof</span>
                            </span>
                          </div>
                          <div className="h-[188px] overflow-y-auto p-3.5 rounded-xl bg-surface-container border border-outline-variant/25 text-xs text-on-surface space-y-2 font-serif">
                            <div className="whitespace-pre-line leading-relaxed">
                              {sandboxCode}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab: Quiz */}
                  {playerTab === 'quiz' && (
                    <div className="space-y-4">
                      {selectedCourse.quiz && selectedCourse.quiz.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-on-surface">
                              Answer the questions to test your comprehension:
                            </span>
                            {quizSubmitted && (
                              <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-bold text-xs">
                                Score: {calculateQuizScore()}%
                              </span>
                            )}
                          </div>

                          <div className="space-y-4">
                            {selectedCourse.quiz.map((q, qIdx) => (
                              <div key={qIdx} className="space-y-2 text-xs">
                                <p className="font-semibold text-on-surface text-sm">
                                  {qIdx + 1}. {q.question}
                                </p>
                                <div className="space-y-1.5 pl-2">
                                  {q.options.map((opt, optIdx) => {
                                    const isSelected = quizAnswers[qIdx] === optIdx;
                                    const isCorrect = q.correctIndex === optIdx;
                                    return (
                                      <button
                                        key={optIdx}
                                        type="button"
                                        onClick={() => handleQuizOptionSelect(qIdx, optIdx)}
                                        className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                                          quizSubmitted
                                            ? isCorrect
                                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                                              : isSelected
                                              ? 'bg-red-50 border-red-400 text-red-700'
                                              : 'bg-surface-container/30 border-transparent text-on-surface-variant'
                                            : isSelected
                                            ? 'bg-secondary text-on-secondary border-secondary font-bold'
                                            : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/20'
                                        }`}
                                      >
                                        <span>{opt}</span>
                                        {quizSubmitted && isCorrect && (
                                          <span className="material-symbols-outlined text-emerald-600 text-[16px]">
                                            check
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                                {quizSubmitted && (
                                  <p className="text-[11px] text-on-surface-variant italic pl-2">
                                    Rationale: {q.explanation}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            {!quizSubmitted ? (
                              <button
                                onClick={() => setQuizSubmitted(true)}
                                className="py-2 px-5 rounded-lg bg-secondary text-on-secondary font-bold text-xs hover:brightness-105 cursor-pointer shadow-xs"
                              >
                                Submit Answers
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setQuizSubmitted(false);
                                    setQuizAnswers({});
                                  }}
                                  className="py-2 px-3 rounded-lg bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high cursor-pointer"
                                >
                                  Retake Quiz
                                </button>
                                {calculateQuizScore() >= 60 && (
                                  <button
                                    onClick={() => setShowCertificate(true)}
                                    className="py-2 px-4 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-emerald-700 cursor-pointer shadow-sm"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      workspace_premium
                                    </span>
                                    <span>Generate Certificate of Mastery</span>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-on-surface-variant">
                          No quiz assigned for this module.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Course Curriculum Playlist Sidebar */}
              <div className="w-full lg:w-80 flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                    <span className="font-title-sm text-title-sm font-bold text-on-surface">
                      Course Curriculum
                    </span>
                    <span className="text-xs font-bold text-secondary">
                      {selectedCourse.progress}% Complete
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden my-3">
                    <div
                      className="h-full bg-secondary transition-all duration-300"
                      style={{ width: `${selectedCourse.progress}%` }}
                    />
                  </div>

                  {/* Lessons List */}
                  <div className="space-y-1.5 mt-2 max-h-[420px] overflow-y-auto pr-1">
                    {selectedCourse.lessons.map((lesson, idx) => {
                      const isLessonActive = activeLesson?.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(lesson)}
                          className={`w-full p-2.5 rounded-xl text-xs text-left flex items-center justify-between transition-all cursor-pointer ${
                            isLessonActive
                              ? 'bg-secondary text-on-secondary font-bold shadow-xs'
                              : 'text-on-surface hover:bg-surface-container'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="material-symbols-outlined text-[18px] shrink-0">
                              {lesson.completed
                                ? 'check_circle'
                                : lesson.type === 'video'
                                ? 'smart_display'
                                : 'article'}
                            </span>
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] opacity-80 shrink-0 ml-1">
                            {lesson.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Course Metadata Card */}
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-xs space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Instructor:</span>
                    <span className="font-bold text-on-surface">
                      {selectedCourse.instructor}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Affiliation:</span>
                    <span className="font-bold text-on-surface">Haramaya University</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Accreditation:</span>
                    <span className="text-emerald-700 font-bold">Verified Academic Press</span>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/15">
                    <button
                      onClick={() => setInspectCourse(selectedCourse)}
                      className="w-full py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Full Course Overview</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        {showCertificate && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
            <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl p-6 sm:p-8 border-4 border-double border-secondary/60 shadow-2xl relative text-center">
              <button
                onClick={() => setShowCertificate(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>

              <div className="space-y-4">
                <div className="flex justify-center mb-2">
                  <img
                    src={OFFICIAL_BRAND.logoUrl}
                    alt="Logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>

                <div className="uppercase tracking-widest text-xs font-bold text-secondary">
                  Certificate of Academic Completion
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
                  Wirtuu Kompiitaraa Ilillii Press
                </h3>

                <p className="text-xs text-on-surface-variant">
                  This is to formally certify that
                </p>

                <div className="border-b-2 border-secondary/40 max-w-sm mx-auto pb-1">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="text-center font-serif text-xl sm:text-2xl font-bold text-on-surface bg-transparent focus:outline-none w-full"
                    placeholder="Enter Student Name"
                  />
                </div>

                <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  has successfully completed the coursework and examination modules for
                </p>

                <h4 className="font-serif text-lg sm:text-xl font-bold text-secondary">
                  {selectedCourse?.title}
                </h4>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant/30 text-left text-xs">
                  <div>
                    <p className="text-on-surface-variant">Certificate ID:</p>
                    <p className="font-mono font-bold text-on-surface">
                      WKIP-{new Date().getFullYear()}-DEF-{Math.floor(1000 + Math.random() * 9000)}
                    </p>
                    <p className="text-on-surface-variant mt-1">Issue Date: {new Date().toISOString().split('T')[0]}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-on-surface-variant">Director & Academic Host:</p>
                    <p className="font-serif font-bold text-on-surface">{OFFICIAL_BRAND.founder}</p>
                    <p className="text-[10px] text-secondary font-semibold">Haramaya University Press</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-lg bg-secondary text-on-secondary text-xs font-bold flex items-center gap-1.5 hover:opacity-90 cursor-pointer shadow"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Course Modal when requested */}
        {inspectCourse && (
          <CourseDetailModal
            course={inspectCourse}
            onClose={() => setInspectCourse(null)}
            onEnroll={(cId) => {
              onEnrollCourse(cId);
              setInspectCourse(null);
            }}
            onStartLearning={(c) => {
              handleSelectCourse(c);
              setInspectCourse(null);
            }}
          />
        )}
      </div>
    </section>
  );
};
