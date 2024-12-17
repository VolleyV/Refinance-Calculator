import { useState } from "react";
import BasicForm from "./BasicForm";
import AdvanceForm from "./AdvanceForm";

const InputForm = () => {
  const [activeTab, setActiveTab] = useState("basic");

  const switchTab = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="relative p-6 max-w-4xl mx-auto mt-10 rounded-lg shadow-md">
      <div className="flex border-b mt-4">
        <button
          onClick={() => switchTab("basic")}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "basic"
              ? "shrink-0 rounded-t-lg border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600"
              : "shrink-0 border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700"
          }`}
        >
          ข้อมูลพื้นฐาน
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
      {activeTab === "basic" && <BasicForm />}
      {activeTab === "advanced" && <AdvanceForm />}
    </div>
  );
};

export default InputForm;
