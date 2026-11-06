import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { ComparisonFloatingBar } from './components/ComparisonFloatingBar';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { DropshipOpsPortal } from './components/DropshipOpsPortal';
import { AdminPortal } from './components/AdminPortal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { PriceDropModal } from './components/PriceDropModal';
import { PosRegisterModal } from './components/PosRegisterModal';
import { AiImageStudioModal } from './components/AiImageStudioModal';
import { PromotionalCarousel } from './components/PromotionalCarousel';
import { CartToast } from './components/CartToast';
import { CompatibilityFinder } from './components/CompatibilityFinder';
import { Footer } from './components/Footer';
import { useOrderOutboxProcessor } from './hooks/useOrderOutboxProcessor';
import { useWhatsAppNotifications } from './hooks/useWhatsAppNotifications';
import { Smartphone, Headphones, Watch, Filter, ArrowLeftRight, Cpu } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    lang,
    darkMode,
    activeView,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    products,
    comparisonList,
    setIsComparisonModalOpen,
    selectedCompatibilityDevice,
    setSelectedCompatibilityDevice,
    setIsCompatibilityFinderOpen,
  } = useStore();

  useOrderOutboxProcessor();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Filter products by category, search query, and brand compatibility
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Brand compatibility filter
    if (selectedBrand !== 'all') {
      const matchBrand = product.brandCompatibility.some((b) =>
        b.toLowerCase().includes(selectedBrand.toLowerCase()) ||
        b.toLowerCase() === 'universal'
      );
      if (!matchBrand) return false;
    }

    // Smart Device Compatibility filter
    if (selectedCompatibilityDevice) {
      const dev = selectedCompatibilityDevice.toLowerCase();
      const matchDevice = product.brandCompatibility.some((b) =>
        dev.includes(b.toLowerCase()) || b.toLowerCase().includes('universal')
      );
      if (!matchDevice) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchAr = product.titleAr.toLowerCase().includes(q) || product.descriptionAr.toLowerCase().includes(q);
      const matchEn = product.titleEn.toLowerCase().includes(q) || product.descriptionEn.toLowerCase().includes(q);
      const matchBrand = product.brandCompatibility.some((b) => b.toLowerCase().includes(q));
      if (!matchAr && !matchEn && !matchBrand) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0f14] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />
      <PromotionalCarousel />

      <main className="flex-1">
        {/* View 1: Main Storefront */}
        {activeView === 'store' && (
          <>
            <Hero />

            {/* Catalog Section */}
            <section id="catalog-section" className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
              {/* Filter Tabs Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {selectedCategory === 'all'
                      ? (lang === 'ar' ? 'تشكيلة المنتجات المميزة' : 'Featured Collection')
                      : selectedCategory === 'phone_accessories'
                      ? (lang === 'ar' ? 'إكسسوارات الهواتف والشواحن' : 'Phone Cases & Fast Chargers')
                      : selectedCategory === 'earphones'
                      ? (lang === 'ar' ? 'سماعات الصوت الاحترافية وعزل الضوضاء' : 'Studio ANC Headphones & Earbuds')
                      : (lang === 'ar' ? 'الساعات الذكية والأساور الفاخرة' : 'Titanium Smartwatches & Straps')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lang === 'ar'
                      ? `معرض المنتجات المعتمد (${filteredProducts.length} منتج متوفر مع تحديث مباشر)`
                      : `Live Catalog: ${filteredProducts.length} items ready for immediate fulfillment`}
                  </p>
                </div>

                {/* Category Segmented Tabs (Simplified per request - removed specific tech categories from tabs) */}
                <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#0c0f14] border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-x-auto self-start sm:self-auto shadow-sm dark:shadow-none">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {lang === 'ar' ? 'جميع المنتجات' : 'All Catalog'}
                  </button>
                </div>
              </div>

              {/* Active Search & Filter chips */}
              {(searchQuery || selectedBrand !== 'all' || selectedCompatibilityDevice) && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{lang === 'ar' ? 'تصفية حسب:' : 'Active filters:'}</span>
                  {selectedCompatibilityDevice && (
                    <span className="px-2.5 py-1 rounded-md bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 shadow-sm font-semibold">
                      <Cpu className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{lang === 'ar' ? `متوافق مع: ${selectedCompatibilityDevice}` : `Fits: ${selectedCompatibilityDevice}`}</span>
                      <button onClick={() => setSelectedCompatibilityDevice(null)} className="hover:text-rose-500 font-bold ms-1 cursor-pointer">×</button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
                      <span>"{searchQuery}"</span>
                      <button onClick={() => setSearchQuery('')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer">×</button>
                    </span>
                  )}
                  {selectedBrand !== 'all' && (
                    <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
                      <span>{selectedBrand}</span>
                      <button onClick={() => setSelectedBrand('all')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer">×</button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBrand('all');
                      setSelectedCategory('all');
                      setSelectedCompatibilityDevice(null);
                    }}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline text-[11px] ms-2 cursor-pointer"
                  >
                    {lang === 'ar' ? 'إعادة ضبط التصفية' : 'Reset all'}
                  </button>
                </div>
              )}

              {/* Product Comparison Discovery Banner */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-cyan-50 dark:from-slate-900/90 via-sky-50 dark:via-cyan-950/20 to-cyan-50 dark:to-slate-900/90 border border-cyan-200 dark:border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {lang === 'ar' ? 'ميزة مقارنة المنتجات جنبًا إلى جنب' : 'Side-by-Side Product Comparison Matrix'}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                      {lang === 'ar'
                        ? 'انقر على أيقونة المقارنة ⇄ في أي بطاقة منتج لمقارنة المواصفات والأسعار وسرعة الشحن جنباً إلى جنب!'
                        : 'Click the ⇄ icon on any product to compare detailed specifications side-by-side.'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsComparisonModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5 shadow-sm"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'ar'
                      ? `فتح جدول المقارنة ${comparisonList.length > 0 ? `(${comparisonList.length})` : ''}`
                      : `Open Comparison Matrix ${comparisonList.length > 0 ? `(${comparisonList.length})` : ''}`}
                  </span>
                </button>
              </div>

              {/* Product Grid (3-4 columns desktop) */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
                  <Filter className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {lang === 'ar' ? 'لم يتم العثور على منتجات مطابقة للبحث' : 'No matching products found'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    {lang === 'ar'
                      ? 'جرب البحث بكلمات أخرى مثل "كفر"، "تيتانيوم"، "MagSafe" أو أعد ضبط الفلاتر'
                      : 'Try searching for "MagSafe", "Watch", or reset filters to browse the entire catalog.'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBrand('all');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-colors"
                  >
                    {lang === 'ar' ? 'عرض جميع المنتجات' : 'View all products'}
                  </button>
                </div>
              )}

              {/* Omnichannel & Dropshipping Advantage */}
              <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-wider uppercase">
                    {lang === 'ar' ? 'منظومة البيع المزدوج والشحن السريع' : 'Omnichannel Retail & Direct Logistics'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {lang === 'ar' ? 'حرية استلام فوري من X-Mall أو شحن مباشر لبابك' : 'Pickup in 30 Mins or Priority Door Delivery'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {lang === 'ar'
                      ? 'نوفر لك خيارات مرنة تجمع بين تجربة المعرض الميداني في مول X-Mall وبين التوصيل المنزلي السريع والدفع عند الاستلام.'
                      : 'Enjoy the speed of local store pickup combined with direct dropship access to global tech launches.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'اختر مواصفاتك وطريقة الاستلام' : 'Choose Gear & Pickup Mode'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {lang === 'ar'
                        ? 'تصفح الإكسسوارات الفاخرة واختر الاستلام الفوري من المعرض أو التوصيل المنزلي مع الدفع عند الاستلام.'
                        : 'Pick your phone cases, smartwatches, or audio accessories with flexible fulfillment options.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'فحص جودة وتجهيز فوري' : 'Quality Assurance & Packing'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {lang === 'ar'
                        ? 'جميع القطع تخضع لفحص دقيق ومعايرة إلكترونية قبل التسليم لضمان الأداء 100%.'
                        : 'Every unit is tested and verified for compatibility, battery life, and finish.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'استلام سريع وضمان 14 يوم' : 'Fast Handover & 14d Warranty'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {lang === 'ar'
                        ? 'استلم فوراً من كاونتر X-Mall أو عبر مندوب التوصيل مع ضمان استبدال واسترجاع لمدة 14 يوماً.'
                        : 'Pick up immediately at the cashier or receive expedited delivery with 14-day warranty.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* View 2: Live Tracking View */}
        {activeView === 'tracking' && <OrderTrackingView />}

        {/* View 3: Dropshipping Operations Control Panel */}
        {activeView === 'dropship_ops' && <DropshipOpsPortal />}

        {/* View 4: Full Omnichannel Admin Suite (RBAC, Inventory, POS, AI Studio, Banner Studio, Settlements, Logs) */}
        {activeView === 'admin' && <AdminPortal />}
      </main>

      {/* Global Interactive Drawers & Modals */}
      <ProductDetailModal />
      <ProductComparisonModal />
      <CartDrawer />
      <CheckoutModal />
      <ComparisonFloatingBar />
      <WishlistDrawer />
      <PriceDropModal />
      <PosRegisterModal />
      <AiImageStudioModal />
      <CartToast />
      <CompatibilityFinder />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
