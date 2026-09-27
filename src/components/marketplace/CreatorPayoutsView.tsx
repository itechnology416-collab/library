import React, { useState, useEffect } from 'react';
import { MarketplacePayout } from '../../types/marketplace';
import { useAuth } from '../../context/AuthContext';

export const CreatorPayoutsView: React.FC = () => {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<MarketplacePayout[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [amountETB, setAmountETB] = useState('');
  const [paymentChannel, setPaymentChannel] = useState<'telebirr' | 'mpesa' | 'cbe'>('telebirr');
  const [accountOrPhone, setAccountOrPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPayouts = () => {
    fetch('/api/marketplace/payouts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.payouts)) {
          setPayouts(data.payouts);
        }
      })
      .catch((err) => console.warn('Could not fetch payouts:', err));
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const totalDisbursed = payouts
    .filter((p) => p.status === 'Disbursed')
    .reduce((sum, p) => sum + p.netAmountETB, 0);

  const pendingAmount = payouts
    .filter((p) => p.status === 'Pending' || p.status === 'Approved')
    .reduce((sum, p) => sum + p.netAmountETB, 0);

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountETB || Number(amountETB) <= 0 || !accountOrPhone) {
      alert('Please enter a valid payout amount and account/phone number.');
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/marketplace/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorEmail: user?.email || 'engineering@wki.edu.et',
          amountETB: Number(amountETB),
          paymentChannel,
          accountOrPhone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowRequestModal(false);
        setAmountETB('');
        fetchPayouts();
      }
    } catch (err) {
      console.warn('Payout request error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-1">
          <div className="text-xs text-on-surface-variant font-semibold flex items-center justify-between">
            <span>Disbursed Royalties</span>
            <span className="material-symbols-outlined text-emerald-500 text-[18px]">account_balance_wallet</span>
          </div>
          <div className="text-2xl font-black text-on-surface font-mono">
            {totalDisbursed.toLocaleString()} ETB
          </div>
          <div className="text-[10px] text-on-surface-variant">Net received after 10% platform fee</div>
        </div>

        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-1">
          <div className="text-xs text-on-surface-variant font-semibold flex items-center justify-between">
            <span>Pending Clearance</span>
            <span className="material-symbols-outlined text-amber-500 text-[18px]">pending_actions</span>
          </div>
          <div className="text-2xl font-black text-on-surface font-mono">
            {pendingAmount.toLocaleString()} ETB
          </div>
          <div className="text-[10px] text-on-surface-variant">In escrow / bank verification</div>
        </div>

        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-secondary uppercase tracking-wider">
              Commission Architecture
            </div>
            <div className="text-xs text-on-surface-variant mt-0.5">
              Creator receives <b className="text-on-surface">90%</b> | WKI Press fee <b className="text-on-surface">10%</b>
            </div>
          </div>

          <button
            onClick={() => setShowRequestModal(true)}
            className="mt-3 w-full py-2.5 px-4 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-105 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">payments</span>
            <span>Request Royalty Payout</span>
          </button>
        </div>
      </div>

      {/* Payouts History Table */}
      <div className="overflow-x-auto rounded-3xl border border-outline-variant/30 bg-surface-container-lowest">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container/50 text-on-surface">
              <th className="p-4 font-bold">Payout ID</th>
              <th className="p-4 font-bold">Gross Amount</th>
              <th className="p-4 font-bold">Platform Fee (10%)</th>
              <th className="p-4 font-bold">Net Payout</th>
              <th className="p-4 font-bold">Channel & Destination</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Date</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className="border-b border-outline-variant/15 hover:bg-surface-container/20">
                <td className="p-4 font-mono font-bold text-on-surface">{p.id}</td>
                <td className="p-4 font-mono">{p.amountETB.toLocaleString()} ETB</td>
                <td className="p-4 font-mono text-rose-500">-{p.platformFeeETB.toLocaleString()} ETB</td>
                <td className="p-4 font-mono font-extrabold text-emerald-600">{p.netAmountETB.toLocaleString()} ETB</td>
                <td className="p-4">
                  <div className="font-bold uppercase text-[10px] text-secondary">{p.paymentChannel}</div>
                  <div className="font-mono text-on-surface-variant text-[11px]">{p.accountOrPhone}</div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      p.status === 'Disbursed'
                        ? 'bg-emerald-500/20 text-emerald-600'
                        : p.status === 'Approved'
                        ? 'bg-blue-500/20 text-blue-600'
                        : p.status === 'Pending'
                        ? 'bg-amber-500/20 text-amber-600'
                        : 'bg-rose-500/20 text-rose-600'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-4 font-mono text-[11px] text-on-surface-variant">
                  {p.requestedAt?.split('T')[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Request Payout */}
      {showRequestModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                  Escrow Disbursement
                </span>
                <h3 className="text-base font-bold text-on-surface">Request Royalty Payout</h3>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1 rounded-lg bg-surface-container text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-on-surface mb-1">Gross Amount (ETB)</label>
                <input
                  type="number"
                  value={amountETB}
                  onChange={(e) => setAmountETB(e.target.value)}
                  placeholder="e.g. 20000"
                  required
                  min={500}
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono font-bold"
                />
                {amountETB && Number(amountETB) > 0 && (
                  <div className="mt-1 text-[11px] text-on-surface-variant font-mono">
                    Net Payout (90%): <b className="text-emerald-600">{(Number(amountETB) * 0.9).toLocaleString()} ETB</b> (University Press Fee 10%: {(Number(amountETB) * 0.1).toLocaleString()} ETB)
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'telebirr', label: 'Telebirr', icon: 'smartphone' },
                    { id: 'mpesa', label: 'M-Pesa', icon: 'send_to_mobile' },
                    { id: 'cbe', label: 'CBE Bank', icon: 'account_balance' },
                  ].map((ch) => (
                    <button
                      type="button"
                      key={ch.id}
                      onClick={() => setPaymentChannel(ch.id as any)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentChannel === ch.id
                          ? 'border-secondary bg-secondary/15 font-bold text-secondary'
                          : 'border-outline-variant/20 bg-surface-container text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] block mx-auto mb-0.5">
                        {ch.icon}
                      </span>
                      <span className="text-[10px] block">{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">
                  {paymentChannel === 'cbe' ? 'CBE Account Number' : 'Mobile Phone Number'}
                </label>
                <input
                  type="text"
                  value={accountOrPhone}
                  onChange={(e) => setAccountOrPhone(e.target.value)}
                  placeholder={paymentChannel === 'cbe' ? '1000...' : '+251 9...'}
                  required
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer hover:brightness-105"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>{isSubmitting ? 'Submitting...' : 'Confirm Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
