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
    <div className="relative p-6 max-w-4xl mx-auto rounded-lg shadow-md">
      <div className="flex border-b mt-4">
        <button
          onClick={() => switchTab("basic")}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "basic"
              ? "shrink-0 rounded-t-lg border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600"
              : "shrink-0 border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700"
          }`}
        >
          ข้อมูลพื้นฐานแบบเดือน
        </button>
        <button
          onClick={() => switchTab("basicYear")}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "basicYear"
              ? "shrink-0 rounded-t-lg border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600"
              : "shrink-0 border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700"
          }`}
        >
          ข้อมูลพื้นฐานแบบปี
        </button>
        <button
          onClick={() => switchTab("advanced")}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "advanced"
              ? "shrink-0 rounded-t-lg border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600"
              : "shrink-0 border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700"
          }`}
        >
          ข้อมูลขั้นสูง
        </button>
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
