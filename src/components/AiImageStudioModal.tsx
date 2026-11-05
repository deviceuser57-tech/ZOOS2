import React, { useState, useEffect } from 'react';
import { X, Sparkles, Upload, CheckCircle2, Image, Trash2, ArrowRight, Save, Eye, Palette, Cpu, Barcode, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { SMARTWATCH_IMAGE_URL, HEADPHONES_IMAGE_URL, CHARGER_IMAGE_URL, HERO_IMAGE_URL, ZOOS_HERO_IMAGE_URL } from '../data/mockProducts';
import { AI_ELECTRONICS_PROMPT_PRESETS } from '../constants';

export const AiImageStudioModal: React.FC = () => {
  const {
    lang,
    isAiStudioModalOpen,
    setIsAiStudioModalOpen,
    aiStudioSelectedProduct,
    setAiStudioSelectedProduct,
    updateProduct,
    addProductFromSupplier,
    deleteProduct,
  } = useStore();

  const isEditing = Boolean(aiStudioSelectedProduct);

  // Form State
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState<Product['category']>('phone_accessories');
  const [priceUSD, setPriceUSD] = useState(39.99);
  const [supplierCostUSD, setSupplierCostUSD] = useState(14.00);
  const [warrantyMonths, setWarrantyMonths] = useState(18);
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [imageUrl, setImageUrl] = useState(CHARGER_IMAGE_URL);
  const [compatibility, setCompatibility] = useState('Apple, Samsung, Universal');

  // Step 3 Attributes: Serial Number & Colors
  const [serialNumber, setSerialNumber] = useState('');
  const [colorHex, setColorHex] = useState('#18181b');
  const [colorNameAr, setColorNameAr] = useState('أسود تيتانيوم');
  const [selectedElectronicsPrompt, setSelectedElectronicsPrompt] = useState('cyberpunk-neon');

  // AI Image Processing Presets
  const [selectedPreset, setSelectedPreset] = useState<'cleanStudio' | 'techDesk' | 'titaniumLuxury'>('cleanStudio');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiPreviewUrl, setAiPreviewUrl] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [productUrl, setProductUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  useEffect(() => {
    if (aiStudioSelectedProduct) {
      setTitleAr(aiStudioSelectedProduct.titleAr);
      setTitleEn(aiStudioSelectedProduct.titleEn);
      setCategory(aiStudioSelectedProduct.category);
      setPriceUSD(aiStudioSelectedProduct.priceUSD);
      setSupplierCostUSD(aiStudioSelectedProduct.supplierCostUSD);
      setWarrantyMonths(aiStudioSelectedProduct.warrantyMonths || 12);
      setSku(aiStudioSelectedProduct.sku);
      setBarcode(aiStudioSelectedProduct.barcode);
      setDescriptionAr(aiStudioSelectedProduct.descriptionAr);
      setImageUrl(aiStudioSelectedProduct.imageUrl);
      setCompatibility(aiStudioSelectedProduct.brandCompatibility.join(', '));
      setSerialNumber(aiStudioSelectedProduct.sku ? `SN-${aiStudioSelectedProduct.sku}` : `SN-ZE-${Date.now().toString().slice(-6)}`);
      if (aiStudioSelectedProduct.variants?.[0]) {
        setColorHex(aiStudioSelectedProduct.variants[0].colorHex || '#18181b');
        setColorNameAr(aiStudioSelectedProduct.variants[0].nameAr || 'اللون الأساسي');
      }
      setAiPreviewUrl(null);
    } else {
      // New product defaults
      setTitleAr('');
      setTitleEn('');
      setCategory('phone_accessories');
      setPriceUSD(35.00);
      setSupplierCostUSD(12.00);
      setWarrantyMonths(18);
      setSku(`ZE-AI-${Math.floor(1000 + Math.random() * 9000)}`);
      setBarcode(`622999${Math.floor(100000 + Math.random() * 900000)}`);
      setSerialNumber(`SN-ZE-${Date.now().toString().slice(-6)}`);
      setColorHex('#18181b');
      setColorNameAr('أسود تيتانيوم');
      setDescriptionAr('منتج تقني معتمد مع فحص جودة استثنائي وضمان استبدال مباشر.');
      setImageUrl(CHARGER_IMAGE_URL);
      setCompatibility('Apple, Samsung, Universal');
      setAiPreviewUrl(null);
    }
  }, [aiStudioSelectedProduct, isAiStudioModalOpen]);

  if (!isAiStudioModalOpen) return null;

  const handleApplyAiPreset = () => {
    setIsAiProcessing(true);
    // Simulate AI Image Studio enhancement based on product category
    setTimeout(() => {
      let resultUrl = imageUrl;
      if (category === 'smartwatches') {
        resultUrl = SMARTWATCH_IMAGE_URL;
      } else if (category === 'earphones') {
        resultUrl = HEADPHONES_IMAGE_URL;
      } else {
        resultUrl = CHARGER_IMAGE_URL;
      }
      setAiPreviewUrl(resultUrl);
      setIsAiProcessing(false);
    }, 900);
  };

  const handleApplyPreviewToProduct = () => {
    if (aiPreviewUrl) {
      setImageUrl(aiPreviewUrl);
      setAiPreviewUrl(null);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim()) return;

    const compatArray = compatibility
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const targetProduct: Product = {
      id: aiStudioSelectedProduct?.id || `prod-ai-${Date.now()}`,
      sku: sku || `ZE-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: barcode || `622999${Math.floor(100000 + Math.random() * 900000)}`,
      titleAr,
      titleEn: titleEn || titleAr,
      category,
      brandCompatibility: compatArray.length > 0 ? compatArray : ['Universal'],
      priceUSD: Number(priceUSD),
      supplierCostUSD: Number(supplierCostUSD),
      originalPriceUSD: Number((priceUSD * 1.3).toFixed(2)),
      rating: aiStudioSelectedProduct?.rating || 4.9,
      reviewsCount: aiStudioSelectedProduct?.reviewsCount || 12,
      reviews: aiStudioSelectedProduct?.reviews || [],
      imageUrl: aiPreviewUrl || imageUrl,
      badgeAr: 'معتمد ومعالج بالذكاء الاصطناعي',
      badgeEn: 'AI Studio Verified',
      isWinningProduct: true,
      isFeatured: true,
      deliveryDaysMin: 3,
      deliveryDaysMax: 6,
      descriptionAr,
      descriptionEn: titleEn || titleAr,
      specs: aiStudioSelectedProduct?.specs || [
        { labelAr: 'الضمان', labelEn: 'Warranty', value: `${warrantyMonths} شهراً` },
        { labelAr: 'الجودة', labelEn: 'Quality Grade', value: 'Original Spec A+' },
      ],
      variants: [
        {
          id: 'v1',
          nameAr: colorNameAr || 'اللون المختار',
          nameEn: colorNameAr || 'Selected Color',
          colorHex: colorHex || '#18181b',
          inStock: true,
        },
        ...(aiStudioSelectedProduct?.variants?.slice(1) || [
          { id: 'v2', nameAr: 'تيتانيوم فضي', nameEn: 'Silver Titanium', colorHex: '#9ca3af', inStock: true },
        ]),
      ],
      supplierName: 'Zoos Electronics Certified Hub',
      supplierPlatform: 'CJDropshipping',
      supplierSku: sku,
      stockQuantity: aiStudioSelectedProduct?.stockQuantity || 120,
      warrantyMonths: Number(warrantyMonths),
      sourceType: 'owned_x_mall',
    };

    if (isEditing) {
      updateProduct(targetProduct);
    } else {
      addProductFromSupplier(targetProduct);
    }

    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setIsAiStudioModalOpen(false);
      setAiStudioSelectedProduct(null);
    }, 1200);
  };

  const handleDelete = () => {
    if (aiStudioSelectedProduct) {
      deleteProduct(aiStudioSelectedProduct.id);
      setIsAiStudioModalOpen(false);
      setAiStudioSelectedProduct(null);
    }
  };




  const handleFetchProductData = async () => {
    if (!productUrl.trim()) return;
    setIsFetchingUrl(true);
    // Simulate API call to fetch product details from supplier URL
    setTimeout(() => {
      setTitleAr('سماعات الأذن الاحترافية Aura Pro - نسخة الذكاء الاصطناعي');
      setTitleEn('Aura Pro Studio ANC Headphones - AI Optimized Edition');
      setDescriptionAr('سماعات عازلة للضوضاء بتصميم مريح وجودة صوت عالية، تم تحسين الوصف بواسطة الذكاء الاصطناعي لتجربة مستخدم أفضل.');
      setPriceUSD(89.99);
      setSupplierCostUSD(25.00);
      setIsFetchingUrl(false);
    }, 1500);
  };

  const handleAiEnhanceDescription = () => {
      setDescriptionAr(descriptionAr + ' (تم التحسين بالذكاء الاصطناعي: صوت نقي، تصميم مريح، جودة تصنيع فائقة).');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => { setIsAiStudioModalOpen(false); setAiStudioSelectedProduct(null); }} />
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white">
            {isEditing ? (lang === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}
          </h2>
          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 text-xs text-rose-400 hover:text-white hover:bg-rose-600/30 rounded-xl transition-colors flex items-center gap-1.5 border border-rose-500/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'حذف المنتج' : 'Delete'}</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsAiStudioModalOpen(false);
                setAiStudioSelectedProduct(null);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePublish} className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Auto-Fill Section */}
          <div className="lg:col-span-12 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{lang === 'ar' ? 'استيراد سريع بالذكاء الاصطناعي' : 'AI Auto-Fill From URL'}</h4>
              <div className="flex gap-2">
                  <input 
                    type="url" 
                    placeholder={lang === 'ar' ? 'لصق رابط المنتج من الموقع المورد...' : 'Paste supplier product URL...'}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                  />
                  <button type="button" onClick={handleFetchProductData} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700">
                      {isFetchingUrl ? '...' : (lang === 'ar' ? 'جلب البيانات' : 'Fetch')}
                  </button>
              </div>
              <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800">
                      <Upload className="w-3.5 h-3.5" /> {lang === 'ar' ? 'رفع صورة من الكمبيوتر' : 'Upload Image'}
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
              </div>
          </div>

          {/* Left Column (lg: 6 cols): Image Processing Studio */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Image className="w-4 h-4" />
              <span>{lang === 'ar' ? '1. استديو معالجة الصور بالذكاء الاصطناعي' : '1. AI Image Processing Studio'}</span>
            </h3>

            {/* Visual Before / After Box */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="space-y-1.5 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {lang === 'ar' ? 'الصورة الأصلية' : 'Original Photo'}
                </span>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img
                    src={imageUrl}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-center">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'المعالجة بالذكاء الاصطناعي' : 'AI Render Preview'}</span>
                </span>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-cyan-500/30 flex items-center justify-center">
                  {isAiProcessing ? (
                    <div className="text-center space-y-2 p-2">
                      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                      <span className="text-[10px] text-cyan-300 font-medium block animate-pulse">
                        {lang === 'ar' ? 'جاري تحسين الخلفية والإضاءة...' : 'Enhancing studio lighting...'}
                      </span>
                    </div>
                  ) : aiPreviewUrl ? (
                    <img
                      src={aiPreviewUrl}
                      alt="AI Preview"
                      className="w-full h-full object-cover animate-in fade-in"
                    />
                  ) : (
                    <span className="text-[11px] text-slate-500 p-2">
                      {lang === 'ar' ? 'اختر نمطاً واضغط زر المعالجة' : 'Pick preset and run AI process'}
                    </span>
                  )}
                </div>
              </div>
            </div>

              {/* Electronics AI Background Studio Prompts */}
              <div className="space-y-1.5 pt-2">
                <span className="font-semibold text-cyan-400 block text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{lang === 'ar' ? 'برومبت استديو الإلكترونيات الذكية (AI Electronics Prompts):' : 'Electronics AI Background Presets:'}</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {AI_ELECTRONICS_PROMPT_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedElectronicsPrompt(p.id)}
                      className={`p-2 rounded-xl border text-start transition-all text-[11px] ${
                        selectedElectronicsPrompt === p.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white ring-1 ring-cyan-500/40'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <p className="font-bold text-white truncate">{lang === 'ar' ? p.nameAr : p.nameEn}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{p.promptSnippet}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action: Run AI Process */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleApplyAiPreset}
                  disabled={isAiProcessing}
                  className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'ar' ? 'معالجة الصورة بالذكاء الاصطناعي' : 'Process Image with AI'}</span>
                </button>

                {aiPreviewUrl && (
                  <button
                    type="button"
                    onClick={handleApplyPreviewToProduct}
                    className="py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'اعتماد كصورة أساسية' : 'Adopt as Image'}</span>
                  </button>
                )}
              </div>

            {/* Custom Image URL fallback */}
            <div className="text-xs space-y-1">
              <label className="text-slate-400 font-medium">
                {lang === 'ar' ? 'رابط الصورة المباشر (أو صورة مخصصة):' : 'Custom Image URL / Asset Path:'}
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs"
              />
            </div>
          </div>

          {/* Right Column (lg: 6 cols): Product Specifications & Live Gallery Publishing */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>{lang === 'ar' ? '2. بيانات المنتج والتسعير في المعرض' : '2. Product Details & Live Publishing'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {lang === 'ar' ? 'اسم المنتج بالعربية *' : 'Product Title (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="مثال: سماعة رأس لاسلكية عازلة للضوضاء"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {lang === 'ar' ? 'اسم المنتج بالإنجليزية' : 'Product Title (English)'}
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Wireless ANC Studio Headphones"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'القسم' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Product['category'])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="phone_accessories">{lang === 'ar' ? 'إكسسوارات هواتف' : 'Phone Gear'}</option>
                    <option value="earphones">{lang === 'ar' ? 'سماعات صوتية' : 'Headphones / Earbuds'}</option>
                    <option value="smartwatches">{lang === 'ar' ? 'ساعات ذكية' : 'Smartwatches'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'مدة الضمان (شهور)' : 'Warranty (Months)'}
                  </label>
                  <input
                    type="number"
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'سعر البيع النهائي ($ USD) *' : 'Retail Price ($ USD) *'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={priceUSD}
                    onChange={(e) => setPriceUSD(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'تكلفة الشراء للمورد ($ USD)' : 'Supplier Cost ($ USD)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={supplierCostUSD}
                    onChange={(e) => setSupplierCostUSD(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{lang === 'ar' ? 'الباركود' : 'Barcode'}</label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Colors & Variants Input */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                  <Palette className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إدخال اللون والإصدار (Color & Variant):' : 'Color & Swatch Variant:'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{lang === 'ar' ? 'اسم اللون' : 'Color Name'}</label>
                    <input
                      type="text"
                      value={colorNameAr}
                      onChange={(e) => setColorNameAr(e.target.value)}
                      placeholder="أسود تيتانيوم"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{lang === 'ar' ? 'رمز اللون (Hex)' : 'Color Hex'}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Serial & IMEI Tracking Input */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                    <Barcode className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'تتبع رقم السيريال والضمان (Serial Number / Warranty):' : 'Serial & IMEI Tracking:'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSerialNumber(`SN-ZE-${Date.now().toString().slice(-6)}`)}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    {lang === 'ar' ? 'توليد تلقائي' : 'Generate'}
                  </button>
                </div>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="SN-ZE-984210"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              {/* Device Compatibility Quick Selectors */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'ar' ? 'الأجهزة المتوافقة (Compatibility):' : 'Compatibility:'}</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {['iPhone 16 Pro Max', 'iPhone 15 Pro', 'Galaxy S25 Ultra', 'Apple Watch Ultra', 'Universal Qi2'].map((dev) => (
                    <button
                      key={dev}
                      type="button"
                      onClick={() => {
                        if (!compatibility.includes(dev)) {
                          setCompatibility(prev => prev ? `${prev}, ${dev}` : dev);
                        }
                      }}
                      className="text-[10px] bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 px-2 py-1 rounded-md border border-slate-700 transition-colors"
                    >
                      + {dev}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={compatibility}
                  onChange={(e) => setCompatibility(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-300 font-semibold">
                      {lang === 'ar' ? 'وصف المنتج التفصيلي' : 'Detailed Description'}
                    </label>
                    <button type="button" onClick={handleAiEnhanceDescription} className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300">
                        {lang === 'ar' ? 'تحسين بالذكاء الاصطناعي 🪄' : 'Enhance with AI 🪄'}
                    </button>
                </div>
                <textarea
                  rows={3}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
                />
              </div>
            </div>

            {/* Publish Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {publishSuccess
                    ? (lang === 'ar' ? 'تم النشر وتحديث الكتالوج بنجاح!' : 'Published Successfully!')
                    : isEditing
                    ? (lang === 'ar' ? 'اعتماد ونشر التعديلات في معرض المنتجات' : 'Publish Edits to Live Gallery')
                    : (lang === 'ar' ? 'نشر وإضافة المنتج فورياً للمتجر' : 'Publish Product Live')}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
