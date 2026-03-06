import 'dotenv/config';
import { supabase } from './src/database/supabaseClient';

async function test() {
    console.log("Supabase?", !!supabase);
    const { data, error } = await supabase.from('products').insert([{
        id: 'test_prod_123',
        title: 'Test',
        description: 'Test',
        attributes: {},
        generated_meta: {}
    }]).select();
    
    console.log("Result:", data);
    if (error) console.error("Error:", error);
}

test();
