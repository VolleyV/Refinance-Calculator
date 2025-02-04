import { useState, useEffect } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import PropTypes from "prop-types";
import { RiDeleteBinFill } from "react-icons/ri";

const CompareTable = ({ compareData, setCompareData }) => {
  console.log(compareData);
  const [planNames, setPlanNames] = useState(
    compareData.map((_, index) => `แผนที่ ${index + 1}`)
  );
  const [editIndex, setEditIndex] = useState(null);

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

  const handleNameChange = (index, newName) => {
    const newPlanNames = [...planNames];
    newPlanNames[index] = newName;
    setPlanNames(newPlanNames);
  };

  const handleDelete = (index) => {
    const newCompareData = compareData.filter((_, i) => i !== index);
    setCompareData(newCompareData);

    // ลบชื่อแผนที่ของแถวที่ถูกลบ
    const newPlanNames = planNames.filter((_, i) => i !== index);
    setPlanNames(newPlanNames);
  };

  return (
    <div className="overflow-x-auto p-4 justify-center items-center">
      <h1 className="text-3xl font-bold text-[#082044] text-center my-5">
        เปรียบเทียบผลการคำนวณ
      </h1>
      <div className="border-2 border-[#082044] rounded-lg overflow-hidden text-center max-w-4xl mx-auto">
        <table className="table-auto w-full bg-white text-sm border-collapse">
          <thead>
            <tr className="bg-[#082044] text-white">
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
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
              >
                <td className="border-r border-[#082044] px-4 py-2 text-center align-middle text-lg">
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={planNames[index]}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      onBlur={() => setEditIndex(null)}
                      autoFocus
                      className="border border-gray-300 rounded text-sm w-full max-w-[100px]"
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      <div className="text-sm">{planNames[index]}</div>
                      <HiPencilSquare
                        className="ml-2 text-[#82828E] cursor-pointer"
                        onClick={() => setEditIndex(index)}
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
      averageMonthlyPayment: PropTypes.number.isRequired,
      totalInterestThreeYears: PropTypes.number.isRequired,
      totalInterestPaid: PropTypes.number.isRequired,
      totalYears: PropTypes.number.isRequired,
      totalMonths: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default CompareTable;
