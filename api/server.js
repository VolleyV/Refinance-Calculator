// api/users.js
import { createClient } from "@supabase/supabase-js";

// ✅ Read environment variables from Vercel environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Stop if keys are missing
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables!");
  process.exit(1); // Stop the serverless function if keys are missing
}

// ✅ Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Use the correct table name
    const { data, error } = await supabase.from("AdvanceDetail").select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  // Return 405 if the method is not GET
  res.status(405).json({ error: "Method Not Allowed" });
}
