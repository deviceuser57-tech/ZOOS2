import { CartItem, Order, CurrencyCode } from '../types';

export interface CheckoutValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface CheckoutTotals {
  subtotalUSD: number;
  shippingUSD: number;
  taxUSD: number;
  discountUSD: number;
  totalUSD: number;
}

export class SecureCheckoutProcessor {
  private static TAX_RATE = 0.15; // 15% VAT for region
  private static FREE_SHIPPING_THRESHOLD = 500; // SAR ~133 USD

  /**
   * Validates customer shipping details
   */
  public static validateShippingDetails(details: {
    name: string;
    phone: string;
    city: string;
    address: string;
  }): CheckoutValidationResult {
    const errors: Record<string, string> = {};

    if (!details.name || details.name.length < 3) {
      errors.name = 'Full name is required (min 3 characters)';
    }

    if (!details.phone || !/^\+?[0-9]{8,15}$/.test(details.phone)) {
      errors.phone = 'Valid phone number is required';
    }

    if (!details.city) {
      errors.city = 'City selection is required';
    }

    if (!details.address || details.address.length < 10) {
      errors.address = 'Detailed shipping address is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Calculates real-time shipping costs based on location and cart subtotal
   */
  public static calculateShipping(city: string, subtotalUSD: number): number {
    // If subtotal is high enough, shipping is free
    if (subtotalUSD >= this.FREE_SHIPPING_THRESHOLD / 3.75) {
      return 0;
    }

    // Basic location-based logic
    const premiumCities = ['Riyadh', 'Dubai', 'Abu Dhabi', 'Kuwait City'];
    if (premiumCities.includes(city)) {
      return 5.00; // ~18.75 SAR
    }

    return 10.00; // ~37.5 SAR for other regions
  }

  /**
   * Calculates final totals including taxes and discounts
   */
  public static calculateTotals(
    items: CartItem[],
    city: string,
    couponCode?: string
  ): CheckoutTotals {
    const subtotalUSD = items.reduce((sum, item) => {
      const unitPrice = item.product.priceUSD + (item.selectedVariant.extraPriceUSD || 0);
      return sum + (unitPrice * item.quantity);
    }, 0);

    const shippingUSD = this.calculateShipping(city, subtotalUSD);
    
    // Simple coupon logic
    let discountUSD = 0;
    if (couponCode === 'ZOSS10') {
      discountUSD = subtotalUSD * 0.10;
    } else if (couponCode === 'WELCOME25') {
      discountUSD = 25.00;
    }

    const taxableAmount = Math.max(0, subtotalUSD - discountUSD);
    const taxUSD = taxableAmount * this.TAX_RATE;
    const totalUSD = taxableAmount + taxUSD + shippingUSD;

    return {
      subtotalUSD,
      shippingUSD,
      taxUSD,
      discountUSD,
      totalUSD,
    };
  }

  /**
   * Simulates the full order creation flow
   */
  public static async processOrder(
    customerDetails: {
      name: string;
      phone: string;
      email?: string;
      city: string;
      address: string;
    },
    items: CartItem[],
    paymentMethod: Order['paymentMethod'],
    currency: CurrencyCode,
    couponCode?: string
  ): Promise<Order> {
    // 1. Final validation
    const validation = this.validateShippingDetails({
      name: customerDetails.name,
      phone: customerDetails.phone,
      city: customerDetails.city,
      address: customerDetails.address,
    });

    if (!validation.isValid) {
      throw new Error('Invalid shipping details');
    }

    // 2. Final total calculation
    const totals = this.calculateTotals(items, customerDetails.city, couponCode);

    // 3. Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 4. Construct Order object
    const order: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      orderNumber: `ZE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      customerEmail: customerDetails.email,
      city: customerDetails.city,
      shippingAddress: customerDetails.address,
      fulfillmentType: 'courier_delivery',
      paymentMethod: paymentMethod,
      paymentStatus: 'pending',
      items: items,
      fulfillmentGroups: [], // Will be populated by createOrder in context
      subtotalUSD: totals.subtotalUSD,
      shippingFeeUSD: totals.shippingUSD,
      totalUSD: totals.totalUSD,
      supplierCostUSD: items.reduce((sum, item) => sum + (item.product.supplierCostUSD * item.quantity), 0),
      profitUSD: 0,
      currency: currency,
      status: 'pending_supplier',
      trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      supplierName: items[0]?.product.supplierName || 'ZOSS Network',
    };

    order.profitUSD = order.totalUSD - order.supplierCostUSD;

    return order;
  }
}
