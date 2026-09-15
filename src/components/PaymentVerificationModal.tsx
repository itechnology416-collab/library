import React, { useState } from 'react';
import {
  Building,
  CheckCircle2,
  Copy,
  Check,
  Send,
  FileText,
  ShieldCheck,
  ExternalLink,
  Receipt,
} from 'lucide-react';
import { PaymentProof, ServiceRequest } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';
import { Modal, Input, FileUploader, Button, Badge } from './ui';

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
    request.paymentProof?.amountETB || request.estimatedCostETB || request.estimatedPages * 65
  );
  const [receiptFiles, setReceiptFiles] = useState<File[]>([]);
  const [receiptFileName, setReceiptFileName] = useState<string>(
    request.paymentProof?.receiptFileName || 'cbe_slip_deposit_receipt.pdf'
  );
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const bankAccounts = [
    {
      name: 'Commercial Bank of Ethiopia (CBE)' as const,
      accountNumber: '1000 2847 19284',
      accountHolder: 'Feysal Hussein (Director, WKI)',
      branch: 'Haramaya University Branch',
      logoText: 'CBE',
      badgeColor: 'bg-purple-900 text-purple-100 border-purple-700',
    },
    {
      name: 'Telebirr SuperApp Mobile Money' as const,
      accountNumber: '+251 927 650 724 / +251 961 189 074',
      accountHolder: 'Feysal Hussein (WKI Publishing)',
      branch: 'Ethio Telecom Mobile Money Portal',
      logoText: 'telebirr',
      badgeColor: 'bg-emerald-700 text-emerald-100 border-emerald-500',
    },
    {
      name: 'Awash Bank S.C.' as const,
      accountNumber: '0130 4859 1247 00',
      accountHolder: 'Feysal Hussein • Wirtuu Kompiitaraa',
      branch: 'Aweday / Haramaya Main',
      logoText: 'AWASH',
      badgeColor: 'bg-blue-800 text-blue-100 border-blue-600',
    },
    {
      name: 'Dashen Bank' as const,
      accountNumber: '5201 9482 1058 01',
      accountHolder: 'Feysal Hussein',
      branch: 'Harar Ras Makonnen Branch',
      logoText: 'DASHEN',
      badgeColor: 'bg-amber-800 text-amber-100 border-amber-600',
    },
  ];

  const handleCopy = (accountNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(accountNumber.replace(/\s+/g, ''));
    setCopiedAccount(accountNumber);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleFilesSelected = (files: File[]) => {
    setReceiptFiles(files);
    if (files.length > 0) {
      setReceiptFileName(files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) return;

    const proof: PaymentProof = {
      transactionRef: transactionRef.trim(),
      bankName,
      amountETB: Number(amountETB),
      status: 'Pending Verification',
      receiptFileName: receiptFileName || 'bank_deposit_slip.pdf',
      submittedAt:
        new Date().toISOString().split('T')[0] +
        ' ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      payerName: payerName.trim(),
      verifiedBy: 'Pending Director Review (Mr. Feysal Hussein)',
    };

    onSubmitPaymentProof(proof);
    setIsSuccess(true);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base md:text-lg text-on-surface">
                Institutional Bank Settlement & Voucher
              </span>
              <Badge variant="secondary" className="font-mono text-[10px]">
                {request.id}
              </Badge>
            </div>
            <p className="text-xs text-on-surface-variant font-normal">
              Official Ethiopian banking channels for Wirtuu Kompiitaraa Ilillii
            </p>
          </div>
        </div>
      }
    >
      {isSuccess ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface">
              Deposit Slip Successfully Registered
            </h3>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              Transaction ref <strong>{transactionRef}</strong> ({amountETB.toLocaleString()} ETB via {bankName}) has been securely forwarded to Director Mr. Feysal Hussein for instant audit.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container text-xs text-left max-w-md mx-auto space-y-2 border border-outline-variant/20">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Project Reference:</span>
              <span className="font-mono font-bold text-on-surface">{request.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Depositor Name:</span>
              <span className="font-bold text-on-surface">{payerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Amount Settled:</span>
              <span className="font-bold text-secondary">{amountETB.toLocaleString()} ETB</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-outline-variant/10">
              <span className="text-on-surface-variant">Audit Status:</span>
              <Badge variant="warning">Pending Verification</Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
            <a
              href={`${OFFICIAL_BRAND.telegramUrl}?text=Hello%20Mr.%20Feysal,%20I%20have%20settled%20${amountETB}%20ETB%20for%20project%20${request.id}%20(Ref:%20${transactionRef})`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Ping on Telegram</span>
              <ExternalLink className="w-3.5 h-3.5 ml-auto" />
            </a>
            <Button variant="secondary" onClick={onClose} className="flex-1 text-xs">
              Back to Project Desk
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Institutional Bank Accounts Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                1. Select Institutional Settlement Account:
              </span>
              <span className="text-[11px] text-secondary font-medium">
                Click an account to select & copy
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {bankAccounts.map((b) => {
                const isSelected = bankName === b.name;
                const isCopied = copiedAccount === b.accountNumber;
                return (
                  <div
                    key={b.name}
                    onClick={() => setBankName(b.name)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all relative ${
                      isSelected
                        ? 'bg-secondary/10 border-secondary ring-2 ring-secondary/20 shadow-xs'
                        : 'bg-surface-container-lowest border-outline-variant/20 hover:border-secondary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-on-surface text-[12px]">{b.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${b.badgeColor}`}>
                        {b.logoText}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-xs font-bold text-secondary tracking-wide">
                        {b.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopy(b.accountNumber, e)}
                        className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                        title="Copy Account Number"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="text-[10px] text-on-surface-variant mt-1 flex items-center justify-between">
                      <span>{b.accountHolder}</span>
                      <span className="opacity-75">{b.branch}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Settlement Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-3 border-t border-outline-variant/20">
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">
              2. Enter Transfer Reference & Attach Receipt:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Depositor / Payer Name"
                placeholder="e.g. Dr. Getachew Tadesse"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                required
              />
              <Input
                label="Amount Paid (ETB)"
                type="number"
                min={100}
                value={amountETB}
                onChange={(e) => setAmountETB(Number(e.target.value))}
                required
              />
            </div>

            <Input
              label="Bank Transaction Code / FT Code / Telebirr Ref"
              placeholder="e.g. FT26255B49K9 or TB-0918234"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              helperText="Find this on your bank SMS confirmation or stamped deposit slip."
              required
            />

            {/* Receipt File Uploader */}
            <FileUploader
              label="Deposit Slip or Screenshot Attachment"
              helperText="Upload JPG, PNG, or PDF of your bank slip"
              accept=".pdf,.png,.jpg,.jpeg"
              maxSizeMB={10}
              onFilesSelected={handleFilesSelected}
              selectedFiles={receiptFiles}
            />

            <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 flex items-start gap-2.5 text-xs text-on-surface">
              <ShieldCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>
                Official university receipt vouchers are issued upon Director audit. For urgent clearance before defense, ping Director Mr. Feysal Hussein on Telegram at <strong>{OFFICIAL_BRAND.telegramHandle}</strong>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="secondary" className="text-xs font-bold shadow-sm">
                <Receipt className="w-4 h-4 mr-1.5" />
                Confirm & Submit Payment Slip
              </Button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
};
