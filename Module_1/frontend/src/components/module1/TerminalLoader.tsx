import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogLine {
    text: string;
    status: string;
    time: string;
    delay: number;
}

const generateLines = (): LogLine[] => [
    { text: 'Preprocessing product metadata...         ', status: 'DONE', time: `${Math.floor(Math.random() * 100 + 80)}ms`, delay: 0 },
    { text: 'Injecting taxonomy into context window... ', status: 'DONE', time: `${Math.floor(Math.random() * 50 + 30)}ms`, delay: 400 },
    { text: 'Querying Gemini 2.5 Flash (v1beta)...     ', status: 'OK', time: `${(Math.random() * 1.5 + 0.8).toFixed(1)}s`, delay: 800 },
    { text: 'Parsing structured JSON response...       ', status: 'DONE', time: `${Math.floor(Math.random() * 15 + 5)}ms`, delay: 1200 },
    { text: 'Running AJV schema validation...          ', status: 'DONE', time: `${Math.floor(Math.random() * 20 + 8)}ms`, delay: 1600 },
    { text: 'Contradiction engine — cross-referencing..', status: 'DONE', time: `${Math.floor(Math.random() * 40 + 20)}ms`, delay: 2000 },
    { text: 'Canonicalizing SEO tags (Lancaster)...    ', status: 'DONE', time: `${Math.floor(Math.random() * 35 + 20)}ms`, delay: 2400 },
    { text: 'Writing to Supabase...                    ', status: 'DONE', time: `${Math.floor(Math.random() * 80 + 50)}ms`, delay: 2800 },
    { text: '████████████████████ 100%                 ', status: 'COMPLETE', time: '', delay: 3200 },
];

const BAR_CHARS = ['░', '█'];

function makeBar(pct: number): string {
    const total = 20;
    const filled = Math.round((pct / 100) * total);
    return BAR_CHARS[1].repeat(filled) + BAR_CHARS[0].repeat(total - filled);
}

export function TerminalLoader() {
    const [lines] = useState(generateLines);
    const [visibleCount, setVisibleCount] = useState(0);
    const [progress, setProgress] = useState(0);
    const [flashLine, setFlashLine] = useState<number | null>(null);

    useEffect(() => {
        lines.forEach((line, i) => {
            setTimeout(() => {
                setVisibleCount(i + 1);
                setProgress(Math.round(((i + 1) / lines.length) * 100));
                setFlashLine(i);
                setTimeout(() => setFlashLine(null), 300);
            }, line.delay + 200);
        });
    }, [lines]);

    const displayPct = progress;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl overflow-hidden"
            style={{ background: '#050e08', border: '1px solid rgba(74,222,128,0.15)' }}
        >
            {/* Terminal title bar */}
            <div style={{
                display: 'flex', alignItems: 'center',
                padding: '10px 16px',
                borderBottom: '1px solid rgba(74,222,128,0.1)',
                background: 'rgba(0,0,0,0.3)',
            }}>
                {/* 3 traffic light dots */}
                <div style={{ display: 'flex', gap: '6px', marginRight: 'auto' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28ca41' }} />
                </div>
                {/* terminal title */}
                <span style={{
                    fontFamily: "'Geist Mono', monospace", fontSize: '11px',
                    color: 'rgba(74,222,128,0.5)', letterSpacing: '0.05em'
                }}>
                    rayeva-ai — node v20.11.0 — gemini-2.5-flash
                </span>
                <div style={{ marginLeft: 'auto', width: '52px' }} />
            </div>

            {/* Log lines */}
            <div className="p-5 space-y-1.5 min-h-[240px]">
                <AnimatePresence>
                    {lines.slice(0, visibleCount).map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center justify-between font-mono text-xs rounded px-1 py-0.5"
                            style={{
                                background: flashLine === i ? 'rgba(74,222,128,0.08)' : 'transparent',
                                transition: 'background 0.3s ease',
                            }}
                        >
                            <span className="flex items-center gap-2">
                                <span style={{ color: 'rgba(74,222,128,0.3)' }}>&gt;</span>
                                <span style={{
                                    color: line.status === 'COMPLETE' ? 'var(--green-bright)'
                                        : 'rgba(110,231,183,0.8)',
                                    fontSize: '12px',
                                    letterSpacing: '0.02em',
                                }}>
                                    {line.text}
                                </span>
                            </span>
                            <span className="flex items-center gap-3 shrink-0 ml-2">
                                <span style={{
                                    color: line.status === 'COMPLETE' ? 'var(--green-bright)'
                                        : line.status === 'OK' ? 'var(--green-mid)'
                                            : 'var(--green-bright)',
                                    fontSize: '10px',
                                    padding: '1px 4px',
                                    background: flashLine === i ? 'rgba(74,222,128,0.15)' : 'transparent',
                                    borderRadius: '3px',
                                    transition: 'background 0.3s',
                                }}>
                                    [{line.status}]
                                </span>
                                {line.time && (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '10px', minWidth: '36px', textAlign: 'right' }}>
                                        {line.time}
                                    </span>
                                )}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Blinking cursor after last line */}
                {visibleCount > 0 && visibleCount < lines.length && (
                    <div className="font-mono text-xs flex items-center gap-2" style={{ color: 'var(--green-bright)' }}>
                        <span style={{ color: 'rgba(74,222,128,0.3)' }}>&gt;</span>
                        <span style={{ animation: 'blink 1s step-end infinite' }}>▊</span>
                    </div>
                )}
            </div>

            {/* Progress bar with label */}
            <div className="px-5 pb-4 space-y-1.5">
                <div className="flex items-center gap-3 font-mono text-xs" style={{ color: 'rgba(74,222,128,0.5)', fontSize: '11px' }}>
                    <span>{displayPct}%</span>
                    <span style={{ letterSpacing: '-0.05em', color: 'var(--green-mid)', flexGrow: 1 }}>
                        {makeBar(displayPct)}
                    </span>
                    <span>{displayPct === 100 ? 'COMPLETE' : 'RUNNING'}</span>
                </div>
                <div className="h-px rounded-full overflow-hidden" style={{ background: 'rgba(74,222,128,0.06)' }}>
                    <motion.div
                        className="h-full"
                        style={{
                            background: 'linear-gradient(90deg, var(--green-mid), var(--green-bright))',
                            boxShadow: '0 0 8px var(--green-bright)',
                        }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
