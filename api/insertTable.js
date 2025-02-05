import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { month, date, interest, LoanAmount, RemainingLoan, monthlyPayment, interestRate } = req.body;

    const id = Date.now().toString(); // Auto-generate ID

    if (!month || !date || !interest || !LoanAmount || !RemainingLoan || !monthlyPayment || !interestRate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase.from("AdvanceDetail").insert([
      { id, month, date, interest, LoanAmount, RemainingLoan, monthlyPayment, interestRate },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "Data inserted successfully", data });
  }

  res.status(405).json({ error: "Method Not Allowed" });
}
