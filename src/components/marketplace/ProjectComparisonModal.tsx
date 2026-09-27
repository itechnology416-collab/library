import React from 'react';
import { MarketplaceProject } from '../../types/marketplace';

interface ProjectComparisonModalProps {
  comparedProjects: MarketplaceProject[];
  onClose: () => void;
  onRemoveProject: (projectId: string) => void;
  onRequestProject: (project: MarketplaceProject) => void;
}

export const ProjectComparisonModal: React.FC<ProjectComparisonModalProps> = ({
  comparedProjects,
  onClose,
  onRemoveProject,
  onRequestProject,
}) => {
  if (comparedProjects.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-outline-variant/20 bg-surface-container/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
              Product Evaluation Tool
            </span>
            <h3 className="text-xl font-extrabold text-on-surface">
              Side-by-Side Project Comparison ({comparedProjects.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Comparison Grid Table */}
        <div className="p-6 overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-xs text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-outline-variant/20">
                <th className="p-3 font-bold text-on-surface bg-surface-container/30 w-1/5">
                  Comparison Attribute
                </th>
                {comparedProjects.map((p) => (
                  <th key={p.id} className="p-3 font-bold text-on-surface align-top relative">
                    <button
                      onClick={() => onRemoveProject(p.id)}
                      className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      title="Remove from comparison"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                    <div className="text-sm text-secondary font-bold truncate pr-6">{p.title}</div>
                    <div className="text-[10px] text-on-surface-variant font-normal">
                      {p.category}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant/15">
              <tr>
                <td className="p-3 font-bold text-on-surface bg-surface-container/30">Listing Price</td>
                {comparedProjects.map((p) => (
                  <td key={p.id} className="p-3 font-mono font-bold text-secondary">
                    {p.pricingType === 'Free'
                      ? 'FREE'
                      : p.priceETB
                      ? `${p.priceETB.toLocaleString()} ETB`
                      : 'Contact for Quote'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-on-surface bg-surface-container/30">Platform</td>
                {comparedProjects.map((p) => (
                  <td key={p.id} className="p-3 text-on-surface font-semibold">{p.platform}</td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-on-surface bg-surface-container/30">Technology Stack</td>
                {comparedProjects.map((p) => (
                  <td key={p.id} className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {p.technologies.map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-on-surface bg-surface-container/30">Project Status</td>
                {comparedProjects.map((p) => (
                  <td key={p.id} className="p-3 text-emerald-600 font-bold">{p.status}</td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-on-surface bg-surface-container/30">License Model</td>
                {comparedProjects.map((p) => (
                  <td key={p.id} className="p-3 text-on-surface">{p.licenseType}</td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-on-surface bg-surface-container/30">Demo Link</td>
                {comparedProjects.map((p) => (
                  <td key={p.id} className="p-3">
                    {p.liveDemoUrl ? (
                      <a
                        href={p.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-secondary font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>Open Demo</span>
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    ) : (
                      <span className="text-on-surface-variant">Not Available</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-on-surface bg-surface-container/30">Action</td>
                {comparedProjects.map((p) => (
                  <td key={p.id} className="p-3">
                    <button
                      onClick={() => {
                        onClose();
                        onRequestProject(p);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs shadow-xs hover:brightness-105 cursor-pointer"
                    >
                      Request This
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container/30 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
