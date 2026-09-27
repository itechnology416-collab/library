import React, { useState, useEffect } from 'react';
import {
  MarketplaceCategory,
  MarketplaceProject,
  MarketplaceRequest,
} from '../../types/marketplace';
import { INITIAL_MARKETPLACE_PROJECTS, INITIAL_MARKETPLACE_REQUESTS } from '../../data/marketplaceData';
import { syncProjectToFirebase, syncRequestToFirebase } from '../../services/firebaseSync';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ProjectRequestModal } from './ProjectRequestModal';
import { SubmitProjectWizard } from './SubmitProjectWizard';
import { CreatorDashboard } from './CreatorDashboard';
import { AdminMarketplaceDesk } from './AdminMarketplaceDesk';
import { ProjectComparisonModal } from './ProjectComparisonModal';
import { BundlesShowcaseModal } from './BundlesShowcaseModal';
import { useAuth } from '../../context/AuthContext';

interface ProjectsMarketplacePageProps {
  onOpenRequestService?: () => void;
  initialTab?: string;
}

export const ProjectsMarketplacePage: React.FC<ProjectsMarketplacePageProps> = ({ initialTab }) => {
  const { user } = useAuth();

  // State
  const [projects, setProjects] = useState<MarketplaceProject[]>(INITIAL_MARKETPLACE_PROJECTS);
  const [requests, setRequests] = useState<MarketplaceRequest[]>(INITIAL_MARKETPLACE_REQUESTS);
  const [activeView, setActiveView] = useState<'browse' | 'featured' | 'creator' | 'admin' | 'saved'>(
    initialTab === 'my_projects' ? 'creator' : 'browse'
  );

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTechnology, setSelectedTechnology] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('All');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>('All');

  // Modals & Selection
  const [selectedProject, setSelectedProject] = useState<MarketplaceProject | null>(null);
  const [requestTargetProject, setRequestTargetProject] = useState<MarketplaceProject | null>(null);
  const [requestInitialAction, setRequestInitialAction] = useState<string>('Buy/License');
  const [showSubmitWizard, setShowSubmitWizard] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showBundlesModal, setShowBundlesModal] = useState(false);

  // Favorites & Wishlist
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wirtuu_marketplace_favorites');
      return saved ? JSON.parse(saved) : ['proj-001'];
    } catch {
      return ['proj-001'];
    }
  });

  // Comparison Selected Projects
  const [comparedProjects, setComparedProjects] = useState<MarketplaceProject[]>([]);

  // Sync favorites with localStorage
  useEffect(() => {
    localStorage.setItem('wirtuu_marketplace_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // Load backend project data and customer requests on mount
  useEffect(() => {
    fetch('/api/marketplace/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch((err) => console.warn('Marketplace projects fetch fallback:', err));

    fetch('/api/marketplace/requests')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.requests) && data.requests.length > 0) {
          setRequests(data.requests);
        }
      })
      .catch((err) => console.warn('Marketplace requests fetch fallback:', err));
  }, []);

  // Handlers
  const toggleFavorite = (projectId: string) => {
    if (favoriteIds.includes(projectId)) {
      setFavoriteIds(favoriteIds.filter((id) => id !== projectId));
    } else {
      setFavoriteIds([...favoriteIds, projectId]);
    }
  };

  const toggleCompare = (project: MarketplaceProject) => {
    if (comparedProjects.some((p) => p.id === project.id)) {
      setComparedProjects(comparedProjects.filter((p) => p.id !== project.id));
    } else {
      if (comparedProjects.length >= 4) {
        alert('You can compare a maximum of 4 projects simultaneously.');
        return;
      }
      setComparedProjects([...comparedProjects, project]);
    }
  };

  const handleOpenRequestAction = (project: MarketplaceProject, actionType: string = 'Buy/License') => {
    setRequestTargetProject(project);
    setRequestInitialAction(actionType);
  };

  const handleProjectSubmitted = async (newProj: MarketplaceProject) => {
    setProjects([newProj, ...projects]);
    setActiveView('creator');
    await syncProjectToFirebase(newProj);
  };

  const handleRequestCreated = async (newReq: MarketplaceRequest) => {
    setRequests([newReq, ...requests]);
    await syncRequestToFirebase(newReq);
  };

  // Moderation handlers for Admin
  const handleApproveProject = async (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, reviewStatus: 'Approved' } : p))
    );
    try {
      await fetch(`/api/marketplace/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' }),
      });
      const updated = projects.find((p) => p.id === projectId);
      if (updated) {
        syncProjectToFirebase({ ...updated, reviewStatus: 'Approved' });
      }
    } catch (e) {
      console.warn('Status patch fallback:', e);
    }
  };

  const handleRejectProject = async (projectId: string, reason?: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, reviewStatus: 'Rejected', reviewNotes: reason } : p))
    );
    try {
      await fetch(`/api/marketplace/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected', reviewNotes: reason }),
      });
      const updated = projects.find((p) => p.id === projectId);
      if (updated) {
        syncProjectToFirebase({ ...updated, reviewStatus: 'Rejected', reviewNotes: reason });
      }
    } catch (e) {
      console.warn('Status patch fallback:', e);
    }
  };

  const handleToggleFeatured = async (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, isFeatured: !p.isFeatured } : p))
    );
    try {
      await fetch(`/api/marketplace/projects/${projectId}/featured`, {
        method: 'PATCH',
      });
    } catch (e) {
      console.warn('Featured patch fallback:', e);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    try {
      await fetch(`/api/marketplace/projects/${projectId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Delete project fallback:', e);
    }
  };

  const handleReplyMessage = async (requestId: string, messageText: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: user?.name || 'Creator / Representative',
      senderRole: 'creator' as const,
      message: messageText,
      timestamp: new Date().toISOString(),
    };

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, messages: [...(r.messages || []), newMessage] }
          : r
      )
    );

    try {
      await fetch(`/api/marketplace/requests/${requestId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sender: user?.name || 'Creator',
          senderRole: 'creator',
        }),
      });
    } catch (e) {
      console.warn('Reply message fallback:', e);
    }
  };

  const handleUpdateRequestStatus = async (requestId: string, status: any) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
    try {
      await fetch(`/api/marketplace/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.warn('Status update fallback:', e);
    }
  };

  // Filtered List Computation
  const filteredProjects = projects.filter((p) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.shortDescription.toLowerCase().includes(q);
      const matchTech = p.technologies.some((t) => t.toLowerCase().includes(q));
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTech && !matchCat) return false;
    }

    // View specific
    if (activeView === 'featured' && !p.isFeatured) return false;
    if (activeView === 'saved' && !favoriteIds.includes(p.id)) return false;

    // Filters
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedTechnology !== 'All' && !p.technologies.includes(selectedTechnology as any)) return false;
    if (selectedPlatform !== 'All' && p.platform !== selectedPlatform) return false;
    if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
    if (selectedBusinessType !== 'All' && p.businessType !== selectedBusinessType) return false;
    if (selectedPriceFilter !== 'All') {
      if (selectedPriceFilter === 'Free' && p.pricingType !== 'Free') return false;
      if (selectedPriceFilter === 'Paid' && p.pricingType !== 'Paid') return false;
    }

    return true;
  });

  return (
    <div className="w-full min-h-screen bg-surface-container-low/40 pb-20 pt-4 px-3 sm:px-6 lg:px-10 space-y-8">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION & MARKETPLACE INTRO                                      */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a1128] to-slate-950 text-white p-6 sm:p-10 md:p-14 overflow-hidden border border-slate-800 shadow-2xl">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/30 uppercase tracking-widest">
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span>Wirtuu Kompiitaraa Ilillii Digital Marketplace</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            Discover Digital Projects Built for Real Businesses
          </h1>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Explore ready-to-use websites, applications, software systems, templates, and digital products created by developers and designers. Find a project, request customization, or submit your own work to the marketplace.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('browse')}
              className="px-6 py-3 rounded-2xl bg-secondary text-on-secondary font-bold text-xs sm:text-sm flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              <span>Explore Projects</span>
            </button>

            <button
              onClick={() => setShowSubmitWizard(true)}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              <span>Submit Your Project</span>
            </button>
          </div>
        </div>

        {/* Commercial Hero Device Showcase */}
        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="material-symbols-outlined text-amber-400 text-[24px]">desktop_windows</span>
            <div>
              <div className="font-bold text-white">Web Applications</div>
              <div className="text-[10px] text-slate-400">ERPs, Dashboards, SaaS</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="material-symbols-outlined text-amber-400 text-[24px]">smartphone</span>
            <div>
              <div className="font-bold text-white">Mobile Apps</div>
              <div className="text-[10px] text-slate-400">Android, iOS, Flutter</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="material-symbols-outlined text-amber-400 text-[24px]">palette</span>
            <div>
              <div className="font-bold text-white">UI/UX Kits</div>
              <div className="text-[10px] text-slate-400">Design Systems, Figma</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="material-symbols-outlined text-amber-400 text-[24px]">code</span>
            <div>
              <div className="font-bold text-white">Software Systems</div>
              <div className="text-[10px] text-slate-400">Python, .NET, Java</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. NAVIGATION BAR & SUB-VIEW SWITCHER                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'browse', label: 'Browse Projects', icon: 'apps' },
            { id: 'featured', label: 'Featured Projects', icon: 'star' },
            { id: 'saved', label: `Saved Wishlist (${favoriteIds.length})`, icon: 'favorite' },
            { id: 'creator', label: 'My Projects', icon: 'assignment' },
            ...(user?.role === 'admin' || user?.role === 'superadmin' || user?.isPrimarySuperAdmin
              ? [{ id: 'admin', label: 'Admin Governance', icon: 'shield' }]
              : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeView === tab.id
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Primary Action & Comparison Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBundlesModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-500 hover:text-white transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">inventory_2</span>
            <span>Campus Bundles (-25%)</span>
          </button>

          {comparedProjects.length > 0 && (
            <button
              onClick={() => setShowComparisonModal(true)}
              className="px-3 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer animate-pulse"
            >
              <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
              <span>Compare ({comparedProjects.length})</span>
            </button>
          )}

          <button
            onClick={() => setShowSubmitWizard(true)}
            className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 hover:brightness-105 transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Submit Your Project</span>
          </button>
        </div>
      </div>

      {/* Render Creator or Admin Dashboard views if selected */}
      {activeView === 'creator' && (
        <CreatorDashboard
          userProjects={projects.filter((p) => p.creatorEmail === user?.email || p.creatorName === user?.name)}
          userRequests={requests}
          onOpenSubmitModal={() => setShowSubmitWizard(true)}
          onViewProjectDetails={(p) => setSelectedProject(p)}
          onDeleteProject={handleDeleteProject}
          onReplyMessage={handleReplyMessage}
          onUpdateRequestStatus={handleUpdateRequestStatus}
        />
      )}

      {activeView === 'admin' && (
        <AdminMarketplaceDesk
          projects={projects}
          requests={requests}
          onApproveProject={handleApproveProject}
          onRejectProject={handleRejectProject}
          onToggleFeatured={handleToggleFeatured}
          onViewProject={(p) => setSelectedProject(p)}
        />
      )}

      {/* Main Browse Catalog View */}
      {(activeView === 'browse' || activeView === 'featured' || activeView === 'saved') && (
        <div className="space-y-6">
          {/* Prominent Search Bar */}
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[22px] text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, applications, websites, technologies..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-medium text-sm shadow-sm focus:border-secondary transition-all outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Multi-Faceted Filters Row */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-3 text-xs">
            <div className="font-bold text-on-surface flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
                <span>Marketplace Filters</span>
              </span>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedTechnology('All');
                  setSelectedPlatform('All');
                  setSelectedStatus('All');
                  setSelectedBusinessType('All');
                  setSelectedPriceFilter('All');
                  setSearchQuery('');
                }}
                className="text-secondary font-bold hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {/* Category */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface font-medium"
                >
                  <option value="All">All Categories</option>
                  {[
                    'Website',
                    'Web Application',
                    'Mobile Application',
                    'Desktop Application',
                    'UI/UX',
                    'SaaS',
                    'E-commerce',
                    'School Management',
                    'Business Management',
                    'Healthcare',
                    'Education',
                    'Software System',
                  ].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Technology */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">
                  Technology
                </label>
                <select
                  value={selectedTechnology}
                  onChange={(e) => setSelectedTechnology(e.target.value)}
                  className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface font-medium"
                >
                  <option value="All">All Tech Stacks</option>
                  {['React', 'Next.js', 'Node.js', 'Python', 'Django', 'Flutter', 'Kotlin', 'Java', 'PHP', 'Laravel', 'C#', 'Tailwind CSS'].map(
                    (tech) => (
                      <option key={tech} value={tech}>
                        {tech}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">
                  Platform
                </label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface font-medium"
                >
                  <option value="All">All Platforms</option>
                  {['Web', 'Android', 'iOS', 'Windows', 'Linux', 'Cross-platform'].map((plat) => (
                    <option key={plat} value={plat}>
                      {plat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Status */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface font-medium"
                >
                  <option value="All">All Statuses</option>
                  {['Ready to Use', 'Customizable', 'Under Development', 'Demo', 'Open Source'].map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">
                  Business Type
                </label>
                <select
                  value={selectedBusinessType}
                  onChange={(e) => setSelectedBusinessType(e.target.value)}
                  className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface font-medium"
                >
                  <option value="All">All Business Types</option>
                  {['Startup', 'Small Business', 'School', 'University', 'NGO', 'Organization', 'Enterprise'].map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">
                  Pricing Filter
                </label>
                <select
                  value={selectedPriceFilter}
                  onChange={(e) => setSelectedPriceFilter(e.target.value)}
                  className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface font-medium"
                >
                  <option value="All">All Price Types</option>
                  <option value="Free">Free Open Access</option>
                  <option value="Paid">Commercial Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span>
                  {activeView === 'featured'
                    ? 'Featured Commercial Projects'
                    : activeView === 'saved'
                    ? 'Saved Wishlist Projects'
                    : 'Available Projects Marketplace'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-mono font-bold">
                  {filteredProjects.length}
                </span>
              </h3>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant opacity-40">
                  search_off
                </span>
                <h4 className="text-lg font-bold text-on-surface">No matching projects found</h4>
                <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                  Try adjusting your search query or reset marketplace category and tech stack filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedTechnology('All');
                    setSelectedPlatform('All');
                    setSelectedStatus('All');
                    setSelectedBusinessType('All');
                    setSelectedPriceFilter('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewDetails={(p) => setSelectedProject(p)}
                    onRequestAction={(p) => handleOpenRequestAction(p, 'Buy/License')}
                    isFavorite={favoriteIds.includes(project.id)}
                    onToggleFavorite={toggleFavorite}
                    isCompared={comparedProjects.some((cp) => cp.id === project.id)}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODALS & SUB-COMPONENTS                                               */}
      {/* ========================================================================= */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onRequestAction={(p, act) => {
            setSelectedProject(null);
            handleOpenRequestAction(p, act || 'Buy/License');
          }}
          isFavorite={favoriteIds.includes(selectedProject.id)}
          onToggleFavorite={toggleFavorite}
          isCompared={comparedProjects.some((cp) => cp.id === selectedProject.id)}
          onToggleCompare={toggleCompare}
        />
      )}

      {requestTargetProject && (
        <ProjectRequestModal
          project={requestTargetProject}
          initialAction={requestInitialAction}
          onClose={() => setRequestTargetProject(null)}
          onSubmitRequest={handleRequestCreated}
        />
      )}

      {showSubmitWizard && (
        <SubmitProjectWizard
          onClose={() => setShowSubmitWizard(false)}
          onProjectSubmitted={handleProjectSubmitted}
        />
      )}

      {showComparisonModal && (
        <ProjectComparisonModal
          comparedProjects={comparedProjects}
          onClose={() => setShowComparisonModal(false)}
          onRemoveProject={(id) => setComparedProjects(comparedProjects.filter((p) => p.id !== id))}
          onRequestProject={(p) => handleOpenRequestAction(p, 'Buy/License')}
        />
      )}

      {showBundlesModal && (
        <BundlesShowcaseModal
          onClose={() => setShowBundlesModal(false)}
          onSelectBundle={(bundle) => {
            setShowBundlesModal(false);
            const targetProj = projects.find((p) => bundle.projectIds.includes(p.id)) || projects[0];
            if (targetProj) {
              handleOpenRequestAction(targetProj, 'Buy/License');
            }
          }}
        />
      )}
    </div>
  );
};
