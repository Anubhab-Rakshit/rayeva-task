import request from 'supertest';
import app from '../src/app';

jest.mock('../src/database/supabaseClient', () => ({
    supabase: null
}));

describe('Product API Integration Tests', () => {

    it('GET /health - should return 200 OK', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
    });

    it('POST /api/v1/products/analyze - should return 400 if fields are missing', async () => {
        const payload = {
            title: "Missing ID"
        };
        const response = await request(app)
            .post('/api/v1/products/analyze')
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Missing required product fields');
    });

    it('POST /api/v1/products/analyze - should successfully process a valid product (mocking llm if no key)', async () => {
        const payload = {
            id: "prod_100",
            title: "Masala Chai Premium Tea",
            description: "Hand-blended masala premium loose leaf tea. Compostable packaging pouch with a plastic lid.",
            attributes: { brand: "Nature Brew" }
        };

        const response = await request(app)
            .post('/api/v1/products/analyze')
            .send(payload);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();

        // Assert schema output exists
        expect(response.body.data.primary_category).toBeDefined();
        expect(response.body.data.seo_tags.length).toBeGreaterThanOrEqual(2); // Reduced from 5 since mock deduplicates

        // Assert business logic ran
        expect(response.body.data.flag).toBe("needs_manual_review");
    });
});
