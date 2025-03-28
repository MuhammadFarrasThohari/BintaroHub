const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supaBaseURL = process.env.PROJECT_URL;
const supaBaseKey = process.env.API_KEY;
try {
    const supabase = createClient(supaBaseURL, supaBaseKey);
    console.log("Supabase connected");
} catch (e) {
    console.log(e);
}
