import { DeviceModelOption, DeviceBrand, ElectronicsCategory } from './types/product';

// ==============================================================================
// Constants & Configuration: ZOSS Smart Electronics
// ==============================================================================

export const SUPPORTED_DEVICE_BRANDS: { id: DeviceBrand; nameAr: string; nameEn: string; icon: string }[] = [
  { id: 'apple', nameAr: 'أبل (Apple)', nameEn: 'Apple', icon: '🍎' },
  { id: 'samsung', nameAr: 'سامسونج (Samsung)', nameEn: 'Samsung', icon: '📱' },
  { id: 'huawei', nameAr: 'هواوي (Huawei)', nameEn: 'Huawei', icon: '⚡' },
  { id: 'xiaomi', nameAr: 'شاومي (Xiaomi)', nameEn: 'Xiaomi', icon: '🟠' },
  { id: 'google', nameAr: 'جوجل (Google Pixel)', nameEn: 'Google Pixel', icon: '🌐' },
  { id: 'universal', nameAr: 'توافق عام (Universal)', nameEn: 'Universal', icon: '🔌' },
];

export const DEVICE_MODELS_CATALOG: DeviceModelOption[] = [
  // Apple Phones
  { id: 'apple-ip16pm', brand: 'apple', modelAr: 'iPhone 16 Pro Max', modelEn: 'iPhone 16 Pro Max', category: 'phone', releaseYear: 2024, connectorType: 'usb_c' },
  { id: 'apple-ip16p', brand: 'apple', modelAr: 'iPhone 16 Pro', modelEn: 'iPhone 16 Pro', category: 'phone', releaseYear: 2024, connectorType: 'usb_c' },
  { id: 'apple-ip16', brand: 'apple', modelAr: 'iPhone 16 / 16 Plus', modelEn: 'iPhone 16 / 16 Plus', category: 'phone', releaseYear: 2024, connectorType: 'usb_c' },
  { id: 'apple-ip15pm', brand: 'apple', modelAr: 'iPhone 15 Pro Max', modelEn: 'iPhone 15 Pro Max', category: 'phone', releaseYear: 2023, connectorType: 'usb_c' },
  { id: 'apple-ip15p', brand: 'apple', modelAr: 'iPhone 15 Pro', modelEn: 'iPhone 15 Pro', category: 'phone', releaseYear: 2023, connectorType: 'usb_c' },
  { id: 'apple-ip14pm', brand: 'apple', modelAr: 'iPhone 14 Pro Max', modelEn: 'iPhone 14 Pro Max', category: 'phone', releaseYear: 2022, connectorType: 'lightning' },

  // Samsung Phones
  { id: 'sam-s25u', brand: 'samsung', modelAr: 'Galaxy S25 Ultra', modelEn: 'Galaxy S25 Ultra', category: 'phone', releaseYear: 2025, connectorType: 'usb_c' },
  { id: 'sam-s25p', brand: 'samsung', modelAr: 'Galaxy S25 / S25+', modelEn: 'Galaxy S25 / S25+', category: 'phone', releaseYear: 2025, connectorType: 'usb_c' },
  { id: 'sam-s24u', brand: 'samsung', modelAr: 'Galaxy S24 Ultra', modelEn: 'Galaxy S24 Ultra', category: 'phone', releaseYear: 2024, connectorType: 'usb_c' },
  { id: 'sam-zfold6', brand: 'samsung', modelAr: 'Galaxy Z Fold 6', modelEn: 'Galaxy Z Fold 6', category: 'phone', releaseYear: 2024, connectorType: 'usb_c' },

  // Smartwatches
  { id: 'apple-wultra2', brand: 'apple', modelAr: 'Apple Watch Ultra 2 (49mm)', modelEn: 'Apple Watch Ultra 2 (49mm)', category: 'watch', releaseYear: 2023, connectorType: 'magsafe' },
  { id: 'apple-ws10', brand: 'apple', modelAr: 'Apple Watch Series 10 (46mm/42mm)', modelEn: 'Apple Watch Series 10', category: 'watch', releaseYear: 2024, connectorType: 'magsafe' },
  { id: 'sam-wultra', brand: 'samsung', modelAr: 'Galaxy Watch Ultra (47mm)', modelEn: 'Galaxy Watch Ultra', category: 'watch', releaseYear: 2024, connectorType: 'wireless' },
  { id: 'sam-w7', brand: 'samsung', modelAr: 'Galaxy Watch 7 (44mm/40mm)', modelEn: 'Galaxy Watch 7', category: 'watch', releaseYear: 2024, connectorType: 'wireless' },

  // Audio & Earbuds
  { id: 'apple-app2', brand: 'apple', modelAr: 'AirPods Pro 2 (USB-C / MagSafe)', modelEn: 'AirPods Pro 2 (USB-C)', category: 'audio', releaseYear: 2023, connectorType: 'magsafe' },
  { id: 'apple-apmax', brand: 'apple', modelAr: 'AirPods Max (USB-C)', modelEn: 'AirPods Max', category: 'audio', releaseYear: 2024, connectorType: 'usb_c' },
  { id: 'sam-buds3pro', brand: 'samsung', modelAr: 'Galaxy Buds3 Pro', modelEn: 'Galaxy Buds3 Pro', category: 'audio', releaseYear: 2024, connectorType: 'usb_c' },
  { id: 'universal-anc', brand: 'universal', modelAr: 'سماعات بلوتوث عامة (Universal ANC)', modelEn: 'Universal ANC Headsets', category: 'audio', releaseYear: 2024, connectorType: 'wireless' },
];

export const ELECTRONICS_CATEGORIES: { id: ElectronicsCategory; nameAr: string; nameEn: string; icon: string }[] = [
  { id: 'phone_accessories', nameAr: 'إكسسوارات الهواتف وحمايات الشاشة', nameEn: 'Phone Accessories & Cases', icon: '📱' },
  { id: 'earphones', nameAr: 'سماعات الصوت وعزل الضوضاء ANC', nameEn: 'Studio Audio & ANC Earphones', icon: '🎧' },
  { id: 'smartwatches', nameAr: 'الساعات الذكية وأساور التيتانيوم', nameEn: 'Smartwatches & Titanium Bands', icon: '⌚' },
  { id: 'chargers_cables', nameAr: 'شواحن GaN السريعة ومنصات MagSafe', nameEn: 'GaN Fast Chargers & MagSafe Hubs', icon: '⚡' },
  { id: 'gaming_gear', nameAr: 'ملحقات ألعاب الهواتف وبنوك الطاقة', nameEn: 'Mobile Gaming Gear & PowerBanks', icon: '🎮' },
  { id: 'smart_home', nameAr: 'الأنظمة الذكية والمستشعرات اللاسلكية', nameEn: 'Smart Sensors & Wireless Hubs', icon: '🏠' },
];

export const AI_ELECTRONICS_PROMPT_PRESETS = [
  {
    id: 'cyberpunk-neon',
    nameAr: 'استوديو تقني سيبراني (Cyberpunk Neon)',
    nameEn: 'Cyberpunk Neon Studio',
    promptSnippet: 'Professional commercial photography of premium smart electronics, dramatic cyan and amber rim lighting, dark reflective obsidian pedestal, glowing magnetic field, 8k sharp focus, ultra-detailed textures, octane render, clean product advertising aesthetic.',
  },
  {
    id: 'minimalist-titanium',
    nameAr: 'استوديو التيتانيوم النقي (Minimalist Titanium)',
    nameEn: 'Minimalist Titanium Clean',
    promptSnippet: 'High-end commercial product showcase of aerospace grade titanium smartwatch and accessories, architectural minimalist concrete and frosted glass background, soft diffused studio daylight, precision laser engravings, elegant luxury tech catalog look.',
  },
  {
    id: 'exploded-engineering',
    nameAr: 'عرض تفصيلي هندسي (Internal Engineering View)',
    nameEn: 'Exploded Technical Architecture',
    promptSnippet: 'Exploded architectural view of smart wireless electronics showing internal copper induction coils, GaN microchips, neodymium magnets, aerospace aluminum casing, illuminated circuit paths, blueprint technical style, ultra crisp focus.',
  },
  {
    id: 'magsafe-levitation',
    nameAr: 'طفو مغناطيسي لشواحن MagSafe (Magnetic Levitation)',
    nameEn: 'Magnetic Levitation Staging',
    promptSnippet: '3-in-1 magnetic wireless fast charger with hovering smartphone, floating titanium watch, and earbuds case, futuristic clean lab background, soft ambient neon blue glow, levitation effect, high-end Apple ecosystem presentation, 8k.',
  },
];

export const WARRANTY_PERIODS = [
  { months: 12, labelAr: '12 شهراً (ضمان ذهبي شامل)', labelEn: '12 Months (Gold Direct Warranty)' },
  { months: 18, labelAr: '18 شهراً (ضمان استبدال مباشر)', labelEn: '18 Months (Instant Replacement)' },
  { months: 24, labelAr: '24 شهراً (ضمان سنتين رسمي)', labelEn: '24 Months (Extended Coverage)' },
];
