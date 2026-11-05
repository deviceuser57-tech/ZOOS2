export * from './types/product';

export type Category = 'all' | 'phone_accessories' | 'earphones' | 'smartwatches';

export type CurrencyCode = 'SAR' | 'AED' | 'EGP' | 'USD';

export type UserRole = 'owner' | 'admin' | 'inventory_manager' | 'cashier';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateFromUSD: number; // 1 USD = rate
}

export interface ProductVariant {
  id: string;
  nameAr: string;
  nameEn: string;
  colorHex: string;
  modelCompatibility?: string;
  inStock: boolean;
  extraPriceUSD?: number;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  commentAr: string;
  commentEn?: string;
  verifiedPurchase: boolean;
  city?: string;
}

export interface LocationStock {
  productId: string;
  locationId: 'loc-xmall' | 'loc-warehouse';
  locationNameAr: string;
  locationNameEn: string;
  onHand: number;
  reserved: number;
  usable: number;
  reorderLevel: number;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  titleAr: string;
  titleEn: string;
  category: 'phone_accessories' | 'earphones' | 'smartwatches';
  brandCompatibility: string[]; // e.g. ['Apple', 'Samsung', 'Universal']
  priceUSD: number; // Retail selling price
  supplierCostUSD: number; // Dropshipping cost from supplier
  originalPriceUSD?: number; // MSRP / Strikethrough
  rating: number;
  reviewsCount: number;
  reviews: ProductReview[];
  imageUrl: string;
  secondaryImages?: string[];
  badgeAr?: string;
  badgeEn?: string;
  isWinningProduct?: boolean;
  isFeatured?: boolean;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  descriptionAr: string;
  descriptionEn: string;
  specs: { labelAr: string; labelEn: string; value: string }[];
  variants: ProductVariant[];
  supplierName: string;
  supplierPlatform: 'AliExpress' | 'CJDropshipping' | 'Spocket' | 'FactoryDirect';
  supplierSku: string;
  stockQuantity: number;
  warrantyMonths: number;
  sourceType: 'owned_x_mall' | 'dropshipping_direct';
}

export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string;
  shippingAddress: string;
  fulfillmentType: 'courier_delivery' | 'click_and_collect_xmall';
  paymentMethod: 'cod' | 'card' | 'apple_pay' | 'pos_cash' | 'instapay';
  items: CartItem[];
  totalUSD: number;
  supplierCostUSD: number;
  profitUSD: number;
  currency: CurrencyCode;
  status: 'pending_supplier' | 'dispatched_supplier' | 'in_transit' | 'out_for_delivery' | 'ready_for_pickup' | 'delivered';
  trackingNumber: string;
  supplierTrackingNumber?: string;
  createdAt: string;
  supplierName: string;
}

export interface DropshipSupplier {
  id: string;
  name: string;
  platform: 'AliExpress' | 'CJDropshipping' | 'Spocket' | 'FactoryDirect';
  avgProcessingDays: number;
  avgShippingDays: number;
  qualityScore: number;
  activeProductsCount: number;
  apiConnected: boolean;
}

export interface PriceDropAlert {
  id: string;
  productId: string;
  userEmailOrPhone: string;
  targetPriceUSD: number;
  currentPriceUSD: number;
  createdAt: string;
  notified: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: 'stock_adjusted' | 'price_updated' | 'product_added' | 'product_deleted' | 'pos_sale' | 'banner_published' | 'order_fulfilled' | 'role_switched';
  actor: string;
  role: UserRole;
  target: string;
  details: string;
}

export interface BannerSlide {
  id: string;
  tagAr: string;
  tagEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  imageUrl: string;
  productOverlayUrl?: string;
  categoryTarget: Category;
  hasAnimationEffect?: boolean;
  ctaTextAr?: string;
  ctaTextEn?: string;
}

export interface PosSaleRecord {
  id: string;
  receiptNumber: string;
  cashierName: string;
  items: {
    product: Product;
    variant: ProductVariant;
    quantity: number;
    unitPriceUSD: number;
  }[];
  totalUSD: number;
  paymentMethod: 'cash' | 'card' | 'instapay';
  timestamp: string;
}

export interface PriceChangeRequest {
  id: string;
  productId: string;
  oldPriceUSD: number;
  newPriceUSD: number;
  reason: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}
