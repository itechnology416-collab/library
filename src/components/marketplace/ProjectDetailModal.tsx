import React, { useState } from 'react';
import { MarketplaceProject } from '../../types/marketplace';
import { ProjectReviewsSection } from './ProjectReviewsSection';

interface ProjectDetailModalProps {
  project: MarketplaceProject | null;
  onClose: () => void;
  onRequestAction: (project: MarketplaceProject, actionType?: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (projectId: string) => void;
  isCompared: boolean;
  onToggleCompare: (project: MarketplaceProject) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onRequestAction,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [downloadInfo, setDownloadInfo] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!project) return null;

  const handleFetchDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch(`/api/marketplace/download/${project.id}`);
      const data = await res.json();
      if (data.success) {
        setDownloadInfo(data);
      }
    } catch (e) {
      console.warn('Download error:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const allScreenshots = project.screenshots && project.screenshots.length > 0
    ? project.screenshots
    : [project.thumbnail];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-outline-variant/20 flex items-center justify-between gap-4 bg-surface-container/30 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-[11px] font-bold uppercase tracking-wider">
                {project.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">devices</span>
                <span>{project.platform}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                <span>{project.status}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface truncate">
              {project.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleFavorite(project.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-600 border-rose-500/40'
                  : 'bg-surface-container text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
              }`}
              title={isFavorite ? 'Saved in Wishlist' : 'Add to Wishlist'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isFavorite ? 'favorite' : 'favorite_border'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Main Showcase & Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-outline-variant/30 shadow-lg">
              <img
                src={allScreenshots[activeMediaIndex] || project.thumbnail}
                alt={project.title}
                className="w-full h-full object-contain"
              />
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 shadow-lg hover:brightness-110 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>Interactive Live Demo</span>
                </a>
              )}
            </div>

            {/* Thumbnail Gallery Strip */}
            {allScreenshots.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {allScreenshots.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`h-16 w-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeMediaIndex === idx
                        ? 'border-secondary ring-2 ring-secondary/30 scale-105'
                        : 'border-outline-variant/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Screenshot" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Business Marketplace Actions Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-surface-container/60 border border-secondary/30 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  Commercial Availability & Licensing
                </div>
                <div className="text-2xl font-extrabold text-on-surface font-mono">
                  {project.pricingType === 'Free'
                    ? 'FREE OPEN ACCESS'
                    : project.priceETB
                    ? `${project.priceETB.toLocaleString()} ETB`
                    : 'Custom Quote / Negotiable'}
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  License: <span className="font-semibold text-on-surface">{project.licenseType}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onRequestAction(project, 'Buy/License')}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-2 hover:brightness-105 transition-all cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                  <span>Acquire / License</span>
                </button>

                <button
                  onClick={() => onRequestAction(project, 'Request Customization')}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Request Customization</span>
                </button>

                <button
                  onClick={() => onRequestAction(project, 'Contact Creator')}
                  className="px-3 py-3 rounded-xl bg-surface-container text-on-surface font-bold text-xs flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/30"
                  title="Contact Creator"
                >
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  <span className="hidden sm:inline">Contact</span>
                </button>
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">description</span>
              <span>Project Overview</span>
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
              {project.detailedDescription}
            </p>
          </div>

          {/* Key Features Grid */}
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">checklist</span>
              <span>Key Technical & Business Features</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 flex items-start gap-2.5"
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-500 shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span className="text-xs font-semibold text-on-surface leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack & Platform Compatibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-surface-container/40 border border-outline-variant/20 space-y-3">
              <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">code</span>
                <span>Technology Stack</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-surface-container-high text-on-surface font-mono text-xs font-bold border border-outline-variant/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container/40 border border-outline-variant/20 space-y-3">
              <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">info</span>
                <span>Compatibility & Specs</span>
              </h4>
              <div className="space-y-1.5 text-xs text-on-surface-variant">
                <div>
                  Version: <span className="font-bold text-on-surface">{project.version}</span>
                </div>
                <div>
                  Compatibility:{' '}
                  <span className="font-bold text-on-surface">{project.compatibility}</span>
                </div>
                <div>
                  Last Updated:{' '}
                  <span className="font-bold text-on-surface">{project.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Target Users & Business Use Cases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-sm text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">group</span>
                <span>Target Users & Organizations</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.targetUsers.map((usr, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold"
                  >
                    {usr}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">business_center</span>
                <span>Commercial Use Cases</span>
              </h4>
              <ul className="space-y-1 text-xs text-on-surface-variant list-disc list-inside">
                {project.businessUseCases.map((useCase, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Specifications Table */}
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">dataset</span>
              <span>Project Specifications Matrix</span>
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">
              <table className="w-full text-xs text-left border-collapse">
                <tbody>
                  <tr className="border-b border-outline-variant/15">
                    <td className="p-3 font-bold text-on-surface bg-surface-container/30 w-1/3">
                      Project ID
                    </td>
                    <td className="p-3 font-mono text-on-surface-variant">{project.id}</td>
                  </tr>
                  <tr className="border-b border-outline-variant/15">
                    <td className="p-3 font-bold text-on-surface bg-surface-container/30">
                      Creator / Publishing Lab
                    </td>
                    <td className="p-3 font-semibold text-on-surface">
                      {project.creatorName} ({project.creatorAffiliation})
                    </td>
                  </tr>
                  <tr className="border-b border-outline-variant/15">
                    <td className="p-3 font-bold text-on-surface bg-surface-container/30">
                      Target Platform
                    </td>
                    <td className="p-3 text-on-surface-variant">{project.platform}</td>
                  </tr>
                  <tr className="border-b border-outline-variant/15">
                    <td className="p-3 font-bold text-on-surface bg-surface-container/30">
                      Business Type
                    </td>
                    <td className="p-3 text-on-surface-variant">{project.businessType}</td>
                  </tr>
                  {project.additionalLicenseInfo && (
                    <tr>
                      <td className="p-3 font-bold text-on-surface bg-surface-container/30">
                        License Details
                      </td>
                      <td className="p-3 text-on-surface-variant">{project.additionalLicenseInfo}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security Audit & Verified Source Code Release */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-container/40 border border-outline-variant/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>Institutional Malware & CVE Security Certification</span>
                </div>
                <h4 className="text-sm font-bold text-on-surface mt-0.5">
                  Automated ClamAV & SonarQube Clean Build
                </h4>
                <p className="text-[11px] text-on-surface-variant">
                  Source code package audited for licensing compliance, malicious scripts, and hardcoded credentials.
                </p>
              </div>

              <button
                onClick={handleFetchDownload}
                disabled={isDownloading}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto hover:bg-emerald-500 shadow-md cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>{isDownloading ? 'Verifying Hashes...' : 'Download Verified Archive'}</span>
              </button>
            </div>

            {downloadInfo && (
              <div className="p-3.5 rounded-xl bg-black/50 text-slate-200 border border-emerald-500/30 text-[11px] space-y-1.5 font-mono">
                <div className="flex justify-between items-center text-emerald-400 font-bold">
                  <span>Status: {downloadInfo.securityAudit.scanStatus}</span>
                  <span>Scanner: {downloadInfo.securityAudit.scanner}</span>
                </div>
                <div className="text-on-surface-variant">
                  Package: <b className="text-white">{downloadInfo.fileName}</b> ({downloadInfo.fileSize})
                </div>
                <div className="text-[10px] break-all text-slate-400">
                  SHA-256: {downloadInfo.checksumSHA256}
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-emerald-400">CVE Audit: {downloadInfo.securityAudit.cveVulnerabilities}</span>
                  <a
                    href={downloadInfo.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded bg-secondary text-on-secondary font-sans font-bold text-xs inline-flex items-center gap-1 hover:brightness-110"
                  >
                    <span className="material-symbols-outlined text-[14px]">cloud_download</span>
                    <span>Download GCS Package</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Verified Customer Reviews Section */}
          <ProjectReviewsSection project={project} />
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container/30 flex items-center justify-between gap-4 shrink-0">
          <button
            onClick={() => onToggleCompare(project)}
            className="text-xs font-bold text-secondary flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
            <span>{isCompared ? 'In Comparison List' : 'Add to Comparison'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-colors cursor-pointer"
          >
            Close Page
          </button>
        </div>
      </div>
    </div>
  );
};
