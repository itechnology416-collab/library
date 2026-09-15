import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  FileCheck,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import { Modal, Button } from './ui';
import { GrantProject } from '../types';

interface RecordExpenseModalProps {
  grant: GrantProject;
  onClose: () => void;
  onSubmit: (grantId: string, category: string, amountETB: number, description: string) => Promise<void>;
  onShowToast?: (msg: string) => void;
}

export const RecordExpenseModal: React.FC<RecordExpenseModalProps> = ({
  grant,
  onClose,
  onSubmit,
  onShowToast,
}) => {
  const [category, setCategory] = useState<string>(
    grant.budgetBreakdown?.[0]?.category || 'Personnel & Research Assistants'
  );
  const [amountETB, setAmountETB] = useState<number>(15000);
  const [description, setDescription] = useState<string>('');
  const [receiptRef, setReceiptRef] = useState<string>('VOUCH-2026-');
  const [loading, setLoading] = useState(false);

  const selectedCategoryData = grant.budgetBreakdown?.find((b) => b.category === category);
  const remainingInCat = selectedCategoryData
    ? selectedCategoryData.allocatedETB - selectedCategoryData.spentETB
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amountETB <= 0) {
      if (onShowToast) onShowToast('Please enter a valid expenditure amount.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(grant.id, category, amountETB, `${receiptRef}: ${description}`);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 flex items-center justify-center border border-teal-500/30">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-on-surface">
              Record Grant Expenditure Transaction
            </span>
            <p className="text-xs text-on-surface-variant font-mono">
              Grant: {grant.grantNumber}
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project info card */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
          <div className="text-xs font-bold text-on-surface font-serif">{grant.title}</div>
          <div className="text-[11px] text-on-surface-variant flex items-center justify-between">
            <span>Funder: {grant.funder}</span>
            <span className="font-mono font-bold text-teal-600">
              Total Budget: {grant.totalBudgetETB.toLocaleString()} ETB
            </span>
          </div>
        </div>

        {/* Budget Category selection */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Budget Line Item Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface focus:ring-2 focus:ring-teal-500"
          >
            {grant.budgetBreakdown?.map((b, idx) => (
              <option key={idx} value={b.category}>
                {b.category} (Spent: {b.spentETB.toLocaleString()} / {b.allocatedETB.toLocaleString()} ETB)
              </option>
            ))}
          </select>
        </div>

        {/* Remaining in category indicator */}
        <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/20 flex items-center justify-between text-xs">
          <span className="text-on-surface-variant font-medium">Remaining Allocated Balance:</span>
          <span className={`font-mono font-bold ${remainingInCat < amountETB ? 'text-rose-600' : 'text-emerald-600'}`}>
            {remainingInCat.toLocaleString()} ETB
          </span>
        </div>

        {/* Amount in ETB */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Disbursement Amount (ETB)</label>
          <div className="relative">
            <input
              type="number"
              min="100"
              step="500"
              required
              value={amountETB}
              onChange={(e) => setAmountETB(parseInt(e.target.value) || 0)}
              className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs font-mono text-on-surface focus:ring-2 focus:ring-teal-500"
            />
            <span className="absolute right-3 top-2.5 text-xs text-on-surface-variant font-bold">ETB</span>
          </div>
          <span className="text-[10px] text-on-surface-variant">
            ≈ ${(Math.round(amountETB / 135)).toLocaleString()} USD
          </span>
        </div>

        {/* Payment Voucher & Description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Voucher / Receipt Ref</label>
            <input
              type="text"
              required
              value={receiptRef}
              onChange={(e) => setReceiptRef(e.target.value)}
              placeholder="VOUCH-2026-081"
              className="w-full p-2 rounded-xl bg-surface border border-outline-variant/30 text-xs font-mono text-on-surface"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Expenditure Purpose</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Enumerator per diem (Mayu woreda)"
              className="w-full p-2 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
          <Button variant="outline" size="sm" type="button" onClick={onClose} className="text-xs cursor-pointer">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={loading}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="bg-teal-700 hover:bg-teal-600 text-white text-xs cursor-pointer font-bold"
          >
            {loading ? 'Recording...' : 'Record Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
