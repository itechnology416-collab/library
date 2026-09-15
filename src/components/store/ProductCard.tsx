import React from 'react';
import { StoreProduct } from '../../types';

interface ProductCardProps {
  product: StoreProduct;
  onSelect: (product: StoreProduct) => void;
  onAddToCart: (product: StoreProduct) => void;
  onQuickPreview?: (product: StoreProduct) => void;
  isInCart?: boolean;
  isAdmin?: boolean;
  onGrantPermission?: (product: StoreProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onQuickPreview,
  isInCart = false,
  isAdmin = false,
  onGrantPermission,
}) => {
  const getFormatBadgeColor = (format: string) => {
    switch (format.toUpperCase()) {
      case 'PDF':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30';
      case 'MP3':
      case 'WAV':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'MP4':
      case 'WEBM':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'PPTX':
      case 'PPT':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'ZIP':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Audio':
        return 'headphones';
      case 'Video':
        return 'play_circle';
      case 'Book':
        return 'menu_book';
      case 'Document':
        return 'description';
      case 'Graphics':
        return 'palette';
      case 'Software / Template':
        return 'code_blocks';
      default:
        return 'folder_zip';
    }
  };

  return (
    <div
      id={`store-card-${product.id}`}
      className="group relative flex flex-col rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Thumbnail & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-zinc-800 cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.thumbnailUrl}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border backdrop-blur-md ${getFormatBadgeColor(
              product.fileFormat
            )}`}
          >
            {product.fileFormat}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-black/60 text-white backdrop-blur-md border border-white/10 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">{getTypeIcon(product.productType)}</span>
            {product.productType}
          </span>
        </div>

        {/* Top Right Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {product.isFree ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md uppercase tracking-wider animate-pulse">
              FREE
            </span>
          ) : product.discountPercentage && product.discountPercentage > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-sm">
              -{product.discountPercentage}%
            </span>
          ) : null}
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">star</span> FEATURED
            </span>
          )}
        </div>

        {/* Quick Preview Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickPreview) onQuickPreview(product);
              else onSelect(product);
            }}
            className="px-4 py-2 rounded-xl bg-white/95 dark:bg-zinc-800/95 text-slate-900 dark:text-white font-medium text-xs shadow-lg backdrop-blur-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm text-primary">visibility</span>
            Quick Preview
          </button>
        </div>

        {/* Bottom Details Over Image */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-white/90">
          <span className="flex items-center gap-1 font-medium drop-shadow-sm">
            <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
            {product.rating?.toFixed(1) || '5.0'}
            <span className="text-white/60 text-[11px]">({product.reviewCount || 0})</span>
          </span>
          <span className="text-[11px] font-medium bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm text-white/80">
            {product.fileSize}
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Subcategory & Language */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 mb-1.5">
            <span className="font-medium text-primary line-clamp-1">{product.categoryLabel || product.subcategory || 'Resource'}</span>
            <span className="text-[11px] bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-zinc-400">
              {product.language}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(product)}
            className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 hover:text-primary transition-colors cursor-pointer mb-1.5"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Author & Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 mb-2.5">
            <span className="flex items-center gap-1 truncate max-w-[170px]" title={product.author}>
              <span className="material-symbols-outlined text-xs text-slate-400">person</span>
              {product.author}
            </span>
            <span className="text-[10px] font-mono text-slate-400">v{product.version}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Price Display */}
            <div>
              {product.isFree ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">FREE</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {product.priceETB}{' '}
                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">ETB</span>
                  </span>
                  {product.originalPriceETB && product.originalPriceETB > product.priceETB && (
                    <span className="text-xs text-slate-400 line-through">
                      {product.originalPriceETB} ETB
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              {isAdmin && onGrantPermission && (
                <button
                  type="button"
                  id={`btn-grant-perm-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onGrantPermission(product);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1"
                  title="Grant direct download permission to a user"
                >
                  <span className="material-symbols-outlined text-sm">vpn_key</span>
                  Grant
                </button>
              )}
              <button
                type="button"
                id={`btn-select-${product.id}`}
                onClick={() => onSelect(product)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-medium transition-colors"
                title="View Full Product Details"
              >
                Details
              </button>
              <button
                type="button"
                id={`btn-cart-${product.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95 ${
                  isInCart
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : product.isFree
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-primary text-white hover:opacity-90'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {isInCart ? 'check' : product.isFree ? 'download' : 'shopping_cart'}
                </span>
                {isInCart ? 'In Cart' : product.isFree ? 'Get Free' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
