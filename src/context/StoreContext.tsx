import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  Product,
  ProductVariant,
  CartItem,
  Order,
  CurrencyCode,
  Category,
  DropshipSupplier,
  ProductReview,
  LocationStock,
  AuditLog,
  BannerSlide,
  PriceDropAlert,
  UserRole,
  PosSaleRecord,
  PriceChangeRequest,
} from '../types';

import {
  INITIAL_PRODUCTS,
  CURRENCIES,
  MOCK_SUPPLIERS,
  INITIAL_LOCATION_STOCKS,
  INITIAL_AUDIT_LOGS,
  INITIAL_BANNER_SLIDES,
} from '../data/mockProducts';

interface StoreContextType {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceUSD: number) => string;
  activeView: 'store' | 'tracking' | 'dropship_ops' | 'admin';
  setActiveView: (view: 'store' | 'tracking' | 'dropship_ops' | 'admin') => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;

  // Products CRUD
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  addProductFromSupplier: (newProduct: Product) => void;
  updateProduct: (updated: Product) => void;
  deleteProduct: (productId: string) => void;
  addReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Price Drop Alerts
  priceDropAlerts: PriceDropAlert[];
  addPriceDropAlert: (productId: string, emailOrPhone: string, targetPriceUSD: number) => void;
  isPriceDropModalOpen: boolean;
  setIsPriceDropModalOpen: (open: boolean) => void;
  selectedAlertProduct: Product | null;
  setSelectedAlertProduct: (p: Product | null) => void;
  triggerPriceDropSimulation: (productId: string, newPriceUSD: number) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateCartQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalUSD: number;
  cartItemsCount: number;
  addedItemToast: { product: Product; variant: ProductVariant } | null;
  dismissToast: () => void;

  // Checkout & Orders (Omnichannel Courier vs Click & Collect)
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingNumber'>) => Order;
  fulfillOrderWithSupplier: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  activeTrackingId: string | null;
  setActiveTrackingId: (id: string | null) => void;

  // Product Comparison
  comparisonList: Product[];
  addToComparison: (product: Product) => { success: boolean; reason?: 'exists' | 'limit' };
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
  isComparisonModalOpen: boolean;
  setIsComparisonModalOpen: (open: boolean) => void;

  // Smart Compatibility Finder
  isCompatibilityFinderOpen: boolean;
  setIsCompatibilityFinderOpen: (open: boolean) => void;
  selectedCompatibilityDevice: string | null;
  setSelectedCompatibilityDevice: (device: string | null) => void;

  // Multi-Location Inventory & RBAC
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  locationStocks: LocationStock[];
  updateStock: (productId: string, locationId: 'loc-xmall' | 'loc-warehouse', delta: number) => void;
  transferStock: (productId: string, fromLoc: 'loc-xmall' | 'loc-warehouse', toLoc: 'loc-xmall' | 'loc-warehouse', amount: number) => void;

  // POS Cashier Register
  posSales: PosSaleRecord[];
  completePosSale: (items: { product: Product; variant: ProductVariant; quantity: number }[], paymentMethod: 'cash' | 'card' | 'instapay', cashierName: string) => PosSaleRecord;
  isPosModalOpen: boolean;
  setIsPosModalOpen: (open: boolean) => void;

  // AI Banner Studio & Live Hero Carousel
  heroBanners: BannerSlide[];
  publishBannerSlide: (banner: BannerSlide) => void;
  deleteBannerSlide: (bannerId: string) => void;

  // AI Image Studio & Product Editor Modal
  isAiStudioModalOpen: boolean;
  setIsAiStudioModalOpen: (open: boolean) => void;
  aiStudioSelectedProduct: Product | null;
  setAiStudioSelectedProduct: (p: Product | null) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: AuditLog['action'], target: string, details: string) => void;

  // Dropship stats & suppliers
  suppliers: DropshipSupplier[];
  dropshipStats: {
    totalRevenueUSD: number;
    totalSupplierCostUSD: number;
    netProfitUSD: number;
    ordersCount: number;
    marginPercent: number;
  };

  // Recommendations
  browsingHistory: string[];
  addToBrowsingHistory: (productId: string) => void;
  getRecommendations: (productId: string) => Product[];

  // Dynamic Pricing Requests
  priceChangeRequests: PriceChangeRequest[];
  requestDynamicPriceChange: (productId: string, newPriceUSD: number, reason: string) => void;
  approvePriceChange: (requestId: string) => void;
  rejectPriceChange: (requestId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ZE-78219',
    customerName: 'فهد عبد الله العتيبي',
    customerPhone: '+966 50 123 4567',
    customerEmail: 'fahad@example.com',
    city: 'الرياض',
    shippingAddress: 'حي الياسمين، شارع أنس بن مالك، فيلا 14',
    fulfillmentType: 'courier_delivery',
    paymentMethod: 'cod',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        selectedVariant: INITIAL_PRODUCTS[0].variants[0],
        quantity: 1,
      },
      {
        product: INITIAL_PRODUCTS[3],
        selectedVariant: INITIAL_PRODUCTS[3].variants[0],
        quantity: 1,
      },
    ],
    totalUSD: 108.98,
    supplierCostUSD: 37.00,
    profitUSD: 71.98,
    currency: 'SAR',
    status: 'dispatched_supplier',
    trackingNumber: 'ZE-78219',
    supplierTrackingNumber: 'CJ-EXP-940281903',
    createdAt: '2026-11-03T14:32:00Z',
    supplierName: 'Shenzhen Apex Tech Dropship Direct',
  },
  {
    id: 'ZE-78220',
    customerName: 'سارة محمد الشامسي',
    customerPhone: '+971 52 987 6543',
    customerEmail: 'sara.s@example.com',
    city: 'دبي',
    shippingAddress: 'دبي مارينا، برج المارينا جيت 2، شقة 1804',
    fulfillmentType: 'courier_delivery',
    paymentMethod: 'apple_pay',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        selectedVariant: INITIAL_PRODUCTS[1].variants[0],
        quantity: 1,
      },
    ],
    totalUSD: 69.99,
    supplierCostUSD: 24.00,
    profitUSD: 45.99,
    currency: 'AED',
    status: 'in_transit',
    trackingNumber: 'ZE-78220',
    supplierTrackingNumber: 'AE-GLB-449102831',
    createdAt: '2026-11-02T10:15:00Z',
    supplierName: 'Guangzhou Soundwave Electronic Co.',
  },
  {
    id: 'ZE-78221',
    customerName: 'أحمد محمود السعيد',
    customerPhone: '+20 100 555 4321',
    customerEmail: 'ahmed.m@example.com',
    city: 'القاهرة الجديدة',
    shippingAddress: 'استلام مباشر من كاونتر بارتشن X-Mall',
    fulfillmentType: 'click_and_collect_xmall',
    paymentMethod: 'instapay',
    items: [
      {
        product: INITIAL_PRODUCTS[2],
        selectedVariant: INITIAL_PRODUCTS[2].variants[0],
        quantity: 1,
      },
    ],
    totalUSD: 44.99,
    supplierCostUSD: 14.20,
    profitUSD: 30.79,
    currency: 'EGP',
    status: 'ready_for_pickup',
    trackingNumber: 'ZE-78221',
    createdAt: '2026-11-04T18:45:00Z',
    supplierName: 'Dongguan PowerPro Tech Direct',
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('zoos_dark_mode', true);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const [currency, setCurrency] = useState<CurrencyCode>('SAR');
  const [activeView, setActiveView] = useState<'store' | 'tracking' | 'dropship_ops' | 'admin'>('store');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(['prod-smartwatch-titanium']);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Price Drop Alerts
  const [priceDropAlerts, setPriceDropAlerts] = useState<PriceDropAlert[]>([
    {
      id: 'alert-1',
      productId: 'prod-smartwatch-titanium',
      userEmailOrPhone: 'user@example.com',
      targetPriceUSD: 69.99,
      currentPriceUSD: 79.99,
      createdAt: '2026-11-04T12:00:00Z',
      notified: false,
    },
  ]);
  const [isPriceDropModalOpen, setIsPriceDropModalOpen] = useState(false);
  const [selectedAlertProduct, setSelectedAlertProduct] = useState<Product | null>(null);

  // Cart & Checkout
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [addedItemToast, setAddedItemToast] = useState<{ product: Product; variant: ProductVariant } | null>(null);
  const dismissToast = () => setAddedItemToast(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);

  // Comparison
  const [comparisonList, setComparisonList] = useState<Product[]>([INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1]]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Smart Compatibility Finder
  const [isCompatibilityFinderOpen, setIsCompatibilityFinderOpen] = useState(false);
  const [selectedCompatibilityDevice, setSelectedCompatibilityDevice] = useState<string | null>(null);

  // Multi-Location Inventory & RBAC
  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [locationStocks, setLocationStocks] = useState<LocationStock[]>(INITIAL_LOCATION_STOCKS);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // AI Banners for Hero Carousel
  const [heroBanners, setHeroBanners] = useState<BannerSlide[]>(INITIAL_BANNER_SLIDES);

  // POS
  const [posSales, setPosSales] = useState<PosSaleRecord[]>([]);
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);

  // AI Image Studio & Product Editor
  const [isAiStudioModalOpen, setIsAiStudioModalOpen] = useState(false);
  const [aiStudioSelectedProduct, setAiStudioSelectedProduct] = useState<Product | null>(null);

  const [suppliers] = useState<DropshipSupplier[]>(MOCK_SUPPLIERS);

  // Recommendations
  const [browsingHistory, setBrowsingHistory] = useState<string[]>([]);

  // Dynamic Pricing Requests
  const [priceChangeRequests, setPriceChangeRequests] = useState<PriceChangeRequest[]>([]);

  const addToBrowsingHistory = (productId: string) => {
    setBrowsingHistory(prev => [productId, ...prev.filter(id => id !== productId)].slice(0, 10));
  };

  const getRecommendations = (productId: string): Product[] => {
    const currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return products.slice(0, 4);
    
    // Simple heuristic recommendation
    return products
      .filter(p => p.id !== productId && 
        (p.category === currentProduct.category || p.brandCompatibility.some(b => currentProduct.brandCompatibility.includes(b))))
      .slice(0, 4);
  };

  const requestDynamicPriceChange = (productId: string, newPriceUSD: number, reason: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const request: PriceChangeRequest = {
      id: `pcr-${Date.now()}`,
      productId,
      oldPriceUSD: prod.priceUSD,
      newPriceUSD,
      reason,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };
    setPriceChangeRequests(prev => [request, ...prev]);
    addAuditLog('price_updated', prod.titleAr, `طلب تعديل سعر ديناميكي: ${prod.priceUSD}$ إلى ${newPriceUSD}$ - السبب: ${reason}`);
  };

  const approvePriceChange = (requestId: string) => {
    const req = priceChangeRequests.find(r => r.id === requestId);
    if (!req || req.status !== 'pending') return;
    
    updateProduct({
      ...products.find(p => p.id === req.productId)!,
      priceUSD: req.newPriceUSD
    });
    setPriceChangeRequests(prev => prev.map(r => r.id === requestId ? {...r, status: 'approved'} : r));
    addAuditLog('price_updated', req.productId, `تمت الموافقة على تعديل السعر إلى ${req.newPriceUSD}$`);
  };
  
  const rejectPriceChange = (requestId: string) => {
    setPriceChangeRequests(prev => prev.map(r => r.id === requestId ? {...r, status: 'rejected'} : r));
  };

  // Sync html dir & lang & darkMode
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const addAuditLog = (action: AuditLog['action'], target: string, details: string) => {
    const actorNames: Record<UserRole, string> = {
      owner: 'مالك النظام (Owner)',
      admin: 'المدير العام (Admin)',
      inventory_manager: 'مسؤول المخزون (Inventory Officer)',
      cashier: 'كاشير المعرض (X-Mall Cashier)',
    };
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action,
      actor: actorNames[currentRole] || 'System',
      role: currentRole,
      target,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const formatPrice = (priceUSD: number): string => {
    const config = CURRENCIES[currency] || CURRENCIES.SAR;
    const converted = priceUSD * config.rateFromUSD;
    return `${converted.toFixed(config.code === 'USD' ? 2 : 0)} ${config.symbol}`;
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      addAuditLog(
        'role_switched',
        `Wishlist: ${productId}`,
        exists ? 'تمت إزالة المنتج من قائمة الأمنيات' : 'تمت إضافة المنتج لقائمة الأمنيات'
      );
      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Price Drop Alert
  const addPriceDropAlert = (productId: string, emailOrPhone: string, targetPriceUSD: number) => {
    const prod = products.find((p) => p.id === productId);
    const newAlert: PriceDropAlert = {
      id: `alert-${Date.now()}`,
      productId,
      userEmailOrPhone: emailOrPhone,
      targetPriceUSD,
      currentPriceUSD: prod ? prod.priceUSD : targetPriceUSD + 10,
      createdAt: new Date().toISOString(),
      notified: false,
    };
    setPriceDropAlerts((prev) => [newAlert, ...prev]);
    addAuditLog('role_switched', `Price Alert: ${prod?.titleAr || productId}`, `تم تسجيل اشتراك بتنبيه السعر عند الوصول إلى ${targetPriceUSD}$`);
  };

  const triggerPriceDropSimulation = (productId: string, newPriceUSD: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const oldPrice = p.priceUSD;
          return { ...p, priceUSD: newPriceUSD, originalPriceUSD: oldPrice };
        }
        return p;
      })
    );
    // Mark alerts as notified
    setPriceDropAlerts((prev) =>
      prev.map((al) => (al.productId === productId ? { ...al, notified: true } : al))
    );
    addAuditLog('price_updated', productId, `تخفيض السعر الترويجي إلى ${newPriceUSD}$ وتفعيل إشعارات العملاء المشتركين.`);
  };

  // Product Reviews
  const addReview = (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => {
    const newReview: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const avgRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: Number(avgRating.toFixed(1)),
          };
        }
        return p;
      })
    );
    addAuditLog('product_added', productId, `تقييم جديد (${review.rating} نجوم) بواسطة ${review.author}`);
  };

  // Products CRUD
  const addProductFromSupplier = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    // Add default stocks for new product
    setLocationStocks((prev) => [
      ...prev,
      {
        productId: newProduct.id,
        locationId: 'loc-xmall',
        locationNameAr: 'بارتشن X-Mall (المعرض)',
        locationNameEn: 'X-Mall Store Partition',
        onHand: 15,
        reserved: 0,
        usable: 15,
        reorderLevel: 5,
      },
      {
        productId: newProduct.id,
        locationId: 'loc-warehouse',
        locationNameAr: 'المستودع المركزي / خط الشحن',
        locationNameEn: 'Central Warehouse / Direct Hub',
        onHand: 100,
        reserved: 0,
        usable: 100,
        reorderLevel: 15,
      },
    ]);
    addAuditLog('product_added', newProduct.titleAr, `إضافة منتج جديد للكتالوج: SKU: ${newProduct.sku}`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProduct && selectedProduct.id === updated.id) {
      setSelectedProduct(updated);
    }
    addAuditLog('price_updated', updated.titleAr, `تحديث بيانات المنتج وصورته ونشره في المعرض.`);
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setLocationStocks((prev) => prev.filter((s) => s.productId !== productId));
    addAuditLog('product_deleted', prod?.titleAr || productId, `حذف المنتج وإلغاء إتاحته في الكتالوج.`);
  };

  // Multi-Location Inventory operations
  const updateStock = (productId: string, locationId: 'loc-xmall' | 'loc-warehouse', delta: number) => {
    setLocationStocks((prev) =>
      prev.map((s) => {
        if (s.productId === productId && s.locationId === locationId) {
          const newOnHand = Math.max(0, s.onHand + delta);
          return {
            ...s,
            onHand: newOnHand,
            usable: Math.max(0, newOnHand - s.reserved),
          };
        }
        return s;
      })
    );
    addAuditLog('stock_adjusted', productId, `تعديل رصيد المخزون بقيمة (${delta > 0 ? `+${delta}` : delta}) في ${locationId}`);
  };

  const transferStock = (
    productId: string,
    fromLoc: 'loc-xmall' | 'loc-warehouse',
    toLoc: 'loc-xmall' | 'loc-warehouse',
    amount: number
  ) => {
    if (fromLoc === toLoc || amount <= 0) return;
    setLocationStocks((prev) =>
      prev.map((s) => {
        if (s.productId === productId && s.locationId === fromLoc) {
          const newOnHand = Math.max(0, s.onHand - amount);
          return { ...s, onHand: newOnHand, usable: Math.max(0, newOnHand - s.reserved) };
        }
        if (s.productId === productId && s.locationId === toLoc) {
          const newOnHand = s.onHand + amount;
          return { ...s, onHand: newOnHand, usable: Math.max(0, newOnHand - s.reserved) };
        }
        return s;
      })
    );
    addAuditLog('stock_adjusted', productId, `مناقلة مخزون قدرها ${amount} قطعة من ${fromLoc} إلى ${toLoc}`);
  };

  // POS Cashier Counter Sale
  const completePosSale = (
    items: { product: Product; variant: ProductVariant; quantity: number }[],
    paymentMethod: 'cash' | 'card' | 'instapay',
    cashierName: string
  ): PosSaleRecord => {
    const saleId = `POS-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalUSD = items.reduce(
      (sum, item) => sum + (item.product.priceUSD + (item.variant.extraPriceUSD || 0)) * item.quantity,
      0
    );

    const saleRecord: PosSaleRecord = {
      id: saleId,
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
      cashierName,
      items: items.map((i) => ({
        product: i.product,
        variant: i.variant,
        quantity: i.quantity,
        unitPriceUSD: i.product.priceUSD + (i.variant.extraPriceUSD || 0),
      })),
      totalUSD,
      paymentMethod,
      timestamp: new Date().toISOString(),
    };

    setPosSales((prev) => [saleRecord, ...prev]);

    // Decrement stock from loc-xmall (immediate counter deduction)
    items.forEach((item) => {
      updateStock(item.product.id, 'loc-xmall', -item.quantity);
    });

    addAuditLog('pos_sale', saleRecord.receiptNumber, `عملية بيع كاشير X-Mall بقيمة ${formatPrice(totalUSD)} عبر ${paymentMethod}`);
    return saleRecord;
  };

  // AI Banner Studio -> Hero Carousel
  const publishBannerSlide = (banner: BannerSlide) => {
    setHeroBanners((prev) => {
      const existing = prev.findIndex((b) => b.id === banner.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = banner;
        return next;
      }
      return [banner, ...prev];
    });
    addAuditLog('banner_published', banner.titleAr, `نشر وتحديث بنر تسويقي جديد في السلايدر الرئيسي للمتجر.`);
  };

  const deleteBannerSlide = (bannerId: string) => {
    setHeroBanners((prev) => prev.filter((b) => b.id !== bannerId));
    addAuditLog('banner_published', bannerId, `حذف البنر من السلايدر.`);
  };

  // Cart operations
  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant.id === variant.id
      );

      if (existingIndex > -1) {
        const next = [...prevCart];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [...prevCart, { product, selectedVariant: variant, quantity }];
    });
    // Trigger subtle toast notification without opening full drawer abruptly
    setAddedItemToast({ product, variant });
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedVariant.id === variantId)));
  };

  const updateCartQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedVariant.id === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotalUSD = cart.reduce((sum, item) => {
    const extra = item.selectedVariant.extraPriceUSD || 0;
    return sum + (item.product.priceUSD + extra) * item.quantity;
  }, 0);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders creation
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingNumber'>): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = `ZE-${randomSuffix}`;
    const newOrder: Order = {
      ...orderData,
      id: trackingNumber,
      trackingNumber,
      createdAt: new Date().toISOString(),
      status: orderData.fulfillmentType === 'click_and_collect_xmall' ? 'ready_for_pickup' : 'pending_supplier',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    setActiveTrackingId(trackingNumber);
    setActiveView('tracking');
    addAuditLog(
      'order_fulfilled',
      trackingNumber,
      `طلب جديد (${orderData.fulfillmentType === 'click_and_collect_xmall' ? 'استلام من المعرض' : 'شحن منزلي'}) بقيمة ${formatPrice(orderData.totalUSD)}`
    );
    return newOrder;
  };

  const fulfillOrderWithSupplier = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const supplierTracking = `CJ-TRK-${Math.floor(100000000 + Math.random() * 900000000)}`;
          return {
            ...ord,
            status: 'dispatched_supplier',
            supplierTrackingNumber: supplierTracking,
          };
        }
        return ord;
      })
    );
    addAuditLog('order_fulfilled', orderId, `إرسال الطلب تلقائياً وتوليد كود التتبع مع المورّد.`);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord)));
    addAuditLog('order_fulfilled', orderId, `تعديل حالة الطلب إلى: ${status}`);
  };

  // Product Comparison
  const addToComparison = (product: Product): { success: boolean; reason?: 'exists' | 'limit' } => {
    if (comparisonList.some((p) => p.id === product.id)) {
      return { success: false, reason: 'exists' };
    }
    if (comparisonList.length >= 4) {
      return { success: false, reason: 'limit' };
    }
    setComparisonList((prev) => [...prev, product]);
    return { success: true };
  };

  const removeFromComparison = (productId: string) => {
    setComparisonList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearComparison = () => setComparisonList([]);

  const isInComparison = (productId: string) => comparisonList.some((p) => p.id === productId);

  // Financial KPIs
  const totalRevenueUSD = orders.reduce((acc, o) => acc + o.totalUSD, 0) + posSales.reduce((acc, s) => acc + s.totalUSD, 0);
  const totalSupplierCostUSD = orders.reduce((acc, o) => acc + o.supplierCostUSD, 0);
  const netProfitUSD = totalRevenueUSD - totalSupplierCostUSD;
  const marginPercent = totalRevenueUSD > 0 ? (netProfitUSD / totalRevenueUSD) * 100 : 0;

  return (
    <StoreContext.Provider
      value={{
        lang,
        setLang,
        darkMode,
        toggleDarkMode,
        currency,
        setCurrency,
        formatPrice,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedBrand,
        setSelectedBrand,
        products,
        selectedProduct,
        setSelectedProduct,
        addProductFromSupplier,
        updateProduct,
        deleteProduct,
        addReview,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        priceDropAlerts,
        addPriceDropAlert,
        isPriceDropModalOpen,
        setIsPriceDropModalOpen,
        selectedAlertProduct,
        setSelectedAlertProduct,
        triggerPriceDropSimulation,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalUSD,
        cartItemsCount,
        addedItemToast,
        dismissToast,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orders,
        createOrder,
        fulfillOrderWithSupplier,
        updateOrderStatus,
        activeTrackingId,
        setActiveTrackingId,
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        isComparisonModalOpen,
        setIsComparisonModalOpen,
        isCompatibilityFinderOpen,
        setIsCompatibilityFinderOpen,
        selectedCompatibilityDevice,
        setSelectedCompatibilityDevice,
        currentRole,
        setCurrentRole,
        locationStocks,
        updateStock,
        transferStock,
        posSales,
        completePosSale,
        isPosModalOpen,
        setIsPosModalOpen,
        heroBanners,
        publishBannerSlide,
        deleteBannerSlide,
        isAiStudioModalOpen,
        setIsAiStudioModalOpen,
        aiStudioSelectedProduct,
        setAiStudioSelectedProduct,
        auditLogs,
        addAuditLog,
        suppliers,
        dropshipStats: {
          totalRevenueUSD,
          totalSupplierCostUSD,
          netProfitUSD,
          ordersCount: orders.length + posSales.length,
          marginPercent,
        },
        browsingHistory,
        addToBrowsingHistory,
        getRecommendations,
        priceChangeRequests,
        requestDynamicPriceChange,
        approvePriceChange,
        rejectPriceChange,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
