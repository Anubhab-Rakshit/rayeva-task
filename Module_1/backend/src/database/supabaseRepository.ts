import { supabase } from './supabaseClient';
import { dbRepository as mockDb } from './mockDb';
import { ProductRecord, AiLogRecord, ProductInput } from '../interfaces/models';
import { logger } from '../utils/logger';

class SupabaseRepository {
    public async findProductByDetails(title: string, description: string): Promise<any | null> {
        if (!supabase) {
            return mockDb.findProductByDetails(title, description);
        }

        const { data, error } = await supabase
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

    public async findSimilarProduct(embedding: number[]): Promise<any | null> {
        if (!supabase) {
            return mockDb.findSimilarProduct(embedding);
        }

        try {
            const { data, error } = await supabase.rpc('match_products', {
                query_embedding: embedding,
                match_threshold: 0.95,
                match_count: 1
            });

            if (error || !data || data.length === 0) {
                return null;
            }

            logger.info(`[Supabase Vector] Cache hit with similarity ${data[0].similarity}`);
            return data[0].generated_meta;
        } catch (err) {
            logger.warn(`[Supabase Vector] RPC failed or unsupported. Fallback to null`, err);
            return null;
        }
    }

    public async updateProductMetadata(id: string, newMeta: any): Promise<any | null> {
        if (!supabase) {
            return mockDb.updateProductMetadata(id, newMeta);
        }

        const { data, error } = await supabase
            .from('products')
            .update({ generated_meta: newMeta })
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            logger.error(`[Supabase] Error overriding product ${id}:`, error);
            return null;
        }

        logger.info(`[Supabase] Overridden metadata for ${id}`);
        return data.generated_meta;
    }

    public async insertProduct(product: ProductInput, generatedMeta: any, embedding?: number[]): Promise<ProductRecord> {
        if (!supabase) {
            return mockDb.insertProduct(product, generatedMeta, embedding);
        }

        const entry: any = {
            id: product.id,
            title: product.title,
            description: product.description,
            attributes: product.attributes,
            generated_meta: generatedMeta,
            text_embedding: embedding
        };

        let { data, error } = await supabase
            .from('products')
            .insert([entry])
            .select()
            .single();

        // Fallback for users who haven't run the vector migration script 
        // or need to flush the Supabase schema cache
        if (error && error.message.includes('text_embedding')) {
            logger.warn(`[Supabase] Column text_embedding missing. Retrying insert without it...`);
            delete entry.text_embedding;
            const retry = await supabase
                .from('products')
                .insert([entry])
                .select()
                .single();
            data = retry.data;
            error = retry.error;
        }

        if (error) {
            logger.error(`[Supabase] Error inserting product ${product.id}:`, error);
            throw error;
        }

        logger.info(`[Supabase] Saved product metadata ${product.id}`);
        return {
            ...product,
            generated_meta: generatedMeta,
            created_at: data.created_at
        };
    }

    public async insertAiLog(logData: Omit<AiLogRecord, 'id' | 'created_at'>): Promise<AiLogRecord> {
        if (!supabase) {
            return mockDb.insertAiLog(logData);
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

        const { data, error } = await supabase
            .from('ai_logs')
            .insert([entry])
            .select()
            .single();

        if (error) {
            logger.error(`[Supabase] Error inserting AI log for product ${logData.product_id}:`, error);
            throw error;
        }

        logger.debug(`[Supabase] Saved AI log for product ${logData.product_id}`);

        let parsedData = data;
        try {
            if (typeof parsedData?.response === 'string') parsedData.response = JSON.parse(parsedData.response);
        } catch (e) { }

        return parsedData as AiLogRecord;
    }

    // Taxonomy methods can stay falling back to the hardcoded local sets
    public getAllowedCategories(): string[] {
        return mockDb.getAllowedCategories();
    }

    public getAllowedSustainabilityTags(): string[] {
        return mockDb.getAllowedSustainabilityTags();
    }

    public async getStats() {
        if (!supabase) {
            return mockDb.getStats();
        }

        // For simplicity in a prototype/demo, we can just grab counts.
        // A real prod app would use aggregate RPCs. Here we just mock it for structural completeness
        // if using real supabase without those view structures, or we can just fetch some AI logs.
        const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

        const { data: logs } = await supabase
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
                    try { resp = JSON.parse(resp); } catch (e) { }
                }
                if (resp && resp.confidence && typeof resp.confidence.tags === 'number') {
                    sum += resp.confidence.tags;
                    validResponses++;
                }
            }
            if (validResponses > 0) avgConfidence = sum / validResponses;
        }

        return {
            productsCount: productsCount || 0,
            avgConfidence,
            lastRun
        };
    }
}

export const dbRepository = new SupabaseRepository();
