const { processProductMetadata } = require("./index");
const { db } = require("./db");

async function runExample() {
    const sampleProduct = {
        id: "prod_023",
        title: "Masala Chai Premium Tea",
        description: "Hand-blended masala premium loose leaf tea featuring Indian spices. Comes in an eco-friendly compostable packaging pouch but has a plastic lid.",
        images: ["image_url_1"],
        attributes: {
            brand: "Nature Brew",
            weight: "250g"
        }
    };

    try {
        const result = await processProductMetadata(sampleProduct);
        console.log("\n=== FINAL OUTPUT ===");
        console.log(JSON.stringify(result, null, 2));

        // Print DB stats
        console.log("\n=== DATABASE STATE ===");
        console.log(JSON.stringify(db.products, null, 2));
    } catch (error) {
        console.error("Example Failed:", error);
    }
}

runExample();
