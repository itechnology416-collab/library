import React, { useState } from 'react';
import { StoreProduct, ProductReview } from '../../types';

interface ProductDetailModalProps {
  product: StoreProduct | null;
  onClose: () => void;
  onAddToCart: (product: StoreProduct) => void;
  onBuyNow: (product: StoreProduct) => void;
  isInCart?: boolean;
  currentUser?: { id: string; name: string; email: string; role: string } | null;
  onReviewSubmitted?: () => void;
  isAdmin?: boolean;
  onGrantPermission?: (product: StoreProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isInCart = false,
  currentUser,
  onReviewSubmitted,
  isAdmin = false,
  onGrantPermission,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'preview' | 'versions' | 'reviews'>('overview');
  const [currentSamplePageIndex, setCurrentSamplePageIndex] = useState<number>(0);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewName, setReviewName] = useState<string>(currentUser?.name || '');
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);

  if (!product) return null;

  const samplePages = product.previewData?.samplePages || [];
  const sampleSlides = product.previewData?.sampleSlides || [];

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setReviewSubmitting(true);
    setReviewSuccessMsg(null);
    try {
      const res = await fetch(`/api/store/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          userName: reviewName || currentUser?.name || 'Scholar Reviewer',
          userEmail: currentUser?.email || 'scholar@wki.edu.et',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccessMsg('Review submitted successfully! Thank you.');
        setReviewComment('');
        if (onReviewSubmitted) onReviewSubmitted();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div
        id="product-detail-modal"
        className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              {product.productType} • {product.fileFormat}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">v{product.version}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/60 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Top Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Cover Image */}
            <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 shadow-sm aspect-[4/3] md:aspect-auto">
              <img
                src={product.thumbnailUrl}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="absolute top-3 right-3">
                {product.isFree ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-lg">
                    FREE DOWNLOAD
                  </span>
                ) : product.discountPercentage && product.discountPercentage > 0 ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-lg">
                    SAVE {product.discountPercentage}%
                  </span>
                ) : null}
              </div>
            </div>

            {/* Right Product Overview */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 mb-1">
                  <span className="font-semibold text-primary">{product.categoryLabel || product.category}</span>
                  <span>•</span>
                  <span>{product.subcategory}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                  {product.title}
                </h1>

                {/* Localized Titles if any */}
                {product.titleLocalized?.or && (
                  <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 italic mb-2">
                    {product.titleLocalized.or}
                  </p>
                )}

                {/* Ratings & Downloads bar */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-zinc-400 py-2 border-y border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined text-amber-400 text-base">star</span>
                    {product.rating?.toFixed(1) || '5.0'}
                    <span className="font-normal text-slate-400">({product.reviewCount || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-slate-400 text-base">download</span>
                    {product.downloadCount || 0} Downloads
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-slate-400 text-base">language</span>
                    {product.language}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-slate-400 text-base">schedule</span>
                    {product.pagesOrDuration || product.fileSize}
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {product.description}
                </div>
              </div>

              {/* Price & Purchase Actions */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    Instant Access Price
                  </div>
                  {product.isFree ? (
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      FREE OF CHARGE
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {product.priceETB}{' '}
                        <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">ETB</span>
                      </span>
                      {product.originalPriceETB && product.originalPriceETB > product.priceETB && (
                        <span className="text-sm text-slate-400 line-through">
                          {product.originalPriceETB} ETB
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {isAdmin && onGrantPermission && (
                    <button
                      type="button"
                      id={`btn-modal-grant-perm-${product.id}`}
                      onClick={() => onGrantPermission(product)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      title="Grant direct download permission to a student or faculty member"
                    >
                      <span className="material-symbols-outlined text-base">vpn_key</span>
                      Grant Permission
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 border ${
                      isInCart
                        ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                        : 'border-slate-300 dark:border-zinc-600 text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isInCart ? 'check' : 'shopping_cart'}
                    </span>
                    {isInCart ? 'In Cart' : 'Add to Cart'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onBuyNow(product)}
                    className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                      product.isFree ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:opacity-90'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {product.isFree ? 'download' : 'bolt'}
                    </span>
                    {product.isFree ? 'Claim Free Resource' : 'Buy Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Specifications & Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1 ${
                activeTab === 'preview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              Interactive Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('versions')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1 ${
                activeTab === 'versions'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">history</span>
              Version History
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1 ${
                activeTab === 'reviews'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">reviews</span>
              Reviews ({product.reviewCount || product.reviews?.length || 0})
            </button>
          </div>

          {/* Tab 1: Specifications */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 space-y-2.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-primary text-base">verified</span>
                  Academic & Technical Metadata
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400">Author / Creator:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{product.author}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400">Institutional Affiliation:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{product.authorAffiliation}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400">File Format:</span>
                  <span className="font-medium text-slate-900 dark:text-white font-mono">{product.fileFormat}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400">File Size:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{product.fileSize}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400">License:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{product.licenseType || 'Standard Personal'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-zinc-400">Allowed Downloads:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {product.maxDownloadsAllowed === 0 ? 'Unlimited' : `${product.maxDownloadsAllowed} Downloads`}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-base">shield_lock</span>
                  Security & Verification Guarantee
                </h4>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                  All digital assets hosted on Wirtuu Kompiitaraa Ilillii are scanned against malware, cryptographically signed with university DRM hashes, and supported with free version updates.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-[11px] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Interactive Preview */}
          {activeTab === 'preview' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">play_lesson</span>
                  Live Media & Sample Viewer
                </h4>
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  Watermarked sample for evaluation
                </span>
              </div>

              {/* Audio Preview */}
              {product.previewType === 'audio' && (
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">headphones</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{product.title}</div>
                      <div className="text-[11px] text-slate-500">Audio Sample Drills & Pronunciation</div>
                    </div>
                  </div>
                  <audio controls className="w-full">
                    <source src={product.previewData?.sampleAudioUrl || 'https://cdn.freesound.org/previews/560/560446_12239121-lq.mp3'} type="audio/mpeg" />
                    Your browser does not support audio playback.
                  </audio>
                </div>
              )}

              {/* Video Preview */}
              {product.previewType === 'video' && (
                <div className="rounded-2xl overflow-hidden bg-black aspect-video max-h-[340px]">
                  <video controls className="w-full h-full object-contain">
                    <source src={product.previewData?.sampleVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'} type="video/mp4" />
                    Your browser does not support HTML5 video.
                  </video>
                </div>
              )}

              {/* PDF Sample Pages */}
              {product.previewType === 'pdf_pages' && samplePages.length > 0 && (
                <div className="space-y-3">
                  <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 min-h-[160px] flex flex-col justify-between shadow-inner">
                    <div className="text-xs text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-bold">
                      Sample Page {currentSamplePageIndex + 1} of {samplePages.length}
                    </div>
                    <div className="text-sm font-serif text-slate-800 dark:text-zinc-200 my-4 leading-relaxed italic">
                      "{samplePages[currentSamplePageIndex]}"
                    </div>
                    <div className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-zinc-800 pt-2 flex items-center justify-between">
                      <span>Wirtuu Kompiitaraa Ilillii Educational Press</span>
                      <span>Confidential Sample</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      disabled={currentSamplePageIndex === 0}
                      onClick={() => setCurrentSamplePageIndex((prev) => Math.max(0, prev - 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-bold disabled:opacity-40"
                    >
                      ← Previous Sample
                    </button>
                    <span className="text-xs text-slate-500 font-mono">
                      {currentSamplePageIndex + 1} / {samplePages.length}
                    </span>
                    <button
                      type="button"
                      disabled={currentSamplePageIndex === samplePages.length - 1}
                      onClick={() => setCurrentSamplePageIndex((prev) => Math.min(samplePages.length - 1, prev + 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-bold disabled:opacity-40"
                    >
                      Next Sample →
                    </button>
                  </div>
                </div>
              )}

              {/* Slide Deck Preview */}
              {product.previewType === 'slide_deck' && sampleSlides.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sampleSlides.map((slide, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 shadow-sm">
                      <div className="text-[10px] font-bold text-primary uppercase">Slide {slide.slideNumber}</div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white mt-1">{slide.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">{slide.content}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Generic text preview fallback */}
              {(!product.previewType || product.previewType === 'text' || product.previewType === 'watermark_image') && (
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                  {product.previewData?.sampleText || 'Full package includes high-resolution source files, vector artwork, documentation, and installation manuals.'}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Version History */}
          {activeTab === 'versions' && (
            <div className="space-y-3">
              {(product.versionHistory || [
                {
                  version: product.version,
                  releaseDate: product.uploadDate,
                  changelog: 'Initial marketplace release.',
                  fileSize: product.fileSize,
                  fileName: product.fileName || 'file.zip',
                },
              ]).map((ver, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">Version {ver.version}</span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Current Stable
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-zinc-400 mt-1.5 leading-relaxed">{ver.changelog}</p>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">File: {ver.fileName} ({ver.fileSize})</div>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">{ver.releaseDate}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Reviews & Ratings */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Write Review Form */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Write a Customer Review</h4>
                {reviewSuccessMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                    {reviewSuccessMsg}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-600 dark:text-zinc-400">Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="text-lg focus:outline-none transition-transform hover:scale-125"
                      >
                        <span
                          className={`material-symbols-outlined ${
                            star <= reviewRating ? 'text-amber-400 font-variation-FILL' : 'text-slate-300 dark:text-zinc-600'
                          }`}
                        >
                          star
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </div>
                </div>

                <textarea
                  rows={2}
                  required
                  placeholder="Share your experience with this digital material, accuracy, and utility for learning..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={reviewSubmitting || !reviewComment.trim()}
                    className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:opacity-90 disabled:opacity-50"
                  >
                    {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {(!product.reviews || product.reviews.length === 0) ? (
                  <p className="text-xs text-slate-500 dark:text-zinc-400 italic text-center py-6">
                    No customer reviews yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{rev.userName}</span>
                          {rev.isVerifiedPurchase && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">verified</span> Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`material-symbols-outlined text-xs ${i < rev.rating ? 'font-variation-FILL' : 'text-slate-300 dark:text-zinc-700'}`}
                          >
                            star
                          </span>
                        ))}
                      </div>

                      <p className="text-slate-700 dark:text-zinc-300 leading-relaxed pt-1">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
