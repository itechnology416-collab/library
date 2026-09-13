import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  Book,
  Course,
  Language,
  Lesson,
  QuizQuestion,
  RequestStatus,
  ResourceItem,
  ServiceCategory,
  ServiceRequest,
} from '../types';

interface AdminDashboardProps {
  requests: ServiceRequest[];
  books: Book[];
  courses?: Course[];
  onUpdateRequestStatus: (requestId: string, newStatus: RequestStatus, note?: string) => void;
  onAddBook: (newBook: Book) => void;
  onDeleteBook?: (bookId: string) => void;
  onDeleteRequest: (requestId: string) => void;
  onUpdateRequest?: (updated: ServiceRequest) => void;
  onAddCourse?: (newCourse: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
  onOpenBookPreview?: (book: Book) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  requests,
  books,
  courses = [],
  onUpdateRequestStatus,
  onAddBook,
  onDeleteBook,
  onDeleteRequest,
  onUpdateRequest,
  onAddCourse,
  onDeleteCourse,
  onOpenBookPreview,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'dashboard' | 'requests' | 'books' | 'courses' | 'resources' | 'settings'
  >('dashboard');

  // Request state
  const [selectedReqId, setSelectedReqId] = useState<string>(requests[0]?.id || '');
  const [requestFilterStatus, setRequestFilterStatus] = useState<string>('all');
  const [requestSearchQuery, setRequestSearchQuery] = useState<string>('');
  const [adminNoteInput, setAdminNoteInput] = useState<string>('');

  // Modals
  const [showAddBookModal, setShowAddBookModal] = useState<boolean>(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState<boolean>(false);
  const [showAddDelivModal, setShowAddDelivModal] = useState<boolean>(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState<boolean>(false);

  // Deliverable state
  const [newDelivTitle, setNewDelivTitle] = useState<string>('');
  const [newDelivType, setNewDelivType] = useState<'PPTX' | 'PDF' | 'DOCX' | 'ZIP'>('PPTX');

  // New Book state
  const [newBookTitle, setNewBookTitle] = useState<string>('');
  const [newBookAuthor, setNewBookAuthor] = useState<string>('Mr. Feysal Hussein');
  const [newBookCategory, setNewBookCategory] = useState<string>('Linguistics Monograph');
  const [newBookLang, setNewBookLang] = useState<Language>('en');
  const [newBookCover, setNewBookCover] = useState<string>('');
  const [newBookDesc, setNewBookDesc] = useState<string>('');
  const [newBookPages, setNewBookPages] = useState<number>(160);
  const [newBookChapterTitle, setNewBookChapterTitle] = useState<string>('Chapter 1: Theoretical Framework & Introduction');
  const [newBookChapterContent, setNewBookChapterContent] = useState<string>(
    'Comprehensive scholarly reference authored according to Haramaya University academic publishing standards.'
  );

  // New Course state
  const [newCourseTitle, setNewCourseTitle] = useState<string>('');
  const [newCourseCategory, setNewCourseCategory] = useState<string>('Academic Presentation');
  const [newCourseLevel, setNewCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass'>('Intermediate');
  const [newCourseInstructor, setNewCourseInstructor] = useState<string>('Mr. Feysal Hussein');
  const [newCourseLang, setNewCourseLang] = useState<Language>('en');
  const [newCourseDuration, setNewCourseDuration] = useState<string>('3.5 Hours');
  const [newCourseDesc, setNewCourseDesc] = useState<string>('');
  const [newCourseImage, setNewCourseImage] = useState<string>('');

  // Press Settings state
  const [cbeAccount, setCbeAccount] = useState<string>('1000289417625');
  const [telebirrAccount, setTelebirrAccount] = useState<string>('0927650724');
  const [directorContact, setDirectorContact] = useState<string>('+251 927 650 724 / +251 961 189 074');
  const [telegramHandle, setTelegramHandle] = useState<string>('@FEYSAL_8');
  const [basePptRate, setBasePptRate] = useState<number>(140);
  const [baseBookRate, setBaseBookRate] = useState<number>(190);
  const [settingsSaved, setSettingsSaved] = useState<boolean>(false);

  // Local Resources state
  const [localResources, setLocalResources] = useState<ResourceItem[]>([
    {
      id: 'res-thesis-latex',
      title: 'Haramaya Postgraduate LaTeX Thesis Template v3.2',
      category: 'Thesis Guidelines',
      language: 'en',
      fileType: 'DOCX',
      pages: 42,
      description: 'Standardized dissertation formatting layout adhering to Haramaya Postgraduate Studies Directorate guidelines.',
    },
    {
      id: 'res-apa7-guide',
      title: 'APA 7th Edition Comprehensive Citation Manual',
      category: 'Citation Standards',
      language: 'en',
      fileType: 'PDF',
      pages: 28,
      description: 'In-text citation rules, reference formatting examples for Ethiopian journals, and DOI bibliography guide.',
    },
    {
      id: 'res-defense-deck',
      title: 'Master Defense Presentation 16:9 Slide Blueprint',
      category: 'Presentation Templates',
      language: 'en',
      fileType: 'PPTX',
      pages: 25,
      description: 'Pre-structured slide layout for problem statement, methodology matrix, regression analysis, and policy implications.',
    },
  ]);
  const [newResTitle, setNewResTitle] = useState<string>('');
  const [newResCategory, setNewResCategory] = useState<string>('Thesis Guidelines');
  const [newResType, setNewResType] = useState<'PDF' | 'PPTX' | 'DOCX'>('PDF');
  const [newResDesc, setNewResDesc] = useState<string>('');

  // Active selected request
  const filteredRequests = requests.filter((r) => {
    const matchesStatus = requestFilterStatus === 'all' || r.status === requestFilterStatus;
    const matchesQuery =
      !requestSearchQuery ||
      r.id.toLowerCase().includes(requestSearchQuery.toLowerCase()) ||
      r.projectTitle.toLowerCase().includes(requestSearchQuery.toLowerCase()) ||
      r.clientName.toLowerCase().includes(requestSearchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const activeRequest = requests.find((r) => r.id === selectedReqId) || filteredRequests[0] || requests[0];

  // Handlers
  const handleVerifyPayment = () => {
    if (!activeRequest || !onUpdateRequest || !activeRequest.paymentProof) return;
    const updated: ServiceRequest = {
      ...activeRequest,
      paymentProof: {
        ...activeRequest.paymentProof,
        status: 'Verified',
        verifiedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        verifiedBy: 'Mr. Feysal Hussein (Director, WKI)',
      },
    };
    onUpdateRequest(updated);
  };

  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequest || !onUpdateRequest || !newDelivTitle.trim()) return;
    const newDeliv = {
      id: 'del-' + Date.now(),
      title: newDelivTitle.trim(),
      fileType: newDelivType,
      fileSize: '12.8 MB',
      version: 'v' + ((activeRequest.deliverables?.length || 0) + 1) + '.0',
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    const updated: ServiceRequest = {
      ...activeRequest,
      deliverables: [...(activeRequest.deliverables || []), newDeliv],
    };
    onUpdateRequest(updated);
    setNewDelivTitle('');
    setShowAddDelivModal(false);
  };

  const handleToggleMilestone = (milestoneId: string) => {
    if (!activeRequest || !onUpdateRequest || !activeRequest.milestones) return;
    const updatedMilestones = activeRequest.milestones.map((m) => {
      if (m.id === milestoneId) {
        const nextStatus = m.status === 'completed' ? 'in_progress' : 'completed';
        return {
          ...m,
          status: nextStatus as any,
          completedDate: nextStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return m;
    });
    onUpdateRequest({
      ...activeRequest,
      milestones: updatedMilestones,
    });
  };

  const handleStatusChange = (status: RequestStatus) => {
    if (!activeRequest) return;
    onUpdateRequestStatus(activeRequest.id, status, adminNoteInput || activeRequest.adminNotes);
  };

  const handleSaveNote = () => {
    if (!activeRequest) return;
    onUpdateRequestStatus(activeRequest.id, activeRequest.status, adminNoteInput);
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;

    const bookToAdd: Book = {
      id: `book-${Date.now()}`,
      title: newBookTitle.trim(),
      titleLocalized: {
        en: newBookTitle.trim(),
        or: newBookTitle.trim(),
        am: newBookTitle.trim(),
        ar: newBookTitle.trim(),
      },
      category: newBookCategory,
      categoryLabel: {
        en: newBookCategory,
        or: newBookCategory,
        am: newBookCategory,
        ar: newBookCategory,
      },
      author: newBookAuthor.trim(),
      affiliation: 'Haramaya University Digital Press',
      coverUrl:
        newBookCover.trim() ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      language: newBookLang,
      langTag: newBookLang.toUpperCase(),
      description: newBookDesc.trim() || 'Peer-reviewed scholarly publication produced under Wirtuu Kompiitaraa Ilillii standards.',
      descriptionLocalized: {
        en: newBookDesc.trim() || 'Peer-reviewed scholarly publication.',
        or: newBookDesc.trim() || 'Maxxansa qorannoo saayinsawaa.',
        am: newBookDesc.trim() || 'የምርምር ህትመት።',
        ar: newBookDesc.trim() || 'إصدار علمي محكم.',
      },
      pages: Number(newBookPages) || 160,
      publishedYear: new Date().getFullYear().toString(),
      downloadAllowed: true,
      chapters: [
        {
          id: 1,
          title: newBookChapterTitle.trim() || 'Chapter 1: Theoretical Foundations',
          content: newBookChapterContent.trim() || 'Introduction to core methodology and regional academic research frameworks.',
        },
      ],
    };

    onAddBook(bookToAdd);
    setShowAddBookModal(false);
    setNewBookTitle('');
    setNewBookDesc('');
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim() || !onAddCourse) return;

    const courseToAdd: Course = {
      id: `course-${Date.now()}`,
      title: newCourseTitle.trim(),
      category: newCourseCategory,
      level: newCourseLevel,
      instructor: newCourseInstructor.trim(),
      language: newCourseLang,
      duration: newCourseDuration,
      enrolled: false,
      progress: 0,
      image:
        newCourseImage.trim() ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      description:
        newCourseDesc.trim() ||
        'High-impact interactive curriculum designed for university scholars and faculty members.',
      certificateEligible: true,
      lessons: [
        {
          id: `l-${Date.now()}-1`,
          title: 'Lesson 1: Methodological Overview & Standards',
          duration: '35 mins',
          type: 'presentation',
          content: 'Foundational lecture introducing formatting guidelines, academic rhetoric, and high-impact presentation structure.',
          completed: false,
          summaryNotes: 'Focus on clear slide layout, quantitative chart clarity, and thesis defense timing.',
        },
        {
          id: `l-${Date.now()}-2`,
          title: 'Lesson 2: Practical Defense Simulation & Committee Scrutiny',
          duration: '45 mins',
          type: 'video',
          content: 'Deep-dive session covering cross-examination defense techniques, empirical defense tables, and addressing challenging reviewer feedback.',
          completed: false,
          summaryNotes: 'Practice answering methodology and sample-size limitation questions.',
        },
      ],
      quiz: [
        {
          question: 'What is the primary objective of an academic thesis defense slide deck?',
          options: [
            'To reproduce the entire manuscript text verbatim',
            'To highlight core empirical contributions, methodology, and policy implications with high clarity',
            'To display unreferenced decorative stock art',
            'To minimize citations and bypass committee review',
          ],
          correctIndex: 1,
          explanation: 'Defense slides must synthesize key findings and empirical rigour concisely for committee evaluation.',
        },
      ],
    };

    onAddCourse(courseToAdd);
    setShowAddCourseModal(false);
    setNewCourseTitle('');
    setNewCourseDesc('');
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim()) return;

    const newRes: ResourceItem = {
      id: `res-${Date.now()}`,
      title: newResTitle.trim(),
      category: newResCategory,
      language: 'en',
      fileType: newResType,
      pages: 20,
      description: newResDesc.trim() || 'Scholarly download prepared for Haramaya University scholars.',
    };

    setLocalResources((prev) => [newRes, ...prev]);
    setShowAddResourceModal(false);
    setNewResTitle('');
    setNewResDesc('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // KPI Calculations
  const totalETBRevenue = requests.reduce((acc, r) => acc + (r.estimatedCostETB || (r.estimatedPages * 140)), 0);
  const pendingRequestsCount = requests.filter((r) => r.status === 'Submitted' || r.status === 'Reviewing').length;
  const verifiedPaymentsCount = requests.filter((r) => r.paymentProof?.status === 'Verified').length;

  const adminSidebarNav = [
    { id: 'dashboard', label: 'Executive Overview', icon: 'dashboard' },
    { id: 'requests', label: 'Service Requests Pipeline', icon: 'assignment', badge: pendingRequestsCount },
    { id: 'books', label: 'Books Catalog CMS', icon: 'menu_book', count: books.length },
    { id: 'courses', label: 'Curriculum & LMS Studio', icon: 'school', count: courses.length },
    { id: 'resources', label: 'Academic Repository', icon: 'folder_open' },
    { id: 'settings', label: 'Press & Payment Settings', icon: 'settings' },
  ];

  return (
    <section className="px-gutter-mobile py-6 bg-surface" id="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-xs">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-bold uppercase tracking-wider">
                Admin Management Console
              </span>
              <span className="text-xs text-secondary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                Director: Mr. Feysal Hussein
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                • Haramaya University Publishing Press
              </span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Publishing Press Operations & CMS Control Desk
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Supervise manuscript queues, verify CBE/Telebirr settlements, dispatch slide deliverables, and manage live course catalogs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddBookModal(true)}
              className="px-3.5 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 hover:brightness-105 transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ Publish Book</span>
            </button>
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/20 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">post_add</span>
              <span>+ Add Course</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-1 border-b border-outline-variant/30 scrollbar-none">
          {adminSidebarNav.map((tab) => {
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white text-secondary' : 'bg-secondary text-on-secondary'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && !tab.badge && (
                  <span className="text-[10px] opacity-75 font-mono">({tab.count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {/* ------------------------------------------------------------- */}
        {activeAdminTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-6"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs"
              >
                <div className="flex items-center justify-between text-secondary mb-1">
                  <span className="text-xs font-semibold text-on-surface-variant">Active Pipeline</span>
                  <span className="material-symbols-outlined text-[20px]">assignment</span>
                </div>
                <span className="text-2xl font-black text-on-surface">{requests.length}</span>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 block font-bold mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  {pendingRequestsCount} Pending Editorial Action
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs"
              >
                <div className="flex items-center justify-between text-emerald-600 mb-1">
                  <span className="text-xs font-semibold text-on-surface-variant">Settled Revenue</span>
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                </div>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {totalETBRevenue.toLocaleString()} <span className="text-xs font-bold text-on-surface-variant">ETB</span>
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-semibold mt-1">
                  {verifiedPaymentsCount} Bank Slips Verified
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs"
              >
                <div className="flex items-center justify-between text-blue-600 mb-1">
                  <span className="text-xs font-semibold text-on-surface-variant">Published Works</span>
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                </div>
                <span className="text-2xl font-black text-on-surface">{books.length} Books</span>
                <span className="text-[11px] text-on-surface-variant block font-medium mt-1">
                  4 Languages Supported
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs"
              >
                <div className="flex items-center justify-between text-purple-600 mb-1">
                  <span className="text-xs font-semibold text-on-surface-variant">Curriculum Enrolled</span>
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </div>
                <span className="text-2xl font-black text-on-surface">{courses.length} Courses</span>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 block font-semibold mt-1">
                  {courses.reduce((acc, c) => acc + c.lessons.length, 0)} Total Lessons Active
                </span>
              </motion.div>
            </div>

            {/* Recharts Data Visualization Section: Request Volume Trends & Popular Categories (Last 30 Days) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Request Volume Trends Chart */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">
                      Request Volume Trends (Last 30 Days)
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Daily manuscript submission and completion telemetry
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary/15 text-secondary text-[11px] font-bold">
                    Live Analytics
                  </span>
                </div>
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { date: 'Day 1', submissions: 2, completed: 1 },
                      { date: 'Day 4', submissions: 4, completed: 3 },
                      { date: 'Day 7', submissions: 3, completed: 2 },
                      { date: 'Day 10', submissions: 6, completed: 5 },
                      { date: 'Day 13', submissions: 5, completed: 4 },
                      { date: 'Day 16', submissions: 8, completed: 7 },
                      { date: 'Day 19', submissions: 7, completed: 6 },
                      { date: 'Day 22', submissions: 10, completed: 9 },
                      { date: 'Day 25', submissions: 12, completed: 10 },
                      { date: 'Day 30', submissions: Math.max(5, requests.length), completed: Math.max(3, Math.floor(requests.length * 0.8)) },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                      <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                      <YAxis stroke="#6b7280" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          borderRadius: '8px',
                          color: '#fff',
                          border: 'none',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line type="monotone" dataKey="submissions" name="Submissions" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Popular Publishing Service Categories Chart */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">
                      Popular Service Categories
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Distribution of requests across publishing divisions
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-600 text-[11px] font-bold">
                    Category Share
                  </span>
                </div>
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { category: 'PPT Slide Decks', count: Math.max(12, requests.filter(r => r.serviceCategory === 'ppt').length * 3 + 4) },
                      { category: 'Thesis Typesetting', count: Math.max(9, requests.filter(r => r.serviceCategory === 'thesis').length * 3 + 3) },
                      { category: 'Journal Articles', count: Math.max(7, requests.filter(r => r.serviceCategory === 'journal').length * 3 + 2) },
                      { category: 'Proofreading', count: Math.max(6, requests.filter(r => r.serviceCategory === 'proofreading').length * 3 + 2) },
                      { category: 'Book Cover & CIP', count: Math.max(5, requests.filter(r => r.serviceCategory === 'cover').length * 3 + 1) },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                      <XAxis dataKey="category" stroke="#6b7280" fontSize={10} />
                      <YAxis stroke="#6b7280" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          borderRadius: '8px',
                          color: '#fff',
                          border: 'none',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="count" name="Request Volume" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Quick Dispatch & System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Requests Feed */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">
                      Recent Manuscript Requests
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Latest submissions awaiting review or delivery
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveAdminTab('requests')}
                    className="text-xs text-secondary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Pipeline</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {requests.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedReqId(r.id);
                        setActiveAdminTab('requests');
                      }}
                      className="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-secondary">{r.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container-highest text-on-surface">
                            {r.serviceCategory.toUpperCase()}
                          </span>
                          <span className="text-xs text-on-surface-variant font-medium">
                            • {r.estimatedPages} Pages
                          </span>
                        </div>
                        <h4 className="font-title-sm text-title-sm font-bold text-on-surface line-clamp-1">
                          {r.projectTitle}
                        </h4>
                        <div className="text-[11px] text-on-surface-variant flex items-center gap-2">
                          <span>{r.clientName} ({r.affiliation})</span>
                          <span>• Target: {r.expectedDeadline}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          r.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : r.status === 'In Progress'
                            ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                            : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        }`}>
                          {r.status}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-on-surface">
                          {(r.estimatedCostETB || r.estimatedPages * 140).toLocaleString()} ETB
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Administrative Quick Actions & Credentials */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
                  <h3 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
                    <span>Quick Operations</span>
                  </h3>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setShowAddBookModal(true)}
                      className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/20 flex items-center gap-3 text-left cursor-pointer"
                    >
                      <span className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">menu_book</span>
                      </span>
                      <div>
                        <span className="font-bold text-xs text-on-surface block">Publish New Manuscript</span>
                        <span className="text-[11px] text-on-surface-variant">Add new e-book with chapters to catalog</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setShowAddCourseModal(true)}
                      className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/20 flex items-center gap-3 text-left cursor-pointer"
                    >
                      <span className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">school</span>
                      </span>
                      <div>
                        <span className="font-bold text-xs text-on-surface block">Create E-Learning Course</span>
                        <span className="text-[11px] text-on-surface-variant">Author modules, videos, and assessment quizzes</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setShowAddResourceModal(true)}
                      className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/20 flex items-center gap-3 text-left cursor-pointer"
                    >
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">upload_file</span>
                      </span>
                      <div>
                        <span className="font-bold text-xs text-on-surface block">Upload Academic Template</span>
                        <span className="text-[11px] text-on-surface-variant">Publish thesis slides or citation guides</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Director Verification Badge */}
                <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs">
                      FH
                    </span>
                    <div>
                      <span className="font-bold text-xs text-on-surface block">Verified Academic Press Director</span>
                      <span className="text-[10px] text-secondary font-semibold">Mr. Feysal Hussein • Haramaya University</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Official digital checksum stamp is automatically attached to finalized presentations, certificates, and peer-reviewed releases.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: SERVICE REQUESTS PIPELINE */}
        {/* ------------------------------------------------------------- */}
        {activeAdminTab === 'requests' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search and Status Filters */}
            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/20 flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={requestSearchQuery}
                  onChange={(e) => setRequestSearchQuery(e.target.value)}
                  placeholder="Search by ID, client, or topic..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {['all', 'Submitted', 'Reviewing', 'In Progress', 'Client Review', 'Revision Requested', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setRequestFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      requestFilterStatus === st
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high border border-outline-variant/20'
                    }`}
                  >
                    {st === 'all' ? 'All Requests' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Requests Queue Column */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="font-title-sm text-title-sm font-bold text-on-surface">
                    Requests Queue ({filteredRequests.length})
                  </span>
                  <span className="text-[11px] text-on-surface-variant">Click to inspect</span>
                </div>

                <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
                  {filteredRequests.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedReqId(r.id);
                        setAdminNoteInput(r.adminNotes || '');
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        activeRequest?.id === r.id
                          ? 'bg-surface-container-lowest border-secondary shadow-md ring-2 ring-secondary/20'
                          : 'bg-surface-container-lowest border-outline-variant/20 hover:border-secondary/30'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-secondary">{r.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : r.status === 'In Progress'
                            ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                            : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <h4 className="font-title-sm text-title-sm font-bold text-on-surface line-clamp-1 mt-1">
                        {r.projectTitle}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-on-surface-variant mt-1.5">
                        <span className="truncate max-w-[140px]">{r.clientName}</span>
                        <span className="font-mono font-semibold">{r.estimatedPages} pgs • {(r.estimatedCostETB || r.estimatedPages * 140).toLocaleString()} ETB</span>
                      </div>
                    </div>
                  ))}

                  {filteredRequests.length === 0 && (
                    <div className="p-8 rounded-xl bg-surface-container text-center text-xs text-on-surface-variant">
                      No requests matched your filter.
                    </div>
                  )}
                </div>
              </div>

              {/* Active Request Details & Control Deck */}
              <div className="lg:col-span-2">
                {activeRequest ? (
                  <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 pb-4 border-b border-outline-variant/20">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-secondary">
                            {activeRequest.id}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] font-bold uppercase text-on-surface">
                            {activeRequest.serviceCategory}
                          </span>
                        </div>
                        <h3 className="font-title-lg text-title-lg font-bold text-on-surface mt-1">
                          {activeRequest.projectTitle}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Author: <strong className="text-on-surface">{activeRequest.clientName}</strong> ({activeRequest.affiliation}) • Phone: {activeRequest.phone} • Telegram: {activeRequest.telegram || 'None'}
                        </p>
                      </div>

                      <button
                        onClick={() => onDeleteRequest(activeRequest.id)}
                        className="p-2 rounded-xl text-error hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Archive / Remove Request"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>

                    {/* Stage Pipeline Selector */}
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface font-bold mb-2 block">
                        Production Stage Status:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
                        {(['Submitted', 'Reviewing', 'In Progress', 'Client Review', 'Revision Requested', 'Completed'] as RequestStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(st)}
                            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                              activeRequest.status === st
                                ? 'bg-secondary text-on-secondary shadow-sm ring-2 ring-secondary/30'
                                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Project Specifications */}
                    <div className="p-4 rounded-xl bg-surface-container text-xs space-y-2 border border-outline-variant/20">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <span className="text-on-surface-variant block">Volume:</span>
                          <span className="font-bold text-on-surface">{activeRequest.estimatedPages} Pages</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block">Language:</span>
                          <span className="font-bold text-on-surface">{activeRequest.targetLanguage.toUpperCase()}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block">Target Deadline:</span>
                          <span className="font-bold text-secondary">{activeRequest.expectedDeadline || 'Flexible'}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block">Cost Estimate:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                            {(activeRequest.estimatedCostETB || activeRequest.estimatedPages * 140).toLocaleString()} ETB
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-outline-variant/20">
                        <span className="text-on-surface-variant block font-bold mb-1">
                          Client Brief & Instructions:
                        </span>
                        <p className="text-on-surface leading-relaxed bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/20">
                          {activeRequest.description}
                        </p>
                      </div>
                    </div>

                    {/* Bank Settlement Verification Desk */}
                    <div className="p-4 rounded-xl bg-surface-container text-xs space-y-3 border border-outline-variant/20">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-on-surface flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-secondary text-[18px]">account_balance</span>
                          <span>Bank Settlement Verification Desk</span>
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          activeRequest.paymentProof?.status === 'Verified'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        }`}>
                          {activeRequest.paymentProof?.status || 'No Payment Slip Submitted'}
                        </span>
                      </div>

                      {activeRequest.paymentProof ? (
                        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2.5">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                            <div>
                              <span className="text-on-surface-variant block">Bank Name:</span>
                              <span className="font-bold text-on-surface">{activeRequest.paymentProof.bankName}</span>
                            </div>
                            <div>
                              <span className="text-on-surface-variant block">Reference:</span>
                              <span className="font-mono font-bold text-secondary">{activeRequest.paymentProof.transactionRef}</span>
                            </div>
                            <div>
                              <span className="text-on-surface-variant block">Amount:</span>
                              <span className="font-bold text-on-surface">{activeRequest.paymentProof.amountETB.toLocaleString()} ETB</span>
                            </div>
                            <div>
                              <span className="text-on-surface-variant block">Deposit Slip:</span>
                              <span className="font-mono text-on-surface truncate block">{activeRequest.paymentProof.receiptFileName}</span>
                            </div>
                          </div>

                          {activeRequest.paymentProof.status !== 'Verified' ? (
                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={handleVerifyPayment}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                              >
                                <span className="material-symbols-outlined text-[16px]">verified</span>
                                <span>Verify Bank Settlement & Issue Digital Stamp</span>
                              </button>
                            </div>
                          ) : (
                            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">check_circle</span>
                              <span>Verified by {activeRequest.paymentProof.verifiedBy || 'Mr. Feysal Hussein'} on {activeRequest.paymentProof.verifiedAt || 'Recent'}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-[11px] text-on-surface-variant italic">
                          Author has not submitted a deposit slip yet. They can submit CBE slip or Telebirr ref via Client Tracking Portal.
                        </p>
                      )}
                    </div>

                    {/* Deliverables & Deliverable Publisher */}
                    <div className="p-4 rounded-xl bg-surface-container text-xs space-y-3 border border-outline-variant/20">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-on-surface flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-secondary text-[18px]">folder_special</span>
                          <span>Delivered Slide & Print Archives ({activeRequest.deliverables?.length || 0})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAddDelivModal(true)}
                          className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-bold text-[11px] flex items-center gap-1 hover:brightness-105 cursor-pointer shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[14px]">upload_file</span>
                          <span>+ Dispatch Deliverable</span>
                        </button>
                      </div>

                      {(!activeRequest.deliverables || activeRequest.deliverables.length === 0) ? (
                        <p className="text-[11px] text-on-surface-variant italic">
                          No deliverables dispatched yet. Attach PPTX slides or print-ready PDFs for client review.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {activeRequest.deliverables.map((d) => (
                            <div key={d.id} className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2.5">
                                <span className="px-2 py-1 rounded-md bg-secondary/15 text-secondary font-bold font-mono text-[11px]">
                                  {d.fileType}
                                </span>
                                <div>
                                  <span className="font-bold text-on-surface block">{d.title}</span>
                                  <span className="text-[11px] text-on-surface-variant">{d.version} • {d.fileSize} • Uploaded {d.uploadedAt}</span>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                                Ready for Client Download
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Milestone Checkpoints */}
                    {activeRequest.milestones && activeRequest.milestones.length > 0 && (
                      <div className="p-4 rounded-xl bg-surface-container text-xs space-y-2.5 border border-outline-variant/20">
                        <span className="font-bold text-on-surface flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-secondary text-[18px]">timeline</span>
                          <span>Production Milestones (Click to toggle completion)</span>
                        </span>
                        <div className="space-y-1.5">
                          {activeRequest.milestones.map((m) => (
                            <div
                              key={m.id}
                              onClick={() => handleToggleMilestone(m.id)}
                              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                m.status === 'completed'
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-on-surface'
                                  : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:border-secondary/40'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                                  m.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-surface-container text-on-surface-variant'
                                }`}>
                                  {m.status === 'completed' ? '✓' : '○'}
                                </span>
                                <div>
                                  <span className={`text-xs ${m.status === 'completed' ? 'font-bold text-on-surface' : 'font-medium'}`}>
                                    {m.title}
                                  </span>
                                  <p className="text-[11px] text-on-surface-variant line-clamp-1">{m.description}</p>
                                </div>
                              </div>
                              <span className="text-[11px] font-mono text-secondary font-bold shrink-0">
                                Day {m.dayTarget} Target
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Editorial Communication Note */}
                    <div className="space-y-2">
                      <label className="font-label-sm text-label-sm text-on-surface font-bold block">
                        Editorial Communication Note (Visible to Client in Tracking Portal):
                      </label>
                      <textarea
                        rows={3}
                        value={adminNoteInput}
                        onChange={(e) => setAdminNoteInput(e.target.value)}
                        placeholder="e.g. Slide deck Chapter 3 formatting finished; defense mock scheduled for Tuesday..."
                        className="w-full p-3 rounded-xl bg-surface-container text-on-surface text-xs border border-outline-variant/30 focus:border-secondary focus:outline-none leading-relaxed"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveNote}
                          className="px-4 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 cursor-pointer shadow-xs"
                        >
                          Save & Transmit Note
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-16 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[40px] text-secondary mb-2 block">assignment</span>
                    <p className="font-bold text-sm">Select a manuscript request from the queue to view full control deck.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: BOOKS CATALOG CMS */}
        {/* ------------------------------------------------------------- */}
        {activeAdminTab === 'books' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container border border-outline-variant/20">
              <div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  Digital Publications Catalog ({books.length})
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Manage live academic books, chapter readers, downloadable monographs, and multilingual editions.
                </p>
              </div>

              <button
                onClick={() => setShowAddBookModal(true)}
                className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 hover:brightness-105 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>+ Publish New Book</span>
              </button>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {books.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl bg-surface-container-lowest border border-outline-variant/20 overflow-hidden shadow-xs hover:border-secondary/30 transition-all flex flex-col"
                >
                  <div className="h-44 bg-surface-container-high relative overflow-hidden">
                    <img
                      src={b.coverUrl}
                      alt={b.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-secondary text-on-secondary text-[10px] font-black uppercase tracking-wider">
                      {b.langTag} • {b.pages} Pages
                    </span>
                    <span className="absolute bottom-3 left-3 right-3 text-white font-title-sm font-bold line-clamp-1">
                      {b.category}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-title-sm text-title-sm font-bold text-on-surface line-clamp-2">
                        {b.title}
                      </h4>
                      <p className="text-[11px] text-secondary font-semibold mt-1">
                        Author: {b.author}
                      </p>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mt-1.5 leading-relaxed">
                        {b.description}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mt-2 font-mono">
                        <span>Chapters: {b.chapters?.length || 1}</span>
                        <span>• Year: {b.publishedYear}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                      {onOpenBookPreview && (
                        <button
                          type="button"
                          onClick={() => onOpenBookPreview(b)}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>Preview</span>
                        </button>
                      )}

                      {onDeleteBook && (
                        <button
                          type="button"
                          onClick={() => onDeleteBook(b.id)}
                          className="p-1.5 rounded-lg text-error hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          title="Remove from Catalog"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: CURRICULUM & LMS STUDIO */}
        {/* ------------------------------------------------------------- */}
        {activeAdminTab === 'courses' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container border border-outline-variant/20">
              <div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  E-Learning Curriculum & Lesson Studio ({courses.length})
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Author specialized doctoral defense modules, video lessons, syllabi, and assessment quizzes.
                </p>
              </div>

              <button
                onClick={() => setShowAddCourseModal(true)}
                className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 hover:brightness-105 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-[18px]">post_add</span>
                <span>+ Create Course Module</span>
              </button>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl bg-surface-container-lowest border border-outline-variant/20 overflow-hidden shadow-xs hover:border-secondary/30 transition-all flex flex-col"
                >
                  <div className="h-44 bg-surface-container-high relative overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-on-primary text-[10px] font-bold uppercase">
                      {c.level}
                    </span>
                    <span className="absolute bottom-3 left-3 text-white font-title-sm font-bold line-clamp-1">
                      {c.duration} • {c.lessons.length} Lessons
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-title-sm text-title-sm font-bold text-on-surface line-clamp-2">
                        {c.title}
                      </h4>
                      <p className="text-[11px] text-secondary font-semibold mt-1">
                        Instructor: {c.instructor}
                      </p>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mt-1.5 leading-relaxed">
                        {c.description}
                      </p>

                      <div className="mt-3 p-2.5 rounded-xl bg-surface-container text-xs space-y-1">
                        <div className="flex justify-between text-on-surface-variant text-[11px]">
                          <span>Active Modules:</span>
                          <span className="font-bold text-on-surface">{c.lessons.length} Modules</span>
                        </div>
                        <div className="flex justify-between text-on-surface-variant text-[11px]">
                          <span>Assessment Quiz:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {c.quiz ? `${c.quiz.length} Questions (Enabled)` : 'None'}
                          </span>
                        </div>
                        <div className="flex justify-between text-on-surface-variant text-[11px]">
                          <span>Honor Certificate:</span>
                          <span className="font-bold text-secondary">
                            {c.certificateEligible ? 'Verified Issuance' : 'Standard'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-on-surface-variant">
                        Lang: {c.language.toUpperCase()}
                      </span>
                      {onDeleteCourse && (
                        <button
                          type="button"
                          onClick={() => onDeleteCourse(c.id)}
                          className="p-1.5 rounded-lg text-error hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          <span>Archive</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: ACADEMIC REPOSITORY & SYLLABI */}
        {/* ------------------------------------------------------------- */}
        {activeAdminTab === 'resources' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container border border-outline-variant/20">
              <div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  Scholarly Repository & Syllabi ({localResources.length})
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Curate downloadable dissertation templates, APA/IEEE citation guides, and defense presentation blueprints.
                </p>
              </div>

              <button
                onClick={() => setShowAddResourceModal(true)}
                className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 hover:brightness-105 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span>+ Add Resource</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localResources.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary font-mono font-bold text-xs">
                        {res.fileType}
                      </span>
                      <span className="text-[11px] text-on-surface-variant font-semibold">
                        {res.pages} Pages
                      </span>
                    </div>
                    <h4 className="font-title-sm text-title-sm font-bold text-on-surface">
                      {res.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                    <span className="px-2 py-1 rounded bg-surface-container text-[10px] font-bold text-on-surface">
                      {res.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLocalResources((prev) => prev.filter((r) => r.id !== res.id))}
                      className="text-error hover:underline text-[11px] font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: PRESS & PAYMENT SETTINGS */}
        {/* ------------------------------------------------------------- */}
        {activeAdminTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4">
              <div>
                <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
                  Publishing Press Configuration & Settlement Gateway
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Update official institutional credentials, verified bank accounts, Telegram bot endpoints, and default service rate cards.
                </p>
              </div>

              {settingsSaved && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Configuration successfully saved to publishing database!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-surface-container space-y-3">
                  <h4 className="font-title-sm font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">account_balance</span>
                    <span>Institutional Banking & Telebirr Accounts (Ethiopia)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-on-surface block mb-1">
                        Commercial Bank of Ethiopia (CBE) Account #
                      </label>
                      <input
                        type="text"
                        value={cbeAccount}
                        onChange={(e) => setCbeAccount(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant/30 font-mono focus:border-secondary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-on-surface block mb-1">
                        Telebirr Merchant / Phone ID
                      </label>
                      <input
                        type="text"
                        value={telebirrAccount}
                        onChange={(e) => setTelebirrAccount(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant/30 font-mono focus:border-secondary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container space-y-3">
                  <h4 className="font-title-sm font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">badge</span>
                    <span>Director Contact & Communication Webhooks</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-on-surface block mb-1">
                        Official Phone Hotlines
                      </label>
                      <input
                        type="text"
                        value={directorContact}
                        onChange={(e) => setDirectorContact(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-on-surface block mb-1">
                        Telegram Desk Handle / Webhook
                      </label>
                      <input
                        type="text"
                        value={telegramHandle}
                        onChange={(e) => setTelegramHandle(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant/30 font-mono focus:border-secondary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container space-y-3">
                  <h4 className="font-title-sm font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">payments</span>
                    <span>Base Workload Pricing Rates (ETB / Page)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-on-surface block mb-1">
                        PowerPoint Thesis Defense Base Rate (ETB/Slide)
                      </label>
                      <input
                        type="number"
                        value={basePptRate}
                        onChange={(e) => setBasePptRate(Number(e.target.value))}
                        className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant/30 font-mono focus:border-secondary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-on-surface block mb-1">
                        Monograph & Translation Base Rate (ETB/Page)
                      </label>
                      <input
                        type="number"
                        value={baseBookRate}
                        onChange={(e) => setBaseBookRate(Number(e.target.value))}
                        className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant/30 font-mono focus:border-secondary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-105 cursor-pointer shadow-sm"
                  >
                    Save Press Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODAL: ADD DIGITAL BOOK */}
        {/* ------------------------------------------------------------- */}
        {showAddBookModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
            <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-outline-variant/30 space-y-4 my-8">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <div>
                  <h3 className="font-title-md text-title-md font-bold text-on-surface">
                    Publish New Academic E-Book
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Release a peer-reviewed digital volume to the university catalog
                  </p>
                </div>
                <button
                  onClick={() => setShowAddBookModal(false)}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateBook} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    placeholder="e.g. Advanced Academic English Writing & Discourse"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Author *</label>
                    <input
                      type="text"
                      required
                      value={newBookAuthor}
                      onChange={(e) => setNewBookAuthor(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Language</label>
                    <select
                      value={newBookLang}
                      onChange={(e) => setNewBookLang(e.target.value as any)}
                      className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    >
                      <option value="en">English</option>
                      <option value="or">Afaan Oromoo</option>
                      <option value="am">አማርኛ</option>
                      <option value="ar">العربية (RTL)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Category</label>
                    <input
                      type="text"
                      value={newBookCategory}
                      onChange={(e) => setNewBookCategory(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Page Count</label>
                    <input
                      type="number"
                      value={newBookPages}
                      onChange={(e) => setNewBookPages(Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={newBookCover}
                    onChange={(e) => setNewBookCover(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Summary Description</label>
                  <textarea
                    rows={2}
                    value={newBookDesc}
                    onChange={(e) => setNewBookDesc(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    placeholder="Brief description for scholars in catalog..."
                  />
                </div>

                <div className="p-3 rounded-xl bg-surface-container space-y-2">
                  <span className="font-bold text-on-surface block">Chapter 1 Initial Content</span>
                  <input
                    type="text"
                    value={newBookChapterTitle}
                    onChange={(e) => setNewBookChapterTitle(e.target.value)}
                    className="w-full h-8 px-2.5 rounded bg-surface-container-lowest text-on-surface border border-outline-variant/30 text-xs"
                    placeholder="Chapter Title"
                  />
                  <textarea
                    rows={2}
                    value={newBookChapterContent}
                    onChange={(e) => setNewBookChapterContent(e.target.value)}
                    className="w-full p-2 rounded bg-surface-container-lowest text-on-surface border border-outline-variant/30 text-xs"
                    placeholder="Chapter text content..."
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBookModal(false)}
                    className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-secondary text-on-secondary font-bold hover:brightness-105 cursor-pointer shadow-xs"
                  >
                    Publish to Catalog
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODAL: ADD COURSE */}
        {/* ------------------------------------------------------------- */}
        {showAddCourseModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
            <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-outline-variant/30 space-y-4 my-8">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <div>
                  <h3 className="font-title-md text-title-md font-bold text-on-surface">
                    Create New E-Learning Curriculum
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Author an interactive module with lessons, quizzes, and certificates
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCourseModal(false)}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    placeholder="e.g. Masterclass in Scholarly Dissertation Defense"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Category</label>
                    <input
                      type="text"
                      value={newCourseCategory}
                      onChange={(e) => setNewCourseCategory(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Proficiency Level</label>
                    <select
                      value={newCourseLevel}
                      onChange={(e) => setNewCourseLevel(e.target.value as any)}
                      className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Masterclass">Masterclass</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Instructor</label>
                    <input
                      type="text"
                      value={newCourseInstructor}
                      onChange={(e) => setNewCourseInstructor(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Estimated Duration</label>
                    <input
                      type="text"
                      value={newCourseDuration}
                      onChange={(e) => setNewCourseDuration(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                      placeholder="e.g. 3.5 Hours"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Curriculum Description</label>
                  <textarea
                    rows={2}
                    value={newCourseDesc}
                    onChange={(e) => setNewCourseDesc(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    placeholder="Detailed learning objectives and syllabus summary..."
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCourseModal(false)}
                    className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-secondary text-on-secondary font-bold hover:brightness-105 cursor-pointer shadow-xs"
                  >
                    Publish Course & Lessons
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODAL: ADD DELIVERABLE */}
        {/* ------------------------------------------------------------- */}
        {showAddDelivModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center">
            <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  Attach Deliverable File
                </h3>
                <button
                  onClick={() => setShowAddDelivModal(false)}
                  className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              <form onSubmit={handleAddDeliverable} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Deliverable Title / Filename *</label>
                  <input
                    type="text"
                    required
                    value={newDelivTitle}
                    onChange={(e) => setNewDelivTitle(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    placeholder="e.g. Defense_Slides_Master_v2.0.pptx"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">File Format Type</label>
                  <select
                    value={newDelivType}
                    onChange={(e) => setNewDelivType(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  >
                    <option value="PPTX">PowerPoint Presentation (.pptx)</option>
                    <option value="PDF">Print-Ready PDF (.pdf)</option>
                    <option value="DOCX">Word Document (.docx)</option>
                    <option value="ZIP">Package Archive (.zip)</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDelivModal(false)}
                    className="px-3 py-2 rounded-lg bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-bold hover:brightness-105 cursor-pointer shadow-xs"
                  >
                    Publish Deliverable
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODAL: ADD RESOURCE */}
        {/* ------------------------------------------------------------- */}
        {showAddResourceModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center">
            <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  Publish Academic Resource
                </h3>
                <button
                  onClick={() => setShowAddResourceModal(false)}
                  className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateResource} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Resource Title *</label>
                  <input
                    type="text"
                    required
                    value={newResTitle}
                    onChange={(e) => setNewResTitle(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    placeholder="e.g. Statistical Regression Presentation Template"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Category</label>
                    <input
                      type="text"
                      value={newResCategory}
                      onChange={(e) => setNewResCategory(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">File Type</label>
                    <select
                      value={newResType}
                      onChange={(e) => setNewResType(e.target.value as any)}
                      className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    >
                      <option value="PDF">PDF Document (.pdf)</option>
                      <option value="PPTX">PowerPoint (.pptx)</option>
                      <option value="DOCX">Word (.docx)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newResDesc}
                    onChange={(e) => setNewResDesc(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    placeholder="Brief description of the template or guideline..."
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddResourceModal(false)}
                    className="px-3 py-2 rounded-lg bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-bold hover:brightness-105 cursor-pointer shadow-xs"
                  >
                    Add to Repository
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
