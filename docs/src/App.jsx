import InputForm from "./components/InputForm";
import Navbar from "./components/Navbar";
import ShowBank from "./components/ShowBank";
import BasicTable from "./components/BasicTable";
import {
  calculateThreeYearSummary,
  basicLoanCalculateDetail,
  remainingToLast,
} from "./utils/basicLoanCalculateDetail";
import ShowBankBasicYear from "./components/ShowBankBasicYear";
import BasicYearTable from "./components/BasicYearTable";
import {
  basicYearLoanCalculateDetail,
  calculateBasicYearThreeYearSummary,
  remainingBasicYearToLast,
} from "./utils/basicYearLoanCalculateDetail";
//Advanced
import ShowBankAdvance from "./components/ShowBankAdvance";
import AdvanceTable from "./components/AdvanceTable";
import {
  advanceLoanCalculateDetail,
  advanceThreeYearsSummary,
  advanceRemainingToLast,
} from "./utils/advanceLoanCalculateDetail";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [basicFormData, setBasicFormData] = useState(() => {
    const storedData = sessionStorage.getItem("formData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const [basicFormYearData, setBasicFormYearData] = useState(() => {
    const storedData = sessionStorage.getItem("formData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const [advanceFormData, setAdvanceFormData] = useState(() => {
    const storedData = sessionStorage.getItem("advanceFormData");
    return storedData ? JSON.parse(storedData) : null;
  });

  //submit
  const handleFormSubmit = (data) => {
    console.log("Basic form submitted:", data);
    setBasicFormData(data);
    sessionStorage.setItem("formData", JSON.stringify(data));
  };

  const handleBasicFormYearSubmit = (basicYearData) => {
    console.log("Basic form submitted:", basicYearData);
    setBasicFormYearData(basicYearData);
    sessionStorage.setItem("formData", JSON.stringify(basicYearData));
  };

  const handleAdvanceFormSubmit = (advanceData) => {
    setAdvanceFormData(advanceData);
    sessionStorage.setItem("advanceFormData", JSON.stringify(advanceData));
  };

  //Clear
  const clearFormData = () => {
    setBasicFormData(null);
    sessionStorage.removeItem("formData");
  };

  const clearBasicFormYearData = () => {
    setBasicFormYearData(null);
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
        clearBasicFormYearData();
        clearAdvanceFormData();
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [location]);

  const calculateBasicSummary = () => {
    if (basicFormData) {
      try {
        const calculationDetails = basicLoanCalculateDetail(basicFormData);
        const threeYearSummary = calculateThreeYearSummary(calculationDetails);
        const remainSummary = remainingToLast(calculationDetails);
        return {
          ...threeYearSummary,
          ...remainSummary,
        };
      } catch (error) {
        console.error("Error calculating basic summary:", error);
      }
    }
    return null;
  };

  const calculateBasicYearSummary = () => {
    if (basicFormYearData) {
      try {
        const basicYearCalculationDetails =
          basicYearLoanCalculateDetail(basicFormYearData);
        const threeYearSummary = calculateBasicYearThreeYearSummary(
          basicYearCalculationDetails
        );
        const remainSummary = remainingBasicYearToLast(
          basicYearCalculationDetails
        );
        return {
          ...threeYearSummary,
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
        const advanceRemainSummary = advanceRemainingToLast(
          advanceCalculateDetails
        );
        return { ...threeYearSummary, ...advanceRemainSummary };
      } catch (error) {
        console.error("Error calculating advance details:", error);
      }
    }
    return null;
  };

  const basicSummary = calculateBasicSummary();
  const basicYearSummary = calculateBasicYearSummary();
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
                  onSubmitBasicYear={handleBasicFormYearSubmit}
                  onResetBasicYear={clearBasicFormYearData}
                  basicYearInitialInput={basicFormYearData}
                  onAdvanceSubmit={handleAdvanceFormSubmit}
                  onAdvanceReset={clearAdvanceFormData}
                  advanceInitialInput={advanceFormData}
                />
                {basicFormData && (
                  <div>
                    <ShowBank basicCalculateSummary={basicSummary} />
                  </div>
                )}
                {basicFormYearData && (
                  <div>
                    <ShowBankBasicYear
                      basicYearCalculateSummary={basicYearSummary}
                    />
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
            element={<BasicTable data={basicFormData || {}} />}
          />
          <Route
            path="/basicYearTable"
            element={<BasicYearTable basicYearData={basicFormYearData || {}} />}
          />
          <Route
            path="/advanceTable"
            element={<AdvanceTable advanceData={advanceFormData || {}} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;