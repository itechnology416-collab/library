import React, { useState, useEffect } from 'react';
import { MarketplaceProject, MarketplaceReview } from '../../types/marketplace';
import { useAuth } from '../../context/AuthContext';

interface ProjectReviewsSectionProps {
  project: MarketplaceProject;
}

export const ProjectReviewsSection: React.FC<ProjectReviewsSectionProps> = ({ project }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<MarketplaceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Form State
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [reviewerOrg, setReviewerOrg] = useState('');
  const [overallRating, setOverallRating] = useState(5);
  const [codeQuality, setCodeQuality] = useState(5);
  const [documentation, setDocumentation] = useState(5);
  const [easeOfSetup, setEaseOfSetup] = useState(5);
  const [support, setSupport] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/marketplace/reviews?projectId=${project.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      })
      .catch((err) => console.warn('Could not load reviews:', err))
      .finally(() => setLoading(false));
  }, [project.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      alert('Please fill out the review title and comment.');
      return;
    }
    setIsSubmitting(true);

    const payload = {
      projectId: project.id,
      reviewerName: reviewerName || user?.name || 'Verified Scholar',
      reviewerOrganization: reviewerOrg || 'Academic Partner',
      overallRating,
      codeQualityRating: codeQuality,
      documentationRating: documentation,
      easeOfSetupRating: easeOfSetup,
      supportRating: support,
      title: reviewTitle,
      comment: reviewComment,
    };

    try {
      const res = await fetch('/api/marketplace/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews([data.review, ...reviews]);
        setShowReviewModal(false);
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err) {
      console.warn('Review submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate averages
  const averageOverall = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const avgCode = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.codeQualityRating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const avgDoc = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.documentationRating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const avgEase = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.easeOfSetupRating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const avgSupport = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.supportRating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-4 pt-4 border-t border-outline-variant/20">
      {/* Header & Write Review Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">hotel_class</span>
            <span>Verified Customer Reviews & Rating Breakdown</span>
          </h4>
          <p className="text-[11px] text-on-surface-variant">
            Multi-criteria evaluations by verified institutional adopters and commercial clients.
          </p>
        </div>

        <button
          onClick={() => setShowReviewModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer hover:brightness-105 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">rate_review</span>
          <span>Write Verified Review</span>
        </button>
      </div>

      {/* Rating Breakdown Grid */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-4 rounded-2xl bg-surface-container/40 border border-outline-variant/15 text-xs">
          <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-outline-variant/20 pb-2 sm:pb-0">
            <div className="text-3xl font-extrabold text-on-surface font-mono">{averageOverall}</div>
            <div className="flex text-amber-500 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="material-symbols-outlined text-[16px]">
                  {s <= Math.round(Number(averageOverall)) ? 'star' : 'star_outline'}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-on-surface-variant font-semibold">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>

          <div className="flex flex-col justify-center space-y-1">
            <span className="text-[10px] font-semibold text-on-surface-variant">Code Quality</span>
            <div className="text-sm font-extrabold text-on-surface font-mono">{avgCode} / 5.0</div>
          </div>

          <div className="flex flex-col justify-center space-y-1">
            <span className="text-[10px] font-semibold text-on-surface-variant">Documentation</span>
            <div className="text-sm font-extrabold text-on-surface font-mono">{avgDoc} / 5.0</div>
          </div>

          <div className="flex flex-col justify-center space-y-1">
            <span className="text-[10px] font-semibold text-on-surface-variant">Ease of Setup</span>
            <div className="text-sm font-extrabold text-on-surface font-mono">{avgEase} / 5.0</div>
          </div>

          <div className="flex flex-col justify-center space-y-1">
            <span className="text-[10px] font-semibold text-on-surface-variant">Support</span>
            <div className="text-sm font-extrabold text-on-surface font-mono">{avgSupport} / 5.0</div>
          </div>
        </div>
      )}

      {/* Reviews List or Empty State */}
      {reviews.length === 0 ? (
        <div className="p-6 text-center rounded-2xl bg-surface-container/30 border border-outline-variant/15 space-y-2">
          <span className="material-symbols-outlined text-[32px] text-on-surface-variant opacity-40">
            reviews
          </span>
          <div className="font-bold text-xs text-on-surface">No verified reviews yet for this project</div>
          <p className="text-[11px] text-on-surface-variant max-w-sm mx-auto">
            Reviews only unlock for verified purchasers and adopters who have evaluated this application.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-secondary/15 text-secondary font-bold flex items-center justify-center text-xs">
                    {r.reviewerName[0]}
                  </div>
                  <div>
                    <span className="font-bold text-on-surface">{r.reviewerName}</span>
                    {r.reviewerOrganization && (
                      <span className="text-[10px] text-on-surface-variant ml-1 font-medium">
                        • {r.reviewerOrganization}
                      </span>
                    )}
                  </div>
                  {r.isVerifiedBuyer && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-bold text-[9px] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      <span>Verified Adopter</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="material-symbols-outlined text-[14px]">
                        {s <= r.overallRating ? 'star' : 'star_outline'}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-on-surface-variant ml-1">
                    {r.createdAt?.split('T')[0]}
                  </span>
                </div>
              </div>

              <div className="font-bold text-on-surface text-[12px]">{r.title}</div>
              <p className="text-on-surface leading-relaxed text-[11px]">{r.comment}</p>

              <div className="flex flex-wrap gap-3 pt-1 text-[10px] text-on-surface-variant font-mono">
                <span>Code: <b className="text-on-surface">{r.codeQualityRating}/5</b></span>
                <span>Docs: <b className="text-on-surface">{r.documentationRating}/5</b></span>
                <span>Setup: <b className="text-on-surface">{r.easeOfSetupRating}/5</b></span>
                <span>Support: <b className="text-on-surface">{r.supportRating}/5</b></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal Form */}
      {showReviewModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                  Quality Audit Feedback
                </span>
                <h3 className="text-base font-bold text-on-surface">Submit Verified Review</h3>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 rounded-lg bg-surface-container text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Your Name</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    required
                    className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Organization / Dept</label>
                  <input
                    type="text"
                    value={reviewerOrg}
                    onChange={(e) => setReviewerOrg(e.target.value)}
                    placeholder="e.g. Haramaya College of Computing"
                    className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                  />
                </div>
              </div>

              {/* Multi-Criteria Ratings */}
              <div className="space-y-2 p-3 rounded-2xl bg-surface-container/50 border border-outline-variant/20">
                <span className="font-bold text-on-surface block text-[11px]">Evaluation Scores (1 to 5):</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between">
                    <span>Overall:</span>
                    <select
                      value={overallRating}
                      onChange={(e) => setOverallRating(Number(e.target.value))}
                      className="p-1 rounded bg-surface-container font-mono font-bold"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} Stars</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Code Quality:</span>
                    <select
                      value={codeQuality}
                      onChange={(e) => setCodeQuality(Number(e.target.value))}
                      className="p-1 rounded bg-surface-container font-mono font-bold"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} / 5</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Documentation:</span>
                    <select
                      value={documentation}
                      onChange={(e) => setDocumentation(Number(e.target.value))}
                      className="p-1 rounded bg-surface-container font-mono font-bold"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} / 5</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Ease of Setup:</span>
                    <select
                      value={easeOfSetup}
                      onChange={(e) => setEaseOfSetup(Number(e.target.value))}
                      className="p-1 rounded bg-surface-container font-mono font-bold"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} / 5</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Headline Summary</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Robust architecture, easy to deploy"
                  required
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Detailed Technical Feedback</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Detail your deployment experience, code quality, and commercial reliability..."
                  required
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer hover:brightness-105"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>{isSubmitting ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
