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
import CompareTable from "./components/CompareTable";
import DatasetDetails from "./components/DatasetDetails";

function App() {
  const [basicFormData, setBasicFormData] = useState(() => {
    const storedData = sessionStorage.getItem("formData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const [basicFormYearData, setBasicFormYearData] = useState(() => {
    const storedData = sessionStorage.getItem("formYearData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const [advanceFormData, setAdvanceFormData] = useState(() => {
    const storedData = sessionStorage.getItem("advanceFormData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    const isMobile = window.innerWidth < 768;
    let scrollPosition = isMobile
      ? window.innerHeight * 1.5
      : window.innerHeight * 0.7;

    if (isMobile && advanceFormData) {
      scrollPosition = window.innerHeight * 1.8;
    } else if (advanceFormData) {
      scrollPosition = window.innerHeight * 1.2;
    } else {
      scrollPosition;
    }

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (basicFormData || basicFormYearData || advanceFormData) {
      scrollToBottom();
    }
  }, [basicFormData, basicFormYearData, advanceFormData]);

  //submit
  const handleFormSubmit = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      setBasicFormData(data);
      sessionStorage.setItem("formData", JSON.stringify(data));
      setIsLoading(false);
    }, 500);
  };

  const handleBasicFormYearSubmit = (basicYearData) => {
    setIsLoading(true);
    setTimeout(() => {
      setBasicFormYearData(basicYearData);
      sessionStorage.setItem("formYearData", JSON.stringify(basicYearData));
      setIsLoading(false);
    }, 500);
  };

  const handleAdvanceFormSubmit = (advanceData) => {
    setIsLoading(true);
    setTimeout(() => {
      setAdvanceFormData(advanceData);
      sessionStorage.setItem("advanceFormData", JSON.stringify(advanceData));
      setIsLoading(false);
    }, 500);
  };

  //Clear
  const clearFormData = () => {
    setBasicFormData(null);
    sessionStorage.removeItem("formData");
  };

  const clearBasicFormYearData = () => {
    setBasicFormYearData(null);
    sessionStorage.removeItem("formYearData");
  };

  const clearAdvanceFormData = () => {
    setAdvanceFormData(null);
    setCalculatedData([]);
    sessionStorage.removeItem("advanceFormData");
  };

  useEffect(() => {
    const handleUnload = () => {
      if (window.location.pathname === "/") {
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
        return {
          ...advanceCalculateDetails,
          ...threeYearSummary,
          ...advanceRemainSummary,
        };
      } catch (error) {
        console.error("Error calculating advance details:", error);
      }
    }
    return null;
  };

  const basicSummary = calculateBasicSummary();
  const basicYearSummary = calculateBasicYearSummary();
  const advanceSummary = calculateAdvanceDetails();

  const [calculatedData, setCalculatedData] = useState([]);

  // ฟังก์ชันคำนวณข้อมูลเมื่อมี advanceFormData
  useEffect(() => {
    if (advanceFormData) {
      // ดึงข้อมูลการคำนวณจาก advanceLoanCalculateDetail
      const details = advanceLoanCalculateDetail(advanceFormData);

      // แปลงข้อมูลให้มีแค่ field ที่ต้องการ
      const formattedData = details.map((detail) => ({
        month: detail.month,
        date: detail.date,
        interest: detail.interest,
        loanAmountPortion: detail.principalPortion,
        remainingLoanAmount: detail.remainingPrincipal,
        monthlyPayment: detail.monthlyPayment,
        interestRate: detail.interestRate,
      }));

      setCalculatedData(formattedData);
    }
  }, [advanceFormData]);

  console.log(calculatedData);

  const [compareData, setCompareData] = useState([]);
  const saveToTable = (advanceSummary) => {
    console.log(window.location.href);

    const dataWithTimestamp = {
      ...advanceSummary,
      timeStamp: Date.now(), // Add a unique timestamp
    };
    setCompareData((prev) => {
      const updatedCompareData = [...prev, dataWithTimestamp];
      console.log(updatedCompareData); // Log to see if the state is updating correctly
      return updatedCompareData;
    });
  };

  return (
    <Router>
      <div>
        <Navbar className="bg-gray-800" />
        <Routes>
          <Route
            path="/"
            element={
              <div className="bg-[#082044] h-80">
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
                  isLoading={isLoading}
                />
                {isLoading && (
                  <div className="text-center my-4">
                    <div className="loader mx-auto"></div>
                    <p>กำลังคำนวณ...</p>
                  </div>
                )}
                {!isLoading && basicFormData && (
                  <ShowBank basicCalculateSummary={basicSummary} />
                )}
                {!isLoading && basicFormYearData && (
                  <ShowBankBasicYear
                    basicYearCalculateSummary={basicYearSummary}
                  />
                )}
                {!isLoading && advanceFormData && (
                  <>
                    <ShowBankAdvance advanceCalculateSummary={advanceSummary} />
                    <div className="bg-gray-200 p-4 text-center mt-4 w-full">
                      <div className="flex justify-center items-center space-x-2">
                        <p className="inline">
                          หากต้องการเปรียบเทียบผลการคำนวณ{" "}
                          <button
                            className="font-bold text-xl text-[#30A572] cursor-pointer underline inline whitespace-nowrap"
                            onClick={() => saveToTable({ advanceSummary })}
                          >
                            คลิกที่นี่
                          </button>{" "}
                          เพื่อทำการบันทึกผลไว้ในตาราง
                        </p>
                      </div>
                    </div>
                    {compareData.length > 0 && (
                      <div>
                        <CompareTable
                          compareData={compareData}
                          setCompareData={setCompareData}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            }
          />
          <Route
            path="/basicTab"
            element={
              <BasicTable
                data={
                  basicFormData || {
                    loanAmount: "0",
                    interestRate: "0",
                    monthlyPayment: "0",
                    startDate: "",
                  }
                }
              />
            }
          />
          <Route
            path="/basicYearTable"
            element={
              <BasicYearTable
                basicYearData={
                  basicFormYearData || {
                    loanAmount: "0",
                    interestRate: "0",
                    paymentDuration: 0,
                    startDate: "",
                  }
                }
              />
            }
          />
          <Route
            path="/advanceTable"
            element={<AdvanceTable advanceData={advanceFormData || []} />}
          />
          <Route path="/dataset" element={<DatasetDetails />} />

          {/* Add other routes as necessary */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
