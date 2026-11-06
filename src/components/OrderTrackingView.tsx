import React, { useState } from 'react';
import { PackageCheck, Search, CheckCircle, Clock, Truck, MapPin, Building, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const OrderTrackingView: React.FC = () => {
  const { lang, formatPrice, orders, activeTrackingId, setActiveTrackingId, setActiveView } = useStore();
  const [searchInput, setSearchInput] = useState(activeTrackingId || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    orders.find((o) => o.id === (activeTrackingId || orders[0]?.id)) || orders[0] || null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    const found = orders.find(
      (o) => o.id.toUpperCase() === query || o.customerPhone.includes(query)
    );
    if (found) {
      setSelectedOrder(found);
      setActiveTrackingId(found.id);
    }
  };

  const statusSteps = [
    {
      key: 'pending_supplier',
      labelAr: 'تم استلام وتأكيد الطلب',
      labelEn: 'Order Received & Confirmed',
      descAr: 'تم تسجيل الطلب وتجهيز بيانات الشحن للربط مع المورد',
      descEn: 'Order confirmed and prepared for supplier routing',
      icon: CheckCircle,
    },
    {
      key: 'dispatched_supplier',
      labelAr: 'التوجيه والتغليف لدى المورّد',
      labelEn: 'Dispatched to Manufacturer',
      descAr: 'تم استلام الطلب من المصنع، فحص الجودة، والتغليف الآمن',
      descEn: 'Manufacturer packaged and quality-checked the product',
      icon: Building,
    },
    {
      key: 'in_transit',
      labelAr: 'الشحن الدولي السريع',
      labelEn: 'In International Transit',
      descAr: 'الشحنة على متن رحلة الشحن الجوي السريع مع التخليص الجمركي',
      descEn: 'Air courier transit & expedited customs clearance',
      icon: Truck,
    },
    {
      key: 'out_for_delivery',
      labelAr: 'جاري التوصيل لباب منزلك',
      labelEn: 'Out for Doorstep Delivery',
      descAr: 'مندوب الشحن المحلي في طريقه إلى عنوانك المسجل',
      descEn: 'Local courier out for final delivery',
      icon: MapPin,
    },
  ];

  const getStepStatus = (stepKey: string, currentStatus: Order['status']) => {
    const orderRanks: Record<Order['status'], number> = {
      draft: 0,
      pending_payment: 0,
      confirmed: 1,
      processing: 1,
      pending_supplier: 1,
      dispatched_supplier: 2,
      in_transit: 3,
      out_for_delivery: 4,
      ready_for_pickup: 4,
      partially_fulfilled: 4,
      fulfilled: 5,
      delivered: 5,
      cancelled: 0,
    };
    const stepRanks: Record<string, number> = {
      pending_supplier: 1,
      dispatched_supplier: 2,
      in_transit: 3,
      out_for_delivery: 4,
    };

    const currentRank = orderRanks[currentStatus] || 1;
    const thisRank = stepRanks[stepKey] || 1;

    if (currentRank > thisRank) return 'completed';
    if (currentRank === thisRank) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <PackageCheck className="w-4 h-4" />
            <span>{lang === 'ar' ? 'نظام التتبع المباشر · متجر Zoos Electronics' : 'Zoos Electronics Direct Live Tracking'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {lang === 'ar' ? 'تتبع شحنتك لحظة بلحظة' : 'Track Your Shipment'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'ar'
              ? 'أدخل رقم الشحنة (مثال: VX-78219) أو رقم هاتفك لمتابعة خط سير طلبك'
              : 'Enter order tracking number (e.g. VX-78219) or mobile phone'}
          </p>
        </div>

        <button
          onClick={() => setActiveView('store')}
          className="self-start sm:self-auto text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          {lang === 'ar' ? '← العودة للتسوق' : 'Back to Store →'}
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
        <div className="relative flex-1">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${lang === 'ar' ? 'right-3.5' : 'left-3.5'}`} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={lang === 'ar' ? 'أدخل رقم التتبع مثل: VX-78219' : 'Tracking ID e.g. VX-78219'}
            className={`w-full bg-slate-900 border border-slate-700 rounded-xl py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono ${
              lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'
            }`}
          />
        </div>
        <button
          type="submit"
          className="px-5 py-3 text-xs sm:text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-colors whitespace-nowrap shadow-md shadow-cyan-500/20"
        >
          {lang === 'ar' ? 'تتبع' : 'Track'}
        </button>
      </form>

      {/* Quick Select for Demonstration */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span>{lang === 'ar' ? 'طلبات تجريبية سريعة:' : 'Quick Demo Orders:'}</span>
        {orders.slice(0, 4).map((ord) => (
          <button
            key={ord.id}
            onClick={() => {
              setSelectedOrder(ord);
              setSearchInput(ord.id);
            }}
            className={`px-2.5 py-1 rounded-md border font-mono transition-colors ${
              selectedOrder?.id === ord.id
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {ord.id} ({ord.customerName.split(' ')[0]})
          </button>
        ))}
      </div>

      {selectedOrder ? (
        <div className="space-y-6">
          {/* Order Snapshot Card */}
          <div className="p-5 sm:p-6 bg-slate-900/80 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">{lang === 'ar' ? 'رقم الشحنة الدولي:' : 'Tracking Number:'}</span>
              <span className="text-base font-bold text-cyan-400 font-mono">{selectedOrder.trackingNumber}</span>
              {selectedOrder.supplierTrackingNumber && (
                <span className="text-[11px] text-slate-500 block font-mono">
                  {selectedOrder.supplierTrackingNumber}
                </span>
              )}
            </div>

            <div>
              <span className="text-slate-400 block mb-1">{lang === 'ar' ? 'العميل والوجهة:' : 'Customer & Destination:'}</span>
              <span className="text-sm font-semibold text-white block">{selectedOrder.customerName}</span>
              <span className="text-slate-400 text-[11px]">{selectedOrder.city}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">{lang === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</span>
              <span className="text-sm font-semibold text-emerald-400">
                {selectedOrder.paymentMethod === 'cod'
                  ? (lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery')
                  : selectedOrder.paymentMethod === 'apple_pay'
                  ? 'Apple Pay'
                  : (lang === 'ar' ? 'بطاقة بنكية' : 'Card')}
              </span>
              <span className="text-slate-300 block font-bold tabular-nums">
                {formatPrice(selectedOrder.totalUSD)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">{lang === 'ar' ? 'المورد المسؤول:' : 'Fulfillment Hub:'}</span>
              <span className="text-sm font-semibold text-white block truncate">{selectedOrder.supplierName}</span>
              <span className="text-slate-500 text-[11px]">
                {new Date(selectedOrder.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'مسار الشحن والتوصيل' : 'Fulfillment Pipeline'}</span>
            </h3>

            <div className="relative pl-6 sm:pl-0 space-y-6 sm:space-y-0 sm:grid sm:grid-cols-4 sm:gap-4">
              {statusSteps.map((step, idx) => {
                const state = getStepStatus(step.key, selectedOrder.status);
                const IconComponent = step.icon;

                return (
                  <div key={step.key} className="relative flex sm:flex-col items-start gap-3 sm:gap-2">
                    {/* Circle icon */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                        state === 'completed'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : state === 'active'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse'
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div>
                      <p
                        className={`text-xs font-bold ${
                          state === 'completed'
                            ? 'text-emerald-400'
                            : state === 'active'
                            ? 'text-cyan-300'
                            : 'text-slate-400'
                        }`}
                      >
                        {lang === 'ar' ? step.labelAr : step.labelEn}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                        {lang === 'ar' ? step.descAr : step.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Itemized Order Package */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {lang === 'ar' ? 'محتويات الطرد' : 'Package Contents'}
            </h4>
            <div className="divide-y divide-slate-800 text-xs">
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.product.imageUrl}
                      alt={lang === 'ar' ? it.product.titleAr : it.product.titleEn}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-white">
                        {lang === 'ar' ? it.product.titleAr : it.product.titleEn}
                      </p>
                      <p className="text-[11px] text-cyan-400">
                        {lang === 'ar' ? it.selectedVariant.nameAr : it.selectedVariant.nameEn} · الكمية: {it.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-white tabular-nums">
                    {formatPrice(it.product.priceUSD * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <p>{lang === 'ar' ? 'لم يتم العثور على شحنة بهذا الرقم. تأكد من الرقم وأعد المحاولة.' : 'No shipment found with this ID.'}</p>
        </div>
      )}
    </div>
  );
};
