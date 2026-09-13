import React, { useState } from 'react';
import { Book, Certificate, Course, CourseMaterial, Language, QuizAttempt, StudentScholarProfile, AdvisoryMessage } from '../types';
import {
  INITIAL_ADVISORY_MESSAGES,
  INITIAL_CERTIFICATES,
  INITIAL_COURSE_MATERIALS,
  INITIAL_QUIZ_ATTEMPTS,
  INITIAL_STUDENT_PROFILE,
  OFFICIAL_BRAND,
} from '../data/initialData';
import { CourseHonorCertificateModal } from './CourseHonorCertificateModal';
import { QuizAssessmentModal } from './QuizAssessmentModal';

interface StudentDashboardProps {
  currentLanguage: Language;
  courses: Course[];
  books: Book[];
  onOpenCourse: (course: Course) => void;
  onOpenBook: (book: Book) => void;
  onNavigateHome: () => void;
  onOpenVerify?: (certId?: string) => void;
  onShowToast?: (msg: string) => void;
  certificates?: Certificate[];
  onAddCertificate?: (newCert: Certificate) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentLanguage,
  courses,
  books,
  onOpenCourse,
  onOpenBook,
  onNavigateHome,
  onOpenVerify,
  onShowToast,
  certificates: propCerts,
  onAddCertificate,
}) => {
  // Navigation
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');

  // Scholar Profile State
  const [profile, setProfile] = useState<StudentScholarProfile>(INITIAL_STUDENT_PROFILE);
  const [profileEditSuccess, setProfileEditSuccess] = useState<boolean>(false);

  // Certificates State
  const [certificates, setCertificates] = useState<Certificate[]>(
    propCerts && propCerts.length > 0 ? propCerts : INITIAL_CERTIFICATES
  );
  const [selectedCertForModal, setSelectedCertForModal] = useState<Certificate | null>(null);

  // Advisory Messaging State
  const [messages, setMessages] = useState<AdvisoryMessage[]>(INITIAL_ADVISORY_MESSAGES);
  const [newMessageText, setNewMessageText] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('Thesis Defense Slide Structure');
  const [isDirectorTyping, setIsDirectorTyping] = useState<boolean>(false);

  // Course Materials State
  const [materials, setMaterials] = useState<CourseMaterial[]>(INITIAL_COURSE_MATERIALS);
  const [materialFilter, setMaterialFilter] = useState<string>('all');
  const [materialSearch, setMaterialSearch] = useState<string>('');

  // Personal Bookshelf Notes
  const [bookNotes, setBookNotes] = useState<Record<string, string>>({
    'eng-phrasal-verbs': 'Essential chapter 3 on prepositional particles for dissertation writing.',
    'am-language-studies': 'Section 1.2 on Amharic punctuation rules cited in methodology abstract.',
  });
  const [editingBookNoteId, setEditingBookNoteId] = useState<string | null>(null);
  const [noteDraftText, setNoteDraftText] = useState<string>('');

  // Quizzes State
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(INITIAL_QUIZ_ATTEMPTS);
  const [courseForQuizModal, setCourseForQuizModal] = useState<Course | null>(null);

  // Active enrolled course
  const activeCourse = courses.find((c) => c.enrolled) || courses[0];
  const bookmarkedBooks = books.filter((b) => b.bookmarked).length > 0
    ? books.filter((b) => b.bookmarked)
    : books.slice(0, 4);

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'courses', label: 'My Courses', icon: 'school' },
    { id: 'progress', label: 'My Progress', icon: 'trending_up' },
    { id: 'books', label: 'My Books', icon: 'menu_book' },
    { id: 'resources', label: 'Resources', icon: 'folder_open' },
    { id: 'quizzes', label: 'Quizzes', icon: 'quiz' },
    { id: 'certificates', label: 'Certificates', icon: 'workspace_premium' },
    { id: 'messages', label: 'Advisory Desk', icon: 'forum' },
    { id: 'profile', label: 'Scholar Profile', icon: 'badge' },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const userMsg: AdvisoryMessage = {
      id: `msg-${Date.now()}`,
      senderName: profile.name,
      senderRole: 'scholar',
      avatar: 'AK',
      text: newMessageText.trim(),
      timestamp: 'Just now',
      topic: selectedTopic,
    };

    setMessages((prev) => [...prev, userMsg]);
    const sentText = newMessageText.trim();
    setNewMessageText('');

    // Simulate realistic response from Director Mr. Feysal Hussein
    setIsDirectorTyping(true);
    setTimeout(() => {
      setIsDirectorTyping(false);
      let replyText = `Thank you for your question, Scholar ${profile.name}. I have reviewed your inquiry regarding "${selectedTopic}". Ensure your typography aligns with the 24pt minimum guideline and all ANOVA results use our standardized high-contrast delta styling. You may proceed with slide rendering.`;

      if (sentText.toLowerCase().includes('deadline') || sentText.toLowerCase().includes('urgent')) {
        replyText = `Understood on the priority timeline. Our Haramaya University editorial desk can prioritize your manuscript draft. Reach out on phone (+251 927 650 724) or Telegram (@FEYSAL_8) if you need expedited same-day turnarounds.`;
      } else if (sentText.toLowerCase().includes('cite') || sentText.toLowerCase().includes('apa') || sentText.toLowerCase().includes('ieee')) {
        replyText = `For computational manuscripts, IEEE numeric bracket citations [1] are standard for your slides. For your full monograph thesis, verify with the Postgraduate Directorate if APA 7th author-date format is preferred.`;
      }

      const directorReply: AdvisoryMessage = {
        id: `msg-${Date.now() + 1}`,
        senderName: 'Mr. Feysal Hussein',
        senderRole: 'director',
        avatar: 'FH',
        text: replyText,
        timestamp: 'Just now',
        topic: selectedTopic,
      };
      setMessages((prev) => [...prev, directorReply]);
      if (onShowToast) onShowToast('New message from Director Mr. Feysal Hussein');
    }, 1800);
  };

  const handleDownloadMaterial = (mat: CourseMaterial) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === mat.id ? { ...m, downloadCount: m.downloadCount + 1 } : m))
    );
    if (onShowToast) {
      onShowToast(`Downloaded ${mat.title} (${mat.fileType})`);
    }
  };

  const handlePassQuiz = (score: number, newCert: Certificate) => {
    setCertificates((prev) => [newCert, ...prev]);
    if (onAddCertificate) onAddCertificate(newCert);

    if (courseForQuizModal) {
      const attempt: QuizAttempt = {
        id: `qa-${Date.now()}`,
        courseId: courseForQuizModal.id,
        courseTitle: courseForQuizModal.title,
        scorePct: score,
        totalQuestions: courseForQuizModal.quiz?.length || 3,
        correctAnswers: Math.round(((courseForQuizModal.quiz?.length || 3) * score) / 100),
        takenAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        passed: true,
      };
      setQuizAttempts((prev) => [attempt, ...prev]);
    }
    if (onShowToast) {
      onShowToast(`Congratulations! Certificate ${newCert.certificateId} awarded.`);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileEditSuccess(true);
    setTimeout(() => setProfileEditSuccess(false), 3000);
    if (onShowToast) onShowToast('Scholar profile updated successfully.');
  };

  const handleSaveBookNote = (bookId: string) => {
    setBookNotes((prev) => ({
      ...prev,
      [bookId]: noteDraftText,
    }));
    setEditingBookNoteId(null);
    setNoteDraftText('');
    if (onShowToast) onShowToast('Scholarly note saved.');
  };

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    const matchesCat = materialFilter === 'all' || m.category.toLowerCase().includes(materialFilter.toLowerCase());
    const matchesSearch =
      m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.courseTitle.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.fileType.toLowerCase().includes(materialSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="px-gutter-mobile py-6 bg-surface min-h-[85vh]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar Navigation */}
          <aside className="w-full lg:w-64 shrink-0 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs p-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Student Profile Card */}
              <div
                onClick={() => setActiveMenu('profile')}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
                title="View & Edit Profile"
              >
                <div className="w-12 h-12 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0">
                  {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'AK'}
                </div>
                <div className="min-w-0">
                  <h4 className="font-title-sm text-title-sm font-bold text-on-surface truncate">
                    {profile.name}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {profile.academicDegree} • {profile.university.split(' ')[0]}
                  </p>
                </div>
              </div>

              {/* Nav Links */}
              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const isActive = activeMenu === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => setActiveMenu(link.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-secondary text-on-secondary shadow-xs'
                          : 'text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                        <span>{link.label}</span>
                      </div>
                      {link.id === 'messages' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Director Online" />
                      )}
                      {link.id === 'certificates' && (
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-secondary/15 text-secondary'
                        }`}>
                          {certificates.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-outline-variant/15 space-y-2 mt-6">
              <div className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/20 text-center">
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">
                  Academic Support
                </span>
                <p className="text-[11px] text-on-surface-variant mt-0.5 font-medium">
                  {OFFICIAL_BRAND.phone1}
                </p>
                <span className="text-[10px] text-on-surface-variant block">
                  {OFFICIAL_BRAND.telegramHandle}
                </span>
              </div>

              <button
                onClick={onNavigateHome}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Back to Portal Home</span>
              </button>
            </div>
          </aside>

          {/* Main Dashboard Canvas */}
          <div className="flex-1 space-y-6">
            {/* SUB-VIEW 1: DASHBOARD OVERVIEW */}
            {activeMenu === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Greeting Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-primary-container via-slate-900 to-primary-container text-white shadow-md">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-secondary font-bold">
                      Student Learning & Research Hub
                    </span>
                    <h2 className="font-headline-sm text-headline-sm font-bold mt-0.5">
                      Welcome back, {profile.name}!
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Target Defense: <strong className="text-secondary">{profile.defenseDateTarget}</strong> • Topic: "{profile.thesisTitle.slice(0, 55)}..."
                    </p>
                  </div>

                  {activeCourse && (
                    <button
                      onClick={() => onOpenCourse(activeCourse)}
                      className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-105 transition-all shadow-sm shrink-0 self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">play_circle</span>
                      <span>Resume Active Course</span>
                    </button>
                  )}
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div
                    onClick={() => setActiveMenu('courses')}
                    className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs cursor-pointer hover:border-secondary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-secondary mb-1">
                      <span className="text-xs font-semibold text-on-surface-variant">Enrolled Courses</span>
                      <span className="material-symbols-outlined text-[20px]">school</span>
                    </div>
                    <span className="text-2xl font-bold text-on-surface">{courses.filter((c) => c.enrolled).length || 3}</span>
                    <span className="text-[10px] text-emerald-600 block font-medium mt-0.5">
                      2 In Progress
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveMenu('progress')}
                    className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs cursor-pointer hover:border-blue-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-blue-500 mb-1">
                      <span className="text-xs font-semibold text-on-surface-variant">Completed Lessons</span>
                      <span className="material-symbols-outlined text-[20px]">task_alt</span>
                    </div>
                    <span className="text-2xl font-bold text-on-surface">14</span>
                    <span className="text-[10px] text-on-surface-variant block mt-0.5">
                      Across 4 modules
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveMenu('quizzes')}
                    className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs cursor-pointer hover:border-amber-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-amber-500 mb-1">
                      <span className="text-xs font-semibold text-on-surface-variant">Quiz Mastery</span>
                      <span className="material-symbols-outlined text-[20px]">insights</span>
                    </div>
                    <span className="text-2xl font-bold text-on-surface">92.5%</span>
                    <span className="text-[10px] text-emerald-600 block font-medium mt-0.5">
                      Top Academic Decile
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveMenu('certificates')}
                    className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs cursor-pointer hover:border-secondary/50 transition-all"
                  >
                    <div className="flex items-center justify-between text-purple-500 mb-1">
                      <span className="text-xs font-semibold text-on-surface-variant">Certificates</span>
                      <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                    </div>
                    <span className="text-2xl font-bold text-secondary">{certificates.length}</span>
                    <span className="text-[10px] text-secondary block font-medium mt-0.5">
                      Official Verified
                    </span>
                  </div>
                </div>

                {/* Continue Learning Spotlight & Discipline Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {activeCourse && (
                    <div className="lg:col-span-2 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
                        <h3 className="font-title-sm text-title-sm font-bold text-on-surface flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-secondary text-[18px]">play_circle</span>
                          <span>Continue Learning</span>
                        </h3>
                        <span className="text-xs font-semibold text-secondary">{activeCourse.category}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-slate-800 shrink-0 relative">
                          <img
                            src={activeCourse.image}
                            alt={activeCourse.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                            {activeCourse.level}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                          <h4 className="font-title-md text-title-md font-bold text-on-surface line-clamp-1">
                            {activeCourse.title}
                          </h4>
                          <p className="text-xs text-on-surface-variant line-clamp-2">
                            {activeCourse.description}
                          </p>

                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-on-surface-variant">Course Completion</span>
                              <span className="font-bold text-secondary">{activeCourse.progress}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                              <div
                                className="h-full bg-secondary rounded-full"
                                style={{ width: `${activeCourse.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/15">
                        <span className="text-xs text-on-surface-variant">
                          Instructor: <strong>{activeCourse.instructor}</strong>
                        </span>
                        <button
                          onClick={() => onOpenCourse(activeCourse)}
                          className="px-4 py-1.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Open Lesson Player</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Discipline Progress */}
                  <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
                      <h3 className="font-title-sm text-title-sm font-bold text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[18px]">analytics</span>
                        <span>Discipline Velocity</span>
                      </h3>
                      <button
                        onClick={() => setActiveMenu('progress')}
                        className="text-xs text-secondary hover:underline font-semibold cursor-pointer"
                      >
                        Details
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-on-surface">Scientific Slide Layouts</span>
                          <span className="text-secondary font-bold">85%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-on-surface">English Academic Grammar</span>
                          <span className="text-blue-500 font-bold">60%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-on-surface">Arabic Tajweed Phonetics</span>
                          <span className="text-emerald-500 font-bold">45%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-on-surface">Afaan Oromoo Syntax</span>
                          <span className="text-amber-500 font-bold">30%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Saved Books & Materials Ribbon */}
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
                    <h3 className="font-title-sm text-title-sm font-bold text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[18px]">bookmark</span>
                      <span>Saved Publications & Reading Shelf</span>
                    </h3>
                    <button
                      onClick={() => setActiveMenu('books')}
                      className="text-xs text-secondary hover:underline font-semibold cursor-pointer"
                    >
                      View All Books ({bookmarkedBooks.length})
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {bookmarkedBooks.slice(0, 4).map((b) => (
                      <div
                        key={b.id}
                        className="p-3 rounded-xl bg-surface-container flex items-center gap-3 hover:bg-surface-container-high transition-colors cursor-pointer"
                        onClick={() => onOpenBook(b)}
                      >
                        <img
                          src={b.coverUrl}
                          alt={b.title}
                          className="w-12 h-16 object-cover rounded shadow-xs shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase font-bold text-secondary block truncate">
                            {b.category}
                          </span>
                          <h4 className="font-title-sm text-xs font-bold text-on-surface truncate mt-0.5">
                            {b.title}
                          </h4>
                          <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                            {b.pages} Pgs • {b.langTag}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Advisory Desk Fast Callout & Schedule */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Advisory Desk Fast Callout */}
                  <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
                      <h3 className="font-title-sm text-title-sm font-bold text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[18px]">forum</span>
                        <span>Academic Advisory Desk</span>
                      </h3>
                      <button
                        onClick={() => setActiveMenu('messages')}
                        className="text-xs text-secondary hover:underline font-semibold cursor-pointer"
                      >
                        Open Chat
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-on-surface">Director Mr. Feysal Hussein is Online</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        Latest Note: "{messages[messages.length - 1]?.text.slice(0, 110)}..."
                      </p>
                      <button
                        onClick={() => setActiveMenu('messages')}
                        className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-semibold hover:brightness-105 transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Reply to Advisory</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  {/* Upcoming Schedule */}
                  <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
                    <h3 className="font-title-sm text-title-sm font-bold text-on-surface flex items-center gap-1.5 pb-2 border-b border-outline-variant/15">
                      <span className="material-symbols-outlined text-secondary text-[18px]">event</span>
                      <span>Upcoming Academic Seminars</span>
                    </h3>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-surface-container flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-secondary block">Today, 4:00 PM</span>
                          <h5 className="font-semibold text-on-surface mt-0.5">Doctoral Defense Slide Q&A Webinar</h5>
                          <p className="text-[11px] text-on-surface-variant">Host: Mr. Feysal Hussein</p>
                        </div>
                        <span className="px-2 py-1 rounded bg-secondary/15 text-secondary text-[10px] font-bold">
                          Live Room
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-surface-container flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-secondary block">Tomorrow, 10:00 AM</span>
                          <h5 className="font-semibold text-on-surface mt-0.5">Tajweed Phonetics Articulation Lab</h5>
                          <p className="text-[11px] text-on-surface-variant">Host: Arabic Faculty Team</p>
                        </div>
                        <span className="px-2 py-1 rounded bg-surface-container-high text-[10px] font-bold text-on-surface">
                          Zoom Link
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: MY COURSES DESK */}
            {activeMenu === 'courses' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs">
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[22px]">school</span>
                      <span>Enrolled Courses & Academic Curriculum</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Comprehensive university-level modules crafted by Mr. Feysal Hussein and Haramaya University scholars.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveMenu('resources')}
                    className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">folder_zip</span>
                    <span>Course Materials Vault</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="rounded-2xl bg-surface-container-lowest border border-outline-variant/25 shadow-xs overflow-hidden flex flex-col justify-between space-y-4 p-5"
                    >
                      <div className="space-y-3">
                        <div className="relative h-40 -mx-5 -mt-5 bg-slate-900 overflow-hidden">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-wider">
                            {course.level}
                          </span>
                          <span className="absolute bottom-3 left-3 text-white font-bold text-sm line-clamp-1">
                            {course.title}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-on-surface-variant font-medium">Instructor: {course.instructor}</span>
                            <span className="font-bold text-secondary">{course.progress}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                            <div
                              className="h-full bg-secondary rounded-full"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Lessons syllabus list */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider block">
                            Lessons ({course.lessons.length})
                          </span>
                          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                            {course.lessons.map((lesson, lIdx) => (
                              <div
                                key={lesson.id}
                                className="p-2 rounded-lg bg-surface-container flex items-center justify-between text-xs"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={`material-symbols-outlined text-[16px] shrink-0 ${
                                    lesson.completed ? 'text-emerald-500' : 'text-on-surface-variant'
                                  }`}>
                                    {lesson.completed ? 'check_circle' : 'radio_button_unchecked'}
                                  </span>
                                  <span className="truncate text-[11px] text-on-surface">
                                    {lesson.title}
                                  </span>
                                </div>
                                <span className="text-[10px] text-on-surface-variant font-mono shrink-0 ml-2">
                                  {lesson.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            if (course.quiz) {
                              setCourseForQuizModal(course);
                            } else if (onShowToast) {
                              onShowToast('Quiz for this course is being prepared.');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">quiz</span>
                          <span>Take Quiz</span>
                        </button>

                        <button
                          onClick={() => onOpenCourse(course)}
                          className="px-4 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>Resume Course</span>
                          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: ACADEMIC PROGRESS & LEARNING ANALYTICS */}
            {activeMenu === 'progress' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-2">
                  <h3 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">trending_up</span>
                    <span>Academic Progress & Learning Analytics</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Tracking study velocity, lesson completions, quiz mastery, and academic discipline competency across semesters.
                  </p>
                </div>

                {/* 3 Analytics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-1">
                    <span className="text-xs text-on-surface-variant font-medium block">Total Study Time Logged</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-on-surface">24.5</span>
                      <span className="text-xs text-secondary font-bold">Hours</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 block">+4.2 hours this week</span>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-1">
                    <span className="text-xs text-on-surface-variant font-medium block">Active Study Streak</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-amber-600">8</span>
                      <span className="text-xs text-on-surface-variant font-bold">Days in a row</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant block">Consistent daily participation</span>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-1">
                    <span className="text-xs text-on-surface-variant font-medium block">Average Assessment Score</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-emerald-600">92%</span>
                      <span className="text-xs text-on-surface-variant font-bold">Mastery</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 block">Eligible for academic honors</span>
                  </div>
                </div>

                {/* 7-Day Study Velocity Bar Chart */}
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
                    <h4 className="font-title-sm text-title-sm font-bold text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[18px]">bar_chart</span>
                      <span>Weekly Learning Velocity (Hours per Day)</span>
                    </h4>
                    <span className="text-xs font-mono text-secondary">Week 37 • 2024</span>
                  </div>

                  <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4 pb-2 items-end h-44">
                    {[
                      { day: 'Mon', hours: 3.5, pct: 70 },
                      { day: 'Tue', hours: 4.0, pct: 80 },
                      { day: 'Wed', hours: 2.0, pct: 40 },
                      { day: 'Thu', hours: 5.0, pct: 100 },
                      { day: 'Fri', hours: 4.5, pct: 90 },
                      { day: 'Sat', hours: 3.0, pct: 60 },
                      { day: 'Sun', hours: 2.5, pct: 50 },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                        <span className="text-[10px] font-mono font-bold text-on-surface-variant">
                          {item.hours}h
                        </span>
                        <div className="w-full max-w-[36px] bg-surface-container rounded-t-lg overflow-hidden h-32 flex items-end">
                          <div
                            className={`w-full rounded-t-lg transition-all duration-500 ${
                              item.hours >= 4.5 ? 'bg-secondary' : 'bg-secondary/60'
                            }`}
                            style={{ height: `${item.pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-on-surface">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Discipline Competency Breakdown */}
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4">
                  <h4 className="font-title-sm text-title-sm font-bold text-on-surface flex items-center gap-1.5 pb-2 border-b border-outline-variant/15">
                    <span className="material-symbols-outlined text-secondary text-[18px]">radar</span>
                    <span>Discipline Competency & Methodological Mastery</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-surface-container space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-on-surface font-bold">1. Academic PowerPoint Defense Engineering</span>
                        <span className="text-secondary font-bold">85% Complete</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">
                        Proficient in 3-second cognitive hierarchy, slide jump indexing, and ANOVA trend vectorization.
                      </p>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-surface-container space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-on-surface font-bold">2. English Higher Education Grammar & Rhetoric</span>
                        <span className="text-blue-500 font-bold">60% Complete</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">
                        Mastery of academic passive vs. active syntax, APA 7th referencing, and abstract synthesis.
                      </p>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-surface-container space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-on-surface font-bold">3. Arabic Typesetting & Tajweed Phonetics</span>
                        <span className="text-emerald-500 font-bold">45% Complete</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">
                        RTL typesetting, Tashkeel diacritics layout, and Quranic phonetics articulation (Makharij).
                      </p>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-surface-container space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-on-surface font-bold">4. Afaan Oromoo Scientific Syntax & Monograph</span>
                        <span className="text-amber-500 font-bold">30% Complete</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">
                        Qubee orthography, grammatical parsing for academic manuscripts, and terminological adaptation.
                      </p>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 4: MY BOOKS & SCHOLAR'S BOOKSHELF */}
            {activeMenu === 'books' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-2">
                  <h3 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">menu_book</span>
                    <span>Personal Academic Bookshelf & Scholarly Annotations</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Access peer-reviewed monographs published by WKI Press with personal reading notes, bookmarking, and chapter navigation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {books.map((book) => {
                    const currentNote = bookNotes[book.id];
                    const isEditing = editingBookNoteId === book.id;

                    return (
                      <div
                        key={book.id}
                        className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/25 shadow-xs space-y-4 flex flex-col justify-between"
                      >
                        <div className="flex gap-4">
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-20 h-28 object-cover rounded-lg shadow-sm shrink-0"
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary text-[10px] font-bold uppercase tracking-wider">
                              {book.category}
                            </span>
                            <h4 className="font-bold text-sm text-on-surface line-clamp-2 mt-1">
                              {book.title}
                            </h4>
                            <p className="text-[11px] text-on-surface-variant line-clamp-1">
                              Author: {book.author}
                            </p>
                            <p className="text-[10px] text-on-surface-variant">
                              {book.pages} Pages • Published {book.publishedYear} • {book.langTag}
                            </p>
                          </div>
                        </div>

                        {/* Scholar's Personal Note Section */}
                        <div className="p-3 rounded-xl bg-surface-container text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-on-surface flex items-center gap-1">
                              <span className="material-symbols-outlined text-secondary text-[14px]">edit_note</span>
                              <span>My Research Annotation</span>
                            </span>
                            {!isEditing && (
                              <button
                                onClick={() => {
                                  setEditingBookNoteId(book.id);
                                  setNoteDraftText(currentNote || '');
                                }}
                                className="text-[11px] text-secondary font-bold hover:underline cursor-pointer"
                              >
                                {currentNote ? 'Edit Note' : '+ Add Note'}
                              </button>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="space-y-2">
                              <textarea
                                value={noteDraftText}
                                onChange={(e) => setNoteDraftText(e.target.value)}
                                rows={2}
                                className="w-full p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-secondary"
                                placeholder="Jot down notes, chapter citations, or relevant thesis references..."
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingBookNoteId(null)}
                                  className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface text-[11px]"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveBookNote(book.id)}
                                  className="px-3 py-1 rounded bg-secondary text-on-secondary text-[11px] font-bold"
                                >
                                  Save Note
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-on-surface-variant italic">
                              {currentNote || 'No personal research notes recorded for this title yet.'}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between">
                          <button
                            onClick={() => onOpenBook(book)}
                            className="px-4 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">menu_book</span>
                            <span>Open in Reader</span>
                          </button>

                          <span className="text-[11px] text-on-surface-variant font-mono">
                            {book.chapters.length} Chapters
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-VIEW 5: DOWNLOADABLE COURSE MATERIALS & HANDOUTS VAULT */}
            {activeMenu === 'resources' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs">
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[22px]">folder_open</span>
                      <span>Downloadable Course Materials & Slide Vault</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Download lecture slides, LaTeX/Word templates, APA/IEEE citation cheatsheets, and audio phonetics stems.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold font-mono">
                    {filteredMaterials.length} Documents Available
                  </span>
                </div>

                {/* Filter and Search Bar */}
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {['all', 'Lecture Slides', 'Handout', 'Syllabus', 'Citation Template', 'Phonetic Audio'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setMaterialFilter(cat === 'all' ? 'all' : cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          materialFilter === (cat === 'all' ? 'all' : cat)
                            ? 'bg-secondary text-on-secondary shadow-xs'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {cat === 'all' ? 'All Files' : cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      value={materialSearch}
                      onChange={(e) => setMaterialSearch(e.target.value)}
                      placeholder="Search files or formats..."
                      className="w-full h-8 pl-8 pr-3 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Materials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/25 shadow-xs space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary font-mono font-bold text-xs">
                              {mat.fileType}
                            </span>
                            <span className="text-[11px] text-on-surface-variant font-semibold">
                              {mat.category}
                            </span>
                          </div>
                          <span className="text-[10px] text-on-surface-variant font-mono">
                            {mat.fileSize}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-on-surface">
                          {mat.title}
                        </h4>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          {mat.description}
                        </p>
                        <p className="text-[10px] text-secondary font-medium">
                          Associated Course: {mat.courseTitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between">
                        <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">download</span>
                          <span>{mat.downloadCount} scholars downloaded</span>
                        </span>

                        <button
                          onClick={() => handleDownloadMaterial(mat)}
                          className="px-3.5 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">file_download</span>
                          <span>Download File</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 6: QUIZZES & EXAMINATION CENTER */}
            {activeMenu === 'quizzes' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs">
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[22px]">quiz</span>
                      <span>Quiz & Examination Assessment Center</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Demonstrate course mastery. Score 80% or higher to automatically earn an authentic Haramaya University certificate.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono">
                    80% Required for Honors
                  </span>
                </div>

                {/* Previous Quiz Attempts Table */}
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
                  <h4 className="font-title-sm text-title-sm font-bold text-on-surface flex items-center gap-1.5 pb-2 border-b border-outline-variant/15">
                    <span className="material-symbols-outlined text-secondary text-[18px]">fact_check</span>
                    <span>Assessment Attempt History</span>
                  </h4>

                  <div className="space-y-2">
                    {quizAttempts.map((attempt) => (
                      <div
                        key={attempt.id}
                        className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-on-surface">{attempt.courseTitle}</h5>
                          <p className="text-[11px] text-on-surface-variant">
                            Completed on {attempt.takenAt} • {attempt.correctAnswers} of {attempt.totalQuestions} questions correct
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded font-mono font-bold text-xs ${
                            attempt.scorePct >= 80
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          }`}>
                            Score: {attempt.scorePct}%
                          </span>

                          <span className="px-2 py-1 rounded bg-surface-container-highest text-[11px] font-bold text-secondary">
                            Passed with Honors
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Quizzes to Launch */}
                <div className="space-y-3">
                  <h4 className="font-title-sm text-title-sm font-bold text-on-surface">
                    Available Module Assessments
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map((c) => (
                      <div
                        key={c.id}
                        className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/25 shadow-xs space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary text-[10px] font-bold uppercase">
                            {c.category}
                          </span>
                          <h4 className="font-bold text-sm text-on-surface">
                            {c.title}
                          </h4>
                          <p className="text-xs text-on-surface-variant">
                            Includes multiple-choice questions on cognitive slide hierarchy, typographical baselines, and committee response tactics.
                          </p>
                        </div>

                        <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between">
                          <span className="text-xs font-mono text-secondary">
                            {c.quiz?.length || 3} Questions • 15 Mins
                          </span>

                          <button
                            onClick={() => {
                              if (c.quiz && c.quiz.length > 0) {
                                setCourseForQuizModal(c);
                              } else {
                                if (onShowToast) onShowToast('Quiz is being prepared for this module.');
                              }
                            }}
                            className="px-4 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                            <span>Launch Assessment</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 7: CERTIFICATES & CREDENTIALS VAULT */}
            {activeMenu === 'certificates' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs">
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[22px]">workspace_premium</span>
                      <span>Credentials & Honor Certificates Vault</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Official credentials issued by Wirtuu Kompiitaraa Ilillii with institutional seals and cryptographic IDs.
                    </p>
                  </div>
                  {onOpenVerify && (
                    <button
                      onClick={() => onOpenVerify()}
                      className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Public Verification Desk</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <div
                      key={cert.certificateId}
                      className="p-5 rounded-2xl bg-amber-50/20 dark:bg-stone-900/30 border-2 border-amber-600/30 dark:border-amber-500/20 shadow-sm space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold font-mono text-[10px]">
                            {cert.certificateId}
                          </span>
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            <span>Verified</span>
                          </span>
                        </div>

                        <h4 className="font-serif text-base font-bold text-on-surface">
                          {cert.courseTitle}
                        </h4>

                        <div className="space-y-1 text-xs text-on-surface-variant">
                          <p>Conferred to: <strong className="text-on-surface">{cert.studentName}</strong></p>
                          <p>Grade Standing: <strong className="text-secondary">{cert.grade}</strong></p>
                          <p>Issued: <span className="font-mono">{cert.issuedDate}</span></p>
                          <p>Authority: {cert.organization}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedCertForModal(cert)}
                          className="px-4 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>View & Print Certificate</span>
                        </button>

                        {onOpenVerify && (
                          <button
                            onClick={() => onOpenVerify(cert.certificateId)}
                            className="text-xs text-secondary font-bold hover:underline cursor-pointer"
                          >
                            Verify Credential
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 8: ACADEMIC ADVISORY & THESIS DEFENSE Q&A DESK */}
            {activeMenu === 'messages' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="font-title-md text-title-md font-bold text-on-surface">
                        Academic Advisory & Defense Q&A Desk
                      </h3>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Direct 1-on-1 consultation channel with <strong>Director Mr. Feysal Hussein</strong> and senior academic editors.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded bg-secondary/15 text-secondary text-[11px] font-bold">
                      Haramaya Editorial Desk Active
                    </span>
                  </div>
                </div>

                {/* Topic quick selector */}
                <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-on-surface">Inquiry Topic:</span>
                  {[
                    'Thesis Defense Slide Structure',
                    'Citation Standards & Defense Prep',
                    'ANOVA Chart Redesign',
                    'Editorial Turnaround & Pricing',
                  ].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        selectedTopic === topic
                          ? 'bg-secondary text-on-secondary font-bold shadow-xs'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                {/* Chat History Container */}
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4 min-h-[420px] max-h-[550px] overflow-y-auto flex flex-col justify-between">
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const isMe = msg.senderRole === 'scholar';
                      return (
                        <div
                          key={msg.id}
                          className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs ${
                            isMe ? 'bg-secondary' : 'bg-slate-900 border border-secondary/40'
                          }`}>
                            {msg.avatar || (isMe ? 'AK' : 'FH')}
                          </div>

                          <div className={`max-w-lg space-y-1.5 ${isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                              <span className="font-bold text-on-surface">{msg.senderName}</span>
                              <span>•</span>
                              <span>{msg.timestamp}</span>
                              {msg.topic && (
                                <span className="px-1.5 py-0.2 rounded bg-surface-container text-[10px] font-medium">
                                  {msg.topic}
                                </span>
                              )}
                            </div>

                            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-secondary text-on-secondary rounded-tr-none'
                                : 'bg-surface-container text-on-surface rounded-tl-none border border-outline-variant/20'
                            }`}>
                              <p>{msg.text}</p>
                              {msg.attachmentName && (
                                <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1.5 text-[11px] font-mono">
                                  <span className="material-symbols-outlined text-[16px]">attachment</span>
                                  <span>{msg.attachmentName}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {isDirectorTyping && (
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant italic pl-12">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                        <span>Director Mr. Feysal Hussein is typing an advisory reply...</span>
                      </div>
                    )}
                  </div>

                  {/* Send Form */}
                  <form onSubmit={handleSendMessage} className="pt-3 border-t border-outline-variant/20 flex gap-2">
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder={`Ask Mr. Feysal about your defense slides, citations, or methodology...`}
                      className="flex-1 h-10 px-4 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!newMessageText.trim()}
                      className="px-5 h-10 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-105 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* SUB-VIEW 9: SCHOLAR PROFILE & DEGREE SETTINGS */}
            {activeMenu === 'profile' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-2">
                  <h3 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">badge</span>
                    <span>Scholar Profile & Academic Affiliation</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Keep your university department, academic degree track, thesis title, and defense targets synchronized.
                  </p>
                </div>

                {profileEditSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Scholar Profile successfully updated. Changes reflected in your certificates and advisory records.</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-on-surface block mb-1">Scholar Full Name</label>
                      <input
                        type="text"
                        required
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-on-surface block mb-1">Institutional Email</label>
                      <input
                        type="email"
                        required
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-on-surface block mb-1">Contact Phone</label>
                      <input
                        type="text"
                        required
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-on-surface block mb-1">University / Academic Institution</label>
                      <input
                        type="text"
                        required
                        value={profile.university}
                        onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                        className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-on-surface block mb-1">College & Department</label>
                      <input
                        type="text"
                        required
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-on-surface block mb-1">Current Academic Standing</label>
                      <select
                        value={profile.academicDegree}
                        onChange={(e) => setProfile({ ...profile, academicDegree: e.target.value as any })}
                        className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                      >
                        <option value="BSc Candidate">BSc Candidate</option>
                        <option value="MSc Scholar">MSc Scholar</option>
                        <option value="PhD Candidate">PhD Candidate</option>
                        <option value="Postdoctoral Researcher">Postdoctoral Researcher</option>
                        <option value="Faculty Member">Faculty Member</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-on-surface block mb-1">Thesis / Dissertation Project Title</label>
                      <textarea
                        rows={2}
                        value={profile.thesisTitle}
                        onChange={(e) => setProfile({ ...profile, thesisTitle: e.target.value })}
                        className="w-full p-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-on-surface block mb-1">Academic Advisor(s)</label>
                      <input
                        type="text"
                        value={profile.advisorName}
                        onChange={(e) => setProfile({ ...profile, advisorName: e.target.value })}
                        className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-on-surface block mb-1">Target Defense Date</label>
                      <input
                        type="text"
                        value={profile.defenseDateTarget}
                        onChange={(e) => setProfile({ ...profile, defenseDateTarget: e.target.value })}
                        className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-105 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: View Official Course Honor Certificate */}
      {selectedCertForModal && (
        <CourseHonorCertificateModal
          certificate={selectedCertForModal}
          onClose={() => setSelectedCertForModal(null)}
          onVerify={onOpenVerify}
        />
      )}

      {/* Modal: Interactive Quiz Assessment Runner */}
      {courseForQuizModal && (
        <QuizAssessmentModal
          course={courseForQuizModal}
          studentName={profile.name}
          onClose={() => setCourseForQuizModal(null)}
          onPassQuiz={handlePassQuiz}
        />
      )}
    </section>
  );
};
