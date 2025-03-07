import { useState, useEffect, useRef } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import PropTypes from "prop-types";
import { RiDeleteBinFill } from "react-icons/ri";

const CompareTable = ({ compareData, deleteCompareData }) => {
  console.log(compareData);

  const handleDetailClick = (data) => {
    console.log(window.location.href);

    const encodedData = encodeURIComponent(JSON.stringify(data));
    console.log("Encoded Data: ", encodedData); // Debug the encoded data

    if (encodedData.length > 2048) {
      console.log("Using localStorage for data");
      localStorage.setItem("datasetDetail", JSON.stringify(data));
      window.open(`/details`, "_blank");
    } else {
      console.log("Using URL for data");
      window.open(`/details?data=${encodedData}`, "_blank");
    }
  };

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
    deleteCompareData(newCompareData);

    // ลบชื่อแผนที่ของแถวที่ถูกลบ
    const newPlanNames = planNames.filter((_, i) => i !== index);
    setPlanNames(newPlanNames);
  };

  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (compareData.length > 0 && !hasScrolledRef.current) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
      hasScrolledRef.current = true;
    }
  }, [compareData]);
  return (
    <div className="w-full max-w-full p-4">
      <h1 className="text-3xl font-bold text-[#082044] text-center my-5">
        เปรียบเทียบผลการคำนวณ
      </h1>
      <div className="overflow-x-auto border-2 border-[#082044] rounded-lg text-center max-w-4xl mx-auto">
        <table className="table-auto w-full min-w-max bg-white text-sm border-collapse">
          <thead>
            <tr className="bg-[#082044] text-white">
              <th className="p-3 whitespace-nowrap"></th>
              <th className="p-3 whitespace-nowrap">เฉลี่ยเงินผ่อนต่อเดือน</th>
              <th className="p-3 whitespace-nowrap">ระยะเวลาผ่อน</th>
              <th className="p-3 whitespace-nowrap">ค่าดอกเบี้ย 3 ปีแรก</th>
              <th className="p-3 whitespace-nowrap">ค่าดอกเบี้ยทั้งหมด</th>
              <th className="p-3 whitespace-nowrap">รายละเอียด</th>
              <th className="p-3 whitespace-nowrap">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {compareData.map((item, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
              >
                <td className="border-r border-[#082044] px-4 py-2 text-center align-middle text-lg whitespace-nowrap">
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
                <td className="border-r border-[#082044] px-4 py-2 whitespace-nowrap">
                  {item.advanceSummary.averageMonthlyPayment.toLocaleString()}
                </td>
                <td className="border-r border-[#082044] px-4 py-2 whitespace-nowrap">
                  {item.advanceSummary.totalYears} ปี{" "}
                  {item.advanceSummary.totalMonths} เดือน
                </td>
                <td className="border-r border-[#082044] px-4 py-2 whitespace-nowrap">
                  {item.advanceSummary.totalInterestThreeYears.toLocaleString()}
                </td>
                <td className="border-r border-[#082044] px-4 py-2 whitespace-nowrap">
                  {item.advanceSummary.totalInterestPaid.toLocaleString()}
                </td>
                <td className="border-r border-[#082044] px-4 py-2 whitespace-nowrap">
                  <button
                    className="text-green-500 cursor-pointer"
                    onClick={() => handleDetailClick(item)}
                  >
                    อ่านรายละเอียด
                  </button>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
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
