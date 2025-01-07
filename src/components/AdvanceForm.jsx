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
                // onChange={(e) => {
                //   const updatedEndTerm = [...endTerm];
                //   updatedEndTerm[index] = e.target.value;
                //   setEndTerm(updatedEndTerm);
                // }}
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
