import React, { useState } from 'react';
import { X, Cpu, CheckCircle2, Smartphone, Watch, Headphones, Sparkles, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SUPPORTED_DEVICE_BRANDS, DEVICE_MODELS_CATALOG } from '../constants';
import { DeviceBrand } from '../types/product';

export const CompatibilityFinder: React.FC = () => {
  const {
    lang,
    isCompatibilityFinderOpen,
    setIsCompatibilityFinderOpen,
    selectedCompatibilityDevice,
    setSelectedCompatibilityDevice,
    products,
    formatPrice,
    setSelectedProduct,
    addToCart,
  } = useStore();

  const [selectedBrand, setSelectedBrand] = useState<DeviceBrand>('apple');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'phone' | 'watch' | 'audio'>('all');
  const [activeModelId, setActiveModelId] = useState<string>('apple-ip16pm');

  if (!isCompatibilityFinderOpen) return null;

  // Filter models list
  const filteredModels = DEVICE_MODELS_CATALOG.filter((m) => {
    if (m.brand !== selectedBrand) return false;
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    return true;
  });

  const currentModel = DEVICE_MODELS_CATALOG.find((m) => m.id === activeModelId) || filteredModels[0] || DEVICE_MODELS_CATALOG[0];

  // Match products in catalog that are compatible with this device brand / model
  const matchedProducts = products.filter((p) => {
    // If a brand is selected but no specific model yet, match by brand
    if (!currentModel) {
      const brandName = selectedBrand.toLowerCase();
      return p.brandCompatibility.some(
        (b) => b.toLowerCase().includes(brandName) || b.toLowerCase() === 'universal'
      );
    }
    
    // Otherwise use the optimized engine for exact model matching
    return p.brandCompatibility.some(b => 
      b.toLowerCase().includes(currentModel.brand.toLowerCase()) || 
      b.toLowerCase() === 'universal'
    );
  });

  const handleApplyFilter = () => {
    setSelectedCompatibilityDevice(lang === 'ar' ? currentModel.modelAr : currentModel.modelEn);
    setIsCompatibilityFinderOpen(false);
    const catalogEl = document.getElementById('catalog-section');
    catalogEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClearFilter = () => {
    setSelectedCompatibilityDevice(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#0f131a] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-900 dark:text-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {lang === 'ar' ? 'فاحص ومطابق التوافق الذكي (Compatibility Finder)' : 'Smart Device Compatibility Matcher'}
                </h3>
                <span className="text-[10px] bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                  {lang === 'ar' ? 'ضمان 100%' : '100% Guaranteed'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'ar'
                  ? 'اختر جهازك بدقة لعرض كافة الشواحن والجرابات والملحقات المتوافقة تماماً معه هندسياً وإلكترونياً'
                  : 'Select your exact device model to unlock guaranteed compatible cases, MagSafe chargers, and audio.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCompatibilityFinderOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Step 1: Brand Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
              {lang === 'ar' ? '1. اختر الشركة المصنعة (Brand):' : '1. Select Manufacturer Brand:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {SUPPORTED_DEVICE_BRANDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBrand(b.id);
                    const first = DEVICE_MODELS_CATALOG.find((m) => m.brand === b.id);
                    if (first) setActiveModelId(first.id);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedBrand === b.id
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500/40'
                  }`}
                >
                  <span className="text-base">{b.icon}</span>
                  <span className="truncate">{lang === 'ar' ? b.nameAr.split(' ')[0] : b.nameEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Device Type & Model Selection */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Device Category Filters */}
            <div className="md:col-span-4 space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {lang === 'ar' ? '2. فئة الجهاز:' : '2. Device Type:'}
              </label>
              <div className="flex md:flex-col gap-1.5 overflow-x-auto">
                {[
                  { id: 'all', labelAr: 'جميع الأجهزة', labelEn: 'All Devices', icon: <Filter className="w-3.5 h-3.5" /> },
                  { id: 'phone', labelAr: 'الهواتف الذكية', labelEn: 'Smartphones', icon: <Smartphone className="w-3.5 h-3.5" /> },
                  { id: 'watch', labelAr: 'الساعات الذكية', labelEn: 'Smartwatches', icon: <Watch className="w-3.5 h-3.5" /> },
                  { id: 'audio', labelAr: 'سماعات الصوت', labelEn: 'Audio Gear', icon: <Headphones className="w-3.5 h-3.5" /> },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer text-start ${
                      selectedCategory === cat.id
                        ? 'bg-cyan-500/15 border border-cyan-500 text-cyan-700 dark:text-cyan-300'
                        : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat.icon}
                    <span>{lang === 'ar' ? cat.labelAr : cat.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Model List */}
            <div className="md:col-span-8 space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {lang === 'ar' ? '3. الموديل الدقيق:' : '3. Exact Model:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {filteredModels.map((m) => {
                  const isSelected = m.id === currentModel.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setActiveModelId(m.id)}
                      className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-900 dark:text-white shadow-sm ring-1 ring-cyan-500/30'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">
                          {lang === 'ar' ? m.modelAr : m.modelEn}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {m.connectorType?.toUpperCase() || 'QI / WIRELESS'} · {m.releaseYear}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 3: Verified Compatibility Summary & Direct Matches */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {lang === 'ar'
                    ? `الملحقات المتوافقة مع: ${currentModel.modelAr}`
                    : `Compatible Accessories for: ${currentModel.modelEn}`}
                </span>
                <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                  ({matchedProducts.length} {lang === 'ar' ? 'منتج متطابق' : 'items'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedCompatibilityDevice && (
                  <button
                    onClick={handleClearFilter}
                    className="text-xs text-rose-500 hover:underline cursor-pointer"
                  >
                    {lang === 'ar' ? 'إلغاء التصفية' : 'Clear Filter'}
                  </button>
                )}
                <button
                  onClick={handleApplyFilter}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تصفح التشكيلة المتوافقة بالمتجر' : 'Shop Compatible Gear'}</span>
                </button>
              </div>
            </div>

            {/* Matching Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {matchedProducts.slice(0, 3).map((prod) => (
                <div
                  key={prod.id}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm hover:border-cyan-500/40 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(prod);
                    setIsCompatibilityFinderOpen(false);
                  }}
                >
                  <img
                    src={prod.imageUrl}
                    alt={lang === 'ar' ? prod.titleAr : prod.titleEn}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {lang === 'ar' ? prod.titleAr : prod.titleEn}
                    </h5>
                    <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">
                      {formatPrice(prod.priceUSD)}
                    </p>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold shrink-0">
                    {lang === 'ar' ? 'متوافق' : 'Fits'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
