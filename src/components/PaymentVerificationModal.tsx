import React, { useState } from 'react';
import { PaymentProof, ServiceRequest } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';

interface PaymentVerificationModalProps {
  request: ServiceRequest;
  onClose: () => void;
  onSubmitPaymentProof: (proof: PaymentProof) => void;
}

export const PaymentVerificationModal: React.FC<PaymentVerificationModalProps> = ({
  request,
  onClose,
  onSubmitPaymentProof,
}) => {
  const [bankName, setBankName] = useState<PaymentProof['bankName']>(
    'Commercial Bank of Ethiopia (CBE)'
  );
  const [transactionRef, setTransactionRef] = useState<string>(
    request.paymentProof?.transactionRef || ''
  );
  const [payerName, setPayerName] = useState<string>(
    request.paymentProof?.payerName || request.clientName
  );
  const [amountETB, setAmountETB] = useState<number>(
    request.paymentProof?.amountETB || request.estimatedCostETB || (request.estimatedPages * 65)
  );
  const [receiptFileName, setReceiptFileName] = useState<string>(
    request.paymentProof?.receiptFileName || 'cbe_slip_deposit_receipt.pdf'
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const bankAccounts = [
    {
      name: 'Commercial Bank of Ethiopia (CBE)',
      accountNumber: '1000 2847 19284',
      accountHolder: 'Feysal Hussein (Director, WKI)',
      branch: 'Haramaya University Branch',
      logoText: 'CBE',
      badgeColor: 'bg-purple-900 text-purple-100 border-purple-700',
    },
    {
      name: 'Telebirr SuperApp Mobile Money',
      accountNumber: '+251 927 650 724 / +251 961 189 074',
      accountHolder: 'Feysal Hussein (WKI Publishing)',
      branch: 'Ethio Telecom Mobile Money Portal',
      logoText: 'telebirr',
      badgeColor: 'bg-emerald-700 text-emerald-100 border-emerald-500',
    },
    {
      name: 'Awash Bank S.C.',
      accountNumber: '0130 4859 1247 00',
      accountHolder: 'Feysal Hussein • Wirtuu Kompiitaraa',
      branch: 'Aweday / Haramaya Main',
      logoText: 'AWASH',
      badgeColor: 'bg-blue-800 text-blue-100 border-blue-600',
    },
    {
      name: 'Dashen Bank',
      accountNumber: '5201 9482 1058 01',
      accountHolder: 'Feysal Hussein',
      branch: 'Harar Ras Makonnen Branch',
      logoText: 'DASHEN',
      badgeColor: 'bg-amber-800 text-amber-100 border-amber-600',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) return;

    const proof: PaymentProof = {
      transactionRef: transactionRef.trim(),
      bankName,
      amountETB: Number(amountETB),
      status: 'Pending Verification',
      receiptFileName: receiptFileName || 'bank_deposit_slip.pdf',
      submittedAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      payerName: payerName.trim(),
      verifiedBy: 'Pending Director Review (Mr. Feysal Hussein)',
    };

    onSubmitPaymentProof(proof);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 max-w-2xl w-full flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30">
              <span className="material-symbols-outlined text-[24px]">account_balance</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span>University Bank Settlement & Voucher</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-mono font-bold">
                  {request.id}
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant">
                Official Ethiopian banking details for Wirtuu Kompiitaraa Ilillii
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-[36px]">
                <span className="material-symbols-outlined text-[36px]">verified</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">
                  Payment Verification Slip Submitted!
                </h3>
                <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
                  Transaction ref <strong>{transactionRef}</strong> ({amountETB.toLocaleString()} ETB via {bankName}) has been routed to Director Mr. Feysal Hussein for verification.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container text-xs text-left max-w-md mx-auto space-y-1.5 border border-outline-variant/20">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Project Reference:</span>
                  <span className="font-bold text-on-surface">{request.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Client Name:</span>
                  <span className="font-bold text-on-surface">{payerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Status:</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 font-bold text-[10px]">
                    Pending Verification
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs shadow-xs hover:brightness-105 cursor-pointer"
                >
                  Return to Project Portal
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Institutional Bank Accounts Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                  1. Designated University Institutional Accounts:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {bankAccounts.map((b) => (
                    <div
                      key={b.name}
                      onClick={() => setBankName(b.name as any)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        bankName === b.name
                          ? 'bg-secondary/10 border-secondary ring-2 ring-secondary/20 shadow-xs'
                          : 'bg-surface-container-lowest border-outline-variant/20 hover:border-secondary/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-on-surface">{b.name}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-black uppercase ${b.badgeColor}`}>
                          {b.logoText}
                        </span>
                      </div>
                      <div className="font-mono text-xs font-bold text-secondary tracking-wide">
                        {b.accountNumber}
                      </div>
                      <div className="text-[10px] text-on-surface-variant mt-0.5">
                        {b.accountHolder}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settlement Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 border-t border-outline-variant/20">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                  2. Submit Bank Deposit or Telebirr Transfer Proof:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface">Payer / Depositor Name *</label>
                    <input
                      type="text"
                      required
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      placeholder="e.g. Dr. Getachew Tadesse"
                      className="w-full p-2.5 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface">Amount Paid (ETB) *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={amountETB}
                      onChange={(e) => setAmountETB(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface flex items-center justify-between">
                    <span>Transaction Reference / CBE FT Code / Telebirr Ref *</span>
                    <span className="text-[10px] text-secondary font-normal">e.g. FT26255B49K9 or TB-0918234</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter bank transaction code from SMS or paper slip..."
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none font-mono uppercase"
                  />
                </div>

                {/* Upload simulated slip */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Attach Deposit Slip or Screenshot</label>
                  <div className="p-3 rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-lowest flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary text-[20px]">
                        receipt_long
                      </span>
                      <span className="font-mono text-[11px] text-on-surface">{receiptFileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReceiptFileName(`cbe_slip_${Date.now().toString().slice(-4)}.pdf`)}
                      className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-secondary cursor-pointer"
                    >
                      Change File
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 flex items-start gap-2 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                    info
                  </span>
                  <span>
                    Official university receipt vouchers are issued upon verification. For urgent clearance before defense, send the screenshot directly to Director Mr. Feysal Hussein on Telegram at <strong>{OFFICIAL_BRAND.telegramHandle}</strong>.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all cursor-pointer shadow-xs"
                  >
                    Confirm & Submit Payment Slip
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
