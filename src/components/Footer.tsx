import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, Headphones, Sparkles, Instagram, Twitter, MessageCircle, Music2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, setSelectedCategory, setActiveView, setIsComparisonModalOpen } = useStore();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#090c10] text-slate-600 dark:text-slate-400 text-xs py-12 px-4 lg:px-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-slate-900/50">
          {/* Column 1: Brand Info (Optimized for dark mode) */}
          <div className="p-8 space-y-5 bg-slate-50/50 dark:bg-[#0c0f14]/60 border-r border-slate-100 dark:border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
                  Z
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Zoos Electronics</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                {lang === 'ar'
                  ? 'متجر Zoos Electronics المتخصص في إكسسوارات الهواتف الرائدة، وساعات التيتانيوم الذكية، وسماعات الصوت الاحترافية بتقنيات دروب شيبينغ متقدمة وشحن مباشر سريع.'
                  : 'Zoos Electronics: Premium mobile accessories, smartwatches, and ANC audio hardware delivered straight from verified manufacturers.'}
              </p>
            </div>

            {/* Social Media Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {lang === 'ar' ? 'تابعنا على' : 'Follow Us'}
              </span>
              <div className="flex items-center gap-3">
                {[
                  { icon: <Instagram className="w-4 h-4" />, color: 'hover:text-pink-500', label: 'Instagram' },
                  { icon: <Twitter className="w-4 h-4" />, color: 'hover:text-sky-400', label: 'Twitter' },
                  { icon: <MessageCircle className="w-4 h-4" />, color: 'hover:text-emerald-500', label: 'WhatsApp' },
                  { icon: <Music2 className="w-4 h-4" />, color: 'hover:text-indigo-400', label: 'TikTok' },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-400 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-md ${social.color}`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Catalog Links */}
          <div className="p-8 space-y-2 bg-slate-50 dark:bg-slate-900/30 border-r border-slate-100 dark:border-slate-800">
            <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              {lang === 'ar' ? 'الأقسام الرئيسية' : 'Categories'}
            </h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('phone_accessories');
                    setActiveView('store');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-start"
                >
                  {lang === 'ar' ? 'إكسسوارات الهواتف وشواحن MagSafe' : 'Phone Cases & MagSafe'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('smartwatches');
                    setActiveView('store');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-start"
                >
                  {lang === 'ar' ? 'الساعات الذكية والأساور الرياضية' : 'Smartwatches & Titanium Bands'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('earphones');
                    setActiveView('store');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-start"
                >
                  {lang === 'ar' ? 'سماعات الرأس وعزل الضوضاء ANC' : 'Wireless Earbuds & Studio ANC'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service (#ffffff) */}
          <div className="p-8 space-y-2 bg-white dark:bg-slate-900/50 border-r border-slate-100 dark:border-slate-800">
            <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              {lang === 'ar' ? 'خدمة العملاء والأدوات' : 'Tools & Support'}
            </h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => setIsComparisonModalOpen(true)}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-cyan-600 dark:text-cyan-400 font-semibold cursor-pointer text-start"
                >
                  {lang === 'ar' ? '⚡ أداة مقارنة المنتجات (جدول جانبي)' : '⚡ Product Comparison Matrix'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('tracking')}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-start"
                >
                  {lang === 'ar' ? 'تتبع الشحنة المباشر' : 'Live Order Tracking'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('dropship_ops')}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-start"
                >
                  {lang === 'ar' ? 'بوابة إدارة الدروب شيبينغ' : 'Merchant Dropship Ops'}
                </button>
              </li>
              <li className="text-slate-500 dark:text-slate-400">
                {lang === 'ar' ? 'سياسة الاستبدال خلال 14 يوماً' : '14-Day Warranty & Returns'}
              </li>
            </ul>
          </div>

          {/* Column 4: Dropship Guarantee (Optimized) */}
          <div className="p-8 space-y-4 bg-slate-100/50 dark:bg-slate-950/40">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'ar' ? 'ضمان التوريد المباشر' : 'Direct Dropship Guarantee'}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                {lang === 'ar'
                  ? 'يتم فحص وتغليف كل منتج بدقة واختبار التوافق الإلكتروني قبل خروجه من خط الشحن الدولي السريع.'
                  : 'Every tech accessory passes strict electronic functional verification before expedited air dispatch.'}
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-1">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Truck className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">Express Logistics</span>
                <span className="text-[9px] text-slate-500">3-6 Days Door Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet copyright row */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
          <p>© 2026 Zoos Electronics. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-4">
            <span>{lang === 'ar' ? 'شحن مباشر: 3-6 أيام عمل' : 'Fast Dropship: 3-6 Days'}</span>
            <span>·</span>
            <span>{lang === 'ar' ? 'دفع آمن 100%' : '100% Encrypted Payments'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
