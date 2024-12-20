import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const AdvanceForm = ({
  onAdvanceSubmit,
  onAdvanceReset,
  advanceInitialInput,
}) => {
  const [loanAmount, setLoanAmount] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(["", "", "", "", ""]);
  const [termMonths, setTermMonths] = useState(""); 
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [interestRates, setInterestRates] = useState(["", "", "", "", ""]);
  const [startTerm, setStartTerm] = useState(["", "", "", "", ""]); 
  const [endTerm, setEndTerm] = useState(["", "", "", "", ""]);

  const handleLoanAmountChange = (event) => {
    const { value } = event.target;

    const rawValue = value.replace(/[^0-9.]/g, "");

    const numericValue = parseFloat(rawValue);
    if (!isNaN(numericValue) && numericValue >= 0) {
      if (numericValue <= 999_000_000) {
        const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setLoanAmount(formattedValue);
      }
    } else {
      alert("Negative values or invalid input are not allowed.");
    }
  };

  const startDateRef = useRef(null);
  const handleStartDateChange = (setter) => (event) =>
    setter(event.target.value);

  const handleInterestRateChange = (index, value) => {
    const rawValue = value.replace(/[^0-9.]/g, "");
    const numericValue = parseFloat(rawValue);

    if (!isNaN(numericValue) && numericValue >= 0) {
      setInterestRates((prev) => {
        const updated = [...prev];
        updated[index] = rawValue;
        return updated;
      });
    } else if (rawValue === "") {
      setInterestRates((prev) => {
        const updated = [...prev];
        updated[index] = "";
        return updated;
      });
    } else {
      alert("Invalid input. Only positive numbers are allowed.");
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

  const handleDurationChange = (event) => {
    setTermMonths(Number(event.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!loanAmount || !startDate) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const advanceData = {
      loanAmount,
      monthlyPayment,
      termMonths,
      startDate,
      interestRates,
      startTerm,
      endTerm,
    };

    onAdvanceSubmit(advanceData);
  };

  const resetFields = () => {
    setLoanAmount("");
    setMonthlyPayment(["", "", "", "", ""]);
    setTermMonths("");
    setStartDate("");
    setInterestRates(["", "", "", "", ""]);
    setStartTerm(["", "", "", "", ""]);
    setEndTerm(["", "", "", "", ""]);
    onAdvanceReset();
  };

  useEffect(() => {
    if (advanceInitialInput) {
      setLoanAmount(advanceInitialInput.loanAmount || 0);
      setMonthlyPayment(advanceInitialInput.monthlyPayment || 0);
      setTermMonths(advanceInitialInput.termMonths || 0);
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
        <div className="mt-4">
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

        {/* Term Months and Start Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
          <div className="relative">
            <label
              htmlFor="payment-duration"
              className="block text-l font-medium text-gray-700"
            >
              เลือกระยะเวลาในการผ่อน
            </label>
            <select
              id="payment-duration"
              name="payment-duration"
              onChange={handleDurationChange}
              value={termMonths}
              className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md"
            >
              {Array.from({ length: 40 }, (_, i) => i + 1).map((year) => (
                <option key={year} value={year}>
                  {year} ปี
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="start-date-advance">
              เลือกวันที่ (วัน/เดือน/ปี)
            </label>
            <input
              type="date"
              id="start-date-advance"
              className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md"
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
                onChange={(e) => {
                  const updatedEndTerm = [...endTerm];
                  updatedEndTerm[index] = e.target.value;
                  setEndTerm(updatedEndTerm);
                }}
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
