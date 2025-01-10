import { useState, useEffect } from "react";
import BasicForm from "./BasicForm";
import AdvanceForm from "./AdvanceForm";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import BasicFormYear from "./BasicFormYear";

const InputForm = ({
  onSubmit,
  onReset,
  initialInput = null,
  onSubmitBasicYear,
  onResetBasicYear,
  basicYearInitialInput = null,
  onAdvanceSubmit,
  onAdvanceReset,
  advanceInitialInput = null,
}) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const tabFromSession = sessionStorage.getItem("activeTab");
    return location.state?.activeTab || tabFromSession || "basic";
  });

  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);
  console.log(location.state);

  const switchTab = (tab) => {
    if (tab === "basic" && activeTab !== "basic") {
      onAdvanceReset();
      onResetBasicYear();
    } else if (tab === "advanced" && activeTab !== "advanced") {
      onReset();
      onResetBasicYear();
    } else if (tab === "basicYear" && activeTab !== "basicYear") {
      onReset();
      onAdvanceReset();
    }
    setActiveTab(tab);
  };
  return (
    <div className="relative p-6 max-w-4xl mx-auto rounded-lg shadow-md border-t">
      <div className="flex flex-wrap gap-2 overflow-x-auto">
        <div className="border-gray-200 container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <nav className="-mb-px flex justify-between w-full" aria-label="Tabs">
              <button
                onClick={() => switchTab("basic")}
                className={`flex-1 text-center border-b-2 ${activeTab === "basic"
                  ? "border-sky-500 text-sky-600"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } px-1 pb-4 text-sm font-medium`}
              >
                ผ่อนต่อเดือน
              </button>
              <button
                onClick={() => switchTab("basicYear")}
                className={`flex-1 text-center border-b-2 ${activeTab === "basicYear"
                  ? "border-sky-500 text-sky-600"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } px-1 pb-4 text-sm font-medium`}
              >
                เลือกระยะเวลา
              </button>
              <button
                onClick={() => switchTab("advanced")}
                className={`flex-1 text-center border-b-2 ${activeTab === "advanced"
                  ? "border-sky-500 text-sky-600"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } px-1 pb-4 text-sm font-medium`}
              >
                ข้อมูลขั้นสูง
              </button>
            </nav>
          </div>
        </div>
      </div>







      {activeTab === "basic" && (
        <BasicForm
          onSubmit={onSubmit}
          onReset={onReset}
          initialInput={initialInput}
        />
      )}
      {activeTab === "basicYear" && (
        <BasicFormYear
          onSubmitBasicYear={onSubmitBasicYear}
          onResetBasicYear={onResetBasicYear}
          basicYearInitialInput={basicYearInitialInput}
        />
      )}
      {activeTab === "advanced" && (
        <AdvanceForm
          onAdvanceSubmit={onAdvanceSubmit}
          onAdvanceReset={onAdvanceReset}
          advanceInitialInput={advanceInitialInput}
        />
      )}
    </div>

  );
};

InputForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  initialInput: PropTypes.object,
  onSubmitBasicYear: PropTypes.func.isRequired,
  onResetBasicYear: PropTypes.func.isRequired,
  basicYearInitialInput: PropTypes.object,
  onAdvanceSubmit: PropTypes.func.isRequired,
  onAdvanceReset: PropTypes.func.isRequired,
  advanceInitialInput: PropTypes.object,
};
export default InputForm;
