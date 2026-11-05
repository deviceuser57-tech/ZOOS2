import React, { useState } from 'react';
import { X, Bell, DollarSign, CheckCircle2, TrendingDown, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PriceDropModal: React.FC = () => {
  const {
    lang,
    formatPrice,
    isPriceDropModalOpen,
    setIsPriceDropModalOpen,
    selectedAlertProduct,
    addPriceDropAlert,
    priceDropAlerts,
    triggerPriceDropSimulation,
  } = useStore();

  const [contact, setContact] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [success, setSuccess] = useState(false);

  if (!isPriceDropModalOpen || !selectedAlertProduct) return null;

  const currentPrice = selectedAlertProduct.priceUSD;
  const targetPrice = Number((currentPrice * (1 - discountPercent / 100)).toFixed(2));

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    addPriceDropAlert(selectedAlertProduct.id, contact.trim(), targetPrice);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsPriceDropModalOpen(false);
    }, 1800);
  };

  const handleSimulateDrop = () => {
    triggerPriceDropSimulation(selectedAlertProduct.id, targetPrice);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsPriceDropModalOpen(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-md bg-[#0e131b] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'ar' ? 'تنبيهات انخفاض الأسعار' : 'Price Drop Alerts'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'ar' ? 'أول من يعلم عند تطبيق عروض وتخفيضات' : 'Get notified when this item goes on sale'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPriceDropModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product mini card */}
        <div className="flex items-center gap-3 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <img
            src={selectedAlertProduct.imageUrl}
            alt={lang === 'ar' ? selectedAlertProduct.titleAr : selectedAlertProduct.titleEn}
            className="w-14 h-14 rounded-xl object-cover bg-slate-950 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">
              {lang === 'ar' ? selectedAlertProduct.titleAr : selectedAlertProduct.titleEn}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400">{lang === 'ar' ? 'السعر الحالي:' : 'Current:'}</span>
              <span className="text-sm font-extrabold text-cyan-400 tabular-nums">
                {formatPrice(currentPrice)}
              </span>
            </div>
          </div>
        </div>

        {success ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 text-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              {lang === 'ar'
                ? 'تم تفعيل التنبيه بنجاح! سنرسل لك إشعاراً فورياً عند وصول السعر للهدف.'
                : 'Alert activated! We will notify you when price drops.'}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4 text-xs">
            {/* Target price slider / discount selection */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-medium text-slate-300">
                <span>{lang === 'ar' ? 'اختر نسبة التخفيض المطلوبة:' : 'Target Price Threshold:'}</span>
                <span className="text-emerald-400 font-bold tabular-nums">
                  -{discountPercent}% ({formatPrice(targetPrice)})
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[10, 15, 25].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPercent(pct)}
                    className={`py-2 rounded-xl font-bold border transition-colors ${
                      discountPercent === pct
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    خصم {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Email / Phone input */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {lang === 'ar' ? 'رقم الواتساب أو البريد الإلكتروني للتنبيه *' : 'WhatsApp Number or Email *'}
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={lang === 'ar' ? '0501234567 أو your@email.com' : '+966... or email'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
              >
                <Bell className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تفعيل تنبيه انخفاض السعر' : 'Notify Me When Price Drops'}</span>
              </button>

              {/* Instant Simulation button for testing */}
              <button
                type="button"
                onClick={handleSimulateDrop}
                className="w-full py-2 px-3 rounded-xl font-semibold text-[11px] bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ar' ? 'محاكاة انخفاض السعر الآن (تجربة سريعة)' : 'Simulate Price Drop Instantly (Test)'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
