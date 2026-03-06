import 'dotenv/config';
import { supabase } from './src/database/supabaseClient';

async function testInsert() {
    if (!supabase) {
        console.error("No supabase client");
        return;
    }
    console.log("Testing insert into products...");
    const { data: prodData, error: prodErr } = await supabase.from('products').insert([{
        id: `test_prod_${Date.now()}`,
        title: 'Test Title',
        description: 'Test Description',
        attributes: {},
        generated_meta: {}
    }]).select();

    if (prodErr) {
        console.error("Error inserting product:");
        console.error(JSON.stringify(prodErr, null, 2));
    } else {
        console.log("Success inserting product:", prodData);
    }
}

testInsert().catch(console.error);
