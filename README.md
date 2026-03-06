# ForgeProcure / EchoSynthetics 🌿
A modern, AI-powered B2B procurement suite focused on sustainable purchasing decisions, intelligent cataloging, and automated impact reporting.

## 🚀 Overview

This repository contains the full implementation of two core modules for the Rayeva internship assignment, plus detailed architecture documentation for the remaining two.

1. **Module 1 (Implemented):** AI Catalog Intelligence — A fast, semantic, and intelligent B2B catalog search engine.
2. **Module 2 (Implemented):** AI B2B Proposal Generator — Automates generation of client-ready proposals using real-time margins and PDF exports.
3. **Module 3 (Architecture):** AI Impact Reporting Generator — Automates environmental social impact quantification.
4. **Module 4 (Architecture):** AI WhatsApp Support Bot — Intelligent conversational support with deterministic escalation.

---

## 📸 Sneak Peek

The project features a striking, biopunk-inspired visual design, utilizing glassmorphism, glowing accents, and high-performance Framer Motion animations to make B2B interactions feel premium.

### Module 1: AI Catalog
![Module 1 Preview](./Module_1/frontend/public/vite.svg) *(Run the app to see the visual experience!)*

### Modules 3 & 4 Architecture UI
The detailed system architecture is shipped directly within the frontend application for interactive viewing. Look for the **"03 IMPACT"** and **"04 SUPPORT"** tabs in the Module 1 header to see the cinematic architecture designs, complete with live mock APIs and generated JSON visuals.

---

## 🛠 Prerequisites

To run this project locally, ensure you have:
- Node.js (v18 or higher)
- npm or yarn
- A Gemini API Key
- A Supabase Instance URL & Anon Key

## 🚦 Getting Started (The Easy Way)

We have provided a convenient bash script that automatically installs all dependencies and launches the backends and frontends concurrently.

1. **Configure Environment Variables:**
   Copy the `.env.example` templates to `.env` in both backend folders and fill in your keys.
   ```bash
   cp Module_1/backend/.env.example Module_1/backend/.env
   cp Module_2/backend/.env.example Module_2/backend/.env
   ```

2. **Run the Start Script:**
   From the root folder, run:
   ```bash
   ./start.sh
   ```

3. **View the Apps:**
   - **Module 1 & Architectures (3 & 4):** [http://localhost:5173](http://localhost:5173)
   - **Module 2:** [http://localhost:5174](http://localhost:5174)

---

## 📦 Getting Started (The Manual Way)

If you prefer to start them manually or only want to check one module:

### Running Module 1
1. **Backend:**
   ```bash
   cd Module_1/backend
   npm install
   npm run dev
   # Runs on localhost:3000
   ```
2. **Frontend:**
   ```bash
   cd Module_1/frontend
   npm install
   npm run dev
   # Runs on localhost:5173
   ```

### Running Module 2
1. **Backend:**
   ```bash
   cd Module_2/backend
   npm install
   npm run dev
   # Runs on localhost:3001
   ```
2. **Frontend:**
   ```bash
   cd Module_2/frontend
   npm install
   npm run dev
   # Runs on localhost:5174
   ```

---

## 🏛 Architecture Documentation (Modules 3 & 4)

Instead of a plain text file, the complete architectural breakdown for the remaining two modules is included natively within the React application to demonstrate UI/UX capabilities.

👉 **Launch `Module_1` frontend (http://localhost:5173) and click the "IMPACT" or "SUPPORT" tabs in the top navigation.**

*If you just want the raw markdown of these modules, they are documented inside `architecture34.md`.*

---

## 🔧 Tech Stack
-   **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Vite
-   **Backend:** Node.js, Express, TypeScript, @google/generative-ai
-   **Database:** Supabase (PostgreSQL)
-   **Core AI Engine:** Google Gemini 2.5 Flash

## 💡 Key Features Implemented
-   **Live Fallback Mechanism:** The system is designed to seamlessly fall back to deterministic mock data if the API limit is hit or if network issues arise.
-   **Voice-Activated Refinement:** Module 2 employs the browser's native Web Speech API to allow you to talk to the AI to refine proposals instantly over voice.
-   **"Zero Hallucination" Guardrails:** API calls are carefully prompted with strict JSON schemas and system rules to ensure outputs remain robust.
-   **Live Edit Mode & PDF Exports:** Evaluators can manually overwrite AI calculations and export clean branded PDFs securely in the browser.
