const natural = require("natural");

/**
 * Deduplicate and canonicalize SEO tags.
 * Applies stemming and lowercase. Removes stopwords.
 * @param {string[]} tags 
 * @returns {string[]}
 */
function canonicalizeTags(tags) {
    if (!tags || tags.length === 0) return [];

    const uniqueTags = new Set();
    const finalTags = [];

    tags.forEach(tag => {
        if (!tag) return;

        // Lowercase and remove punctuation except spaces/hyphens
        let cleanTag = tag.toLowerCase().replace(/[^\w\s-]/g, "").trim();

        if (cleanTag) {
            // Very simple stemming approach: tokenize, stem, rejoin to form a unique key for deduplication
            const tokens = new natural.WordTokenizer().tokenize(cleanTag);
            let stemmedKey = tokens.map(t => natural.PorterStemmer.stem(t)).join(" ");

            if (!uniqueTags.has(stemmedKey)) {
                uniqueTags.add(stemmedKey);
                finalTags.push(cleanTag);
            }
        }
    });

    return finalTags;
}

/**
 * Process sustainability filters with business logic.
 * 1) From description (handled by LLM initially)
 * 2) From packaging image (handled by LLM cues)
 * 3) If contradiction => reduce confidence / flag for review
 * @param {Object} product The original product
 * @param {string[]} generatedFilters The filters output by the LLM
 * @param {number} currentConfidence The LLM confidence score
 * @returns {Object} { finalFilters, adjustedConfidence, needsManualReview }
 */
function applySustainabilityLogic(product, generatedFilters, currentConfidence) {
    let finalFilters = generatedFilters || [];
    let needsManualReview = false;
    let adjustedConfidence = currentConfidence;

    const descStr = product.description.toLowerCase();

    // Contradiction Check example: LLM generated "plastic_free" or "compostable" 
    // but the product description literally says "plastic pouch"
    const isPlastic = descStr.includes("plastic") || descStr.includes("pvc") || descStr.includes("nylon");
    const hasGreenClaim = finalFilters.includes("plastic_free") || finalFilters.includes("compostable_packaging");

    if (isPlastic && hasGreenClaim) {
        // Contradiction found
        needsManualReview = true;
        adjustedConfidence = Math.max(0, adjustedConfidence - 0.4); // Severely penalize confidence
    }

    return {
        finalFilters,
        adjustedConfidence,
        needsManualReview
    };
}

module.exports = {
    canonicalizeTags,
    applySustainabilityLogic
};
