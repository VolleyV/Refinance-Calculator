import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { basicYearLoanCalculateDetail } from "../utils/basicYearLoanCalculateDetail";
import { FaFileDownload } from "react-icons/fa";
import Pagination from "./Pagination";

const BasicYearTable = ({ basicYearData }) => {
  if (!basicYearData) {
    return (
      <div>
        <p className="text-center mt-4 text-sm text-gray-600">
          ไม่มีข้อมูลในตาราง หากผู้ใช้เปิดเว็บนี้ใน Line กรุณาเปิดใน Brownser
          เพื่อดูตาราง{" "}
          <a
            href="https://refinance-calculator-navy.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            กดที่นี่เพื่อเปิดในเบราว์เซอร์
          </a>
        </p>
      </div>
    );
  }

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 50);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true); // เริ่มโหลด
    const pdf = new jsPDF("p", "mm", "a4");
    const tableElement = document.getElementById("table-to-pdf");

    if (!tableElement) {
      console.error("Table element not found for PDF export.");
      setIsLoading(false);
      return;
    }

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage();
      setCurrentPage(page + 1);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(tableElement, { scale: 1 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 200;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 5, 10, imgWidth, imgHeight);
    }

    const pdfBlob = pdf.output("blob");
    const blobURL = URL.createObjectURL(pdfBlob);
    window.open(blobURL, "_blank");
    setIsLoading(false); // โหลดเสร็จ
  };
  return (
    <div className="container mx-auto mt-10 px-4">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
            <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
            <p className="mt-3 text-lg font-semibold">กำลังสร้าง PDF...</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between w-full mb-5">
        <h2 className="text-2xl font-bold">ตารางการคำนวณ</h2>
        <button
          onClick={printPDF}
          className="flex items-center gap-2 rounded-full bg-[#30A572] px-4 py-2 font-bold text-white hover:bg-blue-700"
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
