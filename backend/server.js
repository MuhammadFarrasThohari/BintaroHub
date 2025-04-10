const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supaBaseURL = process.env.PROJECT_URL;
const supaBaseKey = process.env.API_KEY;
const supabase = createClient(supaBaseURL, supaBaseKey);

module.exports = supabase;