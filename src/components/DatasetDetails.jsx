import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFileDownload } from "react-icons/fa";
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
          // Instead of converting it to an array, pass the object directly
          setAdvanceFormData(parsedData.advanceSummary);
        } else {
          setAdvanceFormData({});
        }
      } catch (error) {
        console.error("Error parsing data:", error);
        setAdvanceFormData({});
      }
    } else {
      const storedData = localStorage.getItem("datasetDetail");
      console.log("Data from localStorage:", storedData);

      if (storedData) {
        try {
          const parsedStoredData = JSON.parse(storedData);
          if (parsedStoredData && parsedStoredData.advanceSummary) {
            setAdvanceFormData(parsedStoredData.advanceSummary);
          } else {
            setAdvanceFormData({});
          }
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
          setAdvanceFormData({});
        }
      }
    }
  }, [location]);

  /*  if (advanceFormData.length === 0) {
    return <p>ข้อมูลไม่ถูกต้อง หรือ ไม่มีข้อมูลที่ต้องการ</p>;
  } */
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
            {Object.values(advanceFormData).map((row, index) => (
              <tr key={index}>
                <td className="border px-6 py-4 text-center">{row.month}</td>
                <td className="border px-6 py-4 text-center">{row.date}</td>
                <td className="border px-6 py-4 text-center">
                  {row.interestRate}
                </td>
                <td className="border px-6 py-4 text-center">
                  {row.monthlyPayment}
                </td>
                <td className="border px-6 py-4 text-center">
                  {row.loanAmountPortion}
                </td>
                <td className="border px-6 py-4 text-center">{row.interest}</td>
                <td className="border px-6 py-4 text-center">
                  {row.remainingLoanAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatasetDetails;
