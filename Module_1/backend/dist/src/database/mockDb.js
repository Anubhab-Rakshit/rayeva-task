"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbRepository = void 0;
const logger_1 = require("../utils/logger");
function cosineSimilarity(A, B) {
    let dotProduct = 0, normA = 0, normB = 0;
    for (let i = 0; i < A.length; i++) {
        dotProduct += A[i] * B[i];
        normA += A[i] * A[i];
        normB += B[i] * B[i];
    }
    if (normA === 0 || normB === 0)
        return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
class MockDatabase {
    products = [];
    aiLogs = [];
    taxonomy = [
        { id: 1, name: "Beverages", parent_id: null },
        { id: 2, name: "Tea", parent_id: 1 },
        { id: 3, name: "Coffee", parent_id: 1 }
    ];
    sustainabilityTags = [
        { id: 1, slug: "locally_sourced", label: "Locally Sourced" },
        { id: 2, slug: "compostable_packaging", label: "Compostable Packaging" },
        { id: 3, slug: "organic", label: "Organic" },
        { id: 4, slug: "plastic_free", label: "Plastic Free" },
        { id: 5, slug: "fair_trade", label: "Fair Trade" },
        { id: 6, slug: "biodegradable", label: "Biodegradable" },
        { id: 7, slug: "vegan", label: "Vegan" },
        { id: 8, slug: "carbon_neutral", label: "Carbon Neutral" }
    ];
    findProductByDetails(title, description) {
        const match = this.products.find(p => p.title === title && p.description === description);
        return match ? match.generated_meta : null;
    }
    findSimilarProduct(embedding) {
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
            logger_1.logger.info(`[Mock DB] Match found with similarity ${highestSim.toFixed(3)}`);
            return bestMatch.generated_meta;
        }
        return null;
    }
    updateProductMetadata(id, newMeta) {
        const match = this.products.find(p => p.id === id);
        if (match) {
            match.generated_meta = newMeta;
            return match;
        }
        return null;
    }
    insertProduct(product, generatedMeta, embedding) {
        const entry = {
            ...product,
            generated_meta: generatedMeta,
            embedding,
            created_at: new Date().toISOString()
        };
        this.products.push(entry);
        logger_1.logger.info(`[DB] Saved product metadata ${product.id}`);
        return entry;
    }
    insertAiLog(logData) {
        const entry = {
            ...logData,
            id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            created_at: new Date().toISOString()
        };
        this.aiLogs.push(entry);
        logger_1.logger.debug(`[DB] Saved AI log for product ${logData.product_id}`);
        return entry;
    }
    getAllowedCategories() {
        return this.taxonomy.map(t => t.name);
    }
    getAllowedSustainabilityTags() {
        return this.sustainabilityTags.map(t => t.slug);
    }
    getStats() {
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
exports.dbRepository = new MockDatabase();
