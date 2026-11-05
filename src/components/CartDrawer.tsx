import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    lang,
    currency,
    formatPrice,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotalUSD,
    setIsCheckoutOpen,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscountUSD, setCouponDiscountUSD] = useState(0);
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'DROPSHIP10' || code === 'TECH2026' || code === 'VOLTX') {
      const discount = cartTotalUSD * 0.1;
      setCouponDiscountUSD(discount);
      setCouponApplied(true);
    } else {
      setCouponError(lang === 'ar' ? 'كوبون غير صالح. جرب: TECH2026' : 'Invalid coupon. Try: TECH2026');
    }
  };

  const finalTotalUSD = Math.max(0, cartTotalUSD - couponDiscountUSD);
  const freeShippingThresholdUSD = 40; // ~150 SAR
  const qualifiesForFreeShipping = cartTotalUSD >= freeShippingThresholdUSD;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end">
      <div
        className="w-full max-w-md bg-[#0d1117] border-s border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl animate-in slide-in-from-end duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              {lang === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}
            </h2>
            <span className="text-xs text-slate-400">({cart.length})</span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Bar Indicator */}
        <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
            {qualifiesForFreeShipping ? (
              <span className="text-emerald-400 font-semibold">
                {lang === 'ar' ? 'مبارك! حصلت على شحن مجاني لكامل الطلب' : 'Awesome! Free shipping unlocked'}
              </span>
            ) : (
              <span className="text-slate-300">
                {lang === 'ar'
                  ? `أضف ${formatPrice(freeShippingThresholdUSD - cartTotalUSD)} للحصول على شحن مجاني`
                  : `Add ${formatPrice(freeShippingThresholdUSD - cartTotalUSD)} for Free Shipping`}
              </span>
            )}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (cartTotalUSD / freeShippingThresholdUSD) * 100)}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingBag className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-base font-semibold text-slate-300 mb-1">
                {lang === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty'}
              </p>
              <p className="text-xs text-slate-500 mb-4 max-w-xs">
                {lang === 'ar'
                  ? 'استكشف أحدث إكسسوارات الهواتف والساعات الذكية وأضف منتجاتك المفضلة'
                  : 'Explore our dropship accessories, smartwatches, and ANC headphones.'}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
              >
                {lang === 'ar' ? 'تصفح المتجر الآن' : 'Start Shopping'}
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemPrice = item.product.priceUSD + (item.selectedVariant.extraPriceUSD || 0);
              return (
                <div
                  key={`${item.product.id}-${item.selectedVariant.id}`}
                  className="flex gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={lang === 'ar' ? item.product.titleAr : item.product.titleEn}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-950 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                          {lang === 'ar' ? item.product.titleAr : item.product.titleEn}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-cyan-400">
                        {lang === 'ar' ? item.selectedVariant.nameAr : item.selectedVariant.nameEn}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950 overflow-hidden">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.selectedVariant.id, item.quantity - 1)
                          }
                          className="px-2 py-0.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.selectedVariant.id, item.quantity + 1)
                          }
                          className="px-2 py-0.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-white tabular-nums">
                        {formatPrice(itemPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0a0d12] space-y-3">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 ${lang === 'ar' ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={lang === 'ar' ? 'كود الخصم (جرب: TECH2026)' : 'Discount Code (e.g. TECH2026)'}
                  className={`w-full bg-slate-900 border border-slate-700/80 rounded-lg py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 ${
                    lang === 'ar' ? 'pr-8 pl-2' : 'pl-8 pr-2'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
              >
                {lang === 'ar' ? 'تطبيق' : 'Apply'}
              </button>
            </form>
            {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
            {couponApplied && (
              <p className="text-[11px] text-emerald-400 font-medium">
                {lang === 'ar' ? '✓ تم تطبيق خصم 10% بنجاح' : '✓ 10% discount applied!'}
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-xs text-slate-400 pt-1">
              <div className="flex justify-between">
                <span>{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span className="text-slate-200 tabular-nums">{formatPrice(cartTotalUSD)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-400">
                  <span>{lang === 'ar' ? 'الخصم (10%):' : 'Discount (10%):'}</span>
                  <span className="tabular-nums">-{formatPrice(couponDiscountUSD)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{lang === 'ar' ? 'الشحن المباشر:' : 'Shipping:'}</span>
                <span className="text-slate-200">
                  {qualifiesForFreeShipping ? (lang === 'ar' ? 'مجاني' : 'Free') : formatPrice(4.99)}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>{lang === 'ar' ? 'الإجمالي النهائي:' : 'Total Amount:'}</span>
                <span className="text-cyan-400 tabular-nums">
                  {formatPrice(finalTotalUSD + (qualifiesForFreeShipping ? 0 : 4.99))}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{lang === 'ar' ? 'متابعة الدفع والتوصيل' : 'Proceed to Checkout'}</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
