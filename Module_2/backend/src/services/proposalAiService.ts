import { GoogleGenerativeAI } from "@google/generative-ai";
import { ProposalInput, GeneratedProposal } from "../interfaces/models";
import { proposalOutputSchema } from "../validators/proposalAjvSchema";
import { logger } from "../utils/logger";
import { v4 as uuidv4 } from "uuid";

export class ProposalAiService {
    private buildPrompt(input: ProposalInput): string {
        const systemPrompt = `You are a senior sustainable procurement consultant specializing in B2B gifting, corporate sustainability programs, and ESG-aligned vendor selection.

You help companies build product mixes that balance three things:
1. Commercial viability (budget adherence, margin awareness)
2. Sustainability impact (measurable, credible claims)
3. Brand alignment (tone, industry fit, recipient demographics)

Your task: given a client brief, return a single valid JSON proposal.
No explanation. No markdown. Raw JSON only.

## Business Rules:
- Total cost MUST NOT exceed budget. Build in 8-10% buffer for logistics.
- Product mix: minimum 3 products, maximum 8.
- Each product must have explicit sustainability justification.
- Allocate budget as: 70% products, 15% packaging/presentation, 10% logistics buffer, 5% contingency.
- Impact positioning must cite at least one specific measurable metric (e.g., "X grams plastic avoided per unit", "Y% local sourcing").
- If budget is under ₹500/unit, focus on high-impact low-cost items (seed kits, bamboo goods, recycled notebooks).
- If budget is ₹500-2000/unit, suggest curated hamper approach.
- If budget is above ₹2000/unit, suggest premium gifting with certification stories.

HARD RULES (never violate):
- grand_total must NEVER exceed (budget_per_unit * total_units)
- budget split: 70% products, 15% packaging, 10% logistics, 5% contingency
- 3 to 8 products only
- Every product must be real, purchasable in India
- plastic_avoided_grams_per_kit must be a realistic estimate, not zero
- proposal_narrative must be professional, 3-4 sentences, suitable for a BD email

Schema (strict):
${JSON.stringify(proposalOutputSchema, null, 2)}`;

        const userPrompt = `Client Brief:
Company: ${input.company_name}
Industry: ${input.industry}
Budget Per Unit (INR): ₹${input.budget_per_unit_inr}
Total Units: ${input.total_units}
Occasion: ${input.occasion}
${input.recipient_profile ? `Recipient Profile: ${input.recipient_profile}` : ''}

Generate the JSON response matching the schema exactly.`;

        return `${systemPrompt}\n\n${userPrompt}`;
    }

    public async generateProposal(input: ProposalInput): Promise<{ prompt: string; response: GeneratedProposal; model: string }> {
        const prompt = this.buildPrompt(input);

        if (process.env.GEMINI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({
                    model: "gemini-2.5-flash",
                    generationConfig: { responseMimeType: "application/json" }
                });

                logger.info(`Sending matching proposal request to Gemini for ${input.company_name}`);
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();

                const responseObj = JSON.parse(responseText);
                if (!responseObj.proposal_id) responseObj.proposal_id = uuidv4();

                return {
                    prompt,
                    response: responseObj as GeneratedProposal,
                    model: "gemini-2.5-flash"
                };
            } catch (error) {
                logger.error("LLM Generation Failed. Using fallback...", error);
                throw error;
            }
        } else {
            logger.warn("GEMINI_API_KEY is not set! Using a mock generated JSON.");
            const totalBudget = input.budget_per_unit_inr * input.total_units;
            return {
                prompt,
                response: {
                    proposal_id: uuidv4(),
                    client_summary: {
                        company: input.company_name,
                        industry: input.industry,
                        budget_per_unit: input.budget_per_unit_inr,
                        total_units: input.total_units,
                        total_budget: totalBudget
                    },
                    product_mix: [
                        {
                            product_name: "Bamboo Notebook",
                            category: "Stationery",
                            unit_cost_inr: 200,
                            quantity_per_kit: 1,
                            sustainability_story: "Replaces 100g of plastic polymer covers with sustainable bamboo.",
                            why_this_product: "Perfect for tech onboarding."
                        },
                        {
                            product_name: "Recycled Steel Bottle",
                            category: "Drinkware",
                            unit_cost_inr: 500,
                            quantity_per_kit: 1,
                            sustainability_story: "Saves 150g of plastic bottles annually per user.",
                            why_this_product: "High utility for remote employees."
                        },
                        {
                            product_name: "Organic Cotton Tote",
                            category: "Apparel",
                            unit_cost_inr: 150,
                            quantity_per_kit: 1,
                            sustainability_story: "Locally sourced in Tamil Nadu, 100% biodegradable.",
                            why_this_product: "Excellent canvas for your brand."
                        }
                    ],
                    budget_breakdown: {
                        products_total: 850 * input.total_units,
                        packaging: 150 * input.total_units,
                        logistics_buffer: 100 * input.total_units,
                        contingency: 50 * input.total_units,
                        grand_total: 1150 * input.total_units,
                        per_unit_cost: 1150,
                        budget_utilization_percent: 92
                    },
                    impact_summary: {
                        plastic_avoided_grams_per_kit: 250,
                        local_sourcing_percent: 85,
                        certifications_represented: ["FSC", "GOTS"],
                        headline_impact_statement: "This proposal eliminates 250g of plastic waste per recipient while supporting local carbon-neutral vendors."
                    },
                    proposal_narrative: "This curated collection aligns perfectly with your ESG goals. Every product serves a highly functional purpose while minimizing environmental footprint. We ensure premium quality and impactful storytelling for your recipients."
                },
                model: "mock-model"
            };
        }
    }

    public async refineWithAi(currentProposal: GeneratedProposal, instruction: string): Promise<{ prompt: string; response: GeneratedProposal; model: string }> {
        const systemPrompt = `You are a sustainable procurement consultant. 
You are given a current proposal JSON and an instruction from the client to modify it.
Apply the requested changes to the JSON, keeping all other data exactly the same unless affected by the instruction.
Recalculate the budget breakdown (grand_total, packaging, etc) appropriately based on the new product mix if items were changed.
Ensure the output remains strictly valid JSON matching the schema.

Schema (strict):
${JSON.stringify(proposalOutputSchema, null, 2)}`;

        const userPrompt = `Current Proposal JSON:
${JSON.stringify(currentProposal, null, 2)}

Instruction: ${instruction}

Generate the updated JSON response matching the schema exactly.`;

        const prompt = `${systemPrompt}\n\n${userPrompt}`;

        if (process.env.GEMINI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({
                    model: "gemini-2.5-flash",
                    generationConfig: { responseMimeType: "application/json" }
                });

                logger.info(`Sending refine request to Gemini for proposal ${currentProposal.proposal_id}`);
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();

                const responseObj = JSON.parse(responseText);
                // Preserve original ID
                responseObj.proposal_id = currentProposal.proposal_id;

                return { prompt, response: responseObj as GeneratedProposal, model: "gemini-2.5-flash" };
            } catch (error) {
                logger.error("LLM Refinement Failed.", error);
                throw error;
            }
        } else {
            logger.warn("GEMINI_API_KEY is not set! Using a mock refinement JSON.");
            
            // Generate a fake refined response by overriding one item
            const fakeRefinedMix = [...currentProposal.product_mix];
            if (fakeRefinedMix.length > 0) {
                // Determine if they asked to swap or add something
                const instructedItem = instruction.toLowerCase().includes('pen') ? 'Premium Fountain Pen' : 
                                       instruction.toLowerCase().includes('bag') ? 'Canvas Duffel' : 'Eco-Friendly Tech Charger';
                
                fakeRefinedMix[0] = {
                    ...fakeRefinedMix[0],
                    product_name: instructedItem,
                    unit_cost_inr: 850,
                    sustainability_story: "Refined by AI: Incorporates recycled materials representing a 40% emission reduction.",
                    why_this_product: "User requested alternative item."
                };
            }

            // Fake recalculate
            const products_total = fakeRefinedMix.reduce((sum, p) => sum + (p.unit_cost_inr * p.quantity_per_kit), 0) * currentProposal.client_summary.total_units;
            const packaging = Math.round(products_total * (15 / 70));
            const logistics_buffer = Math.round(products_total * (10 / 70));
            const contingency = Math.round(products_total * (5 / 70));
            const grand_total = products_total + packaging + logistics_buffer + contingency;
            
            const reqTotal = currentProposal.client_summary.budget_per_unit * currentProposal.client_summary.total_units;
            const budget_utilization_percent = Number(((grand_total / reqTotal) * 100).toFixed(1));

            const mockObj: GeneratedProposal = {
                ...currentProposal,
                product_mix: fakeRefinedMix,
                budget_breakdown: {
                    products_total,
                    packaging,
                    logistics_buffer,
                    contingency,
                    grand_total,
                    per_unit_cost: Math.round(grand_total / currentProposal.client_summary.total_units),
                    budget_utilization_percent
                }
            };

            return { 
                prompt, 
                response: mockObj, 
                model: "mock-refinement-model" 
            };
        }
    }
}

export const proposalAiService = new ProposalAiService();
