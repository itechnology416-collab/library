import React, { useState } from 'react';
import { PressFinancialAuditRecord } from '../types';

interface FinancialAuditDeskProps {
  ledger: PressFinancialAuditRecord[];
  onRecordVoucher: (newVoucher: Partial<PressFinancialAuditRecord>) => void;
  onShowToast?: (msg: string) => void;
}

export const FinancialAuditDesk: React.FC<FinancialAuditDeskProps> = ({
  ledger,
  onRecordVoucher,
  onShowToast,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('All');
  const [localLedger, setLocalLedger] = useState<PressFinancialAuditRecord[]>(ledger);

  // Sync when prop updates
  React.useEffect(() => {
    setLocalLedger(ledger);
  }, [ledger]);

  // Form fields
  const [type, setType] = useState<
    | 'Author Typesetting Fee'
    | 'Monograph Royalty Payout'
    | 'Print Shop Consumable Requisition'
    | 'Telebirr Book Purchase'
    | 'Editorial Desk Honorarium'
    | 'Grant Publication Subsidy'
  >('Monograph Royalty Payout');
  const [notes, setNotes] = useState('');
  const [amountETB, setAmountETB] = useState<number>(15000);
  const [payerOrPayee, setPayerOrPayee] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    | 'CBE Account 1000289417625'
    | 'Telebirr 0927650724'
    | 'University Internal Budget Transfer'
    | 'Commercial Bank Cheque'
  >('CBE Account 1000289417625');
  const [referenceNumber, setReferenceNumber] = useState('');

  const filtered = localLedger.filter((rec) => {
    if (filterType === 'All') return true;
    return rec.type === filterType;
  });

  const handleVerify = (id: string) => {
    setLocalLedger((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Verified & Reconciled',
              auditorName: 'Internal Audit Directorate (HU Finance)',
            }
          : item
      )
    );
    if (onShowToast) onShowToast('Voucher reconciled and verified by Internal Audit Directorate.');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() || !payerOrPayee.trim()) {
      if (onShowToast) onShowToast('Please provide notes and payee / payer.');
      return;
    }

    const voucher: Partial<PressFinancialAuditRecord> = {
      type,
      notes: notes.trim(),
      amountETB: Number(amountETB),
      payerOrPayee: payerOrPayee.trim(),
      paymentMethod,
      referenceNumber: referenceNumber.trim() || `CBE-${Math.floor(10000000 + Math.random() * 90000000)}`,
      auditorName: 'University Internal Audit Directorate',
      status: 'Pending Auditor Signoff',
    };

    onRecordVoucher(voucher);
    setShowModal(false);
    setNotes('');
    setPayerOrPayee('');
    setReferenceNumber('');
    if (onShowToast) onShowToast(`Financial voucher registered for ${amountETB.toLocaleString()} ETB`);
  };

  const totalVolume = localLedger.reduce((acc, r) => acc + r.amountETB, 0);
  const pendingCount = localLedger.filter((r) => r.status === 'Pending Auditor Signoff').length;
  const reconciledCount = localLedger.filter((r) => r.status === 'Verified & Reconciled').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] uppercase tracking-wider">
              Phase 6 Module
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              University Financial Controller & Internal Audit Division
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif text-on-surface">
            Financial Audits, Royalties & Consumables Reconciliations
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Audit author royalty disbursements, commercial bindery supplies procurement vouchers, and bank transaction settlement references.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-2 hover:brightness-105 transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>+ Record Financial Voucher</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-secondary mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Audited Ledger Volume</span>
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
          </div>
          <span className="text-2xl font-black text-on-surface">
            {totalVolume.toLocaleString()} <span className="text-xs font-bold text-on-surface-variant">ETB</span>
          </span>
          <span className="text-[11px] text-on-surface-variant block font-medium mt-1">
            Reconciled Press Cashflow
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Reconciled Vouchers</span>
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{reconciledCount}</span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-semibold mt-1">
            Signed by Internal Audit
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Pending Signoff</span>
            <span className="material-symbols-outlined text-[20px]">pending</span>
          </div>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</span>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 block font-semibold mt-1">
            Awaiting Bank Slip Check
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-purple-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Voucher Count</span>
            <span className="material-symbols-outlined text-[20px]">feed</span>
          </div>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{localLedger.length}</span>
          <span className="text-[11px] text-purple-700 dark:text-purple-400 block font-semibold mt-1">
            FY 2025/2026 Ethiopian Budget
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {[
          'All',
          'Author Typesetting Fee',
          'Monograph Royalty Payout',
          'Print Shop Consumable Requisition',
          'Telebirr Book Purchase',
          'Editorial Desk Honorarium',
          'Grant Publication Subsidy',
        ].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === t
                ? 'bg-secondary text-on-secondary shadow-xs'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant/20 text-on-surface-variant uppercase text-[10px] tracking-wider font-bold">
              <th className="p-3.5">Voucher # / Date</th>
              <th className="p-3.5">Type & Notes</th>
              <th className="p-3.5">Payer / Payee</th>
              <th className="p-3.5 text-right">Amount (ETB)</th>
              <th className="p-3.5">Transaction Ref</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container/40 transition-colors">
                <td className="p-3.5 font-mono">
                  <span className="font-bold text-on-surface block">{item.voucherNumber}</span>
                  <span className="text-[11px] text-on-surface-variant">{item.date}</span>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary text-[10px] font-bold block w-fit mb-1">
                    {item.type}
                  </span>
                  <span className="text-on-surface font-medium">{item.notes}</span>
                </td>
                <td className="p-3.5 text-on-surface font-semibold">
                  {item.payerOrPayee}
                </td>
                <td className="p-3.5 text-right font-mono font-bold text-sm text-on-surface">
                  {item.amountETB.toLocaleString()}
                </td>
                <td className="p-3.5 font-mono text-[11px] text-on-surface-variant">
                  <span className="block text-on-surface font-medium">{item.paymentMethod}</span>
                  {item.referenceNumber}
                </td>
                <td className="p-3.5">
                  {item.status === 'Verified & Reconciled' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-500/30 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      <span>Audited</span>
                    </span>
                  ) : item.status === 'Pending Auditor Signoff' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-[10px] border border-amber-500/30 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">hourglass_top</span>
                      <span>Pending Signoff</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold text-[10px] border border-rose-500/30">
                      {item.status}
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  {item.status !== 'Verified & Reconciled' ? (
                    <button
                      onClick={() => handleVerify(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all cursor-pointer shadow-xs"
                    >
                      Audit Signoff
                    </button>
                  ) : (
                    <span className="text-[11px] text-on-surface-variant italic">
                      Signed: {item.auditorName || 'Internal Audit'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-secondary/10 text-secondary">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </span>
                <h3 className="text-lg font-bold font-serif text-on-surface">
                  Record Financial Audit Voucher
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Voucher Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  >
                    <option value="Author Typesetting Fee">Author Typesetting Fee</option>
                    <option value="Monograph Royalty Payout">Monograph Royalty Payout</option>
                    <option value="Print Shop Consumable Requisition">Print Shop Consumable Requisition</option>
                    <option value="Telebirr Book Purchase">Telebirr Book Purchase</option>
                    <option value="Editorial Desk Honorarium">Editorial Desk Honorarium</option>
                    <option value="Grant Publication Subsidy">Grant Publication Subsidy</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Amount (ETB)</label>
                  <input
                    type="number"
                    required
                    value={amountETB}
                    onChange={(e) => setAmountETB(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 font-mono focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Payee / Beneficiary / Vendor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Mengistu Ketema or Berhanena Selam Printing"
                  value={payerOrPayee}
                  onChange={(e) => setPayerOrPayee(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Audit Ledger Notes</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Details of expense, disbursement terms, or sales reconciliation..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Settlement Channel</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  >
                    <option value="CBE Account 1000289417625">Commercial Bank of Ethiopia (CBE)</option>
                    <option value="Telebirr 0927650724">Telebirr 0927650724</option>
                    <option value="University Internal Budget Transfer">University Internal Budget Transfer</option>
                    <option value="Commercial Bank Cheque">Commercial Bank Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Transaction Ref / Slip #</label>
                  <input
                    type="text"
                    placeholder="e.g. CBE-TX-984210"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 font-mono focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold hover:brightness-105 transition-all cursor-pointer shadow-sm"
                >
                  Record Audit Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
