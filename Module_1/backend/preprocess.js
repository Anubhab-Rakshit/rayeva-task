/**
 * Preprocessing module for cleaning text and extracting useful context.
 */

/**
 * Cleans the product description and title.
 * Removes excess whitespace, HTML tags (if any), and lowercases (optional).
 * @param {string} text 
 * @returns {string} 
 */
function cleanText(text) {
    if (!text) return "";
    return text
        // Remove basic HTML if present
        .replace(/<[^>]*>?/gm, "")
        // Remove excess spaces
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Preprocesses a product object before sending it to the LLM.
 * @param {Object} product 
 * @returns {Object} cleanedProduct
 */
function preprocessProduct(product) {
    return {
        ...product,
        title: cleanText(product.title),
        description: cleanText(product.description)
    };
}

module.exports = {
    cleanText,
    preprocessProduct
};
