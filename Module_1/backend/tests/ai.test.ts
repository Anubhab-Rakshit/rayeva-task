import { processingService } from '../src/services/processingService';
import { ProductInput } from '../src/interfaces/models';

jest.mock('../src/database/supabaseClient', () => ({
    supabase: null
}));

describe('Processing Service - Business Rules', () => {

    describe('canonicalizeTags', () => {
        it('should lowercase and deduplicate tags using basic stemming', () => {
            const rawTags = ['Running Shoes', 'running-shoe', 'RUNNING SHOES', 'sneakers'];
            const result = processingService.canonicalizeTags(rawTags);

            // "running shoes" and "running shoe" stem to the same base, so we expect 2 total unique tags
            expect(result.length).toBe(2);
            expect(result).toContain('running shoes');
            expect(result).toContain('sneakers');
        });

        it('should handle empty or malformed arrays', () => {
            expect(processingService.canonicalizeTags([])).toEqual([]);
        });
    });

    describe('applySustainabilityLogic', () => {
        const product: ProductInput = {
            id: 'test_1',
            title: 'Water Bottle',
            description: 'A generic plastic water bottle.',
        };

        it('should drop confidence and flag manual review if plastic contradicts green claim', () => {
            const llmTags = ['plastic_free', 'reusable'];
            const startingConfidence = 0.9;

            const result = processingService.applySustainabilityLogic(product, llmTags, startingConfidence);

            expect(result.needsManualReview).toBe(true);
            expect(result.adjustedConfidence).toBeCloseTo(0.5); // 0.9 - 0.4
            expect(result.finalFilters).toContain('plastic_free');
        });

        it('should not alter confidence if no contradiction exists', () => {
            const goodProduct: ProductInput = {
                id: 'test_2',
                title: 'Glass Bottle',
                description: 'A pure glass bottle with a wooden cork.',
            };
            const llmTags = ['plastic_free', 'reusable'];
            const result = processingService.applySustainabilityLogic(goodProduct, llmTags, 0.85);

            expect(result.needsManualReview).toBe(false);
            expect(result.adjustedConfidence).toBe(0.85);
        });
    });

});
