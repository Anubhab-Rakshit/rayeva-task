export interface ProductInput {
    id: string;
    title: string;
    description: string;
    images?: string[];
    attributes?: Record<string, any>;
    targetLanguage?: string;
}

export interface GeneratedMetadata {
    primary_category: string;
    sub_categories: string[];
    seo_tags: string[];
    sustainability_filters: string[];
    confidence: {
        primary_category: number;
        tags: number;
    };
    explanations: {
        primary_category: string;
    };
    flag?: string;
    product_id?: string;
    generated_at?: string;
}

export interface ProductRecord extends ProductInput {
    generated_meta?: GeneratedMetadata;
    created_at: string;
    embedding?: number[];
}

export interface AiLogRecord {
    id: string;
    product_id: string;
    module: string;
    prompt: string;
    response: Record<string, any>;
    model: string;
    validated: boolean;
    created_at: string;
}

export interface TaxonomyRecord {
    id: number;
    name: string;
    parent_id: number | null;
}

export interface SustainabilityTagRecord {
    id: number;
    slug: string;
    label: string;
}
