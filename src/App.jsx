import InputForm from "./components/InputForm";
import Navbar from "./components/Navbar";
import ShowBank from "./components/ShowBank";
import BasicTable from "./components/BasicTable";
import {
  calculateThreeYearSummary,
  basicLoanCalculateDetail,
} from "./utils/basicLoanCalculateDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [formData, setFormData] = useState(() => {
    // อ่านข้อมูลจาก localStorage เมื่อเริ่มต้น
    const storedData = localStorage.getItem("formData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const handleFormSubmit = (data) => {
    setFormData(data); // เก็บข้อมูลใน state
    localStorage.setItem("formData", JSON.stringify(data)); // เก็บข้อมูลใน localStorage
  };

  const clearFormData = () => {
    setFormData(null); // ลบข้อมูลใน state
    localStorage.removeItem("formData"); // ลบข้อมูลใน localStorage
  };

  useEffect(() => {
    const handleUnload = () => {
      clearFormData();
    };

    window.addEventListener("beforeunload", handleUnload);

    // ถอด Event Listener เมื่อคอมโพเนนต์ถูกถอด
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const calculateSummary = () => {
    if (formData) {
      try {
        const calculationDetails = basicLoanCalculateDetail(formData);
        return calculateThreeYearSummary(calculationDetails);
      } catch (error) {
        console.error("Error calculating summary:", error);
      }
    }
    return null;
  };

  const threeYearSummary = calculateSummary();

  return (
    <Router>
      <div>
        <Navbar className="bg-gray-800" />
        <Routes>
          <Route
            path="/"
            element={
              <div className="container mx-auto px-4">
                <InputForm
                  onSubmit={handleFormSubmit}
                  onReset={clearFormData}
                  initialInput={formData}
                />
                {formData && (
                  <div>
                    <ShowBank threeYearSummary={threeYearSummary} />
                  </div>
                )}
              </div>
            }
          />
          <Route path="/table" element={<BasicTable data={formData} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
