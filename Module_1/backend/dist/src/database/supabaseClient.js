"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const logger_1 = require("../utils/logger");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envPath = path_1.default.resolve(__dirname, '../../.env');
const result = dotenv_1.default.config({ path: envPath });
console.log(`[Supabase Init] Loaded .env from ${envPath}. Success: ${!!result.parsed}`);
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
console.log(`[Supabase Init] URL Presence: ${!!supabaseUrl}`);
console.log(`[Supabase Init] Key Presence: ${!!supabaseAnonKey}`);
exports.supabase = supabaseUrl && supabaseAnonKey
    ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey)
    : null;
if (!exports.supabase) {
    logger_1.logger.warn('Supabase URL or Anon Key is missing. Database operations will fall back to mock.');
}
