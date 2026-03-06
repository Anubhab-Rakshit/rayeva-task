const Ajv = require("ajv");

const ajv = new Ajv({ allErrors: true });

// Schema based on user requirement:
// { "primary_category": "string", "sub_categories": ["string"], "seo_tags": ["string"], "sustainability_filters":["string"], "confidence": {"primary_category": number, "tags": number}, "explanations":{"primary_category":"string"} }
const aiOutputSchema = {
    type: "object",
    properties: {
        primary_category: { type: "string" },
        sub_categories: {
            type: "array",
            items: { type: "string" }
        },
        seo_tags: {
            type: "array",
            items: { type: "string" },
            minItems: 5,
            maxItems: 10
        },
        sustainability_filters: {
            type: "array",
            items: { type: "string" }
        },
        confidence: {
            type: "object",
            properties: {
                primary_category: { type: "number", minimum: 0, maximum: 1 },
                tags: { type: "number", minimum: 0, maximum: 1 }
            },
            required: ["primary_category", "tags"]
        },
        explanations: {
            type: "object",
            properties: {
                primary_category: { type: "string" }
            },
            required: ["primary_category"]
        },
        product_id: { type: "string" },
        generated_at: { type: "string" },
        flag: { type: "string" }
    },
    required: ["primary_category", "sub_categories", "seo_tags", "sustainability_filters", "confidence", "explanations"],
    additionalProperties: false
};

const validateAiOutput = ajv.compile(aiOutputSchema);

/**
 * Validates the output from the generated JSON against the rigid schema.
 * @param {Object} data 
 * @returns {Object} result - Formatted validation result
 */
function validateData(data) {
    const valid = validateAiOutput(data);
    if (!valid) {
        return {
            valid: false,
            errors: validateAiOutput.errors
        };
    }
    return { valid: true };
}

module.exports = {
    validateData,
    aiOutputSchema
};
