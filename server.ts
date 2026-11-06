import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // AI Extraction Endpoint
  app.post('/api/ai/extract-product', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: 'URL is required' });

      console.log(`[AI] Extracting product from: ${url}`);

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `You are a Senior Catalog Manager for ZOSS Smart Electronics. 
        Extract detailed product information from this URL: ${url}. 
        This is likely from a marketplace like Temu or AliExpress. 
        
        Rules:
        1. Always translate and optimize for high-end conversion in Arabic.
        2. Map the product to the best fitting category: ['phone_accessories', 'earphones', 'smartwatches']. If it's a gift set with a watch, use 'smartwatches'.
        3. Create professional, non-generic descriptions.
        4. If technical specs are available, extract them accurately.
        5. Generate at least one primary color variant.
        
        Required JSON structure:
        - titleAr: Compelling Arabic title.
        - titleEn: Compelling English title.
        - descriptionAr: Detailed technical Arabic description.
        - descriptionEn: Detailed English description.
        - priceUSD: Numeric price.
        - category: String.
        - mainImageUrl: The absolute URL to the primary product image found on the page.
        - brandCompatibility: string[] (e.g. ['Universal', 'Apple']).
        - technicalSpecs: { labelAr: string, labelEn: string, value: string }[]
        - variants: { nameAr: string, nameEn: string, colorHex: string }[]`,
        config: {
          tools: [{ urlContext: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titleAr: { type: Type.STRING },
              titleEn: { type: Type.STRING },
              descriptionAr: { type: Type.STRING },
              descriptionEn: { type: Type.STRING },
              priceUSD: { type: Type.NUMBER },
              category: { type: Type.STRING },
              mainImageUrl: { type: Type.STRING },
              brandCompatibility: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              technicalSpecs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    labelAr: { type: Type.STRING },
                    labelEn: { type: Type.STRING },
                    value: { type: Type.STRING }
                  }
                }
              },
              variants: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    nameAr: { type: Type.STRING },
                    nameEn: { type: Type.STRING },
                    colorHex: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["titleAr", "titleEn", "priceUSD", "category"]
          }
        }
      });

      const extractedData = JSON.parse(response.text || '{}');
      res.json(extractedData);
    } catch (error: any) {
      console.error('[AI Extract Error]', error);
      res.status(500).json({ error: error.message || 'Failed to extract data' });
    }
  });

  // AI Product Refinement Endpoint (SEO & Marketing)
  app.post('/api/ai/refine-product', async (req, res) => {
    try {
      const { titleEn, titleAr, currentDesc, stylePreset, styleContext } = req.body;
      
      console.log(`[AI] Refining product: ${titleEn} with style: ${stylePreset}`);

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `You are a Senior SEO & Marketing Strategist for ZOSS Smart Electronics.
        Style Preset: "${stylePreset}"
        Style Context / Mood: "${styleContext}"
        
        Product Information:
        - Title (EN): ${titleEn}
        - Title (AR): ${titleAr}
        - Current Description: ${currentDesc}
        
        Guidelines:
        1. Refine the Arabic title for high-end SEO (ZOSS Smart Electronics brand tone).
        2. Rewrite the Arabic description into a compelling 3-4 sentence marketing story that reflects the "${stylePreset}" mood (e.g., if Cyberpunk, use tech-heavy/neon vocabulary; if Titanium, use premium/minimalist words).
        3. Generate a list of relevant SEO keywords in Arabic.
        4. Create a URL-friendly English slug.
        5. Write a professional English meta description (max 160 characters).
        
        Required Output (JSON):
        - refinedTitleAr
        - refinedDescriptionAr
        - seoKeywordsAr
        - slug
        - metaDescriptionEn`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              refinedTitleAr: { type: Type.STRING },
              refinedDescriptionAr: { type: Type.STRING },
              seoKeywordsAr: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              slug: { type: Type.STRING },
              metaDescriptionEn: { type: Type.STRING }
            },
            required: ["refinedTitleAr", "refinedDescriptionAr", "slug"]
          }
        }
      });

      const refinedData = JSON.parse(response.text || '{}');
      res.json(refinedData);
    } catch (error: any) {
      console.error('[AI Refine Error]', error);
      res.status(500).json({ error: error.message || 'Failed to refine product' });
    }
  });

  // AI Image Processing Endpoint
  app.post('/api/ai/process-image', async (req, res) => {
    try {
      const { base64Image, prompt } = req.body;
      if (!base64Image) return res.status(400).json({ error: 'Image data is required' });

      console.log(`[AI] Processing image with prompt: ${prompt}`);

      // Extract MIME type and pure base64
      const mimeMatch = base64Image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!mimeMatch) return res.status(400).json({ error: 'Invalid image format' });
      
      const mimeType = mimeMatch[1];
      const data = mimeMatch[2];

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: {
          parts: [
            { inlineData: { data, mimeType } },
            { text: `Re-render this product image with a high-end commercial aesthetic. ${prompt}. 
              Make it look like a professional studio product shot.
              Keep the core product recognizable but enhance the environment, lighting, and textures.
              Output only the generated image.` }
          ]
        }
      });

      let generatedImageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const base64Str = part.inlineData.data;
          const mime = part.inlineData.mimeType ?? "image/png";
          generatedImageUrl = `data:${mime};base64,${base64Str}`;
          break;
        }
      }

      if (!generatedImageUrl) {
        throw new Error('AI failed to generate an image');
      }

      res.json({ processedImageUrl: generatedImageUrl });
    } catch (error: any) {
      console.error('[AI Image Process Error]', error);
      res.status(500).json({ error: error.message || 'Failed to process image' });
    }
  });

  // AI Description Enhancement Endpoint
  app.post('/api/ai/enhance-description', async (req, res) => {
    try {
      const { titleAr, titleEn, currentDesc } = req.body;
      
      console.log(`[AI] Enhancing description for: ${titleEn}`);

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `You are a professional Tech Copywriter. 
        Enhance this product description for ZOSS Smart Electronics. 
        
        Product: ${titleEn} (${titleAr})
        Current: ${currentDesc}
        
        Rules:
        1. Write a professional, technical, and compelling description in Arabic.
        2. Focus on premium quality, durability, and high-tech features.
        3. Use a tone suitable for a high-end electronics store.
        4. Keep it concise but information-dense.
        5. Return only the enhanced Arabic text.`,
      });

      res.json({ enhancedDesc: response.text });
    } catch (error: any) {
      console.error('[AI Enhance Error]', error);
      res.status(500).json({ error: error.message || 'Failed to enhance description' });
    }
  });

  // Vite Middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
}

startServer();
