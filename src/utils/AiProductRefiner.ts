/**
 * AiProductRefiner: Specializes in generating high-conversion marketing copy and 
 * SEO-optimized metadata for smart electronics products using AI style presets.
 */
export interface RefinedContent {
  refinedTitleAr: string;
  refinedDescriptionAr: string;
  seoKeywordsAr: string[];
  slug: string;
  metaDescriptionEn: string;
}

export class AiProductRefiner {
  /**
   * Calls the backend to refine product content based on a specific style preset.
   */
  public static async refineMarketingContent(
    titleEn: string,
    titleAr: string,
    currentDesc: string,
    stylePreset: string,
    styleContext: string
  ): Promise<RefinedContent> {
    try {
      const res = await fetch('/api/ai/refine-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleEn, titleAr, currentDesc, stylePreset, styleContext }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      console.log('[AiRefiner] Refined content generated for style:', stylePreset);
      return data;
    } catch (error: any) {
      console.error('[AiRefiner] Error refining content:', error.message);
      throw error;
    }
  }
}
