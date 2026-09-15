import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  TrendingUp,
  BookOpen,
  FolderOpen,
  HelpCircle,
  Award,
  MessageSquare,
  UserCheck,
  Search,
  Download,
  ExternalLink,
  FileText,
  CheckCircle2,
  Save,
  Send,
  Calendar,
  Sparkles,
  Clock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  PlayCircle,
  Check,
  RotateCcw,
  Volume2,
  Edit,
  BarChart2,
  Bookmark,
  Paperclip,
  CheckSquare,
} from 'lucide-react';
import {
  Book,
  Certificate,
  Course,
  CourseMaterial,
  Language,
  QuizAttempt,
  StudentScholarProfile,
  AdvisoryMessage,
} from '../types';
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
import { Button, Badge, Input, Select, Textarea } from './ui';

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
  const bookmarkedBooks =
    books.filter((b) => b.bookmarked).length > 0
      ? books.filter((b) => b.bookmarked)
      : books.slice(0, 4);

  // 1. Initial Data Fetch from Backend Persistence
  useEffect(() => {
    // Load profile
    fetch('/api/scholar/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfile(data.profile);
        }
      })
      .catch((err) => console.warn('Offline/default profile loaded', err));

    // Load messages
    fetch('/api/scholar/messages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.warn('Offline/default messages loaded', err));

    // Load quiz attempts
    fetch('/api/scholar/quizzes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.quizzes && data.quizzes.length > 0) {
          setQuizAttempts(data.quizzes);
        }
      })
      .catch((err) => console.warn('Offline/default quizzes loaded', err));

    // Load certificates
    fetch('/api/scholar/certificates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.certificates && data.certificates.length > 0) {
          setCertificates(data.certificates);
        }
      })
      .catch((err) => console.warn('Offline/default certificates loaded', err));

    // Load materials
    fetch('/api/scholar/materials')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.materials && data.materials.length > 0) {
          setMaterials(data.materials);
        }
      })
      .catch((err) => console.warn('Offline/default materials loaded', err));
  }, []);

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: GraduationCap },
    { id: 'progress', label: 'My Progress', icon: TrendingUp },
    { id: 'books', label: 'My Books', icon: BookOpen },
    { id: 'resources', label: 'Resources', icon: FolderOpen },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'messages', label: 'Advisory Desk', icon: MessageSquare },
    { id: 'profile', label: 'Scholar Profile', icon: UserCheck },
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: selectedTopic,
    };

    setMessages((prev) => [...prev, userMsg]);
    const sentText = newMessageText.trim();
    setNewMessageText('');

    // Persist user message to backend
    fetch('/api/scholar/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userMsg),
    }).catch((err) => console.error('Failed to persist user message', err));

    // Simulate realistic response from Director Mr. Feysal Hussein
    setIsDirectorTyping(true);
    setTimeout(() => {
      setIsDirectorTyping(false);
      let replyText = `Thank you for your question, Scholar ${profile.name}. I have reviewed your inquiry regarding "${selectedTopic}". Ensure your typography aligns with the 24pt minimum guideline and all ANOVA results use our standardized high-contrast delta styling. You may proceed with slide rendering.`;

      if (sentText.toLowerCase().includes('deadline') || sentText.toLowerCase().includes('urgent')) {
        replyText = `Understood on the priority timeline. Our Haramaya University editorial desk can prioritize your manuscript draft. Reach out on phone (+251 927 650 724) or Telegram (@FEYSAL_8) if you need expedited same-day turnarounds.`;
      } else if (
        sentText.toLowerCase().includes('cite') ||
        sentText.toLowerCase().includes('apa') ||
        sentText.toLowerCase().includes('ieee')
      ) {
        replyText = `For computational manuscripts, IEEE numeric bracket citations [1] are standard for your slides. For your full monograph thesis, verify with the Postgraduate Directorate if APA 7th author-date format is preferred.`;
      }

      const directorReply: AdvisoryMessage = {
        id: `msg-${Date.now() + 1}`,
        senderName: 'Mr. Feysal Hussein',
        senderRole: 'director',
        avatar: 'FH',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: selectedTopic,
      };

      setMessages((prev) => [...prev, directorReply]);

      // Persist director reply to backend
      fetch('/api/scholar/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(directorReply),
      }).catch((err) => console.error('Failed to persist advisor message', err));

      if (onShowToast) onShowToast('New advisory reply from Director Mr. Feysal Hussein');
    }, 1500);
  };

  const handleDownloadMaterial = (mat: CourseMaterial) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === mat.id ? { ...m, downloadCount: m.downloadCount + 1 } : m))
    );

    // Call backend endpoint to increment download count
    fetch(`/api/scholar/materials/${mat.id}/download`, { method: 'POST' }).catch((err) =>
      console.warn('Download tracking notice', err)
    );

    if (onShowToast) {
      onShowToast(`Downloaded ${mat.title} (${mat.fileType})`);
    }
  };

  const handlePassQuiz = (score: number, newCert: Certificate) => {
    setCertificates((prev) => [newCert, ...prev]);
    if (onAddCertificate) onAddCertificate(newCert);

    // Persist new certificate to backend
    fetch('/api/scholar/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCert),
    }).catch((err) => console.error('Failed to persist certificate', err));

    if (courseForQuizModal) {
      const attempt: QuizAttempt = {
        id: `qa-${Date.now()}`,
        courseId: courseForQuizModal.id,
        courseTitle: courseForQuizModal.title,
        scorePct: score,
        totalQuestions: courseForQuizModal.quiz?.length || 3,
        correctAnswers: Math.round(((courseForQuizModal.quiz?.length || 3) * score) / 100),
        takenAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        passed: true,
      };
      setQuizAttempts((prev) => [attempt, ...prev]);

      // Persist quiz attempt to backend
      fetch('/api/scholar/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt),
      }).catch((err) => console.error('Failed to persist quiz attempt', err));
    }
    if (onShowToast) {
      onShowToast(`Congratulations! Certificate ${newCert.certificateId} awarded.`);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileEditSuccess(true);

    // Persist profile to backend
    fetch('/api/scholar/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    }).catch((err) => console.error('Failed to persist profile', err));

    setTimeout(() => setProfileEditSuccess(false), 3000);
    if (onShowToast) onShowToast('Scholar profile updated successfully.');
  };

  const handleSaveBookNote = (bookId: string) => {
    setBookNotes((prev) => ({
      ...prev,
      [bookId]: noteDraftText,
    }));
    setEditingBookNoteId(null);
    if (onShowToast) onShowToast('Personal research note saved.');
  };

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    const matchesCat = materialFilter === 'all' || m.category === materialFilter;
    const matchesSearch =
      materialSearch === '' ||
      m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.courseTitle.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.fileType.toLowerCase().includes(materialSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="py-8 bg-surface-container-low min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Breadcrumb & Quick Portal Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <button
              onClick={onNavigateHome}
              className="hover:text-secondary font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portal Main</span>
            </button>
            <span>/</span>
            <span className="font-semibold text-on-surface">Academic LMS & Scholar Hub</span>
            <span>/</span>
            <Badge variant="secondary" className="capitalize text-[10px]">
              {activeMenu}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="primary" className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Director Advisory Online</span>
            </Badge>
            <span className="text-xs text-on-surface-variant font-mono">
              {profile.academicDegree}
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-64 shrink-0 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs p-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Student Profile Card */}
              <div
                onClick={() => setActiveMenu('profile')}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
                title="View & Edit Profile"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                  {profile.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2) || 'AK'}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate">
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
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.id}
                      onClick={() => setActiveMenu(link.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-secondary text-on-secondary shadow-xs'
                          : 'text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </div>
                      {link.id === 'messages' && (
                        <span
                          className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"
                          title="Director Online"
                        />
                      )}
                      {link.id === 'certificates' && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-secondary/15 text-secondary'
                          }`}
                        >
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

              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateHome}
                className="w-full text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Back to Portal Home</span>
              </Button>
            </div>
          </aside>

          {/* Main Dashboard Canvas */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* SUB-VIEW 1: DASHBOARD OVERVIEW */}
            {activeMenu === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Greeting Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-primary-container via-slate-900 to-primary-container text-white shadow-md">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-secondary font-bold">
                      Student Learning & Research Hub
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
                      Welcome back, {profile.name}!
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Target Defense: <strong className="text-secondary">{profile.defenseDateTarget}</strong>{' '}
                      • Topic: "{profile.thesisTitle.slice(0, 55)}..."
                    </p>
                  </div>

                  {activeCourse && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onOpenCourse(activeCourse)}
                      className="shrink-0 self-start sm:self-auto font-bold text-xs shadow-xs"
                    >
                      <PlayCircle className="w-4 h-4 mr-1.5" />
                      <span>Resume Active Course</span>
                    </Button>
                  )}
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div
                    onClick={() => setActiveMenu('courses')}
                    className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs cursor-pointer hover:border-secondary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-secondary mb-1">
                      <span className="text-xs font-semibold text-on-surface-variant">
                        Enrolled Courses
                      </span>
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-bold text-on-surface">
                      {courses.filter((c) => c.enrolled).length || 3}
                    </span>
                    <span className="text-[10px] text-emerald-600 block font-medium mt-0.5">
                      2 In Progress
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveMenu('progress')}
                    className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs cursor-pointer hover:border-blue-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-blue-500 mb-1">
                      <span className="text-xs font-semibold text-on-surface-variant">
                        Completed Lessons
                      </span>
                      <CheckCircle2 className="w-5 h-5" />
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
                      <span className="text-xs font-semibold text-on-surface-variant">
                        Quiz Mastery
                      </span>
                      <HelpCircle className="w-5 h-5" />
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
                    <div className="flex items-center justify-between text-secondary mb-1">
                      <span className="text-xs font-semibold text-on-surface-variant">
                        Certificates
                      </span>
                      <Award className="w-5 h-5" />
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
                        <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                          <PlayCircle className="w-4 h-4 text-secondary" />
                          <span>Continue Learning</span>
                        </h3>
                        <Badge variant="secondary">{activeCourse.category}</Badge>
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
                          <h4 className="font-bold text-sm sm:text-base text-on-surface line-clamp-1">
                            {activeCourse.title}
                          </h4>
                          <p className="text-xs text-on-surface-variant line-clamp-2">
                            {activeCourse.description}
                          </p>

                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-on-surface-variant">Course Completion</span>
                              <span className="font-bold text-secondary">
                                {activeCourse.progress}%
                              </span>
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
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onOpenCourse(activeCourse)}
                          className="text-xs font-bold shadow-xs"
                        >
                          <span>Open Lesson Player</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Discipline Progress */}
                  <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
                      <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                        <BarChart2 className="w-4 h-4 text-secondary" />
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
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: '45%' }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-on-surface">Afaan Oromoo Syntax</span>
                          <span className="text-amber-500 font-bold">30%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: '30%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Saved Books & Materials Ribbon */}
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
                    <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                      <Bookmark className="w-4 h-4 text-secondary" />
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
                          <h4 className="text-xs font-bold text-on-surface truncate mt-0.5">
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
                      <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-secondary" />
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
                        <span className="text-xs font-bold text-on-surface">
                          Director Mr. Feysal Hussein is Online
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        Latest Note: "{messages[messages.length - 1]?.text.slice(0, 110)}..."
                      </p>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setActiveMenu('messages')}
                        className="text-xs font-semibold"
                      >
                        <span>Reply to Advisory</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Upcoming Schedule */}
                  <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
                    <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5 pb-2 border-b border-outline-variant/15">
                      <Calendar className="w-4 h-4 text-secondary" />
                      <span>Upcoming Academic Seminars</span>
                    </h3>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-surface-container flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-secondary block">
                            Today, 4:00 PM
                          </span>
                          <h5 className="font-semibold text-on-surface mt-0.5">
                            Doctoral Defense Slide Q&A Webinar
                          </h5>
                          <p className="text-[11px] text-on-surface-variant">
                            Host: Mr. Feysal Hussein
                          </p>
                        </div>
                        <Badge variant="secondary">Live Room</Badge>
                      </div>

                      <div className="p-2.5 rounded-xl bg-surface-container flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-secondary block">
                            Tomorrow, 10:00 AM
                          </span>
                          <h5 className="font-semibold text-on-surface mt-0.5">
                            Tajweed Phonetics Articulation Lab
                          </h5>
                          <p className="text-[11px] text-on-surface-variant">
                            Host: Arabic Faculty Team
                          </p>
                        </div>
                        <Badge variant="outline">Zoom Link</Badge>
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
                    <h3 className="font-bold text-base sm:text-lg text-on-surface flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-secondary" />
                      <span>Enrolled Courses & Academic Curriculum</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Comprehensive university-level modules crafted by Mr. Feysal Hussein and Haramaya
                      University scholars.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveMenu('resources')}
                    className="text-xs font-bold shrink-0"
                  >
                    <FolderOpen className="w-4 h-4 mr-1.5" />
                    <span>Course Materials Vault</span>
                  </Button>
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
                            <span className="text-on-surface-variant font-medium">
                              Instructor: {course.instructor}
                            </span>
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
                            {course.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="p-2 rounded-lg bg-surface-container flex items-center justify-between text-xs"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {lesson.completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-outline-variant shrink-0" />
                                  )}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (course.quiz) {
                              setCourseForQuizModal(course);
                            } else if (onShowToast) {
                              onShowToast('Quiz for this course is being prepared.');
                            }
                          }}
                          className="text-xs font-semibold"
                        >
                          <HelpCircle className="w-3.5 h-3.5 mr-1" />
                          <span>Take Quiz</span>
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onOpenCourse(course)}
                          className="text-xs font-bold shadow-xs"
                        >
                          <span>Resume Course</span>
                          <PlayCircle className="w-3.5 h-3.5 ml-1" />
                        </Button>
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
                  <h3 className="font-bold text-base sm:text-lg text-on-surface flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    <span>Academic Progress & Learning Analytics</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Tracking study velocity, lesson completions, quiz mastery, and academic discipline
                    competency across semesters.
                  </p>
                </div>

                {/* 3 Analytics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-1">
                    <span className="text-xs text-on-surface-variant font-medium block">
                      Total Study Time Logged
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-on-surface">24.5</span>
                      <span className="text-xs text-secondary font-bold">Hours</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 block">+4.2 hours this week</span>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-1">
                    <span className="text-xs text-on-surface-variant font-medium block">
                      Active Study Streak
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-amber-600">8</span>
                      <span className="text-xs text-on-surface-variant font-bold">Days in a row</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant block">
                      Consistent daily participation
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-1">
                    <span className="text-xs text-on-surface-variant font-medium block">
                      Average Assessment Score
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-emerald-600">92%</span>
                      <span className="text-xs text-on-surface-variant font-bold">Mastery</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 block">
                      Eligible for academic honors
                    </span>
                  </div>
                </div>

                {/* 7-Day Study Velocity Bar Chart */}
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
                    <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4 text-secondary" />
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
                  <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5 pb-2 border-b border-outline-variant/15">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    <span>Discipline Competency & Methodological Mastery</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-surface-container space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-on-surface font-bold">
                          1. Academic PowerPoint Defense Engineering
                        </span>
                        <span className="text-secondary font-bold">85% Complete</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">
                        Proficient in 3-second cognitive hierarchy, slide jump indexing, and ANOVA trend
                        vectorization.
                      </p>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-surface-container space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-on-surface font-bold">
                          2. English Higher Education Grammar & Rhetoric
                        </span>
                        <span className="text-blue-500 font-bold">60% Complete</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">
                        Mastery of academic passive vs. active syntax, APA 7th referencing, and abstract
                        synthesis.
                      </p>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-surface-container space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-on-surface font-bold">
                          3. Arabic Typesetting & Tajweed Phonetics
                        </span>
                        <span className="text-emerald-500 font-bold">45% Complete</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">
                        RTL typesetting, Tashkeel diacritics layout, and Quranic phonetics articulation
                        (Makharij).
                      </p>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-surface-container space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-on-surface font-bold">
                          4. Afaan Oromoo Scientific Syntax & Monograph
                        </span>
                        <span className="text-amber-500 font-bold">30% Complete</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">
                        Qubee orthography, grammatical parsing for academic manuscripts, and terminological
                        adaptation.
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
                  <h3 className="font-bold text-base sm:text-lg text-on-surface flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-secondary" />
                    <span>Personal Academic Bookshelf & Scholarly Annotations</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Access peer-reviewed monographs published by WKI Press with personal reading notes,
                    bookmarking, and chapter navigation.
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
                            <p className="text-[11px] text-on-surface-variant font-mono">
                              ISBN: {book.isbn || 'Pending HU Press'}
                            </p>
                          </div>
                        </div>

                        {/* Annotation Box */}
                        <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-on-surface flex items-center gap-1">
                              <Edit className="w-3.5 h-3.5 text-secondary" />
                              <span>Personal Research Annotation</span>
                            </span>
                            {!isEditing && (
                              <button
                                onClick={() => {
                                  setEditingBookNoteId(book.id);
                                  setNoteDraftText(currentNote || '');
                                }}
                                className="text-[11px] text-secondary hover:underline font-bold cursor-pointer"
                              >
                                {currentNote ? 'Edit Note' : '+ Add Note'}
                              </button>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="space-y-2">
                              <Textarea
                                rows={2}
                                value={noteDraftText}
                                onChange={(e) => setNoteDraftText(e.target.value)}
                                placeholder="Add notes for dissertation citations or methodology reference..."
                                className="text-xs"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingBookNoteId(null)}
                                  className="text-xs"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleSaveBookNote(book.id)}
                                  className="text-xs font-bold"
                                >
                                  <Save className="w-3.5 h-3.5 mr-1" />
                                  <span>Save Note</span>
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-on-surface-variant italic">
                              {currentNote || 'No personal research notes recorded for this title yet.'}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => onOpenBook(book)}
                            className="text-xs font-bold shadow-xs"
                          >
                            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                            <span>Open in Reader</span>
                          </Button>

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
                    <h3 className="font-bold text-base sm:text-lg text-on-surface flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-secondary" />
                      <span>Downloadable Course Materials & Slide Vault</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Download lecture slides, LaTeX/Word templates, APA/IEEE citation cheatsheets, and
                      audio phonetics stems.
                    </p>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {filteredMaterials.length} Documents Available
                  </Badge>
                </div>

                {/* Filter and Search Bar */}
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      'all',
                      'Lecture Slides',
                      'Handout',
                      'Syllabus',
                      'Citation Template',
                      'Phonetic Audio',
                    ].map((cat) => (
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
                    <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-on-surface-variant" />
                    <input
                      type="text"
                      value={materialSearch}
                      onChange={(e) => setMaterialSearch(e.target.value)}
                      placeholder="Search files or formats..."
                      className="w-full h-9 pl-8 pr-3 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
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

                        <h4 className="font-bold text-xs sm:text-sm text-on-surface">{mat.title}</h4>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          {mat.description}
                        </p>
                        <p className="text-[10px] text-secondary font-medium">
                          Associated Course: {mat.courseTitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between">
                        <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                          <Download className="w-3.5 h-3.5 text-on-surface-variant" />
                          <span>{mat.downloadCount} scholars downloaded</span>
                        </span>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDownloadMaterial(mat)}
                          className="text-xs font-bold shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5 mr-1" />
                          <span>Download File</span>
                        </Button>
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
                    <h3 className="font-bold text-base sm:text-lg text-on-surface flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-secondary" />
                      <span>Quiz & Examination Assessment Center</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Demonstrate course mastery. Score 80% or higher to automatically earn an authentic
                      Haramaya University certificate.
                    </p>
                  </div>
                  <Badge variant="primary">80% Required for Honors</Badge>
                </div>

                {/* Previous Quiz Attempts Table */}
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface pb-2 border-b border-outline-variant/15">
                    Your Examination History & Passing Badges
                  </h4>

                  {quizAttempts.length === 0 ? (
                    <p className="text-xs text-on-surface-variant py-4 text-center">
                      No examination records yet. Take a course quiz below to record your academic standing.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {quizAttempts.map((attempt) => (
                        <div
                          key={attempt.id}
                          className="p-3 rounded-xl bg-surface-container flex flex-wrap items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <h5 className="font-bold text-on-surface">{attempt.courseTitle}</h5>
                            <span className="text-[10px] text-on-surface-variant font-mono">
                              Taken on: {attempt.takenAt}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-sm">
                              {attempt.scorePct}% ({attempt.correctAnswers}/{attempt.totalQuestions}{' '}
                              correct)
                            </span>
                            <Badge variant={attempt.passed ? 'secondary' : 'outline'}>
                              {attempt.passed ? 'Passed (Honors)' : 'Retake Required'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Course Assessments List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course) => {
                    const latestAttempt = quizAttempts.find((qa) => qa.courseId === course.id);
                    const hasPassed = latestAttempt?.passed;

                    return (
                      <div
                        key={course.id}
                        className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{course.level}</Badge>
                            {hasPassed && (
                              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Certified</span>
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-on-surface">{course.title}</h4>
                          <p className="text-xs text-on-surface-variant line-clamp-2">
                            {course.description}
                          </p>
                          <p className="text-[11px] text-on-surface-variant font-mono">
                            Assessment: {course.quiz?.length || 3} Comprehensive Multiple-Choice Questions
                          </p>
                        </div>

                        <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between">
                          <span className="text-xs text-on-surface-variant">
                            Instructor: <strong>{course.instructor}</strong>
                          </span>

                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              if (course.quiz) {
                                setCourseForQuizModal(course);
                              } else if (onShowToast) {
                                onShowToast('Quiz for this course is being prepared.');
                              }
                            }}
                            className="text-xs font-bold shadow-xs"
                          >
                            <HelpCircle className="w-3.5 h-3.5 mr-1" />
                            <span>{hasPassed ? 'Retake Assessment' : 'Start Examination'}</span>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-VIEW 7: CERTIFICATES OF ACADEMIC EXCELLENCE */}
            {activeMenu === 'certificates' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-on-surface flex items-center gap-2">
                      <Award className="w-5 h-5 text-secondary" />
                      <span>Conferred Academic Certificates of Completion</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Official credentials issued under the seal of Haramaya University Academic Press &
                      E-Learning Platform.
                    </p>
                  </div>
                  {onOpenVerify && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenVerify()}
                      className="text-xs font-bold shrink-0"
                    >
                      <ShieldCheck className="w-4 h-4 mr-1.5" />
                      <span>Public Verification Desk</span>
                    </Button>
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
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        </div>

                        <h4 className="font-serif text-base font-bold text-on-surface">
                          {cert.courseTitle}
                        </h4>

                        <div className="space-y-1 text-xs text-on-surface-variant">
                          <p>
                            Conferred to: <strong className="text-on-surface">{cert.studentName}</strong>
                          </p>
                          <p>
                            Grade Standing: <strong className="text-secondary">{cert.grade}</strong>
                          </p>
                          <p>
                            Issued: <span className="font-mono">{cert.issuedDate}</span>
                          </p>
                          <p>Authority: {cert.organization}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedCertForModal(cert)}
                          className="text-xs font-bold shadow-xs"
                        >
                          <Award className="w-3.5 h-3.5 mr-1" />
                          <span>View & Print Certificate</span>
                        </Button>

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
                      <h3 className="font-bold text-base sm:text-lg text-on-surface">
                        Academic Advisory & Defense Q&A Desk
                      </h3>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Direct consultation channel with <strong>Director Mr. Feysal Hussein</strong> and
                      senior academic editors.
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Haramaya Editorial Desk Active</Badge>
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
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs ${
                              isMe ? 'bg-secondary' : 'bg-slate-900 border border-secondary/40'
                            }`}
                          >
                            {msg.avatar || (isMe ? 'AK' : 'FH')}
                          </div>

                          <div
                            className={`max-w-lg space-y-1.5 ${
                              isMe ? 'items-end text-right' : 'items-start text-left'
                            }`}
                          >
                            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                              <span className="font-bold text-on-surface">{msg.senderName}</span>
                              <span>•</span>
                              <span>{msg.timestamp}</span>
                              {msg.topic && (
                                <span className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] font-medium">
                                  {msg.topic}
                                </span>
                              )}
                            </div>

                            <div
                              className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                                isMe
                                  ? 'bg-secondary text-on-secondary rounded-tr-none'
                                  : 'bg-surface-container text-on-surface rounded-tl-none border border-outline-variant/20'
                              }`}
                            >
                              <p>{msg.text}</p>
                              {msg.attachmentName && (
                                <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1.5 text-[11px] font-mono">
                                  <Paperclip className="w-3.5 h-3.5" />
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
                  <form
                    onSubmit={handleSendMessage}
                    className="pt-3 border-t border-outline-variant/20 flex gap-2"
                  >
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder="Ask Mr. Feysal about your defense slides, citations, or methodology..."
                      className="flex-1 h-10 px-4 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={!newMessageText.trim()}
                      className="px-5 h-10 font-bold text-xs shadow-xs shrink-0"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" />
                      <span>Send</span>
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* SUB-VIEW 9: SCHOLAR PROFILE & DEGREE SETTINGS */}
            {activeMenu === 'profile' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-2">
                  <h3 className="font-bold text-base sm:text-lg text-on-surface flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-secondary" />
                    <span>Scholar Profile & Academic Affiliation</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Keep your university department, academic degree track, thesis title, and defense
                    targets synchronized.
                  </p>
                </div>

                {profileEditSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Scholar Profile successfully updated. Changes synchronized with your certificates and
                      advisory records.
                    </span>
                  </div>
                )}

                <form
                  onSubmit={handleSaveProfile}
                  className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-5 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Scholar Full Name"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />

                    <Input
                      label="Institutional Email"
                      type="email"
                      required
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />

                    <Input
                      label="Contact Phone"
                      required
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />

                    <Input
                      label="University / Academic Institution"
                      required
                      value={profile.university}
                      onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                    />

                    <Input
                      label="College & Department"
                      required
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    />

                    <Select
                      label="Current Academic Standing"
                      value={profile.academicDegree}
                      onChange={(e) =>
                        setProfile({ ...profile, academicDegree: e.target.value as any })
                      }
                      options={[
                        { label: 'BSc Candidate', value: 'BSc Candidate' },
                        { label: 'MSc Scholar', value: 'MSc Scholar' },
                        { label: 'PhD Candidate', value: 'PhD Candidate' },
                        { label: 'Postdoctoral Researcher', value: 'Postdoctoral Researcher' },
                        { label: 'Faculty Member', value: 'Faculty Member' },
                      ]}
                    />

                    <div className="sm:col-span-2">
                      <Textarea
                        label="Thesis / Dissertation Project Title"
                        rows={2}
                        value={profile.thesisTitle}
                        onChange={(e) => setProfile({ ...profile, thesisTitle: e.target.value })}
                      />
                    </div>

                    <Input
                      label="Academic Advisor(s)"
                      value={profile.advisorName}
                      onChange={(e) => setProfile({ ...profile, advisorName: e.target.value })}
                    />

                    <Input
                      label="Target Defense Date"
                      value={profile.defenseDateTarget}
                      onChange={(e) => setProfile({ ...profile, defenseDateTarget: e.target.value })}
                    />
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 flex justify-end">
                    <Button type="submit" variant="secondary" className="font-bold text-xs shadow-xs">
                      <Save className="w-4 h-4 mr-1.5" />
                      <span>Save Profile Changes</span>
                    </Button>
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
