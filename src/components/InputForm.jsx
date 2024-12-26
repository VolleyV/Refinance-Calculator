import { useState, useEffect } from "react";
import BasicForm from "./BasicForm";
import AdvanceForm from "./AdvanceForm";
import BasicFormYear from "./BasicFormYear";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

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
  onSubmitBasicYear,
  onResetBasicYear,
  basicYearInitialInput = null,
}) => {
  const location = useLocation();

  // Active tab state, fallback to session storage or default
  const [activeTab, setActiveTab] = useState(() => {
    const tabFromSession = sessionStorage.getItem("activeTab");
    return location.state?.activeTab || tabFromSession || "basic";
  });

  // Persist activeTab in session storage
  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Switch tabs and reset data if necessary
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

    setActiveTab(tab); // Update active tab
  };

  return (
    <div className="relative p-6 max-w-4xl mx-auto rounded-lg shadow-md">
      {/* Tab navigation */}
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

      {/* Render content for the active tab */}
      {activeTab === "basic" && (
        <BasicForm onSubmit={onSubmit} onReset={onReset} initialInput={initialInput} />
      )}
      {activeTab === "basicYear" && (
        <BasicFormYear
          onSubmit={onSubmitBasicYear}
          onReset={onResetBasicYear}
          initialInput={basicYearInitialInput}
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
          onSubmit={onAdvanceSubmit}
          onReset={onAdvanceReset}
          initialInput={advanceInitialInput}
        />
      )}
    </div>
  );
};

// PropType Definitions
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
  onSubmitBasicYear: PropTypes.func.isRequired,
  onResetBasicYear: PropTypes.func.isRequired,
  basicYearInitialInput: PropTypes.object,
};

export default InputForm;
