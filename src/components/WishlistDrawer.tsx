import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistDrawer: React.FC = () => {
  const {
    lang,
    formatPrice,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    isWishlistOpen,
    setIsWishlistOpen,
    setSelectedProduct,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end">
      <div
        className="w-full max-w-md bg-[#0d1117] border-s border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl animate-in slide-in-from-end duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              {lang === 'ar' ? 'قائمة الأمنيات والمفضلة' : 'My Saved Wishlist'}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-bold border border-rose-500/20">
              {wishlistProducts.length}
            </span>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Heart className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-base font-semibold text-slate-200 mb-1">
                {lang === 'ar' ? 'قائمة أمنياتك فارغة' : 'Your wishlist is empty'}
              </p>
              <p className="text-xs text-slate-500 mb-4 max-w-xs">
                {lang === 'ar'
                  ? 'انقر على أيقونة القلب على أي منتج يعجبك لحفظه والرجوع إليه قبل الشراء.'
                  : 'Click the heart icon on any product to save it here for later.'}
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors"
              >
                {lang === 'ar' ? 'استكشف المنتجات' : 'Browse Catalog'}
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex gap-3.5 items-center hover:border-slate-700 transition-colors group"
              >
                <img
                  src={product.imageUrl}
                  alt={lang === 'ar' ? product.titleAr : product.titleEn}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0 cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsWishlistOpen(false);
                  }}
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-cyan-400 font-semibold uppercase">
                      {product.category.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title={lang === 'ar' ? 'إزالة من المفضلة' : 'Remove'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsWishlistOpen(false);
                    }}
                    className="text-xs font-bold text-white truncate cursor-pointer hover:text-cyan-300 transition-colors"
                  >
                    {lang === 'ar' ? product.titleAr : product.titleEn}
                  </h4>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-extrabold text-white tabular-nums">
                      {formatPrice(product.priceUSD)}
                    </span>

                    <button
                      onClick={() => {
                        addToCart(product, product.variants[0], 1);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'إلى السلة' : 'To Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-[#0a0d12]">
            <button
              onClick={() => {
                wishlistProducts.forEach((p) => addToCart(p, p.variants[0], 1));
                setIsWishlistOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'إضافة جميع المفضلة للسلة' : 'Move All to Cart'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
