import React, { useState, useEffect } from 'react';
import {
  Book,
  Certificate,
  Course,
  Language,
  RequestStatus,
  ServiceCategory,
  ServiceRequest,
  ThemeMode,
} from './types';
import {
  INITIAL_BOOKS,
  INITIAL_CERTIFICATES,
  INITIAL_COURSES,
  INITIAL_REQUESTS,
  INITIAL_RESOURCES,
} from './data/initialData';

import { ModernLandingPage } from './components/ModernLandingPage';
import { UploadedLandingPage } from './components/UploadedLandingPage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TrustBar } from './components/TrustBar';
import { HeroSection } from './components/HeroSection';
import { ValuePropsRibbon } from './components/ValuePropsRibbon';
import { PublishingCategories } from './components/PublishingCategories';
import { ELearningBanner } from './components/ELearningBanner';
import { DirectContactRibbon } from './components/DirectContactRibbon';
import { ServicesMatrix } from './components/ServicesMatrix';
import { ServicesDetailedShowcase } from './components/ServicesDetailedShowcase';
import { WorkloadEstimator } from './components/WorkloadEstimator';
import { BookLibrary } from './components/BookLibrary';
import { EditorialProcess } from './components/EditorialProcess';
import { HaramayaCredentials } from './components/HaramayaCredentials';
import { Footer } from './components/Footer';
import { ServiceRequestModal } from './components/ServiceRequestModal';
import { BookReaderModal } from './components/BookReaderModal';
import { BookPreviewModal } from './components/BookPreviewModal';
import { ELearningSection } from './components/ELearningSection';
import { StudentDashboard } from './components/StudentDashboard';
import { AboutSection } from './components/AboutSection';
import { ResourcesSection } from './components/ResourcesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { ClientPortal } from './components/ClientPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { DashboardsHub } from './components/DashboardsHub';
import { PeerReviewerDashboard } from './components/PeerReviewerDashboard';
import { FacultyResearcherDashboard } from './components/FacultyResearcherDashboard';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { FAQSection } from './components/FAQSection';
import { CertificateVerificationModal } from './components/CertificateVerificationModal';
import { QuotationGeneratorModal } from './components/QuotationGeneratorModal';
import { ManuscriptDiagnosticModal } from './components/ManuscriptDiagnosticModal';
import { AcademicGlossaryModal } from './components/AcademicGlossaryModal';
import { CitationExportModal } from './components/CitationExportModal';
import { ThesisSlideStudioModal } from './components/ThesisSlideStudioModal';
import { PeerReviewModal } from './components/PeerReviewModal';
import { BookCoverStudioModal } from './components/BookCoverStudioModal';
import { CIPGeneratorModal } from './components/CIPGeneratorModal';
import { AcademicProofreaderModal } from './components/AcademicProofreaderModal';
import { AcademicPosterStudioModal } from './components/AcademicPosterStudioModal';
import { PlagiarismScannerModal } from './components/PlagiarismScannerModal';
import { ResearchGrantStudioModal } from './components/ResearchGrantStudioModal';
import { DOIStudioModal } from './components/DOIStudioModal';
import { JournalWorkflowModal } from './components/JournalWorkflowModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { LoginPage } from './components/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ComputerTrainingPage } from './components/ComputerTrainingPage';
import { InstitutionalRepositoryPortal } from './components/InstitutionalRepositoryPortal';
import { ResearchEthicsIntelligencePortal } from './components/ResearchEthicsIntelligencePortal';
import { TechTransferExtensionHub } from './components/TechTransferExtensionHub';
import { EnterpriseRBACDashboard } from './components/admin/EnterpriseRBACDashboard';
import { DigitalStorePage } from './components/store/DigitalStorePage';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, isAuthenticated, intendedRoute, setIntendedRoute } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('wirtuu_theme') as ThemeMode | null;
    if (saved === 'light' || saved === 'dark' || saved === 'netflix') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const darkMode = theme === 'dark' || theme === 'netflix';

  // Sync activeTab with URL hash for persistent navigation and direct URL access
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== activeTab) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'home') {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else {
      if (window.location.hash !== `#${activeTab}`) {
        window.history.replaceState(null, '', `#${activeTab}`);
      }
    }
  }, [activeTab]);

  // App data state
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [bookLanguageFilter, setBookLanguageFilter] = useState<string>('all');

  // Modal and drawer states
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [modalInitialCategory, setModalInitialCategory] = useState<ServiceCategory>('ppt');
  const [modalInitialPages, setModalInitialPages] = useState<number>(25);

  const [activeReaderBook, setActiveReaderBook] = useState<Book | null>(null);
  const [activePreviewBook, setActivePreviewBook] = useState<Book | null>(null);
  const [showGlobalSearch, setShowGlobalSearch] = useState<boolean>(false);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);

  // Phase 9 & Phase 10 & Phase 11: Academic Tools Modals
  const [showQuotationModal, setShowQuotationModal] = useState<boolean>(false);
  const [quotationCategory, setQuotationCategory] = useState<ServiceCategory>('ppt');
  const [quotationPages, setQuotationPages] = useState<number>(25);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState<boolean>(false);
  const [showGlossaryModal, setShowGlossaryModal] = useState<boolean>(false);
  const [showCitationModal, setShowCitationModal] = useState<boolean>(false);
  const [citationTargetBook, setCitationTargetBook] = useState<Book | null>(null);
  const [showThesisSlideModal, setShowThesisSlideModal] = useState<boolean>(false);
  const [showPeerReviewModal, setShowPeerReviewModal] = useState<boolean>(false);
  const [showCoverStudioModal, setShowCoverStudioModal] = useState<boolean>(false);
  const [showCIPModal, setShowCIPModal] = useState<boolean>(false);
  const [showProofreaderModal, setShowProofreaderModal] = useState<boolean>(false);
  const [showPosterStudioModal, setShowPosterStudioModal] = useState<boolean>(false);
  const [showPlagiarismModal, setShowPlagiarismModal] = useState<boolean>(false);
  const [showGrantStudioModal, setShowGrantStudioModal] = useState<boolean>(false);
  const [showDOIModal, setShowDOIModal] = useState<boolean>(false);
  const [showJournalWorkflowModal, setShowJournalWorkflowModal] = useState<boolean>(false);
  const [studioTargetBook, setStudioTargetBook] = useState<Book | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync theme class and attribute with root html and localStorage
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'theme-netflix');
    document.documentElement.removeAttribute('data-theme');

    if (theme === 'netflix') {
      document.documentElement.classList.add('dark', 'theme-netflix');
      document.documentElement.setAttribute('data-theme', 'netflix');
      localStorage.setItem('wirtuu_theme', 'netflix');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('wirtuu_theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('wirtuu_theme', 'light');
    }
  }, [theme]);

  // Sync RTL direction when language changes to Arabic
  useEffect(() => {
    if (currentLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [currentLanguage]);

  // Global Keyboard Shortcuts (Ctrl+K / Cmd+K or '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true';

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowGlobalSearch((prev) => !prev);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load and synchronize requests from server persistence
  useEffect(() => {
    fetch('/api/requests')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.requests) && data.requests.length > 0) {
          setRequests((prev) => {
            const serverIds = new Set(data.requests.map((r: ServiceRequest) => r.id));
            const uniqueInitial = prev.filter((r) => !serverIds.has(r.id));
            return [...data.requests, ...uniqueInitial];
          });
        }
      })
      .catch((err) => console.warn('Could not load server requests:', err));
  }, []);

  // Service request handlers
  const handleOpenRequestModal = (category: ServiceCategory = 'ppt', pages: number = 25) => {
    setModalInitialCategory(category);
    setModalInitialPages(pages);
    setShowRequestModal(true);
  };

  const handleOpenQuotation = (pages: number = 25, category: ServiceCategory = 'ppt') => {
    setQuotationPages(pages);
    setQuotationCategory(category);
    setShowQuotationModal(true);
  };

  const handleRequestCreated = async (newReq: ServiceRequest) => {
    setRequests((prev) => [newReq, ...prev]);
    showToast(`Request ${newReq.id} recorded! You can track it in My Projects.`);
    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq),
      });
    } catch (err) {
      console.warn('Could not sync request creation to server:', err);
    }
  };

  const handleUpdateRequestStatus = async (
    requestId: string,
    newStatus: RequestStatus,
    note?: string
  ) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: newStatus, adminNotes: note || r.adminNotes } : r
      )
    );
    showToast(`Request ${requestId} status changed to ${newStatus}.`);
    try {
      await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes: note }),
      });
    } catch (err) {
      console.warn('Could not sync status update to server:', err);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    showToast(`Request archived.`);
    try {
      await fetch(`/api/requests/${requestId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Could not sync deletion to server:', err);
    }
  };

  // Book catalog handlers
  const handleToggleBookmark = (bookId: string) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          const nextState = !b.bookmarked;
          showToast(nextState ? `Saved "${b.title}" to bookmarks` : `Removed from bookmarks`);
          return { ...b, bookmarked: nextState };
        }
        return b;
      })
    );
  };

  const handleAddBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
    showToast(`Publication "${newBook.title}" released to university catalog!`);
  };

  // E-Learning course handlers
  const handleEnrollCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, enrolled: true, progress: 10 } : c))
    );
    showToast('Enrolled successfully! Curriculum ready to begin.');
  };

  const handleCompleteLesson = (courseId: string, lessonId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedLessons = c.lessons.map((l) =>
            l.id === lessonId ? { ...l, completed: true } : l
          );
          const completedCount = updatedLessons.filter((l) => l.completed).length;
          const newProgress = Math.round((completedCount / updatedLessons.length) * 100);
          return { ...c, lessons: updatedLessons, progress: newProgress };
        }
        return c;
      })
    );
    showToast('Lesson marked complete!');
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface flex flex-col antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed transition-colors">
      {/* PWA Network Status & Install Trigger Ribbon */}
      <PWAInstallBanner />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-primary-container text-surface text-xs font-semibold shadow-2xl border border-secondary/40 flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <span className="material-symbols-outlined text-secondary text-[18px]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header with comprehensive navigation */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSearch={() => setShowGlobalSearch(true)}
        onRequestClick={() => handleOpenRequestModal('ppt', 25)}
        onOpenVerify={() => setShowVerifyModal(true)}
        onOpenQuotation={() => handleOpenQuotation(25, 'ppt')}
        onOpenDiagnostic={() => setShowDiagnosticModal(true)}
        onOpenGlossary={() => setShowGlossaryModal(true)}
        onOpenCitation={() => {
          setCitationTargetBook(books[0] || null);
          setShowCitationModal(true);
        }}
        onOpenThesisSlideStudio={() => setShowThesisSlideModal(true)}
        onOpenPeerReview={() => setShowPeerReviewModal(true)}
        onOpenCoverStudio={() => {
          setStudioTargetBook(books[0] || null);
          setShowCoverStudioModal(true);
        }}
        onOpenCIP={() => {
          setStudioTargetBook(books[0] || null);
          setShowCIPModal(true);
        }}
        onOpenProofreader={() => setShowProofreaderModal(true)}
        onOpenPosterStudio={() => {
          setStudioTargetBook(books[0] || null);
          setShowPosterStudioModal(true);
        }}
        onOpenPlagiarism={() => {
          setStudioTargetBook(books[0] || null);
          setShowPlagiarismModal(true);
        }}
        onOpenGrantStudio={() => setShowGrantStudioModal(true)}
        onOpenDOI={() => {
          setStudioTargetBook(books[0] || null);
          setShowDOIModal(true);
        }}
        onOpenJournalWorkflow={() => setShowJournalWorkflowModal(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => {
          setTheme((prev) => (prev === 'light' ? 'dark' : prev === 'dark' ? 'netflix' : 'light'));
        }}
        theme={theme}
        onThemeChange={setTheme}
        pendingRequestsCount={requests.filter((r) => r.status === 'Submitted').length}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col relative w-full pt-[88px] pb-20 bg-surface">
        {/* TAB: HOME / UPLOADED LANDING PAGE */}
        {activeTab === 'home' && (
          <UploadedLandingPage
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            onRequestClick={(cat, pgs) => handleOpenRequestModal(cat || 'ppt', pgs || 25)}
            onExploreCourses={() => setActiveTab('elearning')}
            onExploreBooks={() => setActiveTab('books')}
            onOpenSearch={() => setShowGlobalSearch(true)}
            onOpenQuotation={(pgs, cat) => handleOpenQuotation(pgs || 25, cat || 'ppt')}
            onOpenDiagnostic={() => setShowDiagnosticModal(true)}
            onOpenThesisSlideStudio={() => setShowThesisSlideModal(true)}
            onOpenDOI={() => setShowDOIModal(true)}
            onOpenPeerReview={() => setShowPeerReviewModal(true)}
            onOpenPlagiarism={() => setShowPlagiarismModal(true)}
            onOpenCoverStudio={() => setShowCoverStudioModal(true)}
            onOpenCIP={() => setShowCIPModal(true)}
            onOpenProofreader={() => setShowProofreaderModal(true)}
            onOpenPosterStudio={() => setShowPosterStudioModal(true)}
            onOpenGrantStudio={() => setShowGrantStudioModal(true)}
            onOpenGlossary={() => setShowGlossaryModal(true)}
            onOpenVerify={() => setShowVerifyModal(true)}
            onOpenReader={(b) => setActiveReaderBook(b)}
            books={books}
            courses={courses}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenLogin={() => setActiveTab('login')}
          />
        )}

        {/* TAB: ABOUT US */}
        {activeTab === 'about' && (
          <div className="pt-2">
            <AboutSection
              currentLanguage={currentLanguage}
              onRequestClick={() => handleOpenRequestModal('ppt', 25)}
              onExploreCourses={() => setActiveTab('elearning')}
            />
            <HaramayaCredentials />
          </div>
        )}

        {/* TAB: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-6 pt-2">
            {/* Detailed Feature Showcase from tt.png */}
            <ServicesDetailedShowcase
              currentLanguage={currentLanguage}
              onRequestCategory={(category) => handleOpenRequestModal(category, 25)}
            />
            <ServicesMatrix
              currentLanguage={currentLanguage}
              onRequestCategory={(category) => handleOpenRequestModal(category, 25)}
            />
            <WorkloadEstimator
              currentLanguage={currentLanguage}
              onEstimateSubmit={(pages, category) => handleOpenRequestModal(category, pages)}
              onOpenQuotation={handleOpenQuotation}
              onOpenDiagnostic={() => setShowDiagnosticModal(true)}
            />
            <DirectContactRibbon
              currentLanguage={currentLanguage}
              onRequestClick={() => handleOpenRequestModal('ppt', 25)}
            />
            <EditorialProcess
              currentLanguage={currentLanguage}
              onRequestClick={() => handleOpenRequestModal('ppt', 25)}
            />
          </div>
        )}

        {/* TAB: BOOKS */}
        {activeTab === 'books' && (
          <div className="pt-2 space-y-4">
            <PublishingCategories
              currentLanguage={currentLanguage}
              onSelectCategory={(catId) => setBookLanguageFilter(catId)}
            />
            <BookLibrary
              currentLanguage={currentLanguage}
              books={books}
              selectedLanguage={bookLanguageFilter}
              onLanguageFilterChange={setBookLanguageFilter}
              onOpenReader={(b) => setActiveReaderBook(b)}
              onOpenPreview={(b) => setActivePreviewBook(b)}
              onToggleBookmark={handleToggleBookmark}
            />
            <HaramayaCredentials />
          </div>
        )}

        {/* TAB: E-LEARNING */}
        {activeTab === 'elearning' && (
          <div className="pt-2 space-y-6">
            <ELearningBanner
              currentLanguage={currentLanguage}
              onStartLearning={() => {
                const el = document.getElementById('elearning-player') || document.querySelector('main');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onBrowseCourses={() => {
                const el = document.getElementById('elearning-player') || document.querySelector('main');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <ELearningSection
              currentLanguage={currentLanguage}
              courses={courses}
              onEnrollCourse={handleEnrollCourse}
              onCompleteLesson={handleCompleteLesson}
            />
          </div>
        )}

        {/* TAB: LOGIN / AUTHENTICATION */}
        {activeTab === 'login' && (
          <div className="pt-6 max-w-4xl mx-auto w-full px-4">
            <LoginPage
              currentLanguage={currentLanguage}
              onSuccessRedirect={() => {
                if (intendedRoute) {
                  const target = intendedRoute;
                  setIntendedRoute(null);
                  setActiveTab(target);
                } else {
                  setActiveTab('dashboards');
                }
              }}
            />
          </div>
        )}

        {/* TAB: DIGITAL STORE / MARKETPLACE */}
        {(activeTab === 'store' || activeTab === 'digital_store' || activeTab === 'marketplace') && (
          <div className="pt-2">
            <DigitalStorePage currentUser={user} onNavigate={setActiveTab} />
          </div>
        )}

        {/* TAB: COMPUTER TRAINING SKILLS */}
        {activeTab === 'computer_training' && (
          <div className="pt-2">
            <ComputerTrainingPage
              currentLanguage={currentLanguage}
              onOpenVerify={() => setShowVerifyModal(true)}
              onShowToast={showToast}
              onNavigateHome={() => setActiveTab('home')}
            />
          </div>
        )}

        {/* TAB: STUDENT DASHBOARD (from tt.png) */}
        {activeTab === 'student' && (
          <ProtectedRoute
            currentLanguage={currentLanguage}
            routeName="Scholar Workspace"
            onNavigateHome={() => setActiveTab('home')}
            onLoginSuccess={() => setActiveTab('student')}
          >
            <div className="pt-2">
              <StudentDashboard
                currentLanguage={currentLanguage}
                courses={courses}
                books={books}
                onOpenCourse={(c) => {
                  setActiveTab('elearning');
                }}
                onOpenBook={(b) => setActiveReaderBook(b)}
                onNavigateHome={() => setActiveTab('home')}
                onOpenVerify={(certId) => {
                  setShowVerifyModal(true);
                }}
                onShowToast={showToast}
                certificates={certificates}
                onAddCertificate={(newCert) => setCertificates((prev) => [newCert, ...prev])}
              />
            </div>
          </ProtectedRoute>
        )}

        {/* TAB: RESOURCES (from tt.png) */}
        {activeTab === 'resources' && (
          <div className="pt-2">
            <ResourcesSection
              currentLanguage={currentLanguage}
              onOpenQuotation={() => handleOpenQuotation(25, 'ppt')}
              onOpenDiagnostic={() => setShowDiagnosticModal(true)}
              onOpenGlossary={() => setShowGlossaryModal(true)}
            />
          </div>
        )}

        {/* TAB: PORTFOLIO (from tt.png) */}
        {activeTab === 'portfolio' && (
          <div className="pt-2">
            <PortfolioSection
              currentLanguage={currentLanguage}
              onRequestClick={() => handleOpenRequestModal('ppt', 25)}
            />
          </div>
        )}

        {/* TAB: BLOG (from tt.png) */}
        {activeTab === 'blog' && (
          <div className="pt-2">
            <BlogSection currentLanguage={currentLanguage} />
          </div>
        )}

        {/* TAB: CONTACT (from tt.png) */}
        {activeTab === 'contact' && (
          <div className="pt-2">
            <ContactSection
              currentLanguage={currentLanguage}
              onRequestService={() => handleOpenRequestModal('ppt', 25)}
            />
          </div>
        )}

        {/* TAB: CLIENT TRACKING PORTAL */}
        {activeTab === 'portal' && (
          <ProtectedRoute
            currentLanguage={currentLanguage}
            routeName="Author Submission Portal"
            onNavigateHome={() => setActiveTab('home')}
            onLoginSuccess={() => setActiveTab('portal')}
          >
            <div className="pt-2">
              <ClientPortal
                requests={requests}
                onRequestNew={() => handleOpenRequestModal('ppt', 25)}
                onUpdateRequest={(updatedReq) => {
                  setRequests((prev) =>
                    prev.map((r) => (r.id === updatedReq.id ? updatedReq : r))
                  );
                  showToast(`Project ${updatedReq.id} updated.`);
                }}
              />
            </div>
          </ProtectedRoute>
        )}

        {/* TAB: DASHBOARDS HUB */}
        {activeTab === 'dashboards' && (
          <ProtectedRoute
            currentLanguage={currentLanguage}
            routeName="Dashboards Hub"
            onNavigateHome={() => setActiveTab('home')}
            onLoginSuccess={() => setActiveTab('dashboards')}
          >
            <div className="pt-2">
              <DashboardsHub
                currentLanguage={currentLanguage}
                onSelectDashboard={(dashTab) => setActiveTab(dashTab)}
                pendingRequestsCount={requests.filter((r) => r.status === 'Submitted' || r.status === 'In Progress').length}
                totalBooksCount={books.length}
                totalCoursesCount={courses.length}
              />
            </div>
          </ProtectedRoute>
        )}

        {/* TAB: PEER REVIEWER & JOURNAL EDITORIAL DASHBOARD */}
        {activeTab === 'peer_review' && (
          <ProtectedRoute
            currentLanguage={currentLanguage}
            routeName="Peer Review & Journal Desk"
            allowedRoles={['reviewer', 'admin', 'faculty']}
            onNavigateHome={() => setActiveTab('home')}
            onLoginSuccess={() => setActiveTab('peer_review')}
          >
            <div className="pt-2">
              <PeerReviewerDashboard
                currentLanguage={currentLanguage}
                onOpenDOIStudio={() => setShowDOIModal(true)}
                onOpenPlagiarismScanner={() => setShowPlagiarismModal(true)}
                onOpenProofreader={() => setShowProofreaderModal(true)}
                onNavigateHome={() => setActiveTab('home')}
                onShowToast={showToast}
              />
            </div>
          </ProtectedRoute>
        )}

        {/* TAB: FACULTY RESEARCHER & GRANTS DASHBOARD */}
        {activeTab === 'faculty' && (
          <ProtectedRoute
            currentLanguage={currentLanguage}
            routeName="Faculty & Research Grants Desk"
            allowedRoles={['faculty', 'admin']}
            onNavigateHome={() => setActiveTab('home')}
            onLoginSuccess={() => setActiveTab('faculty')}
          >
            <div className="pt-2">
              <FacultyResearcherDashboard
                currentLanguage={currentLanguage}
                onOpenGrantStudio={() => setShowGrantStudioModal(true)}
                onOpenThesisSlideStudio={() => setShowThesisSlideModal(true)}
                onOpenPosterStudio={() => setShowPosterStudioModal(true)}
                onNavigateHome={() => setActiveTab('home')}
                onShowToast={showToast}
              />
            </div>
          </ProtectedRoute>
        )}

        {/* TAB: ADMIN OPERATIONS DESK */}
        {activeTab === 'admin' && (
          <ProtectedRoute
            currentLanguage={currentLanguage}
            routeName="Registrar & Admin Operations Desk"
            allowedRoles={['admin']}
            onNavigateHome={() => setActiveTab('home')}
            onLoginSuccess={() => setActiveTab('admin')}
          >
            <div className="pt-2">
              <AdminDashboard
                requests={requests}
                books={books}
                courses={courses}
                onUpdateRequestStatus={handleUpdateRequestStatus}
                onAddBook={handleAddBook}
                onDeleteBook={(bookId) => {
                  setBooks((prev) => prev.filter((b) => b.id !== bookId));
                  showToast(`Publication removed from catalog.`);
                }}
                onDeleteRequest={handleDeleteRequest}
                onUpdateRequest={(updatedReq) => {
                  setRequests((prev) =>
                    prev.map((r) => (r.id === updatedReq.id ? updatedReq : r))
                  );
                  showToast(`Project ${updatedReq.id} updated.`);
                }}
                onAddCourse={(newCourse) => {
                  setCourses((prev) => [newCourse, ...prev]);
                  showToast(`Course "${newCourse.title}" published!`);
                }}
                onDeleteCourse={(courseId) => {
                  setCourses((prev) => prev.filter((c) => c.id !== courseId));
                  showToast(`Course archived.`);
                }}
                onOpenBookPreview={(book) => setActivePreviewBook(book)}
                onShowToast={showToast}
              />
            </div>
          </ProtectedRoute>
        )}

        {/* TAB: ENTERPRISE HIERARCHICAL RBAC & PERMISSION CENTER */}
        {(activeTab === 'rbac_admin' || activeTab === 'rbac' || activeTab === 'permissions_admin') && (
          <ProtectedRoute
            currentLanguage={currentLanguage}
            routeName="Enterprise RBAC & Permission Center"
            allowedRoles={['admin', 'superadmin']}
            requiredPermission="admins.view"
            onNavigateHome={() => setActiveTab('home')}
            onLoginSuccess={() => setActiveTab('rbac_admin')}
          >
            <div className="pt-2">
              <EnterpriseRBACDashboard
                onNavigateHome={() => setActiveTab('home')}
                onShowToast={showToast}
              />
            </div>
          </ProtectedRoute>
        )}

        {/* TAB: INSTITUTIONAL OPEN ACCESS REPOSITORY & ETD ARCHIVE (PHASE 7) */}
        {activeTab === 'repository' && (
          <div className="pt-2">
            <InstitutionalRepositoryPortal
              onBackToHub={() => setActiveTab('dashboards')}
              onOpenClearanceDesk={() => setActiveTab('admin')}
            />
          </div>
        )}

        {/* TAB: INSTITUTIONAL REVIEW BOARD (IRB) & RESEARCH INTELLIGENCE (PHASE 8) */}
        {(activeTab === 'irb' || activeTab === 'ethics_irb') && (
          <div className="pt-2">
            <ResearchEthicsIntelligencePortal
              onBackToHub={() => setActiveTab('dashboards')}
              onOpenFacultyGrants={() => setActiveTab('faculty')}
              onOpenRepository={() => setActiveTab('repository')}
            />
          </div>
        )}

        {/* TAB: TECHNOLOGY TRANSFER, HU-BIIC INCUBATION & COMMUNITY EXTENSION (PHASE 9) */}
        {(activeTab === 'tech_transfer' || activeTab === 'extension_hub' || activeTab === 'incubation') && (
          <div className="pt-2">
            <TechTransferExtensionHub
              currentLanguage={currentLanguage}
              onBackToHub={() => setActiveTab('dashboards')}
              onOpenFacultyGrants={() => setActiveTab('faculty')}
              onOpenRepository={() => setActiveTab('repository')}
            />
          </div>
        )}
      </main>

      {/* Institutional Academic Footer */}
      <Footer currentLanguage={currentLanguage} onNavigate={setActiveTab} />

      {/* Fixed Bottom Navigation (Mobile) */}
      <BottomNav
        currentLanguage={currentLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Service Request Modal */}
      {showRequestModal && (
        <ServiceRequestModal
          currentLanguage={currentLanguage}
          initialCategory={modalInitialCategory}
          initialPages={modalInitialPages}
          onClose={() => setShowRequestModal(false)}
          onSubmitSuccess={handleRequestCreated}
        />
      )}

      {/* Digital Book Reader Modal */}
      {activeReaderBook && (
        <BookReaderModal
          book={activeReaderBook}
          onClose={() => setActiveReaderBook(null)}
          onToggleBookmark={handleToggleBookmark}
          onOpenCitation={(b) => {
            setCitationTargetBook(b);
            setShowCitationModal(true);
          }}
          onOpenCoverStudio={(b) => {
            setStudioTargetBook(b);
            setShowCoverStudioModal(true);
          }}
          onOpenCIP={(b) => {
            setStudioTargetBook(b);
            setShowCIPModal(true);
          }}
          onOpenProofreader={() => setShowProofreaderModal(true)}
          onOpenPosterStudio={(b) => {
            setStudioTargetBook(b);
            setShowPosterStudioModal(true);
          }}
          onOpenPlagiarism={(b) => {
            setStudioTargetBook(b);
            setShowPlagiarismModal(true);
          }}
          onOpenGrantStudio={() => setShowGrantStudioModal(true)}
          onOpenDOI={(b) => {
            setStudioTargetBook(b);
            setShowDOIModal(true);
          }}
          onOpenJournalWorkflow={() => setShowJournalWorkflowModal(true)}
        />
      )}

      {/* Book Quick Preview Modal */}
      {activePreviewBook && (
        <BookPreviewModal
          book={activePreviewBook}
          onClose={() => setActivePreviewBook(null)}
          onReadOnline={() => {
            const b = activePreviewBook;
            setActivePreviewBook(null);
            setActiveReaderBook(b);
          }}
          onOpenCitation={(b) => {
            setCitationTargetBook(b);
            setShowCitationModal(true);
          }}
        />
      )}

      {/* Global Search Modal */}
      {showGlobalSearch && (
        <GlobalSearchModal
          books={books}
          courses={courses}
          resources={INITIAL_RESOURCES}
          currentLanguage={currentLanguage}
          onClose={() => setShowGlobalSearch(false)}
          onSelectBook={(b) => setActiveReaderBook(b)}
          onSelectCourse={(c) => {
            setActiveTab('elearning');
          }}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onOpenQuotation={(pages, category) => handleOpenQuotation(pages || 25, category || 'ppt')}
          onOpenDiagnostic={() => setShowDiagnosticModal(true)}
          onOpenGlossary={() => setShowGlossaryModal(true)}
          onOpenCitation={(b) => {
            setCitationTargetBook(b || books[0] || null);
            setShowCitationModal(true);
          }}
          onOpenThesisSlideStudio={() => setShowThesisSlideModal(true)}
          onOpenPeerReview={() => setShowPeerReviewModal(true)}
          onOpenCoverStudio={(b) => {
            setStudioTargetBook(b || books[0] || null);
            setShowCoverStudioModal(true);
          }}
          onOpenCIP={(b) => {
            setStudioTargetBook(b || books[0] || null);
            setShowCIPModal(true);
          }}
          onOpenProofreader={() => setShowProofreaderModal(true)}
          onOpenPosterStudio={() => {
            setStudioTargetBook(books[0] || null);
            setShowPosterStudioModal(true);
          }}
          onOpenPlagiarism={() => {
            setStudioTargetBook(books[0] || null);
            setShowPlagiarismModal(true);
          }}
          onOpenGrantStudio={() => setShowGrantStudioModal(true)}
          onOpenDOI={() => {
            setStudioTargetBook(books[0] || null);
            setShowDOIModal(true);
          }}
          onOpenJournalWorkflow={() => setShowJournalWorkflowModal(true)}
          onOpenVerify={() => setShowVerifyModal(true)}
          onRequestService={() => handleOpenRequestModal('ppt', 25)}
          onToggleDarkMode={() =>
            setTheme((prev) => (prev === 'light' ? 'dark' : prev === 'dark' ? 'netflix' : 'light'))
          }
        />
      )}

      {/* Certificate Verification Modal */}
      {showVerifyModal && (
        <CertificateVerificationModal
          onClose={() => setShowVerifyModal(false)}
        />
      )}

      {/* Academic Citation Studio Modal */}
      {showCitationModal && (
        <CitationExportModal
          books={books}
          courses={courses}
          initialBook={citationTargetBook}
          onClose={() => setShowCitationModal(false)}
        />
      )}

      {/* Thesis Defense Slide & LaTeX Beamer Studio Modal */}
      {showThesisSlideModal && (
        <ThesisSlideStudioModal
          onClose={() => setShowThesisSlideModal(false)}
          onRequestDesignService={() => handleOpenRequestModal('ppt', 25)}
        />
      )}

      {/* Manuscript Peer-Review & Editorial Appraisal Matrix Modal */}
      {showPeerReviewModal && (
        <PeerReviewModal
          onClose={() => setShowPeerReviewModal(false)}
          onRequestRemediation={(notes) => {
            handleOpenRequestModal('editing', 30);
            showToast('Peer-review appraisal notes transferred to editorial queue.');
          }}
        />
      )}

      {/* Pro-Forma Academic Quotation Generator Modal */}
      {showQuotationModal && (
        <QuotationGeneratorModal
          initialCategory={quotationCategory}
          initialPages={quotationPages}
          onClose={() => setShowQuotationModal(false)}
          onSubmitQuotation={(quotation) => {
            const newReq: ServiceRequest = {
              id: `REQ-${Date.now().toString().slice(-4)}`,
              clientName: quotation.clientName,
              affiliation: quotation.clientInstitution,
              phone: quotation.clientPhone,
              email: quotation.clientEmail,
              serviceCategory: quotation.serviceCategory,
              targetLanguage: currentLanguage,
              projectTitle: quotation.projectTitle,
              description: `Official Pro-Forma Quotation #${quotation.quotationNumber} generated and submitted. Includes ${quotation.lineItems.length} line items. Total: ${quotation.totalCostETB.toLocaleString()} ETB. Timeline: ${quotation.deliveryDays} business days.`,
              estimatedPages: quotation.pages,
              expectedDeadline: new Date(Date.now() + quotation.deliveryDays * 86400000).toISOString().split('T')[0],
              status: 'Submitted',
              createdAt: new Date().toISOString().split('T')[0],
              adminNotes: `Pro-Forma Quotation: #${quotation.quotationNumber}. Base Rate: ${quotation.baseRate} ETB/page. Discount: ${quotation.discountPercent}%. Total: ${quotation.totalCostETB} ETB.`,
            };
            handleRequestCreated(newReq);
            setShowQuotationModal(false);
          }}
        />
      )}

      {/* Manuscript Diagnostic Pre-Flight Modal */}
      {showDiagnosticModal && (
        <ManuscriptDiagnosticModal
          onClose={() => setShowDiagnosticModal(false)}
          onSubmitForEditing={(text, estimatedPages, category) => {
            handleOpenRequestModal(category, estimatedPages);
            showToast(`Diagnostic transferred: ${estimatedPages} estimated pages ready for submission.`);
          }}
        />
      )}

      {/* 4-Way Academic Glossary Matrix Modal */}
      {showGlossaryModal && (
        <AcademicGlossaryModal
          onClose={() => setShowGlossaryModal(false)}
          onRequestPublishing={() => handleOpenRequestModal('ppt', 25)}
        />
      )}

      {/* Monograph Jacket & Spine Caliper Studio Modal */}
      {showCoverStudioModal && (
        <BookCoverStudioModal
          initialBook={studioTargetBook || books[0]}
          onClose={() => setShowCoverStudioModal(false)}
          onOpenCIP={(b) => {
            setStudioTargetBook(b);
            setShowCoverStudioModal(false);
            setShowCIPModal(true);
          }}
          onRequestPrintBinding={(specSummary) => {
            handleOpenRequestModal('formatting', Math.ceil(parseInt(specSummary.match(/\d+ pages/)?.[0] || '180', 10)));
            showToast('Spine & cover specifications transferred to pre-press production order.');
          }}
        />
      )}

      {/* Cataloging-in-Publication (CIP) & ISBN Barcode Studio Modal */}
      {showCIPModal && (
        <CIPGeneratorModal
          initialBook={studioTargetBook || books[0]}
          onClose={() => setShowCIPModal(false)}
          onOpenCoverStudio={(b) => {
            setStudioTargetBook(b);
            setShowCIPModal(false);
            setShowCoverStudioModal(true);
          }}
        />
      )}

      {/* Multilingual Academic Proofreader & Linter Modal */}
      {showProofreaderModal && (
        <AcademicProofreaderModal
          onClose={() => setShowProofreaderModal(false)}
          onRequestHumanEditorial={(text, lang) => {
            const wordCount = text.trim() ? text.trim().split(/\s+/).length : 250;
            const estPages = Math.max(1, Math.ceil(wordCount / 250));
            handleOpenRequestModal(lang === 'or' ? 'translation' : 'editing', estPages);
            showToast(`Proofreader sample (${estPages} pages) transferred to human editorial request.`);
          }}
        />
      )}

      {/* Academic Symposia & Conference Poster Studio Modal */}
      {showPosterStudioModal && (
        <AcademicPosterStudioModal
          initialBook={studioTargetBook || books[0]}
          onClose={() => setShowPosterStudioModal(false)}
          onRequestPrinting={(specs) => {
            handleOpenRequestModal('ppt', 1);
            showToast(`Symposium poster specifications transferred to production queue: ${specs.slice(0, 45)}...`);
          }}
        />
      )}

      {/* Academic Plagiarism & Originality Index Estimator Modal */}
      {showPlagiarismModal && (
        <PlagiarismScannerModal
          initialBook={studioTargetBook || books[0]}
          onClose={() => setShowPlagiarismModal(false)}
          onRequestAssistance={(text) => {
            const wordCount = text.trim() ? text.trim().split(/\s+/).length : 250;
            const estPages = Math.max(1, Math.ceil(wordCount / 250));
            handleOpenRequestModal('editing', estPages);
            showToast(`Plagiarism flag segment transferred to WKI Editorial rewriting desk.`);
          }}
        />
      )}

      {/* Research Grant Proposal & Budget Studio Modal */}
      {showGrantStudioModal && (
        <ResearchGrantStudioModal
          onClose={() => setShowGrantStudioModal(false)}
          onRequestFormatting={(proposalSummary) => {
            handleOpenRequestModal('formatting', 15);
            showToast(`Research grant dossier (${proposalSummary.slice(0, 40)}...) transferred for official typesetting.`);
          }}
        />
      )}

      {/* Digital Object Identifier (DOI) & CrossRef Schema Studio Modal */}
      {showDOIModal && (
        <DOIStudioModal
          initialBook={studioTargetBook || books[0]}
          onClose={() => setShowDOIModal(false)}
          onAssignToBook={(doi) => {
            if (studioTargetBook) {
              setBooks((prev) =>
                prev.map((b) => (b.id === studioTargetBook.id ? { ...b, doi } : b))
              );
            }
            showToast(`DOI ${doi} officially registered and linked to catalog.`);
          }}
        />
      )}

      {/* Institutional Journal Editorial Workflow Modal */}
      {showJournalWorkflowModal && (
        <JournalWorkflowModal
          onClose={() => setShowJournalWorkflowModal(false)}
          onRequestTypesetting={(manuscriptTitle) => {
            handleOpenRequestModal('formatting', 18);
            showToast(`Manuscript "${manuscriptTitle.slice(0, 35)}..." sent to WKI typesetting queue.`);
          }}
        />
      )}

      {/* Offline Status PWA Indicator */}
      <OfflineIndicator />
    </div>
  );
}
