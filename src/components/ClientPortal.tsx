import React, { useState } from 'react';
import {
  ApprovalCertificate,
  PaymentProof,
  ProofAnnotation,
  RequestStatus,
  ServiceRequest,
  SupplementaryFile,
  UserProfile,
} from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';
import { InteractiveProofModal } from './InteractiveProofModal';
import { PaymentVerificationModal } from './PaymentVerificationModal';
import { ApprovalCertificateModal } from './ApprovalCertificateModal';
import { Modal, Input, Select, Textarea, Button, Badge } from './ui';

interface ClientPortalProps {
  requests: ServiceRequest[];
  onRequestNew: () => void;
  onUpdateRequest: (updated: ServiceRequest) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  requests,
  onRequestNew,
  onUpdateRequest,
}) => {
  // Simulated Authentication & User Session
  const [user, setUser] = useState<UserProfile | null>({
    id: 'user-01',
    name: 'Dr. Getachew Tadesse',
    email: 'getachew.tadesse@haramaya.edu.et',
    phone: '+251 911 234 567',
    affiliation: 'Haramaya University • College of Agriculture',
    role: 'client',
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    phone: '',
    affiliation: '',
    password: '',
  });

  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    requests[0] || null
  );

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [activeTab, setActiveTab] = useState<
    'overview' | 'proofs' | 'deliverables' | 'timeline' | 'messages' | 'revisions' | 'payment' | 'telegram'
  >('overview');

  // Modals for Phase 2
  const [isProofModalOpen, setIsProofModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState<boolean>(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState<boolean>(false);
  const [isSupplementaryModalOpen, setIsSupplementaryModalOpen] = useState<boolean>(false);

  // Form states
  const [revisionNotes, setRevisionNotes] = useState<string>('');
  const [newMessageText, setNewMessageText] = useState<string>('');
  const [supplementaryName, setSupplementaryName] = useState<string>('');
  const [supplementaryCategory, setSupplementaryCategory] = useState<SupplementaryFile['category']>('Raw Dataset');

  // Telegram Webhook Simulation State
  const [telegramHandle, setTelegramHandle] = useState<string>('@getachew_tadesse');
  const [telegramLogs, setTelegramLogs] = useState<Array<{ id: string; time: string; text: string; status: 'sent' | 'delivered' }>>([
    {
      id: 'tg-1',
      time: '10:30 AM Today',
      text: '🤖 WKI Bot: Brief #REQ-7821 has been received and assigned to Mr. Feysal Hussein.',
      status: 'delivered',
    },
    {
      id: 'tg-2',
      time: '02:15 PM Today',
      text: '🤖 WKI Bot: Milestone 2 (Slide Decomposition) has completed! Proofs are ready in your portal.',
      status: 'delivered',
    },
  ]);
  const [telegramToast, setTelegramToast] = useState<string | null>(null);

  const stages: RequestStatus[] = [
    'Submitted',
    'Reviewing',
    'In Progress',
    'Client Review',
    'Revision Requested',
    'Completed',
  ];

  const getStageIndex = (status: RequestStatus) => {
    return stages.indexOf(status);
  };

  // Filtered requests list
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return req.status === 'In Progress' || req.status === 'Reviewing';
    if (statusFilter === 'review') return req.status === 'Client Review';
    if (statusFilter === 'revision') return req.status === 'Revision Requested';
    if (statusFilter === 'completed') return req.status === 'Completed';
    return true;
  });

  const handleTriggerTelegramAlert = (customMsg?: string) => {
    if (!selectedRequest) return;
    const msgText = customMsg || `🔔 WKI Press Update: Project ${selectedRequest.id} ("${selectedRequest.projectTitle.slice(0, 35)}...") status is now [${selectedRequest.status}]. Track live proofs at Wirtuu Portal.`;
    const newLog = {
      id: 'tg-' + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: msgText,
      status: 'delivered' as const,
    };
    setTelegramLogs([newLog, ...telegramLogs]);
    setTelegramToast(`Telegram notification dispatched to ${telegramHandle}`);
    setTimeout(() => setTelegramToast(null), 4000);
  };

  const handleToggleMilestone = (milestoneId: string) => {
    if (!selectedRequest) return;
    const currentMilestones = selectedRequest.milestones || [];
    const updatedMilestones = currentMilestones.map((m) => {
      if (m.id === milestoneId) {
        const nextStatus = m.status === 'completed' ? 'pending' : ('completed' as const);
        return { ...m, status: nextStatus };
      }
      return m;
    });

    const updated = {
      ...selectedRequest,
      milestones: updatedMilestones,
    };
    setSelectedRequest(updated);
    onUpdateRequest(updated);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: 'usr-' + Date.now(),
      name: authForm.name || (authMode === 'login' ? 'Dr. Getachew Tadesse' : 'New Scholar'),
      email: authForm.email || 'client@haramaya.edu.et',
      phone: authForm.phone || '+251 911 000 000',
      affiliation: authForm.affiliation || 'Haramaya University Faculty',
      role: 'client',
    });
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || newMessageText;
    if (!selectedRequest || !textToSend.trim()) return;

    const newMsg = {
      id: 'msg-' + Date.now(),
      sender: user ? user.name : 'Client',
      senderRole: 'client' as const,
      message: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
    };

    const updated = {
      ...selectedRequest,
      messages: [...(selectedRequest.messages || []), newMsg],
    };

    setSelectedRequest(updated);
    onUpdateRequest(updated);
    if (!customText) setNewMessageText('');
  };

  const handleSubmitRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !revisionNotes.trim()) return;

    const newRev = {
      id: 'rev-' + Date.now(),
      requestedAt: new Date().toISOString().split('T')[0],
      notes: revisionNotes.trim(),
      status: 'Pending' as const,
    };

    const updated: ServiceRequest = {
      ...selectedRequest,
      status: 'Revision Requested',
      revisions: [...(selectedRequest.revisions || []), newRev],
      messages: [
        ...(selectedRequest.messages || []),
        {
          id: 'msg-' + Date.now(),
          sender: user?.name || 'Client',
          senderRole: 'client',
          message: `[Revision Requested]: ${revisionNotes.trim()}`,
          timestamp: 'Just now',
        },
      ],
    };

    setSelectedRequest(updated);
    onUpdateRequest(updated);
    setRevisionNotes('');
    setIsRevisionModalOpen(false);
  };

  const handlePaymentProofSubmitted = (proof: PaymentProof) => {
    if (!selectedRequest) return;
    const updated: ServiceRequest = {
      ...selectedRequest,
      paymentProof: proof,
      messages: [
        ...(selectedRequest.messages || []),
        {
          id: 'msg-' + Date.now(),
          sender: user?.name || selectedRequest.clientName,
          senderRole: 'client',
          message: `[Payment Slip Submitted]: ${proof.bankName} - Ref: ${proof.transactionRef} for ${proof.amountETB.toLocaleString()} ETB.`,
          timestamp: 'Just now',
        },
      ],
    };
    setSelectedRequest(updated);
    onUpdateRequest(updated);
    setIsPaymentModalOpen(false);
  };

  const handleApprovalConfirmed = (cert: ApprovalCertificate) => {
    if (!selectedRequest) return;
    const updated: ServiceRequest = {
      ...selectedRequest,
      status: 'Completed',
      approvalCertificate: cert,
      messages: [
        ...(selectedRequest.messages || []),
        {
          id: 'msg-' + Date.now(),
          sender: user?.name || selectedRequest.clientName,
          senderRole: 'client',
          message: `[Official Release Approved]: Manuscript sign-off completed. Certificate #${cert.certificateNumber} issued.`,
          timestamp: 'Just now',
        },
      ],
    };
    setSelectedRequest(updated);
    onUpdateRequest(updated);
  };

  const handleProofRevisions = (annotations: ProofAnnotation[]) => {
    if (!selectedRequest || annotations.length === 0) return;
    const notesCompiled = annotations
      .map((a) => `[Slide/Page ${a.slideOrPageNumber}] ${a.comment}`)
      .join('\n');

    const newRev = {
      id: 'rev-' + Date.now(),
      requestedAt: new Date().toISOString().split('T')[0],
      notes: notesCompiled,
      status: 'Pending' as const,
    };

    const updated: ServiceRequest = {
      ...selectedRequest,
      status: 'Revision Requested',
      revisions: [...(selectedRequest.revisions || []), newRev],
      messages: [
        ...(selectedRequest.messages || []),
        {
          id: 'msg-' + Date.now(),
          sender: user?.name || selectedRequest.clientName,
          senderRole: 'client',
          message: `[Proof Annotations Submitted]: ${annotations.length} specific slide notes pinned from Interactive Proof Studio.`,
          timestamp: 'Just now',
        },
      ],
    };
    setSelectedRequest(updated);
    onUpdateRequest(updated);
  };

  const handleAddSupplementaryFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !supplementaryName.trim()) return;

    const newFile: SupplementaryFile = {
      id: 'sup-' + Date.now(),
      name: supplementaryName.trim(),
      fileSize: '2.4 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      version: 'v' + ((selectedRequest.supplementaryFiles?.length || 0) + 1) + '.0',
      category: supplementaryCategory,
    };

    const updated: ServiceRequest = {
      ...selectedRequest,
      supplementaryFiles: [...(selectedRequest.supplementaryFiles || []), newFile],
    };

    setSelectedRequest(updated);
    onUpdateRequest(updated);
    setSupplementaryName('');
    setIsSupplementaryModalOpen(false);
  };

  return (
    <section className="px-gutter-mobile py-space-md" id="portal">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top User Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-secondary/15 text-secondary font-bold flex items-center justify-center text-sm border border-secondary/20">
              {user ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'G'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-title-sm text-title-sm font-bold text-on-surface">
                  {user ? user.name : 'Guest Scholar'}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/15 text-secondary uppercase">
                  {user ? 'Verified Scholar' : 'Not Signed In'}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                {user ? `${user.affiliation} • ${user.phone}` : 'Sign in to access your manuscript submissions and downloads.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all cursor-pointer shadow-xs"
              >
                Client Sign In
              </button>
            )}

            <button
              onClick={onRequestNew}
              className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-semibold text-xs flex items-center gap-1.5 hover:brightness-105 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Submit New Project</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
            Phase 2 • Academic Lifecycle & Proof Studio
          </span>
          <h1 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Client Project & Manuscript Tracking Portal
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Inspect interactive slide and page proofs, verify Ethiopian bank settlements, track milestones, and download certified university releases.
          </p>
        </div>

        {/* Layout: Left list, Right details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Requests List (Left Column) */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-title-sm text-title-sm font-bold text-on-surface">
                My Projects ({filteredRequests.length})
              </h3>
              <span className="text-[11px] text-on-surface-variant font-mono">
                {requests.length} Total
              </span>
            </div>

            {/* Search and Status Filters */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search project title or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/50 focus:border-secondary focus:outline-none"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[16px] text-on-surface-variant/60 pointer-events-none">
                  search
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-[14px] text-on-surface-variant hover:text-on-surface"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'active', label: 'Active' },
                  { id: 'review', label: 'In Review' },
                  { id: 'revision', label: 'Revisions' },
                  { id: 'completed', label: 'Completed' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === f.id
                        ? 'bg-secondary text-on-secondary font-bold shadow-xs'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-center text-xs text-on-surface-variant space-y-2">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant/40">
                  folder_open
                </span>
                <p>No matching project briefs found.</p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                    className="text-secondary font-bold hover:underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            ) : (
              filteredRequests.map((req) => {
                const isSelected = selectedRequest?.id === req.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-surface-container-lowest border-secondary shadow-md ring-2 ring-secondary/20'
                        : 'bg-surface-container-lowest border-outline-variant/20 hover:border-secondary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-secondary">
                        {req.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.status === 'Completed'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : req.status === 'In Progress'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300'
                            : req.status === 'Revision Requested'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                            : req.status === 'Client Review'
                            ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'
                            : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <h4 className="font-title-sm text-title-sm font-bold text-on-surface line-clamp-1">
                      {req.projectTitle}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/10">
                      <span>{req.estimatedPages} Pages</span>
                      <span>Due: {req.expectedDeadline || 'Open'}</span>
                    </div>

                    {/* Quick Payment & Proof badges */}
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className={`px-1.5 py-0.2 rounded font-semibold ${
                        req.paymentProof?.status === 'Verified'
                          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10'
                          : 'text-amber-700 dark:text-amber-300 bg-amber-500/10'
                      }`}>
                        {req.paymentProof?.status === 'Verified' ? 'Paid (CBE/Telebirr) ✓' : 'Settlement Pending'}
                      </span>
                      {req.approvalCertificate && (
                        <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          <span>Certified</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selected Request Detail Panel (Right Column) */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="p-4 sm:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm space-y-6">
                
                {/* Header with Phase 2 Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-outline-variant/20">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-secondary">
                        {selectedRequest.id}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] font-semibold text-on-surface uppercase">
                        {selectedRequest.serviceCategory}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[11px] font-bold uppercase">
                        {selectedRequest.targetLanguage}
                      </span>
                    </div>
                    <h3 className="font-title-lg text-title-lg font-bold text-on-surface mt-1">
                      {selectedRequest.projectTitle}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Client: {selectedRequest.clientName} • {selectedRequest.affiliation}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Interactive Proofs Studio Trigger */}
                    <button
                      onClick={() => setIsProofModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold flex items-center gap-1 hover:brightness-105 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">view_carousel</span>
                      <span>Inspect Proofs</span>
                    </button>

                    {/* Official Sign-Off Trigger */}
                    <button
                      onClick={() => setIsApprovalModalOpen(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        selectedRequest.approvalCertificate
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {selectedRequest.approvalCertificate ? 'verified' : 'approval'}
                      </span>
                      <span>
                        {selectedRequest.approvalCertificate ? 'View Certificate' : 'Sign & Approve'}
                      </span>
                    </button>

                    {/* Revision Request */}
                    <button
                      onClick={() => setIsRevisionModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit_note</span>
                      <span>Revision</span>
                    </button>

                    {/* Print Brief Dossier */}
                    <button
                      onClick={() => window.print()}
                      title="Print or save project dossier PDF"
                      className="px-2.5 py-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">print</span>
                      <span className="hidden sm:inline">Dossier</span>
                    </button>
                  </div>
                </div>

                {/* Workflow Progress Tracker - 6 Stages */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                      Production Lifecycle (6 Stages)
                    </span>
                    <span className="text-xs font-bold text-secondary">
                      Current Stage: {selectedRequest.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-1 pt-1">
                    {stages.map((stage, idx) => {
                      const currentIdx = getStageIndex(selectedRequest.status);
                      const isPast = idx < currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={stage} className="flex flex-col items-center text-center gap-1">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isPast
                                ? 'bg-secondary text-on-secondary'
                                : isCurrent
                                ? 'bg-secondary ring-4 ring-secondary/20 text-on-secondary animate-pulse'
                                : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            {isPast ? '✓' : idx + 1}
                          </div>
                          <span
                            className={`text-[9px] sm:text-[10px] leading-tight ${
                              isCurrent
                                ? 'font-bold text-secondary'
                                : isPast
                                ? 'font-medium text-on-surface'
                                : 'text-on-surface-variant'
                            }`}
                          >
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-tabs Navigation */}
                <div className="border-b border-outline-variant/20 flex gap-4 text-xs font-bold overflow-x-auto pb-1">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'overview'
                        ? 'border-b-2 border-secondary text-secondary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('proofs')}
                    className={`pb-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      activeTab === 'proofs'
                        ? 'border-b-2 border-secondary text-secondary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span>Proofs Studio</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-secondary/20 text-secondary text-[10px]">
                      {selectedRequest.proofs?.length || 5}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('deliverables')}
                    className={`pb-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      activeTab === 'deliverables'
                        ? 'border-b-2 border-secondary text-secondary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span>Deliverables</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-secondary/20 text-secondary text-[10px]">
                      {selectedRequest.deliverables?.length || 0}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`pb-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      activeTab === 'timeline'
                        ? 'border-b-2 border-secondary text-secondary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span>Timeline & Milestones</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 text-[10px]">
                      {selectedRequest.milestones?.filter((m) => m.status === 'completed').length || 3}/5
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`pb-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      activeTab === 'messages'
                        ? 'border-b-2 border-secondary text-secondary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span>Discussion</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-on-surface text-[10px]">
                      {selectedRequest.messages?.length || 0}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('revisions')}
                    className={`pb-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      activeTab === 'revisions'
                        ? 'border-b-2 border-secondary text-secondary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span>Revisions</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 text-[10px]">
                      {selectedRequest.revisions?.length || 0}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`pb-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      activeTab === 'payment'
                        ? 'border-b-2 border-secondary text-secondary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span>Settlement</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedRequest.paymentProof?.status === 'Verified'
                        ? 'bg-emerald-500/20 text-emerald-600'
                        : 'bg-amber-500/20 text-amber-600'
                    }`}>
                      {selectedRequest.paymentProof?.status === 'Verified' ? 'Paid' : 'Pending'}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('telegram')}
                    className={`pb-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      activeTab === 'telegram'
                        ? 'border-b-2 border-secondary text-secondary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span>Telegram Bot</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-600 text-[10px] font-bold">
                      Bot Live
                    </span>
                  </button>
                </div>

                {/* Subtab 1: Overview */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-surface-container text-xs">
                      <div>
                        <span className="text-on-surface-variant block">Volume</span>
                        <span className="font-bold text-on-surface">
                          {selectedRequest.estimatedPages} Pages / Slides
                        </span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block">Language</span>
                        <span className="font-bold text-on-surface uppercase">
                          {selectedRequest.targetLanguage}
                        </span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block">Target Deadline</span>
                        <span className="font-bold text-secondary">
                          {selectedRequest.expectedDeadline || 'Flexible'}
                        </span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block">Direct Contact</span>
                        <span className="font-bold text-on-surface truncate block">
                          {selectedRequest.phone}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Proofs & Settlement Action Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Proof Studio Quick Card */}
                      <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[22px]">
                            view_carousel
                          </span>
                          <div>
                            <h4 className="font-title-sm text-xs font-bold text-on-surface">
                              Interactive Proof Inspection
                            </h4>
                            <p className="text-[11px] text-on-surface-variant">
                              Inspect 16:9 defense slides and mark line-item annotations
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsProofModalOpen(true)}
                          className="w-full py-2 rounded-lg bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:brightness-105 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                          <span>Launch Proof Studio</span>
                        </button>
                      </div>

                      {/* Payment Verification Quick Card */}
                      <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[22px]">
                            account_balance
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-title-sm text-xs font-bold text-on-surface">
                                Bank Settlement (CBE/Telebirr)
                              </h4>
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                selectedRequest.paymentProof?.status === 'Verified'
                                  ? 'bg-emerald-500/20 text-emerald-600'
                                  : 'bg-amber-500/20 text-amber-600'
                              }`}>
                                {selectedRequest.paymentProof?.status || 'Pending'}
                              </span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant">
                              Total: {(selectedRequest.estimatedCostETB || selectedRequest.estimatedPages * 65).toLocaleString()} ETB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsPaymentModalOpen(true)}
                          className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1.5 border border-outline-variant/20 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">receipt</span>
                          <span>
                            {selectedRequest.paymentProof ? 'View Settlement Voucher' : 'Submit Bank Deposit Slip'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Brief & Notes */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-on-surface block mb-1">
                          Submitted Requirements & Objective:
                        </span>
                        <div className="p-3 rounded-lg bg-surface-container-high/40 text-on-surface-variant leading-relaxed">
                          {selectedRequest.description}
                        </div>
                      </div>

                      {selectedRequest.fileName && (
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container border border-outline-variant/20">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary text-[20px]">
                              attach_file
                            </span>
                            <span className="font-semibold text-on-surface">
                              {selectedRequest.fileName}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-secondary">
                            Client Source File
                          </span>
                        </div>
                      )}

                      {/* Supplementary Files Box */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-on-surface text-xs flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-secondary">folder_zip</span>
                            <span>Supplementary Research Files ({selectedRequest.supplementaryFiles?.length || 0})</span>
                          </span>
                          <button
                            onClick={() => setIsSupplementaryModalOpen(true)}
                            className="text-[11px] text-secondary font-bold hover:underline cursor-pointer"
                          >
                            + Attach Dataset or Guidelines
                          </button>
                        </div>

                        {(!selectedRequest.supplementaryFiles || selectedRequest.supplementaryFiles.length === 0) ? (
                          <div className="p-3 rounded-lg bg-surface-container/40 text-center text-[11px] text-on-surface-variant">
                            No supplementary datasets or faculty guidelines attached yet.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedRequest.supplementaryFiles.map((file) => (
                              <div
                                key={file.id}
                                className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between text-xs border border-outline-variant/20"
                              >
                                <div className="truncate pr-2">
                                  <span className="font-semibold text-on-surface block truncate">
                                    {file.name}
                                  </span>
                                  <span className="text-[10px] text-on-surface-variant">
                                    {file.category} • {file.fileSize} • {file.version}
                                  </span>
                                </div>
                                <span className="material-symbols-outlined text-secondary text-[18px]">
                                  download
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {selectedRequest.adminNotes && (
                        <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                          <span className="font-bold text-secondary block mb-0.5">
                            Editor Desk Note (Mr. Feysal Hussein):
                          </span>
                          <p className="text-on-surface leading-relaxed">
                            {selectedRequest.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Subtab 2: Proofs Studio Snapshot */}
                {activeTab === 'proofs' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-title-sm text-xs font-bold text-on-surface">
                          Manuscript & Defense Slides Proofs
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                          Inspect layout typography, data tables, and slide compositions before defense
                        </p>
                      </div>
                      <button
                        onClick={() => setIsProofModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:brightness-105 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                        <span>Open Fullscreen Proof Studio</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[1, 2, 3].map((num) => (
                        <div
                          key={num}
                          onClick={() => setIsProofModalOpen(true)}
                          className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-secondary/40 cursor-pointer space-y-2 transition-all shadow-2xs"
                        >
                          <div className="aspect-16/9 bg-slate-900 rounded-lg p-3 text-white flex flex-col justify-between">
                            <span className="text-[9px] font-mono text-emerald-400">
                              SLIDE {String(num).padStart(2, '0')}
                            </span>
                            <div className="text-[11px] font-bold line-clamp-2">
                              {num === 1 ? selectedRequest.projectTitle : num === 2 ? 'Statistical Regression Matrix (ANOVA)' : 'Defensive Conclusions'}
                            </div>
                            <span className="text-[8px] text-slate-400">HARAMAYA UNIVERSITY</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-on-surface">Slide #{num}</span>
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 text-[10px] font-bold">
                              Verified
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subtab 3: Deliverables */}
                {activeTab === 'deliverables' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant">
                        Review drafts and final print-ready source files prepared by Mr. Feysal Hussein.
                      </span>
                    </div>

                    {(!selectedRequest.deliverables || selectedRequest.deliverables.length === 0) ? (
                      <div className="p-8 rounded-xl bg-surface-container text-center text-xs text-on-surface-variant">
                        No final deliverables uploaded yet. The editorial team will attach preview files as soon as they reach the review stage.
                      </div>
                    ) : (
                      selectedRequest.deliverables.map((del) => (
                        <div
                          key={del.id}
                          className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between gap-3 hover:border-secondary/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xs">
                              {del.fileType}
                            </div>
                            <div>
                              <h5 className="font-title-sm text-xs font-bold text-on-surface">
                                {del.title}
                              </h5>
                              <p className="text-[11px] text-on-surface-variant">
                                Version {del.version} • {del.fileSize} • Uploaded {del.uploadedAt}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => alert(`Downloading deliverable: ${del.title}`)}
                            className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-semibold flex items-center gap-1 hover:brightness-105 active:scale-95 transition-all cursor-pointer shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            <span>Download</span>
                          </button>
                        </div>
                      ))
                    )}

                    {selectedRequest.approvalCertificate && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-amber-600 text-[24px]">
                            verified
                          </span>
                          <div>
                            <span className="font-bold text-on-surface block">
                              Certificate of Acceptance Issued
                            </span>
                            <span className="text-[11px] text-on-surface-variant">
                              Serial: {selectedRequest.approvalCertificate.certificateNumber}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsApprovalModalOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:brightness-105 cursor-pointer"
                        >
                          View Certificate
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Subtab 4: Timeline & Milestones */}
                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-on-surface block">
                          Manuscript Production Gantt & Milestone Track
                        </span>
                        <span className="text-on-surface-variant">
                          Scheduled progression toward target deadline: {selectedRequest.expectedDeadline || 'Flexible'} • Click milestone to endorse
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-secondary/15 text-secondary font-bold text-[11px]">
                        Target 7-Day Cycle
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(selectedRequest.milestones || [
                        {
                          id: 'mil-def-1',
                          title: 'Intake Diagnostics & Abstract Analysis',
                          dayTarget: 1,
                          status: 'completed' as const,
                          description: 'Linguistic verification across English, Qubee, Fidel, and Arabic Tashkeel.',
                        },
                        {
                          id: 'mil-def-2',
                          title: 'Structural Typesetting & Slide Decomposition',
                          dayTarget: 2,
                          status: 'completed' as const,
                          description: 'Applying 3-second cognitive clarity rule and university margins.',
                        },
                        {
                          id: 'mil-def-3',
                          title: 'Mathematical Formulas & Data Vectorization',
                          dayTarget: 4,
                          status: 'in_progress' as const,
                          description: 'Vectorizing ANOVA charts and microscope figures.',
                        },
                        {
                          id: 'mil-def-4',
                          title: 'Author Proof Inspection & Revision Studio',
                          dayTarget: 6,
                          status: 'pending' as const,
                          description: 'Collaborative author review and annotation log.',
                        },
                        {
                          id: 'mil-def-5',
                          title: 'Final Release Sign-off & Printing Archive',
                          dayTarget: 7,
                          status: 'pending' as const,
                          description: 'Official acceptance certificate and digital release package.',
                        },
                      ]).map((m, idx) => (
                        <div
                          key={m.id}
                          onClick={() => handleToggleMilestone(m.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            m.status === 'completed'
                              ? 'bg-emerald-500/5 border-emerald-500/30'
                              : m.status === 'in_progress'
                              ? 'bg-secondary/5 border-secondary/40 shadow-xs'
                              : 'bg-surface-container-lowest border-outline-variant/20 hover:border-secondary/30'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                              m.status === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : m.status === 'in_progress'
                                ? 'bg-secondary text-on-secondary animate-pulse'
                                : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            {m.status === 'completed' ? '✓' : idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-on-surface flex items-center gap-1.5">
                                <span>{m.title}</span>
                                {m.status === 'completed' && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 font-bold">
                                    Client Endorsed
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] font-mono text-secondary font-bold">
                                Day {m.dayTarget} Target
                              </span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                              {m.description}
                            </p>
                          </div>
                          <div className="text-[11px] font-bold text-secondary flex items-center self-center pl-2">
                            {m.status === 'completed' ? (
                              <span className="text-emerald-600 text-xs">Verified</span>
                            ) : (
                              <span className="text-on-surface-variant text-[10px] hover:text-secondary">Click to sign</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subtab 5: Discussion */}
                {activeTab === 'messages' && (
                  <div className="space-y-4">
                    {/* Quick Response Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase shrink-0">
                        Quick Chips:
                      </span>
                      {[
                        'Defense scheduled for Sept 28',
                        'Please verify APA 7th citations',
                        'Confirm Arabic Tashkeel formatting',
                        'Request printed hardcover copies',
                      ].map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleSendMessage(undefined, prompt)}
                          className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-[11px] text-on-surface font-medium whitespace-nowrap cursor-pointer transition-colors border border-outline-variant/20"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2 p-3 rounded-xl bg-surface-container/50">
                      {(!selectedRequest.messages || selectedRequest.messages.length === 0) ? (
                        <p className="text-xs text-on-surface-variant text-center py-6">
                          No messages in this project thread yet. Post your instructions below.
                        </p>
                      ) : (
                        selectedRequest.messages.map((m) => {
                          const isClient = m.senderRole === 'client';
                          return (
                            <div
                              key={m.id}
                              className={`p-3 rounded-xl text-xs max-w-[85%] ${
                                isClient
                                  ? 'ml-auto bg-secondary text-on-secondary'
                                  : 'mr-auto bg-surface-container-highest text-on-surface border border-outline-variant/30'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-80 font-bold">
                                <span>{m.sender}</span>
                                <span>{m.timestamp}</span>
                              </div>
                              <p className="leading-relaxed">{m.message}</p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a message or instruction to Mr. Feysal Hussein..."
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all cursor-pointer shadow-xs"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}

                {/* Subtab 6: Revisions */}
                {activeTab === 'revisions' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant">
                        Submit and log specific changes required on formatting, slides, or citations.
                      </span>
                      <button
                        onClick={() => setIsRevisionModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold hover:brightness-105 transition-all cursor-pointer shadow-xs"
                      >
                        + Submit Revision Brief
                      </button>
                    </div>

                    {(!selectedRequest.revisions || selectedRequest.revisions.length === 0) ? (
                      <div className="p-8 rounded-xl bg-surface-container text-center text-xs text-on-surface-variant">
                        No revisions requested yet.
                      </div>
                    ) : (
                      selectedRequest.revisions.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-3.5 rounded-xl bg-surface-container-lowest border border-amber-500/30 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-amber-700 dark:text-amber-300">
                              Revision Request #{rev.id}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase">
                              {rev.status}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-line">
                            {rev.notes}
                          </p>
                          <span className="text-[10px] text-on-surface-variant/60 block">
                            Logged on: {rev.requestedAt}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Subtab 7: Payment & Settlement */}
                {activeTab === 'payment' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-container text-xs space-y-2 border border-outline-variant/20">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-on-surface text-sm">
                          University Settlement & Official Receipt
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          selectedRequest.paymentProof?.status === 'Verified'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        }`}>
                          {selectedRequest.paymentProof?.status || 'Payment Pending'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                        <div>
                          <span className="text-on-surface-variant block">Total Workload:</span>
                          <span className="font-bold text-on-surface">
                            {selectedRequest.estimatedPages} Pages / Slides
                          </span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block">Estimated Cost:</span>
                          <span className="font-bold text-secondary">
                            {(selectedRequest.estimatedCostETB || selectedRequest.estimatedPages * 65).toLocaleString()} ETB
                          </span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block">Bank / Channel:</span>
                          <span className="font-bold text-on-surface">
                            {selectedRequest.paymentProof?.bankName || 'CBE / Telebirr'}
                          </span>
                        </div>
                      </div>

                      {selectedRequest.paymentProof && (
                        <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 space-y-1 mt-2">
                          <div className="flex justify-between">
                            <span className="text-on-surface-variant">Transaction Ref:</span>
                            <span className="font-mono font-bold text-secondary">
                              {selectedRequest.paymentProof.transactionRef}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-on-surface-variant">Payer Name:</span>
                            <span className="font-semibold text-on-surface">
                              {selectedRequest.paymentProof.payerName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-on-surface-variant">Deposit Slip:</span>
                            <span className="font-mono text-on-surface">
                              {selectedRequest.paymentProof.receiptFileName}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant">
                        Need to submit a fresh CBE slip or Telebirr SMS confirmation?
                      </span>
                      <button
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs shadow-xs hover:brightness-105 cursor-pointer"
                      >
                        Submit / Update Bank Slip
                      </button>
                    </div>
                  </div>
                )}

                {/* Subtab 8: Telegram Bot Webhook Integration */}
                {activeTab === 'telegram' && (
                  <div className="space-y-5">
                    {/* Header Banner */}
                    <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          <span className="material-symbols-outlined text-[22px]">send</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-on-surface">
                              WKI Telegram Notification Dispatcher
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                              Webhook Active
                            </span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant">
                            Receive real-time progress pings on Telegram whenever Mr. Feysal updates your slides or milestones.
                          </p>
                        </div>
                      </div>

                      <a
                        href="https://t.me/WirtuuKompiitaraaIlilliiBot"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
                      >
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        <span>Open Bot in Telegram</span>
                      </a>
                    </div>

                    {/* Telegram Configuration & Handle */}
                    <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 space-y-3">
                      <h5 className="font-title-sm text-xs font-bold text-on-surface">
                        Telegram Recipient Handle
                      </h5>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={telegramHandle}
                            onChange={(e) => setTelegramHandle(e.target.value)}
                            placeholder="@username or +251..."
                            className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:border-secondary focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTriggerTelegramAlert()}
                          className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-105 transition-all shadow-xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                          <span>Dispatch Test Alert</span>
                        </button>
                      </div>

                      {telegramToast && (
                        <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          <span>{telegramToast}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Trigger Preset Scenarios */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                        Simulate Stage Webhook Triggers:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {[
                          {
                            title: 'Slide Proofs Ready for Client Review',
                            msg: `🔔 WKI Bot: New 16:9 defense slide proofs generated for #${selectedRequest.id}. Inspect layout and pin annotations now!`,
                          },
                          {
                            title: 'CBE Birr Deposit Slip Verified',
                            msg: `💳 WKI Finance: Your deposit slip for ${selectedRequest.estimatedCostETB || 1625} ETB on #${selectedRequest.id} has been verified with stamp.`,
                          },
                          {
                            title: 'Revision Brief Implemented',
                            msg: `✏️ WKI Editorial: Revisions on Slide 3 ANOVA regression charts have been updated by Mr. Feysal Hussein.`,
                          },
                          {
                            title: 'Official Acceptance Certificate Issued',
                            msg: `🎓 WKI Director: Official Acceptance Certificate #WKI-APPR-9281 issued for "${selectedRequest.projectTitle.slice(0, 30)}...". Ready for university archive.`,
                          },
                        ].map((preset, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => handleTriggerTelegramAlert(preset.msg)}
                            className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-sky-500/40 cursor-pointer flex items-center justify-between gap-2 transition-all"
                          >
                            <div>
                              <span className="font-bold text-on-surface block text-[11px]">
                                {preset.title}
                              </span>
                              <span className="text-[10px] text-on-surface-variant line-clamp-1">
                                {preset.msg}
                              </span>
                            </div>
                            <span className="material-symbols-outlined text-sky-600 text-[18px] shrink-0">
                              send
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notification Dispatch History Log */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-on-surface">
                          Recent Dispatch History ({telegramLogs.length})
                        </span>
                        <button
                          onClick={() => setTelegramLogs([])}
                          className="text-[10px] text-on-surface-variant hover:text-rose-500 cursor-pointer"
                        >
                          Clear History
                        </button>
                      </div>

                      <div className="space-y-2">
                        {telegramLogs.map((log) => (
                          <div
                            key={log.id}
                            className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-start justify-between gap-3 text-xs"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-bold text-sky-600">
                                  {telegramHandle}
                                </span>
                                <span className="text-[10px] text-on-surface-variant">
                                  {log.time}
                                </span>
                              </div>
                              <p className="text-on-surface text-[11px] leading-relaxed">
                                {log.text}
                              </p>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-700 shrink-0">
                              Delivered ✓
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Direct Contact Channels */}
                    <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[22px]">
                          support_agent
                        </span>
                        <div>
                          <span className="font-bold text-on-surface block">
                            Direct Scholar Help Desk
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Live chat with Mr. Feysal Hussein via WhatsApp or Telegram
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href="https://t.me/feysal_wki"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center gap-1 hover:brightness-105"
                        >
                          <span>Telegram Direct</span>
                        </a>
                        <a
                          href={`https://wa.me/251911234567?text=Hello%20Mr.%20Feysal,%20inquiring%20about%20my%20project%20${selectedRequest.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:brightness-105"
                        >
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 text-center text-on-surface-variant">
                Select a project from the left or submit a new brief.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Interactive Proofs Studio Modal */}
      {isProofModalOpen && selectedRequest && (
        <InteractiveProofModal
          request={selectedRequest}
          onClose={() => setIsProofModalOpen(false)}
          onSubmitRevisionsFromProofs={handleProofRevisions}
          onApproveAllProofs={() => {
            setIsProofModalOpen(false);
            setIsApprovalModalOpen(true);
          }}
        />
      )}

      {/* Payment Settlement Modal */}
      {isPaymentModalOpen && selectedRequest && (
        <PaymentVerificationModal
          request={selectedRequest}
          onClose={() => setIsPaymentModalOpen(false)}
          onSubmitPaymentProof={handlePaymentProofSubmitted}
        />
      )}

      {/* Approval Certificate Modal */}
      {isApprovalModalOpen && selectedRequest && (
        <ApprovalCertificateModal
          request={selectedRequest}
          onClose={() => setIsApprovalModalOpen(false)}
          onConfirmApproval={handleApprovalConfirmed}
        />
      )}

      {/* Supplementary Upload Modal */}
      {isSupplementaryModalOpen && selectedRequest && (
        <Modal
          isOpen={true}
          onClose={() => setIsSupplementaryModalOpen(false)}
          size="md"
          title="Attach Supplementary Research File"
          description="Upload experimental datasets, high-resolution microscope micrographs, or faculty defense guidelines."
        >
          <form onSubmit={handleAddSupplementaryFile} className="space-y-3.5">
            <Input
              label="File Name / Description"
              required
              placeholder="e.g. soil_sample_microscope_figures.zip"
              value={supplementaryName}
              onChange={(e) => setSupplementaryName(e.target.value)}
            />

            <Select
              label="Category"
              value={supplementaryCategory}
              options={[
                { value: 'Raw Dataset', label: 'Raw Dataset (.xlsx / .csv)' },
                { value: 'High-Res Figure', label: 'High-Res Figure / Micrograph (.png / .tif)' },
                { value: 'Faculty Guidelines', label: 'Faculty Defense Guidelines (.pdf)' },
                { value: 'Revised Text', label: 'Revised Chapter Text (.docx)' },
              ]}
              onChange={(e) => setSupplementaryCategory(e.target.value as any)}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSupplementaryModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="secondary" className="text-xs font-bold">
                Upload & Attach
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Revision Modal */}
      {isRevisionModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsRevisionModalOpen(false)}
          size="md"
          title="Request Manuscript Revision"
          description="Specify the exact pages, slides, or chapters you need updated. Mr. Feysal Hussein will review and implement the changes."
        >
          <form onSubmit={handleSubmitRevision} className="space-y-4">
            <Textarea
              label="Revision Details & Instructions"
              rows={4}
              required
              placeholder="e.g. Please increase font size on Slide 18 data table, adjust color for Control Group to navy blue, and verify Equation 4..."
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRevisionModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="secondary" className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white">
                Submit Revision Request
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Auth Modal (Login / Register) */}
      {isAuthModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAuthModalOpen(false)}
          size="md"
          title={authMode === 'login' ? 'Client Scholar Sign In' : 'Create Scholar Account'}
          description="Access your confidential defense slides, thesis drafts, and Ethiopian bank settlement vouchers."
        >
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            {authMode === 'register' && (
              <>
                <Input
                  label="Full Name"
                  required
                  placeholder="e.g. Dr. Abebe Kebede"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                />
                <Input
                  label="University / Department / Organization"
                  placeholder="e.g. Haramaya University, College of Agriculture"
                  value={authForm.affiliation}
                  onChange={(e) => setAuthForm({ ...authForm, affiliation: e.target.value })}
                />
              </>
            )}

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="scholar@haramaya.edu.et"
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            />

            <Button
              type="submit"
              variant="secondary"
              className="w-full justify-center text-xs font-bold shadow-xs mt-2"
            >
              {authMode === 'login' ? 'Sign In to Portal' : 'Register Account'}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
              >
                {authMode === 'login'
                  ? "Don't have an account? Register here"
                  : 'Already registered? Sign in'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
};
