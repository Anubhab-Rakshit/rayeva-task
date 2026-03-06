require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const { getAllowedCategories, getAllowedSustainabilityTags } = require("./db");
const { aiOutputSchema } = require("./schema");

/**
 * Prepares the prompt for the LLM.
 * @param {Object} product 
 * @returns {string} The formatted system & user prompt combo
 */
function buildPrompt(product) {
    const allowedCategories = getAllowedCategories();
    const allowedFilters = getAllowedSustainabilityTags();

    const systemPrompt = `You are an assistant that MUST return JSON exactly matching the provided schema. 
Use the product title, description, and image cues (if provided via attributes) to pick the best primary_category from the provided list, suggest sub_categories, and generate 5-10 SEO tags and sustainability filters. Include confidence (0-1). If unsure, choose the safest option and set confidence < 0.6.

Schema:
${JSON.stringify(aiOutputSchema, null, 2)}

Allowed primary categories: [${allowedCategories.join(", ")}]
Allowed sustainability filters: [${allowedFilters.join(", ")}]
`;

    const userPrompt = `Product input:
Title: ${product.title}
Description: ${product.description}
Attributes: ${JSON.stringify(product.attributes || {})}

Generate the JSON response matching the schema.`;

    return systemPrompt + "\n\n" + userPrompt;
}

/**
 * Calls the LLM to process the product.
 * Returns a JSON object matching the schema.
 * @param {Object} product 
 */
async function generateAiMetadata(product) {
    const prompt = buildPrompt(product);

    if (process.env.GEMINI_API_KEY) {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", generationConfig: { responseMimeType: "application/json" } });

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            return {
                prompt,
                response: JSON.parse(responseText),
                model: "gemini-1.5-pro"
            };
        } catch (error) {
            console.error("LLM Generation Failed. Check key or quota.", error);
            throw error;
        }
    } else {
        // Fallback mock if no API key is set
        console.warn("[LLM] GEMINI_API_KEY is not set! Using a mock generated JSON for demonstration...");
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

module.exports = {
    buildPrompt,
    generateAiMetadata
};
