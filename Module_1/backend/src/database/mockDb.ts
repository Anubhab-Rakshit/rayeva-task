import { ProductRecord, AiLogRecord, TaxonomyRecord, SustainabilityTagRecord, ProductInput } from '../interfaces/models';
import { logger } from '../utils/logger';

function cosineSimilarity(A: number[], B: number[]) {
    let dotProduct = 0, normA = 0, normB = 0;
    for (let i = 0; i < A.length; i++) {
        dotProduct += A[i] * B[i];
        normA += A[i] * A[i];
        normB += B[i] * B[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

class MockDatabase {
    public products: ProductRecord[] = [];
    public aiLogs: AiLogRecord[] = [];

    public taxonomy: TaxonomyRecord[] = [
        { id: 1, name: "Beverages", parent_id: null },
        { id: 2, name: "Tea", parent_id: 1 },
        { id: 3, name: "Coffee", parent_id: 1 }
    ];

    public sustainabilityTags: SustainabilityTagRecord[] = [
        { id: 1, slug: "locally_sourced", label: "Locally Sourced" },
        { id: 2, slug: "compostable_packaging", label: "Compostable Packaging" },
        { id: 3, slug: "organic", label: "Organic" },
        { id: 4, slug: "plastic_free", label: "Plastic Free" },
        { id: 5, slug: "fair_trade", label: "Fair Trade" },
        { id: 6, slug: "biodegradable", label: "Biodegradable" },
        { id: 7, slug: "vegan", label: "Vegan" },
        { id: 8, slug: "carbon_neutral", label: "Carbon Neutral" }
    ];

    public findProductByDetails(title: string, description: string): any | null {
        const match = this.products.find(p => p.title === title && p.description === description);
        return match ? match.generated_meta : null;
    }

    public findSimilarProduct(embedding: number[]): any | null {
        let bestMatch = null;
        let highestSim = 0;
        for (const p of this.products) {
            if (p.embedding) {
                const sim = cosineSimilarity(embedding, p.embedding);
                if (sim > highestSim) {
                    highestSim = sim;
                    bestMatch = p;
                }
            }
        }
        if (highestSim > 0.95 && bestMatch) {
            logger.info(`[Mock DB] Match found with similarity ${highestSim.toFixed(3)}`);
            return bestMatch.generated_meta;
        }
        return null;
    }

    public updateProductMetadata(id: string, newMeta: any): any | null {
        const match = this.products.find(p => p.id === id);
        if (match) {
            match.generated_meta = newMeta;
            return match;
        }
        return null;
    }

    public insertProduct(product: ProductInput, generatedMeta: any, embedding?: number[]): ProductRecord {
        const entry: ProductRecord = {
            ...product,
            generated_meta: generatedMeta,
            embedding,
            created_at: new Date().toISOString()
        };
        this.products.push(entry);
        logger.info(`[DB] Saved product metadata ${product.id}`);
        return entry;
    }

    public insertAiLog(logData: Omit<AiLogRecord, 'id' | 'created_at'>): AiLogRecord {
        const entry: AiLogRecord = {
            ...logData,
            id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            created_at: new Date().toISOString()
        };
        this.aiLogs.push(entry);
        logger.debug(`[DB] Saved AI log for product ${logData.product_id}`);
        return entry;
    }

    public getAllowedCategories(): string[] {
        return this.taxonomy.map(t => t.name);
    }

    public getAllowedSustainabilityTags(): string[] {
        return this.sustainabilityTags.map(t => t.slug);
    }

    public getStats() {
        const productsCount = this.products.length;

        let avgConfidence = 0;
        if (productsCount > 0) {
            const sum = this.products.reduce((acc, p) => acc + (p.generated_meta?.confidence?.tags || 0), 0);
            avgConfidence = sum / productsCount;
        }

        let lastRun = null;
        if (this.aiLogs.length > 0) {
            lastRun = this.aiLogs[this.aiLogs.length - 1].created_at;
        }

        return {
            productsCount,
            avgConfidence,
            lastRun
        };
    }
}

export const dbRepository = new MockDatabase();
