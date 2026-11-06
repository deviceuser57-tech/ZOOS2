import React, { useState } from 'react';
import { X, ShieldCheck, Truck, CreditCard, Banknote, CheckCircle2, Lock, Store, MapPin, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SecureCheckoutProcessor } from '../utils/SecureCheckoutProcessor';

export const CheckoutModal: React.FC = () => {
  const {
    lang,
    currency,
    formatPrice,
    cart,
    cartTotalUSD,
    isCheckoutOpen,
    setIsCheckoutOpen,
    createOrder,
  } = useStore();

  const [fulfillmentType, setFulfillmentType] = useState<'courier_delivery' | 'click_and_collect_xmall'>('courier_delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(lang === 'ar' ? 'الرياض' : 'Riyadh');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'apple_pay' | 'instapay'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isCheckoutOpen) return null;

  const totals = SecureCheckoutProcessor.calculateTotals(cart, city, couponCode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = SecureCheckoutProcessor.validateShippingDetails({
      name,
      phone,
      city,
      address: fulfillmentType === 'click_and_collect_xmall' ? 'X-Mall Partition Store Pickup' : address,
    });

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(lang === 'ar' ? `يرجى مراجعة البيانات: ${firstError}` : `Validation Error: ${firstError}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const mappedPaymentMethod = paymentMethod === 'card' ? 'paymob_card' : paymentMethod;
      
      const order = await SecureCheckoutProcessor.processOrder(
        { name, phone, city, address: fulfillmentType === 'click_and_collect_xmall' ? 'X-Mall Partition Store Pickup' : address },
        cart,
        mappedPaymentMethod as any,
        currency,
        couponCode
      );

      createOrder(order);
      setIsCheckoutOpen(false);
    } catch (err: any) {
      setError(err.message || 'Error processing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative w-full max-w-2xl bg-[#0e131a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-cyan-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lang === 'ar' ? 'إتمام الشراء والدفع الآمن' : 'Omnichannel Checkout'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar' ? 'توصيل منزلي سريع أو استلام فوري من بارتشن X-Mall' : 'Fast door delivery or store pickup'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Fulfillment Mode Choice (Omnichannel) */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
              {lang === 'ar' ? '1. طريقة الاستلام والتسليم' : '1. Delivery & Fulfillment Mode'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType('courier_delivery')}
                className={`p-3.5 rounded-2xl border text-start flex items-start gap-3 transition-all ${
                  fulfillmentType === 'courier_delivery'
                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${fulfillmentType === 'courier_delivery' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block mb-0.5">
                    {lang === 'ar' ? 'توصيل منزلي سريع' : 'Expedited Courier Delivery'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {lang === 'ar' ? 'شحن مباشر لباب بيتك (3-5 أيام عمل)' : 'Door-to-door delivery with live tracking'}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('click_and_collect_xmall')}
                className={`p-3.5 rounded-2xl border text-start flex items-start gap-3 transition-all ${
                  fulfillmentType === 'click_and_collect_xmall'
                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${fulfillmentType === 'click_and_collect_xmall' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block mb-0.5 flex items-center gap-1">
                    <span>{lang === 'ar' ? 'استلام فوري (Click & Collect)' : 'Store Pickup (Click & Collect)'}</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">{lang === 'ar' ? 'مجاني' : 'FREE'}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {lang === 'ar' ? 'استلام فوري من بارتشن Zoos بمول X-Mall' : 'Collect directly from X-Mall store booth'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              {lang === 'ar' ? '2. بيانات العميل' : '2. Customer Contact'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: فهد عبد الله' : 'e.g. John Doe'}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {lang === 'ar' ? 'رقم الجوال لتأكيد الشحنة *' : 'Mobile Phone *'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={lang === 'ar' ? '+966 50 000 0000' : '+1 555 000 0000'}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {fulfillmentType === 'courier_delivery' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'ar' ? 'المدينة *' : 'City *'}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="الرياض">الرياض (Riyadh)</option>
                    <option value="جدة">جدة (Jeddah)</option>
                    <option value="الدمام">الدمام (Dammam)</option>
                    <option value="مكة المكرمة">مكة المكرمة (Makkah)</option>
                    <option value="دبي">دبي (Dubai)</option>
                    <option value="أبوظبي">أبوظبي (Abu Dhabi)</option>
                    <option value="القاهرة">القاهرة (Cairo)</option>
                    <option value="أخرى">مدينة أخرى (Other)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'ar' ? 'العنوان التفصيلي (الحي، الشارع، رقم المبنى) *' : 'Detailed Address (Street, Building) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={lang === 'ar' ? 'حي الياسمين، شارع أنس بن مالك' : '123 Main Street, Apt 4B'}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-0.5">
                    {lang === 'ar' ? 'نقطة الاستلام: بارتشن Zoos Electronics بمول X-Mall' : 'Pickup Location: Zoos Electronics @ X-Mall'}
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {lang === 'ar'
                      ? 'متاح للاستلام فوراً بعد إتمام الطلب بمجرد إبراز رقم الطلب والاسم لموظف الكاشير.'
                      : 'Ready for immediate collection. Present your Order ID at the cashier counter.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              {lang === 'ar' ? '3. وسيلة الدفع' : '3. Payment Option'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Banknote className="w-5 h-5 text-emerald-400" />
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-cyan-500"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {fulfillmentType === 'click_and_collect_xmall'
                      ? (lang === 'ar' ? 'دفع عند الاستلام بالمعرض' : 'Pay at Store Counter')
                      : (lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery (COD)')}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'ar' ? 'نقداً أو عبر جهاز مدى عند المعاينة' : 'Cash or Mada on delivery/pickup'}
                  </p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-cyan-500"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {lang === 'ar' ? 'بطاقة بنكية / مدى' : 'Credit Card / Mada'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'ar' ? 'دفع آمن وفوري مشفر' : 'Instant 256-bit encrypted'}
                  </p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">Pay</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'apple_pay'}
                    onChange={() => setPaymentMethod('apple_pay')}
                    className="accent-cyan-500"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Apple Pay</p>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'ar' ? 'نقرة واحدة بلمسة الوجه' : 'One-tap FaceID checkout'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Coupon Code Input */}
          <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'لديك كوبون خصم؟' : 'Apply Coupon'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder={lang === 'ar' ? 'أدخل الرمز هنا (مثال: ZOSS10)' : 'Enter code (e.g. ZOSS10)'}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Detailed Price Breakdown */}
          <div className="space-y-2 mb-6 px-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
              <span className="text-white font-mono">{formatPrice(totals.subtotalUSD)}</span>
            </div>
            {totals.discountUSD > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-400 font-bold">{lang === 'ar' ? 'خصم الكوبون:' : 'Discount:'}</span>
                <span className="text-emerald-400 font-mono">-{formatPrice(totals.discountUSD)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{lang === 'ar' ? 'الشحن والتوصيل:' : 'Shipping:'}</span>
              <span className="text-white font-mono">
                {totals.shippingUSD === 0 ? (lang === 'ar' ? 'مجاني' : 'FREE') : formatPrice(totals.shippingUSD)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{lang === 'ar' ? 'ضريبة القيمة المضافة (15%):' : 'VAT (15%):'}</span>
              <span className="text-white font-mono">{formatPrice(totals.taxUSD)}</span>
            </div>
          </div>

          {/* Summary & Submit */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">
                {lang === 'ar' ? 'إجمالي الدفع النهائي:' : 'Final Total Payable:'}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-cyan-400 tabular-nums">
                {formatPrice(totals.totalUSD)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{lang === 'ar' ? 'جاري تأكيد وتوجيه الطلب...' : 'Processing order...'}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {fulfillmentType === 'click_and_collect_xmall'
                      ? (lang === 'ar' ? 'تأكيد الحجز للاستلام الفوري من المعرض' : 'Confirm Store Pickup Order')
                      : (lang === 'ar' ? 'تأكيد وشحن الطلب لباب المنزل' : 'Confirm Courier Order')}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
