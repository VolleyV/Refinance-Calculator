import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AdvanceTable from "./AdvanceTable"; // Assuming this is the component that renders the data

const DatasetDetails = () => {
  const location = useLocation();
  const [advanceFormData, setAdvanceFormData] = useState([]);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const dataParam = urlParams.get("data");
  
    console.log("Raw URL Data:", dataParam);
  
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        console.log("Parsed URL Data:", parsedData);
  
        if (parsedData && parsedData.advanceSummary) {
          const formattedData = Object.values(parsedData.advanceSummary);
          console.log("Formatted Data Array:", formattedData);
          setAdvanceFormData(formattedData);
        } else {
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
          if (parsedStoredData && parsedStoredData.advanceSummary) {
            setAdvanceFormData(Object.values(parsedStoredData.advanceSummary));
          } else {
            setAdvanceFormData([]);
          }
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
          setAdvanceFormData([]);
        }
      }
    }
  }, [location]);
  
  
  

  if (advanceFormData.length === 0) {
    return <p>ข้อมูลไม่ถูกต้อง หรือ ไม่มีข้อมูลที่ต้องการ</p>;
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">รายละเอียดข้อมูล</h1>
      <AdvanceTable advanceData={advanceFormData} />
    </div>
  );
};

export default DatasetDetails;
