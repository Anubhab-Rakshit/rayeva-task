<div align="center">
  <img src="./Module_1/frontend/public/vite.svg" width="120" alt="EchoSynthetics Logo" />
  <h1>ForgeProcure / EchoSynthetics 🌿</h1>
  <p><em>A modern, AI-powered B2B procurement suite focused on sustainable purchasing decisions, intelligent cataloging, and automated impact reporting.</em></p>
</div>

<br />

## 🚀 Executive Summary

This repository contains the full implementation of two core modules for the Rayeva internship assignment, plus detailed, interactive architecture documentation for the remaining two.

Traditional B2B procurement is slow, manual, and lacks immediate visibility into the environmental impact of purchasing decisions. **ForgeProcure** reimagines this process through the lens of a highly performant, visually stunning, AI-driven interface.

1. **Module 1 (Fully Implemented):** AI Catalog Intelligence — A fast, semantic, and intelligent B2B catalog search engine.
2. **Module 2 (Fully Implemented):** AI B2B Proposal Generator — Automates the generation of client-ready proposals using real-time margins, voice-activated refinement, and PDF exports.
3. **Module 3 (Architecture Designed):** AI Impact Reporting Generator — Automates environmental and social impact quantification per order.
4. **Module 4 (Architecture Designed):** AI WhatsApp Support Bot — Intelligent conversational support with deterministic escalation rules.

---

## 🎨 Design Philosophy : The "Biopunk Terminal"
Before diving into the features, it's immediately noticeable that this project doesn't look like standard SaaS. It utilizes a custom **"Biopunk Terminal"** design language:
- **Color Palette:** Deep void blacks (`#020807`) contrasted with toxic/neon greens (`#4ade80`).
- **Typography:** Architectural headings (Cabinet Grotesk) paired with strict technical monospace data readouts (Geist Mono, Space Mono).
- **Glassmorphism & Depth:** Heavy use of `backdrop-filter: blur()`, glowing SVG meshes, and animated gradient borders.
- **Motion:** Powered extensively by `framer-motion`, every interaction—from the "Molten Forge" proposal generation to simple hover states—feels cinematic, tactile, and heavy.

---

## 🔥 Key Features Implemented

### Module 1: AI Catalog Intelligence
*   **Semantic AI Search:** Instead of strict keyword matching, the catalog search understands intent (e.g., searching "budget eco gifts" will find unbranded bamboo pens under ₹200).
*   **Live Supabase Data:** All products, pricing, and origin data are pulled from a live PostgreSQL database hosted on Supabase.
*   **Smart Filtering:** Real-time updates based on category selections.
*   **Intelligent Empty States:** The UI gracefully guides the user when searches return zero results.

### Module 2: AI B2B Proposal Generator
*   **The "Molten Forge":** An intricate, multi-stage loading animation sequence that visualizes the AI actively "forging" the proposal across different phases (Data Layer, Cost Matrix, Narrative).
*   **Interactive Edit Mode:** Recognizing that AI isn't perfect, users can toggle into Edit Mode to manually adjust Unit Costs and Quantities. The UI (including donut charts and total values) recalculates instantaneously on the client side.
*   **Voice-Activated Refinement (The WOW Factor):** The "Refine with AI" chat interface isn't just text. It integrates the native **Web Speech API**. Click the microphone icon, say *"Swap the bamboo coasters for premium desk organizers"* out loud, and the AI will transcribe, process, and update the proposal automatically.
*   **Offline/Mock Fallbacks:** If the Gemini API rate limit is exceeded, the system automatically falls back to deterministic mock data so the demo never breaks.
*   **Branded PDF Export:** A single click captures the finalized proposal phase and renders it into a high-quality, downloadable PDF report fit for clients.

### Modules 3 & 4: Interactive Architecture Documentation
Instead of a plain text file, the complete architectural breakdown for the remaining two modules is included **natively within the React application** to demonstrate UI/UX capabilities.
*   **Live Simulated WhatsApp UI:** Module 4's documentation includes a CSS/Framer-animated mock smartphone showing exact chat delays, AI statuses, and RAG retrievals.
*   **Code-Highlighted Flowcharts:** Complete SQL database schemas and API request/response JSON contracts are beautifully highlighted.

👉 **Launch `Module_1` frontend (http://localhost:5173) and click the "03 IMPACT" or "04 SUPPORT" tabs in the top navigation.**

*(If you just want the raw markdown text of these architectures, it is documented inside `architecture34.md`.)*

---

## 🛠 Tech Stack Overview

### Frontend Architecture
-   **Core:** React (`vite`), TypeScript
-   **Styling:** Tailwind CSS (Strictly typed variables, no generic colors)
-   **Animation:** Framer Motion (Orchestrating complex layout IDs and stagger children)
-   **Icons:** `lucide-react`
-   **PDF Generation:** `html2pdf.js`

### Backend Architecture
-   **Runtime:** Node.js + Express
-   **Language:** TypeScript (`ts-node`)
-   **Database:** Supabase (PostgreSQL) + `@supabase/supabase-js`
-   **AI Engine:** Google Gemini (`@google/generative-ai`) — utilizing the blazing fast `gemini-2.5-flash` model.
-   **Environment:** `dotenv`

---

## 🚀 Running the Project Locally

We have provided a convenient bash script that automatically installs all dependencies and launches the backends and frontends concurrently.

### 1. Configure Environment Variables
Copy the `.env.example` templates to `.env` in both backend folders.
```bash
cp Module_1/backend/.env.example Module_1/backend/.env
cp Module_2/backend/.env.example Module_2/backend/.env
```
*Note: Make sure to fill in your real Gemini API key and Supabase details inside the newly created `.env` files.*

### 2. Run the Start Script
From the root folder of the repository, run the executable script:
```bash
./start.sh
```

### 3. View the Applications
The script will sequentially boot up four terminal processes in the background. Once running:
- **Module 1 (Catalog) & Architectures (3 & 4):** [http://localhost:5173](http://localhost:5173) *(Backend on 3000)*
- **Module 2 (Proposal Generator):** [http://localhost:5174](http://localhost:5174) *(Backend on 3001)*

To kill the processes when you are finished, simply press `Ctrl+C` in the terminal running the `start.sh` script.

---

## ⚙️ Manual Setup (If the script isn't preferred)

If you have issues with the shell script, you can run them manually in separate terminal tabs:

**Module 1 Backend (Port 3000):**
```bash
cd Module_1/backend
npm install
npm run dev
```

**Module 1 Frontend (Port 5173):**
```bash
cd Module_1/frontend
npm install
npm run dev
```

**Module 2 Backend (Port 3001):**
```bash
cd Module_2/backend
npm install
npm run dev
```

**Module 2 Frontend (Port 5174):**
```bash
cd Module_2/frontend
npm install
npm run dev
```

---

<div align="center">
  <p><i>Designed and Engineered by Anubhab Rakshit</i></p>
</div>
