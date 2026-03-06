"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbRepository = void 0;
const supabaseClient_1 = require("./supabaseClient");
const mockDb_1 = require("./mockDb");
const logger_1 = require("../utils/logger");
class SupabaseRepository {
    async findProductByDetails(title, description) {
        if (!supabaseClient_1.supabase) {
            return mockDb_1.dbRepository.findProductByDetails(title, description);
        }
        const { data, error } = await supabaseClient_1.supabase
            .from('products')
            .select('generated_meta')
            .eq('title', title)
            .eq('description', description)
            .maybeSingle();
        if (error || !data) {
            return null;
        }
        return data.generated_meta;
    }
    async findSimilarProduct(embedding) {
        if (!supabaseClient_1.supabase) {
            return mockDb_1.dbRepository.findSimilarProduct(embedding);
        }
        try {
            const { data, error } = await supabaseClient_1.supabase.rpc('match_products', {
                query_embedding: embedding,
                match_threshold: 0.95,
                match_count: 1
            });
            if (error || !data || data.length === 0) {
                return null;
            }
            logger_1.logger.info(`[Supabase Vector] Cache hit with similarity ${data[0].similarity}`);
            return data[0].generated_meta;
        }
        catch (err) {
            logger_1.logger.warn(`[Supabase Vector] RPC failed or unsupported. Fallback to null`, err);
            return null;
        }
    }
    async updateProductMetadata(id, newMeta) {
        if (!supabaseClient_1.supabase) {
            return mockDb_1.dbRepository.updateProductMetadata(id, newMeta);
        }
        const { data, error } = await supabaseClient_1.supabase
            .from('products')
            .update({ generated_meta: newMeta })
            .eq('id', id)
            .select()
            .single();
        if (error || !data) {
            logger_1.logger.error(`[Supabase] Error overriding product ${id}:`, error);
            return null;
        }
        logger_1.logger.info(`[Supabase] Overridden metadata for ${id}`);
        return data.generated_meta;
    }
    async insertProduct(product, generatedMeta, embedding) {
        if (!supabaseClient_1.supabase) {
            return mockDb_1.dbRepository.insertProduct(product, generatedMeta, embedding);
        }
        const entry = {
            id: product.id,
            title: product.title,
            description: product.description,
            attributes: product.attributes,
            generated_meta: generatedMeta,
            text_embedding: embedding
        };
        let { data, error } = await supabaseClient_1.supabase
            .from('products')
            .insert([entry])
            .select()
            .single();
        if (error && error.message.includes('text_embedding')) {
            logger_1.logger.warn(`[Supabase] Column text_embedding missing. Retrying insert without it...`);
            delete entry.text_embedding;
            const retry = await supabaseClient_1.supabase
                .from('products')
                .insert([entry])
                .select()
                .single();
            data = retry.data;
            error = retry.error;
        }
        if (error) {
            logger_1.logger.error(`[Supabase] Error inserting product ${product.id}:`, error);
            throw error;
        }
        logger_1.logger.info(`[Supabase] Saved product metadata ${product.id}`);
        return {
            ...product,
            generated_meta: generatedMeta,
            created_at: data.created_at
        };
    }
    async insertAiLog(logData) {
        if (!supabaseClient_1.supabase) {
            return mockDb_1.dbRepository.insertAiLog(logData);
        }
        const entry = {
            id: `log_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            product_id: logData.product_id,
            module: logData.module,
            prompt: logData.prompt,
            response: typeof logData.response === 'string' ? logData.response : JSON.stringify(logData.response),
            model: logData.model,
            validated: logData.validated
        };
        const { data, error } = await supabaseClient_1.supabase
            .from('ai_logs')
            .insert([entry])
            .select()
            .single();
        if (error) {
            logger_1.logger.error(`[Supabase] Error inserting AI log for product ${logData.product_id}:`, error);
            throw error;
        }
        logger_1.logger.debug(`[Supabase] Saved AI log for product ${logData.product_id}`);
        let parsedData = data;
        try {
            if (typeof parsedData?.response === 'string')
                parsedData.response = JSON.parse(parsedData.response);
        }
        catch (e) { }
        return parsedData;
    }
    getAllowedCategories() {
        return mockDb_1.dbRepository.getAllowedCategories();
    }
    getAllowedSustainabilityTags() {
        return mockDb_1.dbRepository.getAllowedSustainabilityTags();
    }
    async getStats() {
        if (!supabaseClient_1.supabase) {
            return mockDb_1.dbRepository.getStats();
        }
        const { count: productsCount } = await supabaseClient_1.supabase.from('products').select('*', { count: 'exact', head: true });
        const { data: logs } = await supabaseClient_1.supabase
            .from('ai_logs')
            .select('created_at, response')
            .order('created_at', { ascending: false })
            .limit(10);
        let lastRun = logs && logs.length > 0 ? logs[0].created_at : null;
        let avgConfidence = 0;
        if (logs && logs.length > 0) {
            let sum = 0;
            let validResponses = 0;
            for (const log of logs) {
                let resp = log.response;
                if (typeof resp === 'string') {
                    try {
                        resp = JSON.parse(resp);
                    }
                    catch (e) { }
                }
                if (resp && resp.confidence && typeof resp.confidence.tags === 'number') {
                    sum += resp.confidence.tags;
                    validResponses++;
                }
            }
            if (validResponses > 0)
                avgConfidence = sum / validResponses;
        }
        return {
            productsCount: productsCount || 0,
            avgConfidence,
            lastRun
        };
    }
}
exports.dbRepository = new SupabaseRepository();
