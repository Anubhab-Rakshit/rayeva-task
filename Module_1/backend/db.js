/**
 * Mock database mimicking Postgres according to the schema provided.
 * 
 * DB schema (simplified)
 * products(id, title, description, images, attributes, generated_meta jsonb, created_at)
 * ai_logs(id, product_id, module, prompt, response, model, validated boolean, created_at)
 * taxonomy(id, name, parent_id)
 * sustainability_tags(id, slug, label)
 */

const db = {
    products: [],
    aiLogs: [],
    taxonomy: [
        { id: 1, name: "Beverages", parent_id: null },
        { id: 2, name: "Tea", parent_id: 1 },
        { id: 3, name: "Coffee", parent_id: 1 }
    ],
    sustainabilityTags: [
        { id: 1, slug: "locally_sourced", label: "Locally Sourced" },
        { id: 2, slug: "compostable_packaging", label: "Compostable Packaging" },
        { id: 3, slug: "organic", label: "Organic" },
        { id: 4, slug: "plastic_free", label: "Plastic Free" }
    ]
};

function insertProduct(product) {
    const entry = {
        ...product,
        created_at: new Date().toISOString()
    };
    db.products.push(entry);
    console.log(`[DB] Saved product ${product.id}`);
    return entry;
}

function insertAiLog(log) {
    const entry = {
        ...log,
        id: `log_${Date.now()}`,
        created_at: new Date().toISOString()
    };
    db.aiLogs.push(entry);
    console.log(`[DB] Saved AI log for product ${log.product_id}`);
    return entry;
}

function getAllowedCategories() {
    return db.taxonomy.map(t => t.name);
}

function getAllowedSustainabilityTags() {
    return db.sustainabilityTags.map(t => t.slug);
}

module.exports = {
    db,
    insertProduct,
    insertAiLog,
    getAllowedCategories,
    getAllowedSustainabilityTags
};
