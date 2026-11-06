import React, { useMemo } from 'react';
import { AlertTriangle, Package, ArrowRight, BellRing, Settings } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface StockAlertManagerProps {
  threshold?: number;
}

export const StockAlertManager: React.FC<StockAlertManagerProps> = ({ threshold = 20 }) => {
  const { lang, products, locationStocks, formatPrice } = useStore();

  const alerts = useMemo(() => {
    return locationStocks
      .filter(stock => stock.usable <= threshold)
      .map(stock => {
        const product = products.find(p => p.id === stock.productId);
        return {
          ...stock,
          productTitle: lang === 'ar' ? product?.titleAr : product?.titleEn,
          productImage: product?.imageUrl,
          price: product?.priceUSD || 0
        };
      })
      .sort((a, b) => a.usable - b.usable);
  }, [locationStocks, products, threshold, lang]);

  if (alerts.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900/50 overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header */}
      <div className="bg-amber-50 dark:bg-amber-950/30 px-4 py-3 border-b border-amber-100 dark:border-amber-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500 rounded-lg text-white">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-400">
              {lang === 'ar' ? 'تنبيهات المخزون المنخفض' : 'Low Stock Alerts'}
            </h3>
            <p className="text-[10px] text-amber-700/70 dark:text-amber-500/70">
              {lang === 'ar' 
                ? `هناك ${alerts.length} منتجات أقل من الحد المسموح (${threshold})` 
                : `${alerts.length} products are below threshold (${threshold})`}
            </p>
          </div>
        </div>
        <button className="p-1.5 text-amber-700 dark:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-amber-100 dark:divide-amber-900/20 max-h-64 overflow-y-auto">
        {alerts.map((alert) => (
          <div key={`${alert.productId}-${alert.locationId}`} className="p-3 flex items-center justify-between hover:bg-amber-50/50 dark:hover:bg-amber-950/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                <img src={alert.productImage} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[180px]">
                  {alert.productTitle}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {alert.locationNameAr}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {formatPrice(alert.price)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-end">
                <p className={`text-xs font-black ${alert.usable <= 5 ? 'text-rose-600 animate-pulse' : 'text-amber-600'}`}>
                  {alert.usable} {lang === 'ar' ? 'قطعة' : 'pcs'}
                </p>
                <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${alert.usable <= 5 ? 'bg-rose-500' : 'bg-amber-500'}`} 
                    style={{ width: `${Math.max(5, (alert.usable / threshold) * 100)}%` }}
                  />
                </div>
              </div>
              
              <button className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-all flex items-center gap-1">
                <span>{lang === 'ar' ? 'إعادة طلب' : 'Restock'}</span>
                <ArrowRight className="w-3 h-3 rtl:rotate-180" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer action */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-950/50 border-t border-amber-100 dark:border-amber-900/20 text-center">
        <button className="text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-cyan-600 transition-colors flex items-center justify-center gap-1 mx-auto">
          <Package className="w-3 h-3" />
          {lang === 'ar' ? 'عرض تقرير المخزون الكامل' : 'View full inventory report'}
        </button>
      </div>
    </div>
  );
};
