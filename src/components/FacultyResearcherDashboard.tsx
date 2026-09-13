import React, { useState } from 'react';
import { Language } from '../types';

interface GrantProject {
  id: string;
  title: string;
  funder: string;
  grantNumber: string;
  status: 'Awarded & Active' | 'Proposal Under Review' | 'Milestone Completed' | 'Final Reporting';
  totalBudgetETB: number;
  spentBudgetETB: number;
  totalBudgetUSD: number;
  startDate: string;
  endDate: string;
  coPIs: string[];
  publicationsCount: number;
}

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
  const [activeTab, setActiveTab] = useState<'grants' | 'supervision' | 'outputs' | 'budget'>('grants');

  // Faculty Profile
  const [faculty] = useState({
    name: 'Dr. Gemechu Desta, Associate Professor',
    department: 'Department of Agricultural Economics & Agribusiness Management',
    college: 'College of Agriculture and Environmental Sciences, Haramaya University',
    staffId: 'HU-FAC-8842',
    hIndex: 14,
    i10Index: 22,
    totalCitations: 1420,
    activePostgraduates: 6,
  });

  // Grants List
  const [grants, setGrants] = useState<GrantProject[]>([
    {
      id: 'grant-01',
      title: 'Climate Adaptation & Smallholder Market Integration in the Harar Highlands',
      funder: 'Haramaya University Research & Extension Directorate (RGD)',
      grantNumber: 'HU-RGD-2025-048',
      status: 'Awarded & Active',
      totalBudgetETB: 485000,
      spentBudgetETB: 312000,
      totalBudgetUSD: 3590,
      startDate: '2025-09-01',
      endDate: '2026-12-31',
      coPIs: ['Prof. Fatuma Ahmed', 'Mr. Feysal Hussein'],
      publicationsCount: 3,
    },
    {
      id: 'grant-02',
      title: 'Multi-Spectral Remote Sensing for Sorghum Crop Yield Forecasting',
      funder: 'Ethiopian Ministry of Innovation & Technology (MoIT)',
      grantNumber: 'MoIT-AGR-2026-119',
      status: 'Proposal Under Review',
      totalBudgetETB: 1250000,
      spentBudgetETB: 0,
      totalBudgetUSD: 9250,
      startDate: '2026-11-01',
      endDate: '2028-06-30',
      coPIs: ['Dr. Tadesse Bekele'],
      publicationsCount: 0,
    },
  ]);

  // Supervised Students
  const [supervisedTheses] = useState([
    {
      id: 'stu-1',
      studentName: 'Abdi Mohammed (MSc Candidate)',
      topic: 'Economic Valuation of Khat Intercropping Systems in Kombolcha Woreda',
      progress: 85,
      stage: 'Defense Slide Preparation (WKI Beamer)',
      targetDefenseMonth: 'October 2026',
    },
    {
      id: 'stu-2',
      studentName: 'Chaltu Benti (PhD Fellow)',
      topic: 'Empirical Econometric Modeling of Micro-Credit Access for Rural Women',
      progress: 60,
      stage: 'Data Collection & Core Econometrics',
      targetDefenseMonth: 'June 2027',
    },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-gutter-mobile py-4 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-teal-950 via-emerald-950 to-slate-900 text-white border border-teal-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              Principal Investigator & Faculty Portal
            </span>
            <span className="text-xs text-teal-200/70 font-mono">ID: {faculty.staffId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">{faculty.name}</h1>
          <p className="text-xs sm:text-sm text-teal-100/80">{faculty.department} • {faculty.college}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="p-3 rounded-2xl bg-teal-900/40 border border-teal-700/30 text-center">
            <div className="text-xl font-bold text-amber-300 font-mono">{faculty.hIndex}</div>
            <div className="text-[10px] text-teal-200">h-index</div>
          </div>
          <div className="p-3 rounded-2xl bg-teal-900/40 border border-teal-700/30 text-center">
            <div className="text-xl font-bold text-emerald-400 font-mono">{faculty.totalCitations}</div>
            <div className="text-[10px] text-teal-200">Citations</div>
          </div>
          <div className="p-3 rounded-2xl bg-teal-900/40 border border-teal-700/30 text-center">
            <div className="text-xl font-bold text-sky-300 font-mono">{faculty.activePostgraduates}</div>
            <div className="text-[10px] text-teal-200">Supervisees</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-outline-variant/30">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('grants')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'grants'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            <span>Grant Projects ({grants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supervision')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'supervision'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">groups</span>
            <span>Postgraduate Supervisees ({supervisedTheses.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onOpenGrantStudio && (
            <button
              onClick={onOpenGrantStudio}
              className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">payments</span>
              <span>New Grant Proposal</span>
            </button>
          )}
          {onOpenPosterStudio && (
            <button
              onClick={onOpenPosterStudio}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-teal-500">brush</span>
              <span>Poster Studio</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: GRANTS */}
      {activeTab === 'grants' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {grants.map((grant) => {
              const pctUsed = Math.round((grant.spentBudgetETB / grant.totalBudgetETB) * 100);
              return (
                <div
                  key={grant.id}
                  className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-teal-600 px-2 py-0.5 rounded bg-teal-500/10">
                        {grant.grantNumber}
                      </span>
                      <h3 className="font-serif font-bold text-sm text-on-surface mt-1.5">
                        {grant.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant">{grant.funder}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shrink-0">
                      {grant.status}
                    </span>
                  </div>

                  {/* Financial Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-on-surface-variant font-medium">Budget Burn Rate:</span>
                      <span className="font-mono font-bold text-on-surface">
                        {grant.spentBudgetETB.toLocaleString()} / {grant.totalBudgetETB.toLocaleString()} ETB ({pctUsed}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all"
                        style={{ width: `${pctUsed}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span>Co-PIs: {grant.coPIs.join(', ')}</span>
                    <span className="font-bold text-teal-600">{grant.publicationsCount} Publications</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: POSTGRADUATE SUPERVISION */}
      {activeTab === 'supervision' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supervisedTheses.map((stu) => (
              <div
                key={stu.id}
                className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-on-surface">{stu.studentName}</h4>
                  <span className="text-xs text-amber-600 font-bold font-mono">
                    Target: {stu.targetDefenseMonth}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant font-serif">{stu.topic}</p>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-on-surface-variant">Status: {stu.stage}</span>
                    <span className="font-bold text-teal-600 font-mono">{stu.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: `${stu.progress}%` }} />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  {onOpenThesisSlideStudio && (
                    <button
                      onClick={onOpenThesisSlideStudio}
                      className="px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">slideshow</span>
                      <span>Review Beamer Slides</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
