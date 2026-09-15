import React, { useState } from 'react';
import { StoreCartItem, StoreOrder, StoreSettings, StorePaymentProvider } from '../../types';

interface StoreCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: StoreCartItem[];
  appliedCoupon?: string;
  storeSettings: StoreSettings;
  currentUser?: { id: string; name: string; email: string; phone?: string; role: string } | null;
  onOrderCompleted: (order: StoreOrder) => void;
}

export const StoreCheckoutModal: React.FC<StoreCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  storeSettings,
  currentUser,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<'info' | 'payment_method' | 'submit_slip' | 'success'>('info');
  const [customerName, setCustomerName] = useState<string>(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState<string>(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser?.phone || '+251 ');
  const [selectedProvider, setSelectedProvider] = useState<StorePaymentProvider>('Telebirr');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<StoreOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotalETB = cartItems.reduce((sum, it) => sum + (it.product.isFree ? 0 : it.product.priceETB), 0);
  const isAllFree = subtotalETB === 0;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateOrder = async () => {
    if (!customerEmail.trim()) {
      setErrorMsg('Valid email address is required for digital delivery.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/store/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((it) => ({ productId: it.productId })),
          couponCode: appliedCoupon,
          customerName: customerName.trim() || 'Scholar',
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCreatedOrder(data.order);
        if (data.order.isFreeOrder) {
          setStep('success');
          onOrderCompleted(data.order);
        } else {
          setStep('payment_method');
        }
      } else {
        setErrorMsg(data.error || 'Failed to initialize order.');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdOrder) return;
    if (!transactionRef.trim()) {
      setErrorMsg('Please enter your Bank or Telebirr transaction confirmation reference.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/store/orders/${createdOrder.id}/submit-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentProvider: selectedProvider,
          transactionReference: transactionRef.trim(),
          customerPhone: customerPhone.trim(),
          receiptFileName: receiptFileName || `${selectedProvider}_Slip_${createdOrder.orderNumber}.png`,
          receiptUrl: '/receipts/submitted_slip.png',
          notes: paymentNotes.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCreatedOrder(data.order);
        setStep('success');
        onOrderCompleted(data.order);
      } else {
        setErrorMsg(data.error || 'Failed to submit payment proof.');
      }
    } catch (err) {
      console.error('Submit payment proof error:', err);
      setErrorMsg('Failed to submit verification details.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div
        id="store-checkout-modal"
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/80 dark:bg-zinc-900/80">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {step === 'info' ? '1' : step === 'payment_method' ? '2' : step === 'submit_slip' ? '3' : '✓'}
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {step === 'info'
                  ? 'Step 1: Scholar Information & Delivery Email'
                  : step === 'payment_method'
                  ? 'Step 2: Official Ethiopian Payment Channels'
                  : step === 'submit_slip'
                  ? 'Step 3: Submit Transaction Verification Reference'
                  : 'Order Placed & Protected'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                {createdOrder ? `Order Reference: ${createdOrder.orderNumber}` : `${cartItems.length} digital products`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {errorMsg}
            </div>
          )}

          {/* STEP 1: CUSTOMER INFO */}
          {step === 'info' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Order Items Summary
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {cartItems.map((it) => (
                    <div key={it.productId} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">[{it.product.fileFormat}]</span>
                        <span className="font-medium text-slate-800 dark:text-zinc-200">{it.product.title}</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {it.product.isFree ? 'FREE' : `${it.product.priceETB} ETB`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Full Name / Scholar Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Chaltu Benti / Dr. Muktar"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Delivery Email Address * (Download permissions & receipts will be bound to this email)
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. scholar@wki.edu.et or your-email@gmail.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Phone Number (For payment confirmation SMS / Telebirr matching)
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+251 91 234 5678"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
                <div className="text-slate-500">
                  Total Payable:{' '}
                  <span className="font-black text-slate-900 dark:text-white text-sm">
                    {subtotalETB === 0 ? 'FREE' : `${subtotalETB} ETB`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCreateOrder}
                  disabled={isProcessing || !customerEmail.trim()}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isProcessing ? 'Creating Order...' : isAllFree ? 'Claim Free Access Now' : 'Continue to Payment Options →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD SELECTION & ACCOUNT DETAILS */}
          {step === 'payment_method' && createdOrder && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-between">
                <span>
                  Please transfer exactly <strong>{createdOrder.totalETB} ETB</strong> using any of our official channels below:
                </span>
                <span className="font-mono font-bold">{createdOrder.orderNumber}</span>
              </div>

              {/* Provider Selection Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Telebirr', name: 'Telebirr', icon: 'smartphone', color: 'border-blue-500' },
                  { id: 'CBE', name: 'Commercial Bank (CBE)', icon: 'account_balance', color: 'border-purple-500' },
                  { id: 'Safaricom', name: 'M-Pesa Safaricom', icon: 'phone_android', color: 'border-emerald-500' },
                  { id: 'Awash_Bank', name: 'Awash Bank', icon: 'account_balance', color: 'border-orange-500' },
                ].map((prov) => (
                  <button
                    type="button"
                    key={prov.id}
                    onClick={() => setSelectedProvider(prov.id as StorePaymentProvider)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedProvider === prov.id
                        ? `${prov.color} bg-primary/5 text-primary ring-2 ring-primary/20 font-bold`
                        : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{prov.icon}</span>
                    <span className="text-[11px]">{prov.name}</span>
                  </button>
                ))}
              </div>

              {/* Active Provider Details Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 space-y-3">
                {selectedProvider === 'Telebirr' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">Telebirr Merchant / Phone:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(storeSettings.telebirrMerchantPhone, 'telebirr')}
                        className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'telebirr' ? 'Copied!' : 'Copy Number'}
                      </button>
                    </div>
                    <div className="text-sm font-mono font-bold bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white">
                      {storeSettings.telebirrMerchantPhone} ({storeSettings.telebirrMerchantId})
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Open your Telebirr App → Send Money / Pay Merchant → Enter phone number & exact amount <strong>{createdOrder.totalETB} ETB</strong> → Put <strong>{createdOrder.orderNumber}</strong> in the reason/remark.
                    </p>
                  </div>
                )}

                {selectedProvider === 'CBE' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">CBE Account Number:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(storeSettings.cbeAccountNumber, 'cbe')}
                        className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'cbe' ? 'Copied!' : 'Copy Account'}
                      </button>
                    </div>
                    <div className="text-sm font-mono font-bold bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white">
                      {storeSettings.cbeAccountNumber}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-zinc-300 font-medium">
                      Account Name: <strong>{storeSettings.cbeAccountName}</strong>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Transfer via CBE Birr, CBE Mobile Banking, or branch counter deposit. Use order ref <strong>{createdOrder.orderNumber}</strong> as the transfer remark.
                    </p>
                  </div>
                )}

                {selectedProvider === 'Safaricom' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">M-Pesa / Safaricom Number:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(storeSettings.safaricomMpesaNumber, 'mpesa')}
                        className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'mpesa' ? 'Copied!' : 'Copy Number'}
                      </button>
                    </div>
                    <div className="text-sm font-mono font-bold bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white">
                      {storeSettings.safaricomMpesaNumber} ({storeSettings.safaricomAccountName})
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Transfer via Safaricom M-Pesa app or *777# USSD menu.
                    </p>
                  </div>
                )}

                {selectedProvider === 'Awash_Bank' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">Awash Bank Account:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(storeSettings.awashAccountNumber || '0132084920194', 'awash')}
                        className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'awash' ? 'Copied!' : 'Copy Account'}
                      </button>
                    </div>
                    <div className="text-sm font-mono font-bold bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white">
                      {storeSettings.awashAccountNumber || '0132084920194'}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-bold"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep('submit_slip')}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold shadow-md hover:opacity-90"
                >
                  I Have Completed Payment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUBMIT TRANSACTION REFERENCE & SLIP */}
          {step === 'submit_slip' && createdOrder && (
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Payment Verification Form ({selectedProvider})
                </h4>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Bank / Telebirr Transaction Reference ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value.toUpperCase())}
                    placeholder="e.g. TB-20260215-9948210 or FT26046Y873199"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs uppercase tracking-wider focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Found on your SMS confirmation message or digital bank receipt.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Upload Payment Slip / Screenshot (Optional but speeds up verification)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer font-bold text-primary text-xs flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">upload_file</span>
                      Choose Image or PDF
                      <input type="file" accept="image/*,.pdf" onChange={handleSimulateFileUpload} className="hidden" />
                    </label>
                    {receiptFileName && (
                      <span className="text-[11px] font-mono text-slate-600 dark:text-zinc-300 truncate max-w-[200px]">
                        ✓ {receiptFileName}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Additional Notes / Payer Phone
                  </label>
                  <input
                    type="text"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="e.g. Sent from Chaltu's Telebirr account ending in 7711"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep('payment_method')}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-bold"
                >
                  ← Payment Channels
                </button>

                <button
                  type="submit"
                  disabled={isProcessing || !transactionRef.trim()}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isProcessing ? 'Submitting Verification...' : 'Submit Verification for Approval 🔒'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: ORDER SUCCESS / CONFIRMATION */}
          {step === 'success' && createdOrder && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl">task_alt</span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {createdOrder.isFreeOrder ? 'Resources Unlocked in Your Library!' : 'Payment Submitted for Verification'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
                  {createdOrder.isFreeOrder
                    ? `Your free digital download permissions have been registered for ${createdOrder.customerEmail}.`
                    : `Order ${createdOrder.orderNumber} is under review. Download permissions will unlock immediately upon admin verification.`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 max-w-md mx-auto text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Reference:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{createdOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Amount:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {createdOrder.isFreeOrder ? 'FREE' : `${createdOrder.totalETB} ETB`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span
                    className={`font-bold uppercase ${
                      createdOrder.status === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {createdOrder.status}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:opacity-90"
                >
                  Go to My Digital Library →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
