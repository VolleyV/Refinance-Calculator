/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { IoReload } from "react-icons/io5";

const AdvanceForm = ({
  onAdvanceSubmit,
  onAdvanceReset,
  advanceInitialInput,
}) => {
  const [loanAmount, setLoanAmount] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startTerm, setStartTerm] = useState(["1", "", "", "", ""]);
  const [endTerm, setEndTerm] = useState(["", "", "", "", ""]);
  const [interestRates, setInterestRates] = useState(["", "", "", "", ""]);
  const [monthlyPayment, setMonthlyPayment] = useState(["", "", "", "", ""]);
  const [dateText, setDateText] = useState(
    new Date().toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }) || "Invalid Date"
  );
  const [visibleRows, setVisibleRows] = useState(1); // แถวที่แสดงอยู่

  const [insurance, setInsurance] = useState(0);
  const [mortgageFee, setMortgageFee] = useState(0);

  const handleLoanAmountChange = (event) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^0-9]/g, "");
    if (Number(rawValue) <= 999_000_000) {
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setLoanAmount(formattedValue);
    }
  };

  const startDateRef = useRef(null);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setDateText(
      new Date(event.target.value).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    );
  };

  const handleInterestRateChange = (index, value) => {
    const rawValue = value.replace(/[^0-9.]/g, ""); // Remove non-numeric and non-decimal characters
    const numericValue = parseFloat(rawValue);

    if (rawValue === "" || (numericValue >= 0 && numericValue <= 10)) {
      // Valid input: update the specific index
      setInterestRates((prev) => {
        const updated = [...prev];
        updated[index] = rawValue; // Keep raw value to allow partial decimals like "1."
        return updated;
      });
    }
  };

  const handleMonthlyPaymentChange = (index, value) => {
    const rawValue = value.replace(/[^0-9.]/g, "");
    const numericValue = parseFloat(rawValue);

    if (!isNaN(numericValue) && numericValue >= 0) {
      setMonthlyPayment((prev) => {
        const updated = [...prev];
        updated[index] = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return updated;
      });
    } else if (rawValue === "") {
      setMonthlyPayment((prev) => {
        const updated = [...prev];
        updated[index] = "";
        return updated;
      });
    } else {
      alert("Invalid input. Only positive numbers are allowed.");
    }
  };

  const handleEndTermChange = (index, value) => {
    const updatedEndTerm = [...endTerm];
    updatedEndTerm[index] = value;

    setEndTerm(updatedEndTerm);

    // เมื่อ "ถึงงวดที่" ถูกลบออก
    if (value === "" || value === undefined) {
      if (index + 1 < startTerm.length) {
        setStartTerm((prev) => {
          const updated = [...prev];
          updated[index + 1] = ""; // ลบค่าใน "งวดที่เริ่ม" ของบรรทัดถัดไป
          return updated;
        });
      }
      return;
    }

    // อัปเดต "งวดที่เริ่ม" ในแถวถัดไป
    if (index + 1 < startTerm.length) {
      const nextStartTerm = parseInt(value, 10) + 1; // เพิ่มค่าเป็น 1
      if (!isNaN(nextStartTerm)) {
        setStartTerm((prev) => {
          const updated = [...prev];
          updated[index + 1] = nextStartTerm.toString();
          return updated;
        });
      }
    }
  };

  const handleInsuranceChange = (event) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^0-9]/g, "");
    if (Number(rawValue) <= 999_000_000) {
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setInsurance(formattedValue);
    }
  };

  const handleMorgageFeeChange = (event) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^0-9]/g, "");
    if (Number(rawValue) <= 999_000_000) {
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setMortgageFee(formattedValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!loanAmount || !startDate) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    const loanAmountNum = parseFloat(loanAmount.replace(/,/g, ""));
    for (let i = 0; i < visibleRows; i++) {
      const monthlyPaymentRaw = monthlyPayment[i]?.replace(/,/g, "");
      const interestRateRaw = interestRates[i]?.trim();

      // ตรวจสอบว่าแถวแรกต้องใส่ทั้งอัตราดอกเบี้ยและจำนวนเงินที่จะผ่อน
      if (i === 0 && (!interestRateRaw || !monthlyPaymentRaw)) {
        toast.error(
          `กรุณาใส่ข้อมูลอัตราดอกเบี้ยและจำนวนเงินผ่อนในแถวที่ ${i + 1}`,
          {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          }
        );
        return;
      }

      // ตรวจสอบค่าในแถวอื่น ๆ ถ้ามีข้อมูลใดๆ ต้องตรวจสอบให้ครบ
      if (interestRateRaw || monthlyPaymentRaw) {
        const monthlyPaymentNum = parseFloat(monthlyPaymentRaw || 0);
        const interestRateNum = parseFloat(interestRateRaw || 0) / 100;
        const monthlyInterestOnly = (loanAmountNum * interestRateNum) / 12;

        if (!monthlyPaymentNum || isNaN(monthlyPaymentNum)) {
          toast.error(
            `กรุณาใส่จำนวนเงินผ่อนต่อเดือนให้ถูกต้องในแถวที่ ${i + 1}`,
            {
              position: "top-center",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            }
          );
          return;
        }

        if (monthlyPaymentNum <= monthlyInterestOnly) {
          toast.error(
            `จำนวนเงินผ่อนต่อเดือนในแถวที่ ${
              i + 1
            } น้อยเกินไปจนดอกเบี้ยไม่ลด กรุณาใส่จำนวนเงินที่มากกว่าดอกเบี้ยรายเดือน หรือ ลดอัตราดอกเบี้ยลง`,
            {
              position: "top-center",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            }
          );
          return;
        }
      }
    }

    const advanceData = {
      loanAmount,
      startDate,
      startTerm,
      endTerm,
      interestRates,
      monthlyPayment,
      visibleRows,
      insurance,
      mortgageFee,
    };
    console.log(advanceData);

    onAdvanceSubmit(advanceData);
  };

  const addRow = () => {
    if (visibleRows < 5) {
      setVisibleRows((prev) => prev + 1);
    }
  };

  const removeRow = () => {
    if (visibleRows > 1) {
      setStartTerm((prev) => prev.slice(0, visibleRows - 1));
      setEndTerm((prev) => prev.slice(0, visibleRows - 1));
      setInterestRates((prev) => prev.slice(0, visibleRows - 1));
      setMonthlyPayment((prev) => prev.slice(0, visibleRows - 1));
      setVisibleRows((prev) => prev - 1);
    }
  };

  const resetFields = () => {
    setLoanAmount("");
    setMonthlyPayment(["", "", "", "", ""]);
    setStartDate(new Date().toISOString().split("T")[0]);
    setInterestRates(["", "", "", "", ""]);
    setStartTerm(["1", "", "", "", ""]);
    setEndTerm(["", "", "", "", ""]);
    setVisibleRows(1);

    setInsurance(0);
    setMortgageFee(0);
    onAdvanceReset();
    toast.success("ล้างข้อมูลเรียบร้อยแล้ว!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  useEffect(() => {
    if (advanceInitialInput) {
      setLoanAmount(advanceInitialInput.loanAmount || 0);
      setMonthlyPayment(advanceInitialInput.monthlyPayment || 0);
      setStartDate(advanceInitialInput.startDate || 0);
      setInterestRates(advanceInitialInput.interestRates || 0);
      setStartTerm(advanceInitialInput.startTerm || 0);
      setEndTerm(advanceInitialInput.endTerm || 0);
      setVisibleRows(advanceInitialInput.visibleRows || 1);
      setInsurance(advanceInitialInput.insurance || 0);
      setMortgageFee(advanceInitialInput.mortgageFee || 0);
    }
  }, [advanceInitialInput]);

  return (
    <div>
      <h2 className="font-sans text-xl font-bold mb-4">
        คำนวณแบบอัตราดอกเบี้ยเดียว
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* จำนวนเงินที่กู้ */}
          <div className="flex flex-col justify-center">
            <label
              className="text-gray-700 font-medium text-lg mb-2"
              htmlFor="Loan-Amount"
            >
              จำนวนเงินที่กู้
            </label>
            <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500 h-[48px]">
              <input
                type="text"
                name="Loan-Amount"
                className="flex-grow text-2xl font-bold text-gray-900 focus:outline-none px-2 h-full"
                onChange={handleLoanAmountChange}
                value={loanAmount}
                placeholder="1,500,000"
              />
              <span className="text-gray-700 font-medium text-lg ml-2">
                บาท
              </span>
            </div>
          </div>

          <div
            className="flex flex-col justify-center"
            onClick={() =>
              startDateRef.current && startDateRef.current.showPicker?.()
            }
          >
            <label
              htmlFor="start-date-advance"
              className="text-gray-700 font-medium text-lg mb-2"
            >
              วันที่เริ่ม ({dateText})
            </label>
            <input
              type="date"
              name="start-date-advance"
              id="start-date-advance"
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none p-2 h-[48px]"
              value={startDate}
              ref={startDateRef}
              onChange={handleStartDateChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          {Array.from({ length: visibleRows }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center"
            >
              {/* งวดที่เริ่ม */}
              <div className="flex flex-col justify-center">
                <label
                  className="text-gray-700 font-medium text-lg mb-2"
                  htmlFor={`start-term-${index}`}
                >
                  งวดที่เริ่ม
                </label>
                <input
                  type="text"
                  id={`start-term-${index}`}
                  value={startTerm[index]}
                  placeholder="งวดที่เริ่ม"
                  onChange={(e) => {
                    const updatedStartTerm = [...startTerm];
                    updatedStartTerm[index] = e.target.value;
                    setStartTerm(updatedStartTerm);
                  }}
                  className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none px-2 h-[48px]"
                />
              </div>

              {/* ถึงงวดที่ */}
              <div className="flex flex-col justify-center">
                <label
                  className="text-gray-700 font-medium text-lg mb-2"
                  htmlFor={`end-term-${index}`}
                >
                  ถึงงวดที่
                </label>
                <input
                  type="text"
                  id={`end-term-${index}`}
                  value={endTerm[index]}
                  placeholder="ถึงงวดที่"
                  onChange={(e) => handleEndTermChange(index, e.target.value)}
                  className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none px-2 h-[48px]"
                />
              </div>

              {/* อัตราดอกเบี้ย */}
              <div className="flex flex-col justify-center relative">
                <label
                  className="text-gray-700 font-medium text-lg mb-2"
                  htmlFor={`interest-rate-${index}`}
                >
                  อัตราดอกเบี้ย
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    id={`interest-rate-${index}`}
                    value={interestRates[index]}
                    placeholder="3.25"
                    onChange={(e) =>
                      handleInterestRateChange(index, e.target.value)
                    }
                    className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none px-2 h-[48px]"
                  />
                  <style jsx>{`
                    input[type="number"]::-webkit-inner-spin-button,
                    input[type="number"]::-webkit-outer-spin-button {
                      position: relative;
                      left: -20px; /* Move arrow buttons left */
                    }
                  `}</style>
                  <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                    %
                  </span>
                </div>
              </div>

              {/* จำนวนเงินที่จะผ่อน */}
              <div className="flex flex-col justify-center relative">
                <label
                  className="text-gray-700 font-medium text-lg mb-2"
                  htmlFor={`monthly-payment-${index}`}
                >
                  จำนวนเงินที่จะผ่อน
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={`monthly-payment-${index}`}
                    value={monthlyPayment[index]}
                    placeholder="12,000"
                    onChange={(e) =>
                      handleMonthlyPaymentChange(index, e.target.value)
                    }
                    className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none px-2 h-[48px]"
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                    บาท
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ปุ่มเพิ่ม/ลบบรรทัด */}
        <div className="flex space-x-4 mt-4">
          {visibleRows < 5 && (
            <button
              type="button"
              className="bg-blue-500 text-white w-8 h-8 rounded-full items-center justify-center"
              onClick={addRow}
            >
              +
            </button>
          )}
          {visibleRows > 1 && (
            <button
              type="button"
              className="bg-red-500 text-white w-8 h-8 rounded-full items-center justify-center"
              onClick={removeRow}
            >
              -
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* ค่าประกัน */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700 font-medium text-lg">
              ค่าประกัน
            </label>
            <div className="relative">
              <input
                type="text"
                id="insurance-input"
                placeholder="กรอกจำนวนเงิน"
                value={insurance}
                onChange={handleInsuranceChange}
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none px-2 h-[48px]"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                บาท
              </span>
            </div>
          </div>

          {/* ค่าจดจำนอง */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700 font-medium text-lg">
              ค่าจดจำนอง
            </label>
            <div className="relative">
              <input
                type="text"
                id="additional-input2"
                placeholder="กรอกจำนวนเงิน"
                value={mortgageFee}
                onChange={handleMorgageFeeChange}
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none px-2 h-[48px]"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                บาท
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-between items-center gap-4">
          {/* ปุ่มล้างข้อมูล */}
          <div className="flex-1 flex justify-start">
            <button
              type="button"
              onClick={resetFields}
              className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              <IoReload />
              ล้างข้อมูล
            </button>
          </div>

          {/* ปุ่มคำนวณ */}
          <div className="flex-1 flex justify-end">
            <button
              type="submit"
              className="inline-block w-full sm:w-auto rounded-full bg-[#30A572] px-6 py-2 text-sm font-bold text-white hover:bg-green-600"
            >
              คำนวณ
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

AdvanceForm.propTypes = {
  onAdvanceSubmit: PropTypes.func.isRequired,
  onAdvanceReset: PropTypes.func.isRequired,
  advanceInitialInput: PropTypes.object,
};

export default AdvanceForm;
