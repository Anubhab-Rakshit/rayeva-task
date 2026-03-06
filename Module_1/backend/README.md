# AI Auto-Category & Tag Generator (Module 1)

This repository contains the backend service for **Module 1**, an applied-AI microservice responsible for auto-assigning product metadata such as primary categories, SEO tags, and sustainability filters using Large Language Models (LLMs) and strict NLP business rules.

Built to production standards, this service utilizes **TypeScript**, **Express**, **Jest** and **Winston** to ensure reliability, explainability, and maintainability for e-commerce catalog evaluation.

---

## 🚀 Key Features

*   **Strict LLM Validation**: Enforces rigorous `ajv` JSON schema validation on Gemini outputs to guarantee the frontend/database never receives malformed responses.
*   **NLP Processing**: Utilizes `natural` (stemming/tokenization) to deduplicate and canonicalize SEO tags before storage.
*   **Business Rule Engine**: Intercepts AI classifications and drops confidence scores/flags for manual review if explicit contradictions occur (e.g., LLM suggests "plastic-free" for a product describing "plastic").
*   **Production-Grade Architecture**: Designed using the Controller-Service-Repository pattern with structured `Winston` logging and comprehensive error handling.

## 🛠️ Tech Stack

*   **Node.js & Express**: API routing and HTTP handling.
*   **TypeScript**: Static typing for models, AI responses, and simulated mock databases.
*   **Google Generative AI (Gemini)**: Powers the categorization logic via LLM.
*   **AJV**: High-performance JSON schema compilation.
*   **Jest & Supertest**: Full unit/integration test suite ensuring rule engine accuracy.
*   **Docker**: Containerization ready for Kubernetes or Cloud Run.

---

## 📦 Getting Started

### Prerequisites
*   Node.js (v20+)
*   NPM
*   A Google Gemini API Key.

### 1. Installation

```bash
# Clone the repository and install dependencies
npm install

# Build the TypeScript compilation
npm run build
```

### 2. Configuration

Create a `.env` file in the root directory (one is already populated or created by the setup):

```env
PORT=3000
GEMINI_API_KEY=your_google_gemini_key_here
```
*(If `GEMINI_API_KEY` is completely omitted, the service falls back to an explicit mock AI response to allow offline testing of the pipeline.)*

### 3. Running the Service

```bash
# Run in development mode with Nodemon
npm run dev

# Run in production mode
npm start
```

---

## 🧪 Testing the Pipeline

We enforce Strict Business Rules (contradiction testing, deduplication limits). You can verify these rules executing the test suite:

```bash
npm run test
```

### API Endpoint Usage

The service exposes a `POST` route.

**Endpoint:** `POST /api/v1/products/analyze`

**cURL Request:**
```bash
curl -X POST http://localhost:3000/api/v1/products/analyze \
-H "Content-Type: application/json" \
-d '{
    "id": "prod_023",
    "title": "Masala Chai Premium Tea",
    "description": "Hand-blended masala premium tea. Comes in an eco-friendly compostable pouch but has a plastic lid.",
    "attributes": { "brand": "Nature Brew", "weight": "250g" }
}'
```

**Expected Response Layout:**
```json
{
  "success": true,
  "data": {
    "primary_category": "Beverages",
    "sub_categories": ["tea", "masala tea"],
    "seo_tags": ["masala chai", "organic tea"],
    "sustainability_filters": ["compostable_packaging"],
    "confidence": {
      "primary_category": 0.92,
      "tags": 0.48
    },
    "explanations": {
      "primary_category": "Title contains 'Masala'..."
    },
    "flag": "needs_manual_review",
    "generated_at": "2026-03-04T12:00:00.000Z",
    "product_id": "prod_023"
  },
  "validation": "passed"
}
```
*(Notice the `needs_manual_review` flag triggered because the strict NLP engine noticed the word "plastic" conflicting with green claims).*

---

## 🐳 Docker Deployment

To run instances completely containerized:
```bash
docker build -t genai-tag-generator .
docker run -p 3000:3000 --env-file .env genai-tag-generator
```
