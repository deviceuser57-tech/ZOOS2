import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Flame, ChevronRight, ChevronLeft, ArrowRight, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface PromoOffer {
  id: string;
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  discount: string;
  code: string;
  expiryMinutes: number;
}

const PROMO_OFFERS: PromoOffer[] = [
  {
    id: 'promo-1',
    badgeAr: 'عرض الساعة ⚡',
    badgeEn: 'Flash Deal ⚡',
    titleAr: 'خصم 25% على شواحن MagSafe ومنصات الشحن السريع اللاسلكي',
    titleEn: '25% OFF all MagSafe wireless charging stations',
    discount: '25% OFF',
    code: 'MAGSAFE25',
    expiryMinutes: 45,
  },
  {
    id: 'promo-2',
    badgeAr: 'وصل حديثاً 🔥',
    badgeEn: 'New Arrival 🔥',
    titleAr: 'ساعات التيتانيوم الذكية مع استلام مجاني من كاونتر بارتشن X-Mall',
    titleEn: 'Titanium Smartwatches with Instant Store Pickup at X-Mall',
    discount: 'FREE PICKUP',
    code: 'XMALLNOW',
    expiryMinutes: 120,
  },
  {
    id: 'promo-3',
    badgeAr: 'عرض خاص 🎧',
    badgeEn: 'Audio Special 🎧',
    titleAr: 'سماعات عزل الضوضاء الاحترافية ANC مع ضمان استبدال 18 شهراً',
    titleEn: 'Studio ANC Headphones with 18-Month Direct Replacement Warranty',
    discount: 'SAVE 30%',
    code: 'AUDIOPRO',
    expiryMinutes: 60,
  },
];

export const PromotionalCarousel: React.FC = () => {
  const { lang, setSelectedCategory } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_OFFERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const offer = PROMO_OFFERS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PROMO_OFFERS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PROMO_OFFERS.length) % PROMO_OFFERS.length);
  };

  const handleScrollToDeals = () => {
    const el = document.getElementById('catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white py-2 px-4 shadow-sm transition-all duration-300 relative z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="p-1 rounded-full hover:bg-white/15 transition-colors shrink-0 cursor-pointer"
          aria-label="Previous promo"
        >
          <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
        </button>

        {/* Offer Content */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center overflow-hidden">
          <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold text-[11px] tracking-wide inline-flex items-center gap-1 shrink-0">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'ar' ? offer.badgeAr : offer.badgeEn}</span>
          </span>

          <p className="font-semibold truncate max-w-xs sm:max-w-lg md:max-w-2xl text-xs sm:text-sm">
            {lang === 'ar' ? offer.titleAr : offer.titleEn}
          </p>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border border-white/20">
              {lang === 'ar' ? `كود: ${offer.code}` : `CODE: ${offer.code}`}
            </span>
            <button
              onClick={handleScrollToDeals}
              className="bg-white text-slate-950 font-bold px-3 py-1 rounded-lg text-xs hover:bg-cyan-100 transition-colors shadow-sm inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'استفد بالعرض' : 'Claim Deal'}</span>
              <ArrowRight className="w-3 h-3 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="p-1 rounded-full hover:bg-white/15 transition-colors shrink-0 cursor-pointer"
          aria-label="Next promo"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
        </button>

      </div>
    </div>
  );
};
