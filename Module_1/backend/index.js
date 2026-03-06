const { preprocessProduct } = require("./preprocess");
const { generateAiMetadata } = require("./llm");
const { validateData } = require("./schema");
const { canonicalizeTags, applySustainabilityLogic } = require("./business_rules");
const { insertProduct, insertAiLog } = require("./db");

/**
 * Main service endpoint for Module 1.
 * Given product metadata, returns a validated JSON.
 * @param {Object} product
 */
async function processProductMetadata(product) {
    try {
        console.log(`\n--- Starting generation for Product ID: ${product.id} ---`);

        // 1. Preprocess
        const cleanProd = preprocessProduct(product);
        console.log("1. Preprocessing complete.");

        // 2. LLM Step
        const llmResult = await generateAiMetadata(cleanProd);
        let generatedMeta = llmResult.response;
        console.log("2. LLM Generation complete.");

        // 3. Post-processing & Business Logic
        generatedMeta.seo_tags = canonicalizeTags(generatedMeta.seo_tags);

        const currentConfidence = generatedMeta.confidence?.tags || 0.8;
        const sustainabilityLogic = applySustainabilityLogic(cleanProd, generatedMeta.sustainability_filters, currentConfidence);

        generatedMeta.sustainability_filters = sustainabilityLogic.finalFilters;
        generatedMeta.confidence.tags = sustainabilityLogic.adjustedConfidence;

        if (sustainabilityLogic.needsManualReview) {
            generatedMeta.flag = "needs_manual_review";
        }

        // Ensure timestamp is added
        generatedMeta.generated_at = new Date().toISOString();
        generatedMeta.product_id = product.id;
        console.log("3. Business Rules executed.");

        // 4. Validate with AJV
        const validation = validateData(generatedMeta);
        console.log(`4. AJV Validation passed: ${validation.valid}`);

        if (!validation.valid) {
            console.error("Schema errors:", validation.errors);
            // Optionally flag for manual review
            generatedMeta.flag = "validation_failed";
        }

        // 5. Simulate Database Store
        insertProduct({
            ...cleanProd,
            generated_meta: generatedMeta
        });

        insertAiLog({
            product_id: product.id,
            module: "AI-Auto-Category",
            prompt: llmResult.prompt,
            response: generatedMeta,
            model: llmResult.model,
            validated: validation.valid
        });
        console.log("5. Logged to DB.");

        return generatedMeta;

    } catch (error) {
        console.error("Pipeline Error processing product:", error);
        throw error;
    }
}

module.exports = {
    processProductMetadata
};
