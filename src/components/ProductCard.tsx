import React, { useState } from 'react';
import { ShoppingBag, Star, Eye, Check, ArrowLeftRight, Heart, Bell } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    lang,
    formatPrice,
    addToCart,
    setSelectedProduct,
    addToComparison,
    removeFromComparison,
    isInComparison,
    toggleWishlist,
    isInWishlist,
    setSelectedAlertProduct,
    setIsPriceDropModalOpen,
  } = useStore();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = product.variants[0];
    addToCart(product, defaultVariant, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const categoryLabel = {
    phone_accessories: lang === 'ar' ? 'إكسسوارات هواتف' : 'Phone Gear',
    earphones: lang === 'ar' ? 'سماعات صوتية' : 'Audio & ANC',
    smartwatches: lang === 'ar' ? 'ساعات ذكية' : 'Smartwatches',
  }[product.category];

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-white dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-slate-700/90 rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-950/20 cursor-pointer"
    >
      {/* Image Container with 4:3 Aspect Ratio */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950/80 mb-3.5 flex items-center justify-center">
        {!imageError ? (
          <img
            src={product.imageUrl}
            alt={lang === 'ar' ? product.titleAr : product.titleEn}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 p-4 text-center">
            <span className="text-2xl mb-1">⚡</span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {lang === 'ar' ? product.titleAr : product.titleEn}
            </span>
          </div>
        )}

        {/* Subtle Text Tag */}
        {product.badgeAr && (
          <span className="absolute top-2.5 start-2.5 text-[11px] font-semibold tracking-wide text-cyan-600 dark:text-cyan-300 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded border border-cyan-500/30 shadow-sm">
            {lang === 'ar' ? product.badgeAr : product.badgeEn}
          </span>
        )}

        {/* Wishlist Heart Button (Top End) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 end-2.5 p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
            isInWishlist(product.id)
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-slate-950/70 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700/60'
          }`}
          title={
            isInWishlist(product.id)
              ? (lang === 'ar' ? 'إزالة من المفضلة' : 'Remove from Wishlist')
              : (lang === 'ar' ? 'إضافة إلى المفضلة' : 'Add to Wishlist')
          }
        >
          <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
        </button>

        {/* Quick Actions (Price Alert, Compare, Quick View) */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Price Alert Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAlertProduct(product);
              setIsPriceDropModalOpen(true);
            }}
            className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-500 dark:text-amber-300 border border-slate-200 dark:border-slate-700 shadow-md transition-colors"
            title={lang === 'ar' ? 'تنبيه انخفاض السعر' : 'Price Drop Alert'}
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isInComparison(product.id)) {
                removeFromComparison(product.id);
              } else {
                addToComparison(product);
              }
            }}
            className={`p-2 rounded-lg border shadow-md transition-all ${
              isInComparison(product.id)
                ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                : 'bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
            title={
              isInComparison(product.id)
                ? (lang === 'ar' ? 'إزالة من المقارنة' : 'Remove from comparison')
                : (lang === 'ar' ? 'إضافة إلى المقارنة' : 'Add to comparison')
            }
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md"
            title={lang === 'ar' ? 'معاينة سريعة' : 'Quick View'}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metadata & Title */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating separator */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="font-medium text-cyan-600 dark:text-cyan-400/90">{categoryLabel}</span>
            <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-300">{product.rating}</span>
              <span className="text-slate-400 dark:text-slate-500 text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug mb-2">
            {lang === 'ar' ? product.titleAr : product.titleEn}
          </h3>

          {/* Device Compatibility hint */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            <span>{lang === 'ar' ? 'متوافق مع:' : 'Compatible:'}</span>
            <span className="text-slate-700 dark:text-slate-300 truncate font-mono">
              {product.brandCompatibility.slice(0, 2).join(' · ')}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                {formatPrice(product.priceUSD)}
              </span>
              {product.originalPriceUSD && (
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through tabular-nums">
                  {formatPrice(product.originalPriceUSD)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">
              {lang === 'ar' ? 'شحن مباشر متوفر' : 'In stock · Fast dispatch'}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={justAdded}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center justify-center transition-all ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 active:scale-95'
            }`}
            title={lang === 'ar' ? 'إضافة إلى السلة' : 'Add to cart'}
          >
            {justAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
