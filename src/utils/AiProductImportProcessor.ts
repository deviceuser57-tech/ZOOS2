import { Product } from '../types';

/**
 * AiProductImportProcessor: Orchestrates the extraction of product data from supplier URLs.
 * Specifically tuned for marketplaces like Temu and AliExpress via server-side urlContext.
 */
export class AiProductImportProcessor {
  /**
   * Fetches raw extraction data from the backend and maps it to the Product schema.
   */
  public static async importFromUrl(url: string): Promise<Partial<Product>> {
    try {
      const res = await fetch('/api/ai/extract-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Robust mapping to the Product schema (src/types.ts)
      const mappedProduct: Partial<Product> = {
        titleAr: data.titleAr || '',
        titleEn: data.titleEn || '',
        descriptionAr: data.descriptionAr || '',
        descriptionEn: data.descriptionEn || '',
        priceUSD: Number(data.priceUSD) || 0,
        category: (data.category as any) || 'phone_accessories',
        brandCompatibility: (data.brandCompatibility as string[]) || ['Universal'],
        specs: (data.technicalSpecs as any[]) || [
          { labelAr: 'الضمان', labelEn: 'Warranty', value: '18 شهراً' },
          { labelAr: 'الجودة', labelEn: 'Quality Grade', value: 'Original Spec A+' },
        ],
        variants: (data.variants as any[])?.map((v, idx) => ({
          id: `v${idx + 1}`,
          nameAr: v.nameAr || 'اللون الأساسي',
          nameEn: v.nameEn || 'Primary Color',
          colorHex: v.colorHex || '#18181b',
          inStock: true,
        })) || [
          { id: 'v1', nameAr: 'أسود تيتانيوم', nameEn: 'Titanium Black', colorHex: '#18181b', inStock: true }
        ],
        imageUrl: data.mainImageUrl || '',
        // Strategic defaults for Dropshipping
        rating: 4.9,
        reviewsCount: Math.floor(Math.random() * 60) + 15,
        deliveryDaysMin: 3,
        deliveryDaysMax: 7,
        sourceType: 'dropshipping_direct',
        supplierPlatform: url.includes('temu.com') ? 'FactoryDirect' : 'CJDropshipping',
        supplierName: url.includes('temu.com') ? 'Temu Global Vendor' : 'Apex Tech Shenzhen',
        isFeatured: true,
        isWinningProduct: true,
      };

      console.log('[AiImportProcessor] Mapped product data successfully:', mappedProduct.titleEn);
      return mappedProduct;
    } catch (error: any) {
      console.error('[AiImportProcessor] Error importing product:', error.message);
      throw error;
    }
  }
}
