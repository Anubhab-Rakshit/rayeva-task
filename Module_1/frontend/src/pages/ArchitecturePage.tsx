import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─────────────── tokens ─────────────── */
const G = 'rgba(74,222,128,';
const A = 'rgba(251,191,36,';

/* ─────────────── helper fade ─────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay },
});

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════ */
export function ArchitecturePage() {
  return (
    <div className="w-full bg-[#020807] text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
      {/* global keyframes */}
      <style>{`
        @keyframes dashFlow { to { stroke-dashoffset: -20; } }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 12px ${G}0.25); }
          50%      { box-shadow: 0 0 32px ${G}0.55); }
        }
        @keyframes pulseGlowAmber {
          0%,100% { box-shadow: 0 0 12px ${A}0.25); }
          50%      { box-shadow: 0 0 32px ${A}0.55); }
        }
        @keyframes shimmer {
          from { background-position: -200% 0; }
          to   { background-position:  200% 0; }
        }
        @keyframes typewriter {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes blink { 50% { opacity:0; } }
        .shimmer-text {
          background: linear-gradient(90deg,
            rgba(74,222,128,0.3) 0%,
            rgba(134,239,172,1) 40%,
            rgba(74,222,128,0.3) 80%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .amber-shimmer {
          background: linear-gradient(90deg,
            rgba(251,191,36,0.3) 0%,
            rgba(253,224,71,1)  40%,
            rgba(251,191,36,0.3) 80%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .flow-line {
          stroke-dasharray: 6 4;
          animation: dashFlow 1.2s linear infinite;
        }
        .glow-card { animation: pulseGlow 3s ease-in-out infinite; }
        .glow-card-amber { animation: pulseGlowAmber 3s ease-in-out infinite; }
        .code-block {
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(74,222,128,0.12);
          border-left: 3px solid rgba(74,222,128,0.5);
          border-radius: 8px;
          padding: 18px 20px;
          font-size: 11.5px;
          line-height: 2;
          font-family: 'Geist Mono', 'Space Mono', monospace;
          overflow-x: auto;
        }
        .chat-bubble-user {
          background: linear-gradient(135deg, #ffffff, #f0fdf4);
          color: #020807;
          border-radius: 16px 16px 4px 16px;
        }
        .chat-bubble-bot {
          background: rgba(74,222,128,0.07);
          border: 1px solid rgba(74,222,128,0.2);
          border-radius: 4px 16px 16px 16px;
        }
        .chat-bubble-escalate {
          background: rgba(251,191,36,0.07);
          border: 1px solid rgba(251,191,36,0.25);
          border-left: 3px solid rgba(251,191,36,0.7);
          border-radius: 4px 16px 16px 16px;
        }
      `}</style>

      {/* ── Banner ── */}
      <div className="w-full flex items-center justify-between px-8 py-3 border-b"
        style={{ background: `${G}0.04)`, borderColor: `${G}0.1)` }}>
        <span style={{ fontFamily: "'Geist Mono','Space Mono',monospace", fontSize: 11, color: `${G}0.6)` }}>
          <span style={{ color: `${G}1)`, marginRight: 8 }}>ARCHITECTURE_MODE</span>
          — Modules 3 & 4 are designed and ready for implementation
        </span>
        <span className="px-3 py-1 rounded text-[10px]"
          style={{ border: `1px solid ${G}0.3)`, color: `${G}1)`, fontFamily: "'Geist Mono',monospace" }}>
          SCOPE: OUTLINED PER ASSIGNMENT BRIEF
        </span>
      </div>

      {/* ══════════ MODULE 3 ══════════ */}
      <section className="relative w-full max-w-6xl mx-auto px-8 pt-24 pb-40">

        {/* ── Section label ── */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: `${G}0.3)` }} />
          <span className="text-[11px] tracking-[0.25em] uppercase"
            style={{ color: `${G}0.5)`, fontFamily: "'Geist Mono',monospace" }}>
            Module 03 — Impact Intelligence
          </span>
        </motion.div>

        {/* ── Hero headline ── */}
        <motion.div {...fadeUp(0.05)} className="relative mb-20">
          {/* Giant watermark */}
          <div className="absolute -top-10 -left-4 font-black pointer-events-none select-none leading-none"
            style={{ fontSize: 220, color: `${G}0.025)`, fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900 }}>
            03
          </div>
          <h1 className="relative z-10 font-black uppercase leading-none"
            style={{ fontSize: 56, letterSpacing: '-0.02em', fontFamily: "'Cabinet Grotesk',sans-serif" }}>
            <span className="shimmer-text">AI Impact</span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Reporting Generator</span>
          </h1>
          <p className="mt-4 text-[15px] max-w-xl" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Instrument Sans',sans-serif" }}>
            Automated environmental & social impact quantification per procurement order — turning data into decisions that matter.
          </p>
        </motion.div>

        {/* ── Data Pipeline Diagram ── */}
        <motion.div {...fadeUp(0.1)} className="mb-24">
          <SectionLabel>Data Pipeline</SectionLabel>
          <div className="mt-6 rounded-2xl overflow-hidden border"
            style={{ background: 'rgba(6,20,12,0.8)', borderColor: `${G}0.1)`, backdropFilter: 'blur(20px)' }}>
            {/* Top bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b"
              style={{ borderColor: `${G}0.06)`, background: 'rgba(0,0,0,0.3)' }}>
              {['#f97316','#eab308','#22c55e'].map(c => (
                <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
              ))}
              <span className="ml-3 text-[11px]" style={{ color: `${G}0.3)`, fontFamily: "'Geist Mono',monospace" }}>
                impact_pipeline.ts — processing...
              </span>
            </div>
            {/* Pipeline nodes */}
            <div className="flex items-center justify-between px-10 py-12">
              {[
                { emoji: '📦', label: 'ORDER DATA', sub: 'JSON Payload' },
                { emoji: '⚡', label: 'IMPACT ENGINE', sub: 'Logic Calculator', active: true },
                { emoji: '🧠', label: 'AI NARRATIVE', sub: 'Gemini 2.5 Flash' },
                { emoji: '🗄️', label: 'SUPABASE', sub: 'Persistent Store' },
                { emoji: '📄', label: 'REPORT OUT', sub: 'Client-Ready' },
              ].map((node, i, arr) => (
                <React.Fragment key={node.label}>
                  <PipeNode {...node} />
                  {i < arr.length - 1 && <PipeArrow />}
                </React.Fragment>
              ))}
            </div>

            {/* Secondary flow */}
            <div className="border-t px-10 py-8 flex items-center justify-center gap-4"
              style={{ borderColor: `${G}0.06)`, background: 'rgba(0,0,0,0.2)' }}>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: `${G}0.3)`, fontFamily: "'Geist Mono',monospace" }}>
                Logic Layer:
              </span>
              {[
                { emoji: '🏷️', label: 'PRODUCT_META' },
                { emoji: '🔢', label: 'ORDER_QTY' },
                { emoji: '📋', label: 'CATEGORY_RULES' },
              ].map((n, i, arr) => (
                <React.Fragment key={n.label}>
                  <SmallNode {...n} />
                  {i < arr.length - 1 && <span className="text-[10px]" style={{ color: `${G}0.3)` }}>+</span>}
                </React.Fragment>
              ))}
              <SmallArrow />
              <SmallNode emoji="⚙️" label="CALCULATOR" active />
            </div>
          </div>
        </motion.div>

        {/* ── Four feature cards ── */}
        <SectionLabel>Feature Design</SectionLabel>
        <div className="mt-6 grid grid-cols-2 gap-6 mb-24">
          <motion.div {...fadeUp(0.05)}>
            <FeatureCard title="🧮 PLASTIC_CALC" badge="Estimation Engine">
              <CodeBlock>
                <Cm>// Plastic estimation logic</Cm>
                <br /><br />
                <Cv>base_plastic</Cv> {`= category_plastic_map[`}<br />
                &nbsp;&nbsp;product.category<br />
                ]<br /><br />
                <Ck>if</Ck> product.has_filter(<Cs>"plastic_free"</Cs>):<br />
                &nbsp;&nbsp;saved = base_plastic × order.quantity<br />
                <Ck>elif</Ck> product.has_filter(<Cs>"compostable"</Cs>):<br />
                &nbsp;&nbsp;saved = base_plastic × <Cn>0.7</Cn> × quantity<br /><br />
                <Ck>return</Ck> {'{ '}grams_saved: saved,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bottles_eq: saved/<Cn>28</Cn>{' }'}
              </CodeBlock>
            </FeatureCard>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <FeatureCard title="☁️ CARBON_CALC" badge="CO₂ Estimator">
              <CodeBlock>
                <Cm>// Logic-based, no external API needed</Cm>
                <br /><br />
                <Cv>transport_saved</Cv> = is_local_sourced<br />
                &nbsp;&nbsp;? avg_import_distance × <Cn>0.21</Cn><span style={{ color: '#94a3b8' }}>kg/km</span><br />
                &nbsp;&nbsp;: <Cn>0</Cn><br /><br />
                <Cv>production_saved</Cv> = category_carbon_map[<br />
                &nbsp;&nbsp;category<br />
                ] × (<Cn>1</Cn> - conventional_baseline)<br /><br />
                <Cv>total_co2_kg</Cv> = transport_saved<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ production_saved × quantity
              </CodeBlock>
              <div className="mt-3 px-3 py-2 rounded-lg text-[10px] font-mono"
                style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)', color: 'rgba(251,191,36,0.7)' }}>
                ⚠ Estimation-based. Methodology at /docs/carbon-methodology.md
              </div>
            </FeatureCard>
          </motion.div>

          <motion.div {...fadeUp(0.05)}>
            <FeatureCard title="📍 LOCAL_SOURCING" badge="Impact Metrics">
              <div className="flex flex-col gap-5 mt-2">
                {[
                  { label: 'LOCAL ARTISANS SUPPORTED', val: '6 communities', pct: 75 },
                  { label: 'TRANSPORT DISTANCE SAVED', val: '340 km avg', pct: 60 },
                  { label: 'ECONOMIC MULTIPLIER', val: '×2.3 GDP', pct: 85 },
                ].map(r => <MetricBar key={r.label} {...r} />)}
              </div>
              <p className="mt-5 text-[10px]" style={{ color: `${G}0.3)`, fontFamily: "'Geist Mono',monospace" }}>
                Derived from: product.origin_region + supplier_zone
              </p>
            </FeatureCard>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <FeatureCard title="📝 AI NARRATIVE OUTPUT" badge="Generated Statement">
              <div className="mt-2 rounded-xl p-4"
                style={{ background: `${G}0.04)`, border: `1px solid ${G}0.15)`, borderLeft: `3px solid ${G}0.7)` }}>
                <div className="mb-2 text-[9px] tracking-widest" style={{ color: `${G}0.4)`, fontFamily: "'Geist Mono',monospace" }}>
                  ORDER #RVY-2024-0847 — IMPACT SUMMARY
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Instrument Sans',sans-serif" }}>
                  By choosing this order, <strong className="text-white">TechCorp India</strong> avoided <strong className="text-white">6.8kg of plastic</strong>, supported <strong className="text-white">3 artisan communities</strong> in Rajasthan & Kutch, and reduced carbon by <strong className="text-white">12.4kg CO₂</strong> — equivalent to planting 2 trees.
                </p>
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                {['✓ STORED WITH ORDER', '✓ SENT TO CLIENT', '✓ LOGGED TO DB'].map(l => (
                  <div key={l} className="px-2 py-1 rounded text-[9px] font-mono"
                    style={{ background: `${G}0.08)`, border: `1px solid ${G}0.2)`, color: `${G}0.9)` }}>{l}</div>
                ))}
              </div>
            </FeatureCard>
          </motion.div>
        </div>

        {/* ── DB Schema ── */}
        <motion.div {...fadeUp(0.05)} className="mb-24">
          <SectionLabel>Database Schema</SectionLabel>
          <div className="mt-6 rounded-2xl overflow-hidden border"
            style={{ borderColor: `${G}0.1)`, background: 'rgba(4,12,8,0.9)' }}>
            <div className="grid grid-cols-3 gap-0 px-6 py-3 border-b text-[11px] font-bold uppercase tracking-wider"
              style={{ borderColor: `${G}0.08)`, background: `${G}0.07)`, fontFamily: "'Geist Mono',monospace", color: `${G}0.6)` }}>
              <div>column_name</div><div>type</div><div>description</div>
            </div>
            {[
              ['id', 'uuid', 'Primary key'],
              ['order_id', 'uuid FK', 'References orders table'],
              ['product_ids', 'uuid[]', 'Array of product IDs'],
              ['plastic_saved_g', 'integer', 'Total grams of plastic avoided'],
              ['carbon_kg', 'decimal', 'Estimated CO₂ kg avoided'],
              ['local_sourcing_pct', 'decimal', '% locally sourced by value'],
              ['artisan_communities', 'integer', 'Number of communities supported'],
              ['impact_statement', 'text', 'AI-generated human readable summary'],
              ['methodology_version', 'varchar', "e.g. 'v1.2.0'"],
              ['created_at', 'timestamptz', 'Auto-generated on insert'],
            ].map(([col, type, desc], i) => (
              <div key={col} className="grid grid-cols-3 gap-0 px-6 py-3 border-b text-[12px]"
                style={{ borderColor: `${G}0.05)`, background: i % 2 ? `${G}0.015)` : 'transparent', fontFamily: "'Geist Mono',monospace" }}>
                <div style={{ color: `${G}0.8)` }}>{col}</div>
                <div style={{ color: 'rgba(251,191,36,0.8)' }}>{type}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── API Spec ── */}
        <motion.div {...fadeUp(0.05)}>
          <SectionLabel>API Contract</SectionLabel>
          <div className="mt-6 rounded-2xl border overflow-hidden"
            style={{ borderColor: `${G}0.1)`, background: 'rgba(4,12,8,0.9)' }}>
            <div className="flex items-center gap-4 px-6 py-4 border-b"
              style={{ borderColor: `${G}0.08)`, background: `${G}0.03)` }}>
              <Badge color="amber">POST</Badge>
              <span className="font-mono text-[14px]" style={{ color: 'rgba(255,255,255,0.9)' }}>/api/v1/impact/generate</span>
            </div>
            <div className="grid grid-cols-2 gap-0">
              <div className="p-6 border-r" style={{ borderColor: `${G}0.08)` }}>
                <div className="mb-3 text-[10px] tracking-widest uppercase" style={{ color: `${G}0.4)`, fontFamily: "'Geist Mono',monospace" }}>Request Body</div>
                <pre className="text-[11px] leading-relaxed overflow-hidden" style={{ fontFamily: "'Geist Mono',monospace", color: 'rgba(255,255,255,0.6)', background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 8 }}>
{`{
  `}<span style={{ color: `${G}0.8)` }}>"order_id"</span>{`: "ord-72b1",
  `}<span style={{ color: `${G}0.8)` }}>"products"</span>{`: [{
    `}<span style={{ color: `${G}0.8)` }}>"category"</span>{`: "bags",
    `}<span style={{ color: `${G}0.8)` }}>"quantity"</span>{`: `}<span style={{ color: 'rgba(251,191,36,0.9)' }}>500</span>{`,
    `}<span style={{ color: `${G}0.8)` }}>"origin"</span>{`: "Kutch"
  }],
  `}<span style={{ color: `${G}0.8)` }}>"total_inr"</span>{`: `}<span style={{ color: 'rgba(251,191,36,0.9)' }}>250000</span>{`
}`}
                </pre>
              </div>
              <div className="p-6">
                <div className="mb-3 text-[10px] tracking-widest uppercase" style={{ color: `${G}0.4)`, fontFamily: "'Geist Mono',monospace" }}>Response 200 OK</div>
                <pre className="text-[11px] leading-relaxed overflow-hidden" style={{ fontFamily: "'Geist Mono',monospace", color: 'rgba(255,255,255,0.6)', background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 8 }}>
{`{
  `}<span style={{ color: `${G}0.8)` }}>"plastic_saved"</span>{`: {
    `}<span style={{ color: `${G}0.8)` }}>"grams"</span>{`: `}<span style={{ color: 'rgba(251,191,36,0.9)' }}>12500</span>{`,
    `}<span style={{ color: `${G}0.8)` }}>"confidence"</span>{`: "high"
  },
  `}<span style={{ color: `${G}0.8)` }}>"carbon_avoided"</span>{`: {
    `}<span style={{ color: `${G}0.8)` }}>"kg_co2"</span>{`: `}<span style={{ color: 'rgba(251,191,36,0.9)' }}>45.2</span>{`
  },
  `}<span style={{ color: `${G}0.8)` }}>"impact_statement"</span>{`: "string"
}`}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══ DIVIDER ══ */}
      <div className="w-full h-px mx-auto" style={{ background: `linear-gradient(to right, transparent, ${G}0.2), transparent)` }} />

      {/* ══════════ MODULE 4 ══════════ */}
      <section className="relative w-full max-w-6xl mx-auto px-8 pt-24 pb-40">

        {/* ── Section label ── */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: `${A}0.4)` }} />
          <span className="text-[11px] tracking-[0.25em] uppercase"
            style={{ color: `${A}0.5)`, fontFamily: "'Geist Mono',monospace" }}>
            Module 04 — Conversational Support
          </span>
        </motion.div>

        {/* ── Hero headline ── */}
        <motion.div {...fadeUp(0.05)} className="relative mb-20">
          <div className="absolute -top-10 -left-4 font-black pointer-events-none select-none leading-none"
            style={{ fontSize: 220, color: `${A}0.03)`, fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900 }}>
            04
          </div>
          <h1 className="relative z-10 font-black uppercase leading-none"
            style={{ fontSize: 56, letterSpacing: '-0.02em', fontFamily: "'Cabinet Grotesk',sans-serif" }}>
            <span className="amber-shimmer">AI WhatsApp</span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Support Bot</span>
          </h1>
          <p className="mt-4 text-[15px] max-w-xl" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Instrument Sans',sans-serif" }}>
            Intelligent, database-grounded conversational support with automatic escalation and zero hallucination.
          </p>
        </motion.div>

        {/* ── Hero layout: diagram + chat ── */}
        <div className="flex gap-10 items-start mb-24">

          {/* Decision tree */}
          <motion.div {...fadeUp(0.05)} className="flex-1">
            <SectionLabel>Request Flow</SectionLabel>
            <DecisionTree />
          </motion.div>

          {/* WhatsApp mock */}
          <motion.div {...fadeUp(0.15)} className="shrink-0 flex flex-col items-center">
            <SectionLabel>Live Preview</SectionLabel>
            <WhatsAppMock />
          </motion.div>
        </div>

        {/* ── 4 Feature cards ── */}
        <SectionLabel>Feature Design</SectionLabel>
        <div className="mt-6 grid grid-cols-2 gap-6 mb-24">
          <motion.div {...fadeUp(0.05)}>
            <FeatureCard title="🔎 ORDER_STATUS_DB_LOOKUP" badge="Grounded Query" amber>
              <CodeBlock>
                <Cm>// Real DB lookup — zero hallucination</Cm>
                <br /><br />
                <Cv>order</Cv> = <Ck>await</Ck> supabase<br />
                &nbsp;&nbsp;.from(<Cs>"orders"</Cs>)<br />
                &nbsp;&nbsp;.select(<Cs>"status, courier, eta"</Cs>)<br />
                &nbsp;&nbsp;.eq(<Cs>"order_id"</Cs>, extracted_id)<br />
                &nbsp;&nbsp;.single()<br /><br />
                <Ck>if</Ck> (!order) <Ck>return</Ck> <Cs>"Order not found"</Cs><br /><br />
                <Cv>prompt</Cv> = buildStatusPrompt(order, query)<br />
                <Ck>return await</Ck> gemini.generate(prompt)
              </CodeBlock>
            </FeatureCard>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <FeatureCard title="📚 RETURN_POLICY_RAG" badge="Retrieval-Augmented" amber>
              <CodeBlock>
                <Cm>// Policy retrieval — no hallucination</Cm>
                <br /><br />
                <Cv>chunks</Cv> = loadPolicyDocs()<br />
                <Cm>// Pre-chunked policy in vector store</Cm>
                <br /><br />
                <Cv>relevant</Cv> = semanticSearch(<br />
                &nbsp;&nbsp;query, chunks, topK=<Cn>3</Cn><br />
                )<br /><br />
                <Cm>// AI gets context, never raw memory</Cm><br />
                <Cv>prompt</Cv> = {"`"}Given policy: {'${relevant}'}<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Answer: {'${query}'}{"`"}<br />
                <Ck>return</Ck> gemini.generate(prompt)
              </CodeBlock>
            </FeatureCard>
          </motion.div>

          <motion.div {...fadeUp(0.05)}>
            <FeatureCard title="🚨 ESCALATION_ENGINE" badge="Safety Guardrail" amber>
              <CodeBlock>
                <Cm>// Deterministic + AI combo for safety</Cm>
                <br /><br />
                <Cv>SIGNALS</Cv> = [<Cs>"refund"</Cs>, <Cs>"legal"</Cs>,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Cs>"urgent"</Cs>, <Cs>"fraud"</Cs>]<br /><br />
                <Cv>sentiment</Cv> = <Ck>await</Ck> classifySentiment(msg)<br /><br />
                <Ck>if</Ck> sentiment.score {'<'} <Cn>-0.6</Cn><br />
                || hasSignal(msg, SIGNALS)<br />
                || isHighValueOrder(order):<br />
                &nbsp;&nbsp;createTicket(PRIORITY.HIGH)<br />
                &nbsp;&nbsp;notifyHumanAgent()
              </CodeBlock>
            </FeatureCard>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <FeatureCard title="🗄️ CONVERSATION LOGGING" badge="Audit Trail" amber>
              <div className="mt-2 rounded-xl overflow-hidden border text-[11px]"
                style={{ borderColor: `${A}0.15)`, fontFamily: "'Geist Mono',monospace" }}>
                {[
                  ['id', 'uuid'], ['session_id', 'varchar'], ['user_phone', 'varchar (hashed)'],
                  ['message_in', 'text'], ['intent', 'enum'], ['escalated', 'boolean'],
                  ['response_ms', 'integer'], ['created_at', 'timestamptz'],
                ].map(([col, type], i) => (
                  <div key={col} className="flex justify-between px-4 py-2 border-b"
                    style={{ borderColor: `${A}0.07)`, background: i % 2 ? `${A}0.03)` : 'transparent' }}>
                    <span style={{ color: `${G}0.7)` }}>{col}</span>
                    <span style={{ color: 'rgba(251,191,36,0.7)' }}>{type}</span>
                  </div>
                ))}
              </div>
            </FeatureCard>
          </motion.div>
        </div>

        {/* ── Tech Stack ── */}
        <motion.div {...fadeUp(0.05)} className="mb-24">
          <SectionLabel>Integration Stack</SectionLabel>
          <div className="mt-6 rounded-2xl border p-8"
            style={{ borderColor: `${A}0.1)`, background: 'rgba(12,10,4,0.8)' }}>
            <div className="flex items-center justify-between">
              {[
                { icon: '💬', label: 'WHATSAPP', sub: 'User Channel' },
                { icon: '📡', label: 'TWILIO', sub: 'Webhook Layer', active: true },
                { icon: '⚙️', label: 'EXPRESS', sub: 'Business Logic' },
                { icon: '🧠', label: 'GEMINI 2.5', sub: 'AI Layer', active: true },
                { icon: '🗄️', label: 'SUPABASE', sub: 'Data Source' },
                { icon: '📊', label: 'WINSTON', sub: 'Audit Logs' },
              ].map((pill, i, arr) => (
                <React.Fragment key={pill.label}>
                  <StackBlock {...pill} />
                  {i < arr.length - 1 && (
                    <svg width="32" height="12" className="shrink-0">
                      <line x1="0" y1="6" x2="32" y2="6" stroke={`${A}0.4)`} strokeWidth="1.5" strokeDasharray="5 3"
                        className="flow-line" />
                    </svg>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── API Routes ── */}
        <motion.div {...fadeUp(0.05)}>
          <SectionLabel>API Contracts</SectionLabel>
          <div className="mt-6 rounded-2xl border overflow-hidden"
            style={{ borderColor: `${A}0.12)`, background: 'rgba(12,10,4,0.9)' }}>
            {[
              { method: 'POST', path: '/api/v1/support/webhook', desc: 'Twilio inbound webhook endpoint' },
              { method: 'POST', path: '/api/v1/support/message', desc: 'Direct testing & dev endpoint' },
              { method: 'GET',  path: '/api/v1/support/conversations', desc: 'Admin audit log viewer' },
              { method: 'GET',  path: '/api/v1/support/escalations', desc: 'Open escalated tickets queue' },
            ].map((ep, i) => (
              <div key={ep.path} className="flex items-center gap-6 px-6 py-4 border-b"
                style={{ borderColor: `${A}0.06)`, background: i % 2 ? `${A}0.015)` : 'transparent' }}>
                <Badge color={ep.method === 'POST' ? 'amber' : 'blue'}>{ep.method}</Badge>
                <span className="w-72 font-mono text-[13px]" style={{ color: 'rgba(255,255,255,0.9)' }}>{ep.path}</span>
                <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Instrument Sans',sans-serif" }}>{ep.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ Global Footer ══ */}
      <motion.div {...fadeUp(0)} className="max-w-6xl mx-auto px-8 py-20 border-t"
        style={{ borderColor: `${G}0.08)` }}>
        <div className="flex items-start gap-16">
          <div className="flex-1">
            <h3 className="font-black text-2xl uppercase mb-4" style={{ letterSpacing: '-0.01em' }}>Architecture Methodology</h3>
            <p className="text-[15px] leading-relaxed max-w-2xl" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Instrument Sans',sans-serif" }}>
              Both designs follow the same <strong className="text-white">Controller → Service → Repository</strong> pattern
              established in Modules 1 & 2. All AI calls are isolated in service layers, outputs validated with AJV schemas,
              and every prompt + response logged to Supabase <code>ai_logs</code>. The escalation engine uses deterministic
              keyword matching combined with Gemini sentiment analysis — grounding AI decisions in hard business rules.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {[
              ['🏗', 'Clean Architecture'],
              ['🔒', 'No Prompt Injection'],
              ['📊', 'Fully Logged'],
              ['⚡', 'Sub-2s Response'],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border"
                style={{ border: `1px solid ${G}0.2)`, background: `${G}0.04)` }}>
                <span>{icon}</span>
                <span className="text-[12px] font-mono" style={{ color: `${G}0.8)` }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className="w-1 h-4 rounded-full" style={{ background: 'rgba(74,222,128,0.6)' }} />
      <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(74,222,128,0.5)', fontFamily: "'Geist Mono',monospace" }}>
        {children}
      </span>
    </div>
  );
}

function PipeNode({ emoji, label, sub, active }: any) {
  return (
    <div className={`flex flex-col items-center gap-2 ${active ? 'glow-card' : ''}`}>
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl"
        style={{
          background: active ? 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(74,222,128,0.05))' : 'rgba(0,0,0,0.4)',
          border: `1px solid ${active ? 'rgba(74,222,128,0.6)' : 'rgba(74,222,128,0.12)'}`,
        }}>
        {emoji}
      </div>
      <div className="text-center">
        <div className="text-[10px] font-bold tracking-wider" style={{ color: active ? 'rgba(134,239,172,1)' : 'rgba(255,255,255,0.6)', fontFamily: "'Geist Mono',monospace" }}>{label}</div>
        <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Geist Mono',monospace" }}>{sub}</div>
      </div>
    </div>
  );
}

function PipeArrow() {
  return (
    <svg width="60" height="16" className="shrink-0">
      <line x1="0" y1="8" x2="52" y2="8" stroke="rgba(74,222,128,0.5)" strokeWidth="1.5" strokeDasharray="6 4" className="flow-line" />
      <polygon points="52,4 60,8 52,12" fill="rgba(74,222,128,0.5)" />
    </svg>
  );
}

function SmallNode({ emoji, label, active }: any) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border"
      style={{
        background: active ? 'rgba(74,222,128,0.1)' : 'rgba(0,0,0,0.4)',
        borderColor: active ? 'rgba(74,222,128,0.4)' : 'rgba(74,222,128,0.1)',
      }}>
      <span className="text-sm">{emoji}</span>
      <span className="text-[9px] font-bold" style={{ color: active ? 'rgba(134,239,172,0.9)' : 'rgba(255,255,255,0.5)', fontFamily: "'Geist Mono',monospace" }}>{label}</span>
    </div>
  );
}

function SmallArrow() {
  return (
    <svg width="40" height="12" className="shrink-0">
      <line x1="0" y1="6" x2="32" y2="6" stroke="rgba(74,222,128,0.4)" strokeWidth="1.5" strokeDasharray="5 3" className="flow-line" />
      <polygon points="32,3 40,6 32,9" fill="rgba(74,222,128,0.4)" />
    </svg>
  );
}

function FeatureCard({ title, badge, children, amber }: any) {
  const color = amber ? 'rgba(251,191,36,' : 'rgba(74,222,128,';
  return (
    <div className="h-full rounded-2xl p-6 flex flex-col gap-4"
      style={{
        background: `linear-gradient(145deg, rgba(4,12,8,0.9), rgba(2,8,5,0.95))`,
        border: `1px solid ${color}0.12)`,
      }}>
      <div className="flex items-center justify-between">
        <span className="font-bold text-[13px] tracking-wide" style={{ fontFamily: "'Geist Mono',monospace", color: 'rgba(255,255,255,0.85)' }}>{title}</span>
        <span className="px-2 py-0.5 rounded text-[9px] tracking-wider uppercase"
          style={{ background: `${color}0.08)`, border: `1px solid ${color}0.2)`, color: `${color}0.8)`, fontFamily: "'Geist Mono',monospace" }}>
          {badge}
        </span>
      </div>
      {children}
    </div>
  );
}

function CodeBlock({ children }: any) {
  return (
    <div className="code-block text-[rgba(255,255,255,0.6)] whitespace-pre-wrap">{children}</div>
  );
}

// Code syntax helpers
const Cm = ({ children }: any) => <span style={{ color: 'rgba(74,222,128,0.5)' }}>{children}</span>;
const Cv = ({ children }: any) => <span style={{ color: 'rgba(255,255,255,0.9)' }}>{children}</span>;
const Ck = ({ children }: any) => <span style={{ color: 'rgba(134,239,172,0.9)' }}>{children}</span>;
const Cs = ({ children }: any) => <span style={{ color: 'rgba(134,239,172,0.7)' }}>{children}</span>;
const Cn = ({ children }: any) => <span style={{ color: 'rgba(251,191,36,0.9)' }}>{children}</span>;

function MetricBar({ label, val, pct }: any) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-[10px] tracking-wider" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Geist Mono',monospace" }}>{label}</span>
        <span className="text-[10px] font-bold" style={{ color: 'rgba(134,239,172,0.9)', fontFamily: "'Geist Mono',monospace" }}>{val}</span>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(74,222,128,0.08)' }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(to right, rgba(74,222,128,0.4), rgba(74,222,128,0.9))' }}
        />
      </div>
    </div>
  );
}

function Badge({ children, color }: any) {
  const styles: any = {
    amber: { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', color: 'rgba(251,191,36,0.9)' },
    blue:  { bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.3)',  color: 'rgba(147,197,253,0.9)' },
  };
  const s = styles[color];
  return (
    <span className="px-3 py-1 rounded text-[10px] font-bold w-14 text-center"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontFamily: "'Geist Mono',monospace" }}>
      {children}
    </span>
  );
}

function StackBlock({ icon, label, sub, active }: any) {
  return (
    <div className={`flex flex-col items-center gap-2 px-5 py-4 rounded-xl border ${active ? 'glow-card-amber' : ''}`}
      style={{
        background: active ? 'rgba(251,191,36,0.05)' : 'rgba(0,0,0,0.3)',
        borderColor: active ? 'rgba(251,191,36,0.3)' : 'rgba(251,191,36,0.1)',
      }}>
      <span className="text-2xl">{icon}</span>
      <div className="text-center">
        <div className="text-[10px] font-bold" style={{ color: active ? 'rgba(253,224,71,0.9)' : 'rgba(255,255,255,0.6)', fontFamily: "'Geist Mono',monospace" }}>{label}</div>
        <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Geist Mono',monospace" }}>{sub}</div>
      </div>
    </div>
  );
}

/* ─── Decision tree for Module 4 ─── */
function DecisionTree() {
  return (
    <div className="mt-6 flex flex-col items-center gap-0 pt-4"
      style={{ fontFamily: "'Geist Mono',monospace" }}>
      <TreeBox label="INCOMING WHATSAPP" sub="User message received" />
      <VLine />
      <TreeBox label="INTENT CLASSIFIER" sub="Gemini 2.5 Flash — low temp" active />
      <VLine />

      {/* Branch row */}
      <div className="flex gap-4 items-start relative">
        {/* Horizontal bar */}
        <div className="absolute top-0 left-[50%] -translate-x-1/2 h-px w-[400px]"
          style={{ background: 'rgba(74,222,128,0.3)' }} />
        <div className="flex flex-col items-center gap-0">
          <VLine short /><TreeBox label="ORDER_STATUS" small /><VLine short />
          <TreeBox label="DB LOOKUP" sub="Supabase" small />
        </div>
        <div className="flex flex-col items-center gap-0 mt-0">
          <VLine short /><TreeBox label="RETURNS" small /><VLine short />
          <TreeBox label="POLICY RAG" sub="Vector DB" small />
        </div>
        <div className="flex flex-col items-center gap-0">
          <VLine short /><TreeBox label="OTHER_QUERY" small /><VLine short />
          <TreeBox label="AI GENERAL" sub="Grounded" small />
        </div>
      </div>

      <VLine />
      <TreeBox label="ESCALATION CHECK" sub="Keyword + Sentiment AI" amber />
      <div className="flex gap-8 mt-0 items-start">
        <div className="flex flex-col items-center gap-0">
          <VLineDashed /><TreeBox label="AUTO-REPLY" small /><VLineDashed />
          <TreeBox label="LOG TO DB" small />
        </div>
        <div className="flex flex-col items-center gap-0">
          <VLineDashed amber /><TreeBox label="HUMAN AGENT" small amber /><VLineDashed amber />
          <TreeBox label="TICKET CREATED" small amber />
        </div>
      </div>
    </div>
  );
}

function TreeBox({ label, sub, active, small, amber }: any) {
  const accentColor = amber ? 'rgba(251,191,36,' : 'rgba(74,222,128,';
  return (
    <div className="rounded-xl border px-4 py-2.5 z-10 flex flex-col items-center text-center"
      style={{
        minWidth: small ? 110 : 200,
        background: active || amber ? `${accentColor}0.06)` : 'rgba(4,12,8,0.8)',
        borderColor: (active || amber) ? `${accentColor}0.4)` : 'rgba(74,222,128,0.15)',
        boxShadow: (active || amber) ? `0 0 20px ${accentColor}0.15)` : 'none',
      }}>
      <div className="text-[10px] font-bold"
        style={{ color: (active || amber) ? (amber ? 'rgba(253,224,71,0.9)' : 'rgba(134,239,172,0.9)') : 'rgba(255,255,255,0.7)' }}>
        {label}
      </div>
      {sub && <div className="text-[9px] mt-0.5" style={{ color: (active || amber) ? `${accentColor}0.5)` : 'rgba(255,255,255,0.3)' }}>{sub}</div>}
    </div>
  );
}

const VLine = ({ short, amber }: any) => (
  <div style={{ width: 1, height: short ? 16 : 28, background: amber ? 'rgba(251,191,36,0.3)' : 'rgba(74,222,128,0.3)' }} />
);
const VLineDashed = ({ amber }: any) => (
  <div style={{ width: 1, height: 20, borderLeft: `1px dashed ${amber ? 'rgba(251,191,36,0.3)' : 'rgba(74,222,128,0.25)'}` }} />
);

/* ─── WhatsApp Mock ─── */
function WhatsAppMock() {
  const messages = [
    { user: true,  text: "Status of order #RVY-2024-0847?", delay: 300 },
    { user: false, text: "🔍 Checking live...\n\n#RVY-2024-0847\nStatus: ✅ SHIPPED\nCourier: Delhivery\nETA: 6 Mar 2026\nTrack: dlv.me/RVY0847", label: "⚡ Live DB · 0.8s", delay: 1000 },
    { user: true,  text: "What's the return policy?", delay: 2200 },
    { user: false, text: "Returns accepted within 14 days. We encourage exchanges over returns to reduce carbon impact.\n\nStart: rayeva.earth/returns", label: "📋 Policy RAG · 0.3s", delay: 3000 },
    { user: true,  text: "I want a refund immediately, this is urgent!", delay: 4200 },
    { user: false, text: "⚠️ Flagged as high priority.\nA specialist will contact you within 2 hrs.\nTicket #ESC-9821 created.", label: "🚨 Escalated to human", delay: 5000, amber: true },
  ];

  const [visible, setVisible] = useState<number[]>([]);
  useEffect(() => {
    messages.forEach((m, i) => {
      setTimeout(() => setVisible(v => [...v, i]), m.delay);
    });
  // eslint-disable-next-line
  }, []);

  return (
    <div className="w-[300px] rounded-2xl overflow-hidden flex flex-col"
      style={{ height: 480, background: '#060f09', border: '1px solid rgba(74,222,128,0.15)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{ background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(74,222,128,0.1)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
            style={{ background: 'rgba(74,222,128,0.15)', color: 'rgba(74,222,128,0.9)', fontFamily: "'Geist Mono',monospace" }}>RV</div>
          <div>
            <div className="text-[11px] font-bold" style={{ color: 'rgba(74,222,128,0.9)', fontFamily: "'Geist Mono',monospace" }}>RAYEVA SUPPORT</div>
            <div className="text-[9px]" style={{ color: 'rgba(74,222,128,0.4)', fontFamily: "'Geist Mono',monospace" }}>AI-Powered · Grounded</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(74,222,128,0.9)', boxShadow: '0 0 8px rgba(74,222,128,0.9)' }} />
          <span className="text-[9px]" style={{ color: 'rgba(74,222,128,0.5)', fontFamily: "'Geist Mono',monospace" }}>ONLINE</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto" style={{ background: '#060f09' }}>
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={visible.includes(i) ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col ${m.user ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[85%] px-3 py-2.5 text-[12px] whitespace-pre-line leading-relaxed ${m.user ? 'chat-bubble-user' : m.amber ? 'chat-bubble-escalate' : 'chat-bubble-bot'}`}
              style={{ fontFamily: "'Instrument Sans',sans-serif" }}>
              {m.text}
            </div>
            {m.label && (
              <div className="mt-1 ml-2 text-[9px]" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'Geist Mono',monospace" }}>{m.label}</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="h-8 flex items-center justify-center border-t"
        style={{ borderColor: 'rgba(74,222,128,0.06)', background: 'rgba(0,0,0,0.4)' }}>
        <span className="text-[9px]" style={{ color: 'rgba(74,222,128,0.25)', fontFamily: "'Geist Mono',monospace" }}>
          GEMINI 2.5 FLASH + TWILIO WHATSAPP API
        </span>
      </div>
    </div>
  );
}
