import InputForm from "./components/InputForm";
import Navbar from "./components/Navbar";
import ShowBank from "./components/ShowBank";
import BasicTable from "./components/BasicTable";

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
    // อ่านข้อมูลจาก localStorage เมื่อโหลดหน้าใหม่
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  return (
    <Router>
      <div>
        <Navbar className="bg-gray-800" />
        <Routes>
          <Route
            path="/"
            element={
              <div className="container mx-auto px-4">
                <InputForm onSubmit={handleFormSubmit} />
                {formData && (
                  <div>
                    <ShowBank data={formData} />
                    <button
                      onClick={clearFormData}
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded shadow"
                    >
                      ล้างข้อมูล
                    </button>
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