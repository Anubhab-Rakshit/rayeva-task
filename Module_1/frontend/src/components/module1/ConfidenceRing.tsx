import { useEffect, useState, useId } from 'react';
import { motion } from 'framer-motion';

interface Props {
    value: number; // 0-1
    label: string;
    size?: number;
    idSuffix?: string;
}

export function ConfidenceRing({ value, label, size = 72, idSuffix = 'def' }: Props) {
    const [displayed, setDisplayed] = useState(0);
    const gradientId = `ringGrad-${idSuffix}`;
    const r = (size - 14) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - displayed * circumference;

    const color = displayed >= 0.8 ? 'var(--green-bright)'
        : displayed >= 0.6 ? 'var(--amber)' : '#f87171';

    useEffect(() => {
        const t = setTimeout(() => setDisplayed(value), 200);
        return () => clearTimeout(t);
    }, [value]);

    // Build tick marks at 30° intervals
    const ticks = Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const outer = (size / 2) - 2;
        const inner = (size / 2) - 6;
        return {
            x1: cx + Math.cos(angle) * inner,
            y1: cy + Math.sin(angle) * inner,
            x2: cx + Math.cos(angle) * outer,
            y2: cy + Math.sin(angle) * outer,
        };
    });

    return (
        <div className="flex flex-col items-center gap-1">
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(74,222,128,1)" />
                            <stop offset="100%" stopColor="rgba(134,239,172,0.6)" />
                        </linearGradient>
                    </defs>

                    {/* Track */}
                    <circle cx={cx} cy={cy} r={r} fill="none"
                        stroke="rgba(255,255,255,0.04)" strokeWidth="5" />

                    {/* Tick marks */}
                    {ticks.map((t, i) => (
                        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                            stroke="rgba(74,222,128,0.2)" strokeWidth="1" />
                    ))}

                    {/* Arc */}
                    <motion.circle
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                        style={{
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%',
                            filter: `drop-shadow(0 0 4px ${color})`,
                        }}
                    />
                </svg>

                {/* Center text */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '0px',
                }}>
                    <motion.span
                        className="font-mono font-semibold"
                        style={{ fontSize: '13px', color, lineHeight: 1 }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    >
                        {Math.round(displayed * 100)}%
                    </motion.span>
                </div>
            </div>
            <span style={{
                color: 'rgba(74,222,128,0.4)',
                fontSize: '9px',
                fontFamily: 'Geist Mono, monospace',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
            }}>
                {label}
            </span>
        </div>
    );
}
