export interface ProposalInput {
    company_name: string;
    industry: "tech" | "finance" | "retail" | "healthcare" | "manufacturing" | "education" | "hospitality" | "other";
    budget_per_unit_inr: number;
    total_units: number;
    occasion: "corporate_gifting" | "employee_onboarding" | "event_giveaway" | "client_appreciation" | "sustainability_drive";
    recipient_profile?: string;
}

export interface ProductMixItem {
    product_name: string;
    category: string;
    unit_cost_inr: number;
    quantity_per_kit: number;
    sustainability_story: string;
    why_this_product: string;
}

export interface BudgetBreakdown {
    products_total: number;
    packaging: number;
    logistics_buffer: number;
    contingency: number;
    grand_total: number;
    per_unit_cost: number;
    budget_utilization_percent: number;
}

export interface ImpactSummary {
    plastic_avoided_grams_per_kit: number;
    local_sourcing_percent: number;
    certifications_represented: string[];
    headline_impact_statement: string;
}

export interface ClientSummary {
    company: string;
    industry: string;
    budget_per_unit: number;
    total_units: number;
    total_budget: number;
}

export interface GeneratedProposal {
    proposal_id: string;
    client_summary: ClientSummary;
    product_mix: ProductMixItem[];
    budget_breakdown: BudgetBreakdown;
    impact_summary: ImpactSummary;
    proposal_narrative: string;
    // System enriched fields
    needs_revision?: boolean;
    proposal_quality_score?: number;
    created_at?: string;
    warnings?: string[];
}

export interface AiLogRecord {
    id: string;
    product_id: string; // Using proposal_id here conceptually
    module: string;
    prompt: string;
    response: string | object;
    model: string;
    validated: boolean;
    created_at: string;
}
