import { motion } from 'framer-motion';
import { GeneratedMetadata } from '../../types/module1.types';

interface Props { data: GeneratedMetadata; }

const filterEmoji: Record<string, string> = {
    locally_sourced: '🌿', compostable_packaging: '♻️', organic: '🌱',
    plastic_free: '🚫', fair_trade: '🤝', carbon_neutral: '🌍',
    vegan: '🌾', biodegradable: '🍃',
};
const filterLabel: Record<string, string> = {
    locally_sourced: 'Locally Sourced', compostable_packaging: 'Compostable Packaging',
    organic: 'Organic', plastic_free: 'Plastic Free', fair_trade: 'Fair Trade',
    carbon_neutral: 'Carbon Neutral', vegan: 'Vegan', biodegradable: 'Biodegradable',
};

// Circuit board separator SVG
function CircuitSeparator() {
    return (
        <svg width="100%" height="16" viewBox="0 0 400 16" preserveAspectRatio="none">
            <line x1="0" y1="8" x2="400" y2="8" stroke="rgba(251,191,36,0.2)" strokeWidth="1" />
            {[40, 100, 160, 240, 300, 360].map(x => (
                <rect key={x} x={x - 3} y={5} width={6} height={6}
                    fill="none" stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" />
            ))}
            {[40, 100, 160].map(x => (
                <line key={`v${x}`} x1={x} y1={0} x2={x} y2={5}
                    stroke="rgba(251,191,36,0.15)" strokeWidth="0.8" />
            ))}
            {[240, 300, 360].map(x => (
                <line key={`v2${x}`} x1={x} y1={11} x2={x} y2={16}
                    stroke="rgba(251,191,36,0.15)" strokeWidth="0.8" />
            ))}
        </svg>
    );
}

export function SustainabilityCard({ data }: Props) {
    const verified = data.sustainability_filters ?? [];
    const needsReview = data.flag === 'needs_manual_review';
    const score = Math.min(100, Math.round(
        (verified.length / Math.max(verified.length + (needsReview ? 2 : 0), 1)) * 100
    ));
    const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : 'D';

    return (
        <div>
            {/* Header row */}
            <div className="flex items-start justify-between mb-4">
                <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                    SUSTAINABILITY PROFILE
                </span>

                {/* Grade chip */}
                <div className="flex items-start gap-1 shrink-0">
                    <span style={{
                        fontFamily: 'Cabinet Grotesk, sans-serif',
                        fontWeight: 900,
                        fontSize: '30px',
                        lineHeight: 1,
                        color: 'var(--green-bright)',
                        textShadow: '0 0 20px rgba(74,222,128,0.4)',
                    }}>
                        {grade}
                    </span>
                    <div className="flex flex-col items-start">
                        <span className="font-mono text-xs font-bold" style={{ color: 'var(--green-mid)', fontSize: '11px', lineHeight: 1.2 }}>
                            {score}
                        </span>
                        <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>/100</span>
                    </div>
                </div>
            </div>

            {/* Verified badges */}
            {verified.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {verified.map((filter, i) => (
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 20 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono"
                            style={{
                                background: 'linear-gradient(90deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.06) 100%)',
                                border: '1px solid rgba(74,222,128,0.2)',
                                color: 'var(--green-neon)',
                                boxShadow: '0 0 10px rgba(74,222,128,0.12)',
                            }}
                        >
                            <span>{filterEmoji[filter] ?? '✅'}</span>
                            <span>{filterLabel[filter] ?? filter.replace(/_/g, ' ')}</span>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Unverified section */}
            {needsReview && (
                <>
                    <div className="my-4 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs" style={{ color: 'rgba(251,191,36,0.6)', fontSize: '9px', letterSpacing: '0.15em' }}>
                                UNVERIFIED CLAIMS
                            </span>
                        </div>
                        <CircuitSeparator />
                    </div>

                    <div className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono cursor-help"
                        style={{
                            background: 'var(--amber-dim)',
                            border: '1px solid rgba(251,191,36,0.25)',
                            color: 'var(--amber)',
                        }}
                    >
                        <span>⚠</span>
                        <span>Needs Manual Review</span>
                        <div className="absolute left-0 bottom-full mb-2 w-72 p-3 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50"
                            style={{
                                background: 'rgba(8,20,12,0.98)',
                                border: '1px solid rgba(251,191,36,0.25)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-base leading-none mt-0.5">⚠️</span>
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'Instrument Sans, sans-serif' }}>
                                    This claim appears in the description but is not backed by a certification or attribute.{' '}
                                    <strong style={{ color: 'var(--amber)' }}>Manual review recommended.</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
