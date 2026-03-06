import { GoogleGenerativeAI } from "@google/generative-ai";
import { dbRepository } from "../database/supabaseRepository";
import { aiOutputSchema } from "../validators/ajvSchema";
import { ProductInput, GeneratedMetadata } from "../interfaces/models";
import { logger } from "../utils/logger";

export class AiService {

    private buildPrompt(product: ProductInput): string {
        const allowedCategories = dbRepository.getAllowedCategories();
        const allowedFilters = dbRepository.getAllowedSustainabilityTags();

        const systemPrompt = `You are an assistant that MUST return JSON exactly matching the provided schema. 
Use the product title, description, and image cues (if provided via attributes) to pick the best primary_category from the provided list, suggest sub_categories, and generate 5-10 SEO tags and sustainability filters.

For sustainability_filters: 
- Only choose filters from the "Allowed sustainability filters" list.
- If the description mentions "organic", "bio", "natural growing", choose "organic".
- If it mentions "handpicked", "small estates", or specific origin, consider "locally_sourced".
- If it mentions "biodegradable", "compostable", or "plastic-free packaging", choose the corresponding tags.
- Use your best judgment based on industry standards for the product type.

Include confidence (0-1). If unsure, choose the safest option and set confidence < 0.6.

Schema:
${JSON.stringify(aiOutputSchema, null, 2)}

Allowed primary categories: [${allowedCategories.join(", ")}]
Allowed sustainability filters: [${allowedFilters.join(", ")}]
${product.targetLanguage ? `IMPORTANT: You MUST translate ALL generated content (categories, tags, etc.) to: ${product.targetLanguage}. The JSON keys must remain exactly as defined in the schema.` : ''}
`;

        const userPrompt = `Product input:
Title: ${product.title}
Description: ${product.description}
Attributes: ${JSON.stringify(product.attributes || {})}

Generate the JSON response matching the schema.`;

        return `${systemPrompt}\n\n${userPrompt}`;
    }

    public async generateMetadata(product: ProductInput): Promise<{ prompt: string; response: GeneratedMetadata; model: string }> {
        const prompt = this.buildPrompt(product);

        if (process.env.GEMINI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({
                    model: "gemini-2.5-flash",
                    generationConfig: { responseMimeType: "application/json" }
                });

                logger.info(`Sending prompt to Gemini for product ${product.id}`);
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();

                return {
                    prompt,
                    response: JSON.parse(responseText),
                    model: "gemini-2.5-flash"
                };
            } catch (error) {
                logger.error("LLM Generation Failed. Using fallback...", error);
                throw error;
            }
        } else {
            logger.warn("GEMINI_API_KEY is not set! Using a mock generated JSON.");
            return {
                prompt,
                response: {
                    primary_category: "Beverages",
                    sub_categories: ["tea", "masala tea"],
                    seo_tags: ["masala chai", "organic tea", "hand-blended masala", "Indian spices tea", "premium loose leaf"],
                    sustainability_filters: ["locally_sourced", "compostable_packaging"],
                    confidence: { primary_category: 0.92, tags: 0.88 },
                    explanations: { primary_category: "Title contains 'Masala', description mentions 'Premium tea' and packaging." }
                },
                model: "mock-model"
            };
        }
    }

    public async extractFromImage(imageBuffer: Buffer, mimeType: string): Promise<any> {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `Analyze this product image and extract the following information. Return ONLY a JSON object matching this schema:
{
  "title": "A short, descriptive product title",
  "description": "A detailed product description based on visible text and features",
  "attributes": [
    {"key": "Brand", "value": "brand name if visible"},
    {"key": "Material/Ingredients", "value": "list if visible"},
    {"key": "Weight/Volume", "value": "if visible"}
  ]
}
If any information is not visible, omit it or provide a best guess.`;

        const imagePart = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType
            }
        };

        logger.info(`Sending image to Gemini Vision API`);
        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();
        return JSON.parse(responseText);
    }

    public async generateEmbedding(text: string): Promise<number[]> {
        if (!process.env.GEMINI_API_KEY) {
            logger.warn("GEMINI_API_KEY missing - returning mock embedding");
            return Array(3072).fill(Math.random());
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using the exact model alias available on this API key 
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
            const result = await model.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            logger.error("Failed to generate embedding with gemini-embedding-001", error);
            // Fallback to random embedding just to not crash the entire analyze flow if embeddings fail
            return Array(3072).fill(Math.random());
        }
    }
}

export const aiService = new AiService();
