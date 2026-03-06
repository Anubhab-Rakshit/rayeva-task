import Ajv, { JSONSchemaType } from "ajv";
import { GeneratedProposal } from "../interfaces/models";
import { logger } from "../utils/logger";

const ajv = new Ajv({ allErrors: true });

export const proposalOutputSchema: JSONSchemaType<Omit<GeneratedProposal, "needs_revision" | "proposal_quality_score" | "created_at" | "warnings">> = {
    type: "object",
    properties: {
        proposal_id: { type: "string" },
        client_summary: {
            type: "object",
            properties: {
                company: { type: "string" },
                industry: { type: "string" },
                budget_per_unit: { type: "number" },
                total_units: { type: "number" },
                total_budget: { type: "number" }
            },
            required: ["company", "industry", "budget_per_unit", "total_units", "total_budget"]
        },
        product_mix: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    product_name: { type: "string" },
                    category: { type: "string" },
                    unit_cost_inr: { type: "number" },
                    quantity_per_kit: { type: "number" },
                    sustainability_story: { type: "string" },
                    why_this_product: { type: "string" }
                },
                required: ["product_name", "category", "unit_cost_inr", "quantity_per_kit", "sustainability_story", "why_this_product"]
            }
        },
        budget_breakdown: {
            type: "object",
            properties: {
                products_total: { type: "number" },
                packaging: { type: "number" },
                logistics_buffer: { type: "number" },
                contingency: { type: "number" },
                grand_total: { type: "number" },
                per_unit_cost: { type: "number" },
                budget_utilization_percent: { type: "number" }
            },
            required: ["products_total", "packaging", "logistics_buffer", "contingency", "grand_total", "per_unit_cost", "budget_utilization_percent"]
        },
        impact_summary: {
            type: "object",
            properties: {
                plastic_avoided_grams_per_kit: { type: "number" },
                local_sourcing_percent: { type: "number" },
                certifications_represented: { type: "array", items: { type: "string" } },
                headline_impact_statement: { type: "string" }
            },
            required: ["plastic_avoided_grams_per_kit", "local_sourcing_percent", "certifications_represented", "headline_impact_statement"]
        },
        proposal_narrative: { type: "string" }
    },
    required: ["proposal_id", "client_summary", "product_mix", "budget_breakdown", "impact_summary", "proposal_narrative"],
    additionalProperties: false
};

const validate = ajv.compile(proposalOutputSchema);

export function validateProposalData(data: any): { valid: boolean; errors: any } {
    const isValid = validate(data);
    if (!isValid) {
        logger.error("AJV Validation Errors:", validate.errors);
    }
    return {
        valid: isValid,
        errors: validate.errors
    };
}
