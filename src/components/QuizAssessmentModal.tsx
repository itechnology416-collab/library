import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Timer,
  AlertTriangle,
  CheckCircle2,
  Award,
  RotateCcw,
  Send,
  Flag,
  Lightbulb,
  Eye,
  ShieldAlert,
} from 'lucide-react';
import { Certificate, Course } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';
import { Modal, Button, Badge } from './ui';

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
    <Modal
      isOpen={true}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full pr-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base md:text-lg text-on-surface">
                  Doctoral & Scholarly Assessment
                </span>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {quiz.length} Questions
                </Badge>
              </div>
              <p className="text-xs text-on-surface-variant font-normal line-clamp-1">
                {course.title}
              </p>
            </div>
          </div>

          {/* Countdown Timer Badge */}
          {isTimedMode && !isSubmitted && (
            <div
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                isTimeLow
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'bg-surface-container-high text-on-surface border border-outline-variant/30'
              }`}
              title="Exam Time Remaining"
            >
              <Timer className="w-4 h-4" />
              <span>{formattedTime}</span>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Proctoring Warning Banner */}
        {showProctorAlert && !isSubmitted && (
          <div className="px-4 py-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Proctoring Notice:</strong> Browser focus switched ({proctoringWarnings}x). Academic integrity telemetry active.
              </span>
            </div>
            <button
              onClick={() => setShowProctorAlert(false)}
              className="text-amber-800 dark:text-amber-200 hover:opacity-75 font-bold p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Instructions banner */}
        <div className="p-3.5 rounded-xl bg-surface-container flex flex-wrap items-center justify-between gap-3 text-xs border border-outline-variant/20">
          <div className="space-y-0.5">
            <span className="font-bold text-on-surface flex items-center gap-1.5">
              <Award className="w-4 h-4 text-secondary" />
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
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                isTimedMode
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'bg-surface-container-high text-on-surface'
              }`}
            >
              {isTimedMode ? '⏱️ Timed (5m)' : 'Untimed'}
            </button>
            <Badge variant="primary">Passmark: 80%</Badge>
          </div>
        </div>

        {/* Question Fast-Navigation Bar */}
        {!isSubmitted && (
          <div className="p-3 rounded-xl bg-surface border border-outline-variant/20 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-on-surface">Question Navigator:</span>
              <span className="text-on-surface-variant font-mono">
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
                    className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center transition-all relative ${
                      isAnswered
                        ? 'bg-secondary text-on-secondary shadow-xs'
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
            className={`p-5 rounded-2xl border text-center space-y-2.5 shadow-xs animate-in zoom-in-95 duration-200 ${
              passed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-surface shadow-sm">
              {passed ? (
                <Award className="w-8 h-8 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              )}
            </div>
            <h4 className="font-bold text-lg">
              {passed ? 'Assessment Passed with Honors!' : 'Review & Try Again'}
            </h4>
            <p className="text-xs">
              Your Score: <span className="font-bold text-base font-mono">{score}%</span> (
              {
                Object.values(selectedAnswers).filter((ans, i) => ans === quiz[i].correctIndex)
                  .length
              }{' '}
              of {quiz.length} correct)
            </p>
            {passed ? (
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                Congratulations! Your verified certificate{' '}
                <span className="font-mono font-bold">({earnedCert?.certificateId})</span> has been
                issued to your Credentials Vault.
              </p>
            ) : (
              <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                A score of 80% is required for certificate conferral. Review the faculty rationale
                below and retake the test.
              </p>
            )}
          </div>
        )}

        {/* Question List */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {quiz.map((q, qIdx) => {
            const userAnswer = selectedAnswers[qIdx];
            const isCorrect = isSubmitted && userAnswer === q.correctIndex;
            const isIncorrect =
              isSubmitted && userAnswer !== undefined && userAnswer !== q.correctIndex;
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
                      ? 'border-rose-500/40 bg-rose-500/5'
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
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                        isFlagged
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                      title="Flag question for review"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-2 pt-1 pl-8">
                  {q.options.map((option, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    let optionStyle =
                      'border-outline-variant/25 bg-surface-container hover:bg-surface-container-high text-on-surface';

                    if (isSubmitted) {
                      if (optIdx === q.correctIndex) {
                        optionStyle =
                          'border-emerald-500 bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isSelected && optIdx !== q.correctIndex) {
                        optionStyle =
                          'border-rose-500 bg-rose-500/20 text-rose-900 dark:text-rose-200 line-through';
                      }
                    } else if (isSelected) {
                      optionStyle =
                        'border-secondary bg-secondary/15 text-on-surface font-semibold shadow-xs';
                    }

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 cursor-pointer transition-all ${optionStyle}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-secondary bg-secondary text-white'
                              : 'border-outline-variant'
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
                    <Lightbulb className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-on-surface">Faculty Explanation:</strong>{' '}
                      {q.explanation}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Form Actions */}
          <div className="pt-3 flex items-center justify-between gap-3 border-t border-outline-variant/20">
            {isSubmitted ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                <span>Retake Assessment</span>
              </Button>
            ) : (
              <span className="text-xs text-on-surface-variant font-mono">
                {Object.keys(selectedAnswers).length} of {quiz.length} answered
              </span>
            )}

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="text-xs">
                {isSubmitted ? 'Close' : 'Cancel'}
              </Button>

              {!isSubmitted && (
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={Object.keys(selectedAnswers).length < quiz.length}
                  className="text-xs font-bold shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span>Submit for Grading</span>
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
