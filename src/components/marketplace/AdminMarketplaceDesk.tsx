import React, { useState } from 'react';
import { MarketplaceProject, MarketplaceRequest } from '../../types/marketplace';

interface AdminMarketplaceDeskProps {
  projects: MarketplaceProject[];
  requests: MarketplaceRequest[];
  onApproveProject: (projectId: string) => void;
  onRejectProject: (projectId: string, reason: string) => void;
  onToggleFeatured: (projectId: string) => void;
  onViewProject: (project: MarketplaceProject) => void;
}

export const AdminMarketplaceDesk: React.FC<AdminMarketplaceDeskProps> = ({
  projects,
  requests,
  onApproveProject,
  onRejectProject,
  onToggleFeatured,
  onViewProject,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredProjects = projects.filter((p) => {
    if (filterStatus === 'Submitted') return p.reviewStatus === 'Submitted' || p.reviewStatus === 'Under Review';
    if (filterStatus === 'Approved') return p.reviewStatus === 'Approved';
    if (filterStatus === 'Rejected') return p.reviewStatus === 'Rejected';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Admin Title Banner */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            Super Admin Governance
          </span>
          <h2 className="text-2xl font-extrabold text-on-surface mt-1">
            Marketplace Approvals & Content Moderation Desk
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Review creator project submissions, verify rights & security, toggle featured listings, and oversee commercial requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Submitted', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="overflow-x-auto rounded-3xl border border-outline-variant/30 bg-surface-container-lowest">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container/50 text-on-surface">
              <th className="p-4 font-bold">Project Details</th>
              <th className="p-4 font-bold">Creator Info</th>
              <th className="p-4 font-bold">Pricing</th>
              <th className="p-4 font-bold">Review Status</th>
              <th className="p-4 font-bold">Featured</th>
              <th className="p-4 font-bold text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((p) => (
              <tr
                key={p.id}
                className="border-b border-outline-variant/15 hover:bg-surface-container/20 transition-colors"
              >
                <td className="p-4">
                  <div className="font-bold text-on-surface text-sm">{p.title}</div>
                  <div className="text-[10px] text-on-surface-variant">
                    Category: <span className="font-semibold">{p.category}</span> | Platform:{' '}
                    <span className="font-semibold">{p.platform}</span>
                  </div>
                </td>

                <td className="p-4">
                  <div className="font-semibold text-on-surface">{p.creatorName}</div>
                  <div className="text-[10px] text-on-surface-variant font-mono">{p.creatorEmail}</div>
                </td>

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
                        : p.reviewStatus === 'Submitted'
                        ? 'bg-amber-500/20 text-amber-600 animate-pulse'
                        : 'bg-rose-500/20 text-rose-600'
                    }`}
                  >
                    {p.reviewStatus}
                  </span>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => onToggleFeatured(p.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                      p.isFeatured
                        ? 'bg-amber-500 text-white'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {p.isFeatured ? '★ Featured' : '☆ Make Featured'}
                  </button>
                </td>

                <td className="p-4 text-right space-x-1">
                  <button
                    onClick={() => onViewProject(p)}
                    className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs cursor-pointer"
                  >
                    View
                  </button>

                  {p.reviewStatus !== 'Approved' && (
                    <button
                      onClick={() => onApproveProject(p.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                  )}

                  {p.reviewStatus !== 'Rejected' && (
                    <button
                      onClick={() => onRejectProject(p.id, 'Moderation review request')}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Commercial Requests & Inquiries Overview */}
      <div className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">inbox</span>
              <span>Commercial Requests & Inquiries ({requests.length})</span>
            </h3>
            <p className="text-xs text-on-surface-variant">
              System-wide customer customization, licensing, and demonstration inquiries.
            </p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-surface-container-lowest border border-outline-variant/30 text-xs text-on-surface-variant">
            No customer inquiries logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-outline-variant/30 bg-surface-container-lowest">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container/50 text-on-surface">
                  <th className="p-4 font-bold">Request ID & Project</th>
                  <th className="p-4 font-bold">Customer Contact</th>
                  <th className="p-4 font-bold">Action Type</th>
                  <th className="p-4 font-bold">Budget Range</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-outline-variant/15 hover:bg-surface-container/20">
                    <td className="p-4">
                      <div className="font-bold text-on-surface">{r.projectTitle}</div>
                      <div className="text-[10px] text-on-surface-variant font-mono">{r.id}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-on-surface">{r.customerName}</div>
                      <div className="text-[10px] text-on-surface-variant font-mono">
                        {r.customerPhone} {r.customerEmail ? `| ${r.customerEmail}` : ''}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary font-bold text-[10px]">
                        {r.actionType}
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-secondary">{r.budgetRange}</td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-semibold text-[10px]">
                        {r.status}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-[10px] text-on-surface-variant">
                      {r.submittedAt?.split('T')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
