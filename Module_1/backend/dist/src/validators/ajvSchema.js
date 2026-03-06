"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiOutputSchema = void 0;
exports.validateData = validateData;
const ajv_1 = __importDefault(require("ajv"));
const logger_1 = require("../utils/logger");
const ajv = new ajv_1.default({ allErrors: true });
exports.aiOutputSchema = {
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
const validateAiOutput = ajv.compile(exports.aiOutputSchema);
function validateData(data) {
    const valid = validateAiOutput(data);
    if (!valid) {
        logger_1.logger.warn("Schema validation failed", { errors: validateAiOutput.errors });
        return {
            valid: false,
            errors: validateAiOutput.errors
        };
    }
    return { valid: true };
}
