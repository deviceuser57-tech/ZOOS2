import React, { useState } from 'react';
import { X, Search, Barcode, ShoppingCart, Printer, CheckCircle, CreditCard, Banknote, Smartphone, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariant, PosSaleRecord } from '../types';

export const PosRegisterModal: React.FC = () => {
  const {
    lang,
    formatPrice,
    isPosModalOpen,
    setIsPosModalOpen,
    products,
    completePosSale,
    locationStocks,
  } = useStore();

  const [scanQuery, setScanQuery] = useState('');
  const [posCart, setPosCart] = useState<{ product: Product; variant: ProductVariant; quantity: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'instapay'>('cash');
  const [cashierName] = useState('م. أحمد (كاشير فرع X-Mall)');
  const [completedSale, setCompletedSale] = useState<PosSaleRecord | null>(null);

  if (!isPosModalOpen) return null;

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = scanQuery.trim().toLowerCase();
    if (!q) return;

    const matched = products.find(
      (p) =>
        p.sku.toLowerCase() === q ||
        p.barcode === q ||
        p.titleAr.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q)
    );

    if (matched) {
      const variant = matched.variants[0];
      setPosCart((prev) => {
        const idx = prev.findIndex((i) => i.product.id === matched.id && i.variant.id === variant.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
          return next;
        }
        return [...prev, { product: matched, variant, quantity: 1 }];
      });
      setScanQuery('');
    }
  };

  const handleQuickAdd = (product: Product) => {
    const variant = product.variants[0];
    setPosCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.variant.id === variant.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
  };

  const updateQuantity = (idx: number, qty: number) => {
    if (qty <= 0) {
      setPosCart((prev) => prev.filter((_, i) => i !== idx));
      return;
    }
    setPosCart((prev) => prev.map((item, i) => (i === idx ? { ...item, quantity: qty } : item)));
  };

  const posTotalUSD = posCart.reduce(
    (sum, item) => sum + (item.product.priceUSD + (item.variant.extraPriceUSD || 0)) * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (posCart.length === 0) return;
    const sale = completePosSale(posCart, paymentMethod, cashierName);
    setCompletedSale(sale);
    setPosCart([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div
        className="relative w-full max-w-5xl bg-[#0d1117] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 my-4 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{lang === 'ar' ? 'نقطة بيع بارتشن X-Mall (Cashier POS)' : 'X-Mall Partition POS Register'}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {lang === 'ar' ? 'الوردية نشطة' : 'Active Shift'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'تسجيل المبيعات المباشرة وخصم المخزون اللحظي مع إصدار وطباعة إيصال الباركود'
                  : 'Fast counter sales with barcode scanning, instant stock decrement, and thermal receipt.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsPosModalOpen(false);
              setCompletedSale(null);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Grid: Left POS Scanner & Cart, Right Quick Catalog */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (lg: 7 cols): Scanner, Register Cart, Payment */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Scan Barcode Form */}
              <form onSubmit={handleScanSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Barcode className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400 ${lang === 'ar' ? 'right-3' : 'left-3'}`} />
                  <input
                    type="text"
                    value={scanQuery}
                    onChange={(e) => setScanQuery(e.target.value)}
                    placeholder={lang === 'ar' ? 'مسح الباركود أو إدخال SKU أو اسم المنتج...' : 'Scan barcode or enter product SKU...'}
                    className={`w-full bg-slate-900 border border-slate-700/90 rounded-xl py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono ${
                      lang === 'ar' ? 'pr-10 pl-3' : 'pl-10 pr-3'
                    }`}
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-colors whitespace-nowrap shadow-md shadow-cyan-500/20"
                >
                  {lang === 'ar' ? 'إضافة' : 'Scan'}
                </button>
              </form>

              {/* POS Cart Items Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 overflow-hidden">
                <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-400 flex justify-between">
                  <span>{lang === 'ar' ? 'سلة المبيعات النقدية الحالية' : 'Current POS Basket'}</span>
                  <span>{posCart.length} {lang === 'ar' ? 'أصناف' : 'items'}</span>
                </div>

                <div className="divide-y divide-slate-800 max-h-56 overflow-y-auto text-xs">
                  {posCart.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p>{lang === 'ar' ? 'السلة فارغة. امسح باركود المنتج أو اختر من القائمة الجانبية.' : 'Basket empty. Scan barcode or pick from quick list.'}</p>
                    </div>
                  ) : (
                    posCart.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-900/40">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white truncate">
                            {lang === 'ar' ? item.product.titleAr : item.product.titleEn}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {item.product.sku} · {lang === 'ar' ? item.variant.nameAr : item.variant.nameEn}
                          </p>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(idx, item.quantity - 1)}
                            className="px-2 py-0.5 text-slate-300 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 font-bold tabular-nums text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(idx, item.quantity + 1)}
                            className="px-2 py-0.5 text-slate-300 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-bold text-white tabular-nums text-end min-w-[60px]">
                          {formatPrice((item.product.priceUSD + (item.variant.extraPriceUSD || 0)) * item.quantity)}
                        </span>

                        <button
                          onClick={() => updateQuantity(idx, 0)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {lang === 'ar' ? 'طريقة التحصيل في الكاشير:' : 'Payment Tender:'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                      paymentMethod === 'cash'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'نقداً (Cash)' : 'Cash'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                      paymentMethod === 'card'
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'شبكة / مدى / POS' : 'POS Card'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('instapay')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                      paymentMethod === 'instapay'
                        ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'إنستا باي / تحويل' : 'InstaPay'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Total & Complete Sale CTA */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'المبلغ المستحق:' : 'Total Due:'}</span>
                <span className="text-xl sm:text-2xl font-black text-white tabular-nums">
                  {formatPrice(posTotalUSD)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={posCart.length === 0}
                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 transition-all flex items-center gap-2 disabled:opacity-40 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إتمام البيع وطباعة الإيصال' : 'Complete Sale & Print'}</span>
              </button>
            </div>
          </div>

          {/* Right Column (lg: 5 cols): Quick Select Products from X-Mall Stock */}
          <div className="lg:col-span-5 space-y-3 border-t lg:border-t-0 lg:border-s border-slate-800 lg:ps-6">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">{lang === 'ar' ? 'أصناف بارتشن X-Mall السريعة' : 'Quick Pick Shelf'}</span>
              <span className="text-slate-500 text-[11px]">{lang === 'ar' ? 'انقر للإضافة الفورية' : 'Click to add'}</span>
            </div>

            <div className="space-y-2 max-h-[440px] overflow-y-auto pe-1">
              {products.map((prod) => {
                const xmallStock = locationStocks.find(
                  (s) => s.productId === prod.id && s.locationId === 'loc-xmall'
                );
                return (
                  <div
                    key={prod.id}
                    onClick={() => handleQuickAdd(prod)}
                    className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between gap-2.5 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={prod.imageUrl}
                        alt={prod.titleAr}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                          {lang === 'ar' ? prod.titleAr : prod.titleEn}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {prod.sku} · {lang === 'ar' ? 'المتوفر بالفرع:' : 'Branch stock:'}{' '}
                          <span className={`font-bold ${xmallStock && xmallStock.usable < 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {xmallStock ? xmallStock.usable : prod.stockQuantity}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-end shrink-0">
                      <span className="text-xs font-bold text-white tabular-nums block">
                        {formatPrice(prod.priceUSD)}
                      </span>
                      <span className="text-[10px] text-cyan-400 flex items-center justify-end gap-0.5">
                        <Plus className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'أضف' : 'Add'}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Completed Sale Printable Receipt Modal */}
        {completedSale && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-white text-slate-950 p-6 rounded-2xl max-w-sm w-full space-y-4 font-mono shadow-2xl text-xs">
              <div className="text-center space-y-1 border-b pb-3">
                <h3 className="font-black text-sm uppercase tracking-wider">ZOOS ELECTRONICS</h3>
                <p className="text-[11px] text-slate-600">X-Mall Partition · New Cairo</p>
                <p className="text-[10px] text-slate-500">Tax ID: 622-990-142 · POS Receipt</p>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Receipt #:</span>
                  <span className="font-bold">{completedSale.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date/Time:</span>
                  <span>{new Date(completedSale.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span>{completedSale.cashierName.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span className="uppercase font-bold">{completedSale.paymentMethod}</span>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-b py-2 space-y-1.5 text-[11px]">
                {completedSale.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {it.quantity}x {it.product.sku}
                    </span>
                    <span className="font-bold">{formatPrice(it.unitPriceUSD * it.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between text-sm font-black pt-1">
                <span>TOTAL PAID:</span>
                <span>{formatPrice(completedSale.totalUSD)}</span>
              </div>

              {/* Simulated Barcode */}
              <div className="pt-2 text-center space-y-1">
                <div className="h-8 bg-slate-900 rounded flex items-center justify-center tracking-widest text-white text-[10px]">
                  ||| | | |||| || | || |||| |
                </div>
                <span className="text-[9px] text-slate-500 tracking-wider">
                  {completedSale.receiptNumber}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة الإيصال</span>
                </button>
                <button
                  onClick={() => setCompletedSale(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-bold text-xs"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
