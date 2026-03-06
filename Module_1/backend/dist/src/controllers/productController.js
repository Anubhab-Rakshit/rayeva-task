"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = exports.ProductController = void 0;
const aiService_1 = require("../services/aiService");
const processingService_1 = require("../services/processingService");
const supabaseRepository_1 = require("../database/supabaseRepository");
const ajvSchema_1 = require("../validators/ajvSchema");
const textCleaner_1 = require("../utils/textCleaner");
const logger_1 = require("../utils/logger");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
class ProductController {
    async processProductMetadata(req, res, next) {
        try {
            const product = req.body;
            if (!product.id || !product.title || !product.description) {
                res.status(400).json({ error: "Missing required product fields: id, title, description" });
                return;
            }
            logger_1.logger.info(`--- Starting generation for Product ID: ${product.id} ---`);
            const cleanProd = {
                ...product,
                title: (0, textCleaner_1.cleanText)(product.title),
                description: (0, textCleaner_1.cleanText)(product.description)
            };
            logger_1.logger.debug("1. Preprocessing complete.");
            const combinedText = `Title: ${cleanProd.title} \n Description: ${cleanProd.description}`;
            const embedding = await aiService_1.aiService.generateEmbedding(combinedText);
            const cachedMeta = await supabaseRepository_1.dbRepository.findSimilarProduct(embedding);
            if (cachedMeta) {
                logger_1.logger.info(`[Vector Cache Hit] Semantic match found for Product ID: ${cleanProd.id}. Bypassing LLM.`);
                cachedMeta.flag = "cached_result";
                res.status(200).json({
                    success: true,
                    data: cachedMeta,
                    validation: "passed"
                });
                return;
            }
            const llmResult = await aiService_1.aiService.generateMetadata(cleanProd);
            let generatedMeta = llmResult.response;
            logger_1.logger.debug("2. LLM Generation complete.");
            generatedMeta.seo_tags = processingService_1.processingService.canonicalizeTags(generatedMeta.seo_tags);
            const currentConfidence = generatedMeta.confidence?.tags || 0.8;
            const sustainabilityLogic = processingService_1.processingService.applySustainabilityLogic(cleanProd, generatedMeta.sustainability_filters, currentConfidence);
            generatedMeta.sustainability_filters = sustainabilityLogic.finalFilters;
            generatedMeta.confidence.tags = sustainabilityLogic.adjustedConfidence;
            if (sustainabilityLogic.needsManualReview) {
                generatedMeta.flag = "needs_manual_review";
            }
            generatedMeta.generated_at = new Date().toISOString();
            generatedMeta.product_id = product.id;
            logger_1.logger.debug("3. Business Rules executed.");
            const validation = (0, ajvSchema_1.validateData)(generatedMeta);
            logger_1.logger.debug(`4. AJV Validation passed: ${validation.valid}`);
            if (!validation.valid) {
                logger_1.logger.error("Schema errors:", validation.errors);
                generatedMeta.flag = "validation_failed";
            }
            await supabaseRepository_1.dbRepository.insertProduct(cleanProd, generatedMeta, embedding);
            await supabaseRepository_1.dbRepository.insertAiLog({
                product_id: product.id,
                module: "AI-Auto-Category",
                prompt: llmResult.prompt,
                response: generatedMeta,
                model: llmResult.model,
                validated: validation.valid
            });
            logger_1.logger.debug("5. Logged to DB.");
            res.status(200).json({
                success: true,
                data: generatedMeta,
                validation: validation.valid ? "passed" : "failed"
            });
        }
        catch (error) {
            logger_1.logger.error(`Pipeline Error processing product ${req.body?.id || 'unknown'}:`, error);
            next(error);
        }
    }
    async getStats(req, res, next) {
        try {
            const stats = await supabaseRepository_1.dbRepository.getStats();
            res.status(200).json({ success: true, data: stats });
        }
        catch (error) {
            logger_1.logger.error(`Error fetching stats:`, error);
            next(error);
        }
    }
    async overrideProductMetadata(req, res, next) {
        try {
            const productId = req.params.id;
            const updatedMeta = req.body;
            if (!productId || !updatedMeta) {
                res.status(400).json({ error: "Missing product ID or metadata body" });
                return;
            }
            if (updatedMeta.flag === 'needs_manual_review') {
                updatedMeta.flag = null;
            }
            const updatedRecord = await supabaseRepository_1.dbRepository.updateProductMetadata(productId, updatedMeta);
            if (!updatedRecord) {
                res.status(404).json({ error: "Product not found to override" });
                return;
            }
            logger_1.logger.info(`[Human Override] Updated metadata for product ${productId}`);
            res.status(200).json({
                success: true,
                data: updatedMeta,
                message: "Override applied successfully"
            });
        }
        catch (error) {
            logger_1.logger.error(`Error overriding metadata for product ${req.params.id}:`, error);
            next(error);
        }
    }
    async extractVision(req, res, next) {
        try {
            if (!req.file) {
                res.status(400).json({ error: "No image provided" });
                return;
            }
            logger_1.logger.info(`Extracting product info from uploaded image...`);
            const extractedData = await aiService_1.aiService.extractFromImage(req.file.buffer, req.file.mimetype);
            res.status(200).json({
                success: true,
                data: extractedData
            });
        }
        catch (error) {
            logger_1.logger.error(`Error extracting vision data:`, error);
            next(error);
        }
    }
    async scrapeUrl(req, res, next) {
        try {
            const { url } = req.body;
            if (!url) {
                res.status(400).json({ error: "Missing URL to scrape" });
                return;
            }
            logger_1.logger.info(`Scraping URL: ${url}`);
            const response = await axios_1.default.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 10000
            });
            const html = response.data;
            const $ = cheerio.load(html);
            let title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
            let description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
            let image = $('meta[property="og:image"]').attr('content') || '';
            res.status(200).json({
                success: true,
                data: {
                    title: title.trim(),
                    description: description.trim(),
                    image: image.trim()
                }
            });
        }
        catch (error) {
            logger_1.logger.error(`Error scraping URL ${req.body?.url}:`, error);
            res.status(500).json({ error: "Failed to scrape URL. It may be blocking automated requests." });
        }
    }
}
exports.ProductController = ProductController;
exports.productController = new ProductController();
