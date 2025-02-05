import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ✅ Read environment variables (set in Vercel)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: "Missing Supabase environment variables!" });
  }

  // ✅ Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // ✅ Get request body
  const { advanceSummary } = req.body;

  if (!advanceSummary || !Array.isArray(advanceSummary) || advanceSummary.length === 0) {
    return res.status(400).json({ error: "Missing or invalid data format" });
  }

  // ✅ Add unique ID to each entry
  const formattedData = advanceSummary.map((entry) => ({
    id: Date.now().toString() + Math.floor(Math.random() * 1000), // Unique ID
    ...entry,
  }));

  // ✅ Insert multiple records into the "AdvanceDetail" table
  const { error } = await supabase.from("AdvanceDetail").insert(formattedData);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ message: "Data inserted successfully" });
}
