import PropTypes from "prop-types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useState, useEffect } from "react";
import { basicLoanCalculateDetail } from "../utils/basicLoanCalculateDetail.js";
import { useNavigate } from "react-router-dom";

const BasicTable = ({ data }) => {
  // const [tableData, setTableData] = useState(data);

  // useEffect(() => {
  //   if (!data) {
  //     // ดึงข้อมูลจาก sessionStorage หากไม่มี props
  //     const storedData = sessionStorage.getItem("basicTableData");
  //     if (storedData) {
  //       setTableData(JSON.parse(storedData));
  //     }
  //   }
  // }, [data]);

  // if (!tableData) {
  //   return <div>ไม่มีข้อมูลที่จะแสดง</div>;
  // }
  if (!data) {
    return <div>ไม่มีข้อมูลที่จะแสดง</div>;
  }

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

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
        scale: 2, // Larger values (e.g., 3 or 4) make text bigger and sharper
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
      <div className="flex items-center justify-between w-full ">
        <button
          onClick={goBack}
          className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          ย้อนกลับ
        </button>
        <h2 className="text-lg font-bold flex-grow text-center">
          ตารางการคำนวณ
        </h2>
        <button
          onClick={printPDF}
          className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Export PDF
        </button>
      </div>
      {currentItems.length > 0 ? (
        <div className="overflow-x-auto" id="table-to-pdf">
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
                      ? "bg-gray-100" //bg-gray-100 dark:bg-gray-800
                      : "bg-white" //bg-white dark:bg-gray-900
                  }`}
                >
                  <td className="border px-6 py-4 text-center">
                    {detail.month}
                  </td>
                  <td className="border px-6 py-4 text-center">
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
        <span className="text-center jutify-center">
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
  );
};

BasicTable.propTypes = {
  data: PropTypes.shape({
    loanAmount: PropTypes.string.isRequired,
    startDate: PropTypes.string,
    interestRate: PropTypes.string.isRequired,
    monthlyPayment: PropTypes.string.isRequired,
  }).isRequired,
};

export default BasicTable;
