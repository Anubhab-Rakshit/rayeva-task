import { Module1Page } from './pages/Module1Page';

const modules = []; // removed mock modules

function App() {
    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-void)' }}>
            {/* Sticky header */}
            <header
                className="sticky top-0 z-50 flex items-center justify-between px-6"
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
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-display font-black text-sm"
                        style={{ background: 'linear-gradient(135deg, var(--green-mid), var(--green-dim))', color: 'white' }}
                    >
                        E
                    </div>
                    <span style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-primary)', fontSize: '16px' }}>
                        EchoSynthetics
                    </span>
                    <div style={{ width: '1px', height: '16px', background: 'var(--border-dim)' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'Instrument Sans, sans-serif' }}>
                        Catalog Intelligence
                    </span>
                </div>
            </header>

            {/* Main content */}
            <main>
                <Module1Page />
            </main>
        </div>
    );
}

export default App;
