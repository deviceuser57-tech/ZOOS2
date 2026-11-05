import React, { useState } from 'react';
import { X, Star, ShoppingBag, Plus, Trash2, ArrowLeftRight, Check, ShieldCheck, Truck, Smartphone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const ProductComparisonModal: React.FC = () => {
  const {
    lang,
    formatPrice,
    comparisonList,
    removeFromComparison,
    clearComparison,
    isComparisonModalOpen,
    setIsComparisonModalOpen,
    addToCart,
    products,
    addToComparison,
  } = useStore();

  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  if (!isComparisonModalOpen) return null;

  const handleAddToCart = (product: Product) => {
    addToCart(product, product.variants[0], 1);
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  // Find remaining products that can be quickly added to comparison
  const availableToAdd = products.filter((p) => !comparisonList.some((c) => c.id === p.id));

  // Collect union of spec labels for clean matrix
  const allSpecLabels = Array.from(
    new Set(
      comparisonList.flatMap((p) =>
        p.specs.map((s) => (lang === 'ar' ? s.labelAr : s.labelEn))
      )
    )
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div
        className="relative w-full max-w-6xl bg-[#0d1117] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 my-4 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {lang === 'ar' ? 'مقارنة المنتجات والمواصفات' : 'Product Comparison Matrix'}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                  {comparisonList.length} / 4 {lang === 'ar' ? 'منتجات' : 'items'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ar'
                  ? 'جدول مقارنة جانبي لمقارنة الخصائص، الأسعار، التوافق، وسرعة التوصيل لاختيار الأنسب لك'
                  : 'Side-by-side specifications, prices, compatibility, and dropship delivery times.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparisonList.length > 0 && (
              <button
                onClick={clearComparison}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors flex items-center gap-1 border border-slate-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'ar' ? 'مسح المقارنة' : 'Clear all'}</span>
              </button>
            )}

            <button
              onClick={() => setIsComparisonModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {comparisonList.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-4">
              <ArrowLeftRight className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">
                {lang === 'ar' ? 'لم تختر أي منتجات للمقارنة بعد' : 'No products selected for comparison'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {lang === 'ar'
                  ? 'اضغط على زر "مقارنة" الموجود في بطاقة أي منتج لتتمكن من مقارنته بجانب منتج آخر بسهولة.'
                  : 'Click the "Compare" button on any product card to view side-by-side specifications.'}
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                {products.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addToComparison(p)}
                    className="px-3 py-2 text-xs font-semibold bg-slate-900 border border-slate-700 hover:border-cyan-500 rounded-xl text-slate-200 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ar' ? p.titleAr.slice(0, 24) : p.titleEn.slice(0, 24)}...</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Quick Add more items strip if less than 4 */}
              {comparisonList.length < 4 && availableToAdd.length > 0 && (
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    {lang === 'ar' ? 'إضافة منتج آخر للمقارنة:' : 'Add another item:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {availableToAdd.slice(0, 4).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => addToComparison(p)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-[11px] truncate max-w-[180px]"
                      >
                        + {lang === 'ar' ? p.titleAr : p.titleEn}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Side-by-Side Comparison Table Container */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-xs text-start border-collapse min-w-[640px]">
                  {/* Table Product Headers */}
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/70">
                      <th className="p-4 w-44 text-start font-semibold text-slate-400 uppercase tracking-wider text-[11px] sticky start-0 bg-slate-900/90 backdrop-blur-md z-10">
                        {lang === 'ar' ? 'المنتجات المقارنة' : 'Compared Products'}
                      </th>
                      {comparisonList.map((product) => (
                        <th key={product.id} className="p-4 text-start align-top w-64 min-w-[220px]">
                          <div className="space-y-3">
                            {/* Remove button */}
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-semibold text-cyan-400 uppercase">
                                {product.category.replace('_', ' ')}
                              </span>
                              <button
                                onClick={() => removeFromComparison(product.id)}
                                className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                                title="Remove from comparison"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Image Thumbnail */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                              <img
                                src={product.imageUrl}
                                alt={lang === 'ar' ? product.titleAr : product.titleEn}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {product.badgeAr && (
                                <span className="absolute top-2 start-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-cyan-300 border border-cyan-500/30">
                                  {lang === 'ar' ? product.badgeAr : product.badgeEn}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-2 leading-snug">
                              {lang === 'ar' ? product.titleAr : product.titleEn}
                            </h4>

                            {/* Price */}
                            <div className="flex items-baseline gap-2">
                              <span className="text-base font-extrabold text-white tabular-nums">
                                {formatPrice(product.priceUSD)}
                              </span>
                              {product.originalPriceUSD && (
                                <span className="text-xs text-slate-500 line-through tabular-nums">
                                  {formatPrice(product.originalPriceUSD)}
                                </span>
                              )}
                            </div>

                            {/* Action Button */}
                            <button
                              onClick={() => handleAddToCart(product)}
                              className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                                addedItemIds[product.id]
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 active:scale-95'
                              }`}
                            >
                              {addedItemIds[product.id] ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{lang === 'ar' ? 'تمت الإضافة!' : 'Added!'}</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>{lang === 'ar' ? 'إضافة إلى السلة' : 'Add to Cart'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Table Comparison Rows */}
                  <tbody className="divide-y divide-slate-800/80">
                    {/* Rating row */}
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-3.5 font-medium text-slate-400 sticky start-0 bg-slate-950/90 backdrop-blur-md z-10">
                        {lang === 'ar' ? 'التقييم وآراء العملاء' : 'Customer Rating'}
                      </td>
                      {comparisonList.map((product) => (
                        <td key={product.id} className="p-3.5 text-slate-200">
                          <div className="flex items-center gap-1.5 text-amber-400">
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span className="font-bold tabular-nums">{product.rating}</span>
                            <span className="text-slate-500 text-[11px]">
                              ({product.reviewsCount} {lang === 'ar' ? 'تقييم' : 'reviews'})
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Shipping Speed row */}
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-3.5 font-medium text-slate-400 sticky start-0 bg-slate-950/90 backdrop-blur-md z-10">
                        {lang === 'ar' ? 'مدة الشحن المباشر' : 'Dropship Delivery'}
                      </td>
                      {comparisonList.map((product) => (
                        <td key={product.id} className="p-3.5 text-slate-200">
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <Truck className="w-4 h-4" />
                            <span className="font-semibold">
                              {product.deliveryDaysMin}-{product.deliveryDaysMax} {lang === 'ar' ? 'أيام عمل' : 'business days'}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Device Compatibility row */}
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-3.5 font-medium text-slate-400 sticky start-0 bg-slate-950/90 backdrop-blur-md z-10">
                        {lang === 'ar' ? 'الأجهزة المتوافقة' : 'Device Compatibility'}
                      </td>
                      {comparisonList.map((product) => (
                        <td key={product.id} className="p-3.5 text-slate-200">
                          <div className="flex flex-wrap gap-1">
                            {product.brandCompatibility.map((b) => (
                              <span
                                key={b}
                                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Available Variants Count */}
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-3.5 font-medium text-slate-400 sticky start-0 bg-slate-950/90 backdrop-blur-md z-10">
                        {lang === 'ar' ? 'خيارات الألوان والإصدارات' : 'Available Variants'}
                      </td>
                      {comparisonList.map((product) => (
                        <td key={product.id} className="p-3.5 text-slate-200">
                          <div className="flex items-center gap-1.5">
                            {product.variants.map((v) => (
                              <span
                                key={v.id}
                                className="w-4 h-4 rounded-full border border-slate-700 shadow-sm"
                                style={{ backgroundColor: v.colorHex }}
                                title={lang === 'ar' ? v.nameAr : v.nameEn}
                              />
                            ))}
                            <span className="text-[11px] text-slate-500 ms-1">
                              ({product.variants.length} {lang === 'ar' ? 'خيارات' : 'options'})
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Dynamic Specs Rows */}
                    {allSpecLabels.map((specLabel) => (
                      <tr key={specLabel} className="hover:bg-slate-900/30 transition-colors">
                        <td className="p-3.5 font-medium text-slate-400 sticky start-0 bg-slate-950/90 backdrop-blur-md z-10">
                          {specLabel}
                        </td>
                        {comparisonList.map((product) => {
                          const matchedSpec = product.specs.find(
                            (s) => (lang === 'ar' ? s.labelAr : s.labelEn) === specLabel
                          );
                          return (
                            <td key={product.id} className="p-3.5 text-slate-300">
                              {matchedSpec ? (
                                <span className="font-medium text-slate-100">{matchedSpec.value}</span>
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* Warranty & Guarantee */}
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-3.5 font-medium text-slate-400 sticky start-0 bg-slate-950/90 backdrop-blur-md z-10">
                        {lang === 'ar' ? 'الضمان والاسترجاع' : 'Warranty & Guarantee'}
                      </td>
                      {comparisonList.map((product) => (
                        <td key={product.id} className="p-3.5 text-slate-200">
                          <div className="flex items-center gap-1.5 text-cyan-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span>{lang === 'ar' ? 'استبدال 14 يوم + فحص جودة' : '14-Day Warranty & QA'}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
