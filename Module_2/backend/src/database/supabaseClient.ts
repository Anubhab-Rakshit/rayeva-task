import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';
import path from 'path';

// Force absolute path resolution directly to the backend directory
const envPath = path.resolve(__dirname, '../../.env');
const result = dotenv.config({ path: envPath });

console.log(`[Supabase Init] Loaded .env from ${envPath}. Success: ${!!result.parsed}`);

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

console.log(`[Supabase Init] URL Presence: ${!!supabaseUrl}`);
console.log(`[Supabase Init] Key Presence: ${!!supabaseAnonKey}`);

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabase) {
    logger.warn('Supabase URL or Anon Key is missing. Database operations will fall back to mock.');
}
