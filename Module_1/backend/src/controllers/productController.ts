import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/aiService';
import { processingService } from '../services/processingService';
import { dbRepository } from '../database/supabaseRepository';
import { validateData } from '../validators/ajvSchema';
import { cleanText } from '../utils/textCleaner';
import { ProductInput } from '../interfaces/models';
import { logger } from '../utils/logger';
import axios from 'axios';
import * as cheerio from 'cheerio';

export class ProductController {

    public async processProductMetadata(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const product: ProductInput = req.body;

            if (!product.id || !product.title || !product.description) {
                res.status(400).json({ error: "Missing required product fields: id, title, description" });
                return;
            }

            logger.info(`--- Starting generation for Product ID: ${product.id} ---`);

            // 1. Preprocess
            const cleanProd: ProductInput = {
                ...product,
                title: cleanText(product.title),
                description: cleanText(product.description)
            };
            logger.debug("1. Preprocessing complete.");

            // 1.5 Semantic Caching (Vector Embedding Match)
            const combinedText = `Title: ${cleanProd.title} \n Description: ${cleanProd.description}`;
            const embedding = await aiService.generateEmbedding(combinedText);

            const cachedMeta = await dbRepository.findSimilarProduct(embedding);
            if (cachedMeta) {
                logger.info(`[Vector Cache Hit] Semantic match found for Product ID: ${cleanProd.id}. Bypassing LLM.`);
                cachedMeta.flag = "cached_result";

                res.status(200).json({
                    success: true,
                    data: cachedMeta,
                    validation: "passed"
                });
                return;
            }

            // 2. LLM Step
            const llmResult = await aiService.generateMetadata(cleanProd);
            let generatedMeta = llmResult.response;
            logger.debug("2. LLM Generation complete.");

            // 3. Post-processing & Business Logic
            generatedMeta.seo_tags = processingService.canonicalizeTags(generatedMeta.seo_tags);

            const currentConfidence = generatedMeta.confidence?.tags || 0.8;
            const sustainabilityLogic = processingService.applySustainabilityLogic(cleanProd, generatedMeta.sustainability_filters, currentConfidence);

            generatedMeta.sustainability_filters = sustainabilityLogic.finalFilters;
            generatedMeta.confidence.tags = sustainabilityLogic.adjustedConfidence;

            if (sustainabilityLogic.needsManualReview) {
                generatedMeta.flag = "needs_manual_review";
            }

            generatedMeta.generated_at = new Date().toISOString();
            generatedMeta.product_id = product.id;
            logger.debug("3. Business Rules executed.");

            // 4. Validate with AJV
            const validation = validateData(generatedMeta);
            logger.debug(`4. AJV Validation passed: ${validation.valid}`);

            if (!validation.valid) {
                logger.error("Schema errors:", validation.errors);
                generatedMeta.flag = "validation_failed";
            }

            // 5. Store in Database
            await dbRepository.insertProduct(cleanProd, generatedMeta, embedding);

            await dbRepository.insertAiLog({
                product_id: product.id,
                module: "AI-Auto-Category",
                prompt: llmResult.prompt,
                response: generatedMeta,
                model: llmResult.model,
                validated: validation.valid
            });
            logger.debug("5. Logged to DB.");

            res.status(200).json({
                success: true,
                data: generatedMeta,
                validation: validation.valid ? "passed" : "failed"
            });

        } catch (error) {
            logger.error(`Pipeline Error processing product ${req.body?.id || 'unknown'}:`, error);
            next(error);
        }
    }

    public async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await dbRepository.getStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            logger.error(`Error fetching stats:`, error);
            next(error);
        }
    }

    public async overrideProductMetadata(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id as string;
            const updatedMeta = req.body;

            if (!productId || !updatedMeta) {
                res.status(400).json({ error: "Missing product ID or metadata body" });
                return;
            }

            // Remove manual review flag if it exists, since a human just reviewed it
            if (updatedMeta.flag === 'needs_manual_review') {
                updatedMeta.flag = null;
            }

            const updatedRecord = await dbRepository.updateProductMetadata(productId, updatedMeta);

            if (!updatedRecord) {
                res.status(404).json({ error: "Product not found to override" });
                return;
            }

            logger.info(`[Human Override] Updated metadata for product ${productId}`);

            res.status(200).json({
                success: true,
                data: updatedMeta,
                message: "Override applied successfully"
            });

        } catch (error) {
            logger.error(`Error overriding metadata for product ${req.params.id}:`, error);
            next(error);
        }
    }

    public async extractVision(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ error: "No image provided" });
                return;
            }

            logger.info(`Extracting product info from uploaded image...`);

            const extractedData = await aiService.extractFromImage(req.file.buffer, req.file.mimetype);

            res.status(200).json({
                success: true,
                data: extractedData
            });

        } catch (error) {
            logger.error(`Error extracting vision data:`, error);
            next(error);
        }
    }

    public async scrapeUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { url } = req.body;
            if (!url) {
                res.status(400).json({ error: "Missing URL to scrape" });
                return;
            }

            logger.info(`Scraping URL: ${url}`);

            const response = await axios.get(url, {
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

        } catch (error) {
            logger.error(`Error scraping URL ${req.body?.url}:`, error);
            res.status(500).json({ error: "Failed to scrape URL. It may be blocking automated requests." });
        }
    }
}

export const productController = new ProductController();
