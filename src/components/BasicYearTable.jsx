import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { basicYearLoanCalculateDetail } from "../utils/basicYearLoanCalculateDetail";
import { FaFileDownload } from "react-icons/fa";
import Pagination from "./Pagination";

const BasicYearTable = ({ basicYearData }) => {
  if (!basicYearData) {
    return <p>ไม่มีข้อมูล กรุณากลับไปกรอกแบบฟอร์มก่อน</p>;
  }

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 50);
  }, []);

  const itemsPerPage = 36;
  const calculationDetails = basicYearLoanCalculateDetail(basicYearData);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(calculationDetails.length / itemsPerPage);

  // คำนวณรายการที่ต้องแสดงในหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = calculationDetails.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const printPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const tableElement = document.getElementById("table-to-pdf");

    if (!tableElement) {
      console.error("Table element not found for PDF export.");
      return;
    }

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage(); // Add a new page for subsequent parts
      setCurrentPage(page + 1);

      await new Promise((resolve) => setTimeout(resolve, 500)); // Allow DOM to update

      // Set scale for better quality and larger text
      const canvas = await html2canvas(tableElement, {
        scale: 3, // Larger values (e.g., 3 or 4) make text bigger and sharper
      });

      const imgData = canvas.toDataURL("image/png");

      const imgWidth = 210; // Width in PDF
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
    }

    const pdfBlob = pdf.output("blob");
    const blobURL = URL.createObjectURL(pdfBlob);
    window.open(blobURL, "_blank");
  };
  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="flex items-center justify-between w-full mb-5">
        <h2 className="text-2xl font-bold">ตารางการคำนวณ</h2>
        <button
          onClick={printPDF}
          className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          <FaFileDownload />
          <span>Download PDF</span>
        </button>
      </div>
      {currentItems.length > 0 ? (
        <div
          className="overflow-x-auto rounded-lg border border"
          id="table-to-pdf"
        >
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm rounded-lg overflow-hidden">
            <thead className="bg-[#082044] text-white rounded-t-lg">
              <tr>
                <th className="whitespace-nowrap px-6 py-4 font-medium">
                  งวดที่
                </th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">
                  วันที่
                </th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">
                  อัตราดอกเบี้ย
                </th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">
                  ผ่อนต่อเดือน
                </th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">
                  เงินต้น
                </th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">
                  ดอกเบี้ย
                </th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">
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
                      ? "bg-gray-100" //bg-gray-100 dark:bg-gray-800
                      : "bg-white" //bg-white dark:bg-gray-900
                  }`}
                >
                  <td className="border px-6 py-4 text-center">
                    {detail.month}
                  </td>
                  <td className="border px-6 py-4 text-center whitespace-nowrap">
                    {new Date(detail.date).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }) || "Invalid Date"}
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
        </div>
      ) : (
        <p>ไม่มีข้อมูลการคำนวณ</p>
      )}
      {/* ปุ่มเปลี่ยนหน้า */}
      <div className="mt-5 flex justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

BasicYearTable.propTypes = {
  basicYearData: PropTypes.shape({
    loanAmount: PropTypes.string.isRequired,
    startDate: PropTypes.string,
    paymentDuration: PropTypes.number.isRequired,
    interestRate: PropTypes.string.isRequired,
  }).isRequired,
};

export default BasicYearTable;
