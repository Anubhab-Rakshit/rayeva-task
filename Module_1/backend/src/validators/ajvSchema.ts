import Ajv, { JSONSchemaType } from "ajv";
import { GeneratedMetadata } from "../interfaces/models";
import { logger } from "../utils/logger";

const ajv = new Ajv({ allErrors: true });

export const aiOutputSchema: JSONSchemaType<GeneratedMetadata> = {
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
        flag: { type: "string", nullable: true },
        product_id: { type: "string", nullable: true },
        generated_at: { type: "string", nullable: true }
    },
    required: ["primary_category", "sub_categories", "seo_tags", "sustainability_filters", "confidence", "explanations"],
    additionalProperties: false
};

const validateAiOutput = ajv.compile(aiOutputSchema);

export function validateData(data: any): { valid: boolean; errors?: any } {
    const valid = validateAiOutput(data);
    if (!valid) {
        logger.warn("Schema validation failed", { errors: validateAiOutput.errors });
        return {
            valid: false,
            errors: validateAiOutput.errors
        };
    }
    return { valid: true };
}
