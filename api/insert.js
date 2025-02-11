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
    const { month, date, interest, loanAmount, remainingLoan, monthlyPayment, interestRate } = req.body;
    const id = Date.now().toString(); // Generate ID

    if (!month || !date || !interest || !loanAmount || !remainingLoan || !monthlyPayment || !interestRate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Insert data into the "AdvanceDetail" table
    const { data, error } = await supabase.from("AdvanceDetail").insert([
      { id, month, date, interest, loanAmount, remainingLoan, monthlyPayment, interestRate },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "Data inserted successfully", data });
  }