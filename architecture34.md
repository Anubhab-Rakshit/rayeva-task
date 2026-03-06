## Module 3: AI Impact Reporting Generator

### Problem It Solves
Modern procurement lacks immediate, granular visibility into the environmental and social consequences of purchasing decisions. While clients care about sustainability (ESG), the data is typically buried in annual CSR reports rather than actionable per-order formats. This module solves this by acting as a real-time ESG calculator and storytelling engine, turning dry purchase orders into measurable impact metrics (Plastic Avoided, Carbon Reduced, Local Economies Supported) and translating them into client-ready narratives.

### System Architecture
\`\`\`text
   [FRONTEND DASHBOARD]
           | (JSON Order Payload)
           v
   [EXPRESS CONTROLLER] ------------> [AJV SCHEMA VALIDATION]
           |
           v
[IMPACT CALCULATION SERVICE] <======> [SUPABASE DB]
 (Executes Logic-Based Math)          (Product Meta & Category Baselines)
           |
           v
  [GEMINI 2.5 AI SERVICE]
 (Generates Human Narrative)
           |
           v
    [IMPACT REPORT API]
      (Returns JSON)
\`\`\`

### Calculation Methodology
To maintain academic honesty and prevent AI hallucination, calculations are purely logic-based in the Node.js backend:
*   **Plastic Avoided:** Based on the `base_plastic_weight` of conventional equivalents defined in the `category_baselines` DB table, multiplied by `order.quantity`. Adjusted by a factor if the product is partially offset (e.g., 80% recycled content = 0.8 modifier).
*   **Carbon Avoided:** Uses a deterministic formula: \`Total CO2 = (Manufacturing_Baseline_CO2 - Item_CO2) * Quantity\`. If \`origin_region\` matches the delivery region, standard shipping carbon footprints (0.21kg/km) are deducted to factor in local supply chain savings.

### AI Prompt Design
The Gemini model is explicitly instructed to act as a data-driven translator, not a calculator.
\`\`\`text
System: You are an ESG reporting engine for B2B procurement.
Given the following HARD DATA metrics resulting from order #{order_id}:
- Plastic Avoided: {grams}g
- Carbon Avoided: {kg_co2}kg 
- Communities Supported: {communities} in {regions}

Draft a 2-sentence, highly professional impact statement for the client "{client}". 
CRITICAL RULE: Do NOT hallucinate metrics. Use ONLY the numbers provided above. 
Focus on translating the data into tangible real-world equivalents.
\`\`\`

### Database Schema
| column_name         | type        | description                                 |
| :------------------ | :---------- | :------------------------------------------ |
| id                  | uuid        | Primary key                                 |
| order_id            | uuid (FK)   | References orders table                     |
| product_ids         | uuid[]      | Array of product IDs                        |
| plastic_saved_g     | integer     | Total grams of plastic avoided              |
| carbon_kg           | decimal     | Estimated CO₂ kg avoided                    |
| local_sourcing_pct  | decimal     | % locally sourced by value                  |
| artisan_communities | integer     | Number supported                            |
| impact_statement    | text        | AI-generated human-readable summary         |
| methodology_version | varchar     | Tracking logic version (e.g., 'v1.2.0')     |
| created_at          | timestamptz | Auto-generated                              |

### API Contract
**POST /api/v1/impact/generate**
*Request:*
\`\`\`json
{
  "order_id": "ord-72b1",
  "products": [
    { "product_id": "prod-11", "category": "bags", "quantity": 500, "origin_region": "Kutch" }
  ],
  "order_total_inr": 250000
}
\`\`\`
*Response:*
\`\`\`json
{
  "impact_id": "imp-99a",
  "plastic_saved": { "grams": 12500, "confidence": "high" },
  "carbon_avoided": { "kg_co2": 45.2, "methodology": "production+transport" },
  "local_sourcing": { "percent": 100, "communities_supported": 1 },
  "impact_statement": "By choosing this order, TechCorp avoided 12.5kg of plastic...",
  "stored_at": "2026-03-06T12:00:00Z"
}
\`\`\`

### Why This Architecture
This hybrid design deliberately separates mathematical calculation from narrative generation. Using LLMs for math often leads to confident miscalculations. By executing the calculation in a strictly typed Node.js service using database constants, we ensure 100% auditability and consistency. The AI is relegated entirely to the "last mile"—taking validated data and summarizing it gracefully.

---

## Module 4: AI WhatsApp Support Bot

### Problem It Solves
B2B clients frequently need instant updates on order status, returns, and product availability. Traditional support requires human intervention for easily retrievable data, causing delays, while generic AI chatbots hallucinate policies or order states. This module provides instant, WhatsApp-native support that is strictly grounded in the Supabase database and company policy via RAG, with an automated safety valve to escalate angry or complex queries to humans.

### System Architecture
\`\`\`text
[WHATSAPP MESSAGE] -> [TWILIO API] -> [NODE.JS WEBHOOK]
                                            |
                                            v
[INTENT CLASSIFIER (Gemini)] <======> [ESCALATION ENGINE]
        |                                   | (If angry/urgent)
        | (If standard query)               v
        v                              [ZENDESK/HUMAN TICKET]
[BRANCHING LOGIC]
  |- Order Status -> [SUPABASE DB QUERY] -> [AI FORMATTER]
  |- Returns      -> [VECTOR RAG POLICY] -> [AI FORMATTER]
  |- General      -> [PRODUCT DB SEARCH] -> [AI FORMATTER]
        |
        v
[TWILIO API] -> [WHATSAPP RESPONSE]
\`\`\`

### Intent Classification Strategy
Before generating any response, the incoming message is passed to a lightweight, low-temperature prompt designed solely for classification. It must return a strict JSON enum: \`"ORDER_STATUS" | "RETURN_POLICY" | "CATALOG_QUERY" | "ESCALATION_REQUIRED"\` along with detected entities (like \`order_id\`). This ensures the system selects the correct deterministic routing path.

### Escalation Logic Design
Escalation is not left entirely to AI "vibes." It combines a deterministic keyword array (e.g., \`["refund", "attorney", "unacceptable", "scam"]\`) with an AI Sentiment Score (-1.0 to 1.0). If keywords match OR the sentiment drops below -0.6, the system intercepts the flow, triggers an automated "We are flagging this as high priority" response, and opens a ticket in the database flagged \`requires_human = true\`.

### Database Grounding (Why This Prevents Hallucination)
The core design principle here is "Zero Memory". The AI is not trained on Rayeva's data, nor does it rely on internal knowledge. If a user asks "Where is my order #123?", the Node backend directly queries \`SELECT status FROM orders WHERE id='123'\`. If null, the backend blocks the AI and returns a deterministic "Not found". If found, the data is pushed *into* the Gemini prompt as immediate context. The AI cannot hallucinate an order status because it only formats the SQL result.

### Conversation Logging Schema
| column_name    | type        | description                                 |
| :------------- | :---------- | :------------------------------------------ |
| id             | uuid        | Primary key                                 |
| user_phone     | varchar     | Hashed or encrypted for PII protection      |
| message_in     | text        | The customer's query                        |
| intent         | enum        | The classified intent                       |
| escalated      | boolean     | True if flagged for human intervention      |
| message_out    | text        | The bot's reply                             |
| response_ms    | integer     | Performance tracking metric                 |
| created_at     | timestamptz | Auto-generated                              |

### API Contract
**POST /api/v1/support/webhook** *(Twilio Inbound)*
*Request:*
\`\`\`json
{
  "SmsMessageSid": "SMxxxx",
  "NumMedia": "0",
  "ProfileName": "Client Name",
  "Body": "Where is order RVY-111?"
}
\`\`\`

**GET /api/v1/support/escalations**
*Response:*
\`\`\`json
[
  {
    "ticket_id": "esc-882",
    "user_phone": "hashed_val",
    "trigger": "sentiment: -0.8",
    "last_message": "This is ridiculous I need a refund."
  }
]
\`\`\`

### Twilio Integration Notes
The system utilizes Twilio's WhatsApp Business API Sandbox. The webhook endpoint is secured using Twilio Signature validation to ensure requests only originate from Twilio's servers. Responses use TwiML XML formatting generated by the Twilio Node SDK.

### Why This Architecture
By injecting an Intent Classifier and an Escalation Engine BEFORE the generation step, we build a "guardrailed" AI. It provides the conversational fluidity of an LLM with the strict, unyielding data rules of a traditional enterprise backend. This architecture proves that the system protects the company's reputation and data integrity first, prioritizing safety over open-ended chatting.
