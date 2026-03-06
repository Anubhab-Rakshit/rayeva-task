import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { InputPanel } from '../components/module1/InputPanel';
import { ResultsPanel } from '../components/module1/ResultsPanel';
import { analyzeProduct } from '../services/catalogApi';
import { ProductAttribute, GeneratedMetadata, AnalysisState } from '../types/module1.types';
import toast from 'react-hot-toast';

export function Module1Page() {
    const [state, setState] = useState<AnalysisState>('idle');
    const [data, setData] = useState<GeneratedMetadata | null>(null);
    const [error, setError] = useState<string | undefined>();

    const handleAnalyze = useCallback(async (title: string, description: string, attrs: ProductAttribute[], targetLanguage: string = 'English') => {
        setState('loading');
        setData(null);
        setError(undefined);

        const attributeMap: Record<string, string> = {};
        attrs.forEach(a => { if (a.key) attributeMap[a.key] = a.value; });

        try {
            const result = await analyzeProduct({
                id: `prod_${Date.now()}`,
                title,
                description,
                attributes: attributeMap,
                targetLanguage
            });

            if (result.success) {
                setState('success');
                setData(result.data);
                toast.success('Analysis complete!');
            } else {
                throw new Error('Analysis returned unsuccessful');
            }
        } catch (err: any) {
            setState('error');
            setError(err?.response?.data?.error ?? err?.message ?? 'Analysis failed. Is the backend running?');
            toast.error('Analysis failed');
        }
    }, []);

    const handleReset = useCallback(() => {
        setState('idle');
        setData(null);
        setError(undefined);
    }, []);

    return (
        <div className="flex h-[calc(100vh-56px)] overflow-hidden">
            {/* Left panel — sticky input */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    width: '380px',
                    minWidth: '380px',
                    background: 'var(--bg-surface)',
                    borderRight: '1px solid var(--border-dim)',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                <InputPanel
                    onAnalyze={handleAnalyze}
                    isLoading={state === 'loading'}
                    status={state === 'loading' ? 'loading' : state === 'error' ? 'error' : 'idle'}
                />
            </motion.div>

            {/* Right panel — results */}
            <div
                className="flex-1 overflow-y-auto"
                style={{ background: 'var(--bg-void)' }}
            >
                <ResultsPanel
                    data={data}
                    state={state}
                    error={error}
                    onReset={handleReset}
                />
            </div>
        </div>
    );
}
