import React, { useEffect, useState } from 'react';
import { CheckCircle2, ShoppingBag, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartToast: React.FC = () => {
  const { lang, addedItemToast, dismissToast, setIsCartOpen, formatPrice } = useStore();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!addedItemToast) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const duration = 5000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          dismissToast();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [addedItemToast, dismissToast]);

  if (!addedItemToast) return null;

  const { product, variant } = addedItemToast;
  const price = product.priceUSD + (variant.extraPriceUSD || 0);

  const handleOpenCart = () => {
    dismissToast();
    setIsCartOpen(true);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 start-6 z-50 max-w-sm sm:max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden ring-1 ring-black/5 dark:ring-white/10 transition-colors">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
          <div
            className="bg-cyan-500 h-1 transition-all ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-start gap-3.5">
            {/* Product Thumbnail */}
            <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={lang === 'ar' ? product.titleAr : product.titleEn}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <span className="absolute bottom-1 end-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                <CheckCircle2 className="w-3 h-3" />
              </span>
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تمت الإضافة إلى السلة' : 'Added to Cart'}</span>
                </span>

                <button
                  onClick={dismissToast}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Dismiss toast"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                {lang === 'ar' ? product.titleAr : product.titleEn}
              </h4>

              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {lang === 'ar' ? variant.nameAr : variant.nameEn}
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="font-extrabold text-cyan-600 dark:text-cyan-400">
                  {formatPrice(price)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <button
              onClick={dismissToast}
              className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-center"
            >
              {lang === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
            </button>

            <button
              onClick={handleOpenCart}
              className="flex-1 py-2 px-3 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'عرض السلة' : 'View Cart'}</span>
              {lang === 'ar' ? (
                <ArrowLeft className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
