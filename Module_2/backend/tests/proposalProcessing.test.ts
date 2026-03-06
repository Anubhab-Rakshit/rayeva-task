import { proposalProcessingService } from '../src/services/proposalProcessingService';
import { ProposalInput, GeneratedProposal } from '../src/interfaces/models';

describe('ProposalProcessingService', () => {
    let mockInput: ProposalInput;
    let mockProposal: GeneratedProposal;

    beforeEach(() => {
        mockInput = {
            company_name: "Tech Corp",
            industry: "tech",
            budget_per_unit_inr: 1000,
            total_units: 100,
            occasion: "client_appreciation"
        }; // Expected total budget: 100,000

        mockProposal = {
            proposal_id: "test",
            client_summary: {
                company: "Tech Corp",
                industry: "tech",
                budget_per_unit: 1000,
                total_units: 100,
                total_budget: 100000
            },
            product_mix: [
                { product_name: "Item 1", category: "A", unit_cost_inr: 500, quantity_per_kit: 1, sustainability_story: "", why_this_product: "" },
                { product_name: "Item 2", category: "B", unit_cost_inr: 200, quantity_per_kit: 1, sustainability_story: "", why_this_product: "" },
                { product_name: "Item 3", category: "C", unit_cost_inr: 100, quantity_per_kit: 1, sustainability_story: "", why_this_product: "" },
            ], // 3 items
            budget_breakdown: {
                products_total: 80000,
                packaging: 10000,
                logistics_buffer: 5000,
                contingency: 2000,
                grand_total: 97000,
                per_unit_cost: 970,
                budget_utilization_percent: 97 // 97% -> OK
            },
            impact_summary: {
                plastic_avoided_grams_per_kit: 60,
                local_sourcing_percent: 50,
                certifications_represented: ["FSC", "GOTS", "FairTrade"], // 3 certs
                headline_impact_statement: ""
            },
            proposal_narrative: ""
        };
    });

    test('should return high score and no warnings for perfect proposal', () => {
        const result = proposalProcessingService.evaluateProposal(mockInput, mockProposal);
        expect(result.needs_revision).toBe(false);
        expect(result.warnings?.length).toBe(0);

        // Expected score: +30 (budget) + 20 (certs) + 20 (plastic) + 15 (local sourcing) = 85
        // (plus nothing for items since it's 3 items, not 4-6)
        expect(result.proposal_quality_score).toBe(85);
    });

    test('should flag if grand total exceeds budget', () => {
        mockProposal.budget_breakdown!.grand_total = 105000;
        const result = proposalProcessingService.evaluateProposal(mockInput, mockProposal);

        expect(result.needs_revision).toBe(true);
        expect(result.warnings).toContain('Grand total (105000) exceeds budget (100000)');
    });

    test('should flag if product count is too low', () => {
        mockProposal.product_mix = mockProposal.product_mix.slice(0, 2); // 2 items
        const result = proposalProcessingService.evaluateProposal(mockInput, mockProposal);

        expect(result.needs_revision).toBe(true);
        expect(result.warnings).toContain('Product count (2) is outside the 3-8 constraint');
    });

    test('should flag if budget utilization is under 85%', () => {
        mockProposal.budget_breakdown!.budget_utilization_percent = 80;
        const result = proposalProcessingService.evaluateProposal(mockInput, mockProposal);

        expect(result.needs_revision).toBe(true);
        expect(result.warnings).toContain('Budget utilization (80%) is too low (target: 85-100%)');
    });

    test('should grant sweet spot bonus for 4-6 products', () => {
        mockProposal.product_mix.push({ product_name: "Item 4", category: "D", unit_cost_inr: 50, quantity_per_kit: 1, sustainability_story: "", why_this_product: "" });
        const result = proposalProcessingService.evaluateProposal(mockInput, mockProposal);

        expect(result.proposal_quality_score).toBe(100); // 85 + 15
    });
});
