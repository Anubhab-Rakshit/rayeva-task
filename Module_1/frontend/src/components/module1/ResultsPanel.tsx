import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, Save, RefreshCw, Edit2, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { overrideProductMetadata } from '../../services/catalogApi';
import { GeneratedMetadata, AnalysisState } from '../../types/module1.types';
import { ConfidenceRing } from './ConfidenceRing';
import { SustainabilityCard } from './SustainabilityCard';
import { TerminalLoader } from './TerminalLoader';

interface Props {
    data: GeneratedMetadata | null;
    state: AnalysisState;
    error?: string;
    onReset: () => void;
}

const cardBase = {
    background: 'linear-gradient(135deg, rgba(8,20,12,0.9) 0%, rgba(6,15,10,0.95) 100%)',
    borderRadius: '12px',
    backdropFilter: 'blur(24px)',
    boxShadow: '0 0 0 1px rgba(74,222,128,0.07), 0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(74,222,128,0.05)',
    transition: 'box-shadow 0.3s ease',
};

const cardHoverStyle = {
    boxShadow: '0 0 0 1px rgba(74,222,128,0.18), 0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(74,222,128,0.06), inset 0 1px 0 rgba(74,222,128,0.08)',
};

const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }),
};

const ghostRows = [
    { name: 'Bamboo Toothbrush', cat: 'personal_care', time: '1h ago' },
    { name: 'Hemp Seed Oil 500ml', cat: 'food_beverage', time: '3h ago' },
    { name: 'Organic Cotton Tote', cat: 'accessories', time: '5h ago' },
];

function ScanLineOverlay() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            <motion.div
                style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.15), transparent)',
                }}
                initial={{ top: '-2px' }}
                animate={{ top: '110%' }}
                transition={{ duration: 4, ease: 'linear', repeat: Infinity, repeatDelay: 1 }}
            />
        </div>
    );
}

function HexGrid() {
    // Honeycomb: center + 6 around it
    const hexPath = (cx: number, cy: number, r: number) => {
        const pts = Array.from({ length: 6 }, (_, i) => {
            const ang = (i * 60 - 30) * Math.PI / 180;
            return `${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)}`;
        });
        return `M ${pts.join(' L ')} Z`;
    };

    const R = 28;
    const W = R * Math.sqrt(3);
    const H = R * 2;
    const cx = 100, cy = 100;

    // 7 hex positions: center + ring of 6
    const positions = [
        { x: cx, y: cy, center: true },
        { x: cx + W, y: cy, center: false },
        { x: cx - W, y: cy, center: false },
        { x: cx + W / 2, y: cy - H * 0.75, center: false },
        { x: cx - W / 2, y: cy - H * 0.75, center: false },
        { x: cx + W / 2, y: cy + H * 0.75, center: false },
        { x: cx - W / 2, y: cy + H * 0.75, center: false },
    ];

    return (
        <svg width="200" height="200" viewBox="0 0 200 200">
            {positions.map((pos, i) => (
                <path
                    key={i}
                    d={hexPath(pos.x, pos.y, R - 2)}
                    fill={pos.center ? 'transparent' : 'transparent'}
                    stroke="rgba(74,222,128,0.12)"
                    strokeWidth="0.8"
                    style={pos.center ? {
                        animation: 'hexPulse 4s ease-in-out infinite',
                    } : {}}
                />
            ))}
        </svg>
    );
}

function EmptyState() {
    return (
        <div className="relative flex flex-col items-center justify-center h-full" style={{ minHeight: '500px' }}>
            {/* Watermark text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none" style={{ zIndex: 0 }}>
                <div style={{
                    fontFamily: 'Cabinet Grotesk, sans-serif',
                    fontWeight: 900,
                    fontSize: '96px',
                    lineHeight: 1,
                    color: 'rgba(74,222,128,0.04)',
                    letterSpacing: '-0.02em',
                    textAlign: 'center',
                }}>
                    <div>AWAITING</div>
                    <div>SPECIMEN</div>
                </div>
            </div>

            {/* Hex illustration */}
            <div className="relative z-10 mb-4">
                <HexGrid />
            </div>

            {/* Label */}
            <div className="relative z-10 text-center space-y-1.5 mb-8" style={{ marginTop: '20px' }}>
                <p style={{ color: 'rgba(74,222,128,0.5)', fontFamily: 'Geist Mono, monospace', fontSize: '11px', letterSpacing: '0.15em' }}>
                    NO SPECIMEN LOADED
                </p>
                <p style={{ color: 'rgba(74,222,128,0.25)', fontSize: '13px', fontFamily: 'Instrument Sans, sans-serif', marginTop: '6px' }}>
                    Load a sample or enter product data to begin analysis
                </p>
            </div>

            {/* Ghost recent analyses */}
            <div className="relative z-10 w-full max-w-md space-y-2 px-6 mt-10">
                <div className="flex items-center justify-between font-mono text-xs" style={{ color: 'rgba(74,222,128,0.15)', fontSize: '11px' }}>
                    <span>Bamboo Toothbrush Set</span>
                    <span className="flex-1 mx-3" style={{ borderBottom: '1px dotted rgba(74,222,128,0.1)' }} />
                    <span style={{ color: 'rgba(74,222,128,0.15)', marginRight: '10px' }}>[personal_care]</span>
                    <span style={{ color: 'rgba(74,222,128,0.15)' }}>1h ago</span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs" style={{ color: 'rgba(74,222,128,0.15)', fontSize: '11px' }}>
                    <span>Recycled Kraft Notebook</span>
                    <span className="flex-1 mx-3" style={{ borderBottom: '1px dotted rgba(74,222,128,0.1)' }} />
                    <span style={{ color: 'rgba(74,222,128,0.15)', marginRight: '10px' }}>[stationery]</span>
                    <span style={{ color: 'rgba(74,222,128,0.15)' }}>3h ago</span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs" style={{ color: 'rgba(74,222,128,0.15)', fontSize: '11px' }}>
                    <span>Organic Cotton Tote Bag</span>
                    <span className="flex-1 mx-3" style={{ borderBottom: '1px dotted rgba(74,222,128,0.1)' }} />
                    <span style={{ color: 'rgba(74,222,128,0.15)', marginRight: '10px' }}>[fashion_apparel]</span>
                    <span style={{ color: 'rgba(74,222,128,0.15)' }}>5h ago</span>
                </div>
            </div>
        </div>
    );
}

export function ResultsPanel({ data, state, error, onReset }: Props) {
    const [copiedAll, setCopiedAll] = useState(false);
    const [copiedTag, setCopiedTag] = useState<string | null>(null);
    const [reasoningOpen, setReasoningOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [analyzedAt] = useState(() => new Date().toTimeString().slice(0, 8));

    // Human-in-The-Loop Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<GeneratedMetadata | null>(null);

    useEffect(() => {
        setSaved(false);
        setSaving(false);
        setIsEditing(false);
        setEditedData(data ? JSON.parse(JSON.stringify(data)) : null);
    }, [data]);

    const handleOverrideSave = async () => {
        if (!editedData || !editedData.product_id) return;
        setSaving(true);
        try {
            await overrideProductMetadata(editedData.product_id, editedData);
            setSaved(true);
            setIsEditing(false);
            toast.success('Override applied & saved to catalog!');
            // Reflect updates instantly in UI
            if (data) Object.assign(data, editedData, { flag: null });
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to apply override');
        } finally {
            setSaving(false);
        }
    };

    const copyAll = () => {
        if (!data) return;
        navigator.clipboard.writeText(data.seo_tags.join(', '));
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
        toast.success('All tags copied!');
    };

    const copyTag = (tag: string) => {
        navigator.clipboard.writeText(tag);
        setCopiedTag(tag);
        setTimeout(() => setCopiedTag(null), 2000);
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => { setSaving(false); setSaved(true); toast.success('Saved to catalog!'); }, 1800);
    };

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <div className="relative flex-1 h-full overflow-y-auto overflow-x-hidden">
            {/* Layer 1 - Grid */}
            <div
                style={{
                    position: 'absolute', inset: 0,
                    background: `repeating-linear-gradient(rgba(74,222,128,0.03) 0px, rgba(74,222,128,0.03) 1px, transparent 1px, transparent 40px),
                                 repeating-linear-gradient(90deg, rgba(74,222,128,0.03) 0px, rgba(74,222,128,0.03) 1px, transparent 1px, transparent 40px)`,
                    backgroundSize: '40px 40px',
                    pointerEvents: 'none', zIndex: 0
                }}
            />

            {/* Layer 2 - Orbs */}
            <div
                style={{
                    position: 'absolute', bottom: '-100px', right: '-100px',
                    width: '600px', height: '600px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)',
                    animation: 'orbPulse 7s ease-in-out infinite',
                    pointerEvents: 'none', zIndex: 0
                }}
            />
            <div
                style={{
                    position: 'absolute', top: '-50px', right: '200px',
                    width: '300px', height: '300px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
                    animation: 'orbPulse 5s ease-in-out infinite 2s',
                    pointerEvents: 'none', zIndex: 0
                }}
            />

            {/* Layer 3 - Scan line sweep */}
            <div
                style={{
                    position: 'absolute', width: '100%', height: '3px',
                    background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.12), transparent)',
                    animation: 'scanSweep 5s linear infinite',
                    pointerEvents: 'none', zIndex: 0
                }}
            />

            <div className="relative z-10">{children}</div>
        </div>
    );

    if (state === 'idle') return (
        <Wrapper><EmptyState /></Wrapper>
    );

    if (state === 'loading') return (
        <Wrapper>
            <div className="p-6"><TerminalLoader /></div>
        </Wrapper>
    );

    if (state === 'error') return (
        <Wrapper>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
                <div className="rounded-xl p-5" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.18)' }}>
                    <p className="font-mono text-xs text-red-400 mb-2">⚠ ANALYSIS_FAILED</p>
                    <p style={{ color: '#fca5a5', fontSize: '13px' }}>{error ?? 'An unknown error occurred.'}</p>
                    <button onClick={onReset} className="mt-4 font-mono text-xs px-3 py-1.5 rounded"
                        style={{ border: '1px solid rgba(239,68,68,0.3)', color: 'var(--text-muted)', background: 'none', cursor: 'pointer' }}>
                        RETRY
                    </button>
                </div>
            </motion.div>
        </Wrapper>
    );

    if (!data) return null;

    const overallConf = (data.confidence.primary_category + data.confidence.tags) / 2;

    return (
        <Wrapper>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
                className="p-6 space-y-4">

                {/* Card 1: Classification */}
                <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible"
                    whileHover={cardHoverStyle}
                    className="p-5 relative overflow-hidden" style={cardBase}>
                    {/* Watermark slug */}
                    <div className="absolute top-2 left-4 pointer-events-none select-none font-mono"
                        style={{ fontSize: '40px', color: 'rgba(74,222,128,0.07)', lineHeight: 1, zIndex: 0, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {data.primary_category.toUpperCase()}
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <p className="font-mono text-xs m-0" style={{ color: 'var(--text-muted)', letterSpacing: '0.12em', fontSize: '10px' }}>
                                        CLASSIFICATION
                                    </p>
                                    {data.flag === 'cached_result' && (
                                        <span className="font-mono px-1.5 py-0.5 rounded flex items-center gap-1" style={{ color: 'var(--green-bright)', fontSize: '9px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                                            ⚡ QUICK CACHE
                                        </span>
                                    )}
                                </div>
                                <span className="font-mono flex items-center gap-3" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                                    ANALYZED AT {analyzedAt}
                                    <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: isEditing ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)', color: isEditing ? '#f87171' : 'var(--green-bright)', border: `1px solid ${isEditing ? 'rgba(239,68,68,0.3)' : 'rgba(74,222,128,0.3)'}`, cursor: 'pointer', outline: 'none' }}>
                                        {isEditing ? <><X size={10} /> CANCEL EDIT</> : <><Edit2 size={10} /> OVERRIDE</>}
                                    </button>
                                </span>
                            </div>
                            <div>
                                <p className="font-mono text-sm mb-1" style={{ color: 'var(--green-neon)', transition: 'color 0.2s' }}>
                                    [{((isEditing ? editedData?.primary_category : data.primary_category) || '').toLowerCase().replace(/ /g, '_')}]
                                </p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedData?.primary_category || ''}
                                        onChange={e => setEditedData(prev => ({ ...prev!, primary_category: e.target.value }))}
                                        className="w-full bg-black/50 border outline-none px-3 py-2 rounded font-sans text-xl"
                                        style={{ borderColor: 'var(--green-mid)', color: 'var(--text-primary)', fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700 }}
                                    />
                                ) : (
                                    <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                                        {data.primary_category}
                                    </h2>
                                )}
                            </div>
                            {data.sub_categories?.length > 0 && !isEditing && (
                                <div className="flex flex-wrap gap-2">
                                    {data.sub_categories.map(sub => (
                                        <span key={sub} className="font-mono text-xs px-2.5 py-1 rounded-full"
                                            style={{ border: '1px dotted var(--border-mid)', color: 'var(--text-secondary)' }}>
                                            {sub}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {data.flag === 'needs_manual_review' && (
                                <span className="inline-block font-mono text-xs px-2.5 py-1 rounded-full"
                                    style={{ background: 'var(--amber-dim)', border: '1px solid rgba(251,191,36,0.25)', color: 'var(--amber)' }}>
                                    ⚠ needs_manual_review
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                            <ConfidenceRing value={data.confidence.primary_category} label="Category" idSuffix="cat" />
                            <ConfidenceRing value={data.confidence.tags} label="Sustain." idSuffix="sus" />
                            <ConfidenceRing value={overallConf} label="Overall" idSuffix="ovr" />
                        </div>
                    </div>
                </motion.div>

                {/* Card 2: SEO Tags */}
                <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible"
                    whileHover={cardHoverStyle}
                    className="p-5" style={{
                        ...cardBase,
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(74,222,128,0.015) 10px, rgba(74,222,128,0.015) 11px)',
                    }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)', letterSpacing: '0.12em', fontSize: '10px' }}>SEO_TAGS</span>
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-xs px-2 py-0.5 rounded"
                                style={{ background: 'rgba(74,222,128,0.08)', color: 'var(--green-mid)', border: '1px solid var(--border-dim)' }}>
                                {data.seo_tags.length} tags
                            </span>
                            <button onClick={copyAll}
                                className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded transition-all"
                                style={{ border: '1px solid var(--border-dim)', color: copiedAll ? 'var(--green-bright)' : 'var(--text-muted)', background: 'none', cursor: 'pointer' }}
                            >
                                {copiedAll ? <Check size={11} /> : <Copy size={11} />}
                                {copiedAll ? 'COPIED ✓' : 'COPY_ALL'}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {isEditing ? (
                            <textarea
                                value={editedData?.seo_tags.join(', ') || ''}
                                onChange={e => setEditedData(prev => ({ ...prev!, seo_tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
                                className="w-full h-24 bg-black/50 outline-none p-3 rounded font-mono text-sm"
                                style={{ border: '1px dashed var(--green-mid)', color: 'var(--green-neon)', resize: 'none' }}
                                placeholder="Comma separated tags..."
                            />
                        ) : (
                            data.seo_tags.map((tag, i) => {
                                const brightness = i < 3 ? 1 : 0.65;
                                const fontSize = i === 0 ? '14px' : i < 3 ? '13px' : '12px';
                                return (
                                    <motion.button
                                        key={tag}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        onClick={() => copyTag(tag)}
                                        whileHover={{ y: -2 }}
                                        className="font-mono cursor-pointer px-3 py-1.5 rounded"
                                        style={{
                                            fontSize,
                                            background: copiedTag === tag ? 'rgba(74,222,128,0.25)' : 'rgba(74,222,128,0.06)',
                                            border: `1px solid ${copiedTag === tag ? 'var(--green-bright)' : 'var(--border-dim)'}`,
                                            color: `rgba(134,239,172,${brightness})`,
                                            transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
                                            outline: 'none',
                                        }}
                                        title="Click to copy"
                                    >
                                        #{tag.replace(/ /g, '-')}
                                    </motion.button>
                                );
                            })
                        )}
                    </div>
                </motion.div>

                {/* Card 3: Sustainability */}
                <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible"
                    whileHover={cardHoverStyle}
                    className="p-5" style={cardBase}>
                    <SustainabilityCard data={data} />
                </motion.div>

                {/* Card 4: AI Reasoning */}
                <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" whileHover={cardHoverStyle} style={cardBase}>
                    <button onClick={() => setReasoningOpen(o => !o)}
                        className="w-full flex items-center justify-between p-5 text-left"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}>
                        <div className="flex items-center gap-3">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--green-mid)' }}>
                                <path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.6 2.8 1.5 3.8C6.5 11.8 6 13 6 14.5c0 2.5 2 4.5 4.5 4.5H9v1a2 2 0 002 2h2a2 2 0 002-2v-1h-.5c2.5 0 4.5-2 4.5-4.5 0-1.5-.5-2.7-1.5-3.7C18.4 9.8 19 8.5 19 7c0-2.5-2.5-5-7-5z" />
                                <path d="M9 11h6M9 14h6" strokeWidth="1" />
                            </svg>
                            <span style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>
                                WHY DID THE AI DECIDE THIS?
                            </span>
                        </div>
                        <motion.div animate={{ rotate: reasoningOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                        </motion.div>
                    </button>

                    <AnimatePresence>
                        {reasoningOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                            >
                                <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {Object.entries(data.explanations ?? {}).map(([key, value]) => (
                                        <div key={key} className="p-4 rounded-lg"
                                            style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid var(--border-dim)' }}>
                                            <pre className="text-xs leading-relaxed whitespace-pre-wrap"
                                                style={{ fontFamily: 'Geist Mono, monospace', color: 'var(--green-neon)', margin: 0 }}>
                                                {`// ${key.toUpperCase()}
// ─────────────────────────
// "${value}"`}
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Card 5: Actions */}
                <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible"
                    whileHover={cardHoverStyle}
                    className="flex gap-3 p-5" style={cardBase}>

                    {isEditing ? (
                        <button
                            onClick={handleOverrideSave}
                            disabled={saving}
                            className="relative flex-1 flex items-center justify-center gap-2 rounded-lg font-mono text-xs py-3 overflow-hidden outline-none"
                            style={{
                                border: `1px solid var(--green-bright)`,
                                color: 'var(--green-bright)',
                                background: 'rgba(74,222,128,0.1)',
                                cursor: saving ? 'default' : 'pointer',
                                boxShadow: '0 0 15px rgba(74,222,128,0.2)'
                            }}
                        >
                            {saving ? 'OVERRIDING DATABASE...' : <><CheckCircle size={14} /> CONFIRM OVERRIDE</>}
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={saving || saved}
                            className="relative flex-1 flex items-center justify-center gap-2 rounded-lg font-mono text-xs py-3 overflow-hidden outline-none"
                            style={{
                                border: `1px solid ${saved ? 'var(--green-bright)' : 'var(--border-mid)'}`,
                                color: saved ? 'var(--green-bright)' : 'var(--text-secondary)',
                                background: saved ? 'rgba(74,222,128,0.05)' : 'transparent',
                                cursor: saving || saved ? 'default' : 'pointer',
                            }}
                        >
                            {saving && (
                                <motion.div className="absolute left-0 top-0 h-full"
                                    style={{ background: 'rgba(74,222,128,0.08)' }}
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1.8, ease: 'easeInOut' }}
                                />
                            )}
                            <div className="relative flex items-center gap-2">
                                {saved ? (
                                    <>
                                        <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <motion.path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
                                        </motion.svg>
                                        SAVED ✓
                                    </>
                                ) : saving ? (
                                    <><AnimatePresence><motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>SAVING...</motion.span></AnimatePresence></>
                                ) : (
                                    <><Save size={12} /> SAVE TO CATALOG</>
                                )}
                            </div>
                        </button>
                    )}

                    <button onClick={onReset}
                        className="flex items-center gap-2 px-5 rounded-lg font-mono text-xs py-3 outline-none"
                        style={{ border: '1px solid var(--border-dim)', color: 'var(--text-muted)', background: 'none', cursor: 'pointer' }}>
                        <RefreshCw size={12} />
                        NEW ANALYSIS
                    </button>
                </motion.div>
            </motion.div>
        </Wrapper>
    );
}
