// ==============================================================================
// Product Domain Types: ZOSS Smart Electronics
// ==============================================================================

export type DeviceBrand = 'apple' | 'samsung' | 'huawei' | 'xiaomi' | 'google' | 'universal';

export type ElectronicsCategory = 
  | 'phone_accessories' 
  | 'earphones' 
  | 'smartwatches' 
  | 'chargers_cables' 
  | 'gaming_gear' 
  | 'smart_home';

export interface DeviceModelOption {
  id: string;
  brand: DeviceBrand;
  modelAr: string;
  modelEn: string;
  category: 'phone' | 'watch' | 'audio' | 'tablet';
  releaseYear: number;
  connectorType?: 'usb_c' | 'lightning' | 'magsafe' | 'qi2' | 'wireless';
}

export interface ElectronicSpecs {
  chargingWattage?: number;
  wirelessChargingStandard?: 'MagSafe' | 'Qi2' | 'Qi' | 'None';
  noiseCancellationType?: 'Active ANC (-45dB)' | 'Hybrid ANC' | 'ENC' | 'Passive';
  batteryLifeHours?: number;
  bluetoothVersion?: '5.4' | '5.3' | '5.2';
  waterResistanceRating?: 'IP68' | 'IP67' | '5ATM' | 'Splash-proof';
  primaryMaterial?: 'Titanium Grade 2' | '1500D Carbon Fiber' | 'Tempered Glass' | 'Aircraft Aluminum';
}

export interface SerialNumberRecord {
  id: string;
  productId: string;
  variantId?: string;
  serialNumber: string;
  imei?: string;
  status: 'in_stock' | 'sold' | 'rma_defective';
  warrantyMonths: number;
  activatedAt?: string;
  warrantyExpiresAt?: string;
}

export interface AdvancedProductVariant {
  id: string;
  nameAr: string;
  nameEn: string;
  colorHex: string;
  colorNameAr: string;
  colorNameEn: string;
  modelCompatibility?: string;
  extraPriceUSD?: number;
  inStock: boolean;
  stockQuantity: number;
  serialNumbers?: string[];
}
