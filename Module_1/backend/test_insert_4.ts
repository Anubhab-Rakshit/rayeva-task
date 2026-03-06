import 'dotenv/config';
import { supabase } from './src/database/supabaseClient';

async function testInsertLog() {
    if (!supabase) return;

    console.log("Testing insert into ai_logs...");
    const { data: logData, error: logErr } = await supabase.from('ai_logs').insert([{
        id: `log_${Date.now()}`,
        product_id: 'test_prod_1772651144786',
        module: 'Test',
        prompt: 'Test',
        response: { test: true },
        model: 'gemini-2.5-flash',
        validated: true
    }]).select();

    if (logErr) {
        console.error("Error inserting ai_log:");
        console.error(JSON.stringify(logErr, null, 2));
    } else {
        console.log("Success inserting ai_log:", logData);
    }
}

testInsertLog().catch(console.error);
