import axios from 'axios';
import { ProductInput, AnalyzeResponse } from '../types/module1.types';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' },
});

export const analyzeProduct = async (product: ProductInput): Promise<AnalyzeResponse> => {
    const { data } = await api.post<AnalyzeResponse>('/api/v1/products/analyze', product);
    return data;
};

export const overrideProductMetadata = async (productId: string, metadata: any): Promise<any> => {
    const { data } = await api.put(`/api/v1/products/${productId}/override`, metadata);
    return data;
};

export const getStats = async (): Promise<any> => {
    const { data } = await api.get('/api/v1/products/stats');
    return data.data;
};

export const extractVision = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('image', file);

    // We use dynamic headers to let browser set boundary for multipart
    const { data } = await axios.post('http://localhost:3000/api/v1/products/extract-vision', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return data;
};

export const scrapeProductUrl = async (url: string): Promise<any> => {
    const { data } = await api.post('/api/v1/products/scrape', { url });
    return data;
};
