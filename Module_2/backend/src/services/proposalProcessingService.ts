import { ProposalInput, GeneratedProposal } from "../interfaces/models";

export class ProposalProcessingService {

    public evaluateProposal(input: ProposalInput, proposal: GeneratedProposal): GeneratedProposal {
        const enrichedProposal = { ...proposal };
        enrichedProposal.warnings = [];
        enrichedProposal.needs_revision = false;

        let score = 0;

        // 1. Verify grand_total <= (budget_per_unit * total_units)
        const expectedTotalBudget = input.budget_per_unit_inr * input.total_units;
        const actualGrandTotal = proposal.budget_breakdown?.grand_total || 0;

        if (actualGrandTotal > expectedTotalBudget) {
            enrichedProposal.needs_revision = true;
            enrichedProposal.warnings.push(`Grand total (${actualGrandTotal}) exceeds budget (${expectedTotalBudget})`);
        }

        // 2. Verify product count is between 3-8
        const numItems = proposal.product_mix?.length || 0;
        if (numItems < 3 || numItems > 8) {
            enrichedProposal.needs_revision = true;
            enrichedProposal.warnings.push(`Product count (${numItems}) is outside the 3-8 constraint`);
        }

        // 3. Verify budget_utilization_percent is between 85-100%
        const utilization = proposal.budget_breakdown?.budget_utilization_percent || 0;
        if (utilization < 85) {
            enrichedProposal.needs_revision = true;
            enrichedProposal.warnings.push(`Budget utilization (${utilization}%) is too low (target: 85-100%)`);
        } else if (utilization <= 100) {
            score += 30; // Budget utilization within range
        }

        // 4. Calculate proposal_quality_score
        const certsCount = proposal.impact_summary?.certifications_represented?.length || 0;
        if (certsCount >= 3) {
            score += 20;
        }

        const plasticAvoided = proposal.impact_summary?.plastic_avoided_grams_per_kit || 0;
        if (plasticAvoided > 50) {
            score += 20;
        }

        const localSourcing = proposal.impact_summary?.local_sourcing_percent || 0;
        if (localSourcing > 40) {
            score += 15;
        }

        if (numItems >= 4 && numItems <= 6) {
            score += 15; // sweet spot
        }

        enrichedProposal.proposal_quality_score = score;

        return enrichedProposal;
    }
}

export const proposalProcessingService = new ProposalProcessingService();
