import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFileDownload } from "react-icons/fa";
import Pagination from "./Pagination";
import AdvanceTable from "./AdvanceTable"; // Assuming this is the component that renders the data

const DatasetDetails = () => {
  const location = useLocation();
  const [advanceFormData, setAdvanceFormData] = useState([]);

  // คำนวณรายการที่ต้องแสดงในหน้าปัจจุบัน
  //const startIndex = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const dataParam = urlParams.get("data");

    console.log("Raw URL Data:", dataParam);

    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        console.log("Parsed URL Data:", parsedData);

        if (parsedData && parsedData.advanceSummary) {
          const summary = parsedData.advanceSummary;
          console.log("Advance Summary:", summary);
          setAdvanceFormData(
            (Array.isArray(summary) ? summary : Object.values(summary)).slice(
              0,
              -13
            )
          );
        } else {
          console.log("Advance Summary not found.");
          setAdvanceFormData([]);
        }
      } catch (error) {
        console.error("Error parsing data:", error);
        setAdvanceFormData([]);
      }
    } else {
      const storedData = localStorage.getItem("datasetDetail");
      console.log("Data from localStorage:", storedData);

      if (storedData) {
        try {
          const parsedStoredData = JSON.parse(storedData);
          console.log("Parsed Stored Data:", parsedStoredData);

          if (parsedStoredData && parsedStoredData.advanceSummary) {
            const summary = parsedStoredData.advanceSummary;
            console.log("Advance Summary from Local Storage:", summary);
            setAdvanceFormData(
              (Array.isArray(summary) ? summary : Object.values(summary)).slice(
                0,
                -13
              )
            );
          } else {
            console.log("No advanceSummary in localStorage data.");
            setAdvanceFormData([]);
          }
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
          setAdvanceFormData([]);
        }
      }
    }
  }, [location]);

  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 36; // จำนวนงวดต่อหน้า
  const [currentPage, setCurrentPage] = useState(1);
  console.log(advanceFormData.length);
  const totalPages = Math.ceil((advanceFormData?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = Array.isArray(advanceFormData)
    ? advanceFormData.slice(startIndex, startIndex + itemsPerPage)
    : [];

  const validItems = currentItems.filter(
    (row) =>
      row &&
      row.date &&
      !isNaN(new Date(row.date).getTime()) &&
      !isNaN(row.interestRate) &&
      !isNaN(row.monthlyPayment) &&
      !isNaN(row.loanAmountPortion) &&
      !isNaN(row.interest) &&
      !isNaN(row.remainingLoanAmount)
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /*  if (advanceFormData.length === 0) {
    return <p>ข้อมูลไม่ถูกต้อง หรือ ไม่มีข้อมูลที่ต้องการ</p>;
  } */
  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date"; // Handle empty/null values

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates

    return new Intl.DateTimeFormat("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("th-TH").format(number); // Add your locale if needed
  };

  const printPDF = async () => {
    setIsLoading(true);
    const pdf = new jsPDF("p", "mm", "a4");
    const tableElement = document.getElementById("table-to-pdf");

    if (!tableElement) {
      console.error("Table element not found for PDF export.");
      setIsLoading(false);
      return;
    }

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage(); // Add a new page for subsequent parts
      setCurrentPage(page + 1);

      await new Promise((resolve) => setTimeout(resolve, 500)); // Allow DOM to update

      // Set scale for better quality and larger text
      const canvas = await html2canvas(tableElement, {
        scale: 1, // Larger values (e.g., 3 or 4) make text bigger and sharper
      });

      const imgData = canvas.toDataURL("image/png");

      const imgWidth = 210; // Width in PDF
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
    }

    const pdfBlob = pdf.output("blob");
    const blobURL = URL.createObjectURL(pdfBlob);
    window.open(blobURL, "_blank");
    setIsLoading(false);
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

          disabled={isLoading}

        >
          <FaFileDownload />
          <span>Download PDF</span>
        </button>
      </div>
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
            {validItems.map((row, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="border px-6 py-4 text-center">{row.month}</td>
                <td className="border px-6 py-4 text-center">
                  {formatDate(row.date)}
                </td>
                <td className="border px-6 py-4 text-center">
                  {formatNumber(row.interestRate)}%
                </td>
                <td className="border px-6 py-4 text-center">
                  {formatNumber(row.monthlyPayment)}
                </td>
                <td className="border px-6 py-4 text-center">
                  {formatNumber(row.loanAmountPortion)}
                </td>
                <td className="border px-6 py-4 text-center">
                  {formatNumber(row.interest)}
                </td>
                <td className="border px-6 py-4 text-center">
                  {formatNumber(row.remainingLoanAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 mb-6 flex justify-center">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>


        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default DatasetDetails;
