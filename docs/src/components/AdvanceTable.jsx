import PropTypes from "prop-types";
import { useState } from "react";
import { advanceLoanCalculateDetail } from "../utils/advanceLoanCalculateDetail";
import { useNavigate } from "react-router-dom";
const AdvanceTable = ({ advanceData }) => {
  if (!advanceData) {
    return <p>ไม่มีข้อมูล กรุณากลับไปกรอกแบบฟอร์มก่อน</p>;
  }

  const navigate = useNavigate(); // Hook สำหรับนำทางไปยังหน้าอื่น

  const goBack = () => {
    navigate(-1); // นำทางกลับไปหน้าก่อนหน้า
  };

  const itemsPerPage = 36; // จำนวนงวดต่อหน้า
  const [currentPage, setCurrentPage] = useState(1);

  const calculationDetails = advanceLoanCalculateDetail(advanceData);

  // คำนวณข้อมูลสำหรับหน้า
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = calculationDetails.slice(startIndex, endIndex);

  const totalPages = Math.ceil(calculationDetails.length / itemsPerPage);

  // ฟังก์ชันเปลี่ยนหน้า
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      scrollToTop();
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToTop();
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    scrollToTop();
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // เพิ่มความลื่นไหลในการเลื่อน
    });
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="relative flex items-center mb-5">
        <button
          onClick={goBack}
          className="absolute left-0 mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ย้อนกลับ
        </button>
        <h2 className="text-lg font-bold mx-auto">ตารางการคำนวณ</h2>
      </div>
      {currentItems.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  งวดที่
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  วันที่
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  อัตราดอกเบี้ย
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  ผ่อนต่อเดือน
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  เงินต้น
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  ดอกเบี้ย
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  ยอดคงเหลือ
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((detail, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  }`}
                >
                  <td className="border px-6 py-4 text-center">
                    {detail.month}
                  </td>
                  <td className="border px-6 py-4 text-center">
                    {detail.date}
                  </td>
                  <td className="border px-6 py-4 text-center">
                    {parseFloat(detail.interestRate).toLocaleString()}%
                  </td>
                  <td className="border px-6 py-4 text-center">
                    {parseFloat(detail.monthlyPayment).toLocaleString()}
                  </td>
                  <td className="border px-6 py-4 text-center">
                    {parseFloat(detail.loanAmountPortion).toLocaleString()}
                  </td>
                  <td className="border px-6 py-4 text-center">
                    {parseFloat(detail.interest).toLocaleString()}
                  </td>
                  <td className="border px-6 py-4 text-center">
                    {parseFloat(detail.remainingLoanAmount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ปุ่มเปลี่ยนหน้า */}
          <div className="flex justify-between mt-4">
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              หน้าแรก
            </button>
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              หน้าก่อนหน้า
            </button>
            <span>
              หน้า {currentPage} จาก {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              หน้าถัดไป
            </button>
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              หน้าสุดท้าย
            </button>
          </div>
        </div>
      ) : (
        <p>ไม่มีข้อมูลการคำนวณ</p>
      )}
    </div>
  );
};

AdvanceTable.propTypes = {
  advanceData: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      interestRate: PropTypes.number.isRequired, // แก้เป็น number
      monthlyPayment: PropTypes.number.isRequired, // แก้เป็น number
      loanAmountPortion: PropTypes.number.isRequired, // แก้ชื่อให้ตรง
      interest: PropTypes.number.isRequired, // แก้เป็น number
      remainingLoanAmount: PropTypes.number.isRequired, // แก้ชื่อให้ตรง
    })
  ),
};

export default AdvanceTable;
