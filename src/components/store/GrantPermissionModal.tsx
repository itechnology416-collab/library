import React, { useState, useEffect } from 'react';
import { StoreProduct } from '../../types';

interface GrantPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: StoreProduct[];
  preselectedProduct?: StoreProduct | null;
  onSuccess?: (msg: string) => void;
}

interface CustomerUser {
  email: string;
  name: string;
  totalOrders: number;
  activeLicenses: number;
}

export const GrantPermissionModal: React.FC<GrantPermissionModalProps> = ({
  isOpen,
  onClose,
  products,
  preselectedProduct,
  onSuccess,
}) => {
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [grantScope, setGrantScope] = useState<'single' | 'category' | 'all'>('single');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [grantReason, setGrantReason] = useState<string>('Institutional Scholarship & Faculty Waiver');
  const [maxDownloads, setMaxDownloads] = useState<number>(0); // 0 = unlimited
  const [knownUsers, setKnownUsers] = useState<CustomerUser[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (preselectedProduct) {
      setGrantScope('single');
      setSelectedProductId(preselectedProduct.id);
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [preselectedProduct, products]);

  useEffect(() => {
    if (isOpen) {
      // Fetch known store users
      fetch('/api/store/admin/users')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.users)) {
            setKnownUsers(data.users);
          }
        })
        .catch((err) => console.warn('Could not fetch store users:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectUser = (u: CustomerUser) => {
    setRecipientEmail(u.email);
    setRecipientName(u.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail.trim()) {
      setFeedback({ type: 'error', message: 'Recipient email address is required.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        userEmail: recipientEmail.trim(),
        userName: recipientName.trim(),
        productId: grantScope === 'single' ? selectedProductId : grantScope === 'all' ? 'ALL_PRODUCTS' : undefined,
        category: grantScope === 'category' ? selectedCategory : undefined,
        grantReason: grantReason.trim(),
        maxDownloads: maxDownloads,
      };

      const res = await fetch('/api/store/admin/grant-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const msg = data.message || `Permission successfully granted to ${recipientEmail}!`;
        setFeedback({ type: 'success', message: msg });
        if (onSuccess) onSuccess(msg);
        setTimeout(() => {
          onClose();
        }, 1600);
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to grant download permission.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Server connection error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">vpn_key</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Admin Digital Store Permission Manager
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Issue instant download & reading authorizations without requiring payment.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-zinc-300">
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl border font-medium flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {feedback.type === 'success' ? 'check_circle' : 'error'}
              </span>
              {feedback.message}
            </div>
          )}

          {/* Quick Select Known Registered Users / Students */}
          {knownUsers.length > 0 && (
            <div>
              <label className="block font-bold mb-1.5 text-slate-800 dark:text-zinc-200">
                Quick Select Registered User / Scholar:
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800">
                {knownUsers.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => handleSelectUser(u)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all ${
                      recipientEmail.toLowerCase() === u.email.toLowerCase()
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:border-primary'
                    }`}
                  >
                    👤 {u.name} <span className="opacity-70">({u.email})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Recipient Email & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1 text-slate-800 dark:text-zinc-200">
                  Recipient Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="e.g. scholar@wki.edu.et"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-800 dark:text-zinc-200">
                  Recipient Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Dr. Bonsa Worku"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Grant Scope Selection */}
            <div>
              <label className="block font-bold mb-1.5 text-slate-800 dark:text-zinc-200">
                Select Permission Scope *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setGrantScope('single')}
                  className={`p-2.5 rounded-2xl border text-center font-bold transition-all ${
                    grantScope === 'single'
                      ? 'bg-primary/10 border-primary text-primary dark:text-primary-light shadow-xs'
                      : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-base block mb-0.5">description</span>
                  Single Item
                </button>

                <button
                  type="button"
                  onClick={() => setGrantScope('category')}
                  className={`p-2.5 rounded-2xl border text-center font-bold transition-all ${
                    grantScope === 'category'
                      ? 'bg-primary/10 border-primary text-primary dark:text-primary-light shadow-xs'
                      : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-base block mb-0.5">category</span>
                  Category Pack
                </button>

                <button
                  type="button"
                  onClick={() => setGrantScope('all')}
                  className={`p-2.5 rounded-2xl border text-center font-bold transition-all ${
                    grantScope === 'all'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 shadow-xs'
                      : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-base block mb-0.5">stars</span>
                  All Store Items 🌟
                </button>
              </div>
            </div>

            {/* Product or Category Dropdown based on Scope */}
            {grantScope === 'single' && (
              <div>
                <label className="block font-bold mb-1 text-slate-800 dark:text-zinc-200">
                  Select Product *
                </label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.fileFormat}] {p.title} ({p.priceETB} ETB - v{p.version})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {grantScope === 'category' && (
              <div>
                <label className="block font-bold mb-1 text-slate-800 dark:text-zinc-200">
                  Select Category *
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="books">📚 Educational Books & Research Manuals</option>
                  <option value="religious_culture">🏛️ Religious, Cultural & Oromo Heritage Literature</option>
                  <option value="graphic_templates">🎨 Graphic Design & Academic Templates</option>
                  <option value="cybersecurity">🛡️ Cybersecurity & IT Technical Guides</option>
                  <option value="audiobooks">🎧 Audiobooks & Spoken Lectures</option>
                </select>
              </div>
            )}

            {/* Download Limit & Reason */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1 text-slate-800 dark:text-zinc-200">
                  Max Allowed Downloads
                </label>
                <select
                  value={maxDownloads}
                  onChange={(e) => setMaxDownloads(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value={0}>♾️ Unlimited Downloads (Recommended)</option>
                  <option value={10}>10 Download Operations</option>
                  <option value={5}>5 Download Operations</option>
                  <option value={1}>Single Download Only (1)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-800 dark:text-zinc-200">
                  Reason / Institutional Note
                </label>
                <input
                  type="text"
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  placeholder="e.g. Faculty Waiver / Academic Grant"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 font-bold text-slate-700 dark:text-zinc-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !recipientEmail.trim()}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold shadow-md hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Grant...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">verified_user</span>
                    Grant Download Permission
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
