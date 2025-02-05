import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config(); // ✅ Load environment variables from .env

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Read environment variables correctly
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables!");
  process.exit(1); // Stop server if keys are missing
}

// ✅ Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample API route
app.get("/api/users", async (req, res) => {
  const { data, error } = await supabase.from("AdvanceDetail").select("*"); // ✅ Use correct table name

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
