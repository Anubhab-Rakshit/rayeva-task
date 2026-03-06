import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderOpen, Loader2, UploadCloud, ImageIcon, Link } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProductAttribute } from '../../types/module1.types';
import { getStats, extractVision, scrapeProductUrl } from '../../services/catalogApi';

interface Props {
    onAnalyze: (title: string, description: string, attrs: ProductAttribute[], targetLanguage: string) => void;
    isLoading: boolean;
    status: 'idle' | 'loading' | 'success' | 'error';
}

const SAMPLE = {
    title: 'Masala Chai Premium Loose Leaf Tea',
    description: 'Hand-blended masala chai crafted from Darjeeling first-flush leaves, whole cardamom pods, and sun-dried ginger. Our compostable kraft packaging uses a plastic foil barrier — please recycle separately. Certified organic by USDA.',
    attrs: [
        { key: 'brand', value: 'Nature Brew' },
        { key: 'weight', value: '250g' },
        { key: 'certifications', value: 'USDA Organic, Fair Trade' },
    ],
};

const MAX_DESC = 500;

export function InputPanel({ onAnalyze, isLoading, status }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [attrs, setAttrs] = useState<ProductAttribute[]>([{ key: '', value: '' }]);
    const [titleFocus, setTitleFocus] = useState(false);
    const [descFocus, setDescFocus] = useState(false);
    const [focusedAttr, setFocusedAttr] = useState<number | null>(null);
    const [hoveredAttr, setHoveredAttr] = useState<number | null>(null);
    const [stats, setStats] = useState({ productsCount: 1247, avgConfidence: 0.914, lastRun: new Date().toISOString() });
    const [language, setLanguage] = useState('English');

    // Vision AI State
    const [isExtracting, setIsExtracting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const analyzeRef = useRef<HTMLButtonElement>(null);

    const fetchStats = async () => {
        try {
            const data = await getStats();
            if (data) setStats(data);
        } catch (e) {
            console.error("Failed to fetch stats", e);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Refresh stats when status changes to success (meaning roughly after a run completes)
    useEffect(() => {
        if (status === 'success') {
            fetchStats();
        }
    }, [status]);

    const descLen = description.length;
    const descColor = descLen < 50 ? '#f87171' : descLen < 100 ? 'var(--amber)' : 'var(--green-bright)';
    const descPct = Math.min(100, (descLen / MAX_DESC) * 100);
    const descDisplay = String(descLen).padStart(3, '0') + '/' + MAX_DESC;

    const loadSample = () => {
        setTitle(SAMPLE.title);
        setDescription(SAMPLE.description);
        setAttrs(SAMPLE.attrs);
    };

    const handleScrapeUrl = async () => {
        const url = window.prompt("Enter product URL (e.g. Amazon, Shopify):");
        if (!url) return;

        setIsExtracting(true);
        const toastId = toast.loading('Scraping product page...');
        try {
            const result = await scrapeProductUrl(url);
            if (result.success && result.data) {
                if (result.data.title) setTitle(result.data.title);
                if (result.data.description) setDescription(result.data.description);
                if (result.data.image) setPreviewUrl(result.data.image);
                toast.success('Fields auto-populated from URL!', { id: toastId });
            }
        } catch (err: any) {
            console.error('Scraping Error:', err);
            toast.error(err.response?.data?.error || 'Failed to scrape URL', { id: toastId });
        } finally {
            setIsExtracting(false);
        }
    };

    const addAttr = () => setAttrs(p => [...p, { key: '', value: '' }]);
    const removeAttr = (i: number) => setAttrs(p => p.filter((_, idx) => idx !== i));
    const updateAttr = (i: number, field: 'key' | 'value', val: string) =>
        setAttrs(p => p.map((a, idx) => idx === i ? { ...a, [field]: val } : a));

    const handleSubmit = useCallback(() => {
        if (!title || !description) return;
        onAnalyze(title, description, attrs.filter(a => a.key && a.value), language);
    }, [title, description, attrs, language, onAnalyze]);

    const handleImageUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file');
            return;
        }

        // Generate local preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setIsExtracting(true);

        try {
            const result = await extractVision(file);
            if (result.success && result.data) {
                // Auto-fill fields
                if (result.data.title) setTitle(result.data.title);
                if (result.data.description) setDescription(result.data.description);

                if (result.data.attributes && Array.isArray(result.data.attributes)) {
                    // Filter out empty arrays or heavily invalid structured attrs
                    const validAttrs = result.data.attributes.filter((a: any) => a.key && a.value);
                    if (validAttrs.length > 0) {
                        setAttrs(validAttrs);
                    }
                }
                toast.success('Fields auto-populated by AI Vision!');
            }
        } catch (err: any) {
            console.error('Vision extraction error:', err);
            toast.error(err.response?.data?.error || 'Failed to extract text from image');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleImageUpload(file);
    };

    const clearImage = () => {
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const borderStyle = (focused: boolean) => ({
        borderLeft: focused
            ? '2px solid rgba(74,222,128,0.8)'
            : '2px solid rgba(74,222,128,0.4)',
        boxShadow: focused ? '-4px 0 12px rgba(74,222,128,0.25)' : 'none',
        transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
    });

    return (
        <div className="relative flex flex-col h-full overflow-hidden">
            {/* Animated gradient mesh background */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at 20% 20%, rgba(34,197,94,0.06) 0%, transparent 55%), radial-gradient(ellipse at 80% 85%, rgba(20,83,45,0.1) 0%, transparent 55%)',
                animation: 'meshShift 8s ease-in-out infinite alternate',
            }} />

            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border-dim)' }}>
                <span className="font-mono tracking-widest" style={{ color: 'var(--green-mid)', fontSize: '10px' }}>
                    ECHOSYNTHETICS / BIO_DB
                </span>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{
                        background: status === 'loading' ? 'var(--amber)' : 'var(--green-bright)',
                        boxShadow: status === 'loading' ? '0 0 6px var(--amber)' : '0 0 6px var(--green-bright)',
                        animation: 'orbPulse1 1.5s ease-in-out infinite',
                    }} />
                    <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                        {status === 'loading' ? 'PROCESSING' : 'READY'}
                    </span>
                </div>
            </div>

            {/* Stats strip */}
            <div className="flex shrink-0" style={{
                borderBottom: '1px solid var(--border-dim)',
                height: '64px',
            }}>
                {[
                    { label: 'PRODUCTS\nCATALOGUED', value: stats.productsCount.toLocaleString() },
                    { label: 'AVG CONF\nSCORE', value: `${(stats.avgConfidence * 100).toFixed(1)}%` },
                    { label: 'LAST RUN', value: stats.lastRun ? formatTimeAgo(stats.lastRun) : 'Never' },
                ].map((stat, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-center px-4"
                        style={{ borderRight: i < 2 ? '1px solid var(--border-dim)' : 'none' }}>
                        <p className="font-mono whitespace-pre-line" style={{ color: 'var(--text-muted)', fontSize: '8px', letterSpacing: '0.1em', lineHeight: 1.4 }}>
                            {stat.label}
                        </p>
                        <p className="font-mono font-bold" style={{ color: 'var(--green-bright)', fontSize: '14px', marginTop: '2px' }}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 relative z-10">

                {/* Form Controls Row */}
                <div className="flex justify-between relative z-10 w-full">
                    {/* Scrape URL button */}
                    <button onClick={handleScrapeUrl}
                        className="group flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono relative overflow-hidden"
                        style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid var(--border-dim)', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.07), transparent)', animation: 'shimmer 0.6s ease' }} />
                        <Link size={11} />
                        <span>PASTE_URL</span>
                    </button>

                    {/* Sample loader chip */}
                    <button onClick={loadSample}
                        className="group flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono relative overflow-hidden"
                        style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid var(--border-dim)', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.07), transparent)', animation: 'shimmer 0.6s ease' }} />
                        <FolderOpen size={11} />
                        <span>LOAD_SAMPLE.json</span>
                    </button>
                </div>

                {/* AI Image Vision Dropzone */}
                <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                    className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 group"
                    style={{
                        height: previewUrl ? '160px' : '100px',
                        borderColor: 'rgba(74,222,128,0.2)',
                        background: 'rgba(74,222,128,0.02)',
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                        }}
                    />

                    <AnimatePresence mode="wait">
                        {previewUrl ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-30 blur-[2px]" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                    {isExtracting ? (
                                        <>
                                            <Loader2 size={32} className="animate-spin text-green-400 mb-2" />
                                            <span className="font-mono text-xs text-green-400 font-bold bg-black/60 px-3 py-1 rounded">
                                                AI IS EXTRACTING LABELS...
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="font-mono text-[10px] bg-green-900/40 hover:bg-green-800/60 border border-green-500/30 text-green-300 px-3 py-1.5 rounded transition-all flex items-center gap-1.5"
                                                >
                                                    <UploadCloud size={12} /> RETRY
                                                </button>
                                                <button
                                                    onClick={clearImage}
                                                    className="font-mono text-[10px] bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 text-red-400 px-3 py-1.5 rounded transition-all flex items-center gap-1.5"
                                                >
                                                    <X size={12} /> CLEAR
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-green-500/5 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="text-green-500/50 group-hover:text-green-400 mb-2 transition-colors">
                                    <ImageIcon size={24} />
                                </div>
                                <span className="font-mono text-xs text-green-500/60 font-medium">
                                    DROP IMAGE TO AUTO-FILL (AI VISION)
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Title field */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="font-mono" style={{ color: 'rgba(74,222,128,0.3)', fontSize: '10px' }}>01</span>
                        <label className="font-mono tracking-widest block" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                            SPECIMEN_TITLE
                        </label>
                    </div>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        onFocus={() => setTitleFocus(true)}
                        onBlur={() => setTitleFocus(false)}
                        placeholder="e.g. Masala Chai Premium Tea"
                        style={{
                            ...borderStyle(titleFocus),
                            background: 'transparent', border: 'none',
                            ...borderStyle(titleFocus),
                            padding: '8px 12px',
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                            fontFamily: 'Instrument Sans, sans-serif',
                            width: '100%',
                            outline: 'none',
                        }}
                    />
                </div>

                {/* Description field */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="font-mono" style={{ color: 'rgba(74,222,128,0.3)', fontSize: '10px' }}>02</span>
                        <label className="font-mono tracking-widest block" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                            SPECIMEN_DESCRIPTION
                        </label>
                    </div>
                    <div className="relative">
                        <textarea
                            rows={5}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            onFocus={() => setDescFocus(true)}
                            onBlur={() => setDescFocus(false)}
                            placeholder="Describe the product in detail..."
                            maxLength={MAX_DESC}
                            style={{
                                ...borderStyle(descFocus),
                                background: 'transparent', border: 'none',
                                padding: '8px 12px',
                                color: 'var(--text-primary)',
                                fontSize: '14px',
                                fontFamily: 'Instrument Sans, sans-serif',
                                width: '100%',
                                resize: 'none',
                                outline: 'none',
                            }}
                        />
                        {/* char counter */}
                        <span className="absolute bottom-2 right-2 font-mono text-xs"
                            style={{ color: descColor, fontSize: '10px', transition: 'color 0.3s' }}>
                            {descDisplay}
                        </span>
                    </div>
                    {/* progress bar under textarea */}
                    {descLen > 0 && (
                        <motion.div
                            style={{
                                height: '2px',
                                background: `linear-gradient(90deg, ${descColor}, transparent)`,
                                width: `${descPct}%`,
                                transition: 'width 0.2s ease, background 0.3s ease',
                            }}
                        />
                    )}
                </div>

                {/* Attributes */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="font-mono" style={{ color: 'rgba(74,222,128,0.3)', fontSize: '10px' }}>03</span>
                        <label className="font-mono tracking-widest block" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                            ATTRIBUTES
                        </label>
                    </div>
                    <AnimatePresence>
                        {attrs.map((attr, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 rounded px-1 py-0.5"
                                onMouseEnter={() => setHoveredAttr(i)}
                                onMouseLeave={() => setHoveredAttr(null)}
                                style={{
                                    background: hoveredAttr === i ? 'rgba(74,222,128,0.04)' : 'transparent',
                                    transition: 'background 0.2s ease',
                                }}
                            >
                                {/* Row number */}
                                <span className="font-mono shrink-0 w-4 text-right"
                                    style={{ color: 'rgba(74,222,128,0.25)', fontSize: '10px' }}>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <input
                                    type="text" placeholder="key" value={attr.key}
                                    onChange={e => updateAttr(i, 'key', e.target.value)}
                                    onFocus={() => setFocusedAttr(i)}
                                    onBlur={() => setFocusedAttr(null)}
                                    style={{
                                        background: 'transparent', border: 'none',
                                        borderLeft: '2px solid rgba(74,222,128,0.3)',
                                        padding: '5px 10px', borderRadius: '100px', flex: 1,
                                        fontSize: '12px', color: 'var(--text-primary)',
                                        outline: 'none', fontFamily: 'inherit',
                                    }}
                                />
                                {/* Animated arrow */}
                                <span className="font-mono shrink-0" style={{
                                    color: focusedAttr === i ? 'var(--green-bright)' : 'var(--text-muted)',
                                    fontSize: '12px',
                                    animation: focusedAttr === i ? 'arrowPulse 0.8s ease-in-out infinite' : 'none',
                                }}>→</span>
                                <input
                                    type="text" placeholder="value" value={attr.value}
                                    onChange={e => updateAttr(i, 'value', e.target.value)}
                                    onFocus={() => setFocusedAttr(i)}
                                    onBlur={() => setFocusedAttr(null)}
                                    style={{
                                        background: 'transparent', border: 'none',
                                        borderLeft: '2px solid rgba(74,222,128,0.3)',
                                        padding: '5px 10px', borderRadius: '100px', flex: 1.5,
                                        fontSize: '12px', color: 'var(--text-primary)',
                                        outline: 'none', fontFamily: 'inherit',
                                    }}
                                />
                                <button onClick={() => removeAttr(i)}
                                    className="opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
                                    style={{
                                        color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none',
                                        opacity: hoveredAttr === i ? 0.6 : 0
                                    }}>
                                    <X size={11} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <button onClick={addAttr} className="font-mono text-xs"
                        style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: 'var(--green-mid)' }}>⊕</span>
                        <span className="hover:underline">ATTRIBUTE</span>
                    </button>
                </div>
            </div>

            {/* Analyze button area */}
            <div className="p-5 shrink-0 space-y-2" style={{ borderTop: '1px solid var(--border-dim)' }}>
                {/* Meta line & Language Selector above button */}
                <div className="flex items-center justify-between">
                    <p className="font-mono" style={{ color: 'rgba(74,222,128,0.4)', fontSize: '10px' }}>
                        model: gemini-2.5-flash · taxonomy: 10
                    </p>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="font-mono text-[10px] bg-black/40 text-green-400 border border-green-500/30 rounded px-2 py-1 outline-none cursor-pointer"
                        style={{ appearance: 'none' }}
                    >
                        <option value="English">EN (DEFAULT)</option>
                        <option value="Spanish">ES (SPANISH)</option>
                        <option value="French">FR (FRENCH)</option>
                        <option value="German">DE (GERMAN)</option>
                        <option value="Japanese">JA (JAPANESE)</option>
                    </select>
                </div>

                {/* Hero button */}
                <motion.button
                    ref={analyzeRef}
                    onClick={handleSubmit}
                    disabled={isLoading || !title || !description}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full overflow-hidden rounded-xl font-display font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    style={{
                        height: '56px',
                        background: 'linear-gradient(90deg, #16a34a, #065f46, #15803d, #14532d, #16a34a)',
                        backgroundSize: '300%',
                        animation: isLoading ? 'gradientShift 0.8s linear infinite' : 'gradientShift 3s linear infinite',
                        color: 'white',
                        border: 'none',
                        cursor: isLoading ? 'wait' : 'pointer',
                        letterSpacing: '0.05em',
                    }}
                >
                    {/* Scanline texture */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
                    }} />

                    {/* Shimmer on hover */}
                    <span className="shimmer-sweep absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                        style={{
                            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
                            backgroundSize: '200% 100%',
                            backgroundPosition: '200% center',
                        }} />

                    {/* Three dot indicators */}
                    <div className="relative flex items-center gap-1 shrink-0">
                        {[0.3, 0.6, 1.0].map((op, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full"
                                style={{ background: `rgba(134,239,172,${op})` }} />
                        ))}
                    </div>

                    <div className="relative">
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 size={15} className="animate-spin" />
                                ANALYZING...
                            </span>
                        ) : (
                            <span>ANALYZE SPECIMEN →</span>
                        )}
                    </div>
                </motion.button>
            </div>

            <style>{`
        @keyframes meshShift {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(8px,8px) scale(1.04); }
        }
      `}</style>
        </div>
    );
}

function formatTimeAgo(isoString: string) {
    const diffMs = Date.now() - new Date(isoString).getTime();
    if (isNaN(diffMs)) return 'Unknown';
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} hr ago`;
    return `${Math.floor(diffHrs / 24)} d ago`;
}
