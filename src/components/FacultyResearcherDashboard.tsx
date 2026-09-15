import React, { useState, useEffect } from 'react';
import {
  FileText,
  DollarSign,
  GraduationCap,
  BookOpen,
  Plus,
  CreditCard,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
  Presentation,
  ShieldCheck,
  AlertCircle,
  Building,
  Briefcase,
} from 'lucide-react';
import {
  FacultyResearcherProfile,
  GrantProject,
  SupervisedThesis,
  FacultyResearchOutput,
  Language,
} from '../types';
import {
  INITIAL_FACULTY_PROFILE,
  INITIAL_FACULTY_GRANTS,
  INITIAL_SUPERVISED_THESES,
  INITIAL_FACULTY_OUTPUTS,
} from '../data/initialData';
import { Button } from './ui';
import { NewGrantProposalModal } from './NewGrantProposalModal';
import { RecordExpenseModal } from './RecordExpenseModal';
import { AddSuperviseeModal } from './AddSuperviseeModal';
import { AddOutputModal } from './AddOutputModal';

interface FacultyResearcherDashboardProps {
  currentLanguage: Language;
  onOpenGrantStudio?: () => void;
  onOpenThesisSlideStudio?: () => void;
  onOpenPosterStudio?: () => void;
  onNavigateHome: () => void;
  onShowToast?: (msg: string) => void;
}

export const FacultyResearcherDashboard: React.FC<FacultyResearcherDashboardProps> = ({
  currentLanguage,
  onOpenGrantStudio,
  onOpenThesisSlideStudio,
  onOpenPosterStudio,
  onNavigateHome,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'grants' | 'budget' | 'supervision' | 'outputs'>('grants');

  // State
  const [profile, setProfile] = useState<FacultyResearcherProfile>(INITIAL_FACULTY_PROFILE);
  const [grants, setGrants] = useState<GrantProject[]>(INITIAL_FACULTY_GRANTS);
  const [supervisees, setSupervisees] = useState<SupervisedThesis[]>(INITIAL_SUPERVISED_THESES);
  const [outputs, setOutputs] = useState<FacultyResearchOutput[]>(INITIAL_FACULTY_OUTPUTS);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [grantSearch, setGrantSearch] = useState('');
  const [grantStatusFilter, setGrantStatusFilter] = useState('ALL');
  const [outputTypeFilter, setOutputTypeFilter] = useState('ALL');

  // Modals
  const [showNewGrantModal, setShowNewGrantModal] = useState(false);
  const [activeGrantForExpense, setActiveGrantForExpense] = useState<GrantProject | null>(null);
  const [showAddSuperviseeModal, setShowAddSuperviseeModal] = useState(false);
  const [showAddOutputModal, setShowAddOutputModal] = useState(false);
  const [viewingAbstractGrant, setViewingAbstractGrant] = useState<GrantProject | null>(null);

  // Load backend data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [profRes, grantsRes, supRes, outRes] = await Promise.all([
        fetch('/api/faculty/profile').catch(() => null),
        fetch('/api/faculty/grants').catch(() => null),
        fetch('/api/faculty/supervision').catch(() => null),
        fetch('/api/faculty/outputs').catch(() => null),
      ]);

      if (profRes && profRes.ok) {
        const data = await profRes.json();
        if (data.profile) setProfile(data.profile);
      }
      if (grantsRes && grantsRes.ok) {
        const data = await grantsRes.json();
        if (data.grants) setGrants(data.grants);
      }
      if (supRes && supRes.ok) {
        const data = await supRes.json();
        if (data.supervisees) setSupervisees(data.supervisees);
      }
      if (outRes && outRes.ok) {
        const data = await outRes.json();
        if (data.outputs) setOutputs(data.outputs);
      }
    } catch (err) {
      console.warn('Using seeded faculty data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleCreateGrant = async (grantData: Partial<GrantProject>) => {
    try {
      const res = await fetch('/api/faculty/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grantData),
      });
      if (res.ok) {
        const data = await res.json();
        setGrants((prev) => [data.grant, ...prev]);
        if (onShowToast) onShowToast('Research grant proposal registered successfully!');
      } else {
        const newLocalGrant: GrantProject = {
          id: `grant-${Date.now()}`,
          grantNumber: `HU-RES-2026-${Math.floor(100 + Math.random() * 900)}`,
          status: 'Proposal Under Review',
          spentBudgetETB: 0,
          spentBudgetUSD: 0,
          publicationsCount: 0,
          ...(grantData as GrantProject),
        };
        setGrants((prev) => [newLocalGrant, ...prev]);
        if (onShowToast) onShowToast('Grant proposal created locally.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecordExpense = async (
    grantId: string,
    category: string,
    amountETB: number,
    description: string
  ) => {
    try {
      const res = await fetch(`/api/faculty/grants/${grantId}/spend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amountETB, description }),
      });
      if (res.ok) {
        const data = await res.json();
        setGrants((prev) => prev.map((g) => (g.id === grantId ? data.grant : g)));
        if (onShowToast) onShowToast(data.message || 'Expense recorded successfully!');
      } else {
        setGrants((prev) =>
          prev.map((g) => {
            if (g.id !== grantId) return g;
            const updatedSpent = g.spentBudgetETB + amountETB;
            return {
              ...g,
              spentBudgetETB: updatedSpent,
              spentBudgetUSD: Math.round(updatedSpent / 135),
            };
          })
        );
        if (onShowToast) onShowToast('Disbursement recorded locally.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSupervisee = async (studentData: Partial<SupervisedThesis>) => {
    try {
      const res = await fetch('/api/faculty/supervision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      if (res.ok) {
        const data = await res.json();
        setSupervisees((prev) => [data.student, ...prev]);
        setProfile((p) => ({ ...p, activePostgraduates: p.activePostgraduates + 1 }));
        if (onShowToast) onShowToast('Supervisee enrolled into advisory register!');
      } else {
        const newStu: SupervisedThesis = {
          id: `stu-${Date.now()}`,
          studentId: `PGR-2026-${Math.floor(100 + Math.random() * 900)}`,
          progress: 20,
          startDate: 'September 2026',
          lastFeedbackDate: 'Today',
          ...(studentData as SupervisedThesis),
        };
        setSupervisees((prev) => [newStu, ...prev]);
        if (onShowToast) onShowToast('Supervisee registered locally.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSuperviseeProgress = async (id: string, newProgress: number, newStage?: string) => {
    try {
      const payload: any = { progress: newProgress };
      if (newStage) payload.stage = newStage;

      const res = await fetch(`/api/faculty/supervision/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setSupervisees((prev) => prev.map((s) => (s.id === id ? data.student : s)));
        if (onShowToast) onShowToast('Supervision milestone updated.');
      } else {
        setSupervisees((prev) =>
          prev.map((s) => (s.id === id ? { ...s, progress: newProgress, ...(newStage ? { stage: newStage as any } : {}) } : s))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOutput = async (outputData: Partial<FacultyResearchOutput>) => {
    try {
      const res = await fetch('/api/faculty/outputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(outputData),
      });
      if (res.ok) {
        const data = await res.json();
        setOutputs((prev) => [data.output, ...prev]);
        if (onShowToast) onShowToast('Research output archived in university repository!');
      } else {
        const newOut: FacultyResearchOutput = {
          id: `out-${Date.now()}`,
          citations: 0,
          publicationYear: 2026,
          ...(outputData as FacultyResearchOutput),
        };
        setOutputs((prev) => [newOut, ...prev]);
        if (onShowToast) onShowToast('Output recorded locally.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations for budget tab
  const totalAwardedETB = grants.reduce((sum, g) => sum + (g.totalBudgetETB || 0), 0);
  const totalSpentETB = grants.reduce((sum, g) => sum + (g.spentBudgetETB || 0), 0);
  const totalRemainingETB = totalAwardedETB - totalSpentETB;
  const overallBurnPct = totalAwardedETB > 0 ? Math.round((totalSpentETB / totalAwardedETB) * 100) : 0;

  // Filtered grants
  const filteredGrants = grants.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(grantSearch.toLowerCase()) ||
      g.funder.toLowerCase().includes(grantSearch.toLowerCase()) ||
      g.grantNumber.toLowerCase().includes(grantSearch.toLowerCase());
    const matchesStatus = grantStatusFilter === 'ALL' || g.status === grantStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered outputs
  const filteredOutputs = outputs.filter((o) => {
    return outputTypeFilter === 'ALL' || o.type === outputTypeFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-gutter-mobile py-4 animate-in fade-in duration-200">
      {/* Top Banner: Academic Identity & Research Impact */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-teal-950 via-emerald-950 to-slate-900 text-white border border-teal-800/40 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Principal Investigator & Faculty Grants Portal
            </span>
            <span className="text-xs text-teal-200/80 font-mono bg-teal-900/50 px-2.5 py-0.5 rounded-md border border-teal-700/30">
              Staff ID: {profile.staffId}
            </span>
            <span className="text-xs text-teal-200/80 font-mono bg-teal-900/50 px-2.5 py-0.5 rounded-md border border-teal-700/30">
              ORCID: {profile.orcid}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
            {profile.name}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            {profile.department} • {profile.college}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {profile.researchInterests.map((interest, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-teal-900/60 text-teal-200 text-[11px] border border-teal-700/30"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Impact Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto shrink-0">
          <div className="p-3 rounded-2xl bg-teal-900/40 border border-teal-700/30 text-center">
            <div className="text-xl font-bold text-amber-300 font-mono">{profile.hIndex}</div>
            <div className="text-[10px] text-teal-200 font-semibold uppercase tracking-wider">h-index</div>
          </div>
          <div className="p-3 rounded-2xl bg-teal-900/40 border border-teal-700/30 text-center">
            <div className="text-xl font-bold text-emerald-300 font-mono">{profile.i10Index}</div>
            <div className="text-[10px] text-teal-200 font-semibold uppercase tracking-wider">i10-index</div>
          </div>
          <div className="p-3 rounded-2xl bg-teal-900/40 border border-teal-700/30 text-center">
            <div className="text-xl font-bold text-sky-300 font-mono">{profile.totalCitations}</div>
            <div className="text-[10px] text-teal-200 font-semibold uppercase tracking-wider">Citations</div>
          </div>
          <div className="p-3 rounded-2xl bg-teal-900/40 border border-teal-700/30 text-center">
            <div className="text-xl font-bold text-teal-300 font-mono">{supervisees.length}</div>
            <div className="text-[10px] text-teal-200 font-semibold uppercase tracking-wider">Supervisees</div>
          </div>
        </div>
      </div>

      {/* Institutional Tools & Action Bar */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-on-surface">
            Haramaya University Office of the Vice President for Research Affairs Integrated System
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenGrantStudio && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenGrantStudio}
              leftIcon={<FileText className="w-3.5 h-3.5 text-teal-600" />}
              className="text-xs cursor-pointer"
            >
              Grant Studio
            </Button>
          )}

          {onOpenThesisSlideStudio && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenThesisSlideStudio}
              leftIcon={<Presentation className="w-3.5 h-3.5 text-amber-600" />}
              className="text-xs cursor-pointer"
            >
              WKI Beamer Slide Studio
            </Button>
          )}

          {onOpenPosterStudio && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenPosterStudio}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
              className="text-xs cursor-pointer"
            >
              Research Poster Studio
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowNewGrantModal(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold cursor-pointer"
          >
            New Proposal
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('grants')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'grants'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Research Grants ({grants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'budget'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Multi-Currency Budget & Burn Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('supervision')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'supervision'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Postgraduate Supervision ({supervisees.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('outputs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'outputs'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Research Outputs & Publications ({outputs.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GRANTS PORTFOLIO */}
      {activeTab === 'grants' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Controls: Search and Status Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
              <input
                type="text"
                value={grantSearch}
                onChange={(e) => setGrantSearch(e.target.value)}
                placeholder="Search grants by funder, code or title..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              <select
                value={grantStatusFilter}
                onChange={(e) => setGrantStatusFilter(e.target.value)}
                className="p-2 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="Awarded & Active">Awarded & Active</option>
                <option value="Proposal Under Review">Proposal Under Review</option>
                <option value="Milestone Completed">Milestone Completed</option>
              </select>
            </div>
          </div>

          {/* Grants Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredGrants.map((grant) => {
              const pctUsed =
                grant.totalBudgetETB > 0
                  ? Math.min(100, Math.round((grant.spentBudgetETB / grant.totalBudgetETB) * 100))
                  : 0;

              return (
                <div
                  key={grant.id}
                  className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-sm hover:border-teal-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header: Grant Number & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-teal-700 dark:text-teal-300 px-2.5 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20">
                            {grant.grantNumber}
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-on-surface-variant">
                            {grant.category}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-on-surface leading-snug">
                          {grant.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-teal-600" />
                          {grant.funder}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                          grant.status === 'Awarded & Active'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : grant.status === 'Milestone Completed'
                            ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {grant.status}
                      </span>
                    </div>

                    {/* Financial Burn Rate Bar */}
                    <div className="p-3.5 rounded-2xl bg-surface border border-outline-variant/20 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-on-surface-variant font-medium">Budget Burn Rate</span>
                        <span className="font-mono font-bold text-on-surface">
                          {grant.spentBudgetETB.toLocaleString()} / {grant.totalBudgetETB.toLocaleString()} ETB ({pctUsed}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-surface-container-highest overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pctUsed > 85 ? 'bg-amber-500' : 'bg-teal-600'
                          }`}
                          style={{ width: `${pctUsed}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-on-surface-variant">
                        <span>≈ ${(grant.spentBudgetUSD || 0).toLocaleString()} USD Spent</span>
                        <span className="font-mono text-teal-600 font-bold">
                          Unencumbered: {(grant.totalBudgetETB - grant.spentBudgetETB).toLocaleString()} ETB
                        </span>
                      </div>
                    </div>

                    {/* Milestones Checklist */}
                    {grant.milestones && grant.milestones.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="text-xs font-bold text-on-surface flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-teal-600" /> Key Grant Milestones
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            {grant.milestones.filter((m) => m.status === 'Completed').length} of{' '}
                            {grant.milestones.length} Done
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {grant.milestones.map((milestone) => (
                            <div
                              key={milestone.id}
                              className="p-2 rounded-xl bg-surface border border-outline-variant/20 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                {milestone.status === 'Completed' ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                ) : milestone.status === 'In Progress' ? (
                                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-outline-variant shrink-0" />
                                )}
                                <span
                                  className={`font-medium ${
                                    milestone.status === 'Completed' ? 'line-through text-on-surface-variant' : 'text-on-surface'
                                  }`}
                                >
                                  {milestone.title}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-on-surface-variant shrink-0">
                                {milestone.dueDate}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Metadata & Actions */}
                  <div className="pt-3 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[11px] text-on-surface-variant">
                      <span>Co-PIs: {grant.coPIs?.join(', ') || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingAbstractGrant(grant)}
                        className="text-xs cursor-pointer"
                      >
                        Abstract
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveGrantForExpense(grant)}
                        leftIcon={<CreditCard className="w-3.5 h-3.5 text-teal-600" />}
                        className="text-xs cursor-pointer font-semibold"
                      >
                        Record Expense
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-CURRENCY BUDGET & BURN RATES */}
      {activeTab === 'budget' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Top Aggregate Financial KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-1.5 shadow-xs">
              <div className="text-xs font-semibold text-on-surface-variant flex items-center justify-between">
                <span>Total Grant Portfolio</span>
                <Building className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-on-surface">
                {totalAwardedETB.toLocaleString()} <span className="text-xs text-on-surface-variant">ETB</span>
              </div>
              <div className="text-xs text-teal-600 font-mono font-medium">
                ≈ ${(Math.round(totalAwardedETB / 135)).toLocaleString()} USD
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-1.5 shadow-xs">
              <div className="text-xs font-semibold text-on-surface-variant flex items-center justify-between">
                <span>Total Disbursed (Spent)</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600">
                {totalSpentETB.toLocaleString()} <span className="text-xs text-on-surface-variant">ETB</span>
              </div>
              <div className="text-xs text-emerald-700/80 font-mono font-medium">
                ≈ ${(Math.round(totalSpentETB / 135)).toLocaleString()} USD ({overallBurnPct}%)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-1.5 shadow-xs">
              <div className="text-xs font-semibold text-on-surface-variant flex items-center justify-between">
                <span>Unencumbered Balance</span>
                <ShieldCheck className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-sky-600">
                {totalRemainingETB.toLocaleString()} <span className="text-xs text-on-surface-variant">ETB</span>
              </div>
              <div className="text-xs text-sky-700/80 font-mono font-medium">
                ≈ ${(Math.round(totalRemainingETB / 135)).toLocaleString()} USD
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-1.5 shadow-xs">
              <div className="text-xs font-semibold text-on-surface-variant flex items-center justify-between">
                <span>Official Rate Benchmark</span>
                <DollarSign className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-on-surface">
                1 USD = 135 ETB
              </div>
              <div className="text-[11px] text-on-surface-variant">
                National Bank of Ethiopia Indicative Academic Mid-Rate
              </div>
            </div>
          </div>

          {/* Project-by-Project Detailed Categorical Breakdown */}
          <div className="space-y-5">
            <h3 className="font-serif font-bold text-lg text-on-surface flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" /> Categorical Budget Allocation & Line Item Audit
            </h3>

            {grants.map((grant) => (
              <div
                key={grant.id}
                className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
                  <div>
                    <span className="text-xs font-mono font-bold text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded">
                      {grant.grantNumber}
                    </span>
                    <h4 className="font-serif font-bold text-base text-on-surface mt-1">
                      {grant.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant">Funder: {grant.funder}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveGrantForExpense(grant)}
                    leftIcon={<CreditCard className="w-3.5 h-3.5 text-teal-600" />}
                    className="text-xs cursor-pointer shrink-0 font-bold"
                  >
                    Disburse Against Line Item
                  </Button>
                </div>

                {/* Categories Table/Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {grant.budgetBreakdown?.map((cat, idx) => {
                    const catPct =
                      cat.allocatedETB > 0
                        ? Math.min(100, Math.round((cat.spentETB / cat.allocatedETB) * 100))
                        : 0;
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-surface border border-outline-variant/20 space-y-2.5"
                      >
                        <div className="flex justify-between items-start text-xs">
                          <span className="font-bold text-on-surface">{cat.category}</span>
                          <span className="font-mono font-bold text-teal-600">{catPct}%</span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              catPct > 85 ? 'bg-amber-500' : 'bg-teal-600'
                            }`}
                            style={{ width: `${catPct}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-[11px] text-on-surface-variant font-mono">
                          <span>Spent: {cat.spentETB.toLocaleString()} ETB</span>
                          <span>Allocated: {cat.allocatedETB.toLocaleString()} ETB</span>
                        </div>

                        <div className="text-[10px] text-emerald-600 font-bold font-mono text-right">
                          Remaining: {(cat.allocatedETB - cat.spentETB).toLocaleString()} ETB
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: POSTGRADUATE SUPERVISION */}
      {activeTab === 'supervision' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
            <div>
              <h3 className="font-serif font-bold text-base text-on-surface">
                Postgraduate & Doctoral Supervision Registry
              </h3>
              <p className="text-xs text-on-surface-variant">
                Track candidate defense milestones, econometric chapters, and WKI Beamer slide rehearsals
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddSuperviseeModal(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold cursor-pointer"
            >
              Enroll Candidate
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {supervisees.map((stu) => (
              <div
                key={stu.id}
                className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-sm hover:border-teal-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded">
                          {stu.studentId}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            stu.degree === 'PhD'
                              ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300'
                              : stu.degree === 'PostDoc'
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                              : 'bg-teal-500/15 text-teal-700 dark:text-teal-300'
                          }`}
                        >
                          {stu.degree} Track
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-on-surface mt-1.5">{stu.studentName}</h4>
                      <p className="text-xs text-on-surface-variant font-medium">{stu.department}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-amber-600 font-bold font-mono block">
                        Defense: {stu.targetDefenseMonth}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-mono">
                        Enrolled: {stu.startDate}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-surface border border-outline-variant/20">
                    <div className="text-xs font-serif text-on-surface font-semibold italic">
                      "{stu.topic}"
                    </div>
                  </div>

                  {/* Progress Bar & Stage Indicator */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant font-medium">Stage: {stu.stage}</span>
                      <span className="font-mono font-bold text-teal-600">{stu.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all"
                        style={{ width: `${stu.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Notes / Last Feedback */}
                  <div className="p-2.5 rounded-xl bg-surface-container-high/40 text-[11px] text-on-surface-variant space-y-1">
                    <div className="font-bold text-on-surface flex items-center justify-between">
                      <span>Advisor Feedback:</span>
                      <span className="font-mono text-[10px] text-on-surface-variant">{stu.lastFeedbackDate}</span>
                    </div>
                    <p className="line-clamp-2">{stu.notes}</p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        handleUpdateSuperviseeProgress(
                          stu.id,
                          Math.min(100, stu.progress + 10),
                          stu.progress + 10 >= 80 ? 'Defense Slide Preparation (WKI Beamer)' : undefined
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/30 hover:bg-surface-container text-[11px] font-bold text-on-surface cursor-pointer"
                    >
                      +10% Progress
                    </button>
                  </div>

                  {onOpenThesisSlideStudio && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={onOpenThesisSlideStudio}
                      leftIcon={<Presentation className="w-3.5 h-3.5" />}
                      className="bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold cursor-pointer"
                    >
                      Review Beamer Slides
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RESEARCH OUTPUTS & PUBLICATIONS */}
      {activeTab === 'outputs' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
            <div>
              <h3 className="font-serif font-bold text-base text-on-surface">
                Faculty Research Outputs & Citations Catalog
              </h3>
              <p className="text-xs text-on-surface-variant">
                Journal manuscripts, institutional monographs, policy briefs, and conference proceedings
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={outputTypeFilter}
                onChange={(e) => setOutputTypeFilter(e.target.value)}
                className="p-2 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
              >
                <option value="ALL">All Output Types</option>
                <option value="Journal Article">Journal Articles</option>
                <option value="University Monograph">University Monographs</option>
                <option value="Policy Brief">Policy Briefs</option>
                <option value="Conference Proceeding">Conference Proceedings</option>
              </select>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddOutputModal(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold cursor-pointer shrink-0"
              >
                Log Output
              </Button>
            </div>
          </div>

          <div className="space-y-3.5">
            {filteredOutputs.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-teal-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.type === 'Journal Article'
                          ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
                          : item.type === 'University Monograph'
                          ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300'
                          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs text-on-surface-variant font-mono">{item.publicationYear}</span>
                    {item.doi && (
                      <span className="text-[10px] font-mono text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded">
                        DOI: {item.doi}
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-base text-on-surface leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    {item.authors} • <span className="italic font-medium">{item.publicationVenue}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-outline-variant/30 sm:pl-4">
                  <div className="text-center">
                    <div className="text-xl font-bold font-mono text-emerald-600">{item.citations}</div>
                    <div className="text-[10px] text-on-surface-variant uppercase font-semibold">Citations</div>
                  </div>

                  {item.openAccessUrl && (
                    <a
                      href={item.openAccessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-surface border border-outline-variant/30 hover:bg-surface-container text-teal-600 cursor-pointer"
                      title="View Article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS */}
      {showNewGrantModal && (
        <NewGrantProposalModal
          onClose={() => setShowNewGrantModal(false)}
          onSubmit={handleCreateGrant}
          onShowToast={onShowToast}
        />
      )}

      {activeGrantForExpense && (
        <RecordExpenseModal
          grant={activeGrantForExpense}
          onClose={() => setActiveGrantForExpense(null)}
          onSubmit={handleRecordExpense}
          onShowToast={onShowToast}
        />
      )}

      {showAddSuperviseeModal && (
        <AddSuperviseeModal
          onClose={() => setShowAddSuperviseeModal(false)}
          onSubmit={handleAddSupervisee}
          onShowToast={onShowToast}
        />
      )}

      {showAddOutputModal && (
        <AddOutputModal
          grants={grants}
          onClose={() => setShowAddOutputModal(false)}
          onSubmit={handleAddOutput}
          onShowToast={onShowToast}
        />
      )}

      {/* Abstract Viewer Dialog */}
      {viewingAbstractGrant && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="p-6 rounded-3xl bg-surface border border-outline-variant/30 max-w-xl w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <span className="text-xs font-mono font-bold text-teal-600">
                {viewingAbstractGrant.grantNumber}
              </span>
              <button
                onClick={() => setViewingAbstractGrant(null)}
                className="text-xs text-on-surface-variant hover:text-on-surface font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
            <h3 className="font-serif font-bold text-base text-on-surface">
              {viewingAbstractGrant.title}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {viewingAbstractGrant.abstract || 'No abstract summary recorded for this grant.'}
            </p>
            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingAbstractGrant(null)}
                className="text-xs cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
