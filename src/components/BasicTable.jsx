import PropTypes from "prop-types";
import { useState } from "react";
import { basicLoanCalculateDetail } from "../utils/basicLoanCalculateDetail.js";
const BasicTable = ({ data }) => {
  if (!data) {
    return <p>ไม่มีข้อมูล กรุณากลับไปกรอกแบบฟอร์มก่อน</p>;
  }

  const itemsPerPage = 36; // จำนวนงวดต่อหน้า
  const [currentPage, setCurrentPage] = useState(1);

  const calculationDetails = basicLoanCalculateDetail(data);

  // คำนวณข้อมูลสำหรับหน้า
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = calculationDetails.slice(startIndex, endIndex);

  const totalPages = Math.ceil(calculationDetails.length / itemsPerPage);

  // ฟังก์ชันเปลี่ยนหน้า
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-lg font-bold">ตารางการคำนวณ</h2>
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
                    {parseFloat(detail.principalPortion).toLocaleString()}
                  </td>
                  <td className="border px-6 py-4 text-center">
                    {parseFloat(detail.interest).toLocaleString()}
                  </td>
                  <td className="border px-6 py-4 text-center">
                    {parseFloat(detail.remainingPrincipal).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ปุ่มเปลี่ยนหน้า */}
          <div className="flex justify-between mt-4">
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
          </div>
        </div>
      ) : (
        <p>ไม่มีข้อมูลการคำนวณ</p>
      )}
    </div>
  );
};

BasicTable.propTypes = {
  data: PropTypes.shape({
    loanAmount: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    paymentDuration: PropTypes.number.isRequired,
    interestRate: PropTypes.number.isRequired,
    monthlyPayment: PropTypes.string.isRequired,
  }).isRequired,
};

export default BasicTable;
