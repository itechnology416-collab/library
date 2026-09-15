import React, { useState, useEffect, useMemo } from 'react';
import {
  IrbProtocol,
  IrbReviewCommittee,
  ResearchImpactSdgMetric,
  ResearchRankingBenchmark,
  ConferenceCfpItem,
  ConferenceSubmission,
  IrbCommitteeType,
  IrbProtocolCategory,
  IrbRiskLevel,
  IrbReviewType,
} from '../types';
import {
  INITIAL_IRB_PROTOCOLS,
  INITIAL_IRB_COMMITTEES,
  INITIAL_SDG_METRICS,
  INITIAL_RANKING_BENCHMARKS,
  INITIAL_CONFERENCE_CFP,
} from '../data/initialData';
import { useAuth } from '../context/AuthContext';

interface ResearchEthicsIntelligencePortalProps {
  onBackToHub?: () => void;
  onOpenFacultyGrants?: () => void;
  onOpenRepository?: () => void;
}

export const ResearchEthicsIntelligencePortal: React.FC<ResearchEthicsIntelligencePortalProps> = ({
  onBackToHub,
  onOpenFacultyGrants,
  onOpenRepository,
}) => {
  const { user } = useAuth();

  // Core state
  const [protocols, setProtocols] = useState<IrbProtocol[]>(INITIAL_IRB_PROTOCOLS);
  const [committees, setCommittees] = useState<IrbReviewCommittee[]>(INITIAL_IRB_COMMITTEES);
  const [sdgMetrics, setSdgMetrics] = useState<ResearchImpactSdgMetric[]>(INITIAL_SDG_METRICS);
  const [benchmarks, setBenchmarks] = useState<ResearchRankingBenchmark[]>(INITIAL_RANKING_BENCHMARKS);
  const [conferences, setConferences] = useState<ConferenceCfpItem[]>(INITIAL_CONFERENCE_CFP);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'protocols' | 'submission' | 'sdg_matrix' | 'conferences' | 'verify'>('protocols');

  // Filter state for protocols
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommittee, setSelectedCommittee] = useState<string>('All Committees');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses');
  const [selectedRisk, setSelectedRisk] = useState<string>('All Risk Levels');

  // Modals state
  const [selectedProtocol, setSelectedProtocol] = useState<IrbProtocol | null>(null);
  const [certificateModalProtocol, setCertificateModalProtocol] = useState<IrbProtocol | null>(null);
  const [reviewActionProtocol, setReviewActionProtocol] = useState<IrbProtocol | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'Approved' | 'Conditional Approval' | 'Revisions Requested'>('Approved');
  const [reviewComments, setReviewComments] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.name || 'Prof. Yadeta Dessie (IRB Chair)');

  // Selected SDG in Matrix
  const [selectedSdgId, setSelectedSdgId] = useState<number>(2);

  // Abstract submission modal for conferences
  const [submittingCfp, setSubmittingCfp] = useState<ConferenceCfpItem | null>(null);
  const [abstractForm, setAbstractForm] = useState({
    title: '',
    authorName: user?.name || '',
    authorEmail: user?.email || '',
    authorInstitution: user?.affiliation || 'Haramaya University',
    coAuthors: '',
    trackCode: '',
    abstract: '',
    keywords: '',
  });

  // Verification Desk lookup
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ verified: boolean; protocol?: IrbProtocol; message?: string } | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Submission Form State
  const [submissionForm, setSubmissionForm] = useState({
    title: '',
    piName: user?.name || '',
    piEmail: user?.email || '',
    piPhone: user?.phone || '+251 ',
    college: 'College of Health & Medical Sciences',
    department: 'Department of Epidemiology',
    staffOrStudentId: user?.staffOrStudentId || '',
    role: 'Faculty PI' as const,
    coInvestigators: '',
    committee: 'CHMS Health & Biomedical Sciences IRB' as IrbCommitteeType,
    category: 'Human Clinical & Epidemiological Trials' as IrbProtocolCategory,
    riskLevel: 'Moderate Risk' as IrbRiskLevel,
    reviewType: 'Full Board Review' as IrbReviewType,
    summaryAbstract: '',
    targetPopulation: '',
    sampleSize: 250,
    studySites: 'Kersa HDSS, Hiwot Fana Hospital',
    fundingGrantRef: '',
    informedConsentMethod: 'Written Consent (Afan Oromo / Amharic / Somali)' as const,
    vulnerableGroupsIncluded: false,
    vulnerableGroupsDetails: '',
    dataConfidentialityProtocol: 'De-identified encrypted participant ID keys stored on isolated encrypted offline drive compliant with FMoH standards.',
    biologicalSpecimenDisposal: '',
    animalWelfareHumaneEndpoints: '',
  });

  // Load from backend on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [resProtocols, resCommittees, resSdg, resBench, resCfp] = await Promise.all([
          fetch('/api/irb/protocols'),
          fetch('/api/irb/committees'),
          fetch('/api/research-intelligence/sdg-matrix'),
          fetch('/api/research-intelligence/rankings'),
          fetch('/api/conferences/cfp'),
        ]);

        if (resProtocols.ok) {
          const data = await resProtocols.json();
          if (data.protocols) setProtocols(data.protocols);
        }
        if (resCommittees.ok) {
          const data = await resCommittees.json();
          if (data.committees) setCommittees(data.committees);
        }
        if (resSdg.ok) {
          const data = await resSdg.json();
          if (data.sdgs) setSdgMetrics(data.sdgs);
        }
        if (resBench.ok) {
          const data = await resBench.json();
          if (data.benchmarks) setBenchmarks(data.benchmarks);
        }
        if (resCfp.ok) {
          const data = await resCfp.json();
          if (data.cfps) setConferences(data.cfps);
        }
      } catch (err) {
        console.error('Backend fetch failed, using local initial data', err);
      }
    }
    loadData();
  }, []);

  // Filtered protocols
  const filteredProtocols = useMemo(() => {
    return protocols.filter((p) => {
      if (selectedCommittee !== 'All Committees' && p.committee !== selectedCommittee) return false;
      if (selectedStatus !== 'All Statuses' && p.status !== selectedStatus) return false;
      if (selectedRisk !== 'All Risk Levels' && p.riskLevel !== selectedRisk) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchNum = p.protocolNumber.toLowerCase().includes(q);
        const matchPi = p.principalInvestigator.name.toLowerCase().includes(q);
        const matchDept = p.principalInvestigator.department.toLowerCase().includes(q);
        const matchSites = p.studySites.some((s) => s.toLowerCase().includes(q));
        return matchTitle || matchNum || matchPi || matchDept || matchSites;
      }
      return true;
    });
  }, [protocols, selectedCommittee, selectedStatus, selectedRisk, searchQuery]);

  // Statistics
  const totalApproved = useMemo(() => protocols.filter((p) => p.status === 'Approved').length, [protocols]);
  const totalUnderReview = useMemo(() => protocols.filter((p) => p.status === 'Under Scientific & Ethical Review').length, [protocols]);
  const totalConditional = useMemo(() => protocols.filter((p) => p.status === 'Conditional Approval').length, [protocols]);

  // Submit Protocol Handler
  const handleProtocolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionForm.title.trim() || !submissionForm.piName.trim()) {
      showToast('Please specify study title and Principal Investigator name.', 'error');
      return;
    }

    const payload = {
      title: submissionForm.title,
      principalInvestigator: {
        name: submissionForm.piName,
        email: submissionForm.piEmail,
        phone: submissionForm.piPhone,
        college: submissionForm.college,
        department: submissionForm.department,
        staffOrStudentId: submissionForm.staffOrStudentId,
        role: submissionForm.role,
      },
      coInvestigators: submissionForm.coInvestigators
        ? submissionForm.coInvestigators.split(',').map((s) => ({ name: s.trim(), affiliation: 'Haramaya University' }))
        : [],
      committee: submissionForm.committee,
      category: submissionForm.category,
      riskLevel: submissionForm.riskLevel,
      reviewType: submissionForm.reviewType,
      summaryAbstract: submissionForm.summaryAbstract || 'Ethical protocol application for field research and data collection.',
      targetPopulation: submissionForm.targetPopulation || 'Study cohort in Eastern Ethiopia',
      sampleSize: Number(submissionForm.sampleSize) || 100,
      studySites: submissionForm.studySites.split(',').map((s) => s.trim()).filter(Boolean),
      fundingGrantRef: submissionForm.fundingGrantRef || undefined,
      ethicalConsiderations: {
        informedConsentMethod: submissionForm.informedConsentMethod,
        vulnerableGroupsIncluded: submissionForm.vulnerableGroupsIncluded,
        vulnerableGroupsDetails: submissionForm.vulnerableGroupsDetails || undefined,
        dataConfidentialityProtocol: submissionForm.dataConfidentialityProtocol,
        biologicalSpecimenDisposal: submissionForm.biologicalSpecimenDisposal || undefined,
        animalWelfareHumaneEndpoints: submissionForm.animalWelfareHumaneEndpoints || undefined,
      },
    };

    try {
      const res = await fetch('/api/irb/protocols', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setProtocols((prev) => [data.protocol, ...prev]);
        showToast(`Protocol successfully filed as ${data.protocol.protocolNumber}!`, 'success');
        setActiveTab('protocols');
        setSelectedProtocol(data.protocol);
      } else {
        // Fallback local creation
        const currentYear = new Date().getFullYear();
        const randNum = Math.floor(100 + Math.random() * 900);
        const fallbackProtocol: IrbProtocol = {
          id: `irb-${Date.now()}`,
          protocolNumber: `HU-IRB-${currentYear}-${randNum}`,
          title: submissionForm.title,
          principalInvestigator: payload.principalInvestigator,
          coInvestigators: payload.coInvestigators,
          committee: submissionForm.committee,
          category: submissionForm.category,
          riskLevel: submissionForm.riskLevel,
          reviewType: submissionForm.reviewType,
          status: 'Under Scientific & Ethical Review',
          submissionDate: new Date().toISOString().split('T')[0],
          meetingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          summaryAbstract: payload.summaryAbstract,
          targetPopulation: payload.targetPopulation,
          sampleSize: payload.sampleSize,
          studySites: payload.studySites,
          fundingGrantRef: payload.fundingGrantRef,
          certificateVerificationHash: `hu_irb_${Date.now().toString(36)}`,
          ethicalConsiderations: payload.ethicalConsiderations,
          reviewers: [
            { name: 'Assigned Committee Reviewer', decision: 'Pending', comments: 'Under scientific evaluation' },
          ],
          attachments: [{ name: 'Submitted_Proposal_Dossier.pdf', size: '2.4 MB', type: 'Protocol Document' }],
        };
        setProtocols((prev) => [fallbackProtocol, ...prev]);
        showToast(`Protocol registered locally as ${fallbackProtocol.protocolNumber}!`, 'success');
        setActiveTab('protocols');
        setSelectedProtocol(fallbackProtocol);
      }
    } catch (err) {
      console.error(err);
      showToast('Error filing protocol. Saved locally.', 'info');
    }
  };

  // Committee Review Action Handler
  const handleReviewAction = async () => {
    if (!reviewActionProtocol) return;

    try {
      const res = await fetch(`/api/irb/protocols/${reviewActionProtocol.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: reviewDecision,
          comments: reviewComments,
          reviewerName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProtocols((prev) => prev.map((p) => (p.id === data.protocol.id ? data.protocol : p)));
        showToast(`Protocol ${data.protocol.protocolNumber} updated to ${reviewDecision}`, 'success');
        if (selectedProtocol?.id === data.protocol.id) {
          setSelectedProtocol(data.protocol);
        }
      } else {
        // Local update
        const updated = {
          ...reviewActionProtocol,
          status: reviewDecision,
          approvalDate: reviewDecision === 'Approved' ? new Date().toISOString().split('T')[0] : reviewActionProtocol.approvalDate,
          expirationDate: reviewDecision === 'Approved' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : reviewActionProtocol.expirationDate,
          clearanceCertificateNumber: reviewDecision === 'Approved' ? `HU-IRB-CERT-${reviewActionProtocol.protocolNumber.replace('HU-IRB-', '')}` : undefined,
        };
        setProtocols((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showToast(`Protocol status locally updated to ${reviewDecision}`, 'success');
        if (selectedProtocol?.id === updated.id) {
          setSelectedProtocol(updated);
        }
      }
      setReviewActionProtocol(null);
      setReviewComments('');
    } catch (err) {
      console.error(err);
      showToast('Error updating status', 'error');
    }
  };

  // Conference Abstract Submit
  const handleAbstractSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingCfp || !abstractForm.title.trim() || !abstractForm.abstract.trim()) {
      showToast('Please provide abstract title and content.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/conferences/cfp/${submittingCfp.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: abstractForm.title,
          correspondingAuthor: {
            name: abstractForm.authorName,
            email: abstractForm.authorEmail,
            institution: abstractForm.authorInstitution,
          },
          coAuthors: abstractForm.coAuthors.split(',').map((s) => s.trim()).filter(Boolean),
          trackCode: abstractForm.trackCode || submittingCfp.thematicTracks[0]?.trackCode || 'TR-01',
          abstract: abstractForm.abstract,
          keywords: abstractForm.keywords.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        showToast(`Abstract successfully submitted to ${submittingCfp.edition}!`, 'success');
        setConferences((prev) =>
          prev.map((c) => (c.id === submittingCfp.id ? { ...c, submissionsCount: c.submissionsCount + 1 } : c))
        );
      } else {
        showToast(`Abstract submitted locally to ${submittingCfp.edition}!`, 'success');
      }
    } catch (err) {
      showToast('Submission recorded locally.', 'info');
    }

    setSubmittingCfp(null);
    setAbstractForm({
      title: '',
      authorName: user?.name || '',
      authorEmail: user?.email || '',
      authorInstitution: user?.affiliation || 'Haramaya University',
      coAuthors: '',
      trackCode: '',
      abstract: '',
      keywords: '',
    });
  };

  // Verification Lookup
  const handleVerifyLookup = () => {
    if (!verifyInput.trim()) return;
    const query = verifyInput.trim().toLowerCase();
    const found = protocols.find(
      (p) =>
        p.protocolNumber.toLowerCase() === query ||
        p.clearanceCertificateNumber?.toLowerCase() === query ||
        p.certificateVerificationHash?.toLowerCase() === query ||
        p.title.toLowerCase().includes(query)
    );

    if (found) {
      setVerifyResult({
        verified: found.status === 'Approved',
        protocol: found,
        message:
          found.status === 'Approved'
            ? `Verified Authentic: Institutional Review Board Clearance Certificate is ACTIVE and in good standing.`
            : `Protocol identified (${found.protocolNumber}), but current status is '${found.status}' — not a fully approved clearance certificate.`,
      });
    } else {
      setVerifyResult({
        verified: false,
        message: `No matching Institutional Review Board protocol or certificate found for "${verifyInput}". Please verify the reference format (e.g. HU-IRB-2026-0314).`,
      });
    }
  };

  const activeSdg = useMemo(() => sdgMetrics.find((s) => s.sdgId === selectedSdgId) || sdgMetrics[0], [sdgMetrics, selectedSdgId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 pt-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom duration-200">
          <span className="material-icons text-emerald-400 text-base">
            {toast.type === 'success' ? 'check_circle' : toast.type === 'info' ? 'info' : 'warning'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            {onBackToHub && (
              <button
                onClick={onBackToHub}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                title="Back to Dashboards Hub"
              >
                <span className="material-icons text-lg">arrow_back</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  Phase 8 • Institutional Research Intelligence
                </span>
                <span className="text-xs text-slate-500 font-medium">Haramaya University Research Affairs</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-1">
                Institutional Review Board (IRB) & Research Intelligence Suite
              </h1>
            </div>
          </div>

          {/* Quick Cross-Nav Buttons */}
          <div className="flex items-center gap-2">
            {onOpenFacultyGrants && (
              <button
                onClick={onOpenFacultyGrants}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                <span className="material-icons text-sm text-teal-600">account_balance_wallet</span>
                Faculty Grants
              </button>
            )}
            {onOpenRepository && (
              <button
                onClick={onOpenRepository}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                <span className="material-icons text-sm text-emerald-600">auto_stories</span>
                E-Repository
              </button>
            )}
            <button
              onClick={() => setActiveTab('submission')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-600 shadow-xs"
            >
              <span className="material-icons text-sm">add_circle</span>
              New Protocol Submission
            </button>
          </div>
        </div>

        {/* Statistical Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Active IRB Protocols</span>
              <span className="material-icons text-base text-blue-600">gavel</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-serif text-slate-900">{protocols.length}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">{totalUnderReview} under committee review</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Approved Clearances</span>
              <span className="material-icons text-base text-emerald-600">verified</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-serif text-emerald-700">{totalApproved}</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{totalConditional} conditional approval</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Ethics Committees</span>
              <span className="material-icons text-base text-purple-600">groups</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-serif text-slate-900">{committees.length}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">CHMS, Agri, Vet, Social, IBC</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>UN SDGs Tracked</span>
              <span className="material-icons text-base text-amber-600">public</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-serif text-slate-900">{sdgMetrics.length} Priorities</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Zero Hunger, Climate, Health</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs col-span-2 sm:col-span-4 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Upcoming Symposia</span>
              <span className="material-icons text-base text-indigo-600">event_note</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-serif text-slate-900">{conferences.length} CFPs</div>
            <p className="text-[11px] text-slate-500 mt-0.5">43rd ARR & Climate-SABC</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-0">
          <button
            onClick={() => setActiveTab('protocols')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap border-b-2 ${
              activeTab === 'protocols'
                ? 'border-blue-700 text-blue-700 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-icons text-base">fact_check</span>
            Ethical Protocol Registry ({protocols.length})
          </button>

          <button
            onClick={() => setActiveTab('submission')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap border-b-2 ${
              activeTab === 'submission'
                ? 'border-blue-700 text-blue-700 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-icons text-base">post_add</span>
            Protocol Submission Workbench
          </button>

          <button
            onClick={() => setActiveTab('sdg_matrix')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap border-b-2 ${
              activeTab === 'sdg_matrix'
                ? 'border-blue-700 text-blue-700 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-icons text-base">insights</span>
            UN SDG Impact & Research Rankings
          </button>

          <button
            onClick={() => setActiveTab('conferences')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap border-b-2 ${
              activeTab === 'conferences'
                ? 'border-blue-700 text-blue-700 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-icons text-base">campaign</span>
            Annual Symposia & CFP Desk ({conferences.length})
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap border-b-2 ${
              activeTab === 'verify'
                ? 'border-blue-700 text-blue-700 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-icons text-base">verified_user</span>
            Certificate Verification Desk
          </button>
        </div>

        {/* TAB 1: PROTOCOL REGISTRY */}
        {activeTab === 'protocols' && (
          <div className="space-y-4">
            {/* Search & Filters */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[260px] relative">
                <span className="material-icons absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Search protocol number, PI name, study title, site (e.g., Kersa, Babile)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedCommittee}
                  onChange={(e) => setSelectedCommittee(e.target.value)}
                  className="text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All Committees">All Ethics Committees</option>
                  {committees.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.shortCode} - {c.name.split(' ')[0]}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All Statuses">All Review Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Conditional Approval">Conditional Approval</option>
                  <option value="Under Scientific & Ethical Review">Under Review</option>
                  <option value="Revisions Requested">Revisions Requested</option>
                </select>

                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All Risk Levels">All Risk Classifications</option>
                  <option value="Minimal Risk">Minimal Risk</option>
                  <option value="Low Risk">Low Risk</option>
                  <option value="Moderate Risk">Moderate Risk</option>
                  <option value="High Risk">High Risk</option>
                </select>
              </div>
            </div>

            {/* Protocol List */}
            <div className="space-y-3">
              {filteredProtocols.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
                  <span className="material-icons text-4xl text-slate-300">search_off</span>
                  <p className="mt-2 text-sm font-medium">No ethical protocols match your active filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCommittee('All Committees');
                      setSelectedStatus('All Statuses');
                      setSelectedRisk('All Risk Levels');
                    }}
                    className="mt-3 text-xs text-blue-600 underline font-semibold"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                filteredProtocols.map((protocol) => {
                  const isApproved = protocol.status === 'Approved';
                  const isConditional = protocol.status === 'Conditional Approval';

                  return (
                    <div
                      key={protocol.id}
                      className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        {/* Tags bar */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                            {protocol.protocolNumber}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                              isApproved
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isConditional
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {protocol.status}
                          </span>
                          <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {protocol.committee.split(' ')[0]} • {protocol.category}
                          </span>
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                              protocol.riskLevel === 'Minimal Risk'
                                ? 'bg-teal-50 text-teal-700'
                                : protocol.riskLevel === 'Moderate Risk'
                                ? 'bg-orange-50 text-orange-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {protocol.riskLevel} ({protocol.reviewType})
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold font-serif text-slate-900 leading-snug">
                          {protocol.title}
                        </h3>

                        {/* Investigator & Meta Row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                          <span className="font-semibold text-slate-800">
                            PI: {protocol.principalInvestigator.name} ({protocol.principalInvestigator.role})
                          </span>
                          <span>{protocol.principalInvestigator.department}</span>
                          <span>•</span>
                          <span>Target: {protocol.sampleSize} subjects / plots</span>
                          <span>•</span>
                          <span>Sites: {protocol.studySites.join(', ')}</span>
                          {protocol.fundingGrantRef && (
                            <span className="text-teal-700 font-medium bg-teal-50 px-1.5 py-0.5 rounded">
                              Grant Linked: {protocol.fundingGrantRef}
                            </span>
                          )}
                        </div>

                        {/* Consent & Ethical snippet */}
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {protocol.summaryAbstract}
                        </p>
                      </div>

                      {/* Right Action Column */}
                      <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                        {isApproved && (
                          <button
                            onClick={() => setCertificateModalProtocol(protocol)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-semibold shadow-xs"
                          >
                            <span className="material-icons text-sm">verified</span>
                            View Clearance Certificate
                          </button>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedProtocol(protocol)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                          >
                            Full Protocol Details
                          </button>
                          <button
                            onClick={() => {
                              setReviewActionProtocol(protocol);
                              setReviewDecision(
                                protocol.status === 'Approved' ? 'Approved' : 'Approved'
                              );
                            }}
                            className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold"
                            title="Board Review Actions"
                          >
                            Review Action
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROTOCOL SUBMISSION WORKBENCH */}
        {activeTab === 'submission' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Official Researcher Workbench
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">
                Institutional Review Board (IRB) Protocol Submission Dossier
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Mandatory for all faculty research, postgraduate MSc/PhD theses, and visiting scholar initiatives involving human participants, animal models, clinical samples, genetic engineering, or agricultural field trials in Eastern Ethiopia.
              </p>
            </div>

            <form onSubmit={handleProtocolSubmit} className="space-y-6">
              {/* Section 1: Study Identification */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
                  Protocol Title & Ethical Committee Routing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Full Scientific Protocol Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Clinical Efficacy and Safety of Artemether-Lumefantrine in Pediatric Cohorts..."
                      value={submissionForm.title}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, title: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Designated Ethics Review Committee *</label>
                    <select
                      value={submissionForm.committee}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, committee: e.target.value as IrbCommitteeType })}
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white"
                    >
                      {committees.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Protocol Category *</label>
                    <select
                      value={submissionForm.category}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, category: e.target.value as IrbProtocolCategory })}
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Human Clinical & Epidemiological Trials">Human Clinical & Epidemiological Trials</option>
                      <option value="Socio-Economic Household Survey">Socio-Economic Household Survey</option>
                      <option value="Crop & Agricultural Field Trial">Crop & Agricultural Field Trial</option>
                      <option value="Veterinary & Animal Welfare Protocol">Veterinary & Animal Welfare Protocol</option>
                      <option value="Genomic & Biosafety Research">Genomic & Biosafety Research</option>
                      <option value="Artificial Intelligence & Data Ethics">Artificial Intelligence & Data Ethics</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Anticipated Risk Classification</label>
                    <select
                      value={submissionForm.riskLevel}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, riskLevel: e.target.value as IrbRiskLevel })}
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Minimal Risk">Minimal Risk (Non-invasive, anonymous questionnaires)</option>
                      <option value="Low Risk">Low Risk (Standard blood draws, observational field sampling)</option>
                      <option value="Moderate Risk">Moderate Risk (Pediatric cohorts, clinical trials, GMO confined trials)</option>
                      <option value="High Risk">High Risk (Invasive surgery, vulnerable refugee populations, high biocontainment)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Requested Review Mechanism</label>
                    <select
                      value={submissionForm.reviewType}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, reviewType: e.target.value as IrbReviewType })}
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Full Board Review">Full Board Review (Regular meeting quorum)</option>
                      <option value="Expedited Review">Expedited Review (Sub-committee accelerated)</option>
                      <option value="Exempt Review">Exempt Review (Secondary public dataset analysis)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Investigator Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">2</span>
                  Principal Investigator & Academic Unit
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">PI Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Bonsa Tufa"
                      value={submissionForm.piName}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, piName: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">PI Institutional Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="bonsa.tufa@haramaya.edu.et"
                      value={submissionForm.piEmail}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, piEmail: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Staff / Student ID No.</label>
                    <input
                      type="text"
                      placeholder="HU-STAFF-MED-0412"
                      value={submissionForm.staffOrStudentId}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, staffOrStudentId: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">College Affiliation</label>
                    <input
                      type="text"
                      value={submissionForm.college}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, college: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Academic Department</label>
                    <input
                      type="text"
                      value={submissionForm.department}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, department: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Investigator Role</label>
                    <select
                      value={submissionForm.role}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, role: e.target.value as any })}
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Faculty PI">Faculty PI</option>
                      <option value="Postgraduate Candidate (PhD)">Postgraduate Candidate (PhD)</option>
                      <option value="Postgraduate Candidate (MSc)">Postgraduate Candidate (MSc)</option>
                      <option value="Visiting Scholar">Visiting Scholar</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Co-Investigators (comma-separated names & institutions)</label>
                    <input
                      type="text"
                      placeholder="Dr. Nega Assefa (Kersa HDSS), Prof. Karen Campbell (LSHTM)"
                      value={submissionForm.coInvestigators}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, coInvestigators: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Population, Sites, & Methodology */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">3</span>
                  Study Population, Sample Size & Field Sites
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Target Sample Size</label>
                    <input
                      type="number"
                      value={submissionForm.sampleSize}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, sampleSize: Number(e.target.value) })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Target Cohort / Population Description</label>
                    <input
                      type="text"
                      placeholder="Pediatric malaria patients (2-12 years) attending Kersa rural health clinics"
                      value={submissionForm.targetPopulation}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, targetPopulation: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Field Study Sites / Stations (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Kersa HDSS, Hiwot Fana Hospital, Raare Agricultural Farm"
                      value={submissionForm.studySites}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, studySites: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Linked Research Grant Reference (Optional)</label>
                    <input
                      type="text"
                      placeholder="grant-01 (ACE II / Climate-SABC)"
                      value={submissionForm.fundingGrantRef}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, fundingGrantRef: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Structured Abstract / Protocol Summary</label>
                    <textarea
                      rows={3}
                      placeholder="Summarize the background, ethical rationale, methodology, primary endpoints, and societal benefits..."
                      value={submissionForm.summaryAbstract}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, summaryAbstract: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Ethical Safeguards */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">4</span>
                  Informed Consent & Subject Protection Protocols
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Informed Consent Modality</label>
                    <select
                      value={submissionForm.informedConsentMethod}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, informedConsentMethod: e.target.value as any })}
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Written Consent (Afan Oromo / Amharic / Somali)">Written Consent (Afan Oromo / Amharic / Somali)</option>
                      <option value="Verbal Witnessed Consent">Verbal Witnessed Consent</option>
                      <option value="Community Elder Assent + Individual Consent">Community Elder Assent + Individual Consent</option>
                      <option value="Exempt / Secondary Data">Exempt / Secondary Data</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 pt-4">
                      <input
                        type="checkbox"
                        id="vuln"
                        checked={submissionForm.vulnerableGroupsIncluded}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, vulnerableGroupsIncluded: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="vuln" className="text-xs font-bold text-slate-700">
                        Includes Vulnerable Groups (Minors, Pregnant, Pastoralists, Prisoners)
                      </label>
                    </div>
                    {submissionForm.vulnerableGroupsIncluded && (
                      <input
                        type="text"
                        placeholder="Specify safeguards (e.g. Parental consent, pediatric assent > 7 yrs)..."
                        value={submissionForm.vulnerableGroupsDetails}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, vulnerableGroupsDetails: e.target.value })}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300"
                      />
                    )}
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Data Confidentiality & Privacy Protocol</label>
                    <input
                      type="text"
                      value={submissionForm.dataConfidentialityProtocol}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, dataConfidentialityProtocol: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('protocols')}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2"
                >
                  <span className="material-icons text-sm">send</span>
                  Submit Protocol for Institutional Review
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SDG MATRIX & RANKINGS */}
        {activeTab === 'sdg_matrix' && (
          <div className="space-y-6">
            {/* Top Intro */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-900/50 px-2.5 py-0.5 rounded border border-blue-700">
                  Global Impact Matrix
                </span>
                <h2 className="text-xl sm:text-3xl font-bold font-serif">
                  UN Sustainable Development Goals (SDG) Research Intelligence
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Real-time mapping of Haramaya University peer-reviewed publications, external grants, and postgraduate research against the 17 United Nations Sustainable Development Goals.
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-extrabold font-serif text-emerald-400">1,643+</div>
                <div className="text-xs text-slate-400">SDG-Aligned Publications Indexed</div>
                <div className="text-sm font-semibold text-white mt-1">66.5 Million ETB Active Grants</div>
              </div>
            </div>

            {/* SDG Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {sdgMetrics.map((sdg) => {
                const isSelected = selectedSdgId === sdg.sdgId;
                return (
                  <button
                    key={sdg.sdgId}
                    onClick={() => setSelectedSdgId(sdg.sdgId)}
                    style={{ borderColor: isSelected ? sdg.color : 'transparent' }}
                    className={`p-4 rounded-xl text-left transition relative border-2 ${
                      isSelected ? 'bg-white shadow-md' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold mb-2"
                      style={{ backgroundColor: sdg.color }}
                    >
                      {sdg.sdgId}
                    </div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">{sdg.title}</div>
                    <div className="mt-2 text-lg font-bold font-serif text-slate-800">{sdg.publicationsCount}</div>
                    <div className="text-[10px] text-slate-500">Publications</div>
                    <div className="text-[10px] font-medium text-slate-700 mt-1">
                      {(sdg.activeGrantsETB / 1000000).toFixed(1)}M ETB Grants
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active SDG Deep Dive */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-xs"
                    style={{ backgroundColor: activeSdg.color }}
                  >
                    {activeSdg.sdgNumber}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-serif text-slate-900">{activeSdg.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{activeSdg.targetFocus}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-xs text-slate-500">Citations Mapped</div>
                    <div className="text-lg font-bold text-slate-900">{activeSdg.citationsCount} citations</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Grant Portfolio</div>
                    <div className="text-lg font-bold text-emerald-700">
                      {(activeSdg.activeGrantsETB / 1000000).toFixed(2)}M ETB
                    </div>
                  </div>
                </div>
              </div>

              {/* Flagship Projects */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Key Institutional Flagship Projects & Centers of Excellence
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeSdg.flagshipProjects.map((proj, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                      <span className="material-icons text-sm text-blue-600 mt-0.5">verified</span>
                      <span className="text-xs font-medium text-slate-800">{proj}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* National & Regional Benchmarks */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  Institutional Rankings
                </span>
                <h3 className="text-lg font-bold font-serif text-slate-900 mt-1">
                  National & East African Research Excellence Benchmarks (SciVal / Scopus)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {benchmarks.map((b, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">{b.indicator}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Rank #{b.nationalRank} in Ethiopia
                      </span>
                    </div>
                    <div className="text-xl font-bold font-serif text-slate-900">{b.haramayaValue}</div>
                    <div className="text-[11px] text-slate-600 leading-relaxed">{b.benchmarkDetail}</div>
                    <div className="text-[10px] font-semibold text-slate-500 pt-1 border-t border-slate-200">
                      East Africa Continental Rank: #{b.eastAfricaRank}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONFERENCES & CFP */}
        {activeTab === 'conferences' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  Academic Symposia & Conferences
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">
                  Open Call for Papers (CFP) & Symposia Management Desk
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Haramaya University Annual Research Review (ARR) and International Centers of Excellence Symposia.
                </p>
              </div>

              <button
                onClick={() => {
                  setSubmittingCfp(conferences[0]);
                  setAbstractForm({
                    ...abstractForm,
                    trackCode: conferences[0]?.thematicTracks[0]?.trackCode || 'TR-01',
                  });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-700 text-white hover:bg-indigo-600 text-xs sm:text-sm font-bold shadow-xs whitespace-nowrap"
              >
                <span className="material-icons text-sm">upload_file</span>
                Submit Paper Abstract
              </button>
            </div>

            {/* Conference Cards */}
            <div className="space-y-6">
              {conferences.map((conf) => (
                <div key={conf.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                          {conf.edition}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          {conf.status}
                        </span>
                        {conf.proceedingsIsbn && (
                          <span className="text-xs font-mono text-slate-500">ISBN: {conf.proceedingsIsbn}</span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 mt-1.5">
                        {conf.symposiumTitle}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium italic mt-0.5">Theme: "{conf.theme}"</p>
                    </div>

                    <button
                      onClick={() => {
                        setSubmittingCfp(conf);
                        setAbstractForm({
                          ...abstractForm,
                          trackCode: conf.thematicTracks[0]?.trackCode || 'TR-01',
                        });
                      }}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-semibold shadow-xs"
                    >
                      Submit to this Conference
                    </button>
                  </div>

                  {/* Conference Dates & Logistics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Conference Dates</span>
                      <span className="font-bold text-slate-800">{conf.dates}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Submission Deadline</span>
                      <span className="font-bold text-red-600">{conf.submissionDeadline}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Venue</span>
                      <span className="font-bold text-slate-800">{conf.venue}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Submissions Received</span>
                      <span className="font-bold text-indigo-700">{conf.submissionsCount} Papers Filed</span>
                    </div>
                  </div>

                  {/* Thematic Tracks */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Thematic Scientific Tracks</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {conf.thematicTracks.map((trk) => (
                        <div key={trk.trackCode} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              <span className="font-mono text-indigo-700 mr-1.5">{trk.trackCode}</span>
                              {trk.name}
                            </div>
                            <div className="text-[11px] text-slate-500">Chairs: {trk.chairs}</div>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {trk.acceptedSubmissions} Papers
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CERTIFICATE VERIFICATION DESK */}
        {activeTab === 'verify' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <span className="material-icons text-3xl">verified_user</span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                  National IRB Ethical Clearance Verification
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Validate the institutional authenticity, active date window, and conditions of any Haramaya University Ethics Protocol Certificate.
                </p>
              </div>

              <div className="flex gap-2 text-left">
                <input
                  type="text"
                  placeholder="Enter Protocol Number (e.g. HU-IRB-2026-0314) or Verification Hash..."
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyLookup()}
                  className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleVerifyLookup}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-xs whitespace-nowrap"
                >
                  Verify Now
                </button>
              </div>

              {/* Sample lookups */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 pt-2">
                <span>Quick Test:</span>
                {['HU-IRB-2026-0314', 'HU-IRB-2026-0289', 'HU-IRB-2026-0245'].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setVerifyInput(num);
                      const p = protocols.find((x) => x.protocolNumber === num);
                      if (p) {
                        setVerifyResult({
                          verified: p.status === 'Approved',
                          protocol: p,
                          message: `Verified Authentic: Institutional Review Board Clearance Certificate is ACTIVE.`,
                        });
                      }
                    }}
                    className="font-mono text-[11px] text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200"
                  >
                    {num}
                  </button>
                ))}
              </div>

              {/* Result display */}
              {verifyResult && (
                <div
                  className={`p-5 rounded-xl text-left border text-xs sm:text-sm animate-in fade-in duration-200 mt-4 ${
                    verifyResult.verified
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-base mb-1">
                    <span className="material-icons text-xl">
                      {verifyResult.verified ? 'check_circle' : 'warning'}
                    </span>
                    <span>{verifyResult.verified ? 'Verified Active Ethical Clearance' : 'Notice'}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{verifyResult.message}</p>

                  {verifyResult.protocol && (
                    <div className="mt-3 pt-3 border-t border-emerald-200/60 space-y-1 text-xs">
                      <div><strong className="text-slate-900">Title:</strong> {verifyResult.protocol.title}</div>
                      <div><strong className="text-slate-900">Principal Investigator:</strong> {verifyResult.protocol.principalInvestigator.name}</div>
                      <div><strong className="text-slate-900">Committee:</strong> {verifyResult.protocol.committee}</div>
                      <div><strong className="text-slate-900">Approval Date:</strong> {verifyResult.protocol.approvalDate} (Valid through {verifyResult.protocol.expirationDate})</div>
                      <div className="pt-2">
                        <button
                          onClick={() => setCertificateModalProtocol(verifyResult.protocol!)}
                          className="px-3 py-1 bg-emerald-700 text-white rounded font-bold text-xs hover:bg-emerald-600 shadow-xs"
                        >
                          View Official Digital Certificate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 1: FULL PROTOCOL DETAILS */}
        {selectedProtocol && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                      {selectedProtocol.protocolNumber}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {selectedProtocol.status}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 mt-2">
                    {selectedProtocol.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProtocol(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              {/* Protocol Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 block">Principal Investigator</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedProtocol.principalInvestigator.name}</span>
                  <span className="text-slate-600 block">{selectedProtocol.principalInvestigator.department}</span>
                  <span className="text-slate-600 block">{selectedProtocol.principalInvestigator.college}</span>
                  <span className="text-blue-700 block font-mono">{selectedProtocol.principalInvestigator.email}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 block">Ethical Governance</span>
                  <span className="font-bold text-slate-900">{selectedProtocol.committee}</span>
                  <span className="text-slate-600 block">Risk: {selectedProtocol.riskLevel} ({selectedProtocol.reviewType})</span>
                  <span className="text-slate-600 block">Sites: {selectedProtocol.studySites.join(', ')}</span>
                  <span className="text-slate-600 block">Sample Size: {selectedProtocol.sampleSize}</span>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">
                    Structured Abstract
                  </span>
                  <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                    {selectedProtocol.summaryAbstract}
                  </p>
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">
                    Human & Subject Ethical Safeguards
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Consent Modality</span>
                      <span className="font-medium text-slate-900">{selectedProtocol.ethicalConsiderations.informedConsentMethod}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Vulnerable Populations</span>
                      <span className="font-medium text-slate-900">
                        {selectedProtocol.ethicalConsiderations.vulnerableGroupsIncluded
                          ? `Yes — ${selectedProtocol.ethicalConsiderations.vulnerableGroupsDetails}`
                          : 'None reported'}
                      </span>
                    </div>
                    <div className="sm:col-span-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Data Privacy & Cryptographic Security</span>
                      <span className="font-medium text-slate-900">{selectedProtocol.ethicalConsiderations.dataConfidentialityProtocol}</span>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">
                    Submitted Protocol Attachments & Letters
                  </span>
                  <div className="space-y-1.5">
                    {selectedProtocol.attachments.map((att, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-base text-blue-600">description</span>
                          <span className="font-medium text-slate-800">{att.name}</span>
                          <span className="text-[10px] text-slate-500">({att.size})</span>
                        </div>
                        <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded font-semibold text-slate-700">
                          {att.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                {selectedProtocol.status === 'Approved' && (
                  <button
                    onClick={() => {
                      setCertificateModalProtocol(selectedProtocol);
                      setSelectedProtocol(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-xs flex items-center gap-1.5"
                  >
                    <span className="material-icons text-sm">verified</span>
                    View Official Certificate
                  </button>
                )}
                <button
                  onClick={() => setSelectedProtocol(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: OFFICIAL IRB DIGITAL CERTIFICATE */}
        {certificateModalProtocol && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border-4 border-slate-800 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-8 space-y-6 print:border-none print:shadow-none">
              {/* Certificate Header with Seal */}
              <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold font-serif mb-2">
                  HU
                </div>
                <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-600">
                  Haramaya University • Office of Research Affairs
                </h4>
                <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 uppercase tracking-tight">
                  Institutional Review Board (IRB)
                </h2>
                <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">
                  Ethical Clearance Certificate
                </h3>
                <div className="font-mono text-xs font-bold text-slate-800 pt-1">
                  Certificate Ref: {certificateModalProtocol.clearanceCertificateNumber || `HU-IRB-CERT-${certificateModalProtocol.protocolNumber.replace('HU-IRB-', '')}`}
                </div>
              </div>

              {/* Certificate Body */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
                <p>
                  This is to certify that the scientific and ethical research protocol titled:
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 font-serif font-bold text-slate-900 text-center italic text-sm sm:text-base">
                  "{certificateModalProtocol.title}"
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Principal Investigator:</span>
                    <strong className="text-slate-900">{certificateModalProtocol.principalInvestigator.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">College / Department:</span>
                    <strong className="text-slate-900">{certificateModalProtocol.principalInvestigator.department}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Ethics Committee:</span>
                    <strong className="text-slate-900">{certificateModalProtocol.committee}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Protocol Tracking ID:</span>
                    <strong className="font-mono text-blue-800">{certificateModalProtocol.protocolNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date of Approval:</span>
                    <strong className="text-slate-900">{certificateModalProtocol.approvalDate || '2026-07-18'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Expiration Date:</span>
                    <strong className="text-red-700">{certificateModalProtocol.expirationDate || '2027-07-17'}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-normal">
                  Has been reviewed by the Institutional Review Board in full compliance with National Bioethics Directives and World Health Organization (WHO) ethical guidelines for research on human subjects and biological materials. Any protocol modifications or adverse events must be reported to the Secretariat within 72 hours.
                </p>

                {/* Signatures & Seal Box */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200 text-center text-xs">
                  <div className="space-y-1">
                    <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-slate-600 italic">
                      Yadeta Dessie / Nigussie Dechassa
                    </div>
                    <span className="font-bold text-slate-900 block">Chairperson, IRB Committee</span>
                    <span className="text-[10px] text-slate-500">Haramaya University</span>
                  </div>

                  <div className="space-y-1">
                    <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-slate-600 italic">
                      Prof. Mengistu Urge
                    </div>
                    <span className="font-bold text-slate-900 block">Vice President for Research Affairs</span>
                    <span className="text-[10px] text-slate-500">Haramaya University</span>
                  </div>
                </div>

                {/* Cryptographic hash footer */}
                <div className="pt-2 text-center text-[10px] text-slate-400 font-mono break-all border-t border-slate-100">
                  Cryptographic Verification SHA-256: {certificateModalProtocol.certificateVerificationHash || '8f7a91c4b2e8d356a10984cf63e52817ad902bb31ec5e9a4f6d194c7b8e1a39f'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                >
                  <span className="material-icons text-sm">print</span>
                  Print Official Certificate
                </button>
                <button
                  onClick={() => setCertificateModalProtocol(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: COMMITTEE REVIEW ACTION */}
        {reviewActionProtocol && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Ethics Committee Action</span>
                  <h3 className="text-base font-bold font-serif text-slate-900 mt-0.5">
                    {reviewActionProtocol.protocolNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setReviewActionProtocol(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Committee Determination Decision</label>
                  <select
                    value={reviewDecision}
                    onChange={(e) => setReviewDecision(e.target.value as any)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value="Approved">Approved (Grant Certificate)</option>
                    <option value="Conditional Approval">Conditional Approval (Minor revisions required)</option>
                    <option value="Revisions Requested">Revisions Requested (Resubmit to next quorum)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Acting Committee Chair / Referee Name</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Official Committee Rationale / Comments</label>
                  <textarea
                    rows={3}
                    placeholder="Enter scientific justification, pediatric assent notes, or required protocol amendments..."
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => setReviewActionProtocol(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviewAction}
                  className="px-4 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-bold hover:bg-blue-600 shadow-xs"
                >
                  Save Committee Action
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: CONFERENCE ABSTRACT SUBMISSION */}
        {submittingCfp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    {submittingCfp.edition}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-slate-900 mt-0.5">
                    Submit Scientific Paper Abstract
                  </h3>
                </div>
                <button
                  onClick={() => setSubmittingCfp(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              <form onSubmit={handleAbstractSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Select Thematic Track *</label>
                  <select
                    value={abstractForm.trackCode}
                    onChange={(e) => setAbstractForm({ ...abstractForm, trackCode: e.target.value })}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white"
                  >
                    {submittingCfp.thematicTracks.map((trk) => (
                      <option key={trk.trackCode} value={trk.trackCode}>
                        {trk.trackCode} - {trk.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Abstract Paper Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter scientific paper title..."
                    value={abstractForm.title}
                    onChange={(e) => setAbstractForm({ ...abstractForm, title: e.target.value })}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Corresponding Author Name *</label>
                    <input
                      type="text"
                      required
                      value={abstractForm.authorName}
                      onChange={(e) => setAbstractForm({ ...abstractForm, authorName: e.target.value })}
                      className="w-full py-2 px-3 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={abstractForm.authorEmail}
                      onChange={(e) => setAbstractForm({ ...abstractForm, authorEmail: e.target.value })}
                      className="w-full py-2 px-3 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Co-Authors (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Dr. Gemechu Desta, Dr. Barbara Meisel"
                    value={abstractForm.coAuthors}
                    onChange={(e) => setAbstractForm({ ...abstractForm, coAuthors: e.target.value })}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Structured Abstract (250-400 words) *</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Include Background, Objectives, Methods, Key Findings, and Policy/Agricultural Implications..."
                    value={abstractForm.abstract}
                    onChange={(e) => setAbstractForm({ ...abstractForm, abstract: e.target.value })}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Sorghum genetics, Climate adaptation, Hararghe highlands"
                    value={abstractForm.keywords}
                    onChange={(e) => setAbstractForm({ ...abstractForm, keywords: e.target.value })}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSubmittingCfp(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-700 text-white font-bold text-xs hover:bg-indigo-600 shadow-xs"
                  >
                    Submit Abstract
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
