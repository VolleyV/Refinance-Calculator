const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");  // Axios for making HTTP requests to the PHP backend

const app = express();

// MySQL connection setup
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "database",
  port: "3306",
});

app.use(cors());
app.use(express.json()); // Parse JSON bodies

// POST request to calculate loan via PHP backend
app.post("/api/saveInfo"), (req,res)=>{
  const {
    id,
    principal,
    monthlyPayment,
    termMonths,
    startDate,
    interestRates,
  } = req.body;
  const data = {
    id,
    principal,
    monthlyPayment,
    termMonths,
    startDate,
    interestRates,
  };

  const sqlInsert = "INSERT INTO calculate (ID,Email,Name,Password) VALUES (?,?,?,?,?,?)";
  db.query(sqlInsert, [ID, Email, Name, Password], (err, results) => {
    if (err) console.log(err);
    else res.send({ message: "Inserted successfully" });
  });
}
app.post("/api/calculateLoan", async (req, res) => {
  const {
    id,
    principal,
    monthlyPayment,
    termMonths,
    startDate,
    interestRates,
  } = req.body;

  const data = {
    id,
    principal,
    monthlyPayment,
    termMonths,
    startDate,
    interestRates,
  };

  try {
    // Send the data to the PHP backend for calculation
    const response = await axios.post('http://localhost/refinance/calculate.php', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.success) {
      res.json(response.data); // Forward PHP response to the frontend
    } else {
      res.status(500).send("Error in loan calculation.");
    }
  } catch (error) {
    console.error("Error calling PHP backend:", error);
    res.status(500).send("Error with backend communication.");
  }
});

// Other existing endpoints for MySQL operations
app.post("/api/insert", (req, res) => {
  const { ID, Password, Name, Email } = req.body;

  const sqlInsert = "INSERT INTO Model (ID,Email,Name,Password) VALUES (?,?,?,?)";
  db.query(sqlInsert, [ID, Email, Name, Password], (err, results) => {
    if (err) console.log(err);
    else res.send({ message: "Inserted successfully" });
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
