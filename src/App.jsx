import InputForm from "./components/InputForm";
import Navbar from "./components/Navbar";
import ShowBank from "./components/ShowBank";
import BasicTable from "./components/BasicTable";
import {
  calculateThreeYearSummary,
  basicLoanCalculateDetail,
  toLastSummary,
  remainingToLast,
} from "./utils/basicLoanCalculateDetail";

//Advanced
import ShowBankAdvance from "./components/ShowBankAdvance";
import AdvanceTable from "./components/AdvanceTable";
import {
  advanceLoanCalculateDetail,
  advanceThreeYearsSummary,
} from "./utils/advanceLoanCalculateDetail";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [basicFormData, setBasicFormData] = useState(() => {
    const storedData = sessionStorage.getItem("formData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const [advanceFormData, setAdvanceFormData] = useState(() => {
    const storedData = sessionStorage.getItem("advanceFormData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const handleFormSubmit = (data) => {
    console.log("Basic form submitted:", data);
    setBasicFormData(data);
    sessionStorage.setItem("formData", JSON.stringify(data));
  };

  const handleAdvanceFormSubmit = (advanceData) => {
    setAdvanceFormData(advanceData);
    sessionStorage.setItem("advanceFormData", JSON.stringify(advanceData));
  };

  const clearFormData = () => {
    setBasicFormData(null);
    sessionStorage.removeItem("formData");
  };

  const clearAdvanceFormData = () => {
    setAdvanceFormData(null);
    sessionStorage.removeItem("advanceFormData");
  };

  useEffect(() => {
    const handleUnload = () => {
      if (location.pathname === "/") {
        clearFormData();
        clearAdvanceFormData();
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    // ถอด Event Listener เมื่อคอมโพเนนต์ถูกถอด
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [location]);

  const calculateBasicSummary = () => {
    if (basicFormData) {
      try {
        const calculationDetails = basicLoanCalculateDetail(basicFormData);
        const threeYearSummary = calculateThreeYearSummary(calculationDetails);
        const lastSummary = toLastSummary(calculationDetails);
        const remainSummary = remainingToLast(calculationDetails);
        return {
          ...threeYearSummary,
          ...lastSummary,
          ...remainSummary,
        };
      } catch (error) {
        console.error("Error calculating basic summary:", error);
      }
    }
    return null;
  };

  const calculateAdvanceDetails = () => {
    if (advanceFormData) {
      try {
        const advanceCalculateDetails =
          advanceLoanCalculateDetail(advanceFormData);
        const threeYearSummary = advanceThreeYearsSummary(
          advanceCalculateDetails
        );
        return { ...threeYearSummary };
      } catch (error) {
        console.error("Error calculating advance details:", error);
      }
    }
    return null;
  };

  const basicSummary = calculateBasicSummary();
  const advanceSummary = calculateAdvanceDetails();

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
                  initialInput={basicFormData}
                  onAdvanceSubmit={handleAdvanceFormSubmit}
                  onAdvanceReset={clearAdvanceFormData}
                  advanceInitialInput={advanceFormData}
                />
                {basicFormData && (
                  <div>
                    <ShowBank basicCalculateSummary={basicSummary} />
                  </div>
                )}
                {advanceFormData && (
                  <div>
                    <ShowBankAdvance advanceCalculateSummary={advanceSummary} />
                  </div>
                )}
              </div>
            }
          />
          <Route
            path="/basicTab"
            element={<BasicTable data={basicFormData} />}
          />
          <Route
            path="/advanceTable"
            element={<AdvanceTable advanceData={advanceFormData} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
