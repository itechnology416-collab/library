import React from 'react';
import { MarketplaceProject } from '../../types/marketplace';

interface ProjectCardProps {
  project: MarketplaceProject;
  onViewDetails: (project: MarketplaceProject) => void;
  onRequestAction: (project: MarketplaceProject) => void;
  isFavorite: boolean;
  onToggleFavorite: (projectId: string) => void;
  isCompared: boolean;
  onToggleCompare: (project: MarketplaceProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  onRequestAction,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
}) => {
  return (
    <div className="group rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Thumbnail & Badges */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 font-bold text-[11px] border border-amber-400/30 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">category</span>
            <span>{project.category}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {project.isFeatured && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">star</span>
                <span>Featured</span>
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(project.id);
              }}
              className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-black/50 text-white/80 hover:bg-black/80 hover:text-white'
              }`}
              title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isFavorite ? 'favorite' : 'favorite_border'}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Platform & Status */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10 text-[11px]">
          <span className="px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-md text-white font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">devices</span>
            <span>{project.platform}</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/80 backdrop-blur-md text-white font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            <span>{project.status}</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3
            onClick={() => onViewDetails(project)}
            className="font-bold text-base sm:text-lg text-on-surface hover:text-secondary cursor-pointer transition-colors line-clamp-1 mb-1.5"
            title={project.title}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-3">
            {project.shortDescription}
          </p>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-mono font-semibold border border-outline-variant/20"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md bg-surface-container text-secondary text-[10px] font-mono font-bold">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Price & Creator Footer */}
        <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Creator
            </div>
            <div className="text-xs font-bold text-on-surface truncate max-w-[120px]" title={project.creatorName}>
              {project.creatorName}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Listing Price
            </div>
            <div className="text-xs sm:text-sm font-bold text-secondary font-mono">
              {project.pricingType === 'Free'
                ? 'FREE OPEN ACCESS'
                : project.priceETB
                ? `${project.priceETB.toLocaleString()} ETB`
                : 'Contact for Quote'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-outline-variant/15 grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(project)}
            className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>View Details</span>
          </button>

          <button
            onClick={() => onRequestAction(project)}
            className="py-2 px-3 rounded-xl bg-secondary text-on-secondary hover:brightness-105 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">handshake</span>
            <span>Request</span>
          </button>
        </div>

        {/* Compare Toggle Footnote */}
        <div className="mt-2 text-right">
          <button
            onClick={() => onToggleCompare(project)}
            className={`text-[10px] font-bold flex items-center justify-end gap-1 ml-auto cursor-pointer transition-colors ${
              isCompared ? 'text-secondary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isCompared ? 'check_box' : 'check_box_outline_blank'}
            </span>
            <span>{isCompared ? 'Added to Compare' : 'Compare Project'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
