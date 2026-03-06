export interface ProductAttribute {
    key: string;
    value: string;
}

export interface ProductInput {
    id: string;
    title: string;
    description: string;
    attributes?: Record<string, string>;
    targetLanguage?: string;
}

export interface ConfidenceScores {
    primary_category: number;
    tags: number;
}

export interface GeneratedMetadata {
    primary_category: string;
    sub_categories: string[];
    seo_tags: string[];
    sustainability_filters: string[];
    confidence: ConfidenceScores;
    explanations: Record<string, string>;
    flag?: string;
    generated_at?: string;
    product_id?: string;
}

export interface AnalyzeResponse {
    success: boolean;
    data: GeneratedMetadata;
    validation: 'passed' | 'failed';
}

export type AnalysisState = 'idle' | 'loading' | 'success' | 'error';
