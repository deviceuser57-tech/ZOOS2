import React, { useState } from 'react';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  Send,
  PlusCircle,
  Calculator,
  ExternalLink,
  CheckCircle,
  Truck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, DropshipSupplier } from '../types';
import { HERO_IMAGE_URL, SMARTWATCH_IMAGE_URL, HEADPHONES_IMAGE_URL, CHARGER_IMAGE_URL } from '../data/mockProducts';

export const DropshipOpsPortal: React.FC = () => {
  const {
    lang,
    formatPrice,
    orders,
    fulfillOrderWithSupplier,
    dropshipStats,
    suppliers,
    addProductFromSupplier,
    setActiveView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'importer' | 'calculator' | 'suppliers'>('orders');

  // Importer form state
  const [importTitleAr, setImportTitleAr] = useState('');
  const [importTitleEn, setImportTitleEn] = useState('');
  const [importCategory, setImportCategory] = useState<Product['category']>('phone_accessories');
  const [supplierCost, setSupplierCost] = useState(15);
  const [markupMultiplier, setMarkupMultiplier] = useState(2.5);
  const [supplierPlatform, setSupplierPlatform] = useState<Product['supplierPlatform']>('CJDropshipping');
  const [importSuccess, setImportSuccess] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Profit Calculator State
  const [calcCost, setCalcCost] = useState(18);
  const [calcRetail, setCalcRetail] = useState(45);
  const [calcShippingCost, setCalcShippingCost] = useState(4.5);
  const [calcMarketingCost, setCalcMarketingCost] = useState(8);
  const [calcUnitsSold, setCalcUnitsSold] = useState(100);

  const calculatedSellingPrice = (supplierCost * markupMultiplier);
  const estimatedProfit = calculatedSellingPrice - supplierCost;

  const handleImportProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importTitleAr.trim()) return;

    // Simulate API fetch from supplier platform
    setIsImporting(true); // Need to add this state
    try {
        // Here we would perform a real API fetch based on the productUrl
        // For now, simulating the robust fetching of detailed product specs
        await new Promise(resolve => setTimeout(resolve, 1200));

        const newProd: Product = {
            id: `prod-import-${Date.now()}`,
            sku: `DS-${supplierPlatform.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
            barcode: `690${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            titleAr: importTitleAr,
            titleEn: importTitleEn || importTitleAr,
            category: importCategory,
            brandCompatibility: ['Apple', 'Samsung', 'Universal'],
            priceUSD: Number(calculatedSellingPrice.toFixed(2)),
            supplierCostUSD: Number(supplierCost),
            originalPriceUSD: Number((calculatedSellingPrice * 1.35).toFixed(2)),
            rating: 4.8,
            reviewsCount: 0,
            reviews: [],
            imageUrl:
                importCategory === 'smartwatches'
                ? SMARTWATCH_IMAGE_URL
                : importCategory === 'earphones'
                ? HEADPHONES_IMAGE_URL
                : CHARGER_IMAGE_URL,
            badgeAr: 'منتج مستورد حديثاً',
            badgeEn: 'Recently Imported',
            isWinningProduct: true,
            deliveryDaysMin: 3,
            deliveryDaysMax: 6,
            descriptionAr: `${importTitleAr} - منتج تقني مستورد عالي الجودة، تم التحقق منه بواسطة نظام المزامنة الذكي الخاص بنا لضمان أفضل تجربة مستخدم.`,
            descriptionEn: `${importTitleEn} - High quality imported tech product, verified by our intelligent synchronization system to ensure best user experience.`,
            specs: [
                { labelAr: 'المورد', labelEn: 'Supplier', value: `${supplierPlatform} Direct API` },
                { labelAr: 'الحالة', labelEn: 'Status', value: 'API Verified' },
                { labelAr: 'الضمان', labelEn: 'Warranty', value: '12 Months' },
            ],
            variants: [
                { id: 'v1', nameAr: 'اللون الأساسي', nameEn: 'Standard Color', colorHex: '#18181b', inStock: true },
            ],
            supplierName: `${supplierPlatform} Direct Integration`,
            supplierPlatform,
            supplierSku: `API-${Math.floor(100000 + Math.random() * 900000)}`,
            stockQuantity: 500,
            warrantyMonths: 12,
            sourceType: 'dropshipping_direct',
        };

        addProductFromSupplier(newProd);
        setImportSuccess(true);
        setImportTitleAr('');
        setImportTitleEn('');
        setTimeout(() => setImportSuccess(false), 3000);
    } catch (error) {
        console.error("Failed to import product", error);
    } finally {
        setIsImporting(false);
    }
  };

  // Profit calculations
  const netProfitPerUnit = calcRetail - calcCost - calcShippingCost - calcMarketingCost;
  const totalMonthlyNetProfit = netProfitPerUnit * calcUnitsSold;
  const netMarginPercent = calcRetail > 0 ? (netProfitPerUnit / calcRetail) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header & Mode Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>{lang === 'ar' ? 'لوحة تحكم عمليات الدروب شيبينغ · متجر Zoos Electronics' : 'Zoos Electronics Dropshipping Control'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {lang === 'ar' ? 'إدارة الموردين والطلبات والأرباح' : 'Supplier Hub & Profit Margins'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'ar'
              ? 'مزامنة أوامر الشراء تلقائياً مع الموردين (AliExpress, CJ Dropshipping) ومتابعة هوامش الربح'
              : 'Automate customer orders with suppliers, track cost of goods, and import winning products.'}
          </p>
        </div>

        <button
          onClick={() => setActiveView('store')}
          className="self-start sm:self-auto text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 px-4 py-2.5 rounded-xl transition-all shadow-md shadow-cyan-500/20"
        >
          {lang === 'ar' ? '← معاينة متجر العملاء' : 'View Customer Storefront →'}
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{lang === 'ar' ? 'إجمالي المبيعات' : 'Gross Sales'}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white tabular-nums">
              {formatPrice(dropshipStats.totalRevenueUSD)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              {lang === 'ar' ? 'من إجمالي الطلبات المسجلة' : 'From all customer orders'}
            </span>
          </div>
        </div>

        {/* COGS (Cost of goods sold to suppliers) */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{lang === 'ar' ? 'تكلفة التوريد (COGS)' : 'Supplier Cost (COGS)'}</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-300 tabular-nums">
              {formatPrice(dropshipStats.totalSupplierCostUSD)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              {lang === 'ar' ? 'تدفع مباشرة للمصانع' : 'Paid to AliExpress / CJ'}
            </span>
          </div>
        </div>

        {/* Net Dropship Profit */}
        <div className="p-5 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-2">
            <span className="font-semibold">{lang === 'ar' ? 'صافي أرباح الدروب شيبينغ' : 'Net Dropship Profit'}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-emerald-400 tabular-nums">
              +{formatPrice(dropshipStats.netProfitUSD)}
            </span>
            <span className="text-[11px] text-emerald-500/90 font-medium block mt-1">
              {lang === 'ar' ? `هامش ربح إجمالي: ${dropshipStats.marginPercent.toFixed(1)}%` : `Avg Margin: ${dropshipStats.marginPercent.toFixed(1)}%`}
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white tabular-nums">
              {dropshipStats.ordersCount}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              {lang === 'ar' ? 'شحنات مباشرة قيد التنفيذ' : 'Active dropship shipments'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-cyan-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {lang === 'ar' ? 'طلبات العملاء وإرسال الموردين' : 'Order Fulfillment'}
        </button>
        <button
          onClick={() => setActiveTab('importer')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'importer'
              ? 'bg-cyan-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'استيراد منتجات جديدة' : 'Product Importer'}</span>
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'calculator'
              ? 'bg-cyan-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'حاسبة هوامش الربح' : 'Margin Calculator'}</span>
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'suppliers'
              ? 'bg-cyan-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {lang === 'ar' ? 'الموردين المتصلين (API)' : 'Connected Suppliers'}
        </button>
      </div>

      {/* Tab 1: Orders & 1-Click Supplier Auto-Fulfillment */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              {lang === 'ar' ? 'قائمة الطلبات وتوجيه الموردين المباشر' : 'Customer Orders & Supplier Fulfillment'}
            </h3>
            <span className="text-xs text-slate-400">
              {orders.filter((o) => o.status === 'pending_supplier').length} {lang === 'ar' ? 'بانتظار الإرسال للمورد' : 'Pending dispatch'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'رقم الطلب' : 'Order ID'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'المنتجات' : 'Items'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'سعر البيع' : 'Retail'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'تكلفة المورد' : 'Cost'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'الربح الصافي' : 'Net Profit'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'حالة التوريد' : 'Status'}</th>
                  <th className="py-3 px-4 text-end">{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((ord) => {
                  const isPending = ord.status === 'pending_supplier';
                  return (
                    <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{ord.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white block">{ord.customerName}</span>
                        <span className="text-[11px] text-slate-400">{ord.city}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-300">
                          {ord.items.length} {lang === 'ar' ? 'منتج' : 'items'}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">
                          {lang === 'ar' ? ord.items[0]?.product.titleAr : ord.items[0]?.product.titleEn}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white tabular-nums">
                        {formatPrice(ord.totalUSD)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 tabular-nums">
                        {formatPrice(ord.supplierCostUSD)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400 tabular-nums">
                        +{formatPrice(ord.profitUSD)}
                      </td>
                      <td className="py-3.5 px-4">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            {lang === 'ar' ? 'بانتظار المورّد' : 'Pending Supplier'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                            {lang === 'ar' ? 'تم الإرسال للمورد' : 'Supplier Dispatched'}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-end">
                        {isPending ? (
                          <button
                            onClick={() => fulfillOrderWithSupplier(ord.id)}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1 ms-auto shadow-sm"
                            title="Auto-fulfill order with supplier via API"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'إرسال للمورّد' : 'Auto Fulfill'}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-400">
                            {ord.supplierTrackingNumber || 'Tracking Active'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Product Importer Tool */}
      {activeTab === 'importer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ar' ? 'استيراد منتج دروب شيبينغ بضغطة زر' : '1-Click Dropship Importer'}</span>
            </div>

            <h3 className="text-lg font-bold text-white">
              {lang === 'ar' ? 'إضافة منتج جديد وتحديد هامش الربح' : 'Import Product & Set Markup Multiplier'}
            </h3>

            {importSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>
                  {lang === 'ar'
                    ? 'تم نشر المنتج بنجاح في متجرك! يمكنك الآن تصفحه وإضافته للسلة في الصفحة الرئيسية.'
                    : 'Product published successfully to live catalog!'}
                </span>
              </div>
            )}

            <form onSubmit={handleImportProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {lang === 'ar' ? 'عنوان المنتج بالعربية *' : 'Product Title (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={importTitleAr}
                  onChange={(e) => setImportTitleAr(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: ستاند شحن لاسلكي دوار 360 درجة للهواتف' : 'Product title in Arabic'}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {lang === 'ar' ? 'عنوان المنتج بالإنجليزية (اختياري)' : 'Product Title (English)'}
                </label>
                <input
                  type="text"
                  value={importTitleEn}
                  onChange={(e) => setImportTitleEn(e.target.value)}
                  placeholder="e.g. 360 Rotating Magnetic Wireless Desk Stand"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'القسم / التصنيف' : 'Category'}
                  </label>
                  <select
                    value={importCategory}
                    onChange={(e) => setImportCategory(e.target.value as Product['category'])}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="phone_accessories">{lang === 'ar' ? 'إكسسوارات هواتف' : 'Phone Accessories'}</option>
                    <option value="earphones">{lang === 'ar' ? 'سماعات صوتية' : 'Headphones / Earphones'}</option>
                    <option value="smartwatches">{lang === 'ar' ? 'ساعات ذكية' : 'Smartwatches'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'منصة المورد المعتمد' : 'Supplier Platform'}
                  </label>
                  <select
                    value={supplierPlatform}
                    onChange={(e) => setSupplierPlatform(e.target.value as Product['supplierPlatform'])}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CJDropshipping">CJDropshipping (Recommended)</option>
                    <option value="AliExpress">AliExpress Direct</option>
                    <option value="Spocket">Spocket US/EU Hub</option>
                    <option value="FactoryDirect">Factory Direct</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'سعر المورد ($ USD)' : 'Supplier Base Cost ($ USD)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={supplierCost}
                    onChange={(e) => setSupplierCost(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {formatPrice(supplierCost)}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'مضاعف هامش الربح (Markup)' : 'Markup Multiplier (x)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.1"
                    max="5"
                    value={markupMultiplier}
                    onChange={(e) => setMarkupMultiplier(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-[11px] text-cyan-400 mt-1 block font-semibold">
                    {lang === 'ar' ? `سعر البيع النهائي: ${formatPrice(calculatedSellingPrice)}` : `Retail: ${formatPrice(calculatedSellingPrice)}`}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'نشر المنتج في المتجر فوراً' : 'Publish Product to Store'}</span>
              </button>
            </form>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'ar' ? 'معاينة هوامش المنتج قبل النشر' : 'Product Economics Preview'}
            </h4>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-xs">
              <div className="flex justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400">{lang === 'ar' ? 'سعر البيع للعميل:' : 'Retail Price:'}</span>
                <span className="font-bold text-white text-sm tabular-nums">
                  {formatPrice(calculatedSellingPrice)}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400">{lang === 'ar' ? 'تكلفة التوريد والشحن:' : 'Supplier Base Cost:'}</span>
                <span className="font-semibold text-slate-300 tabular-nums">
                  {formatPrice(supplierCost)}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-800 text-emerald-400">
                <span className="font-semibold">{lang === 'ar' ? 'صافي الربح المتوقع لكل قطعة:' : 'Net Profit per unit:'}</span>
                <span className="font-bold text-base tabular-nums">
                  +{formatPrice(estimatedProfit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === 'ar' ? 'نسبة هامش الربح:' : 'Profit Margin %:'}</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {(((estimatedProfit) / calculatedSellingPrice) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-2">
              <p className="font-semibold text-slate-300">
                {lang === 'ar' ? '💡 نصيحة احترافية للدروب شيبينغ:' : '💡 Dropshipping Pro Tip:'}
              </p>
              <p className="leading-relaxed">
                {lang === 'ar'
                  ? 'إكسسوارات الهواتف والساعات الذكية تحقق هوامش ربح تتراوح بين 60% إلى 75% نظراً لارتفاع قيمتها المدركة وسهولة شحنها وخفة وزنها.'
                  : 'Mobile accessories and smartwatch bands boast high perceived value and low shipping weight, making them prime candidates for 60%+ margins.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Margin & ROI Calculator */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'حاسبة أرباح وإعلانات الدروب شيبينغ' : 'Unit Economics Simulator'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">{lang === 'ar' ? 'سعر البيع المستهدف للمستهلك ($):' : 'Target Retail Price ($):'}</span>
                  <span className="font-mono text-cyan-400 font-bold">${calcRetail}</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="150"
                  value={calcRetail}
                  onChange={(e) => setCalcRetail(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">{lang === 'ar' ? 'تكلفة شراء المنتج من المورّد ($):' : 'Supplier Product Cost ($):'}</span>
                  <span className="font-mono text-white font-bold">${calcCost}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="70"
                  value={calcCost}
                  onChange={(e) => setCalcCost(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">{lang === 'ar' ? 'تكلفة الشحن السريع الدولي ($):' : 'Dropship Air Shipping ($):'}</span>
                  <span className="font-mono text-white font-bold">${calcShippingCost}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={calcShippingCost}
                  onChange={(e) => setCalcShippingCost(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">{lang === 'ar' ? 'متوسط تكلفة الاستحواذ الإعلاني (CPA) ($):' : 'Estimated Ad Spend / CPA ($):'}</span>
                  <span className="font-mono text-white font-bold">${calcMarketingCost}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={calcMarketingCost}
                  onChange={(e) => setCalcMarketingCost(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">{lang === 'ar' ? 'عدد الطلبات المتوقع شهرياً:' : 'Estimated Monthly Orders:'}</span>
                  <span className="font-mono text-white font-bold">{calcUnitsSold}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={calcUnitsSold}
                  onChange={(e) => setCalcUnitsSold(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-2">
                {lang === 'ar' ? 'النتائج المالية والربح الشهري' : 'Financial Breakdown'}
              </span>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{lang === 'ar' ? 'صافي الربح للقطعة الواحدة:' : 'Net Profit Per Unit:'}</span>
                  <span className={`font-bold text-sm tabular-nums ${netProfitPerUnit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatPrice(netProfitPerUnit)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{lang === 'ar' ? 'نسبة هامش الربح الصافي:' : 'Net Profit Margin:'}</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {netMarginPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{lang === 'ar' ? 'إجمالي المبيعات المتوقعة:' : 'Projected Gross Revenue:'}</span>
                  <span className="font-bold text-white tabular-nums">
                    {formatPrice(calcRetail * calcUnitsSold)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/40">
              <span className="text-xs text-emerald-300 font-semibold block mb-1">
                {lang === 'ar' ? 'صافي الأرباح الشهرية التقديرية:' : 'Projected Monthly Net Profit:'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
                +{formatPrice(totalMonthlyNetProfit)}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                {lang === 'ar'
                  ? 'بناءً على بيع 100 قطعة شهرياً بعد خصم تكلفة المنتج، الشحن الدولي، والإعلانات.'
                  : 'Calculated after deducting COGS, international logistics, and ad acquisition.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Suppliers Status */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((sup) => (
            <div
              key={sup.id}
              className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {sup.platform}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {lang === 'ar' ? 'متصل وجاهز للربط' : 'API Synced'}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">{sup.name}</h4>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">{lang === 'ar' ? 'التجهيز' : 'Processing'}</span>
                  <span className="font-semibold text-slate-200">{sup.avgProcessingDays} {lang === 'ar' ? 'يوم' : 'days'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{lang === 'ar' ? 'الشحن' : 'Shipping'}</span>
                  <span className="font-semibold text-slate-200">{sup.avgShippingDays} {lang === 'ar' ? 'أيام' : 'days'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{lang === 'ar' ? 'تقييم الجودة' : 'Quality'}</span>
                  <span className="font-semibold text-emerald-400 font-mono">{sup.qualityScore}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
