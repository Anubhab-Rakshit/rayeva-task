"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processingService = exports.ProcessingService = void 0;
const natural_1 = __importDefault(require("natural"));
const logger_1 = require("../utils/logger");
class ProcessingService {
    canonicalizeTags(tags) {
        if (!tags || tags.length === 0)
            return [];
        const uniqueTags = new Set();
        const finalTags = [];
        tags.forEach(tag => {
            if (!tag)
                return;
            const cleanTag = tag.toLowerCase().replace(/[^\w\s-]/g, "").trim();
            if (cleanTag) {
                const tokens = new natural_1.default.WordTokenizer().tokenize(cleanTag);
                const stemmedKey = tokens.map(t => natural_1.default.PorterStemmer.stem(t)).join(" ");
                if (!uniqueTags.has(stemmedKey)) {
                    uniqueTags.add(stemmedKey);
                    finalTags.push(cleanTag);
                }
            }
        });
        return finalTags;
    }
    applySustainabilityLogic(product, generatedFilters, currentConfidence) {
        const finalFilters = generatedFilters || [];
        let needsManualReview = false;
        let adjustedConfidence = currentConfidence;
        const descStr = product.description.toLowerCase();
        const titleStr = product.title.toLowerCase();
        const combined = `${titleStr} ${descStr}`;
        const isPlastic = combined.includes("plastic") || combined.includes("pvc") || combined.includes("nylon");
        const hasGreenClaim = finalFilters.includes("plastic_free") || finalFilters.includes("compostable_packaging");
        if (isPlastic && hasGreenClaim) {
            logger_1.logger.warn(`Contradiction detected for product ${product.id}: has plastic, but AI generated green claims.`);
            needsManualReview = true;
            adjustedConfidence = Math.max(0, adjustedConfidence - 0.4);
        }
        const sustainabilityKeywords = ["organic", "handpicked", "bio", "natural", "sustainable", "recycled", "eco-friendly"];
        const foundKeywords = sustainabilityKeywords.filter(k => combined.includes(k));
        if (foundKeywords.length > 0 && finalFilters.length === 0) {
            logger_1.logger.info(`Product ${product.id} mentions sustainability keywords [${foundKeywords.join(", ")}] but no filters generated. Flagging for review.`);
            needsManualReview = true;
            adjustedConfidence = Math.min(adjustedConfidence, 0.55);
        }
        return {
            finalFilters,
            adjustedConfidence,
            needsManualReview
        };
    }
}
exports.ProcessingService = ProcessingService;
exports.processingService = new ProcessingService();
