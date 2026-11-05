import React, { useState } from 'react';
import { Search, ShieldCheck, Truck, RotateCcw, ArrowLeftRight, ChevronRight, ChevronLeft, Sparkles, Layers, Cpu } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const {
    lang,
    searchQuery,
    setSearchQuery,
    setSelectedBrand,
    setSelectedCategory,
    setIsComparisonModalOpen,
    setIsCompatibilityFinderOpen,
    heroBanners,
  } = useStore();

  const [activeSlide, setActiveSlide] = useState(0);

  const slides = heroBanners && heroBanners.length > 0 ? heroBanners : [
    {
      id: 'default-hero',
      tagAr: 'الإصدار الحصري 2026',
      tagEn: '2026 Flagship Showcase',
      titleAr: 'عالم التكنولوجيا المتطورة مع Zoos Electronics',
      titleEn: 'Next-Gen Technology Defined at Zoos Electronics',
      subtitleAr: 'شواحن MagSafe الذكية، ساعات التيتانيوم الرياضية، وسماعات عزل الضوضاء الاحترافية بشحن مباشر وسريع.',
      subtitleEn: '15W MagSafe stations, titanium AMOLED smartwatches, and studio ANC headphones shipped direct to you.',
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80',
      categoryTarget: 'all' as const,
      hasAnimationEffect: true,
    },
  ];

  const safeSlideIndex = activeSlide >= slides.length ? 0 : activeSlide;
  const currentSlide = slides[safeSlideIndex];

  return (
    <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-[#0a0e17] dark:via-[#0c0f14] dark:to-[#0c0f14] py-6 lg:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6 lg:space-y-8">
        
        {/* Main Hero Banner Box */}
        <div
          className={`relative rounded-3xl overflow-hidden border transition-all duration-500 bg-slate-900 dark:bg-slate-950 shadow-xl ${
            currentSlide.hasAnimationEffect
              ? 'border-cyan-500/40 shadow-cyan-500/20 ring-1 ring-cyan-500/30'
              : 'border-slate-800 shadow-slate-900/40'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] items-stretch">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between z-10 space-y-6">
              <div className="space-y-4">
                {/* Store Brand Kicker & Animated Badge */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="uppercase tracking-widest">ZOOS ELECTRONICS</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-300 font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                    {lang === 'ar' ? currentSlide.tagAr : currentSlide.tagEn}
                  </span>
                  {currentSlide.hasAnimationEffect && (
                    <span className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{lang === 'ar' ? 'عرض حي بمؤثرات سينمائية' : 'Live Motion Special'}</span>
                    </span>
                  )}
                </div>

                {/* Main Headline */}
                <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-white leading-[1.2] text-balance">
                  {lang === 'ar' ? currentSlide.titleAr : currentSlide.titleEn}
                </h1>

                {/* Subtitle */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
                  {lang === 'ar' ? currentSlide.subtitleAr : currentSlide.subtitleEn}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedCategory(currentSlide.categoryTarget || 'all');
                      const el = document.getElementById('catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>
                      {lang === 'ar'
                        ? (currentSlide.ctaTextAr || 'تسوق التشكيلة الآن')
                        : (currentSlide.ctaTextEn || 'Shop Collection')}
                    </span>
                    <span>{lang === 'ar' ? '←' : '→'}</span>
                  </button>

                  {/* Feature: Open Smart Compatibility Finder */}
                  <button
                    onClick={() => setIsCompatibilityFinderOpen(true)}
                    className="px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'ar' ? 'فاحص توافق جهازك' : 'Check Compatibility'}</span>
                  </button>

                  {/* Feature: Open Product Comparison Modal */}
                  <button
                    onClick={() => setIsComparisonModalOpen(true)}
                    className="px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'ar' ? 'أداة مقارنة المواصفات' : 'Compare Products'}</span>
                  </button>
                </div>

                {/* Quick Slide Navigation Dots */}
                <div className="flex items-center gap-2 pt-2">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        safeSlideIndex === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                  <span className="text-[11px] text-slate-500 font-mono ms-2">
                    0{safeSlideIndex + 1} / 0{slides.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Media Column with Multi-Image Support (Background + Product Overlay Focus) */}
            <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full overflow-hidden bg-slate-950 flex items-center justify-center">
              {/* Background Layer */}
              <img
                src={currentSlide.imageUrl}
                alt={lang === 'ar' ? currentSlide.titleAr : currentSlide.titleEn}
                className={`w-full h-full object-cover object-center transition-all duration-700 ${
                  currentSlide.hasAnimationEffect ? 'scale-105' : 'hover:scale-105'
                }`}
                referrerPolicy="no-referrer"
                loading="eager"
              />

              {/* Shading gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0d1117] via-slate-950/40 to-transparent pointer-events-none" />

              {/* Multi-Image Overlay (If productOverlayUrl provided in AI Banner Studio) */}
              {currentSlide.productOverlayUrl && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
                  <div
                    className={`relative w-48 sm:w-64 md:w-72 aspect-square rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/40 backdrop-blur-sm transition-all duration-1000 ${
                      currentSlide.hasAnimationEffect
                        ? 'animate-bounce [animation-duration:3.5s] ring-2 ring-cyan-400/60 shadow-cyan-500/40'
                        : ''
                    }`}
                  >
                    <img
                      src={currentSlide.productOverlayUrl}
                      alt="Product Spotlight"
                      className="w-full h-full object-contain p-2"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 inset-x-2 bg-slate-950/85 backdrop-blur-md rounded-lg p-1.5 border border-slate-700/80 text-center">
                      <span className="text-[11px] font-bold text-cyan-300 flex items-center justify-center gap-1">
                        <Layers className="w-3 h-3 text-cyan-400" />
                        <span>{lang === 'ar' ? 'منتج العرض المباشر' : 'Featured Deal'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating Slide Badge & Switcher */}
              <div className="absolute bottom-4 end-4 flex items-center gap-1.5 p-1.5 bg-slate-950/85 backdrop-blur-md rounded-xl border border-slate-800 text-slate-300 text-xs shadow-lg">
                <button
                  onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white"
                  aria-label="Previous"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-semibold px-2">
                  {lang === 'ar' ? 'عروض Zoos' : 'Zoos Deals'}
                </span>
                <button
                  onClick={() => setActiveSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white"
                  aria-label="Next"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Search Bar & Quick Brand Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-7">
            <div className="relative">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${lang === 'ar' ? 'right-4' : 'left-4'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث في متجر Zoos: كفر كاربون، ساعة تيتانيوم، شاحن MagSafe، سماعات ANC...' : 'Search Zoos: Carbon case, Titanium watch, MagSafe 3-in-1...'}
                className={`w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-sm ${
                  lang === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'
                }`}
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">{lang === 'ar' ? 'التوافق:' : 'Device:'}</span>
            {['all', 'Apple', 'Samsung', 'Universal'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-800 text-xs shadow-sm"
              >
                {b === 'all' ? (lang === 'ar' ? 'جميع الأجهزة' : 'All Devices') : b}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800/80">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {lang === 'ar' ? 'شحن مباشر أو استلام من المعرض' : 'Direct Dropship & Store Pickup'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'ar' ? 'شحن سريع لباب منزلك أو استلام من X-Mall' : 'Expedited courier or immediate Click & Collect'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {lang === 'ar' ? 'ضمان جودة Zoos المعتمد' : '100% Quality Guaranteed'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'ar' ? 'فحص مصنعي واختبار إلكتروني كامل' : 'Rigorous factory testing & specs'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {lang === 'ar' ? 'الدفع عند الاستلام واستبدال 14 يوم' : 'Cash on Delivery & 14d Return'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'ar' ? 'ادفع بعد المعاينة براحة بال' : 'Pay when you receive your order'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
