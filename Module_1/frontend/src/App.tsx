import { useState } from 'react';
import { Module1Page } from './pages/Module1Page';
import { ArchitecturePage } from './pages/ArchitecturePage';

function App() {
    const [view, setView] = useState<'catalog' | 'architecture'>('catalog');

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-void)' }}>
            {/* Sticky header */}
            <header
                className="sticky top-0 z-50 flex items-center justify-between px-6 shrink-0"
                style={{
                    height: '56px',
                    background: 'rgba(6,15,10,0.85)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--border-dim)',
                }}
            >
                {/* Logo + title */}
                <div className="flex items-center gap-3">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-display font-black text-sm cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, var(--green-mid), var(--green-dim))', color: 'white' }}
                        onClick={() => setView('catalog')}
                    >
                        E
                    </div>
                    <span 
                        className="cursor-pointer" 
                        onClick={() => setView('catalog')}
                        style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-primary)', fontSize: '16px' }}
                    >
                        EchoSynthetics
                    </span>
                    <div style={{ width: '1px', height: '16px', background: 'var(--border-dim)' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'Instrument Sans, sans-serif' }}>
                        ForgeProcure Suite
                    </span>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setView('catalog')}
                        className={`font-mono text-[11px] px-3 py-1.5 rounded transition-all ${view === 'catalog' ? 'bg-[var(--green-bright)] text-[#020807] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--green-bright)]'}`}
                    >
                        01 CATALOG
                    </button>
                    <a 
                        href="http://localhost:5174" 
                        target="_blank" 
                        rel="noreferrer"
                        className="font-mono text-[11px] px-3 py-1.5 rounded text-[var(--text-muted)] hover:text-[#f97316] transition-colors"
                        title="Runs on Port 5174"
                    >
                        02 PROPOSALS ↗
                    </a>
                    <button 
                        onClick={() => setView('architecture')}
                        className={`font-mono text-[11px] px-3 py-1.5 rounded transition-all border ${view === 'architecture' ? 'border-[var(--green-bright)] text-[var(--green-bright)] shadow-[0_0_10px_rgba(74,222,128,0.2)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--green-bright)]'}`}
                    >
                        03 IMPACT
                    </button>
                    <button 
                        onClick={() => setView('architecture')}
                        className={`font-mono text-[11px] px-3 py-1.5 rounded transition-all border ${view === 'architecture' ? 'border-[var(--green-bright)] text-[var(--green-bright)] shadow-[0_0_10px_rgba(74,222,128,0.2)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--green-bright)]'}`}
                    >
                        04 SUPPORT
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 flex flex-col">
                {view === 'catalog' ? <Module1Page /> : <ArchitecturePage />}
            </main>
        </div>
    );
}

export default App;
