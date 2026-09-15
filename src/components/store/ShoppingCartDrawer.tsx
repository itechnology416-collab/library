import React, { useState } from 'react';
import { StoreCartItem } from '../../types';

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: StoreCartItem[];
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (couponCode?: string) => void;
}

export const ShoppingCartDrawer: React.FC<ShoppingCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [discountAmountETB, setDiscountAmountETB] = useState<number>(0);

  if (!isOpen) return null;

  const subtotalETB = cartItems.reduce((sum, item) => sum + (item.product.isFree ? 0 : item.product.priceETB), 0);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const res = await fetch('/api/store/cart/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((it) => ({ productId: it.productId })),
          couponCode: couponInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.couponApplied) {
        setAppliedCoupon(data.couponApplied.code);
        setDiscountAmountETB(data.discountETB);
        setCouponSuccess(`Coupon "${data.couponApplied.code}" applied! Saved ${data.discountETB} ETB.`);
      } else {
        setCouponError('Invalid, expired, or minimum order threshold not met for this coupon.');
        setAppliedCoupon(null);
        setDiscountAmountETB(0);
      }
    } catch (err) {
      console.error('Coupon validation error:', err);
      setCouponError('Failed to validate coupon.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmountETB(0);
    setCouponSuccess(null);
    setCouponError(null);
    setCouponInput('');
  };

  const grandTotalETB = Math.max(0, subtotalETB - discountAmountETB);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        id="shopping-cart-drawer"
        className="absolute inset-y-0 right-0 max-w-full flex pl-10 animate-in slide-in-from-right duration-300"
      >
        <div className="w-screen max-w-md bg-white dark:bg-zinc-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-zinc-800">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/80 dark:bg-zinc-900/80">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">shopping_bag</span>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Your Cart</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                {cartItems.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-3xl">shopping_cart_off</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-[240px]">
                  Explore books, audio masterclasses, SOC handbooks, and presentation templates.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  Browse Store Catalog
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 flex gap-3 items-center group relative shadow-sm"
                >
                  {/* Item Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-700 shrink-0">
                    <img
                      src={item.product.thumbnailUrl}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                      <span className="text-primary">{item.product.fileFormat}</span>
                      <span>•</span>
                      <span>v{item.product.version}</span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {item.product.title}
                    </h4>

                    <div className="flex items-center justify-between mt-1">
                      {item.product.isFree ? (
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">FREE</span>
                      ) : (
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {item.product.priceETB} ETB
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{item.product.fileSize}</span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.productId)}
                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 space-y-4">
              {/* Promo Code Input */}
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. ILILLII20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    disabled={Boolean(appliedCoupon)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-xs hover:bg-slate-300"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={!couponInput.trim()}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 disabled:opacity-40"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {couponSuccess && (
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    {couponSuccess}
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">error</span>
                    {couponError}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200 dark:border-zinc-800">
                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                  <span>Subtotal ({cartItems.length} items):</span>
                  <span className="font-semibold">{subtotalETB} ETB</span>
                </div>

                {discountAmountETB > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount ({appliedCoupon}):</span>
                    <span>-{discountAmountETB} ETB</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-zinc-800">
                  <span>Grand Total:</span>
                  <span>{grandTotalETB} ETB</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                id="btn-proceed-checkout"
                onClick={() => {
                  onProceedToCheckout(appliedCoupon || undefined);
                  onClose();
                }}
                className="w-full py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">lock</span>
                {grandTotalETB === 0 ? 'Claim Free Downloads' : `Proceed to Payment (${grandTotalETB} ETB)`}
              </button>

              <div className="text-center text-[10px] text-slate-400">
                🔒 Verified Ethiopian Payment Channels: CBE, Telebirr & Safaricom M-Pesa
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
