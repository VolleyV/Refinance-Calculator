import { useState, useEffect, useRef } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import PropTypes from "prop-types";
import { RiDeleteBinFill } from "react-icons/ri";

const CompareTable = ({ compareData, setCompareData }) => {
  const [planNames, setPlanNames] = useState(
    compareData.map((_, index) => `แผนที่ ${index + 1}`)
  );
  const [editIndex, setEditIndex] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setPlanNames((prevPlanNames) => {
      if (compareData.length > prevPlanNames.length) {
        const newPlans = Array.from(
          { length: compareData.length - prevPlanNames.length },
          (_, index) => `แผนที่ ${prevPlanNames.length + index + 1}`
        );
        return [...prevPlanNames, ...newPlans];
      }
      return prevPlanNames.slice(0, compareData.length);
    });
  }, [compareData]);

  useEffect(() => {
    if (editIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editIndex]);

  const handleNameChange = (index, newName) => {
    const newPlanNames = [...planNames];
    newPlanNames[index] = newName;
    setPlanNames(newPlanNames);
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setInputValue(planNames[index]);
  };

  const handleSave = () => {
    if (editIndex !== null) {
      handleNameChange(editIndex, inputValue);
      setEditIndex(null);
    }
  };

  // ลบแผน
  const handleDelete = (index) => {
    const newCompareData = compareData.filter((_, i) => i !== index);
    setCompareData(newCompareData);
    const newPlanNames = planNames.filter((_, i) => i !== index);
    setPlanNames(newPlanNames);
  };

  return (
    <div className="overflow-x-auto p-4 justify-center items-center">
      <h1 className="text-3xl font-bold text-[#082044] text-center my-5">
        เปรียบเทียบผลการคำนวณ
      </h1>
      <div className="border-2 border-[#082044] rounded-lg overflow-hidden text-center max-w-4xl mx-auto overflow-x-auto">
        <table className="table-auto w-full bg-white text-sm border-collapse text-nowrap">
          <thead>
            <tr className="bg-[#082044] text-white">
              <th className="p-3">timeStamp</th>
              <th className="p-3"></th>
              <th className="p-3">เฉลี่ยเงินผ่อนต่อเดือน</th>
              <th className="p-3">ระยะเวลาผ่อน</th>
              <th className="p-3">ค่าดอกเบี้ย 3 ปีแรก</th>
              <th className="p-3">ค่าดอกเบี้ยทั้งหมด</th>
              <th className="p-3">รายละเอียด</th>
              <th className="p-3">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {compareData.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                } text-nowrap relative`}
              >
                <td className="border-r border-[#082044] px-4 py-2">
                  {item.timeStamp}
                </td>
                <td className="border-r border-[#082044] px-4 py-2 text-center align-middle text-lg relative">
                  <div className="flex items-center justify-center">
                    <div className="text-sm">{planNames[index]}</div>
                    <HiPencilSquare
                      className="ml-2 text-[#82828E] cursor-pointer"
                      onClick={() => handleEditClick(index)}
                    />
                  </div>

                  {editIndex === index && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-10 translate-y-full z-50 bg-white shadow-lg border border-gray-300 rounded p-2">
                      <input
                        type="text"
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                        onBlur={handleSave}
                        className="border border-gray-300 rounded text-sm p-1 w-40"
                      />
                    </div>
                  )}
                </td>
                <td className="border-r border-[#082044] px-4 py-2">
                  {item.advanceSummary.averageMonthlyPayment.toLocaleString()}
                </td>
                <td className="border-r border-[#082044] px-4 py-2">
                  {item.advanceSummary.totalYears} ปี{" "}
                  {item.advanceSummary.totalMonths} เดือน
                </td>
                <td className="border-r border-[#082044] px-4 py-2">
                  {item.advanceSummary.totalInterestThreeYears.toLocaleString()}
                </td>
                <td className="border-r border-[#082044] px-4 py-2">
                  {item.advanceSummary.totalInterestPaid.toLocaleString()}
                </td>
                <td className="border-r border-[#082044] px-4 py-2">
                  <button className="text-green-500 cursor-pointer">
                    อ่านรายละเอียด
                  </button>
                </td>
                <td className="px-4 py-2">
                  <RiDeleteBinFill
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

CompareTable.propTypes = {
  compareData: PropTypes.arrayOf(
    PropTypes.shape({
      timeStamp: PropTypes.string.isRequired,
      advanceSummary: PropTypes.shape({
        averageMonthlyPayment: PropTypes.number.isRequired,
        totalInterestThreeYears: PropTypes.number.isRequired,
        totalInterestPaid: PropTypes.number.isRequired,
        totalYears: PropTypes.number.isRequired,
        totalMonths: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
  setCompareData: PropTypes.func.isRequired,
};

export default CompareTable;
