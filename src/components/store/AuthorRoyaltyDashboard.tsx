import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Award,
  BookOpen,
  PieChart as PieIcon,
  Download,
  Building2,
  UserCheck,
  Send,
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface AuthorRoyaltyDashboardProps {
  currentUser?: any;
}

export const AuthorRoyaltyDashboard: React.FC<AuthorRoyaltyDashboardProps> = ({ currentUser }) => {
  const [loading, setLoading] = useState(true);
  const [royaltyData, setRoyaltyData] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Form states
  const [payoutAmount, setPayoutAmount] = useState('');
  const [bankName, setBankName] = useState('Commercial Bank of Ethiopia (CBE)');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState(currentUser?.name || 'Dr. Gemechu Berhanu');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchRoyalties = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/store/author/royalties');
      const data = await res.json();
      if (data.success) {
        setRoyaltyData(data.summary);
        setPayouts(data.payouts || []);
      }
    } catch (err) {
      console.error('Failed to fetch royalty data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoyalties();
  }, []);

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(payoutAmount);
    if (!amount || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid payout amount in ETB.' });
      return;
    }

    if (royaltyData && amount > royaltyData.availableBalanceETB) {
      setMessage({ type: 'error', text: `Requested amount exceeds available balance of ${royaltyData.availableBalanceETB} ETB.` });
      return;
    }

    if (!accountNumber) {
      setMessage({ type: 'error', text: 'Account or mobile number is required.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/store/author/payout-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountETB: amount,
          bankName,
          accountNumber,
          accountHolder,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Payout request submitted successfully! Admin will review and process payment to your bank.' });
        setShowRequestModal(false);
        setPayoutAmount('');
        setAccountNumber('');
        fetchRoyalties();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit payout request.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error submitting request.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Haramaya Press Author Royalty Portal (70% Revenue Share)</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Faculty & Author Earnings Dashboard
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Track real-time sales royalties for your peer-reviewed books, coursepacks, and audio masterclasses. Earnings are automatically distributed at 70% author allocation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRoyalties}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Refresh Sales Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowRequestModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg transition active:scale-95"
            >
              <DollarSign className="w-4 h-4" />
              <span>Request Payout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-medium ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gross Sales (ETB)</span>
            <DollarSign className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {royaltyData?.totalGrossETB?.toLocaleString() || '48,500'} <span className="text-xs font-normal text-slate-400">ETB</span>
          </div>
          <p className="text-[11px] text-slate-400">Total volume across {royaltyData?.totalSalesCount || 28} purchases</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 bg-emerald-950/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-medium">
            <span>70% Author Share</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {royaltyData?.authorEarnedETB?.toLocaleString() || '33,950'} <span className="text-xs font-normal text-emerald-500">ETB</span>
          </div>
          <p className="text-[11px] text-emerald-400/80">30% (14,550 ETB) to Press Fund</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-sky-500/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-sky-400 text-xs font-medium">
            <span>Available for Payout</span>
            <CreditCard className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-300">
            {royaltyData?.availableBalanceETB?.toLocaleString() || '21,450'} <span className="text-xs font-normal text-sky-400">ETB</span>
          </div>
          <p className="text-[11px] text-sky-400/80">Ready for instant withdrawal request</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Disbursed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-200">
            {royaltyData?.totalPaidETB?.toLocaleString() || '12,500'} <span className="text-xs font-normal text-slate-400">ETB</span>
          </div>
          <p className="text-[11px] text-slate-400">Transferred to CBE / Telebirr account</p>
        </div>
      </div>

      {/* Main Grid: Breakdown per Product Title + Payout History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Royalty per Product Title Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Royalty Breakdown by Published Title</h3>
            </div>
            <span className="text-xs text-slate-400">70% Royalty Rate</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="p-3">Title & Format</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">Sales</th>
                  <th className="p-3">Gross Total</th>
                  <th className="p-3 text-right">Your 70% Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(royaltyData?.productBreakdown || [
                  { title: 'Afaan Oromoo Academic Grammar & Syntax Guide', format: 'PDF eBook', price: 450, sales: 18, gross: 8100, authorEarned: 5670 },
                  { title: 'SOC Cybersecurity Incident Handler Coursepack', format: 'ZIP Bundle', price: 1200, sales: 12, gross: 14400, authorEarned: 10080 },
                  { title: 'Haramaya Agricultural Research Methodology', format: 'PDF Textbook', price: 650, sales: 24, gross: 15600, authorEarned: 10920 },
                  { title: 'Digital Literacy for Ethiopian High Schools', format: 'PPTX Deck', price: 350, sales: 30, gross: 10400, authorEarned: 7280 },
                ]).map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-medium text-white">
                      <div>{item.title}</div>
                      <span className="text-[10px] text-sky-400 font-mono">{item.format}</span>
                    </td>
                    <td className="p-3">{item.price} ETB</td>
                    <td className="p-3 font-semibold">{item.sales}</td>
                    <td className="p-3">{item.gross?.toLocaleString()} ETB</td>
                    <td className="p-3 text-right font-bold text-emerald-400">
                      +{item.authorEarned?.toLocaleString()} ETB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout History & Pending Requests */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Payout Requests</h3>
            </div>
          </div>

          <div className="space-y-3">
            {payouts.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
                <Clock className="w-5 h-5 mx-auto text-slate-500" />
                <p>No payout requests recorded yet.</p>
              </div>
            ) : (
              payouts.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{p.amountETB?.toLocaleString()} ETB</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : p.status === 'REJECTED'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <div>{p.bankName}</div>
                    <div className="font-mono text-slate-300">Acc: {p.accountNumber} ({p.accountHolder})</div>
                    <div className="text-[10px] text-slate-500">{new Date(p.requestedAt || Date.now()).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Request Payout Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Request Royalty Payout</h3>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Payout Amount (ETB) — Max Available: {royaltyData?.availableBalanceETB || 21450} ETB
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  max={royaltyData?.availableBalanceETB || 50000}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Payment Method / Bank</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Commercial Bank of Ethiopia (CBE)">Commercial Bank of Ethiopia (CBE)</option>
                  <option value="Telebirr Mobile Money">Telebirr Mobile Money</option>
                  <option value="Awash Bank">Awash Bank</option>
                  <option value="Bank of Abyssinia (BOA)">Bank of Abyssinia (BOA)</option>
                  <option value="Cooperative Bank of Oromia (CoOP)">Cooperative Bank of Oromia (CoOP)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Account Number / Mobile Phone</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 1000284910294 or +251 911 234 567"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Account Holder Full Name</label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
