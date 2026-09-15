import React, { useState, useEffect } from 'react';
import {
  StoreProduct,
  StoreOrder,
  StoreCoupon,
  StoreSettings,
  StoreDownloadPermission,
  StoreAuditLog,
  StoreProductType,
} from '../../types';

interface AdminStoreDashboardProps {
  currentUser?: { id: string; name: string; email: string; role: string } | null;
  onClose?: () => void;
}

export const AdminStoreDashboard: React.FC<AdminStoreDashboardProps> = ({
  currentUser,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'products' | 'payments' | 'orders' | 'grant' | 'coupons' | 'licenses' | 'settings' | 'audit'
  >('products');

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [coupons, setCoupons] = useState<StoreCoupon[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [permissions, setPermissions] = useState<StoreDownloadPermission[]>([]);
  const [auditLogs, setAuditLogs] = useState<StoreAuditLog[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states for Product Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Partial<StoreProduct> | null>(null);

  // Form state for Grant Access
  const [grantEmail, setGrantEmail] = useState<string>('');
  const [grantProductId, setGrantProductId] = useState<string>('');
  const [grantReason, setGrantReason] = useState<string>('Academic Scholarship / Faculty Waiver');

  // Form state for Coupon
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(15);
  const [couponType, setCouponType] = useState<'PERCENTAGE' | 'FIXED_ETB'>('PERCENTAGE');

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Products
      const pRes = await fetch('/api/store/products?all=true');
      const pData = await pRes.json();
      if (pData.success) setProducts(pData.products || []);

      // Orders
      const oRes = await fetch('/api/store/admin/orders');
      const oData = await oRes.json();
      if (oData.success) setOrders(oData.orders || []);

      // Settings
      const sRes = await fetch('/api/store/settings');
      const sData = await sRes.json();
      if (sData.success) setSettings(sData.settings || null);

      // Coupons
      const cRes = await fetch('/api/store/admin/coupons');
      const cData = await cRes.json();
      if (cData.success) setCoupons(cData.coupons || []);

      // Permissions
      const permRes = await fetch('/api/store/admin/permissions');
      const permData = await permRes.json();
      if (permData.success) setPermissions(permData.permissions || []);

      // Analytics
      const aRes = await fetch('/api/store/admin/analytics');
      const aData = await aRes.json();
      if (aData.success) setAnalytics(aData);

      // Audit Logs
      const auditRes = await fetch('/api/store/admin/audit-logs');
      const auditData = await auditRes.json();
      if (auditData.success) setAuditLogs(auditData.logs || []);
    } catch (err) {
      console.error('Error loading admin store data:', err);
      setMessage({ type: 'error', text: 'Failed to load administrative data.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerifyPayment = async (orderId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/store/admin/orders/${orderId}/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          adminName: currentUser?.name || 'Admin',
          adminEmail: currentUser?.email || 'admin@wki.edu.et',
          rejectionReason: action === 'reject' ? 'Transaction ID not verified on bank ledger.' : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({
          type: 'success',
          text: `Order payment has been ${action === 'approve' ? 'APPROVED & Unlocked' : 'REJECTED'}.`,
        });
        loadData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Operation failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server communication failure.' });
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title) return;

    try {
      const isEditing = Boolean(editingProduct.id);
      const url = isEditing
        ? `/api/store/admin/products/${editingProduct.id}`
        : '/api/store/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingProduct,
          author: editingProduct.author || currentUser?.name || 'Wirtuu Kompiitaraa Ilillii',
          priceETB: Number(editingProduct.priceETB) || 0,
          isFree: editingProduct.isFree || Number(editingProduct.priceETB) === 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({
          type: 'success',
          text: `Product "${data.product.title}" saved successfully.`,
        });
        setIsProductModalOpen(false);
        setEditingProduct(null);
        loadData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save product.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving product.' });
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/store/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Product "${title}" deleted.` });
        loadData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete product.' });
    }
  };

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim() || !grantProductId) return;

    try {
      const res = await fetch('/api/store/admin/grant-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: grantEmail.trim(),
          userName: grantEmail.split('@')[0],
          productId: grantProductId,
          reason: grantReason,
          grantedBy: currentUser?.name || 'Admin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Access granted directly to ${grantEmail}.` });
        setGrantEmail('');
        loadData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Grant failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error granting access.' });
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      const res = await fetch('/api/store/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          discountType: couponType,
          discountValue: Number(couponDiscount),
          minOrderETB: 0,
          maxUses: 100,
          expiresAt: '2026-12-31',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Coupon ${data.coupon.code} created.` });
        setCouponCode('');
        loadData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error creating coupon.' });
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/store/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Payment numbers and store settings updated!' });
        loadData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error updating settings.' });
    }
  };

  const handleRevokePermission = async (permId: string, currentRevoked: boolean) => {
    try {
      const res = await fetch(`/api/store/admin/permissions/${permId}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isRevoked: !currentRevoked,
          reason: !currentRevoked ? 'Administrative audit revocation' : 'Restored',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Permission ${!currentRevoked ? 'revoked' : 'restored'}.` });
        loadData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update license state.' });
    }
  };

  const pendingPayments = orders.filter((o) => o.status === 'PAYMENT_SUBMITTED');

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary-light border border-primary/30 uppercase tracking-widest">
              Administrator Console
            </span>
            <span className="text-xs text-slate-400">Digital Marketplace Operations</span>
          </div>
          <h1 className="text-2xl font-black mt-2">Wirtuu Kompiitaraa Ilillii Store Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage products, verify Ethiopian bank deposits, grant scholar waivers, audit licenses & DRM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setEditingProduct({
                title: '',
                description: '',
                category: 'Books',
                categoryLabel: 'Academic & Training Books',
                subcategory: 'E-Books',
                productType: 'Book',
                fileFormat: 'PDF',
                fileSize: '15.4 MB',
                priceETB: 250,
                originalPriceETB: 350,
                isFree: false,
                language: 'Afaan Oromoo / English',
                author: currentUser?.name || 'Wirtuu Kompiitaraa Ilillii',
                authorAffiliation: 'Wirtuu Kompiitaraa Ilillii Faculty',
                status: 'PUBLISHED',
                version: '1.0.0',
                maxDownloadsAllowed: 10,
                tags: ['Handbook', 'Education'],
                thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
              });
              setIsProductModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:opacity-90 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add New Product
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              Back to Store
            </button>
          )}
        </div>
      </div>

      {/* Analytics KPI Row */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Verified Revenue</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {analytics.totalRevenueETB?.toLocaleString() || 0}{' '}
              <span className="text-xs text-slate-400 font-normal">ETB</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">From completed orders</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Pending Verifications</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {analytics.pendingPaymentCount || pendingPayments.length}
            </div>
            <div className="text-[11px] text-amber-500 font-semibold mt-1">Awaiting bank check</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Total Products</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {products.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Books, Audio, Video, Templates</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Active Licenses</span>
            <div className="text-2xl font-black text-primary mt-1">
              {permissions.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Authorized student grants</div>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {message.text}
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2 text-xs">
        {[
          { id: 'products', name: 'Product Catalog', icon: 'inventory_2', count: products.length },
          { id: 'payments', name: 'Pending Payments', icon: 'payments', count: pendingPayments.length, alert: pendingPayments.length > 0 },
          { id: 'orders', name: 'All Orders', icon: 'receipt_long', count: orders.length },
          { id: 'grant', name: 'Grant Free Access', icon: 'card_membership' },
          { id: 'coupons', name: 'Coupons & Promos', icon: 'sell', count: coupons.length },
          { id: 'licenses', name: 'Permissions & DRM', icon: 'vpn_key', count: permissions.length },
          { id: 'settings', name: 'Payment Numbers', icon: 'account_balance' },
          { id: 'audit', name: 'Audit Trail', icon: 'history', count: auditLogs.length },
        ].map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.name}
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  tab.alert
                    ? 'bg-red-500 text-white animate-pulse'
                    : activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: PRODUCT CATALOG */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-zinc-800/70 border-b border-slate-200 dark:border-zinc-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Format / Type</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Version</th>
                    <th className="p-4">Downloads</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.thumbnailUrl}
                            alt={p.title}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-zinc-800 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.title}</div>
                            <div className="text-[11px] text-slate-500">{p.author} • {p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                          {p.fileFormat}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1.5">{p.productType}</span>
                      </td>
                      <td className="p-4 font-bold">
                        {p.isFree ? (
                          <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
                        ) : (
                          <span>{p.priceETB} ETB</span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-slate-500">v{p.version}</td>
                      <td className="p-4 text-slate-600 dark:text-zinc-400">{p.downloadCount || 0}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'PUBLISHED'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(p);
                            setIsProductModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-primary font-bold text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 font-bold text-[11px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PENDING PAYMENTS VERIFICATION QUEUE */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {pendingPayments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
              <span className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
              <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200">No Pending Payments</h3>
              <p className="text-xs text-slate-500">All customer bank and Telebirr submissions have been processed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingPayments.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 rounded-3xl border border-amber-200 dark:border-amber-900/50 bg-white dark:bg-zinc-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {ord.orderNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase">
                        {ord.paymentProvider || 'Telebirr / CBE'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div>
                        <strong>Customer:</strong> {ord.customerName} ({ord.customerEmail})
                      </div>
                      <div>
                        <strong>Transaction Ref:</strong>{' '}
                        <span className="font-mono font-bold text-primary px-2 py-0.5 bg-primary/10 rounded">
                          {ord.transactionReference}
                        </span>
                      </div>
                      <div>
                        <strong>Amount Transferred:</strong>{' '}
                        <span className="font-black text-slate-900 dark:text-white">{ord.totalETB} ETB</span>
                      </div>
                      {ord.paymentSubmission?.notes && (
                        <div className="text-slate-500 italic">"{ord.paymentSubmission.notes}"</div>
                      )}
                    </div>

                    <div className="pt-2 text-[11px] text-slate-500">
                      Purchased Items ({ord.items.length}):{' '}
                      {ord.items.map((i) => i.title).join(', ')}
                    </div>
                  </div>

                  {/* Verification Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleVerifyPayment(ord.id, 'approve')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">verified</span>
                      Approve & Grant DRM Access
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVerifyPayment(ord.id, 'reject')}
                      className="px-4 py-2.5 rounded-xl border border-red-300 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-xs transition-colors"
                    >
                      Reject Slip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ALL ORDERS */}
      {activeTab === 'orders' && (
        <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-zinc-800/70 border-b border-slate-200 dark:border-zinc-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total ETB</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{o.orderNumber}</td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white">{o.customerName}</div>
                      <div className="text-[11px] text-slate-500">{o.customerEmail}</div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-zinc-400">{o.items.length} item(s)</td>
                    <td className="p-4 font-bold">{o.isFreeOrder ? 'FREE' : `${o.totalETB} ETB`}</td>
                    <td className="p-4 font-mono text-[11px]">{o.paymentProvider || 'Instant Claim'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          o.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : o.status === 'PAYMENT_SUBMITTED'
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GRANT FREE ACCESS */}
      {activeTab === 'grant' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">card_membership</span>
              Direct Scholar & Institutional Waiver
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
              Issue instant download permissions directly to any student, researcher, or faculty member's email without requiring payment submission.
            </p>
          </div>

          <form onSubmit={handleGrantAccess} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Recipient Email Address *
              </label>
              <input
                type="email"
                required
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
                placeholder="e.g. student@wki.edu.et"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Select Digital Product *
              </label>
              <select
                required
                value={grantProductId}
                onChange={(e) => setGrantProductId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              >
                <option value="">-- Choose Product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.fileFormat}] {p.title} (v{p.version})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Grant Reason / Institutional Note
              </label>
              <input
                type="text"
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!grantEmail.trim() || !grantProductId}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">send</span>
                Grant Authorized License
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <form
            onSubmit={handleCreateCoupon}
            className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-end gap-3 text-xs"
          >
            <div className="flex-1">
              <label className="block font-bold mb-1">Coupon Code</label>
              <input
                type="text"
                required
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="e.g. SCHOLAR20"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 uppercase font-mono"
              />
            </div>

            <div className="w-36">
              <label className="block font-bold mb-1">Discount Type</label>
              <select
                value={couponType}
                onChange={(e) => setCouponType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED_ETB">Fixed (ETB)</option>
              </select>
            </div>

            <div className="w-28">
              <label className="block font-bold mb-1">Value</label>
              <input
                type="number"
                required
                min={1}
                value={couponDiscount}
                onChange={(e) => setCouponDiscount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              />
            </div>

            <button
              type="submit"
              disabled={!couponCode.trim()}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold hover:opacity-90 disabled:opacity-50"
            >
              Create Coupon
            </button>
          </form>

          <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-zinc-800/70 border-b border-slate-200 dark:border-zinc-800 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Used Count</th>
                  <th className="p-4">Max Uses</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{c.code}</td>
                    <td className="p-4 font-bold text-primary">
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `${c.discountValue} ETB OFF`}
                    </td>
                    <td className="p-4">{c.usedCount} times</td>
                    <td className="p-4">{c.maxUses || 'Unlimited'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: PERMISSIONS & DRM LICENSES */}
      {activeTab === 'licenses' && (
        <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-zinc-800/70 border-b border-slate-200 dark:border-zinc-800 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Scholar / User</th>
                  <th className="p-4">Product Title</th>
                  <th className="p-4">Downloads</th>
                  <th className="p-4">Granted At</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {permissions.map((perm) => (
                  <tr key={perm.id}>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{perm.userName}</div>
                      <div className="text-[11px] text-slate-500">{perm.userEmail}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-800 dark:text-zinc-200">{perm.productTitle}</td>
                    <td className="p-4 font-mono">
                      {perm.downloadCount} / {perm.maxDownloadsAllowed === 0 ? '∞' : perm.maxDownloadsAllowed}
                    </td>
                    <td className="p-4 text-slate-400">{new Date(perm.grantedAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          perm.isRevoked ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'
                        }`}
                      >
                        {perm.isRevoked ? 'REVOKED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRevokePermission(perm.id, perm.isRevoked)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          perm.isRevoked
                            ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                            : 'border-red-200 text-red-600 hover:bg-red-50'
                        }`}
                      >
                        {perm.isRevoked ? 'Restore Access' : 'Revoke License'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: SETTINGS & PAYMENT NUMBERS */}
      {activeTab === 'settings' && settings && (
        <form onSubmit={handleSaveSettings} className="max-w-2xl mx-auto p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_balance</span>
              Official Ethiopian Payment Accounts
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Customers will see these exact account numbers and merchant IDs during checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Telebirr Merchant Phone</label>
              <input
                type="text"
                value={settings.telebirrMerchantPhone}
                onChange={(e) => setSettings({ ...settings, telebirrMerchantPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Telebirr Merchant ID / Name</label>
              <input
                type="text"
                value={settings.telebirrMerchantId}
                onChange={(e) => setSettings({ ...settings, telebirrMerchantId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">CBE Account Number</label>
              <input
                type="text"
                value={settings.cbeAccountNumber}
                onChange={(e) => setSettings({ ...settings, cbeAccountNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">CBE Account Name</label>
              <input
                type="text"
                value={settings.cbeAccountName}
                onChange={(e) => setSettings({ ...settings, cbeAccountName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Safaricom / M-Pesa Number</label>
              <input
                type="text"
                value={settings.safaricomMpesaNumber}
                onChange={(e) => setSettings({ ...settings, safaricomMpesaNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Awash Bank Account Number</label>
              <input
                type="text"
                value={settings.awashAccountNumber || '0132084920194'}
                onChange={(e) => setSettings({ ...settings, awashAccountNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Store Announcement Notice</label>
            <input
              type="text"
              value={settings.storeNotice || ''}
              onChange={(e) => setSettings({ ...settings, storeNotice: e.target.value })}
              placeholder="e.g. Welcome to Ilillii Digital Learning Press!"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:opacity-90 shadow-md"
            >
              Save Payment Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 8: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-zinc-800/70 border-b border-slate-200 dark:border-zinc-800 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="p-4 text-slate-400">{log.timestamp}</td>
                  <td className="p-4 font-bold text-primary">{log.action}</td>
                  <td className="p-4 text-slate-700 dark:text-zinc-300">{log.actor}</td>
                  <td className="p-4 text-slate-500">{JSON.stringify(log.details)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT / CREATE PRODUCT MODAL */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingProduct.id ? 'Edit Marketplace Product' : 'Add New Digital Product'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block font-bold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  placeholder="e.g. Master English Slang & Idioms in Afaan Oromoo"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'Books'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  >
                    <option value="Books">Books & E-Books</option>
                    <option value="Audio">Audio Masterclasses</option>
                    <option value="Video">Video Tutorials</option>
                    <option value="Documents">PDF / Word Documents</option>
                    <option value="Presentations">PowerPoint & Slides</option>
                    <option value="Graphics">Graphic Design Assets</option>
                    <option value="Software">Software & Templates</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">File Format</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.fileFormat || 'PDF'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fileFormat: e.target.value })}
                    placeholder="PDF, MP3, MP4, PPTX, ZIP"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Product Type</label>
                  <select
                    value={editingProduct.productType || 'Book'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, productType: e.target.value as StoreProductType })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  >
                    <option value="Book">Book</option>
                    <option value="Audio">Audio</option>
                    <option value="Video">Video</option>
                    <option value="Document">Document</option>
                    <option value="Graphics">Graphics</option>
                    <option value="Software / Template">Software / Template</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Price (ETB)</label>
                  <input
                    type="number"
                    value={editingProduct.priceETB || 0}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        priceETB: Number(e.target.value),
                        isFree: Number(e.target.value) === 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Original Price (ETB)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPriceETB || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPriceETB: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">File Size</label>
                  <input
                    type="text"
                    value={editingProduct.fileSize || '12 MB'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fileSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Cover Image / Thumbnail URL</label>
                <input
                  type="text"
                  value={editingProduct.thumbnailUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, thumbnailUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFree || false}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        isFree: e.target.checked,
                        priceETB: e.target.checked ? 0 : editingProduct.priceETB || 100,
                      })
                    }
                  />
                  Free Resource
                </label>

                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                  />
                  Featured Badge
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
