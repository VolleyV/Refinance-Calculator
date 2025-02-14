import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFileDownload } from "react-icons/fa";
import Pagination from "./Pagination";
import { advanceLoanCalculateDetail } from "../utils/advanceLoanCalculateDetail";

const AdvanceTable = ({ advanceData }) => {
  if (!advanceData || advanceData.length === 0) {
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

  const [isLoading, setIsLoading] = useState(false); // สถานะการโหลด
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 36;
  const calculationDetails = advanceLoanCalculateDetail(advanceData);
  const totalPages = Math.ceil(calculationDetails.length / itemsPerPage);

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
    <div className="container mx-auto mt-10 px-4 relative">
      {/* Loader */}
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
          disabled={isLoading}
        >
          <FaFileDownload />
          <span>Download PDF</span>
        </button>
      </div>

      {currentItems.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border" id="table-to-pdf">
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
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
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
                    {parseFloat(detail.interestRate || 0).toLocaleString()}%
                  </td>
                  <td className="border px-6 py-4 text-center">
                    {parseFloat(detail.monthlyPayment || 0).toLocaleString()}
                  </td>
                  <td className="border px-6 py-4 text-center">
                    {parseFloat(detail.loanAmountPortion || 0).toLocaleString()}
                  </td>
                  <td className="border px-6 py-4 text-center">
                    {parseFloat(detail.interest || 0).toLocaleString()}
                  </td>
                  <td className="border px-6 py-4 text-center">
                    {parseFloat(
                      detail.remainingLoanAmount || 0
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>ไม่มีข้อมูลการคำนวณ</p>
      )}

      <div className="mt-5 mb-6 flex justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

AdvanceTable.propTypes = {
  advanceData: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      interestRate: PropTypes.number.isRequired,
      monthlyPayment: PropTypes.number.isRequired,
      loanAmountPortion: PropTypes.number.isRequired,
      interest: PropTypes.number.isRequired,
      remainingLoanAmount: PropTypes.number.isRequired,
    })
  ),
};

export default AdvanceTable;
