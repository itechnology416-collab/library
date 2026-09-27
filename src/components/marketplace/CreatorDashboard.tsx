import React, { useState } from 'react';
import { MarketplaceProject, MarketplaceRequest } from '../../types/marketplace';
import { CreatorPayoutsView } from './CreatorPayoutsView';
import { DeveloperApiView } from './DeveloperApiView';

interface CreatorDashboardProps {
  userProjects: MarketplaceProject[];
  userRequests: MarketplaceRequest[];
  onOpenSubmitModal: () => void;
  onViewProjectDetails: (project: MarketplaceProject) => void;
  onDeleteProject?: (projectId: string) => void;
  onReplyMessage?: (requestId: string, message: string) => void;
  onUpdateRequestStatus?: (requestId: string, status: any) => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  userProjects,
  userRequests,
  onOpenSubmitModal,
  onViewProjectDetails,
  onDeleteProject,
  onReplyMessage,
  onUpdateRequestStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'requests' | 'payouts' | 'developer'>('projects');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const handleSendReply = (requestId: string) => {
    const text = replyTextMap[requestId]?.trim();
    if (!text) return;
    if (onReplyMessage) {
      onReplyMessage(requestId, text);
    }
    setReplyTextMap((prev) => ({ ...prev, [requestId]: '' }));
  };

  // Compute analytics
  const totalViews = userProjects.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  const totalFavorites = userProjects.reduce((sum, p) => sum + (p.favoritesCount || 0), 0);
  const totalDemoClicks = userProjects.reduce((sum, p) => sum + (p.demoClicksCount || 0), 0);
  const totalRequests = userRequests.length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-secondary/15 text-secondary font-bold text-xs uppercase tracking-wider">
            Creator Workspace
          </span>
          <h2 className="text-2xl font-extrabold text-on-surface mt-1">
            My Projects & Commercial Dashboard
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage your submitted applications, track review status, and respond to business customization inquiries.
          </p>
        </div>

        <button
          onClick={onOpenSubmitModal}
          className="px-5 py-3 rounded-2xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-2 hover:brightness-105 transition-all shadow-md cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Submit New Project</span>
        </button>
      </div>

      {/* Real Analytics Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant text-xs mb-1">
            <span className="font-semibold">Project Views</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">visibility</span>
          </div>
          <div className="text-2xl font-extrabold text-on-surface font-mono">{totalViews}</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant text-xs mb-1">
            <span className="font-semibold">Wishlist Saved</span>
            <span className="material-symbols-outlined text-rose-500 text-[18px]">favorite</span>
          </div>
          <div className="text-2xl font-extrabold text-on-surface font-mono">{totalFavorites}</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant text-xs mb-1">
            <span className="font-semibold">Demo Clicks</span>
            <span className="material-symbols-outlined text-amber-500 text-[18px]">ads_click</span>
          </div>
          <div className="text-2xl font-extrabold text-on-surface font-mono">{totalDemoClicks}</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant text-xs mb-1">
            <span className="font-semibold">Business Inquiries</span>
            <span className="material-symbols-outlined text-emerald-500 text-[18px]">handshake</span>
          </div>
          <div className="text-2xl font-extrabold text-on-surface font-mono">{totalRequests}</div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-2">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          My Submissions ({userProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          Inquiries & Requests ({userRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'payouts'
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">payments</span>
          <span>Royalty Payouts (90/10)</span>
        </button>

        <button
          onClick={() => setActiveTab('developer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'developer'
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">code</span>
          <span>Developer API & Hooks</span>
        </button>
      </div>

      {/* TAB 1: Projects Table */}
      {activeTab === 'projects' && (
        <div>
          {userProjects.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant opacity-40">
                folder_open
              </span>
              <h3 className="text-lg font-bold text-on-surface">No Project Activity Yet</h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                Turn your completed digital projects into a business opportunity. Click below to publish your first application.
              </p>
              <button
                onClick={onOpenSubmitModal}
                className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs inline-flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Submit Your Project</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-outline-variant/30 bg-surface-container-lowest">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container/50 text-on-surface">
                    <th className="p-4 font-bold">Project Name</th>
                    <th className="p-4 font-bold">Category</th>
                    <th className="p-4 font-bold">Pricing</th>
                    <th className="p-4 font-bold">Review Status</th>
                    <th className="p-4 font-bold">Views</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userProjects.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-outline-variant/15 hover:bg-surface-container/20 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-bold text-on-surface text-sm">{p.title}</div>
                        <div className="text-[10px] text-on-surface-variant font-mono">
                          Updated: {p.lastUpdated}
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-on-surface-variant">{p.category}</td>

                      <td className="p-4 font-mono font-bold text-secondary">
                        {p.pricingType === 'Free'
                          ? 'FREE'
                          : p.priceETB
                          ? `${p.priceETB.toLocaleString()} ETB`
                          : 'Quote'}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            p.reviewStatus === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-600'
                              : p.reviewStatus === 'Submitted' || p.reviewStatus === 'Under Review'
                              ? 'bg-amber-500/20 text-amber-600'
                              : 'bg-rose-500/20 text-rose-600'
                          }`}
                        >
                          {p.reviewStatus}
                        </span>
                      </td>

                      <td className="p-4 font-mono">{p.viewsCount || 0}</td>

                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => onViewProjectDetails(p)}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs cursor-pointer"
                        >
                          View Page
                        </button>

                        {onDeleteProject && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                                onDeleteProject(p.id);
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 text-rose-600 hover:bg-rose-500 hover:text-white font-bold text-xs cursor-pointer transition-colors"
                            title="Delete project"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Requests Inbox & Customer Conversations */}
      {activeTab === 'requests' && (
        <div>
          {userRequests.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant opacity-40">
                inbox
              </span>
              <h3 className="text-lg font-bold text-on-surface">No Inquiries Yet</h3>
              <p className="text-xs text-on-surface-variant">
                Customer requests and customization inquiries will appear here when businesses engage with your listings.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 sm:p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/15 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-secondary/15 text-secondary font-bold text-[11px]">
                        {req.actionType}
                      </span>
                      <span className="font-bold text-base text-on-surface">{req.projectTitle}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Selector */}
                      <select
                        value={req.status}
                        onChange={(e) => {
                          if (onUpdateRequestStatus) {
                            onUpdateRequestStatus(req.id, e.target.value);
                          }
                        }}
                        className="px-2.5 py-1 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-bold text-xs"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Contact">In Contact</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Declined">Declined</option>
                      </select>

                      <span className="text-[10px] font-mono text-on-surface-variant">
                        {req.submittedAt?.split('T')[0]}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-on-surface-variant">
                    <div>
                      Customer: <span className="font-bold text-on-surface">{req.customerName}</span>
                      {req.customerOrganization ? ` (${req.customerOrganization})` : ''}
                      {' | '} Budget: <span className="font-mono text-secondary font-bold">{req.budgetRange}</span>
                    </div>

                    {/* Direct Contact Links */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${req.customerPhone}`}
                        className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 font-bold flex items-center gap-1 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>{req.customerPhone}</span>
                      </a>

                      {req.customerEmail && (
                        <a
                          href={`mailto:${req.customerEmail}?subject=Re: Inquiry on ${encodeURIComponent(req.projectTitle)}`}
                          className="px-3 py-1 rounded-lg bg-surface-container text-on-surface font-bold flex items-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">mail</span>
                          <span>Email</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-surface-container/60 border border-outline-variant/15 text-on-surface">
                    <span className="font-bold block mb-1 text-[11px] text-secondary">Initial Requirements:</span>
                    <p className="italic leading-relaxed font-mono">"{req.requirements}"</p>
                  </div>

                  {/* Conversation Messages Thread */}
                  {req.messages && req.messages.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-outline-variant/15">
                      <div className="font-bold text-[11px] text-on-surface flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-secondary">chat</span>
                        <span>Conversation History ({req.messages.length})</span>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {req.messages.map((m) => (
                          <div
                            key={m.id}
                            className={`p-2.5 rounded-xl text-[11px] ${
                              m.senderRole === 'creator'
                                ? 'bg-secondary/15 ml-4 border border-secondary/20 text-on-surface'
                                : 'bg-surface-container mr-4 border border-outline-variant/20 text-on-surface'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-semibold mb-1">
                              <span>{m.sender} ({m.senderRole})</span>
                              <span className="font-mono">{m.timestamp?.split('T')[1]?.substring(0, 5)}</span>
                            </div>
                            <p className="leading-snug">{m.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Inline Reply Form */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={replyTextMap[req.id] || ''}
                      onChange={(e) =>
                        setReplyTextMap((prev) => ({ ...prev, [req.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendReply(req.id);
                      }}
                      placeholder="Type a response to this customer..."
                      className="flex-1 p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-xs"
                    />
                    <button
                      onClick={() => handleSendReply(req.id)}
                      className="px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1 hover:brightness-105 transition-all shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Royalty Payouts & Escrow Ledger */}
      {activeTab === 'payouts' && <CreatorPayoutsView />}

      {/* TAB 4: Developer REST API & Webhooks */}
      {activeTab === 'developer' && <DeveloperApiView />}
    </div>
  );
};
