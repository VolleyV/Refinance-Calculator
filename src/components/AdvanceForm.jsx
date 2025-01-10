import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast, Bounce } from "react-toastify";

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
  const [visibleRows, setVisibleRows] = useState(1); // แถวที่แสดงอยู่

  const [check, setCheck] = useState(false);
  const [mrta, setMrta] = useState("");

  const [check2, setCheck2] = useState(false);
  const [mortgage, setMortgage] = useState("");

  const handleLoanAmountChange = (event) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^0-9]/g, "");
    if (Number(rawValue) <= 999_000_000) {
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setLoanAmount(formattedValue);
    }
  };

  const startDateRef = useRef(null);
  const handleStartDateChange = (setter) => (event) =>
    setter(event.target.value);

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

  const toggleCheck = (type) => {
    if (type == "check") {
      setCheck(!check);
      if (!check) {
        setMrta("");
      }
    } else if (type == "check2") {
      setCheck2(!check2);
      if (!check2) {
        setMortgage("");
      }
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
      mrta,
      mortgage
    };

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
    setCheck(false);
    setCheck2(false);
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
      setMrta(advanceInitialInput.mrta||0);
      setMortgage(advanceInitialInput.mortgage||0);
    }
  }, [advanceInitialInput]);

  return (
    <div className="bg-white rounded-b-lg px-6 py-4">
      <h2 className="text-xl font-bold">คำนวณดอกเบี้ยแบบมีหลายอัตราดอกเบี้ย</h2>
      <form id="loan-form-advance" className="mt-4" onSubmit={handleSubmit}>
        {/* Term Months and Start Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
          <div className="relative">
            <label
              htmlFor="loanAmount-advance"
              className="block text-l font-medium text-gray-700"
            >
              จำนวนเงินที่กู้ (บาท)
            </label>
            <input
              type="text"
              id="loanAmount-advance"
              className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md"
              placeholder="จำนวนเงินที่กู้ (บาท)"
              value={loanAmount}
              onChange={handleLoanAmountChange}
            />
          </div>
          <div
            className="relative cursor-pointer"
            onClick={() =>
              startDateRef.current && startDateRef.current.showPicker?.()
            }
          >
            <label htmlFor="start-date-advance">
              เลือกวันที่ (วัน/เดือน/ปี)
            </label>
            <input
              type="date"
              name="start-date-advance"
              id="start-date-advance"
              className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md cursor-pointer"
              value={startDate}
              ref={startDateRef}
              onChange={handleStartDateChange(setStartDate)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
          {Array.from({ length: visibleRows }).map((_, index) => (
            <div key={index} className="flex space-x-4 items-center">
              <div>
                <label>งวดที่เริ่ม</label>
                <input
                  type="text"
                  value={startTerm[index]}
                  placeholder="งวดที่เริ่ม"
                  onChange={(e) => {
                    const updatedStartTerm = [...startTerm];
                    updatedStartTerm[index] = e.target.value;
                    setStartTerm(updatedStartTerm);
                  }}
                  className="w-full rounded-lg border border-gray-400 p-2"
                />
              </div>
              <div>
                <label>ถึงงวดที่</label>
                <input
                  type="text"
                  value={endTerm[index]}
                  placeholder="ถึงงวดที่"
                  onChange={(e) => handleEndTermChange(index, e.target.value)}
                  className="w-full rounded-lg border border-gray-400 p-2"
                />
              </div>
              <div>
                <label>อัตราดอกเบี้ย</label>
                <input
                  type="text"
                  value={interestRates[index]}
                  placeholder="อัตราดอกเบี้ย"
                  onChange={(e) =>
                    handleInterestRateChange(index, e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-400 p-2"
                />
              </div>
              <div>
                <label>จำนวนเงินที่จะผ่อน</label>
                <input
                  type="text"
                  value={monthlyPayment[index]}
                  placeholder="จำนวนเงินที่จะผ่อน"
                  onChange={(e) =>
                    handleMonthlyPaymentChange(index, e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-400 p-2"
                />
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
          {/* ปุ่มที่ 1 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="custom-checkbox"
                onClick={() => toggleCheck("check")}
                checked={check}
                className="hidden peer"
              />
              <label
                htmlFor="custom-checkbox"
                className="w-4 h-4 rounded-full border-2 border-gray-400 cursor-pointer flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:shadow-md peer-checked:shadow-blue-500 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white hidden peer-checked:block"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414-1.414L7 12.586 4.707 10.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l9-9z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
              <span className="whitespace-nowrap">ค่าประกันอัคคีภัย</span>
            </div>

            {check && (
              <input
                type="text"
                id="additional-input"
                placeholder="กรอกจำนวนเงิน"
                value={mrta}
                onChange={(e) => setMrta(e.target.value)}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md"
              />
            )}
          </div>

          {/* ปุ่มที่ 2 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="custom-checkbox2"
                onClick={() => toggleCheck("check2")}
                checked={check2}
                className="hidden peer"
              />
              <label
                htmlFor="custom-checkbox2"
                className="w-4 h-4 rounded-full border-2 border-gray-400 cursor-pointer flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:shadow-md peer-checked:shadow-blue-500 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white hidden peer-checked:block"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414-1.414L7 12.586 4.707 10.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l9-9z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
              <span className="whitespace-nowrap">ค่าจดจำนอง</span>
            </div>

            {check2 && (
              <input
                type="text"
                id="additional-input2"
                placeholder="กรอกจำนวนเงิน"
                value={mortgage}
                onChange={(e) => setMortgage(e.target.value)}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md"
              />
            )}
          </div>
        </div>

        {/* Submit and Reset Buttons */}
        <div className="mt-4">
          <button
            type="submit"
            className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
          >
            คำนวณ
          </button>
          <button
            type="button"
            className="inline-block w-full rounded-lg bg-red-500 px-5 py-3 font-medium text-white sm:w-auto mt-2 ml-2"
            onClick={resetFields}
          >
            Reset
          </button>
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