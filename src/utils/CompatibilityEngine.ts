/**
 * CompatibilityEngine: Core logic for matching smart electronics with devices.
 * Aligning with Master Architecture Blueprint Section 5.3.
 */
export interface ProductCompatibilitySpec {
  id: string;
  name_ar: string;
  name_en: string;
  brand: string;
  category: string;
  compatibility_tags: string[];
}

export class CompatibilityEngine {
  /**
   * Filters a product catalog based on exact device compatibility.
   */
  public static filterCompatibleProducts(
    deviceModel: string, // e.g. "iPhone 16 Pro Max"
    requiredConnector?: string, // e.g. "Type-C"
    products: ProductCompatibilitySpec[] = []
  ): ProductCompatibilitySpec[] {
    const normalizedDevice = deviceModel.trim().toLowerCase();
    
    return products.filter(product => {
      // Check if any tag matches the device model (partial or exact)
      const matchesDevice = product.compatibility_tags.some(tag => 
        tag.toLowerCase().includes(normalizedDevice) || normalizedDevice.includes(tag.toLowerCase())
      );

      // Optional strict connector matching (e.g. Type-C vs Lightning)
      if (requiredConnector) {
        const matchesConnector = product.compatibility_tags.some(tag => 
          tag.toLowerCase() === requiredConnector.toLowerCase()
        );
        return matchesDevice && matchesConnector;
      }

      return matchesDevice;
    });
  }
}
