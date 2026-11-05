import React, { useState } from 'react';
import {
  BarChart3,
  Sparkles,
  Package,
  Layers,
  Send,
  PlusCircle,
  Calculator,
  CheckCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  Building,
  Barcode,
  DollarSign,
  TrendingUp,
  RotateCcw,
  Clock,
  UserCheck,
  Image as ImageIcon,
  Sliders,
  ExternalLink,
  Trash2,
  Edit,
  ArrowLeftRight,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, UserRole, BannerSlide, LocationStock } from '../types';
import { ZOOS_HERO_IMAGE_URL, SMARTWATCH_IMAGE_URL, HEADPHONES_IMAGE_URL, CHARGER_IMAGE_URL, HERO_IMAGE_URL } from '../data/mockProducts';
import { BIDashboard } from './BIDashboard';

export const AdminPortal: React.FC = () => {
  const {
    lang,
    formatPrice,
    products,
    orders,
    locationStocks,
    updateStock,
    transferStock,
    auditLogs,
    currentRole,
    setCurrentRole,
    heroBanners,
    publishBannerSlide,
    deleteBannerSlide,
    setIsAiStudioModalOpen,
    setAiStudioSelectedProduct,
    setIsPosModalOpen,
    fulfillOrderWithSupplier,
    updateOrderStatus,
    setActiveView,
    dropshipStats,
    suppliers,
    posSales,
    priceChangeRequests,
    approvePriceChange,
    rejectPriceChange,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'banner_studio' | 'products' | 'inventory' | 'orders' | 'dropshipping' | 'finance' | 'dynamic_pricing' | 'audit'
  >('analytics');

  // AI Banner Studio State (Multiple image support & animation effects)
  const [bannerTagAr, setBannerTagAr] = useState('عرض خاص محدود');
  const [bannerTagEn, setBannerTagEn] = useState('Limited Special Offer');
  const [bannerTitleAr, setBannerTitleAr] = useState('أقوى عروض شواحن MagSafe وكفرات ألياف الكربون');
  const [bannerTitleEn, setBannerTitleEn] = useState('Zoos Mega MagSafe & Carbon Case Promotion');
  const [bannerSubtitleAr, setBannerSubtitleAr] = useState('خصم حصري يصل إلى 40% مع استلام فوري من بارتشن X-Mall أو شحن سريع لجميع المحافظات.');
  const [bannerSubtitleEn, setBannerSubtitleEn] = useState('Up to 40% off with instant store pickup or express courier shipping.');
  const [bannerBackgroundUrl, setBannerBackgroundUrl] = useState(ZOOS_HERO_IMAGE_URL);
  const [bannerProductOverlayUrl, setBannerProductOverlayUrl] = useState(SMARTWATCH_IMAGE_URL);
  const [bannerCategory, setBannerCategory] = useState<BannerSlide['categoryTarget']>('all');
  const [hasAnimationEffect, setHasAnimationEffect] = useState(true);
  const [bannerPublishedSuccess, setBannerPublishedSuccess] = useState(false);

  // Stock transfer modal state
  const [transferProductId, setTransferProductId] = useState<string | null>(null);
  const [transferAmount, setTransferAmount] = useState(5);
  const [transferFrom, setTransferFrom] = useState<'loc-xmall' | 'loc-warehouse'>('loc-warehouse');
  const [transferTo, setTransferTo] = useState<'loc-xmall' | 'loc-warehouse'>('loc-xmall');

  const handlePublishBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const newBanner: BannerSlide = {
      id: `banner-${Date.now()}`,
      tagAr: bannerTagAr,
      tagEn: bannerTagEn,
      titleAr: bannerTitleAr,
      titleEn: bannerTitleEn,
      subtitleAr: bannerSubtitleAr,
      subtitleEn: bannerSubtitleEn,
      imageUrl: bannerBackgroundUrl,
      productOverlayUrl: bannerProductOverlayUrl,
      categoryTarget: bannerCategory,
      hasAnimationEffect,
      ctaTextAr: 'تسوق العرض الآن',
      ctaTextEn: 'Shop Offer',
    };

    publishBannerSlide(newBanner);
    setBannerPublishedSuccess(true);
    setTimeout(() => setBannerPublishedSuccess(false), 2500);
  };

  const handleBannerBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerBackgroundUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleBannerOverlayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerProductOverlayUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleExecuteTransfer = () => {
    if (transferProductId && transferAmount > 0) {
      transferStock(transferProductId, transferFrom, transferTo, transferAmount);
      setTransferProductId(null);
    }
  };

  // Low stock items count in X-Mall
  const lowStockItems = locationStocks.filter((s) => s.locationId === 'loc-xmall' && s.usable < s.reorderLevel);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header with RBAC Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" />
            <span>
              {lang === 'ar'
                ? 'لوحة التحكم الإدارية المركزية (Admin Control Webapp)'
                : 'Central Admin Control Webapp'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {lang === 'ar'
              ? 'منظومة إدارة الكتالوج، المخزون، والمبيعات (Omnichannel SSoT)'
              : 'Omnichannel SSoT Management: Catalog, Stock, POS, & Dropshipping'}
          </h1>
        </div>

        {/* RBAC Role Selector & View Store */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">{lang === 'ar' ? 'صلاحيات المشرف:' : 'Role (RBAC):'}</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-300 rounded-lg px-2 py-1 outline-none cursor-pointer"
            >
              <option value="owner">System Owner (المالك الكامل)</option>
              <option value="admin">General Manager (المدير العام)</option>
              <option value="inventory_manager">Inventory Officer (مسؤول المخزون)</option>
              <option value="cashier">Cashier (كاشير المعرض)</option>
            </select>
          </div>

          <button
            onClick={() => setActiveView('store')}
            className="px-4 py-2 text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl transition-colors shadow-md shadow-cyan-500/20"
          >
            {lang === 'ar' ? 'معاينة المتجر' : 'Storefront'}
          </button>
        </div>
      </div>

      {/* Gemini AI Business Advisor Banner */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-xl">
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-wide uppercase text-cyan-400">
                {lang === 'ar'
                  ? 'المستشار التجاري الذكي (Gemini AI Business Advisor)'
                  : 'Gemini AI Real-time Business Advisor'}
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Live Insights
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {lang === 'ar'
                ? `تحليل ${orders.length} طلبات و${products.length} منتجات في المعرض: يُظهر الكتالوج أن كفرات ألياف الكربون وشواحن MagSafe تحقق أعلى سرعة دوران أسبوعية. ${
                    lowStockItems.length > 0
                      ? `⚠️ يوجد ${lowStockItems.length} صنف قارب على النفاذ في فرع X-Mall (أقل من 5 قطع) يُنصح بإجراء مناقلة من المستودع المركزي.`
                      : 'أرصدة بارتشن X-Mall مستقرة ومستعدة لتلبية طلبات الاستلام الفوري.'
                  } تم الحفاظ على متوسط هامش ربح ${dropshipStats.marginPercent.toFixed(1)}%.`
                : `Real-time analytics for ${orders.length} orders & ${products.length} products: MagSafe stations and titanium smartwatches exhibit highest turnover rate. Recommended restocking for low-stock items.`}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (8 full tabs) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto">
        {[
          { id: 'analytics', labelAr: 'التحليلات والرسوم', labelEn: 'Analytics', icon: BarChart3 },
          { id: 'banner_studio', labelAr: 'استديو بانرات التسويق AI', labelEn: 'AI Banner Studio', icon: ImageIcon },
          { id: 'products', labelAr: 'إدارة المنتجات والكتالوج', labelEn: 'Products & AI Studio', icon: Package },
          { id: 'inventory', labelAr: 'المخزون والأرصدة (X-Mall & المستودع)', labelEn: 'Inventory Balances', icon: Layers },
          { id: 'orders', labelAr: 'إدارة الطلبات ومجموعات التنفيذ', labelEn: 'Orders & Fulfillment', icon: Truck },
          { id: 'dropshipping', labelAr: 'موردو الدروب شيبينغ والمزامنة', labelEn: 'Dropship Connect', icon: Calculator },
          { id: 'finance', labelAr: 'المالية والتسويات', labelEn: 'Finance & Settlements', icon: DollarSign },
          { id: 'dynamic_pricing', labelAr: 'التسعير الديناميكي', labelEn: 'Dynamic Pricing', icon: TrendingUp },
          { id: 'audit', labelAr: 'سجل التدقيق (Audit Logs)', labelEn: 'Audit Logs', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Analytics & KPIs */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <span className="text-xs text-slate-400 block mb-1">{lang === 'ar' ? 'إجمالي المبيعات الشاملة' : 'Gross Sales'}</span>
              <span className="text-2xl font-extrabold text-white tabular-nums">
                {formatPrice(dropshipStats.totalRevenueUSD)}
              </span>
              <span className="text-[11px] text-emerald-400 block mt-1">
                {lang === 'ar' ? 'يشمل مبيعات الأونلاين ونقطة بيع الكاشير' : 'Online orders + POS register'}
              </span>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <span className="text-xs text-slate-400 block mb-1">{lang === 'ar' ? 'تكلفة التوريد (COGS)' : 'Supplier Cost (COGS)'}</span>
              <span className="text-2xl font-extrabold text-slate-300 tabular-nums">
                {formatPrice(dropshipStats.totalSupplierCostUSD)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                {lang === 'ar' ? 'المسدد للموردين والمصانع' : 'Paid to verified factories'}
              </span>
            </div>

            <div className="p-5 bg-slate-900/80 border border-emerald-500/30 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-slate-900">
              <span className="text-xs text-emerald-400 font-semibold block mb-1">{lang === 'ar' ? 'صافي الأرباح المحققة' : 'Net Realized Profit'}</span>
              <span className="text-2xl font-extrabold text-emerald-400 tabular-nums">
                +{formatPrice(dropshipStats.netProfitUSD)}
              </span>
              <span className="text-[11px] text-emerald-400/90 block mt-1 font-mono">
                {lang === 'ar' ? `متوسط هامش الربح: ${dropshipStats.marginPercent.toFixed(1)}%` : `Margin: ${dropshipStats.marginPercent.toFixed(1)}%`}
              </span>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <span className="text-xs text-slate-400 block mb-1">{lang === 'ar' ? 'إجمالي العمليات والطلبات' : 'Total Transactions'}</span>
              <span className="text-2xl font-extrabold text-white tabular-nums">
                {orders.length + posSales.length}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                {orders.length} {lang === 'ar' ? 'شحن/أونلاين' : 'Online'} · {posSales.length} {lang === 'ar' ? 'كاشير X-Mall' : 'POS'}
              </span>
            </div>
          </div>

          {/* Quick Actions Strip */}
          <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Barcode className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-xs font-bold text-white">{lang === 'ar' ? 'فتح نقطة بيع الكاشير (POS Register)' : 'Open Cashier POS Register'}</p>
                <p className="text-[11px] text-slate-400">{lang === 'ar' ? 'لخدمة عملاء المعرض وتسجيل مبيعات الكاونتر' : 'Direct counter sales for branch walk-ins'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsPosModalOpen(true)}
              className="px-4 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-colors shadow-md shadow-cyan-500/20"
            >
              {lang === 'ar' ? 'تشغيل الكاشير الآن' : 'Launch POS Register'}
            </button>
          </div>

          {/* Recharts BI Analytics Dashboard */}
          <BIDashboard />
        </div>
      )}

      {/* TAB 2: AI Banner Studio */}
      {activeTab === 'banner_studio' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ar' ? 'استديو بانرات التسويق بالذكاء الاصطناعي (AI Banner Studio)' : 'AI Marketing Banner Studio'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'صمم عروضاً ترويجية مع إمكانية دمج صور متعددة ومؤثرات متحركة ونشرها مباشرة في سلايدر المتجر الرئيسي.'
                  : 'Design promotional banners with multi-image composition, animations, and 1-click publishing to the storefront.'}
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/20">
              Live Carousel Integration
            </span>
          </div>

          {bannerPublishedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'ar'
                  ? 'تم تصدير البانر بنجاح وإضافته إلى السلايدر الرئيسي للمتجر فوراً! يمكنك الآن معاينته في الصفحة الرئيسية.'
                  : 'Banner successfully published to live storefront carousel!'}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Editor Form */}
            <form onSubmit={handlePublishBanner} className="lg:col-span-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">{lang === 'ar' ? 'شارة العرض (Badge/Tag)' : 'Offer Tag'}</label>
                <input
                  type="text"
                  value={bannerTagAr}
                  onChange={(e) => setBannerTagAr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{lang === 'ar' ? 'عنوان البانر الرئيسي بالعربية *' : 'Main Headline (Arabic) *'}</label>
                <input
                  type="text"
                  required
                  value={bannerTitleAr}
                  onChange={(e) => setBannerTitleAr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{lang === 'ar' ? 'الوصف الترويجي للعرض' : 'Promotional Subtitle'}</label>
                <textarea
                  rows={2}
                  value={bannerSubtitleAr}
                  onChange={(e) => setBannerSubtitleAr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              {/* Multiple Images Selector */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <span className="font-bold text-cyan-400 block">{lang === 'ar' ? 'تركيب الصور المتعددة (خلفية + منتج العرض):' : 'Multi-Image Composition:'}</span>
                
                <div>
                  <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'صورة الخلفية الرئيسية:' : 'Background Image Asset:'}</label>
                  <select
                    value={bannerBackgroundUrl}
                    onChange={(e) => setBannerBackgroundUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white mb-2"
                  >
                    <option value={ZOOS_HERO_IMAGE_URL}>Zoos Electronics Flagship Banner (Recommended)</option>
                    <option value={HERO_IMAGE_URL}>Dark Granite Studio Showcase</option>
                    <option value={SMARTWATCH_IMAGE_URL}>Titanium Pedestal Scene</option>
                  </select>
                  <label className="cursor-pointer flex items-center justify-center gap-2 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-cyan-400 hover:bg-slate-800">
                    <span>{lang === 'ar' ? '📁 رفع صورة خلفية من جهازك' : '📁 Upload Custom Background'}</span>
                    <input type="file" className="hidden" onChange={handleBannerBgUpload} accept="image/*" />
                  </label>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'صورة المنتج المضاف عليه العرض (Overlay/Focus):' : 'Product Focus Overlay:'}</label>
                  <select
                    value={bannerProductOverlayUrl}
                    onChange={(e) => setBannerProductOverlayUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white mb-2"
                  >
                    <option value={SMARTWATCH_IMAGE_URL}>ساعة Aether Ultra التيتانيوم</option>
                    <option value={HEADPHONES_IMAGE_URL}>سماعات Aura ANC الاحترافية</option>
                    <option value={CHARGER_IMAGE_URL}>منصة شحن MagSafe 3 في 1</option>
                  </select>
                  <label className="cursor-pointer flex items-center justify-center gap-2 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-cyan-400 hover:bg-slate-800">
                    <span>{lang === 'ar' ? '📁 رفع صورة منتج مخصصة' : '📁 Upload Custom Product Image'}</span>
                    <input type="file" className="hidden" onChange={handleBannerOverlayUpload} accept="image/*" />
                  </label>
                </div>
              </div>

              {/* Animation Effect Toggle */}
              <label className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAnimationEffect}
                  onChange={(e) => setHasAnimationEffect(e.target.checked)}
                  className="accent-cyan-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-white block">{lang === 'ar' ? 'تفعيل المؤثرات الحركية (Animated Glow Effects)' : 'Enable Ambient Motion'}</span>
                  <span className="text-[11px] text-slate-400">{lang === 'ar' ? 'إضافة وميض ضوئي ناعم وتحريك للشارة عند عرض البنر' : 'Dynamic pulse & light effects'}</span>
                </div>
              </label>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ar' ? 'نشر البنر في السلايدر الرئيسي للمتجر فوراً' : 'Publish to Storefront Carousel'}</span>
              </button>
            </form>

            {/* Live Preview Box */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                {lang === 'ar' ? 'معاينة شكل البنر الحية قبل النشر:' : 'Live Banner Preview:'}
              </span>

              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl bg-slate-950 group">
                <img
                  src={bannerBackgroundUrl}
                  alt="Banner Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-5 flex flex-col justify-end">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500 text-slate-950 self-start mb-2 ${hasAnimationEffect ? 'animate-pulse' : ''}`}>
                    {bannerTagAr}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white leading-snug mb-1">
                    {bannerTitleAr}
                  </h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 max-w-sm mb-3">
                    {bannerSubtitleAr}
                  </p>
                  <button className="px-4 py-1.5 text-xs font-bold bg-cyan-400 text-slate-950 rounded-lg self-start">
                    تسوق العرض الآن ←
                  </button>
                </div>
              </div>

              {/* Current Active Banners List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-300 block">{lang === 'ar' ? 'البانرات المعروضة حالياً بالسلايدر:' : 'Active Carousel Slides:'}</span>
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden text-xs">
                  {heroBanners.map((b) => (
                    <div key={b.id} className="p-2.5 flex items-center justify-between gap-3 bg-slate-900/60">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={b.imageUrl} alt="" className="w-10 h-7 object-cover rounded bg-slate-950 shrink-0" />
                        <span className="font-semibold text-white truncate">{b.titleAr}</span>
                      </div>
                      {heroBanners.length > 1 && (
                        <button
                          onClick={() => deleteBannerSlide(b.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                          title="حذف البنر"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Products & AI Studio */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">{lang === 'ar' ? 'كتالوج المنتجات وربط استديو الذكاء الاصطناعي' : 'Products Catalog & AI Studio Editor'}</h3>
              <p className="text-xs text-slate-400">{lang === 'ar' ? 'أي تعديل أو إضافة ينعكس فورياً على معرض المتجر وصفحات العملاء.' : 'Real-time sync with storefront gallery.'}</p>
            </div>
            <button
              onClick={() => {
                setAiStudioSelectedProduct(null);
                setIsAiStudioModalOpen(true);
              }}
              className="px-4 py-2.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-cyan-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إضافة منتج جديد عبر AI Studio' : 'Add New Product via AI Studio'}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                  <th className="py-3 px-4 text-start">SKU / Barcode</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'سعر البيع' : 'Retail Price'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'التقييم' : 'Rating'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'المصدر' : 'Source'}</th>
                  <th className="py-3 px-4 text-end">{lang === 'ar' ? 'الإجراء' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={prod.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0" />
                        <div>
                          <p className="font-bold text-white">{lang === 'ar' ? prod.titleAr : prod.titleEn}</p>
                          <span className="text-[10px] text-cyan-400 uppercase font-semibold">{prod.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      <div>{prod.sku}</div>
                      <div className="text-[10px] text-slate-500">{prod.barcode}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-white tabular-nums">
                      {formatPrice(prod.priceUSD)}
                    </td>
                    <td className="py-3 px-4 text-amber-400 font-bold tabular-nums">
                      ★ {prod.rating} ({prod.reviewsCount})
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                        {prod.sourceType === 'owned_x_mall' ? 'بارتشن X-Mall' : 'دروب شيبينغ'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setAiStudioSelectedProduct(prod);
                            setIsAiStudioModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'تعديل بالذكاء الاصطناعي' : 'Edit AI'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Multi-Location Inventory */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">{lang === 'ar' ? 'أرصدة المخزون متعدد المواقع (X-Mall & المستودع المركزي)' : 'Multi-Location Inventory Balances'}</h3>
              <p className="text-xs text-slate-400">{lang === 'ar' ? 'تتبع فوري للأرصدة الفعلية والمحجوزة والقابلة للبيع مع تنبيهات النواقص.' : 'On-hand, reserved, and usable balances with low-stock alerts.'}</p>
            </div>
            {lowStockItems.length > 0 && (
              <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{lowStockItems.length} {lang === 'ar' ? 'أصناف قاربت على النفاذ' : 'Low stock alerts'}</span>
              </span>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 text-start">SKU</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'اسم المنتج' : 'Product'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'الموقع' : 'Location'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'الرصيد الفعلي (On-Hand)' : 'On Hand'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'المحجوز (Reserved)' : 'Reserved'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'القابل للبيع (Usable)' : 'Usable'}</th>
                  <th className="py-3 px-4 text-end">{lang === 'ar' ? 'إجراء وتوريد' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {locationStocks.map((stock, idx) => {
                  const prod = products.find((p) => p.id === stock.productId);
                  const isLow = stock.usable < stock.reorderLevel;
                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-cyan-400 font-bold">{prod?.sku}</td>
                      <td className="py-3 px-4 font-semibold text-white">{lang === 'ar' ? prod?.titleAr : prod?.titleEn}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                          {lang === 'ar' ? stock.locationNameAr : stock.locationNameEn}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">{stock.onHand}</td>
                      <td className="py-3 px-4 font-mono text-amber-400 tabular-nums">{stock.reserved}</td>
                      <td className="py-3 px-4 font-mono font-black tabular-nums">
                        <span className={isLow ? 'text-amber-400' : 'text-emerald-400'}>
                          {stock.usable} {isLow && '⚠️'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-end">
                        <button
                          onClick={() => setTransferProductId(stock.productId)}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
                        >
                          {lang === 'ar' ? 'مناقلة / توريد' : 'Transfer'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quick Transfer Dialog */}
          {transferProductId && (
            <div className="p-5 bg-slate-950 border border-cyan-500/40 rounded-2xl space-y-4 max-w-lg">
              <h4 className="font-bold text-white text-xs flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ar' ? 'مناقلة رصيد بين المعرض والمستودع' : 'Transfer Stock Between Locations'}</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'من:' : 'From:'}</label>
                  <select
                    value={transferFrom}
                    onChange={(e) => setTransferFrom(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                  >
                    <option value="loc-warehouse">المستودع المركزي</option>
                    <option value="loc-xmall">بارتشن X-Mall</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'إلى:' : 'To:'}</label>
                  <select
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                  >
                    <option value="loc-xmall">بارتشن X-Mall</option>
                    <option value="loc-warehouse">المستودع المركزي</option>
                  </select>
                </div>
              </div>
              <div className="text-xs">
                <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'الكمية المراد نقلها:' : 'Transfer Quantity:'}</label>
                <input
                  type="number"
                  min="1"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExecuteTransfer}
                  className="flex-1 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                >
                  {lang === 'ar' ? 'تأكيد المناقلة الفورية' : 'Confirm Transfer'}
                </button>
                <button
                  onClick={() => setTransferProductId(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Orders & Fulfillment Groups */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">{lang === 'ar' ? 'إدارة الطلبات ومجموعات التنفيذ' : 'Orders & Fulfillment Groups'}</h3>
              <p className="text-xs text-slate-400">{lang === 'ar' ? 'تنفيذ طلبات الاستلام الفوري من بارتشن X-Mall والشحن المنزلي السريع' : 'Courier delivery vs Click & Collect X-Mall.'}</p>
            </div>
            <span className="text-xs text-slate-400">
              {orders.length} {lang === 'ar' ? 'طلبات إجمالية' : 'total orders'}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'رقم الطلب' : 'Order ID'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'نوع التنفيذ' : 'Fulfillment'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'المبلغ' : 'Total'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-4 text-end">{lang === 'ar' ? 'التوجيه والإرسال' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((ord) => {
                  const isClickCollect = ord.fulfillmentType === 'click_and_collect_xmall';
                  return (
                    <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400">{ord.id}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-white">{ord.customerName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{ord.customerPhone}</p>
                      </td>
                      <td className="py-3 px-4">
                        {isClickCollect ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                            {lang === 'ar' ? 'استلام فوري (X-Mall)' : 'Click & Collect'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            {lang === 'ar' ? 'شحن منزلي سريع' : 'Courier Air'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-white tabular-nums">
                        {formatPrice(ord.totalUSD)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-200">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-end">
                        {ord.status === 'pending_supplier' ? (
                          <button
                            onClick={() => fulfillOrderWithSupplier(ord.id)}
                            className="px-3 py-1 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1 ms-auto"
                          >
                            <Send className="w-3 h-3" />
                            <span>{lang === 'ar' ? 'إرسال للمورّد' : 'Auto Fulfill'}</span>
                          </button>
                        ) : ord.status === 'ready_for_pickup' ? (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'delivered')}
                            className="px-3 py-1 text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg transition-colors ms-auto"
                          >
                            {lang === 'ar' ? 'تسليم العميل بالمعرض' : 'Mark Picked Up'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">
                            {ord.supplierTrackingNumber || 'Fulfillment Synced'}
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

      {/* TAB 6: Dropshipping Hub */}
      {activeTab === 'dropshipping' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map((sup) => (
              <div key={sup.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{sup.platform}</span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {lang === 'ar' ? 'مزامنة API نشطة' : 'API Connected'}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{sup.name}</h4>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">معالجة</span>
                    <span className="font-bold text-white">{sup.avgProcessingDays} يوم</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">الشحن</span>
                    <span className="font-bold text-white">{sup.avgShippingDays} أيام</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">الجودة</span>
                    <span className="font-bold text-emerald-400 font-mono">{sup.qualityScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: Finance & Settlements */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white">{lang === 'ar' ? 'التحليلات المالية والتسويات (Revenue vs COGS vs Profit)' : 'Financial Settlements Analysis'}</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{lang === 'ar' ? 'ملخص التسويات والتحصيلات' : 'Settlement Reconciliation'}</h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{lang === 'ar' ? 'إجمالي الإيرادات الإجمالية:' : 'Gross Revenue:'}</span>
                  <span className="font-bold text-white tabular-nums">{formatPrice(dropshipStats.totalRevenueUSD)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{lang === 'ar' ? 'تكلفة البضاعة للموردين (COGS):' : 'Supplier COGS:'}</span>
                  <span className="font-bold text-slate-300 tabular-nums">{formatPrice(dropshipStats.totalSupplierCostUSD)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800 text-emerald-400">
                  <span className="font-bold">{lang === 'ar' ? 'صافي الأرباح التشغيلية:' : 'Net Operating Profit:'}</span>
                  <span className="font-extrabold text-base tabular-nums">+{formatPrice(dropshipStats.netProfitUSD)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">{lang === 'ar' ? 'نسبة هامش الربح الصافي:' : 'Net Profit Margin:'}</span>
                  <span className="font-mono font-bold text-white tabular-nums">{dropshipStats.marginPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{lang === 'ar' ? 'توزيع قنوات التحصيل' : 'Collection Channels'}</h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{lang === 'ar' ? 'مبيعات المعرض الفورية (X-Mall POS):' : 'X-Mall POS Counter Cash:'}</span>
                  <span className="font-bold text-white tabular-nums">
                    {formatPrice(posSales.reduce((s, it) => s + it.totalUSD, 0))}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{lang === 'ar' ? 'المدفوعات الإلكترونية (Apple Pay & Cards):' : 'Online Digital Payments:'}</span>
                  <span className="font-bold text-emerald-400 tabular-nums">
                    {formatPrice(orders.filter((o) => o.paymentMethod !== 'cod').reduce((s, it) => s + it.totalUSD, 0))}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{lang === 'ar' ? 'الدفع عند الاستلام (COD معلق للتحصيل):' : 'COD Pending Courier Clearance:'}</span>
                  <span className="font-bold text-amber-400 tabular-nums">
                    {formatPrice(orders.filter((o) => o.paymentMethod === 'cod').reduce((s, it) => s + it.totalUSD, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: Dynamic Pricing */}
      {activeTab === 'dynamic_pricing' && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white">{lang === 'ar' ? 'طلبات تعديل الأسعار الديناميكية' : 'Dynamic Price Adjustment Requests'}</h3>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                  <th className="py-3 px-4">{lang === 'ar' ? 'السعر القديم' : 'Old Price'}</th>
                  <th className="py-3 px-4">{lang === 'ar' ? 'السعر الجديد' : 'New Price'}</th>
                  <th className="py-3 px-4">{lang === 'ar' ? 'السبب' : 'Reason'}</th>
                  <th className="py-3 px-4">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-4 text-end">{lang === 'ar' ? 'الإجراء' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {priceChangeRequests.map(req => {
                  const prod = products.find(p => p.id === req.productId);
                  return (
                    <tr key={req.id}>
                      <td className="py-3 px-4 font-semibold text-white">{lang === 'ar' ? prod?.titleAr : prod?.titleEn}</td>
                      <td className="py-3 px-4 font-mono">{formatPrice(req.oldPriceUSD)}</td>
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400">{formatPrice(req.newPriceUSD)}</td>
                      <td className="py-3 px-4">{req.reason}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${req.status === 'pending' ? 'bg-amber-500/10 text-amber-300' : req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-end">
                        {req.status === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => approvePriceChange(req.id)} className="px-3 py-1 bg-emerald-500 text-slate-950 rounded-lg text-[10px] font-bold">Approve</button>
                            <button onClick={() => rejectPriceChange(req.id)} className="px-3 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-bold">Reject</button>
                          </div>
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

      {/* TAB 9: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">{lang === 'ar' ? 'سجل التدقيق والأمان الإداري (Audit Logs)' : 'Administrative Security Audit Logs'}</h3>
              <p className="text-xs text-slate-400">{lang === 'ar' ? 'توثيق تاريخي لجميع عمليات الإضافة والتعديل والبيع والمناقلة.' : 'Immutable trace of all administrative operations.'}</p>
            </div>
          </div>

          <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 text-xs space-y-1 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
                  <span>{log.timestamp}</span>
                  <span className="font-bold text-cyan-400 uppercase">{log.action.replace('_', ' ')}</span>
                </div>
                <p className="font-bold text-white">
                  {log.target} <span className="text-slate-400 font-normal">· Actor: {log.actor}</span>
                </p>
                <p className="text-slate-400 leading-relaxed">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
