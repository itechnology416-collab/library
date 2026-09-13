import React, { useState, useEffect, useRef } from 'react';
import { Certificate, Course } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';

interface QuizAssessmentModalProps {
  course: Course;
  studentName: string;
  onClose: () => void;
  onPassQuiz: (score: number, newCertificate: Certificate) => void;
}

export const QuizAssessmentModal: React.FC<QuizAssessmentModalProps> = ({
  course,
  studentName,
  onClose,
  onPassQuiz,
}) => {
  const quiz = course.quiz || [];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [earnedCert, setEarnedCert] = useState<Certificate | null>(null);

  // Timed Examination Mode
  const [timeRemaining, setTimeRemaining] = useState<number>(300); // 5 minutes (300s)
  const [isTimedMode, setIsTimedMode] = useState<boolean>(true);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  
  // Proctoring Focus Awareness
  const [proctoringWarnings, setProctoringWarnings] = useState<number>(0);
  const [showProctorAlert, setShowProctorAlert] = useState<boolean>(false);

  // Focus detection
  useEffect(() => {
    if (isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setProctoringWarnings((prev) => {
          const next = prev + 1;
          setShowProctorAlert(true);
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSubmitted]);

  // Timer countdown
  useEffect(() => {
    if (!isTimedMode || isSubmitted) return;

    if (timeRemaining <= 0) {
      // Auto-submit when time expires
      executeGrading();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimedMode, isSubmitted, timeRemaining]);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const toggleFlagQuestion = (qIdx: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qIdx]: !prev[qIdx],
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return Math.round((correct / quiz.length) * 100);
  };

  const executeGrading = () => {
    if (quiz.length === 0) return;
    const score = calculateScore();
    setIsSubmitted(true);

    if (score >= 80) {
      const newCert: Certificate = {
        certificateId: `WKI-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: studentName || 'Scholar Abebe K.',
        courseTitle: course.title,
        issuedDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        instructor: course.instructor,
        organization: `${OFFICIAL_BRAND.fullName} • ${OFFICIAL_BRAND.affiliation}`,
        grade: score === 100 ? 'Distinction (100%)' : `Excellence (${score}%)`,
        verified: true,
      };
      setEarnedCert(newCert);
      onPassQuiz(score, newCert);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeGrading();
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setEarnedCert(null);
    setTimeRemaining(300);
    setProctoringWarnings(0);
    setShowProctorAlert(false);
    setFlaggedQuestions({});
  };

  const score = isSubmitted ? calculateScore() : 0;
  const passed = score >= 80;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isTimeLow = isTimedMode && timeRemaining <= 60 && !isSubmitted;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center">
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-4 bg-surface-container flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-secondary text-[22px]">quiz</span>
            <div>
              <h3 className="font-bold text-on-surface text-sm">
                Doctoral & Scholarly Assessment
              </h3>
              <p className="text-[11px] text-on-surface-variant line-clamp-1">
                {course.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Countdown Timer Badge */}
            {isTimedMode && !isSubmitted && (
              <div
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                  isTimeLow
                    ? 'bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/40 animate-pulse'
                    : 'bg-surface-container-high text-on-surface'
                }`}
                title="Exam Time Remaining"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isTimeLow ? 'timer_off' : 'timer'}
                </span>
                <span>{formattedTime}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container-highest hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Proctoring Banner */}
        {showProctorAlert && !isSubmitted && (
          <div className="px-4 py-2 bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-600">visibility</span>
              <span>
                <strong>Proctoring Notice:</strong> Browser focus switched ({proctoringWarnings}x). Academic integrity telemetry active.
              </span>
            </div>
            <button
              onClick={() => setShowProctorAlert(false)}
              className="text-amber-800 dark:text-amber-200 hover:opacity-75 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Instructions banner */}
          <div className="p-3.5 rounded-xl bg-surface-container flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
                <span>Passing Criteria: 80% or Higher</span>
              </span>
              <p className="text-[11px] text-on-surface-variant">
                Scoring 80%+ automatically awards an authentic Haramaya University certificate.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTimedMode(!isTimedMode)}
                className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                  isTimedMode ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface'
                }`}
                title="Toggle 5-minute timed test condition"
              >
                {isTimedMode ? '⏱️ Timed (5m)' : 'Untimed'}
              </button>
              <span className="px-2.5 py-1 rounded bg-secondary/15 text-secondary font-bold font-mono text-[11px] shrink-0">
                {quiz.length} Questions
              </span>
            </div>
          </div>

          {/* Question Fast-Navigation Bar */}
          {!isSubmitted && (
            <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-on-surface-variant">Question Navigator:</span>
                <span className="text-on-surface-variant">
                  {Object.keys(selectedAnswers).length}/{quiz.length} answered
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {quiz.map((_, idx) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isFlagged = flaggedQuestions[idx];
                  return (
                    <a
                      key={idx}
                      href={`#question-${idx}`}
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center transition-all cursor-pointer relative ${
                        isAnswered
                          ? 'bg-secondary text-on-secondary'
                          : isFlagged
                          ? 'bg-amber-500/20 text-amber-700 border border-amber-500/40'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Result Card if submitted */}
          {isSubmitted && (
            <div
              className={`p-5 rounded-xl border text-center space-y-2 ${
                passed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
              }`}
            >
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-surface-container-lowest shadow-sm">
                <span className={`material-symbols-outlined text-[28px] ${passed ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {passed ? 'workspace_premium' : 'sync_problem'}
                </span>
              </div>
              <h4 className="font-bold text-base">
                {passed ? 'Assessment Passed with Honors!' : 'Review & Try Again'}
              </h4>
              <p className="text-xs">
                Your Score: <span className="font-bold text-base font-mono">{score}%</span> ({Object.values(selectedAnswers).filter((ans, i) => ans === quiz[i].correctIndex).length} of {quiz.length} correct)
              </p>
              {passed ? (
                <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  Congratulations! Your verified certificate <span className="font-mono font-bold">({earnedCert?.certificateId})</span> has been issued to your Credentials Vault.
                </p>
              ) : (
                <p className="text-[11px] text-on-surface-variant">
                  A score of 80% is required for certificate conferral. Review the rationale below and retake the test.
                </p>
              )}
            </div>
          )}

          {/* Question List */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {quiz.map((q, qIdx) => {
              const userAnswer = selectedAnswers[qIdx];
              const isCorrect = isSubmitted && userAnswer === q.correctIndex;
              const isIncorrect = isSubmitted && userAnswer !== undefined && userAnswer !== q.correctIndex;
              const isFlagged = flaggedQuestions[qIdx];

              return (
                <div
                  key={qIdx}
                  id={`question-${qIdx}`}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : isIncorrect
                        ? 'border-red-500/40 bg-red-500/5'
                        : 'border-outline-variant/30 bg-surface-container-lowest'
                      : isFlagged
                      ? 'border-amber-500/40 bg-amber-500/5'
                      : 'border-outline-variant/30 bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-secondary/15 text-secondary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <h5 className="font-bold text-xs sm:text-sm text-on-surface leading-snug">
                        {q.question}
                      </h5>
                    </div>

                    {!isSubmitted && (
                      <button
                        type="button"
                        onClick={() => toggleFlagQuestion(qIdx)}
                        className={`p-1 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                          isFlagged
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                            : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                        title="Flag question for review"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isFlagged ? 'flag' : 'outlined_flag'}
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 pt-1 pl-8">
                    {q.options.map((option, optIdx) => {
                      const isSelected = userAnswer === optIdx;
                      let optionStyle = 'border-outline-variant/25 bg-surface-container hover:bg-surface-container-high text-on-surface';

                      if (isSubmitted) {
                        if (optIdx === q.correctIndex) {
                          optionStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold';
                        } else if (isSelected && optIdx !== q.correctIndex) {
                          optionStyle = 'border-red-500 bg-red-500/20 text-red-900 dark:text-red-200 line-through';
                        }
                      } else if (isSelected) {
                        optionStyle = 'border-secondary bg-secondary/15 text-on-surface font-semibold shadow-xs';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 cursor-pointer transition-all ${optionStyle}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-secondary bg-secondary text-white' : 'border-outline-variant'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{option}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pedagogical Explanation */}
                  {isSubmitted && (
                    <div className="pl-8 pt-2 text-[11px] text-on-surface-variant flex items-start gap-1.5 border-t border-outline-variant/15 mt-2">
                      <span className="material-symbols-outlined text-[15px] text-secondary shrink-0 mt-0.5">
                        lightbulb
                      </span>
                      <span>
                        <strong className="text-on-surface">Faculty Explanation:</strong> {q.explanation}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom Form Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-outline-variant/20">
              {isSubmitted ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  <span>Retake Assessment</span>
                </button>
              ) : (
                <span className="text-xs text-on-surface-variant font-mono">
                  {Object.keys(selectedAnswers).length} of {quiz.length} answered
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isSubmitted ? 'Close' : 'Cancel'}
                </button>

                {!isSubmitted && (
                  <button
                    type="submit"
                    disabled={Object.keys(selectedAnswers).length < quiz.length}
                    className="px-5 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Submit for Grading</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

