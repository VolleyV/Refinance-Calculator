import express from 'express';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors'; // If you're using CORS

const app = express();
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS

// Your API routes
app.post("/api/insert", async (req, res) => {
  const dataToInsert = req.body; // This will be an array of objects

  if (!Array.isArray(dataToInsert) || dataToInsert.length === 0) {
    return res.status(400).json({ error: "No data to insert" });
  }

  // Insert all data at once
  const { data, error } = await supabase.from("AdvanceDetail").insert(dataToInsert);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: "Data inserted successfully", data });
});


const port = process.env.PORT || 5175;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
