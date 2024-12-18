require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in environment variables');
}

let supabase = null;

const dbConnect = async () => {
    try {
        if (!supabase) {
            supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('Connected to Database');
        } else {
            console.log('Database is already connected');
        }
        return supabase;
    } catch (err) {
        console.error('Error connecting to database:', err);
        throw new Error('Failed to connect to the database'); // Ensure the error is propagated.
    }
};

export default dbConnect;