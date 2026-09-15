import React, { useState, useEffect } from 'react';
import { StoreDownloadPermission, StoreOrder, StoreProduct } from '../../types';
import { InteractiveReaderModal } from './InteractiveReaderModal';

interface MyLibraryPageProps {
  currentUser?: { id: string; name: string; email: string; role: string } | null;
  onBrowseStore: () => void;
  onSelectProduct?: (product: StoreProduct) => void;
}

export const MyLibraryPage: React.FC<MyLibraryPageProps> = ({
  currentUser,
  onBrowseStore,
  onSelectProduct,
}) => {
  const [lookupEmail, setLookupEmail] = useState<string>(currentUser?.email || '');
  const [libraryItems, setLibraryItems] = useState<StoreDownloadPermission[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<StoreOrder | null>(null);
  const [activeTab, setActiveTab] = useState<'downloads' | 'orders'>('downloads');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [readerItem, setReaderItem] = useState<{ product: any; permission: any } | null>(null);

  const fetchLibrary = async (emailToFetch: string) => {
    if (!emailToFetch.trim()) return;
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/store/library?email=${encodeURIComponent(emailToFetch.trim())}`);
      const data = await res.json();
      if (data.success) {
        setLibraryItems(data.library || []);
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching library:', err);
      setMessage('Failed to load library items.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      setLookupEmail(currentUser.email);
      fetchLibrary(currentUser.email);
    }
  }, [currentUser]);

  const handleDownload = async (permission: StoreDownloadPermission) => {
    setDownloadingId(permission.id);
    setMessage(null);

    try {
      const downloadUrl = `/api/store/download/${permission.id}`;
      // Trigger browser download via hidden link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${permission.productTitle.replace(/\s+/g, '_')}_v${permission.version || '1.0'}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Re-fetch library to update download count
      setTimeout(() => {
        fetchLibrary(lookupEmail);
      }, 1000);
    } catch (err) {
      console.error('Download error:', err);
      setMessage('Download failed or limit exceeded.');
    } finally {
      setDownloadingId(null);
    }
  };

  const getFormatBadgeColor = (format: string) => {
    switch (format?.toUpperCase()) {
      case 'PDF':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30';
      case 'MP3':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'MP4':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'PPTX':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-primary text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20 uppercase tracking-widest text-emerald-300">
                Authorized Vault
              </span>
              <span className="text-xs text-slate-300">DRM Protected</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              My Digital Learning Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Access your verified books, audio masterclasses, cybersecurity manuals, and software templates. Download files securely with official lifetime updates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBrowseStore}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 shadow-md transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">storefront</span>
              Explore Store
            </button>
          </div>
        </div>

        {/* Email Lookup Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">mail</span>
            <input
              type="email"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              placeholder="Enter your purchase email..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none backdrop-blur-md"
            />
          </div>
          <button
            type="button"
            onClick={() => fetchLibrary(lookupEmail)}
            disabled={isLoading || !lookupEmail.trim()}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            {isLoading ? 'Loading...' : 'Sync Vault'}
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          {message}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-zinc-800 pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('downloads')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'downloads'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">download_done</span>
          Active Downloads ({libraryItems.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">receipt_long</span>
          Orders & Tax Invoices ({orders.length})
        </button>
      </div>

      {/* TAB 1: ACTIVE DOWNLOADS */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          {libraryItems.length === 0 && !isLoading ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-200/60 dark:bg-zinc-800 flex items-center justify-center text-slate-400 mx-auto">
                <span className="material-symbols-outlined text-3xl">folder_off</span>
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-zinc-200">No Digital Products Found</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                If you recently submitted payment via CBE or Telebirr, your items will appear as soon as the administrator verifies your transaction reference.
              </p>
              <button
                type="button"
                onClick={onBrowseStore}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:opacity-90 shadow-md"
              >
                Browse Available Courses & Books
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraryItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getFormatBadgeColor(
                          item.fileFormat
                        )}`}
                      >
                        {item.fileFormat}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">v{item.currentVersion}</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                        {item.productTitle}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                        Unlocked on: {new Date(item.grantedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-[11px] space-y-1">
                      <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                        <span>Downloads Used:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.downloadCount} / {item.maxDownloadsAllowed === 0 ? '∞ Unlimited' : item.maxDownloadsAllowed}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                        <span>Access Status:</span>
                        <span className={`font-bold ${item.isRevoked ? 'text-red-500' : 'text-emerald-500'}`}>
                          {item.isRevoked ? 'Revoked' : 'Active & Verified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-2">
                    <button
                      type="button"
                      onClick={() =>
                        setReaderItem({
                          product: {
                            id: item.productId,
                            title: item.productTitle,
                            author: 'Haramaya University Press Author',
                            fileFormat: item.fileFormat,
                            productType: item.fileFormat === 'MP3' ? 'Audio Masterclass' : 'eBook / Digital Manual',
                            version: item.currentVersion,
                            description: 'Full verified digital asset unlocked in user library vault.',
                          },
                          permission: item,
                        })
                      }
                      className="w-full py-2 rounded-xl bg-sky-600/10 hover:bg-sky-600/20 text-sky-400 font-bold text-xs border border-sky-500/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">chrome_reader_mode</span>
                      <span>Read / Listen Online</span>
                    </button>

                    <button
                      type="button"
                      disabled={item.isRevoked || downloadingId === item.id}
                      onClick={() => handleDownload(item)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      {downloadingId === item.id ? 'Authorizing Secure Package...' : 'Download Package'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ORDERS & TAX INVOICES */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-zinc-800/70 border-b border-slate-200 dark:border-zinc-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No orders recorded for this email.
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                        <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                          {ord.orderNumber}
                        </td>
                        <td className="p-4 text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 font-medium text-slate-800 dark:text-zinc-200">
                          {ord.items.length} item(s)
                        </td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          {ord.isFreeOrder ? 'FREE' : `${ord.totalETB} ETB`}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                            {ord.paymentProvider || 'Instant Claim'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              ord.status === 'COMPLETED'
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : ord.status === 'PAYMENT_SUBMITTED'
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoice(ord)}
                            className="px-3 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 font-bold text-primary text-[11px] inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">receipt</span>
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL DIGITAL INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 shadow-2xl space-y-6 text-xs animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg">
                  W
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Wirtuu Kompiitaraa Ilillii
                  </h3>
                  <p className="text-[10px] text-slate-400">Digital Resource Distribution & Learning Press</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Invoice / Order Ref</span>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedInvoice.orderNumber}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Issued To</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedInvoice.customerName}</div>
                <div className="text-[11px] text-slate-500">{selectedInvoice.customerEmail}</div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Purchased Digital Assets</span>
              <div className="border border-slate-200 dark:border-zinc-800 rounded-xl divide-y divide-slate-100 dark:divide-zinc-800">
                {selectedInvoice.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{it.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Format: {it.fileFormat}</div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {it.priceETB === 0 ? 'FREE' : `${it.priceETB} ETB`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Calculation */}
            <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Payment Channel:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {selectedInvoice.paymentProvider || 'Free Grant'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-zinc-800">
                <span>Total Paid:</span>
                <span>{selectedInvoice.isFreeOrder ? '0.00 ETB' : `${selectedInvoice.totalETB} ETB`}</span>
              </div>
            </div>

            {/* Official Stamp & Close */}
            <div className="pt-4 border-t border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="material-symbols-outlined text-sm">verified</span>
                Cryptographically Signed Seal
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Interactive In-Browser Reader Modal */}
      {readerItem && (
        <InteractiveReaderModal
          isOpen={!!readerItem}
          onClose={() => setReaderItem(null)}
          product={readerItem.product}
          permission={readerItem.permission}
        />
      )}
    </div>
  );
};
