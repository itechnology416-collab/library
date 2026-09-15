import React, { useState, useEffect } from 'react';
import {
  IntellectualPropertyRecord,
  IncubationStartupProject,
  CommunityAgroAdvisory,
  DemonstrationSiteAndOutreach,
  IndustryLinkageMou,
  Language,
} from '../types';
import {
  INITIAL_IP_RECORDS,
  INITIAL_INCUBATION_STARTUPS,
  INITIAL_AGRO_ADVISORIES,
  INITIAL_DEMO_SITES,
  INITIAL_INDUSTRY_MOUS,
} from '../data/initialData';

interface TechTransferExtensionHubProps {
  currentLanguage?: Language;
  onBackToHub?: () => void;
  onOpenFacultyGrants?: () => void;
  onOpenRepository?: () => void;
}

export const TechTransferExtensionHub: React.FC<TechTransferExtensionHubProps> = ({
  currentLanguage = 'en',
  onBackToHub,
  onOpenFacultyGrants,
  onOpenRepository,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'ip_registry' | 'incubation' | 'agro_advisories' | 'demo_sites' | 'industry_mous'
  >('ip_registry');

  // State collections
  const [ipRecords, setIpRecords] = useState<IntellectualPropertyRecord[]>(INITIAL_IP_RECORDS);
  const [startups, setStartups] = useState<IncubationStartupProject[]>(INITIAL_INCUBATION_STARTUPS);
  const [advisories, setAdvisories] = useState<CommunityAgroAdvisory[]>(INITIAL_AGRO_ADVISORIES);
  const [demoSites, setDemoSites] = useState<DemonstrationSiteAndOutreach[]>(INITIAL_DEMO_SITES);
  const [mous, setMous] = useState<IndustryLinkageMou[]>(INITIAL_INDUSTRY_MOUS);

  // Filters & Search
  const [ipSearch, setIpSearch] = useState('');
  const [ipTypeFilter, setIpTypeFilter] = useState('All');
  const [ipStatusFilter, setIpStatusFilter] = useState('All');

  const [startupSearch, setStartupSearch] = useState('');
  const [startupSectorFilter, setStartupSectorFilter] = useState('All');

  const [advisoryLang, setAdvisoryLang] = useState<'en' | 'or' | 'am'>('en');
  const [advisoryUrgencyFilter, setAdvisoryUrgencyFilter] = useState('All');
  const [advisoryZoneFilter, setAdvisoryZoneFilter] = useState('All');

  // Modals state
  const [selectedIpForCert, setSelectedIpForCert] = useState<IntellectualPropertyRecord | null>(null);
  const [selectedAdvisoryForReading, setSelectedAdvisoryForReading] = useState<CommunityAgroAdvisory | null>(null);
  const [showNewIpModal, setShowNewIpModal] = useState(false);
  const [showNewStartupModal, setShowNewStartupModal] = useState(false);
  const [showNewAdvisoryModal, setShowNewAdvisoryModal] = useState(false);
  const [showNewFieldDayModal, setShowNewFieldDayModal] = useState<string | null>(null);
  const [showNewMouModal, setShowNewMouModal] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Fetch live from server on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [ipRes, startRes, advRes, demoRes, mouRes] = await Promise.all([
          fetch('/api/ip/records').then((r) => r.json()),
          fetch('/api/incubation/startups').then((r) => r.json()),
          fetch('/api/extension/advisories').then((r) => r.json()),
          fetch('/api/extension/demo-sites').then((r) => r.json()),
          fetch('/api/industry/mous').then((r) => r.json()),
        ]);

        if (ipRes.success && ipRes.records) setIpRecords(ipRes.records);
        if (startRes.success && startRes.startups) setStartups(startRes.startups);
        if (advRes.success && advRes.advisories) setAdvisories(advRes.advisories);
        if (demoRes.success && demoRes.demoSites) setDemoSites(demoRes.demoSites);
        if (mouRes.success && mouRes.mous) setMous(mouRes.mous);
      } catch (err) {
        console.warn('Using local fallback seed data for Phase 9:', err);
      }
    };
    fetchAllData();
  }, []);

  // Form states for New IP Disclosure
  const [newIpForm, setNewIpForm] = useState({
    title: '',
    ipType: 'Patent' as IntellectualPropertyRecord['ipType'],
    primaryName: '',
    primaryCollege: 'College of Agriculture & Environmental Sciences',
    primaryDept: 'Plant Breeding & Genetics',
    primaryEmail: '',
    primaryShare: 60,
    coInventors: '',
    abstractDescription: '',
    trl: 4,
    targetIndustry: 'Agri-Tech & Seed Production Systems',
    tags: 'Haramaya Tech, Plant Innovation, Commercialization',
  });

  // Form states for New Startup Admission
  const [newStartupForm, setNewStartupForm] = useState({
    ventureName: '',
    tagline: '',
    cohortBatch: 'Cohort VII (2026/2027)',
    founderName: '',
    founderRole: 'Team Lead & Chief Agronomist',
    founderProgram: 'MSc in Postharvest Tech (Alum/Scholar)',
    focusSector: 'Agri-Tech & Smart Postharvest',
    seedFunding: 350000,
    mentorName: 'Dr. Gulelat Belachew',
    mentorRole: 'Director, TTCIL Directorate',
    workspace: 'HU-BIIC Innovation Incubator Pod C-4',
  });

  // Form states for New Agro-Advisory
  const [newAdvForm, setNewAdvForm] = useState({
    titleEn: '',
    titleOr: '',
    titleAm: '',
    targetCrop: '',
    zone: 'Mid-Altitude (Weyna-Dega) 1700-2400m',
    season: 'Meher (Main Rainy Season)',
    urgency: 'Seasonal Recommendation' as CommunityAgroAdvisory['urgencyLevel'],
    bodyEn: '',
    bodyOr: '',
    bodyAm: '',
    rec1: '',
    rec2: '',
    rec3: '',
    expertName: 'Dr. Fikre Lemessa & Regional Extension Taskforce',
    expertDept: 'CAES Agricultural Outreach Services',
    relatedTech: 'HU Improved Agri-Tech Package',
  });

  // Form state for New Field Day
  const [newFieldDayForm, setNewFieldDayForm] = useState({
    title: '',
    date: '2026-10-15',
    expectedParticipants: 150,
  });

  // Form state for New Industry MoU
  const [newMouForm, setNewMouForm] = useState({
    partnerOrganization: '',
    sector: 'State Enterprise' as IndustryLinkageMou['sector'],
    agreementTitle: '',
    signingDate: new Date().toISOString().split('T')[0],
    validUntil: '2029-12-31',
    focalPersonHUName: '',
    focalPersonHUDepartment: 'College of Agriculture & Environmental Sciences',
    focalPersonHUEmail: '',
    focalPersonPartnerName: '',
    focalPersonPartnerTitle: 'Research & Development Director',
    focalPersonPartnerEmail: '',
    obj1: '',
    obj2: '',
    obj3: '',
    valueETB: 5000000,
    scopeSummary: '',
  });

  // Submit Handlers
  const handleCreateIp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpForm.title || !newIpForm.primaryName || !newIpForm.abstractDescription) {
      showToast('Please complete title, primary inventor, and abstract.');
      return;
    }

    const payload = {
      title: newIpForm.title,
      ipType: newIpForm.ipType,
      primaryInventor: {
        name: newIpForm.primaryName,
        college: newIpForm.primaryCollege,
        department: newIpForm.primaryDept,
        email: newIpForm.primaryEmail,
        sharePercentage: Number(newIpForm.primaryShare),
      },
      coInventors: newIpForm.coInventors
        ? newIpForm.coInventors.split(',').map((c) => ({
            name: c.trim(),
            college: newIpForm.primaryCollege,
            department: newIpForm.primaryDept,
            sharePercentage: 10,
          }))
        : [],
      abstractDescription: newIpForm.abstractDescription,
      technologyReadinessLevel: Number(newIpForm.trl),
      targetIndustry: newIpForm.targetIndustry,
      tags: newIpForm.tags.split(',').map((t) => t.trim()),
    };

    try {
      const res = await fetch('/api/ip/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.record) {
        setIpRecords((prev) => [data.record, ...prev]);
        showToast(`Invention Disclosure ${data.record.ipNumber} filed successfully!`);
        setShowNewIpModal(false);
      }
    } catch {
      showToast('Filed invention locally in registry.');
      setShowNewIpModal(false);
    }
  };

  const handleCreateStartup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStartupForm.ventureName || !newStartupForm.founderName) {
      showToast('Please provide startup name and founder details.');
      return;
    }

    const payload = {
      ventureName: newStartupForm.ventureName,
      tagline: newStartupForm.tagline,
      cohortBatch: newStartupForm.cohortBatch,
      founders: [
        {
          name: newStartupForm.founderName,
          role: newStartupForm.founderRole,
          affiliationOrProgram: newStartupForm.founderProgram,
        },
      ],
      focusSector: newStartupForm.focusSector,
      seedFundingAllocatedETB: Number(newStartupForm.seedFunding),
      mentor: {
        name: newStartupForm.mentorName,
        designation: newStartupForm.mentorRole,
        institution: 'Haramaya University',
      },
      workspaceAssigned: newStartupForm.workspace,
    };

    try {
      const res = await fetch('/api/incubation/startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.startup) {
        setStartups((prev) => [data.startup, ...prev]);
        showToast(`Venture "${data.startup.ventureName}" admitted to HU-BIIC!`);
        setShowNewStartupModal(false);
      }
    } catch {
      showToast('Admitted startup locally.');
      setShowNewStartupModal(false);
    }
  };

  const handleCreateAdvisory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdvForm.titleEn || !newAdvForm.targetCrop || !newAdvForm.bodyEn) {
      showToast('Please fill out the English title, crop/livestock, and body text.');
      return;
    }

    const payload = {
      title: {
        en: newAdvForm.titleEn,
        or: newAdvForm.titleOr || newAdvForm.titleEn,
        am: newAdvForm.titleAm || newAdvForm.titleEn,
      },
      targetCropOrLivestock: newAdvForm.targetCrop,
      agroEcologicalZone: newAdvForm.zone,
      season: newAdvForm.season,
      urgencyLevel: newAdvForm.urgency,
      bodyGuidance: {
        en: newAdvForm.bodyEn,
        or: newAdvForm.bodyOr || newAdvForm.bodyEn,
        am: newAdvForm.bodyAm || newAdvForm.bodyEn,
      },
      keyRecommendations: [newAdvForm.rec1, newAdvForm.rec2, newAdvForm.rec3].filter(Boolean),
      preparedByExpert: {
        name: newAdvForm.expertName,
        title: 'Senior Extension Specialist',
        department: newAdvForm.expertDept,
      },
      relatedVarietyOrTech: newAdvForm.relatedTech,
    };

    try {
      const res = await fetch('/api/extension/advisories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.advisory) {
        setAdvisories((prev) => [data.advisory, ...prev]);
        showToast(`Advisory ${data.advisory.advisoryCode} broadcasted to extension network!`);
        setShowNewAdvisoryModal(false);
      }
    } catch {
      showToast('Published advisory locally.');
      setShowNewAdvisoryModal(false);
    }
  };

  const handleDownloadAdvisoryPdf = async (advisory: CommunityAgroAdvisory) => {
    try {
      await fetch(`/api/extension/advisories/${advisory.id}/download`, { method: 'POST' });
      setAdvisories((prev) =>
        prev.map((a) => (a.id === advisory.id ? { ...a, downloadPdfCount: a.downloadPdfCount + 1 } : a))
      );
      showToast(`Generating printable extension bulletin for: ${advisory.advisoryCode}...`);
    } catch {
      showToast(`Bulletin downloaded for ${advisory.advisoryCode}`);
    }
  };

  const handleCreateFieldDay = async (siteId: string) => {
    if (!newFieldDayForm.title || !newFieldDayForm.date) {
      showToast('Field day title and date are required.');
      return;
    }

    try {
      const res = await fetch(`/api/extension/demo-sites/${siteId}/field-days`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFieldDayForm),
      });
      const data = await res.json();
      if (data.success && data.demoSite) {
        setDemoSites((prev) => prev.map((s) => (s.id === siteId ? data.demoSite : s)));
        showToast(`Farmer Field Day scheduled for ${data.demoSite.siteName}!`);
        setShowNewFieldDayModal(null);
      }
    } catch {
      showToast('Field day scheduled locally.');
      setShowNewFieldDayModal(null);
    }
  };

  const handleCreateMou = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMouForm.partnerOrganization || !newMouForm.agreementTitle || !newMouForm.focalPersonHUName) {
      showToast('Please provide partner name, agreement title, and HU focal person.');
      return;
    }

    const payload = {
      partnerOrganization: newMouForm.partnerOrganization,
      sector: newMouForm.sector,
      agreementTitle: newMouForm.agreementTitle,
      signingDate: newMouForm.signingDate,
      validUntil: newMouForm.validUntil,
      focalPersonHU: {
        name: newMouForm.focalPersonHUName,
        department: newMouForm.focalPersonHUDepartment,
        email: newMouForm.focalPersonHUEmail,
      },
      focalPersonPartner: {
        name: newMouForm.focalPersonPartnerName || 'Partner Liaison Director',
        title: newMouForm.focalPersonPartnerTitle,
        email: newMouForm.focalPersonPartnerEmail,
      },
      keyObjectives: [newMouForm.obj1, newMouForm.obj2, newMouForm.obj3].filter(Boolean),
      valueOrCommitmentETB: Number(newMouForm.valueETB),
      scopeSummary: newMouForm.scopeSummary || 'Institutional cooperation agreement.',
    };

    try {
      const res = await fetch('/api/industry/mous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.mou) {
        setMous((prev) => [data.mou, ...prev]);
        showToast(`Partnership MoU with ${data.mou.partnerOrganization} registered!`);
        setShowNewMouModal(false);
      }
    } catch {
      showToast('MoU registered locally.');
      setShowNewMouModal(false);
    }
  };

  // Filtered lists
  const filteredIpRecords = ipRecords.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(ipSearch.toLowerCase()) ||
      rec.ipNumber.toLowerCase().includes(ipSearch.toLowerCase()) ||
      rec.primaryInventor.name.toLowerCase().includes(ipSearch.toLowerCase());
    const matchesType = ipTypeFilter === 'All' || rec.ipType === ipTypeFilter;
    const matchesStatus = ipStatusFilter === 'All' || rec.status === ipStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredStartups = startups.filter((st) => {
    const matchesSearch =
      st.ventureName.toLowerCase().includes(startupSearch.toLowerCase()) ||
      st.tagline.toLowerCase().includes(startupSearch.toLowerCase()) ||
      st.founders.some((f) => f.name.toLowerCase().includes(startupSearch.toLowerCase()));
    const matchesSector = startupSectorFilter === 'All' || st.focusSector.includes(startupSectorFilter);
    return matchesSearch && matchesSector;
  });

  const filteredAdvisories = advisories.filter((adv) => {
    const matchesUrgency = advisoryUrgencyFilter === 'All' || adv.urgencyLevel === advisoryUrgencyFilter;
    const matchesZone = advisoryZoneFilter === 'All' || adv.agroEcologicalZone.includes(advisoryZoneFilter);
    return matchesUrgency && matchesZone;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400/30 animate-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Institutional Top Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-b border-emerald-800/40 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">hub</span>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400 font-bold mb-1">
                <span>Phase 9 • Haramaya University VPRCE</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>TTCIL Directorate</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Technology Transfer, Incubation &amp; Community Extension Hub
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                Integrated portal for Haramaya University’s Intellectual Property Registry, HU-BIIC Startup Incubator,
                Multilingual Regional Agro-Advisories, Farmer Demonstration Sites, and Strategic Industry Linkage Agreements.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onBackToHub && (
              <button
                onClick={onBackToHub}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Dashboards Hub
              </button>
            )}
            {onOpenFacultyGrants && (
              <button
                onClick={onOpenFacultyGrants}
                className="px-3.5 py-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 text-xs font-semibold border border-teal-700/50 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">monetization_on</span>
                Grants Desk
              </button>
            )}
            {onOpenRepository && (
              <button
                onClick={onOpenRepository}
                className="px-3.5 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/50 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">auto_stories</span>
                ETD Repository
              </button>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-emerald-900/40 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setActiveSubTab('ip_registry')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'ip_registry'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">verified</span>
            1. Intellectual Property &amp; Patent Registry ({ipRecords.length})
          </button>

          <button
            onClick={() => setActiveSubTab('incubation')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'incubation'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">rocket_launch</span>
            2. HU-BIIC Startup Incubation ({startups.length})
          </button>

          <button
            onClick={() => setActiveSubTab('agro_advisories')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'agro_advisories'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">campaign</span>
            3. Community Agro-Advisories ({advisories.length})
          </button>

          <button
            onClick={() => setActiveSubTab('demo_sites')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'demo_sites'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">nature_people</span>
            4. Demo Stations &amp; Outreach ({demoSites.length})
          </button>

          <button
            onClick={() => setActiveSubTab('industry_mous')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'industry_mous'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">handshake</span>
            5. Industry MoUs &amp; Linkages ({mous.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {/* ========================================================= */}
        {/* SUBTAB 1: INTELLECTUAL PROPERTY & PATENTS */}
        {/* ========================================================= */}
        {activeSubTab === 'ip_registry' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/70 p-5 rounded-2xl border border-slate-700/80">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">verified_user</span>
                  Haramaya University Intellectual Property &amp; Patent Portfolio
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Official registry of patented technologies, plant variety protections (PVP), utility models, and software copyrights registered with EIPA.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowNewIpModal(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  File Invention Disclosure
                </button>
              </div>
            </div>

            {/* Filter bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
              <div>
                <input
                  type="text"
                  placeholder="Search by IP code, title, or lead inventor..."
                  value={ipSearch}
                  onChange={(e) => setIpSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <select
                  value={ipTypeFilter}
                  onChange={(e) => setIpTypeFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All IP Categories</option>
                  <option value="Patent">Patent</option>
                  <option value="Plant Variety Protection (PVP)">Plant Variety Protection (PVP)</option>
                  <option value="Copyright & Software">Copyright &amp; Software</option>
                  <option value="Utility Model">Utility Model</option>
                  <option value="Trademark">Trademark</option>
                </select>
              </div>

              <div>
                <select
                  value={ipStatusFilter}
                  onChange={(e) => setIpStatusFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Filing Statuses</option>
                  <option value="Granted & Certified">Granted &amp; Certified</option>
                  <option value="Under Formal Examination">Under Formal Examination</option>
                  <option value="Invention Disclosure">Invention Disclosure</option>
                  <option value="Commercialized / Licensed">Commercialized / Licensed</option>
                </select>
              </div>
            </div>

            {/* IP Records Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredIpRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-5 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                          {rec.ipNumber}
                        </span>
                        <h3 className="text-base font-bold text-white mt-1.5 leading-snug">{rec.title}</h3>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full whitespace-nowrap border ${
                          rec.status === 'Granted & Certified'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : rec.status === 'Commercialized / Licensed'
                            ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{rec.abstractDescription}</p>

                    {/* TRL Progress */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Technology Readiness Level (TRL)</span>
                        <span className="font-bold text-emerald-400">TRL {rec.technologyReadinessLevel}/9</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all"
                          style={{ width: `${(rec.technologyReadinessLevel / 9) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Inventors & Details */}
                    <div className="bg-slate-900/80 rounded-xl p-3 text-xs space-y-1.5 border border-slate-800">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Lead Inventor:</span>
                        <span className="font-semibold text-white">{rec.primaryInventor.name} ({rec.primaryInventor.sharePercentage}%)</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Department:</span>
                        <span className="text-slate-300">{rec.primaryInventor.department}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">EIPA Ref:</span>
                        <span className="font-mono text-emerald-300">{rec.patentOfficeRef}</span>
                      </div>
                      {rec.commercialLicensee && (
                        <div className="flex items-center justify-between text-purple-300 pt-1 border-t border-slate-800">
                          <span>Licensed Partner:</span>
                          <span className="font-bold">{rec.commercialLicensee}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-700/60">
                    <span className="text-[11px] text-slate-400">Filed: {rec.filingDate}</span>
                    <button
                      onClick={() => setSelectedIpForCert(rec)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/60 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">badge</span>
                      View IP Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 2: HU-BIIC INCUBATION & STARTUPS */}
        {/* ========================================================= */}
        {activeSubTab === 'incubation' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/70 p-5 rounded-2xl border border-slate-700/80">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">rocket_launch</span>
                  HU Business Incubation &amp; Innovation Center (HU-BIIC)
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Venture acceleration hub fostering student, faculty, and alumni deep-tech agri-enterprises and spin-offs.
                </p>
              </div>

              <button
                onClick={() => setShowNewStartupModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">add_business</span>
                Admit Startup Venture
              </button>
            </div>

            {/* Startups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredStartups.map((st) => {
                const completedCount = st.keyMilestones.filter((m) => m.completed).length;
                const percentDone = Math.round((completedCount / st.keyMilestones.length) * 100);

                return (
                  <div
                    key={st.id}
                    className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-5 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                            {st.cohortBatch}
                          </span>
                          <h3 className="text-lg font-bold text-white mt-1">{st.ventureName}</h3>
                          <p className="text-xs text-emerald-300 italic">{st.tagline}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                          {st.stage}
                        </span>
                      </div>

                      {/* Financial Seed Progress */}
                      <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">HU Seed Grant:</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            ETB {st.seedFundingDisbursedETB.toLocaleString()} / {st.seedFundingAllocatedETB.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${(st.seedFundingDisbursedETB / st.seedFundingAllocatedETB) * 100}%` }}
                          ></div>
                        </div>
                        {st.revenueGeneratedETB > 0 && (
                          <div className="text-[11px] text-purple-300 flex justify-between pt-1">
                            <span>Pilot Revenue Generated:</span>
                            <span className="font-bold font-mono">ETB {st.revenueGeneratedETB.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Milestones Checklist */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
                          <span>Incubation Milestones</span>
                          <span className="text-emerald-400">{percentDone}% Completed</span>
                        </div>
                        <div className="space-y-1.5">
                          {st.keyMilestones.map((m, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between text-xs p-2 rounded-lg border ${
                                m.completed
                                  ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200'
                                  : 'bg-slate-900/50 border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-emerald-400">
                                  {m.completed ? 'check_circle' : 'radio_button_unchecked'}
                                </span>
                                <span>{m.title}</span>
                              </div>
                              <span className="text-[10px] font-mono">{m.targetDate}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Founders & Mentor */}
                      <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-700/60">
                        <div>
                          <strong className="text-slate-300">Founders: </strong>
                          {st.founders.map((f) => `${f.name} (${f.role})`).join(', ')}
                        </div>
                        <div>
                          <strong className="text-slate-300">Incubator Station: </strong>
                          {st.workspaceAssigned}
                        </div>
                        <div>
                          <strong className="text-slate-300">Assigned Mentor: </strong>
                          {st.mentor.name} — {st.mentor.designation}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 3: COMMUNITY AGRO-ADVISORIES & EXTENSION */}
        {/* ========================================================= */}
        {activeSubTab === 'agro_advisories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/70 p-5 rounded-2xl border border-slate-700/80">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">campaign</span>
                  Multilingual Regional Agro-Advisory &amp; Extension Network
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Farmer advisories, pest outbreak warnings, and agronomic recommendations translated into English, Afaan Oromoo, and Amharic.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Language Switcher */}
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setAdvisoryLang('en')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      advisoryLang === 'en' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setAdvisoryLang('or')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      advisoryLang === 'or' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Afaan Oromoo
                  </button>
                  <button
                    onClick={() => setAdvisoryLang('am')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      advisoryLang === 'am' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    አማርኛ
                  </button>
                </div>

                <button
                  onClick={() => setShowNewAdvisoryModal(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">add_alert</span>
                  Broadcast Advisory
                </button>
              </div>
            </div>

            {/* Advisory Cards List */}
            <div className="space-y-4">
              {filteredAdvisories.map((adv) => (
                <div
                  key={adv.id}
                  className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-5 hover:border-emerald-500/50 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800/60">
                        {adv.advisoryCode}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          adv.urgencyLevel === 'Urgent Disease Outbreak'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : adv.urgencyLevel === 'Climate Alert'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {adv.urgencyLevel}
                      </span>
                      <span className="text-xs text-slate-300">
                        Zone: <strong>{adv.agroEcologicalZone}</strong> • Season: <strong>{adv.season}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadAdvisoryPdf(adv)}
                        className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                        PDF ({adv.downloadPdfCount})
                      </button>
                      <button
                        onClick={() => setSelectedAdvisoryForReading(adv)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700 flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">menu_book</span>
                        Read Full Bulletin
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{adv.title[advisoryLang]}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{adv.bodyGuidance[advisoryLang]}</p>
                  </div>

                  {/* Key Action Recommendations */}
                  <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Key Field Recommendations for Farmers:
                    </span>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                      {adv.keyRecommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/60">
                    <div>
                      <span>Issued by: </span>
                      <strong className="text-slate-300">{adv.preparedByExpert.name}</strong> ({adv.preparedByExpert.department})
                    </div>
                    <div>
                      <span>Recommended Tech: </span>
                      <strong className="text-emerald-300">{adv.relatedVarietyOrTech}</strong>
                    </div>
                    <div>Date: {adv.publicationDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 4: DEMO SITES & FIELD STATIONS */}
        {/* ========================================================= */}
        {activeSubTab === 'demo_sites' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/70 p-5 rounded-2xl border border-slate-700/80">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">nature_people</span>
                  Field Demonstration Stations &amp; Outreach Centers
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Permanent field stations across Eastern Ethiopia for participatory varietal trials, seed multiplication, and farmer field schools.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {demoSites.map((site) => (
                <div
                  key={site.id}
                  className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-5 hover:border-emerald-500/50 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                        {site.agroEcology}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">{site.siteName}</h3>
                      <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-sm text-emerald-400">location_on</span>
                        {site.locationDistrict}, {site.zoneRegion}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                      {site.totalHectares} Hectares
                    </span>
                  </div>

                  {/* Focus crops pills */}
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1.5">Focus Commodities &amp; Technologies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {site.focusCommodities.map((c, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-slate-900 text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-700"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Active Trials count */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block">Active Trials:</span>
                      <span className="font-bold text-white text-sm">{site.activeDemonstrationsCount} On-Station Trials</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Farmers Reached (2026):</span>
                      <span className="font-bold text-emerald-400 text-sm">{site.farmersReachedAnnual.toLocaleString()}+</span>
                    </div>
                  </div>

                  {/* Upcoming Field Days */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-300">Upcoming Farmer Field Days</span>
                      <button
                        onClick={() => setShowNewFieldDayModal(site.id)}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                      >
                        + Schedule Day
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {site.upcomingFieldDays.map((fd, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800"
                        >
                          <span className="text-slate-200 font-medium">{fd.title}</span>
                          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                            {fd.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700/60">
                    Lead Station Officer: <strong className="text-slate-200">{site.leadOfficer.name}</strong> ({site.leadOfficer.phone})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 5: INDUSTRY MOUS & STRATEGIC LINKAGES */}
        {/* ========================================================= */}
        {activeSubTab === 'industry_mous' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/70 p-5 rounded-2xl border border-slate-700/80">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">handshake</span>
                  Industry &amp; Institutional Strategic Partnerships (MoUs)
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Official bilateral agreements with agro-industries, state enterprises, regional agricultural bureaus, and international partners.
                </p>
              </div>

              <button
                onClick={() => setShowNewMouModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">add_link</span>
                Record Partnership MoU
              </button>
            </div>

            <div className="space-y-4">
              {mous.map((mou) => (
                <div
                  key={mou.id}
                  className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-5 hover:border-emerald-500/50 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                          {mou.sector}
                        </span>
                        <span className="text-xs text-slate-400">
                          Signed: {mou.signingDate} • Valid Until: <strong className="text-slate-200">{mou.validUntil}</strong>
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{mou.agreementTitle}</h3>
                      <p className="text-sm font-semibold text-emerald-300">{mou.partnerOrganization}</p>
                    </div>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap self-start sm:self-center">
                      {mou.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{mou.scopeSummary}</p>

                  {/* Objectives list */}
                  <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Strategic Joint Objectives:
                    </span>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                      {mou.keyObjectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-700/60 text-slate-300">
                    <div>
                      <span className="text-slate-400 block">HU Focal Person:</span>
                      <strong>{mou.focalPersonHU.name}</strong> ({mou.focalPersonHU.department})
                    </div>
                    <div>
                      <span className="text-slate-400 block">Partner Focal Person:</span>
                      <strong>{mou.focalPersonPartner.name}</strong> ({mou.focalPersonPartner.title})
                    </div>
                    <div>
                      <span className="text-slate-400 block">Committed Research Budget:</span>
                      <strong className="text-emerald-400 font-mono">
                        ETB {mou.valueOrCommitmentETB.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: IP CERTIFICATE & QR VERIFICATION */}
      {/* ========================================================= */}
      {selectedIpForCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedIpForCert(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="text-center space-y-2 border-b border-slate-800 pb-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 mb-2">
                <span className="material-symbols-outlined text-4xl">verified</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                HARAMAYA UNIVERSITY INTELLECTUAL PROPERTY CERTIFICATE
              </h2>
              <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                TTCIL Directorate &amp; Ethiopian Intellectual Property Authority (EIPA)
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Official IP Number:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{selectedIpForCert.ipNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Technology Title:</span>
                <span className="font-bold text-white max-w-xs text-right">{selectedIpForCert.title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">IP Category:</span>
                <span className="text-emerald-300 font-semibold">{selectedIpForCert.ipType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Lead Registered Inventor:</span>
                <span className="text-white font-semibold">{selectedIpForCert.primaryInventor.name} ({selectedIpForCert.primaryInventor.college})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">EIPA National Filing Code:</span>
                <span className="font-mono text-emerald-300">{selectedIpForCert.patentOfficeRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Digital Verification Hash:</span>
                <span className="font-mono text-slate-400">{selectedIpForCert.certificateVerificationCode}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">Validated under Haramaya University IP Policy (2026/2027)</span>
              <button
                onClick={() => {
                  showToast('IP Certificate downloaded.');
                  setSelectedIpForCert(null);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">print</span>
                Download Official Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: READ FULL AGRO-ADVISORY BULLETIN */}
      {/* ========================================================= */}
      {selectedAdvisoryForReading && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedAdvisoryForReading(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded">
                {selectedAdvisoryForReading.advisoryCode}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                {selectedAdvisoryForReading.title[advisoryLang]}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Target: {selectedAdvisoryForReading.targetCropOrLivestock} • Zone: {selectedAdvisoryForReading.agroEcologicalZone} • Season: {selectedAdvisoryForReading.season}
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-200 leading-relaxed">
              <p>{selectedAdvisoryForReading.bodyGuidance[advisoryLang]}</p>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Mandatory Field Action Steps:
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                  {selectedAdvisoryForReading.keyRecommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Authorized by <strong>{selectedAdvisoryForReading.preparedByExpert.name}</strong>
              </div>
              <button
                onClick={() => {
                  handleDownloadAdvisoryPdf(selectedAdvisoryForReading);
                  setSelectedAdvisoryForReading(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">download</span>
                Download Printable Handout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: FILE INVENTION DISCLOSURE */}
      {/* ========================================================= */}
      {showNewIpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button onClick={() => setShowNewIpModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">add_circle</span>
              Register New Invention Disclosure
            </h3>

            <form onSubmit={handleCreateIp} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Invention / Technology Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar-Powered Smart Sorghum Thresher & Desiccator"
                  value={newIpForm.title}
                  onChange={(e) => setNewIpForm({ ...newIpForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">IP Category</label>
                  <select
                    value={newIpForm.ipType}
                    onChange={(e) => setNewIpForm({ ...newIpForm, ipType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  >
                    <option value="Patent">Patent</option>
                    <option value="Plant Variety Protection (PVP)">Plant Variety Protection (PVP)</option>
                    <option value="Copyright & Software">Copyright &amp; Software</option>
                    <option value="Utility Model">Utility Model</option>
                    <option value="Trademark">Trademark</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Current TRL Level (1-9)</label>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={newIpForm.trl}
                    onChange={(e) => setNewIpForm({ ...newIpForm, trl: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Primary Lead Inventor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Kassahun Mengistu"
                    value={newIpForm.primaryName}
                    onChange={(e) => setNewIpForm({ ...newIpForm, primaryName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Department / School</label>
                  <input
                    type="text"
                    placeholder="e.g. HiT Mechanical Engineering"
                    value={newIpForm.primaryDept}
                    onChange={(e) => setNewIpForm({ ...newIpForm, primaryDept: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Co-Inventors (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Eng. Yohannes Tadesse, Aster Kebede"
                  value={newIpForm.coInventors}
                  onChange={(e) => setNewIpForm({ ...newIpForm, coInventors: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Technical Abstract &amp; Novelty Claims</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the technological innovation, working mechanism, and commercial applications..."
                  value={newIpForm.abstractDescription}
                  onChange={(e) => setNewIpForm({ ...newIpForm, abstractDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewIpModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Submit Invention Disclosure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADMIT STARTUP TO HU-BIIC */}
      {/* ========================================================= */}
      {showNewStartupModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button onClick={() => setShowNewStartupModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">rocket_launch</span>
              Admit Startup Venture to HU-BIIC
            </h3>

            <form onSubmit={handleCreateStartup} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Venture Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HararBio Tech Solutions"
                  value={newStartupForm.ventureName}
                  onChange={(e) => setNewStartupForm({ ...newStartupForm, ventureName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Tagline / Mission</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-driven precision solar irrigation for Eastern Ethiopian smallholders"
                  value={newStartupForm.tagline}
                  onChange={(e) => setNewStartupForm({ ...newStartupForm, tagline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Lead Founder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bilisuma Abdi"
                    value={newStartupForm.founderName}
                    onChange={(e) => setNewStartupForm({ ...newStartupForm, founderName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Seed Grant Allocation (ETB)</label>
                  <input
                    type="number"
                    value={newStartupForm.seedFunding}
                    onChange={(e) => setNewStartupForm({ ...newStartupForm, seedFunding: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewStartupModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Admit to Incubator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: BROADCAST AGRO-ADVISORY */}
      {/* ========================================================= */}
      {showNewAdvisoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button onClick={() => setShowNewAdvisoryModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">campaign</span>
              Broadcast Community Agro-Advisory Bulletin
            </h3>

            <form onSubmit={handleCreateAdvisory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Title (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent Fall Armyworm Scouting & Biological Control Alert"
                  value={newAdvForm.titleEn}
                  onChange={(e) => setNewAdvForm({ ...newAdvForm, titleEn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Title (Afaan Oromoo)</label>
                  <input
                    type="text"
                    placeholder="Mata Duree Afaan Oromootiin"
                    value={newAdvForm.titleOr}
                    onChange={(e) => setNewAdvForm({ ...newAdvForm, titleOr: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Title (Amharic)</label>
                  <input
                    type="text"
                    placeholder="የአማርኛ ርዕስ"
                    value={newAdvForm.titleAm}
                    onChange={(e) => setNewAdvForm({ ...newAdvForm, titleAm: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Target Commodity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maize, Sorghum"
                    value={newAdvForm.targetCrop}
                    onChange={(e) => setNewAdvForm({ ...newAdvForm, targetCrop: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Urgency Level</label>
                  <select
                    value={newAdvForm.urgency}
                    onChange={(e) => setNewAdvForm({ ...newAdvForm, urgency: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  >
                    <option value="Seasonal Recommendation">Seasonal Recommendation</option>
                    <option value="Urgent Disease Outbreak">Urgent Disease Outbreak</option>
                    <option value="Climate Alert">Climate Alert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Agro-Ecological Zone</label>
                  <input
                    type="text"
                    value={newAdvForm.zone}
                    onChange={(e) => setNewAdvForm({ ...newAdvForm, zone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Advisory Body Guidance (English)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise field guidance and agronomic interventions..."
                  value={newAdvForm.bodyEn}
                  onChange={(e) => setNewAdvForm({ ...newAdvForm, bodyEn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewAdvisoryModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Broadcast to Extension Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SCHEDULE FIELD DAY */}
      {/* ========================================================= */}
      {showNewFieldDayModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button onClick={() => setShowNewFieldDayModal(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">calendar_month</span>
              Schedule Farmer Field Day
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Field Day Topic / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Yielding Drought-Tolerant Sorghum Demonstration"
                  value={newFieldDayForm.title}
                  onChange={(e) => setNewFieldDayForm({ ...newFieldDayForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Event Date</label>
                  <input
                    type="date"
                    value={newFieldDayForm.date}
                    onChange={(e) => setNewFieldDayForm({ ...newFieldDayForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Expected Farmers</label>
                  <input
                    type="number"
                    value={newFieldDayForm.expectedParticipants}
                    onChange={(e) => setNewFieldDayForm({ ...newFieldDayForm, expectedParticipants: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewFieldDayModal(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreateFieldDay(showNewFieldDayModal)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Schedule Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: RECORD STRATEGIC INDUSTRY MOU */}
      {/* ========================================================= */}
      {showNewMouModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button onClick={() => setShowNewMouModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">handshake</span>
              Record Institutional Partnership MoU
            </h3>

            <form onSubmit={handleCreateMou} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Partner Organization / Industry</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ethiopian Sugar Industry Group (ESIG)"
                  value={newMouForm.partnerOrganization}
                  onChange={(e) => setNewMouForm({ ...newMouForm, partnerOrganization: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Agreement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Joint Sugarcane Varietal Breeding & Soil Salinity Management MoU"
                  value={newMouForm.agreementTitle}
                  onChange={(e) => setNewMouForm({ ...newMouForm, agreementTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">HU Lead Focal Person</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Mengistu Ketema"
                    value={newMouForm.focalPersonHUName}
                    onChange={(e) => setNewMouForm({ ...newMouForm, focalPersonHUName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Committed Budget (ETB)</label>
                  <input
                    type="number"
                    value={newMouForm.valueETB}
                    onChange={(e) => setNewMouForm({ ...newMouForm, valueETB: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Scope of Bilateral Cooperation</label>
                <textarea
                  rows={2}
                  placeholder="Summarize key joint projects and reciprocal responsibilities..."
                  value={newMouForm.scopeSummary}
                  onChange={(e) => setNewMouForm({ ...newMouForm, scopeSummary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewMouModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Register Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
