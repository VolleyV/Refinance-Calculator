app.post("/api/insert", async (req, res) => {
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

  res.status(201).json({ message: "Data inserted successfully", data });
});
