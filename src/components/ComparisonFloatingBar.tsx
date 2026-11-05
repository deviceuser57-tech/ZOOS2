import React from 'react';
import { ArrowLeftRight, X, Trash2, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ComparisonFloatingBar: React.FC = () => {
  const {
    lang,
    comparisonList,
    removeFromComparison,
    clearComparison,
    setIsComparisonModalOpen,
  } = useStore();

  if (comparisonList.length === 0) return null;

  return (
    <aside aria-label="شريط مقارنة المنتجات" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/40 p-3 sm:px-4 sm:py-3 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Indicator & Thumbnails */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white">
                {lang === 'ar' ? 'مقارنة المنتجات' : 'Compare Products'}
              </p>
              <p className="text-[10px] text-slate-400">
                {comparisonList.length} / 4 {lang === 'ar' ? 'مختارة' : 'selected'}
              </p>
            </div>
          </div>

          {/* Thumbnails row */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {comparisonList.map((product) => (
              <div
                key={product.id}
                className="relative group w-10 h-10 rounded-lg overflow-hidden bg-slate-950 border border-slate-700 shrink-0"
              >
                <img
                  src={product.imageUrl}
                  alt={lang === 'ar' ? product.titleAr : product.titleEn}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => removeFromComparison(product.id)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-rose-300"
                  title="إزالة"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearComparison}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors hidden sm:block"
            title={lang === 'ar' ? 'إفراغ قائمة المقارنة' : 'Clear all'}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsComparisonModalOpen(true)}
            className="px-4 py-2 text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar'
                ? `عرض جدول المقارنة (${comparisonList.length})`
                : `Compare (${comparisonList.length})`}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
