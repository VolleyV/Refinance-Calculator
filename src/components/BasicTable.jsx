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
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-lg font-bold">ตารางการคำนวณ</h2>
      {currentItems.length > 0 ? (
        <div>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-700">
              <tr>
                <th className="border px-4 py-2">เดือน</th>
                <th className="border px-4 py-2">วันที่</th>
                <th className="border px-4 py-2">อัตราดอกเบี้ย</th>
                <th className="border px-4 py-2">ผ่อนต่อเดือน</th>
                <th className="border px-4 py-2">ส่วนที่จ่ายต้น</th>
                <th className="border px-4 py-2">ดอกเบี้ย</th>
                <th className="border px-4 py-2">ยอดคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.month}</td>
                  <td>{detail.date}</td>
                  <td>{parseFloat(detail.interestRate).toLocaleString()}%</td>
                  <td>{parseFloat(detail.monthlyPayment).toLocaleString()}</td>
                  <td>
                    {parseFloat(detail.principalPortion).toLocaleString()}
                  </td>
                  <td>{parseFloat(detail.interest).toLocaleString()}</td>
                  <td>
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
