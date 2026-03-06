import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Mic } from 'lucide-react';

export default function App() {
    const [phase, setPhase] = useState<1 | 2 | 3>(1);
    const [isPouring, setIsPouring] = useState(false);
    const [proposalData, setProposalData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const orb1Ref = useRef<HTMLDivElement>(null);
    const orb2Ref = useRef<HTMLDivElement>(null);
    const orb3Ref = useRef<HTMLDivElement>(null);

    // FIX 7: Mouse parallax on orbs
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            if (orb1Ref.current) orb1Ref.current.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px) scale(1)`;
            if (orb2Ref.current) orb2Ref.current.style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px) scale(1)`;
            if (orb3Ref.current) orb3Ref.current.style.transform = `translate(${x * 0.2}px, ${y * 0.4}px) scale(1)`;
        };
        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Phase 1 form state
    const [formData, setFormData] = useState({
        companyName: 'TechCorp India',
        industry: 'tech',
        budgetPerUnit: 1600,
        totalUnits: 100,
        occasion: 'employee_onboarding'
    });

    const generateProposal = async () => {
        setIsPouring(true);
        setError(null);
        setProposalData(null);

        // WIPEOUT 1: Move to Phase 2 (Generating Screen)
        setTimeout(() => {
            setPhase(2);
            setIsPouring(false);
        }, 300);

        try {
            // Hit real backend (Module 2 runs on 3001)
            const res = await fetch('http://localhost:3001/api/v1/proposals/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_name: formData.companyName,
                    industry: formData.industry,
                    budget_per_unit_inr: formData.budgetPerUnit,
                    total_units: formData.totalUnits,
                    occasion: formData.occasion
                })
            });

            if (!res.ok) {
                throw new Error(`API Error: ${res.statusText}`);
            }

            const json = await res.json();

            // WIPEOUT 2: Move to Phase 3 (Proposal Deck)
            setIsPouring(true);
            setTimeout(() => {
                setProposalData(json.data);
                setPhase(3);
                setIsPouring(false);
            }, 300);

        } catch (err: any) {
            console.error(err);
            setError(err.message);
            // Revert on error
            setIsPouring(true);
            setTimeout(() => {
                setPhase(1);
                setIsPouring(false);
            }, 300);
        }
    };

    // The Molten Pour Transition Component
    const MoltenTransition = () => (
        <AnimatePresence>
            {isPouring && (
                <motion.div
                    initial={{ left: '-100%' }}
                    animate={{ left: '0%' }}
                    exit={{ left: '100%' }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[100]"
                    style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b)' }}
                />
            )}
        </AnimatePresence>
    );

    return (
        <>
            {/* LAYER 1: Noise grain texture overlay */}
            <div className="fixed inset-0 pointer-events-none z-[1] mix-blend-overlay" style={{ opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />

            {/* LAYER 3: Volumetric Orbs with parallax refs */}
            <div ref={orb1Ref} className="fixed pointer-events-none" style={{ bottom: '-200px', right: '-200px', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(249,115,22,0.14) 0%, rgba(249,115,22,0.06) 35%, transparent 70%)', animation: 'orbBreath 7s ease-in-out infinite', filter: 'blur(40px)', transition: 'transform 0.8s ease-out', zIndex: 0 }} />
            <div ref={orb2Ref} className="fixed pointer-events-none" style={{ top: '-100px', left: '300px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(245,158,11,0.09) 0%, transparent 65%)', animation: 'orbBreath 5s ease-in-out infinite 2.5s', filter: 'blur(60px)', transition: 'transform 0.8s ease-out', zIndex: 0 }} />
            <div ref={orb3Ref} className="fixed pointer-events-none" style={{ top: '40%', left: '-150px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(234,88,12,0.07) 0%, transparent 65%)', animation: 'orbBreath 9s ease-in-out infinite 1s', filter: 'blur(50px)', transition: 'transform 0.8s ease-out', zIndex: 0 }} />

            {/* LAYER 4: Floating particles */}
            {[{ x: '15%', y: '20%', d: '8s', delay: '0s' }, { x: '80%', y: '10%', d: '11s', delay: '2s' }, { x: '45%', y: '60%', d: '9s', delay: '4s' }, { x: '70%', y: '80%', d: '13s', delay: '1s' }, { x: '25%', y: '75%', d: '10s', delay: '3s' }, { x: '90%', y: '45%', d: '12s', delay: '5s' }].map((p, i) => (
                <div key={i} className="fixed pointer-events-none" style={{ left: p.x, top: p.y, width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(249,115,22,0.4)', boxShadow: '0 0 6px rgba(249,115,22,0.6)', animation: `floatParticle${i + 1} ${p.d} ease-in-out infinite ${p.delay}`, zIndex: 0 }} />
            ))}

            <MoltenTransition />

            <div className="min-h-screen flex flex-col relative z-10" style={{ background: 'transparent' }}>
                {/* HEADER: Exactly like M1 but configured for M2 */}
                <header
                    className="sticky top-0 z-50 flex items-center justify-between px-6"
                    style={{
                        height: '56px',
                        background: 'rgba(8,5,1,0.95)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(249,115,22,0.1)',
                    }}
                >
                    {/* Logo + title */}
                    <div className="flex items-center gap-3">
                        <div
                            className="w-7 h-7 rounded-sm flex items-center justify-center font-display font-black text-sm"
                            style={{ background: 'var(--text-primary)', color: 'var(--bg-void)' }}
                        >
                            F
                        </div>
                        <span style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700, color: 'var(--text-primary)', fontSize: '16px' }}>
                            ForgeProcure
                        </span>
                        <div style={{ width: '1px', height: '16px', background: 'var(--border-dim)' }} />
                        <span style={{ color: 'var(--fire-bright)', fontSize: '12px', fontFamily: '"Space Mono", monospace' }}>
                            ENTERPRISE_AI_v2
                        </span>
                    </div>

                    <div className="flex items-center gap-4 hidden md:flex font-mono text-[10px]">
                        <span style={{ color: 'var(--text-muted)' }}>MOLTEN_FORGE_PROTOCOL</span>
                    </div>
                </header>

                <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-6 py-8">
                    {error && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[var(--danger)] text-white px-4 py-2 rounded shadow-lg z-50 font-mono text-sm border border-red-800">
                            API ERROR: {error}
                        </div>
                    )}
                    {phase === 1 && <Phase1Intake formData={formData} setFormData={setFormData} onGenerate={generateProposal} />}
                    {phase === 2 && <Phase2Generating formData={formData} />}
                    {phase === 3 && proposalData && <Phase3Deck formData={formData} proposal={proposalData} setProposalData={setProposalData} />}
                </main>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        /* Orb breath */
        @keyframes orbBreath {
          0%,100% { transform:scale(1) translateY(0px); opacity:0.8; }
          33%     { transform:scale(1.12) translateY(-20px); opacity:1; }
          66%     { transform:scale(0.95) translateY(10px); opacity:0.6; }
        }
        /* Gradient button */
        @keyframes gradientShift {
          0%   { background-position:0% 50%; }
          100% { background-position:200% 50%; }
        }
        /* Button light streak */
        @keyframes buttonStreak {
          0%   { left:-80px; }
          30%  { left:110%; }
          100% { left:110%; }
        }
        /* Scan line */
        @keyframes scanAmber {
          0%   { transform:translateY(-100%); }
          100% { transform:translateY(1500px); }
        }
        /* Cursor blink */
        @keyframes cursorBlink {
          0%,100% { opacity:1; } 50% { opacity:0; }
        }
        /* Equals sign pulse */
        @keyframes eqPulse {
          0%,100% { opacity:0.4; } 50% { opacity:1; }
        }
        /* Bar entrance */
        @keyframes barFill0 { from{width:0} to{width:70%} }
        @keyframes barFill1 { from{width:0} to{width:15%} }
        @keyframes barFill2 { from{width:0} to{width:10%} }
        @keyframes barFill3 { from{width:0} to{width:5%} }
        /* Bar shimmer */
        @keyframes barShimmer {
          0%   { left:-40px; }
          100% { left:110%; }
        }
        /* Floating particles */
        @keyframes floatParticle1 { 0%{transform:translate(0,0);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translate(30px,-120px);opacity:0} }
        @keyframes floatParticle2 { 0%{transform:translate(0,0);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translate(-40px,-90px);opacity:0} }
        @keyframes floatParticle3 { 0%{transform:translate(0,0);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translate(20px,-150px);opacity:0} }
        @keyframes floatParticle4 { 0%{transform:translate(0,0);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translate(-30px,-100px);opacity:0} }
        @keyframes floatParticle5 { 0%{transform:translate(0,0);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translate(50px,-80px);opacity:0} }
        @keyframes floatParticle6 { 0%{transform:translate(0,0);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translate(-20px,-130px);opacity:0} }
        /* Glass card */
        .molten-card {
          background: linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(249,115,22,0.03) 50%,rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border-top: 1px solid rgba(255,255,255,0.12);
          border-left: 1px solid rgba(255,255,255,0.09);
          border-right: 1px solid rgba(249,115,22,0.06);
          border-bottom: 1px solid rgba(0,0,0,0.3);
          border-radius: 10px;
          box-shadow: 0 0 0 1px rgba(249,115,22,0.06),0 8px 32px rgba(0,0,0,0.5),0 32px 64px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.08),inset 0 -1px 0 rgba(0,0,0,0.2);
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .molten-card:hover {
          border-top: 1px solid rgba(249,115,22,0.35);
          border-left: 1px solid rgba(249,115,22,0.2);
          box-shadow: 0 0 0 1px rgba(249,115,22,0.15),0 12px 40px rgba(0,0,0,0.6),0 0 60px rgba(249,115,22,0.08),inset 0 1px 0 rgba(249,115,22,0.1);
          transform: translateY(-2px);
        }
        /* Upgraded inputs */
        .molten-input {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(249,115,22,0.12);
          border-radius: 8px;
          backdrop-filter: blur(10px);
          color: var(--text-primary);
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .molten-input:focus {
          border-color: rgba(249,115,22,0.5);
          background: rgba(249,115,22,0.04);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.08),inset 0 1px 0 rgba(255,255,255,0.05),-4px 0 16px rgba(249,115,22,0.15);
          outline: none;
        }
        /* Typography */
        .heading-hero { font-family:'Cormorant Garamond',serif; font-size:56px; line-height:1.1; color:var(--text-primary); font-weight:700; }
        .heading-hero-bold { font-family:'Bricolage Grotesque',sans-serif; font-size:56px; line-height:1.1; color:var(--fire); font-weight:800; }
        .hero-number { font-family:'Cormorant Garamond',serif; color:var(--gold-text); font-weight:900; }
        .mono-label { font-family:'Space Mono',monospace; color:rgba(253,186,116,0.6); text-transform:uppercase; letter-spacing:0.05em; font-weight:600; }
        /* Scan line */
        .scan-line-amber { position:absolute; left:0; right:0; height:100px; background:linear-gradient(180deg,transparent,rgba(249,115,22,0.15),transparent); pointer-events:none; z-index:50; animation:scanAmber 4s linear infinite; }
        /* Underline glow pulse (applied after draw animation) */
        @keyframes linePulse { 0%,100%{box-shadow:none} 50%{box-shadow:0 0 8px rgba(249,115,22,0.6)} }
        /* Deployment ready dot pulse */
        @keyframes dotReady { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}} />
        </>
    );
}

// --- PHASE 1 ---
function LiveClock() {
    const [time, setTime] = useState('');
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const d = now.toLocaleDateString('en-GB').replace(/\//g, '.');
            const t = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setTime(`${d} · ${t}`);
        };
        tick();
        const int = setInterval(tick, 1000);
        return () => clearInterval(int);
    }, []);
    return <span className="font-mono text-[9px]" style={{ color: 'rgba(249,115,22,0.4)' }}>{time}</span>;
}

function SpotlightCard({ children, className }: any) {
    const ref = useRef<HTMLDivElement>(null);
    const handleMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        ref.current.style.background = `radial-gradient(circle at ${x}% ${y}%,rgba(249,115,22,0.06) 0%,transparent 60%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(249,115,22,0.03))`;
    }, []);
    const handleLeave = useCallback(() => {
        if (ref.current) ref.current.style.background = '';
    }, []);
    return (
        <div ref={ref} className={`molten-card ${className}`} onMouseMove={handleMove} onMouseLeave={handleLeave}>
            {children}
        </div>
    );
}

function Phase1Intake({ formData, setFormData, onGenerate }: any) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-12 w-full pt-4">

            {/* Hero Section */}
            <div className="flex justify-between items-end border-b border-[rgba(249,115,22,0.1)] pb-8">
                <div className="relative">
                    <div className="absolute pointer-events-none select-none font-['Cormorant_Garamond'] leading-none text-[rgba(249,115,22,0.04)]" style={{ fontSize: 280, top: -80, right: -40, zIndex: -1 }}>02</div>
                    <div className="font-mono text-[10px] mb-4" style={{ color: 'rgba(249,115,22,0.5)' }}>PROPOSAL_ENGINE / BRIEF_INTAKE</div>
                    <div className="heading-hero">Forge Your</div>
                    <div className="heading-hero-bold relative inline-block">
                        Procurement Proposal
                        <motion.div
                            initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1, delay: 0.5 }}
                            className="absolute -bottom-1 left-0 h-[2px]"
                            style={{ background: 'var(--gold)', animation: 'linePulse 3s ease-in-out infinite 1.5s' }}
                        />
                    </div>
                </div>
                <div className="flex gap-8 items-center hidden lg:flex">
                    {[{ label: 'Proposals Forged', val: '1,847' }, { label: 'Avg Cost Saved', val: '14.2%' }, { label: 'Client Win Rate', val: '94%' }].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.2 }} className="text-right">
                            <div className="mono-label text-[10px] mb-1">{s.label}</div>
                            <div className="hero-number text-3xl">{s.val}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl z-0">
                    <div className="scan-line-amber" />
                </div>

                {/* FIX 8: Spotlight card */}
                <SpotlightCard className="lg:col-span-2 p-8 flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-xs text-[var(--fire-bright)]">P-01 <span className="text-[var(--text-secondary)] opacity-60 ml-2">CLIENT_COMPANY</span></label>
                            <input type="text" className="molten-input w-full p-3 rounded" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-xs text-[var(--fire-bright)]">P-02 <span className="text-[var(--text-secondary)] opacity-60 ml-2">INDUSTRY_VERTICAL</span></label>
                            <select className="molten-input w-full p-3 rounded appearance-none" value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })}>
                                <option value="tech">Technology / SaaS</option>
                                <option value="finance">Finance / Banking</option>
                                <option value="healthcare">Healthcare / Pharma</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-xs text-[var(--fire-bright)]">P-03 <span className="text-[var(--text-secondary)] opacity-60 ml-2">OCCASION</span></label>
                            <select className="molten-input w-full p-3 rounded appearance-none" value={formData.occasion} onChange={e => setFormData({ ...formData, occasion: e.target.value })}>
                                <option value="employee_onboarding">Employee Onboarding</option>
                                <option value="corporate_gifting">Festive Corporate Gifting</option>
                                <option value="client_appreciation">Tier-1 Client Appreciation</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-[rgba(249,115,22,0.1)]">
                        <label className="font-mono text-xs text-[var(--fire-bright)]">P-04 <span className="text-[var(--text-secondary)] opacity-60 ml-2">BUDGET_PARAMETERS</span></label>
                        <div className="flex gap-4 mb-2">
                            <div className="flex-1">
                                <div className="font-mono text-[10px] text-[var(--text-muted)] mb-1">UNIT COST (INR)</div>
                                <input type="number" className="molten-input w-full p-3 rounded" value={formData.budgetPerUnit} onChange={e => setFormData({ ...formData, budgetPerUnit: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="flex-1">
                                <div className="font-mono text-[10px] text-[var(--text-muted)] mb-1">TOTAL KITS (QTY)</div>
                                <input type="number" className="molten-input w-full p-3 rounded" value={formData.totalUnits} onChange={e => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })} />
                            </div>
                        </div>
                        {/* FIX 5: Animated budget bar */}
                        <div className="relative mt-2" style={{ height: 8, borderRadius: 4, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.1)', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'linear-gradient(90deg,#c2410c,#f97316)', animation: 'barFill0 1.2s cubic-bezier(0.22,1,0.36,1) 0.1s both' }} />
                            <div style={{ position: 'absolute', top: 0, left: '70%', height: '100%', background: 'linear-gradient(90deg,#f97316,#f59e0b)', animation: 'barFill1 1.2s cubic-bezier(0.22,1,0.36,1) 0.25s both' }} />
                            <div style={{ position: 'absolute', top: 0, left: '85%', height: '100%', background: 'linear-gradient(90deg,#92400e,#b45309)', animation: 'barFill2 1.2s cubic-bezier(0.22,1,0.36,1) 0.4s both' }} />
                            <div style={{ position: 'absolute', top: 0, left: '95%', height: '100%', background: 'linear-gradient(90deg,#451a03,#78350f)', animation: 'barFill3 1.2s cubic-bezier(0.22,1,0.36,1) 0.55s both' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(255,255,255,0.12) 0%,transparent 50%,rgba(0,0,0,0.1) 100%)', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', top: 0, height: '100%', width: 30, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)', animation: 'barShimmer 5s linear infinite' }} />
                        </div>
                        <div className="flex font-mono text-[9px] justify-between text-[var(--text-secondary)] mt-0.5">
                            <span className="flex items-center gap-1"><span style={{ width: 6, height: 6, borderRadius: 1, background: '#f97316', display: 'inline-block' }} />70% PROD</span>
                            <span className="flex items-center gap-1"><span style={{ width: 6, height: 6, borderRadius: 1, background: '#f59e0b', display: 'inline-block' }} />15% PKG</span>
                            <span className="flex items-center gap-1"><span style={{ width: 6, height: 6, borderRadius: 1, background: '#b45309', display: 'inline-block' }} />10% LOGS</span>
                            <span className="flex items-center gap-1"><span style={{ width: 6, height: 6, borderRadius: 1, background: '#78350f', display: 'inline-block' }} />5% CNT</span>
                        </div>
                    </div>
                </SpotlightCard>

                {/* FIX 3: Rebuilt right panel */}
                <div className="lg:col-span-1 flex flex-col gap-5">
                    {/* TOP CARD: Deployment Command */}
                    <div className="molten-card flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center px-4 border-b border-[rgba(249,115,22,0.1)]" style={{ height: 32, background: 'rgba(249,115,22,0.06)' }}>
                            <span className="font-mono text-[10px] flex items-center gap-1.5">
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', display: 'inline-block', animation: 'dotReady 1.5s ease-in-out infinite' }} />
                                <span style={{ color: 'rgba(249,115,22,0.7)' }}>DEPLOYMENT_READY</span>
                            </span>
                            <LiveClock />
                        </div>
                        <div className="p-5 flex flex-col items-center">
                            <div className="font-mono text-[10px] text-[var(--text-muted)] mb-1">TOTAL DEPLOYMENT</div>
                            <div className="flex items-start">
                                <span className="text-[var(--fire)] text-3xl mt-1 mr-1">₹</span>
                                <span className="hero-number text-[50px] leading-none" style={{ textShadow: '0 0 20px rgba(245,158,11,0.4),0 0 60px rgba(245,158,11,0.15)' }}>
                                    {(formData.budgetPerUnit * formData.totalUnits).toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div className="font-mono text-[10px] mt-1" style={{ color: 'rgba(249,115,22,0.45)' }}>
                                ₹{formData.budgetPerUnit} × {formData.totalUnits} <span style={{ color: 'var(--fire)', animation: 'eqPulse 1.5s ease-in-out infinite' }}>=</span> ₹{(formData.budgetPerUnit * formData.totalUnits).toLocaleString('en-IN')}
                            </div>
                            <div className="w-full my-3 border-t border-[rgba(249,115,22,0.08)]" />
                            <div className="w-full grid grid-cols-2" style={{ border: '1px solid rgba(249,115,22,0.08)', borderRadius: 6 }}>
                                {[
                                    { label: 'PRODUCTS', amt: Math.round(formData.budgetPerUnit * formData.totalUnits * 0.7) },
                                    { label: 'PACKAGING', amt: Math.round(formData.budgetPerUnit * formData.totalUnits * 0.15) },
                                    { label: 'LOGISTICS', amt: Math.round(formData.budgetPerUnit * formData.totalUnits * 0.1) },
                                    { label: 'CONTINGENCY', amt: Math.round(formData.budgetPerUnit * formData.totalUnits * 0.05) },
                                ].map((cell, i) => (
                                    <div key={i} className="p-3" style={{ borderRight: i % 2 === 0 ? '1px solid rgba(249,115,22,0.08)' : 'none', borderBottom: i < 2 ? '1px solid rgba(249,115,22,0.08)' : 'none' }}>
                                        <div className="font-mono text-[8px] text-[var(--text-muted)] mb-0.5">{cell.label}</div>
                                        <div className="font-['Cormorant_Garamond'] font-[700] text-[15px] text-[var(--gold-text)]">₹{cell.amt.toLocaleString('en-IN')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM CARD: Mission strip + Forge button */}
                    <div className="molten-card p-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5 font-mono text-[10px] rounded p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(249,115,22,0.08)' }}>
                            <div><span style={{ color: 'rgba(249,115,22,0.4)' }}>▸ MODEL</span>{'   '}<span style={{ color: 'rgba(249,115,22,0.8)' }}>gemini-2.5-flash (v1beta)</span></div>
                            <div><span style={{ color: 'rgba(249,115,22,0.4)' }}>▸ UNITS</span>{'   '}<span style={{ color: 'rgba(249,115,22,0.8)' }}>{formData.totalUnits} kits</span></div>
                            <div><span style={{ color: 'rgba(249,115,22,0.4)' }}>▸ OCCASION</span>{' '}<span style={{ color: 'rgba(249,115,22,0.8)' }}>{formData.occasion}</span></div>
                        </div>
                        <button
                            onClick={onGenerate}
                            className="w-full rounded-md font-bold text-center tracking-wide relative overflow-hidden"
                            style={{ height: 60, background: 'linear-gradient(90deg,#c2410c,#ea580c,#c2410c,#ea580c)', backgroundSize: '200%', animation: 'gradientShift 3s linear infinite', color: 'var(--white-hot)', fontFamily: '"Space Mono",monospace', fontSize: 13 }}
                            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.boxShadow = '0 0 30px rgba(249,115,22,0.5),0 0 60px rgba(249,115,22,0.25)'; b.style.transform = 'translateY(-1px) scale(1.01)'; }}
                            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.boxShadow = ''; b.style.transform = ''; }}
                        >
                            <div style={{ position: 'absolute', top: 0, height: '100%', width: 60, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)', transform: 'skewX(-20deg)', animation: 'buttonStreak 3s ease-in-out infinite', pointerEvents: 'none' }} />
                            FORGE PROPOSAL ↗
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- PHASE 2 ---
function Phase2Generating({ formData }: any) {
    const [dots, setDots] = useState('.');
    useEffect(() => {
        const int = setInterval(() => {
            setDots(d => d.length >= 3 ? '.' : d + '.');
        }, 500);
        return () => clearInterval(int);
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center flex-1 h-full min-h-[60vh]">
            <div className="text-[var(--fire)] text-2xl font-[800] mb-8 tracking-wider uppercase font-['Bricolage_Grotesque']">
                Forging Procurement Brief{dots}
            </div>

            <div className="w-full max-w-2xl molten-card rounded-lg overflow-hidden">
                {/* Terminal Header */}
                <div className="flex bg-[rgba(0,0,0,0.4)] px-4 py-2 border-b border-[rgba(249,115,22,0.2)] items-center">
                    <div className="flex gap-2 mr-4">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="font-mono text-[10px] text-[rgba(249,115,22,0.5)] flex-1 text-center">
                        rayeva-ai — proposal-forge v2 — gemini-2.5-flash
                    </div>
                </div>

                {/* Terminal Body */}
                <div className="p-6 font-mono text-sm flex flex-col gap-2 min-h-[200px]">
                    <div className="text-[rgba(249,115,22,0.4)]">[OK] Injecting client dataset: {formData.companyName}</div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[rgba(249,115,22,0.4)]">
                        [OK] Calculating margin safety buffers: 10%
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-[var(--gold)]">
                        [PROC] Scraping vendor certifications for: ₹{formData.budgetPerUnit} tier
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }} className="text-[var(--fire-bright)] flex items-center gap-2">
                        <Activity size={14} className="animate-spin" />
                        Retrieving gemini-2.5-flash payload...
                    </motion.div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 w-full bg-[#0d0703]">
                    <motion.div
                        initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3.5, ease: 'linear' }}
                        className="h-full" style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24)', boxShadow: '0 0 8px rgba(249,115,22,0.6)' }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

// --- PHASE 3 ---
function Phase3Deck({ formData, proposal, setProposalData }: any) {
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const bBreakdown = proposal.budget_breakdown;

    const [instruction, setInstruction] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInstruction(transcript);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    const handleRefine = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!instruction.trim() || isRefining) return;
        setIsRefining(true);
        try {
            const res = await fetch('http://localhost:3001/api/v1/proposals/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentProposal: proposal,
                    instruction,
                    input: formData
                })
            });
            if (!res.ok) throw new Error("Refinement API failed.");
            const json = await res.json();
            setProposalData(json.data);
            setInstruction('');
        } catch (err) {
            console.error(err);
            alert("Refinement Failed. Please try again.");
        } finally {
            setIsRefining(false);
        }
    };

    const exportPdf = () => {
        const element = document.getElementById('proposal-deck-content');
        if (!element) return;
        
        const opt = {
            margin:       [10, 10, 10, 10],
            filename:     `ForgeProcure_${proposal.proposal_id.substring(0,8)}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#080501' },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Use the globally injected html2pdf
        //@ts-ignore 
        window.html2pdf().set(opt).from(element).save();
    };

    const handleUpdateProduct = (idx: number, newCost: number, newQty: number) => {
        // Deep copy
        const newMix = [...proposal.product_mix];
        newMix[idx] = { ...newMix[idx], unit_cost_inr: newCost, quantity_per_kit: newQty };
        
        // Live Recalculation Engine
        const products_total = newMix.reduce((sum, p) => sum + (p.unit_cost_inr * p.quantity_per_kit), 0);
        
        // Math matches backend architecture ratios
        const packaging = Math.round(products_total * (15 / 70));
        const logistics_buffer = Math.round(products_total * (10 / 70));
        const contingency = Math.round(products_total * (5 / 70));
        const grand_total = products_total + packaging + logistics_buffer + contingency;
        
        const reqTotal = formData.budgetPerUnit * formData.totalUnits;
        const budget_utilization_percent = Number(((grand_total / reqTotal) * 100).toFixed(1));

        setProposalData({
            ...proposal,
            product_mix: newMix,
            budget_breakdown: { ...bBreakdown, products_total, packaging, logistics_buffer, contingency, grand_total, budget_utilization_percent }
        });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col gap-6 w-full -mt-4 relative">
            {/* Cinematic Stamp Header */}
            <div className="w-full text-left font-mono text-[10px] leading-relaxed relative flex justify-between items-end border-b border-[rgba(249,115,22,0.15)] pb-6 mb-4">
                <div className="flex flex-col gap-1">
                    <div className="text-[var(--gold)] font-['Bricolage_Grotesque'] tracking-widest text-xs mb-1">FORGEPROCURE_FORGE_AI</div>
                    <div className="text-[var(--text-muted)]">PROPOSAL_ID: <span className="text-[var(--text-primary)]">{proposal.proposal_id.substring(0, 18).toUpperCase()}</span></div>
                    <div className="text-[var(--text-muted)]">PREPARED FOR: <span className="text-[var(--fire-bright)]">{proposal.client_summary.company}</span></div>
                    <div className="text-[var(--text-muted)]">DATE GENERATED: <span className="text-[var(--text-primary)]">{dateStr}</span></div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                    <div className="border border-[rgba(249,115,22,0.3)] bg-[rgba(249,115,22,0.05)] px-3 py-1 text-[var(--fire-bright)] inline-block mb-1 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                        CONFIDENTIAL — B2B PROCUREMENT
                    </div>
                    <div className="text-[var(--text-muted)]">OCCASION: <span className="text-[var(--gold)] border-b border-dashed border-[rgba(245,158,11,0.5)]">{formData.occasion.replace(/_/g, ' ')}</span></div>
                    <div className="text-[var(--text-muted)]">VALIDITY: <span className="text-[var(--text-primary)]">30 DAYS</span></div>
                </div>
            </div>

            <div className="flex gap-8 lg:gap-12 mt-2 relative z-10">
                {/* Advanced Light-Line Timeline Sidebar */}
                <div className="w-56 shrink-0 hidden md:block relative">
                    {/* Glowing vertical line */}
                    <div className="absolute left-[5px] top-6 bottom-32 w-[1px] bg-[rgba(249,115,22,0.1)]">
                        <div className="absolute top-0 w-[1px] h-32 bg-[var(--fire)]" style={{ transform: 'translateY(-10px)', animation: 'barShimmer 8s linear infinite', boxShadow: '0 0 10px var(--fire)' }} />
                    </div>

                    <div className="flex flex-col gap-4 relative z-10 pt-2 sticky top-[100px]">
                        <NavItem active num="01">Product Mix</NavItem>
                        <NavItem num="02">Budget Breakdown</NavItem>
                        <NavItem num="03">Impact Metrics</NavItem>
                        <NavItem num="04">Narrative</NavItem>
                        <NavItem num="05">Quality Score</NavItem>

                        <div className="mt-12 flex flex-col gap-3">
                            <button className="molten-card p-3 w-full font-mono text-[10px] text-center border-[rgba(249,115,22,0.15)] text-[var(--gold)] hover:border-[var(--fire)] hover:text-[var(--fire-bright)] hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all tracking-wider relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(249,115,22,0.08)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                ↗ SAVE PROPOSAL
                            </button>
                            <button onClick={exportPdf} className="w-full py-2 font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors tracking-widest uppercase">
                                ⬇ Export PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div id="proposal-deck-content" className="flex-1 flex flex-col gap-16 pb-32 max-w-4xl relative">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl z-0">
                        <div className="scan-line-amber" />
                    </div>
                    <SectionProductMix products={proposal.product_mix} onUpdateProduct={handleUpdateProduct} />
                    <SectionBudget breakdown={bBreakdown} reqTotal={formData.budgetPerUnit * formData.totalUnits} />
                    <SectionImpact impact={proposal.impact_summary} />
                    <SectionNarrative narrative={proposal.proposal_narrative} company={proposal.client_summary.company} />
                    <SectionQuality score={proposal.proposal_quality_score} warnings={proposal.warnings} />
                </div>
            </div>

            {/* Refine with AI Chat */}
            <form onSubmit={handleRefine} className="fixed bottom-6 right-6 z-50 molten-card p-4 w-96 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[var(--fire-bright)] uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        Refine with AI
                    </span>
                    {isRefining && <span className="font-mono text-[9px] text-[var(--gold)] animate-pulse">Processing...</span>}
                </div>
                <div className="flex gap-2">
                    <button 
                        type="button" 
                        onClick={startListening} 
                        disabled={isRefining || isListening} 
                        className={`px-3 py-2 rounded transition-colors border ${isListening ? 'bg-[rgba(239,68,68,0.2)] border-red-500 text-red-400' : 'bg-[rgba(249,115,22,0.1)] border-[rgba(249,115,22,0.3)] hover:bg-[rgba(249,115,22,0.2)] hover:border-[var(--fire)] text-[var(--gold)]'}`}
                        title="Voice Instruct"
                    >
                        <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
                    </button>
                    <input 
                        type="text" 
                        value={instruction} 
                        onChange={e => setInstruction(e.target.value)}
                        placeholder="e.g. Swap coasters for bamboo notebooks..." 
                        className="molten-input flex-1 px-3 py-2 text-xs font-['Bricolage_Grotesque'] placeholder:text-[rgba(255,255,255,0.2)]"
                        disabled={isRefining || isListening}
                    />
                    <button type="submit" disabled={isRefining || !instruction.trim()} className="bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.3)] hover:bg-[rgba(249,115,22,0.2)] hover:border-[var(--fire)] text-[var(--gold)] px-4 py-2 rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        ↲
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

function NavItem({ active, num, children }: { active?: boolean, num: string, children: React.ReactNode }) {
    if (active) {
        return (
            <div className="flex items-center gap-3 cursor-pointer group">
                <div className="relative w-3 h-3 flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 rounded-full bg-[var(--fire)] animate-ping opacity-20" />
                    <div className="w-2 h-2 rounded-full bg-[var(--fire)] shadow-[0_0_10px_var(--fire)]" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.15)]">
                    <span className="font-['Cormorant_Garamond'] text-[rgba(249,115,22,0.5)] font-bold italic">{num}</span>
                    <span className="font-mono text-[11px] text-[var(--fire-bright)] tracking-wide shadow-sm">{children}</span>
                </div>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-3 cursor-pointer group hover:translate-x-1 transition-transform">
            <div className="w-3 h-3 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[rgba(249,115,22,0.15)] group-hover:bg-[rgba(249,115,22,0.4)] transition-colors" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5">
                <span className="font-['Cormorant_Garamond'] text-[rgba(255,255,255,0.1)] font-bold italic group-hover:text-[rgba(249,115,22,0.3)] transition-colors">{num}</span>
                <span className="font-mono text-[11px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors tracking-wide">{children}</span>
            </div>
        </div>
    );
}

function SectionProductMix({ products, onUpdateProduct }: any) {
    const getAccent = (cat: string) => {
        const c = cat.toLowerCase();
        if (c.includes('stationery')) return '#f97316';
        if (c.includes('drink') || c.includes('bottle')) return '#38bdf8';
        if (c.includes('apparel') || c.includes('bag')) return '#fb923c';
        if (c.includes('food') || c.includes('snack')) return '#84cc16';
        if (c.includes('care') || c.includes('bath')) return '#d946ef';
        return '#f59e0b'; // default gold
    };

    return (
        <section className="relative pt-6">
            <div className="absolute top-0 right-0 font-['Cormorant_Garamond'] text-[96px] text-[rgba(249,115,22,0.04)] leading-none select-none -translate-y-6">01</div>
            <h2 className="text-[var(--fire)] font-['Bricolage_Grotesque'] font-[800] text-xl mb-6 flex items-center gap-3">CURATED PRODUCT MIX <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[rgba(249,115,22,0.1)] text-[var(--fire-bright)] font-normal border border-[rgba(249,115,22,0.2)] tracking-widest">INTERACTIVE_MODE_ACTIVE</span></h2>

            <div className="flex flex-col gap-4 relative z-10">
                {products.map((p: any, idx: number) => (
                    <ProductCard
                        key={idx}
                        idx={idx}
                        name={p.product_name}
                        cost={p.unit_cost_inr}
                        qty={p.quantity_per_kit}
                        color={getAccent(p.category)}
                        slug={p.category.replace(/\s+/g, '_').toLowerCase()}
                        story={p.sustainability_story}
                        why={p.why_this_product}
                        onUpdateProduct={onUpdateProduct}
                    />
                ))}
            </div>
        </section>
    );
}

function ProductCard({ idx, name, cost, qty, color, slug, story, why, onUpdateProduct }: any) {
    return (
        <div className="molten-card group overflow-hidden relative border border-[rgba(249,115,22,0.08)] hover:border-[rgba(249,115,22,0.25)] transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: color }} />
            <div className="p-5 pl-7 flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded border" style={{ borderColor: 'rgba(249,115,22,0.25)', color: 'var(--fire-bright)' }}>{slug}</span>
                        <div className="flex items-center text-[var(--text-muted)] font-mono text-xs gap-1">
                            QTY: 
                            <input 
                                type="number" 
                                value={qty} 
                                onChange={(e) => onUpdateProduct(idx, cost, parseInt(e.target.value) || 0)}
                                className="w-12 bg-transparent border-b border-transparent focus:outline-none focus:border-[var(--fire)] text-center px-1 pb-0.5 transition-colors"
                            />
                        </div>
                    </div>
                    <h3 className="font-['Bricolage_Grotesque'] font-[600] text-[16px] text-[var(--text-primary)] group-hover:translate-x-1 transition-transform">
                        {name}
                    </h3>
                    <p className="font-['Bricolage_Grotesque'] text-[13px] text-[var(--text-secondary)] mt-2 font-[400] max-w-xl pr-4">
                        {story}
                    </p>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] mt-2 border-l-2 pl-2 border-[var(--border-mid)] max-w-xl uppercase">
                        {why}
                    </p>
                </div>
                <div className="text-right flex flex-col justify-end items-end relative z-10">
                    <div className="font-mono text-[10px] text-[var(--text-muted)] mb-1">UNIT COST</div>
                    <div className="flex items-center font-['Cormorant_Garamond'] font-[700] text-[24px] text-[var(--gold-text)]">
                        <span className="mr-1 opacity-70">₹</span>
                        <input 
                            type="number" 
                            value={cost}
                            onChange={(e) => onUpdateProduct(idx, parseInt(e.target.value) || 0, qty)}
                            className="bg-transparent border-b border-transparent focus:border-[var(--fire)] border-dashed focus:border-solid focus:outline-none text-right w-24 hover:bg-[rgba(249,115,22,0.05)] rounded px-1 transition-colors z-20"
                        />
                    </div>
                    <div className="w-24 h-[3px] rounded mt-2 ml-auto" style={{ background: 'linear-gradient(90deg, var(--fire), var(--gold))' }} />
                </div>
            </div>
        </div>
    );
}

function SectionBudget({ breakdown, reqTotal }: any) {
    const format = (n: number) => `₹${n.toLocaleString('en-IN')}`;

    // Calculate relative percentages for the donut chart based on actual values
    const grandTotal = breakdown.products_total + breakdown.packaging + breakdown.logistics_buffer + breakdown.contingency;
    const pProd = (breakdown.products_total / grandTotal) * 100;
    const pPkg = (breakdown.packaging / grandTotal) * 100 + pProd;
    const pLog = (breakdown.logistics_buffer / grandTotal) * 100 + pPkg;

    return (
        <section className="relative pt-6 border-t border-[rgba(249,115,22,0.1)]">
            <div className="absolute top-0 right-0 font-['Cormorant_Garamond'] text-[96px] text-[rgba(249,115,22,0.04)] leading-none select-none -translate-y-6">02</div>
            <h2 className="text-[var(--fire)] font-['Bricolage_Grotesque'] font-[800] text-xl mb-6">BUDGET ALLOCATION</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="molten-card p-6 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
                    {/* Background glow for the chart */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08)_0%,transparent_70%)] pointer-events-none" />

                    {/* Fake Donut Chart via CSS gradients */}
                    <div className="w-48 h-48 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(249,115,22,0.2)]"
                        style={{
                            background: `conic-gradient(#f97316 0% ${pProd}%, #f59e0b ${pProd}% ${pPkg}%, #78350f ${pPkg}% ${pLog}%, #451a03 ${pLog}% 100%)`
                        }}>
                        <div className="absolute inset-0 rounded-full border border-[rgba(249,115,22,0.3)] pointer-events-none" />
                        <div className="w-36 h-36 bg-[var(--bg-card)] rounded-full flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative z-10 border border-[rgba(249,115,22,0.1)] backdrop-blur-md">
                            <span className="font-mono text-[9px] text-[var(--fire-bright)] mb-1">GRAND TOTAL</span>
                            <span className="font-['Cormorant_Garamond'] font-[900] text-[26px] text-[var(--white-hot)] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{format(breakdown.grand_total)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <BudgetRow label="Products" amount={format(breakdown.products_total)} color="#f97316" />
                    <BudgetRow label="Packaging" amount={format(breakdown.packaging)} color="#f59e0b" />
                    <BudgetRow label="Logistics" amount={format(breakdown.logistics_buffer)} color="#78350f" />
                    <BudgetRow label="Contingency" amount={format(breakdown.contingency)} color="#451a03" />

                    <div className="mt-4 pt-4 border-t border-[rgba(249,115,22,0.1)]">
                        <div className="flex justify-between font-mono text-[10px] mb-2 text-[var(--text-muted)]">
                            <span>UTILIZATION RATE <span className="text-[rgba(249,115,22,0.4)]">[{format(breakdown.grand_total)} / {format(reqTotal)}]</span></span>
                            <span className="text-[var(--gold)] drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">{breakdown.budget_utilization_percent}%</span>
                        </div>
                        <div className="h-2 w-full bg-[rgba(0,0,0,0.5)] rounded overflow-hidden border border-[rgba(249,115,22,0.15)] relative">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDIgMk0wIDRMMCA0TDIgMk0yIDJMNCA0TDIgMkw0IDAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] pointer-events-none opacity-50 z-10" />
                            <div className="h-full rounded relative z-0" style={{ width: `${Math.min(breakdown.budget_utilization_percent, 100)}%`, background: 'linear-gradient(90deg, #c2410c, #f59e0b)', boxShadow: '0 0 12px rgba(249,115,22,0.4)' }}>
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" style={{ animation: 'barShimmer 2s infinite linear' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function BudgetRow({ label, amount, color }: any) {
    return (
        <div className="flex justify-between items-center group cursor-default">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: color, color: color }} />
                <span className="font-mono text-[11px] text-[var(--text-secondary)] uppercase group-hover:text-[var(--text-primary)] transition-colors">{label}</span>
            </div>
            <div className="font-['Cormorant_Garamond'] font-[600] text-[18px] text-[var(--gold-text)] relative">
                <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 border-t border-dashed border-[rgba(249,115,22,0.2)] group-hover:border-[var(--fire)] transition-colors" />
                {amount}
            </div>
        </div>
    );
}

function SectionImpact({ impact }: any) {
    return (
        <section className="relative pt-6 border-t border-[rgba(249,115,22,0.1)]">
            <div className="absolute top-0 right-0 font-['Cormorant_Garamond'] text-[96px] text-[rgba(249,115,22,0.04)] leading-none select-none -translate-y-6">03</div>
            <h2 className="text-[var(--fire)] font-['Bricolage_Grotesque'] font-[800] text-xl mb-6">MEASURABLE ESG IMPACT</h2>

            <div className="grid grid-cols-2 gap-4 relative z-10 mb-4">
                <div className="molten-card p-6 flex flex-col justify-between">
                    <div className="font-mono text-[10px] text-[var(--fire-bright)] mb-2 flex justify-between">
                        <span>PLASTIC AVOIDED</span>
                        <span>PER KIT</span>
                    </div>
                    <div className="font-['Cormorant_Garamond'] font-[900] text-[56px] text-[var(--gold-text)] leading-none my-2 flex items-baseline gap-1">
                        {impact.plastic_avoided_grams_per_kit} <span className="text-xl text-[var(--text-muted)]">g</span>
                    </div>
                </div>
                <div className="molten-card p-6 flex flex-col justify-between">
                    <div className="font-mono text-[10px] text-[var(--fire-bright)] mb-2">LOCAL SOURCING</div>
                    <div className="font-['Cormorant_Garamond'] font-[900] text-[56px] text-[var(--gold-text)] leading-none my-2">
                        {impact.local_sourcing_percent}%
                    </div>
                </div>
            </div>

            <div className="molten-card p-5 border-l-[4px] border-l-[var(--gold)]">
                <p className="font-['Bricolage_Grotesque'] font-[500] text-[15px] text-[var(--text-primary)] leading-relaxed relative z-10">
                    "{impact.headline_impact_statement}"
                </p>
                <div className="flex gap-2 mt-4 flex-wrap">
                    {(impact.certifications_represented || []).map((cert: string) => (
                        <span key={cert} className="px-2 py-1 font-mono text-[9px] rounded uppercase" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: 'var(--fire-bright)' }}>
                            {cert}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SectionNarrative({ narrative, company }: any) {
    return (
        <section className="relative pt-6 border-t border-[rgba(249,115,22,0.1)]">
            <div className="absolute top-0 right-0 font-['Cormorant_Garamond'] text-[96px] text-[rgba(249,115,22,0.04)] leading-none select-none -translate-y-6">04</div>
            <h2 className="text-[var(--fire)] font-['Bricolage_Grotesque'] font-[800] text-xl mb-6">PROPOSAL NARRATIVE</h2>

            <div className="molten-card p-6 border border-[rgba(249,115,22,0.1)] relative overflow-hidden">
                <div className="font-mono text-[10px] text-[rgba(249,115,22,0.35)] border-b border-[rgba(249,115,22,0.1)] pb-3 mb-4 flex gap-4">
                    <span>TO: client@{company.toLowerCase().replace(/\s+/g, '')}.com</span>
                    <span>FR: Rayeva AI</span>
                    <span>RE: Sustainable Gifting Proposal</span>
                </div>

                <p className="font-['Bricolage_Grotesque'] font-[500] text-[15px] text-[var(--text-primary)] leading-relaxed mb-6">
                    {narrative}
                    <span className="inline-block w-[6px] h-[14px] bg-[rgba(249,115,22,0.8)] ml-1" style={{ animation: 'cursorBlink 1s step-end infinite' }} />
                </p>

                <div className="font-['Cormorant_Garamond'] italic text-[var(--gold)] text-lg">
                    Rayeva Procurement AI
                </div>
            </div>
        </section>
    );
}

function SectionQuality({ score, warnings }: any) {
    const isStrong = score >= 85;
    const hasWarnings = warnings && warnings.length > 0;
    const statusMsg = hasWarnings ? "REVISION NEEDED — Needs manual review" : (isStrong ? "STRONG — Ready for deployment" : "FAIR — Review constraints");

    const ringColor = hasWarnings ? 'rgba(239,68,68,0.8)' : (isStrong ? 'rgba(245,158,11,0.8)' : 'rgba(249,115,22,0.6)');
    const shadowColor = hasWarnings ? 'rgba(239,68,68,0.3)' : (isStrong ? 'rgba(245,158,11,0.3)' : 'rgba(249,115,22,0.2)');

    return (
        <section className="relative pt-6 border-t border-[rgba(249,115,22,0.1)]">
            <div className="absolute top-0 right-0 font-['Cormorant_Garamond'] text-[96px] text-[rgba(249,115,22,0.04)] leading-none select-none -translate-y-6">05</div>
            <h2 className="text-[var(--fire)] font-['Bricolage_Grotesque'] font-[800] text-xl mb-6">QUALITY ANALYSIS</h2>

            <div className="molten-card p-8 flex flex-col md:flex-row gap-10 items-center relative overflow-hidden">
                {/* Background hazard stripes if warnings exist */}
                {hasWarnings && (
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 2px, transparent 2px, transparent 8px)' }} />
                )}

                <div className="relative w-40 h-40 rounded-full flex items-center justify-center shrink-0" style={{ boxShadow: `0 0 40px ${shadowColor}, inset 0 0 20px rgba(0,0,0,0.5)` }}>
                    {/* Rotating outer dash ring */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-t-transparent animate-[spin_10s_linear_infinite]" style={{ borderColor: ringColor }} />
                    <div className="absolute inset-2 rounded-full border border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.4)]" />

                    <div className="relative flex flex-col items-center justify-center pt-2">
                        <div className="font-['Cormorant_Garamond'] font-[900] text-[64px] leading-none tracking-tighter" style={{ color: hasWarnings ? '#fca5a5' : 'var(--white-hot)', textShadow: `0 0 15px ${shadowColor}` }}>
                            {score}
                        </div>
                        <div className="font-mono text-[9px] uppercase tracking-widest mt-1 opacity-60" style={{ color: hasWarnings ? '#ef4444' : 'var(--gold)' }}>SCORE</div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4 w-full relative z-10">
                    <div className="flex justify-between items-end border-b pb-2" style={{ borderColor: hasWarnings ? 'rgba(239,68,68,0.2)' : 'rgba(249,115,22,0.2)' }}>
                        <div>
                            <div className="font-mono text-[10px] text-[var(--text-muted)] mb-1">SYSTEM_STATUS</div>
                            <div className="font-mono text-[13px] tracking-wide flex items-center gap-2" style={{ color: hasWarnings ? '#ef4444' : 'var(--gold)' }}>
                                {hasWarnings ? <span className="animate-pulse">⚠</span> : <span style={{ color: '#10b981' }}>●</span>}
                                {statusMsg}
                            </div>
                        </div>
                    </div>

                    {hasWarnings ? (
                        <div className="flex flex-col gap-2 mt-2 bg-[rgba(239,68,68,0.05)] p-4 border border-[rgba(239,68,68,0.2)] rounded">
                            <div className="font-mono text-[9px] text-red-400 mb-1 border-b border-red-900/30 pb-1">ALERT_LOG</div>
                            {warnings.map((w: string, i: number) => (
                                <div key={i} className="text-[11px] font-mono text-red-300">› {w}</div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 mt-2">
                            <div className="flex justify-between font-mono text-[9px] text-[var(--text-muted)] uppercase mb-1">
                                <span>Optimization Level</span>
                                <span className="text-[var(--gold)]">{score}/100</span>
                            </div>
                            <div className="h-2 w-full bg-[rgba(0,0,0,0.5)] rounded overflow-hidden border border-[rgba(249,115,22,0.15)] relative">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDIgMk0wIDRMMCA0TDIgMk0yIDJMNCA0TDIgMkw0IDAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] pointer-events-none opacity-50 z-10" />
                                <div className="h-full rounded relative z-0" style={{ width: `${Math.min(score, 100)}%`, background: 'linear-gradient(90deg, #ea580c, #fcd34d)', boxShadow: '0 0 10px rgba(245,158,11,0.5)' }}>
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)]" style={{ animation: 'barShimmer 2s infinite linear' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
