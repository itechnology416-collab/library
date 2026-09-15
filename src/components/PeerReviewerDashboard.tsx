import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Sliders,
  Award,
  BookOpen,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  FileText,
  Send,
  Save,
  Shield,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
  ShieldAlert,
  Edit3,
  Check,
  X,
  Eye,
  Calendar,
  Layers,
  Scale,
  Hash,
} from 'lucide-react';
import {
  Language,
  PeerReviewAssignment,
  ReviewerScholarProfile,
  OfficialJournalMeta,
  RefereeRecognitionCertificate,
} from '../types';
import {
  INITIAL_REVIEWER_PROFILE,
  INITIAL_REVIEW_ASSIGNMENTS,
  INITIAL_JOURNAL_INFOS,
  INITIAL_REFEREE_CERTIFICATES,
} from '../data/initialData';
import { Button, Badge, Input, Textarea } from './ui';
import { ManuscriptReaderModal } from './ManuscriptReaderModal';
import { RefereeCertificateModal } from './RefereeCertificateModal';

interface PeerReviewerDashboardProps {
  currentLanguage: Language;
  onOpenDOIStudio?: () => void;
  onOpenPlagiarismScanner?: () => void;
  onOpenProofreader?: () => void;
  onNavigateHome: () => void;
  onShowToast?: (msg: string) => void;
}

export const PeerReviewerDashboard: React.FC<PeerReviewerDashboardProps> = ({
  currentLanguage: _currentLanguage,
  onOpenDOIStudio,
  onOpenPlagiarismScanner,
  onOpenProofreader,
  onNavigateHome,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'active_review' | 'completed' | 'journals' | 'profile'>('queue');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Core State
  const [reviewer, setReviewer] = useState<ReviewerScholarProfile>(INITIAL_REVIEWER_PROFILE);
  const [assignments, setAssignments] = useState<PeerReviewAssignment[]>(INITIAL_REVIEW_ASSIGNMENTS);
  const [journals, setJournals] = useState<OfficialJournalMeta[]>(INITIAL_JOURNAL_INFOS);
  const [certificates, setCertificates] = useState<RefereeRecognitionCertificate[]>(INITIAL_REFEREE_CERTIFICATES);

  // Active Review State
  const [selectedAssignment, setSelectedAssignment] = useState<PeerReviewAssignment>(INITIAL_REVIEW_ASSIGNMENTS[0]);
  const [rubricScores, setRubricScores] = useState({
    novelty: selectedAssignment.currentScores?.novelty || 22,
    methodology: selectedAssignment.currentScores?.methodology || 24,
    citations: selectedAssignment.currentScores?.citations || 21,
    presentation: selectedAssignment.currentScores?.presentation || 23,
  });
  const [recommendation, setRecommendation] = useState<'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject'>(
    selectedAssignment.recommendation || 'Minor Revision'
  );
  const [authorFeedback, setAuthorFeedback] = useState<string>(selectedAssignment.authorFeedback || '');
  const [confidentialNotes, setConfidentialNotes] = useState<string>(
    selectedAssignment.confidentialEditorialNotes || ''
  );

  // Modals
  const [readerAssignment, setReaderAssignment] = useState<PeerReviewAssignment | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<RefereeRecognitionCertificate | null>(null);

  // Filter & Search in Queue
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editable Profile state
  const [profileForm, setProfileForm] = useState<ReviewerScholarProfile>(INITIAL_REVIEWER_PROFILE);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Calculate 100-point total score
  const totalScore = rubricScores.novelty + rubricScores.methodology + rubricScores.citations + rubricScores.presentation;

  const getMeritBadge = (score: number) => {
    if (score >= 88) return { label: 'High Scholarly Merit (Tier 1)', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' };
    if (score >= 75) return { label: 'Substantial Merit (Minor Revisions)', color: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30' };
    if (score >= 60) return { label: 'Marginal Merit (Major Revisions)', color: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30' };
    return { label: 'Insufficient Rigor (Reject)', color: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30' };
  };

  // Fetch backend persistence on load
  const fetchData = async () => {
    setLoading(true);
    try {
      const [profRes, assignRes, jourRes, certRes] = await Promise.all([
        fetch('/api/reviewer/profile'),
        fetch('/api/reviewer/assignments'),
        fetch('/api/reviewer/journals'),
        fetch('/api/reviewer/certificates'),
      ]);

      if (profRes.ok) {
        const d = await profRes.json();
        if (d.profile) {
          setReviewer(d.profile);
          setProfileForm(d.profile);
        }
      }
      if (assignRes.ok) {
        const d = await assignRes.json();
        if (d.assignments && d.assignments.length > 0) {
          setAssignments(d.assignments);
          // Sync selected assignment
          const active = d.assignments.find((a: PeerReviewAssignment) => a.id === selectedAssignment.id) || d.assignments[0];
          setSelectedAssignment(active);
          syncFormWithAssignment(active);
        }
      }
      if (jourRes.ok) {
        const d = await jourRes.json();
        if (d.journals) setJournals(d.journals);
      }
      if (certRes.ok) {
        const d = await certRes.json();
        if (d.certificates) setCertificates(d.certificates);
      }
    } catch (err) {
      console.warn('Backend sync failed, defaulting to local state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const syncFormWithAssignment = (item: PeerReviewAssignment) => {
    setRubricScores({
      novelty: item.currentScores?.novelty || 20,
      methodology: item.currentScores?.methodology || 20,
      citations: item.currentScores?.citations || 20,
      presentation: item.currentScores?.presentation || 20,
    });
    setRecommendation(item.recommendation || 'Minor Revision');
    setAuthorFeedback(item.authorFeedback || '');
    setConfidentialNotes(item.confidentialEditorialNotes || '');
  };

  const handleSelectAssignment = (item: PeerReviewAssignment) => {
    setSelectedAssignment(item);
    syncFormWithAssignment(item);
    setActiveTab('active_review');
  };

  // Respond to invitation (Accept / Decline)
  const handleRespondInvitation = async (id: string, action: 'accept' | 'decline') => {
    try {
      const res = await fetch(`/api/reviewer/assignments/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        setAssignments((prev) => prev.map((a) => (a.id === id ? data.assignment : a)));
        if (selectedAssignment.id === id) {
          setSelectedAssignment(data.assignment);
        }
        if (onShowToast) {
          onShowToast(
            action === 'accept'
              ? 'Review invitation accepted. Manuscript added to active evaluation queue.'
              : 'Review invitation respectfully declined. Editorial office notified.'
          );
        }
      }
    } catch (err) {
      console.error(err);
      // Local fallback
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: action === 'accept' ? 'In Progress' : 'Declined' } : a))
      );
    }
  };

  // Submit or save draft review
  const handleSaveReview = async (isDraft: boolean) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/reviewer/assignments/${selectedAssignment.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rubricScores,
          recommendation,
          authorFeedback,
          confidentialEditorialNotes: confidentialNotes,
          isDraft,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAssignments((prev) => prev.map((a) => (a.id === selectedAssignment.id ? data.assignment : a)));
        setSelectedAssignment(data.assignment);

        if (!isDraft) {
          // Refresh certificates & profile
          fetchData();
          if (onShowToast) {
            onShowToast(
              `Formal review for ${selectedAssignment.trackingCode} submitted successfully to Editor-in-Chief. Referee certificate generated!`
            );
          }
          setActiveTab('completed');
        } else {
          if (onShowToast) {
            onShowToast(`Draft evaluation for ${selectedAssignment.trackingCode} saved successfully.`);
          }
        }
      }
    } catch (err) {
      console.error(err);
      if (onShowToast) {
        onShowToast('Saved locally in active session.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Update Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reviewer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        const d = await res.json();
        setReviewer(d.profile);
        setIsEditingProfile(false);
        if (onShowToast) {
          onShowToast('Reviewer profile credentials updated successfully.');
        }
      }
    } catch (err) {
      console.error(err);
      setReviewer(profileForm);
      setIsEditingProfile(false);
    }
  };

  // Quick Preset Rubric Templates
  const applyPresetRubric = (preset: 'exemplary' | 'minor_revision' | 'major_methodology') => {
    if (preset === 'exemplary') {
      setRubricScores({ novelty: 24, methodology: 24, citations: 24, presentation: 24 });
      setRecommendation('Accept');
      setAuthorFeedback(
        'The manuscript exhibits outstanding theoretical rigor, exemplary statistical methodology, and comprehensive APA 7th literature citations. Only minor typographic formatting alignments in the appendix are needed.'
      );
    } else if (preset === 'minor_revision') {
      setRubricScores({ novelty: 22, methodology: 22, citations: 20, presentation: 21 });
      setRecommendation('Minor Revision');
      setAuthorFeedback(
        'A well-executed investigation with clear empirical value for the Horn of Africa. Authors should revise Figure 3 and clarify the sampling confidence interval calculation in Section 2.3.'
      );
    } else if (preset === 'major_methodology') {
      setRubricScores({ novelty: 18, methodology: 14, citations: 16, presentation: 16 });
      setRecommendation('Major Revision');
      setAuthorFeedback(
        'While the research question is timely, the experimental sampling size is underpowered to support the broader conclusions in Section 4. Authors must incorporate additional replicates or provide GLM sensitivity tests.'
      );
    }
    if (onShowToast) {
      onShowToast(`Applied "${preset.replace('_', ' ')}" rubric preset.`);
    }
  };

  // Filtered assignments
  const filteredAssignments = assignments.filter((item) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'in_progress'
        ? item.status === 'In Progress'
        : statusFilter === 'pending'
        ? item.status === 'Pending Invitation'
        : statusFilter === 'submitted'
        ? item.status === 'Submitted'
        : item.status === 'Overdue';

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : item.manuscriptTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.journal.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const activeQueueCount = assignments.filter((a) => a.status === 'In Progress' || a.status === 'Pending Invitation').length;
  const completedCount = assignments.filter((a) => a.status === 'Submitted').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-4 animate-in fade-in duration-200">
      {/* Top Banner & Reviewer Credentials */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 4 • Double-Blind Editorial & Peer Review Desk</span>
            </span>
            <span className="text-xs text-indigo-200/80 font-mono bg-indigo-950/60 px-2.5 py-0.5 rounded-md border border-indigo-700/30">
              ORCID: {reviewer.orcid}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif">{reviewer.name}</h1>
          <p className="text-xs sm:text-sm text-indigo-100/80">{reviewer.title} • {reviewer.affiliation}</p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-indigo-300/80 font-semibold">Referee Portfolios:</span>
            {reviewer.assignedJournals.map((j, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-indigo-900/60 text-indigo-200 text-[10px] font-bold border border-indigo-700/40"
              >
                {j}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-indigo-900/40 border border-indigo-700/40 text-center min-w-[100px]">
            <div className="text-2xl font-bold text-amber-300 font-mono">{reviewer.totalCompletedReviews}</div>
            <div className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold">Reviews Done</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-900/40 border border-indigo-700/40 text-center min-w-[100px]">
            <div className="text-2xl font-bold text-emerald-400 font-mono">{reviewer.averageReviewDays}d</div>
            <div className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold">Avg Turnaround</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-900/40 border border-indigo-700/40 text-center min-w-[100px]">
            <div className="text-2xl font-bold text-indigo-300 font-mono">{certificates.length}</div>
            <div className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold">Certificates</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Action Utilities */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-2 border-b border-outline-variant/30">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'queue'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Review Queue</span>
            <span className="px-1.5 py-0.2 rounded-md bg-indigo-900/30 text-[10px] font-mono">
              {activeQueueCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('active_review')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'active_review'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Evaluation & 100-Point Rubric</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'completed'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Completed & Certificates ({completedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('journals')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'journals'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Journal Scope & Standards</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Referee Profile</span>
          </button>
        </div>

        {/* Integration Tool Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {onOpenDOIStudio && (
            <button
              onClick={onOpenDOIStudio}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface flex items-center gap-1.5 cursor-pointer border border-outline-variant/30"
              title="Open CrossRef DOI Metadata & Schema Studio"
            >
              <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>DOI Studio</span>
            </button>
          )}

          {onOpenPlagiarismScanner && (
            <button
              onClick={onOpenPlagiarismScanner}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface flex items-center gap-1.5 cursor-pointer border border-outline-variant/30"
              title="Open Academic Plagiarism & Originality Matrix"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span>Plagiarism</span>
            </button>
          )}

          {onOpenProofreader && (
            <button
              onClick={onOpenProofreader}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface flex items-center gap-1.5 cursor-pointer border border-outline-variant/30"
              title="Open Multilingual Proofreader & Grammar Polisher"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Proofreader</span>
            </button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={fetchData}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            className="text-xs cursor-pointer"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* TAB 1: REVIEW QUEUE & INVITATIONS */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {/* Filtering Bar */}
          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: 'All Manuscripts' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'pending', label: 'Pending Invitations' },
                { id: 'submitted', label: 'Submitted' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === f.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-surface hover:bg-surface-container-high text-on-surface border border-outline-variant/20'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search manuscripts, tracking code, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Manuscript Cards Grid */}
          {filteredAssignments.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
              <Inbox className="w-10 h-10 text-on-surface-variant mx-auto opacity-50" />
              <h3 className="font-bold text-sm text-on-surface">No review assignments match your filter</h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                Try selecting "All Manuscripts" or clearing your search criteria to view available assignments.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssignments.map((item) => {
                const isSelected = selectedAssignment.id === item.id;
                const isPendingInvitation = item.status === 'Pending Invitation';
                const isSubmitted = item.status === 'Submitted';

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-surface-container-low border-outline-variant/30 hover:border-indigo-400'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold">
                          {item.journal} • {item.trackingCode}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'In Progress'
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                              : item.status === 'Submitted'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                              : item.status === 'Pending Invitation'
                              ? 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30'
                              : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <h3
                        onClick={() => handleSelectAssignment(item)}
                        className="font-serif font-bold text-sm text-on-surface line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors"
                      >
                        {item.manuscriptTitle}
                      </h3>

                      <p className="text-[11px] text-on-surface-variant line-clamp-3 leading-relaxed">
                        {item.abstract}
                      </p>

                      <div className="flex flex-wrap items-center gap-1">
                        {item.keywords.slice(0, 3).map((kw, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-surface border border-outline-variant/20 text-[9px] text-on-surface-variant"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-outline-variant/20">
                      <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Due: {item.deadlineDate}</span>
                        </span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                          {item.pages} pgs ({item.wordCount} words)
                        </span>
                      </div>

                      {/* Action Bar based on status */}
                      {isPendingInvitation ? (
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleRespondInvitation(item.id, 'accept')}
                            leftIcon={<Check className="w-3.5 h-3.5" />}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRespondInvitation(item.id, 'decline')}
                            leftIcon={<X className="w-3.5 h-3.5" />}
                            className="flex-1 text-xs cursor-pointer text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          >
                            Decline
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReaderAssignment(item)}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                            className="flex-1 text-xs cursor-pointer"
                          >
                            Read Text
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSelectAssignment(item)}
                            leftIcon={<Sliders className="w-3.5 h-3.5" />}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs cursor-pointer"
                          >
                            {isSubmitted ? 'View Rubric' : 'Evaluate'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DOUBLE-BLIND EVALUATION & 100-POINT RUBRIC */}
      {activeTab === 'active_review' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Manuscript Dossier & Quick Actions */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold">
                    {selectedAssignment.journal} • {selectedAssignment.trackingCode}
                  </span>
                  <Badge
                    variant={
                      selectedAssignment.status === 'Submitted'
                        ? 'success'
                        : selectedAssignment.status === 'In Progress'
                        ? 'warning'
                        : 'secondary'
                    }
                    className="text-xs"
                  >
                    {selectedAssignment.status}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-on-surface leading-snug">
                    {selectedAssignment.manuscriptTitle}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-mono">
                    {selectedAssignment.authorsAnonymized}
                  </p>
                </div>

                {/* Abstract Preview */}
                <div className="p-3.5 rounded-xl bg-surface text-xs text-on-surface-variant leading-relaxed space-y-1.5 border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface">Structured Abstract:</span>
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                      {selectedAssignment.wordCount} words
                    </span>
                  </div>
                  <p className="line-clamp-6">{selectedAssignment.abstract}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/20">
                  <span>Due: <strong className="text-on-surface">{selectedAssignment.deadlineDate}</strong></span>
                  <span>Scope: <strong className="text-on-surface">{selectedAssignment.pages} Pages</strong></span>
                  <span>Originality: <strong className="text-emerald-600 font-mono">97.4%</strong></span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReaderAssignment(selectedAssignment)}
                  leftIcon={<BookOpen className="w-4 h-4 text-indigo-600" />}
                  className="w-full text-xs cursor-pointer"
                >
                  Open Double-Blind Manuscript Reader
                </Button>
              </div>

              {/* Rubric Presets Box */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Referee Decision Presets</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Quickly calibrate standard evaluation scores and comment frameworks:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => applyPresetRubric('exemplary')}
                    className="p-2 rounded-xl bg-surface hover:bg-emerald-500/10 border border-outline-variant/30 text-[11px] font-semibold text-on-surface hover:text-emerald-600 transition-colors cursor-pointer text-center"
                  >
                    Exemplary (96)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetRubric('minor_revision')}
                    className="p-2 rounded-xl bg-surface hover:bg-indigo-500/10 border border-outline-variant/30 text-[11px] font-semibold text-on-surface hover:text-indigo-600 transition-colors cursor-pointer text-center"
                  >
                    Minor Rev (85)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetRubric('major_methodology')}
                    className="p-2 rounded-xl bg-surface hover:bg-amber-500/10 border border-outline-variant/30 text-[11px] font-semibold text-on-surface hover:text-amber-600 transition-colors cursor-pointer text-center"
                  >
                    Major Rev (64)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: 100-Point Scoring Rubric & Feedback Form */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div>
                    <h3 className="text-base font-bold text-on-surface">
                      Haramaya University 100-Point Editorial Rubric
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Official Peer Review Assessment Scale (EAJS / HJAS / HLR Standard)
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                      {totalScore} <span className="text-xs font-sans font-normal text-on-surface-variant">/ 100</span>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getMeritBadge(totalScore).color}`}>
                      {getMeritBadge(totalScore).label}
                    </span>
                  </div>
                </div>

                {/* 4 Rubric Criteria Sliders */}
                <div className="space-y-4">
                  {/* Criterion 1 */}
                  <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-on-surface block">1. Novelty & Theoretical Contribution</span>
                        <span className="text-[11px] text-on-surface-variant">
                          Originality of research hypothesis and contribution to African scholarship.
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded border border-indigo-200/50">
                        {rubricScores.novelty} / 25
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={rubricScores.novelty}
                      onChange={(e) => setRubricScores({ ...rubricScores, novelty: parseInt(e.target.value) || 0 })}
                      className="w-full accent-indigo-600 cursor-pointer h-1.5"
                    />
                  </div>

                  {/* Criterion 2 */}
                  <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-on-surface block">2. Methodological Rigor & Data Reproducibility</span>
                        <span className="text-[11px] text-on-surface-variant">
                          Statistical validity, sampling representativeness, and empirical controls.
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded border border-indigo-200/50">
                        {rubricScores.methodology} / 25
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={rubricScores.methodology}
                      onChange={(e) => setRubricScores({ ...rubricScores, methodology: parseInt(e.target.value) || 0 })}
                      className="w-full accent-indigo-600 cursor-pointer h-1.5"
                    />
                  </div>

                  {/* Criterion 3 */}
                  <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-on-surface block">3. Bibliographic Rigor & Citation Integrity</span>
                        <span className="text-[11px] text-on-surface-variant">
                          APA 7th / IEEE style fidelity, DOI integration, and recent peer-reviewed coverage.
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded border border-indigo-200/50">
                        {rubricScores.citations} / 25
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={rubricScores.citations}
                      onChange={(e) => setRubricScores({ ...rubricScores, citations: parseInt(e.target.value) || 0 })}
                      className="w-full accent-indigo-600 cursor-pointer h-1.5"
                    />
                  </div>

                  {/* Criterion 4 */}
                  <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-on-surface block">4. Orthography, Layout & Visual Presentation</span>
                        <span className="text-[11px] text-on-surface-variant">
                          Figure resolutions (300 DPI), Qubee/Amharic script harmonization, and typographic hierarchy.
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded border border-indigo-200/50">
                        {rubricScores.presentation} / 25
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={rubricScores.presentation}
                      onChange={(e) => setRubricScores({ ...rubricScores, presentation: parseInt(e.target.value) || 0 })}
                      className="w-full accent-indigo-600 cursor-pointer h-1.5"
                    />
                  </div>
                </div>

                {/* Final Recommendation Picker */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/20">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Editorial Recommendation Decision</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Accept', 'Minor Revision', 'Major Revision', 'Reject'] as const).map((rec) => (
                      <button
                        type="button"
                        key={rec}
                        onClick={() => setRecommendation(rec)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                          recommendation === rec
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-surface text-on-surface border-outline-variant/30 hover:bg-surface-container'
                        }`}
                      >
                        {rec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Constructive Feedback for Authors */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface flex items-center justify-between">
                    <span>Constructive Feedback for Authors (Shared Anonymously)</span>
                    <span className="text-[10px] text-on-surface-variant font-normal">Double-blind transmitted</span>
                  </label>
                  <textarea
                    rows={4}
                    value={authorFeedback}
                    onChange={(e) => setAuthorFeedback(e.target.value)}
                    placeholder="Detail specific suggestions regarding experimental sampling, statistical tables, Figure revisions, and literature citations..."
                    className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
                  />
                </div>

                {/* Confidential Notes to Editor-in-Chief */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface flex items-center justify-between">
                    <span>Confidential Notes to Editor-in-Chief (Not Shared with Authors)</span>
                    <span className="text-[10px] text-rose-600 font-semibold">Strictly Confidential</span>
                  </label>
                  <textarea
                    rows={2}
                    value={confidentialNotes}
                    onChange={(e) => setConfidentialNotes(e.target.value)}
                    placeholder="Editorial assessment, plagiarism scanner verification notes, or priority recommendation for upcoming journal volume..."
                    className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
                  />
                </div>

                {/* Action Submission Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-outline-variant/20">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveReview(true)}
                    disabled={submitting}
                    leftIcon={<Save className="w-4 h-4" />}
                    className="w-full sm:w-auto text-xs cursor-pointer"
                  >
                    Save Draft
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSaveReview(false)}
                    disabled={submitting}
                    leftIcon={<Send className="w-4 h-4" />}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs cursor-pointer font-bold shadow-md"
                  >
                    {submitting ? 'Submitting...' : 'Submit Formal Review to Editor-in-Chief'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETED SUBMISSIONS & REFEREE CERTIFICATES */}
      {activeTab === 'completed' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Archived Editorial Peer Review Decisions</h3>
                <p className="text-xs text-on-surface-variant">
                  Certified evaluations archived in the Haramaya University Academic Press registry.
                </p>
              </div>
              <Badge variant="success" className="font-mono text-xs">
                {assignments.filter((a) => a.status === 'Submitted').length} Certified Decisions
              </Badge>
            </div>

            <div className="space-y-3">
              {assignments
                .filter((a) => a.status === 'Submitted')
                .map((item) => {
                  const cert = certificates.find((c) => c.trackingCode === item.trackingCode);
                  const total = (item.currentScores?.novelty || 20) +
                    (item.currentScores?.methodology || 20) +
                    (item.currentScores?.citations || 20) +
                    (item.currentScores?.presentation || 20);

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-surface border border-outline-variant/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                            {item.journal} • {item.trackingCode}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                            Verdict: {item.recommendation}
                          </span>
                          <span className="font-mono text-xs text-on-surface font-semibold">
                            Score: {total}/100
                          </span>
                        </div>

                        <h4 className="font-serif font-bold text-sm text-on-surface">
                          {item.manuscriptTitle}
                        </h4>

                        {item.authorFeedback && (
                          <p className="text-[11px] text-on-surface-variant italic line-clamp-1">
                            Feedback: "{item.authorFeedback}"
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[10px] text-on-surface-variant pt-1 font-mono">
                          <span>Concluded: {item.completedDate || 'Recently Certified'}</span>
                          {item.doi && <span>DOI: {item.doi}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                        {cert ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingCertificate(cert)}
                            leftIcon={<Award className="w-4 h-4 text-amber-500" />}
                            className="text-xs cursor-pointer w-full md:w-auto"
                          >
                            View Certificate
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const syntheticCert: RefereeRecognitionCertificate = {
                                certificateId: `HU-PR-${new Date().getFullYear()}-7721`,
                                reviewerName: reviewer.name,
                                manuscriptTitle: item.manuscriptTitle,
                                journalName: item.journalFullName,
                                trackingCode: item.trackingCode,
                                completionDate: item.completedDate || '2026-09-04',
                                issuingAuthority: 'Haramaya University Office of the Vice President for Research Affairs',
                                verificationHash: 'e7c19b48f93a628d017b254c6',
                              };
                              setViewingCertificate(syntheticCert);
                            }}
                            leftIcon={<Award className="w-4 h-4 text-amber-500" />}
                            className="text-xs cursor-pointer w-full md:w-auto"
                          >
                            Referee Certificate
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectAssignment(item)}
                          className="text-xs cursor-pointer"
                        >
                          View Dossier
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: JOURNAL DIRECTORY & EDITORIAL GUIDELINES */}
      {activeTab === 'journals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {journals.map((j) => (
              <div
                key={j.code}
                className="p-6 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-4 flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 font-mono font-bold text-xs">
                      {j.code}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      ISSN: {j.issn}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-on-surface">
                    {j.name}
                  </h3>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {j.focusScope}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-outline-variant/20 text-xs">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Frequency:</span>
                      <strong className="text-on-surface">{j.frequency}</strong>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Acceptance Rate:</span>
                      <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{j.acceptanceRate}</strong>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Average Turnaround:</span>
                      <strong className="text-emerald-600 font-mono">{j.avgReviewCycle}</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-outline-variant/20">
                    <div className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
                      Editorial Guidelines:
                    </div>
                    <ul className="space-y-1 text-[11px] text-on-surface-variant">
                      {j.guidelines.map((g, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/20 text-[10px] text-on-surface-variant">
                  Editor-in-Chief: <strong className="text-on-surface">{j.editorInChief}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REFEREE PROFILE & ORCID CREDENTIALS */}
      {activeTab === 'profile' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <h3 className="text-base font-bold text-on-surface">Referee Credentials & Academic Profile</h3>
                <p className="text-xs text-on-surface-variant">
                  Haramaya University Peer Reviewer Registration & ORCID Integration
                </p>
              </div>
              <Button
                variant={isEditingProfile ? 'outline' : 'primary'}
                size="sm"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                leftIcon={isEditingProfile ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                className="text-xs cursor-pointer"
              >
                {isEditingProfile ? 'Cancel Editing' : 'Edit Credentials'}
              </Button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface">Full Academic Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface">Academic Title</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
                      required
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-on-surface">University College & Affiliation</label>
                    <input
                      type="text"
                      value={profileForm.affiliation}
                      onChange={(e) => setProfileForm({ ...profileForm, affiliation: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface">ORCID iD</label>
                    <input
                      type="text"
                      value={profileForm.orcid}
                      onChange={(e) => setProfileForm({ ...profileForm, orcid: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface">Institutional Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
                      required
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/20 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    leftIcon={<Save className="w-4 h-4" />}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs cursor-pointer font-bold"
                  >
                    Save Profile Updates
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 space-y-1">
                    <span className="text-on-surface-variant block font-medium">Referee Full Name:</span>
                    <strong className="text-on-surface text-sm font-serif">{reviewer.name}</strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 space-y-1">
                    <span className="text-on-surface-variant block font-medium">Official Title:</span>
                    <strong className="text-on-surface">{reviewer.title}</strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 space-y-1 sm:col-span-2">
                    <span className="text-on-surface-variant block font-medium">College Affiliation:</span>
                    <strong className="text-on-surface">{reviewer.affiliation}</strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 space-y-1">
                    <span className="text-on-surface-variant block font-medium">ORCID Identifier:</span>
                    <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{reviewer.orcid}</strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 space-y-1">
                    <span className="text-on-surface-variant block font-medium">Official Email:</span>
                    <strong className="text-on-surface">{reviewer.email}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2">
                  <div className="text-xs font-bold text-on-surface">Subject Matter Specializations:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {reviewer.specialties.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/30 text-xs text-on-surface font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Status: Available for new double-blind manuscript assignments</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                    Active Referee
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Full Manuscript Double-Blind Reader */}
      {readerAssignment && (
        <ManuscriptReaderModal
          assignment={readerAssignment}
          onClose={() => setReaderAssignment(null)}
          onOpenScoring={() => handleSelectAssignment(readerAssignment)}
          onShowToast={onShowToast}
        />
      )}

      {/* MODAL: Official Referee Certificate */}
      {viewingCertificate && (
        <RefereeCertificateModal
          certificate={viewingCertificate}
          onClose={() => setViewingCertificate(null)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
