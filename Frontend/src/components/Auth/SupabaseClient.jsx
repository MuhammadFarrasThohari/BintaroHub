import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// export const supabaseUrly = import.meta.env.VITE_SUPABASE_URL;

// console.log("Supabase URL from environment variable:", supabaseUrl);
// console.log("Supabase Anon Key from environment variable:", supabaseAnonKey);
// console.log("All env vars:", import.meta.env);
