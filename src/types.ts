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
  seoKeywordsAr?: string[];
  slug?: string;
  metaDescriptionAr?: string;
  metaDescriptionEn?: string;
  compatibilityType?: 'magsafe_compatible' | 'universal_qi' | 'wired_only' | 'bluetooth_multipoint';
}

export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

export interface FulfillmentGroup {
  id: string;
  source: 'x_mall_stock' | 'dropship_supplier';
  supplierName?: string;
  items: CartItem[];
  status: Order['status'];
  trackingNumber?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // New: Display order number
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string;
  shippingAddress: string;
  fulfillmentType: 'courier_delivery' | 'click_and_collect_xmall';
  paymentMethod: 'cod' | 'paymob_card' | 'instapay' | 'vodafone_cash' | 'pos_cash_xmall' | 'pos_card_xmall' | 'apple_pay';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  items: CartItem[];
  fulfillmentGroups: FulfillmentGroup[]; // New: Split fulfillment support
  subtotalUSD: number;
  shippingFeeUSD: number;
  totalUSD: number;
  supplierCostUSD: number;
  profitUSD: number;
  currency: CurrencyCode;
  status: 'draft' | 'pending_payment' | 'confirmed' | 'processing' | 'partially_fulfilled' | 'fulfilled' | 'delivered' | 'cancelled' | 'pending_supplier' | 'dispatched_supplier' | 'ready_for_pickup' | 'in_transit' | 'out_for_delivery';
  trackingNumber: string; // Primary tracking
  supplierTrackingNumber?: string;
  supplierName?: string;
  createdAt: string;
  updatedAt: string;
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
export interface TransactionalOutboxEvent {
  id: string;
  eventType: 'STOCK_RESERVED' | 'ORDER_PAID' | 'FULFILLMENT_REQUESTED' | 'TRACKING_UPDATED' | 'PAYMENT_COMPLETED';
  aggregateType: 'ORDER' | 'STOCK' | 'CUSTOMER';
  aggregateId: string;
  payload: any;
  status: 'pending' | 'processed' | 'failed';
  retryCount: number;
  createdAt: string;
  processedAt?: string;
}
