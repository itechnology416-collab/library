import React from 'react';
import { Language } from '../types';

interface DashboardsHubProps {
  currentLanguage: Language;
  onSelectDashboard: (tab: 'portal' | 'student' | 'admin' | 'peer_review' | 'faculty' | 'repository' | 'irb' | 'tech_transfer' | 'store') => void;
  pendingRequestsCount: number;
  totalBooksCount: number;
  totalCoursesCount: number;
}

export const DashboardsHub: React.FC<DashboardsHubProps> = ({
  currentLanguage,
  onSelectDashboard,
  pendingRequestsCount,
  totalBooksCount,
  totalCoursesCount,
}) => {
  const dashboards = [
    {
      id: 'portal' as const,
      title: 'Author & Client Project Portal',
      subtitle: 'Track manuscript milestones, Beamer slide proofing, CBE / Telebirr payments, and revisions.',
      icon: 'assignment',
      badge: `${pendingRequestsCount} Active Briefs`,
      badgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      theme: 'from-amber-950/20 via-orange-950/10 to-transparent hover:border-amber-500/50',
      actionText: 'Open Author Portal',
      buttonColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    },
    {
      id: 'student' as const,
      title: 'Postgraduate Learner & Scholar Dashboard',
      subtitle: 'Access enrolled curricula, video lectures, timed assessments, personal book annotations, and verified credentials.',
      icon: 'school',
      badge: `${totalCoursesCount} Academic Courses`,
      badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      theme: 'from-emerald-950/20 via-teal-950/10 to-transparent hover:border-emerald-500/50',
      actionText: 'Open Scholar Dashboard',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    },
    {
      id: 'peer_review' as const,
      title: 'Peer Reviewer & Journal Editorial Portal',
      subtitle: 'Double-blind manuscript evaluation queue for EAJS, HJAS, and HLR, scoring rubrics, referee recognition, and Crossref DOI assignments.',
      icon: 'rate_review',
      badge: 'Phase 4 • Double-Blind Editorial Desk',
      badgeColor: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
      theme: 'from-indigo-950/20 via-purple-950/10 to-transparent hover:border-indigo-500/50',
      actionText: 'Open Reviewer Portal',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    },
    {
      id: 'faculty' as const,
      title: 'Faculty Researcher & Grants Dashboard',
      subtitle: 'Manage research grant proposals, multi-currency budget burn rates, postgraduate thesis supervisees, and citation metrics.',
      icon: 'account_balance_wallet',
      badge: 'Phase 5 • PI Grants & Supervision Portal',
      badgeColor: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
      theme: 'from-teal-950/20 via-cyan-950/10 to-transparent hover:border-teal-500/50',
      actionText: 'Open Faculty Portal',
      buttonColor: 'bg-teal-700 hover:bg-teal-600 text-white',
    },
    {
      id: 'admin' as const,
      title: 'University Press & Central Registrar Operations',
      subtitle: 'Official ETD thesis clearance verification & QR certificates, industrial print-on-demand & bindery floor, national ISBN/DOI registry, and financial audit ledger.',
      icon: 'admin_panel_settings',
      badge: 'Phase 6 • Press & Registrar Operations Desk',
      badgeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
      theme: 'from-purple-950/20 via-slate-950/10 to-transparent hover:border-purple-500/50',
      actionText: 'Open Press & Registrar Desk',
      buttonColor: 'bg-purple-700 hover:bg-purple-600 text-white',
    },
    {
      id: 'repository' as const,
      title: 'Institutional E-Repository & ETD Research Commons',
      subtitle: 'Open access digital archive, persistent DSpace handles (123456789), Dublin Core metadata, live OAI-PMH 2.0 national harvest feeds, ARR conference proceedings, and global altmetrics.',
      icon: 'auto_stories',
      badge: 'Phase 7 • Institutional Repository & ETD Archive',
      badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      theme: 'from-emerald-950/20 via-teal-950/10 to-transparent hover:border-emerald-500/50',
      actionText: 'Open E-Repository Commons',
      buttonColor: 'bg-emerald-700 hover:bg-emerald-600 text-white',
    },
    {
      id: 'irb' as const,
      title: 'Institutional Review Board (IRB) & Research Intelligence',
      subtitle: 'Ethical protocol review desk (CHMS, Agriculture, Animal, IBC), official clearance certificates with QR/SHA-256 verification, UN SDG research impact intelligence matrix, and annual symposia CFP submissions.',
      icon: 'verified_user',
      badge: 'Phase 8 • Research Ethics & Institutional Intelligence',
      badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
      theme: 'from-blue-950/20 via-sky-950/10 to-transparent hover:border-blue-500/50',
      actionText: 'Open IRB & Research Intelligence',
      buttonColor: 'bg-blue-700 hover:bg-blue-600 text-white',
    },
    {
      id: 'tech_transfer' as const,
      title: 'Technology Transfer, Incubation & Community Extension',
      subtitle: 'Intellectual property & patent registry (EIPA), HU-BIIC deep-tech startup incubator, multilingual regional agro-advisories (English, Afaan Oromoo, Amharic), field demonstration stations, and strategic industry linkages (MoUs).',
      icon: 'hub',
      badge: 'Phase 9 • Tech Transfer & Community Extension',
      badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      theme: 'from-emerald-950/20 via-teal-950/10 to-transparent hover:border-emerald-500/50',
      actionText: 'Open Tech Transfer & Extension Hub',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold',
    },
    {
      id: 'store' as const,
      title: 'Digital Store & DRM Educational Marketplace',
      subtitle: 'Official digital learning press: English books, audio masterclasses, SOC cybersecurity training, PowerPoint slide decks, graphic design templates, and DRM-protected student download library.',
      icon: 'local_mall',
      badge: 'Ilillii Digital Marketplace',
      badgeColor: 'bg-primary/15 text-primary border-primary/30',
      theme: 'from-blue-950/20 via-indigo-950/10 to-transparent hover:border-primary/50',
      actionText: 'Open Digital Store',
      buttonColor: 'bg-primary hover:opacity-90 text-white font-bold',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-gutter-mobile py-6 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-wider">
          Dedicated Institutional Portals
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-on-surface">
          Select Your Specialized Academic Workspace
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Switch between customized workflows designed for postgraduate candidates, university faculty, peer reviewers, author clients, and press administrators.
        </p>
      </div>

      {/* Grid of 5 Specialized Dashboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map((dash) => (
          <div
            key={dash.id}
            className={`p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 bg-linear-to-b ${dash.theme} flex flex-col justify-between space-y-5 transition-all shadow-xs hover:shadow-md group`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-surface flex items-center justify-center shadow-xs border border-outline-variant/20 text-on-surface">
                  <span className="material-symbols-outlined text-[24px]">{dash.icon}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${dash.badgeColor}`}>
                  {dash.badge}
                </span>
              </div>

              <h2 className="text-lg font-bold font-serif text-on-surface group-hover:text-secondary transition-colors">
                {dash.title}
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {dash.subtitle}
              </p>
            </div>

            <button
              onClick={() => onSelectDashboard(dash.id)}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98 ${dash.buttonColor}`}
            >
              <span>{dash.actionText}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
