import React from 'react';
import { ShoppingBag, PackageCheck, BarChart3, Globe, ArrowLeftRight, Heart, ShieldAlert, Sun, Moon, Cpu, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CurrencyCode, Category } from '../types';

export const Navbar: React.FC = () => {
  const {
    lang,
    setLang,
    darkMode,
    toggleDarkMode,
    currency,
    setCurrency,
    activeView,
    setActiveView,
    setSelectedCategory,
    cartItemsCount,
    setIsCartOpen,
    comparisonList,
    setIsComparisonModalOpen,
    wishlist,
    setIsWishlistOpen,
    setIsCompatibilityFinderOpen,
    selectedCompatibilityDevice,
  } = useStore();

  const handleNavClick = (category: Category | 'tracking' | 'dropship') => {
    if (category === 'tracking') {
      setActiveView('tracking');
    } else if (category === 'dropship') {
      setActiveView('dropship_ops');
    } else {
      setSelectedCategory(category);
      setActiveView('store');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0c0f14]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 lg:px-8 py-3 transition-colors shadow-sm dark:shadow-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveView('store');
              setSelectedCategory('all');
            }}
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hover:text-cyan-500 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 text-start"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25">
              Z
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-base tracking-wider text-slate-900 dark:text-white">
                ZOOS <span className="text-cyan-500 dark:text-cyan-400 font-semibold">ELECTRONICS</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal hidden sm:block">
                {lang === 'ar' ? 'متجر إكسسوارات الهواتف والساعات الذكية' : 'Smart Tech & Omnichannel Hub'}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean header without the 3 removed categories) */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNavClick('all')}
            className={`hover:text-cyan-500 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'store' ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : ''
            }`}
          >
            {lang === 'ar' ? 'جميع المنتجات' : 'All Catalog'}
          </button>

          {/* Smart Device Compatibility Tool Button */}
          <button
            onClick={() => setIsCompatibilityFinderOpen(true)}
            className="hover:text-cyan-500 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-500" />
            <span>{lang === 'ar' ? 'فاحص التوافق الذكي' : 'Compatibility Finder'}</span>
            {selectedCompatibilityDevice && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('tracking')}
            className={`hover:text-cyan-500 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeView === 'tracking' ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : ''
            }`}
          >
            <PackageCheck className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>{lang === 'ar' ? 'تتبع الشحنة' : 'Track Order'}</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
            title={lang === 'ar' ? 'قائمة الأمنيات والمفضلات' : 'Saved Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500/30' : 'text-slate-400'}`} />
            {wishlist.length > 0 && (
              <span className="w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Comparison Matrix Button */}
          <button
            onClick={() => setIsComparisonModalOpen(true)}
            className="relative p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
            title={lang === 'ar' ? 'جدول مقارنة المنتجات' : 'Open Product Comparison'}
          >
            <ArrowLeftRight className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span className="hidden lg:inline">{lang === 'ar' ? 'المقارنة' : 'Compare'}</span>
            {comparisonList.length > 0 && (
              <span className="w-4 h-4 bg-cyan-500 dark:bg-cyan-400 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                {comparisonList.length}
              </span>
            )}
          </button>

          {/* Admin Suite Toggle */}
          <button
            onClick={() => setActiveView(activeView === 'admin' ? 'store' : 'admin')}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeView === 'admin'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-100 dark:bg-slate-900/90 border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10'
            }`}
            title={lang === 'ar' ? 'لوحة تحكم الإدارة الشاملة (RBAC, المخزون, POS, AI Studio)' : 'Omnichannel Admin Portal'}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'لوحة الإدارة' : 'Admin Hub'}</span>
          </button>

          {/* Currency Select */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            <option value="SAR">SAR (ر.س)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="EGP">EGP (ج.م)</option>
            <option value="USD">USD ($)</option>
          </select>

          {/* Dark/Light mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-xs font-medium text-amber-500 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
            title={darkMode ? 'التحويل إلى الوضع الفاتح' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Lang toggle */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="p-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
            title="تبديل اللغة / Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-2"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-cyan-500 text-slate-950 text-xs font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
