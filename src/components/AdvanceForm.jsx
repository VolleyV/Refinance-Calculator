import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

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

  const [check, setCheck] = useState(false);
  const [additionalInput, setAdditionalInput] = useState("");

  const [check2, setCheck2] = useState(false);
  const [additionalInput2, setAdditionalInput2] = useState("");

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
        setAdditionalInput("");
      }
    } else if (type == "check2") {
      setCheck2(!check2);
      if (!check2) {
        setAdditionalInput2("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!loanAmount || !startDate) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const loanAmountNum = parseFloat(loanAmount.replace(/,/g, ""));
    const monthlyPaymentNum = parseFloat(monthlyPayment[0]?.replace(/,/g, "")); // ใช้ monthlyPayment[0]
    const interestRateNum = parseFloat(interestRates[0] || 0) / 100; // ใช้ interestRates[0]

    if (!monthlyPaymentNum || isNaN(monthlyPaymentNum)) {
      alert("กรุณาใส่จำนวนเงินผ่อนต่อเดือนให้ถูกต้อง");
      return;
    }

    const monthlyInterestOnly = (loanAmountNum * interestRateNum) / 12;

    // ตรวจสอบว่าค่า monthlyPayment น้อยกว่าดอกเบี้ยต่อเดือน
    if (monthlyPaymentNum <= monthlyInterestOnly) {
      alert(
        "จำนวนเงินผ่อนต่อเดือนน้อยเกินไปจนดอกเบี้ยไม่ลด กรุณาใส่จำนวนเงินที่มากกว่าดอกเบี้ยรายเดือน"
      );
      return;
    }

    const advanceData = {
      loanAmount,
      startDate,
      startTerm,
      endTerm,
      interestRates,
      monthlyPayment,
    };

    onAdvanceSubmit(advanceData);
  };

  const resetFields = () => {
    setLoanAmount("");
    setMonthlyPayment(["", "", "", "", ""]);
    setStartDate("");
    setInterestRates(["", "", "", "", ""]);
    setStartTerm(["1", "", "", "", ""]);
    setEndTerm(["", "", "", "", ""]);
    onAdvanceReset();
  };

  useEffect(() => {
    if (advanceInitialInput) {
      setLoanAmount(advanceInitialInput.loanAmount || 0);
      setMonthlyPayment(advanceInitialInput.monthlyPayment || 0);
      setStartDate(advanceInitialInput.startDate || 0);
      setInterestRates(advanceInitialInput.interestRates || 0);
      setStartTerm(advanceInitialInput.startTerm || 0);
      setEndTerm(advanceInitialInput.endTerm || 0);
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

        {/* Interest Rates, Start Term, End Term, and Monthly Payments */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mt-4">
          <div>
            <label>งวดที่</label>
            {startTerm.map((term, index) => (
              <input
                key={`startTerm-${index}`}
                type="text"
                value={term}
                placeholder="งวดที่เริ่ม"
                onChange={(e) => {
                  const updatedStartTerm = [...startTerm];
                  updatedStartTerm[index] = e.target.value;
                  setStartTerm(updatedStartTerm);
                }}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md mt-2"
              />
            ))}
          </div>

          <div>
            <label>ถึงงวดที่</label>
            {endTerm.map((term, index) => (
              <input
                key={`endTerm-${index}`}
                type="text"
                value={term}
                placeholder="ถึงงวดที่"
                onChange={(e) => handleEndTermChange(index, e.target.value)}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md mt-2"
              />
            ))}
          </div>

          <div>
            <label>อัตราดอกเบี้ย</label>
            {Array(5)
              .fill("")
              .map((_, idx) => (
                <input
                  key={`interest-rate-${idx}`}
                  type="text"
                  value={interestRates[idx]}
                  placeholder="อัตราดอกเบี้ย"
                  onChange={(e) =>
                    handleInterestRateChange(idx, e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md mt-2"
                />
              ))}
          </div>

          <div>
            <label>จำนวนเงินที่จะผ่อน</label>
            {Array(5)
              .fill("")
              .map((_, idx) => (
                <input
                  key={`monthly-payment-${idx}`}
                  type="text"
                  value={monthlyPayment[idx]}
                  placeholder="จำนวนเงินที่จะผ่อน"
                  onChange={(e) =>
                    handleMonthlyPaymentChange(idx, e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md mt-2"
                />
              ))}
          </div>
        </div>

        <div className="flex flex-col space-y-4 mt-4">
          {/* กลุ่มของทั้งปุ่มที่ 1 และปุ่มที่ 2 */}
          <div className="flex items-center space-x-8">
            {/* ปุ่มที่ 1 */}
            <div className="flex items-center space-x-4">
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
              <span>มีค่าประกันหรือไม่</span>

              {check && (
                <input
                  type="text"
                  id="additional-input"
                  placeholder="กรอกจำนวนเงิน"
                  value={additionalInput}
                  onChange={(e) => setAdditionalInput(e.target.value)}
                  className="w-40 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md"
                />
              )}
            </div>

            {/* ปุ่มที่ 2 */}
            <div className="flex items-center space-x-4">
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
              <span>มีค่าจดจำนองหรือไม่</span>

              {check2 && (
                <input
                  type="text"
                  id="additional-input2"
                  placeholder="กรอกจำนวนเงิน"
                  value={additionalInput2}
                  onChange={(e) => setAdditionalInput2(e.target.value)}
                  className="w-40 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md"
                />
              )}
            </div>
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
    </div>
  );
};

AdvanceForm.propTypes = {
  onAdvanceSubmit: PropTypes.func.isRequired,
  onAdvanceReset: PropTypes.func.isRequired,
  advanceInitialInput: PropTypes.object,
};

export default AdvanceForm;
