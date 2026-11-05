import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, RotateCcw, ShoppingBag, CheckCircle, Smartphone, ArrowLeftRight, Heart, BellRing, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductVariant } from '../types';

export const ProductDetailModal: React.FC = () => {
  const {
    lang,
    formatPrice,
    selectedProduct,
    setSelectedProduct,
    addToCart,
    setIsCheckoutOpen,
    addToComparison,
    removeFromComparison,
    isInComparison,
    setIsComparisonModalOpen,
    wishlist,
    toggleWishlist,
    isInWishlist,
    setSelectedAlertProduct,
    setIsPriceDropModalOpen,
    addReview,
    getRecommendations,
    addToBrowsingHistory,
  } = useStore();

  if (!selectedProduct) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    selectedProduct.variants[0] || {
      id: 'default',
      nameAr: 'الافتراضي',
      nameEn: 'Default',
      colorHex: '#000000',
      inStock: true,
    }
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // New Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewCity, setReviewCity] = useState(lang === 'ar' ? 'الرياض' : 'Riyadh');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);

  const unitPrice = selectedProduct.priceUSD + (selectedVariant.extraPriceUSD || 0);

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, selectedVariant, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOpenPriceAlert = () => {
    setSelectedAlertProduct(selectedProduct);
    setIsPriceDropModalOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    addReview(selectedProduct.id, {
      author: reviewAuthor.trim(),
      rating: reviewRating,
      city: reviewCity.trim(),
      commentAr: reviewComment.trim(),
      commentEn: reviewComment.trim(),
      verifiedPurchase: true,
    });

    setReviewSuccessMsg(true);
    setReviewAuthor('');
    setReviewComment('');
    setTimeout(() => {
      setReviewSuccessMsg(false);
      setShowReviewForm(false);
    }, 2000);
  };

  const inWishlist = isInWishlist(selectedProduct.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative w-full max-w-4xl bg-[#0f131a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 start-4 z-10 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left Column: Image & Highlights (md: 5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              <img
                src={selectedProduct.imageUrl}
                alt={lang === 'ar' ? selectedProduct.titleAr : selectedProduct.titleEn}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {selectedProduct.badgeAr && (
                <span className="absolute top-3 end-3 text-xs font-semibold px-2.5 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
                  {lang === 'ar' ? selectedProduct.badgeAr : selectedProduct.badgeEn}
                </span>
              )}

              {/* Wishlist Heart Overlay */}
              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className="absolute bottom-3 end-3 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-rose-400 transition-all shadow-lg"
                title={lang === 'ar' ? 'حفظ في قائمة الأمنيات' : 'Save to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'text-rose-500 fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Price Drop Alert Trigger */}
            <button
              onClick={handleOpenPriceAlert}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <BellRing className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{lang === 'ar' ? 'تفعيل تنبيهات انخفاض السعر (Price Drop)' : 'Set Price Drop Alert'}</span>
            </button>

            {/* Dropship Assurance Mini Cards */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px]">
              <div className="flex flex-col items-center text-center p-1">
                <Truck className="w-4 h-4 text-cyan-400 mb-1" />
                <span className="text-slate-300 font-medium">
                  {lang === 'ar' ? 'شحن مباشر' : 'Fast Dropship'}
                </span>
                <span className="text-slate-500">
                  {selectedProduct.deliveryDaysMin}-{selectedProduct.deliveryDaysMax} {lang === 'ar' ? 'أيام' : 'days'}
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-1 border-x border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-slate-300 font-medium">
                  {lang === 'ar' ? 'ضمان الجودة' : 'Verified Tech'}
                </span>
                <span className="text-slate-500">{lang === 'ar' ? 'مورد معتمد' : 'Original spec'}</span>
              </div>
              <div className="flex flex-col items-center text-center p-1">
                <RotateCcw className="w-4 h-4 text-amber-400 mb-1" />
                <span className="text-slate-300 font-medium">
                  {lang === 'ar' ? 'استبدال 14 يوم' : '14d Return'}
                </span>
                <span className="text-slate-500">{lang === 'ar' ? 'ضمان استرجاع' : 'Warranty'}</span>
              </div>
            </div>

            {/* Supplier Origin Transparency */}
            <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
              <span>{lang === 'ar' ? 'المورد المعتمد للدروب شيبينغ:' : 'Dropship Fulfillment Partner:'}</span>
              <span className="text-slate-300 font-medium">{selectedProduct.supplierPlatform} Direct</span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module (md: 7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                <span className="uppercase tracking-wider font-semibold text-cyan-400">
                  {selectedProduct.category.replace('_', ' ')}
                </span>
                <span>·</span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-slate-200 tabular-nums">{selectedProduct.rating}</span>
                  <span className="text-slate-400">({selectedProduct.reviewsCount} {lang === 'ar' ? 'تقييم موثق' : 'reviews'})</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
                {lang === 'ar' ? selectedProduct.titleAr : selectedProduct.titleEn}
              </h2>

              {/* Price display */}
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                  {formatPrice(unitPrice)}
                </span>
                {selectedProduct.originalPriceUSD && (
                  <span className="text-base text-slate-500 line-through tabular-nums">
                    {formatPrice(selectedProduct.originalPriceUSD)}
                  </span>
                )}
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {lang === 'ar' ? 'وفر 35%' : 'Save 35%'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                {lang === 'ar' ? selectedProduct.descriptionAr : selectedProduct.descriptionEn}
              </p>

              {/* Compatibility tags */}
              <div className="mb-3">
                <span className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  {lang === 'ar' ? 'التوافق المدعوم:' : 'Supported Devices:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.brandCompatibility.map((comp) => (
                    <span
                      key={comp}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Variant Swatches Selection */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                  <span className="font-semibold">{lang === 'ar' ? 'اختر الإصدار أو اللون:' : 'Select Variant / Color:'}</span>
                  <span className="text-cyan-400 font-medium">
                    {lang === 'ar' ? selectedVariant.nameAr : selectedVariant.nameEn}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProduct.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`p-2 rounded-xl border text-start flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-sm'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow-inner"
                          style={{ backgroundColor: v.colorHex }}
                        />
                        <span className="text-xs font-medium truncate flex-1">
                          {lang === 'ar' ? v.nameAr : v.nameEn}
                        </span>
                        {v.extraPriceUSD ? (
                          <span className="text-[10px] text-cyan-400 font-mono">
                            +{formatPrice(v.extraPriceUSD)}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="mb-3 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  {lang === 'ar' ? 'المواصفات الفنية المعتمدة' : 'Verified Technical Specs'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {selectedProduct.specs.map((s, idx) => (
                    <div key={idx} className="flex justify-between py-0.5 border-b border-slate-800/50">
                      <span className="text-slate-400">{lang === 'ar' ? s.labelAr : s.labelEn}:</span>
                      <span className="text-slate-200 font-medium text-end">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity & Buy CTAs */}
            <div className="pt-2 border-t border-slate-800 space-y-2.5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center border border-slate-700 rounded-xl bg-slate-900 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-semibold text-white tabular-nums min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'تمت الإضافة بنجاح!' : 'Added to Cart!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-cyan-400" />
                      <span>{lang === 'ar' ? 'إضافة إلى السلة' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
                >
                  {lang === 'ar' ? 'شراء فوري' : 'Buy Now'}
                </button>
              </div>

              {/* Compare toggle button in modal */}
              <button
                onClick={() => {
                  if (isInComparison(selectedProduct.id)) {
                    removeFromComparison(selectedProduct.id);
                  } else {
                    addToComparison(selectedProduct);
                    setIsComparisonModalOpen(true);
                  }
                }}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  isInComparison(selectedProduct.id)
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>
                  {isInComparison(selectedProduct.id)
                    ? (lang === 'ar' ? '✓ مضاف لقائمة المقارنة (فتح جدول المقارنة)' : 'In comparison matrix (Click to view)')
                    : (lang === 'ar' ? 'مقارنة هذا المنتج بمنتجات أخرى' : 'Compare with other products')}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Reviews & Ratings Interactive Section */}
        <div className="border-t border-slate-800 p-6 sm:p-8 bg-slate-950/60 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{lang === 'ar' ? 'تقييمات وآراء العملاء' : 'Customer Reviews & Feedback'}</span>
                  <span className="text-xs font-normal text-slate-400">({selectedProduct.reviews?.length || 0})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ar'
                    ? 'مراجعات موثقة من عملاء استلموا المنتج وجربوه'
                    : 'Authentic feedback from verified shoppers'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all self-start sm:self-auto"
            >
              {showReviewForm
                ? (lang === 'ar' ? 'إغلاق نموذج التقييم' : 'Close Review Form')
                : (lang === 'ar' ? '✍️ اكتب تقييمك للمنتج' : '✍️ Write a Review')}
            </button>
          </div>

          {/* New Review Submission Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-4 animate-in fade-in duration-200">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {lang === 'ar' ? 'إضافة تقييم جديد' : 'Submit Product Review'}
              </h4>

              {reviewSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تم نشر تقييمك بنجاح وسينعكس فوراً على المتجر!' : 'Review published successfully!'}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">
                    {lang === 'ar' ? 'اسمك الكريم *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: عبد العزيز القحطاني' : 'e.g. Alex'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">
                    {lang === 'ar' ? 'المدينة' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={reviewCity}
                    onChange={(e) => setReviewCity(e.target.value)}
                    placeholder={lang === 'ar' ? 'الرياض' : 'Dubai'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">
                    {lang === 'ar' ? 'التقييم بالنجوم *' : 'Star Rating *'}
                  </label>
                  <div className="flex items-center gap-1.5 py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-amber-400 font-bold ms-2">({reviewRating}/5)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  {lang === 'ar' ? 'رأيك وتجربتك بالتفصيل *' : 'Detailed Review Comments *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب تجربتك مع جودة الخامات وسرعة التوصيل وعمر البطارية...' : 'Share your honest feedback on product build, specs, and delivery...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إرسال ونشر التقييم' : 'Post Review'}</span>
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-3">
            {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
              selectedProduct.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{rev.author}</span>
                        {rev.city && <span className="text-[10px] text-slate-500">{rev.city}</span>}
                      </div>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-medium">
                          {lang === 'ar' ? 'مشتري موثق' : 'Verified Purchase'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500 ms-2">{rev.date}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'ar' ? rev.commentAr : (rev.commentEn || rev.commentAr)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">
                {lang === 'ar' ? 'لا توجد مراجعات سابقة بعد، كن أول من يقيم هذا المنتج!' : 'No reviews yet, be the first to review!'}
              </p>
            )}
          </div>
        </div>

        {/* You May Also Like Section */}
        <div className="p-6 sm:p-8 bg-slate-900/30 border-t border-slate-800">
           <h3 className="text-base font-bold text-white mb-4">
             {lang === 'ar' ? 'منتجات قد تعجبك' : 'You May Also Like'}
           </h3>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             {getRecommendations(selectedProduct.id).map(prod => (
               <button
                 key={prod.id}
                 onClick={() => {
                   setSelectedProduct(prod);
                   addToBrowsingHistory(prod.id);
                 }}
                 className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-start transition-all"
               >
                 <img src={prod.imageUrl} alt={lang === 'ar' ? prod.titleAr : prod.titleEn} className="w-full aspect-square object-cover rounded-xl mb-2" />
                 <p className="text-xs font-bold text-white truncate">{lang === 'ar' ? prod.titleAr : prod.titleEn}</p>
                 <p className="text-[10px] text-cyan-400 font-mono">{formatPrice(prod.priceUSD)}</p>
               </button>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};
