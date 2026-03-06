import natural from "natural";
import { ProductInput } from "../interfaces/models";
import { logger } from "../utils/logger";

export class ProcessingService {

    /**
     * Deduplicate and canonicalize SEO tags.
     */
    public canonicalizeTags(tags: string[]): string[] {
        if (!tags || tags.length === 0) return [];

        const uniqueTags = new Set<string>();
        const finalTags: string[] = [];

        tags.forEach(tag => {
            if (!tag) return;

            const cleanTag = tag.toLowerCase().replace(/[^\w\s-]/g, "").trim();

            if (cleanTag) {
                const tokens = new natural.WordTokenizer().tokenize(cleanTag);
                const stemmedKey = tokens.map(t => natural.PorterStemmer.stem(t)).join(" ");

                if (!uniqueTags.has(stemmedKey)) {
                    uniqueTags.add(stemmedKey);
                    finalTags.push(cleanTag);
                }
            }
        });

        return finalTags;
    }

    /**
     * Process sustainability filters checking for contradictions.
     */
    public applySustainabilityLogic(
        product: ProductInput,
        generatedFilters: string[],
        currentConfidence: number
    ): { finalFilters: string[]; adjustedConfidence: number; needsManualReview: boolean } {

        const finalFilters = generatedFilters || [];
        let needsManualReview = false;
        let adjustedConfidence = currentConfidence;

        const descStr = product.description.toLowerCase();
        const titleStr = product.title.toLowerCase();
        const combined = `${titleStr} ${descStr}`;

        const isPlastic = combined.includes("plastic") || combined.includes("pvc") || combined.includes("nylon");
        const hasGreenClaim = finalFilters.includes("plastic_free") || finalFilters.includes("compostable_packaging");

        if (isPlastic && hasGreenClaim) {
            logger.warn(`Contradiction detected for product ${product.id}: has plastic, but AI generated green claims.`);
            needsManualReview = true;
            adjustedConfidence = Math.max(0, adjustedConfidence - 0.4);
        }

        // HEURISTIC: Check if product mentions sustainable sounding things but AI didn't tag them
        const sustainabilityKeywords = ["organic", "handpicked", "bio", "natural", "sustainable", "recycled", "eco-friendly"];
        const foundKeywords = sustainabilityKeywords.filter(k => combined.includes(k));

        if (foundKeywords.length > 0 && finalFilters.length === 0) {
            logger.info(`Product ${product.id} mentions sustainability keywords [${foundKeywords.join(", ")}] but no filters generated. Flagging for review.`);
            needsManualReview = true;
            adjustedConfidence = Math.min(adjustedConfidence, 0.55); // Lower confidence to trigger UI warnings
        }

        return {
            finalFilters,
            adjustedConfidence,
            needsManualReview
        };
    }
}

export const processingService = new ProcessingService();
