import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const BasicForm = ({
  onSubmitBasicYear,
  onResetBasicYear,
  BasicYearInitialInput,
}) => {
  // States
  const [loanAmount, setLoanAmount] = useState("");
  const [paymentDuration, setPaymentDuration] = useState(1);
  const [interestRate, setInterestRate] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleLoanAmountChange = (event) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^0-9]/g, "");
    if (Number(rawValue) <= 999_000_000) {
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setLoanAmount(formattedValue);
    }
  };

  const handleDurationChange = (event) => {
    setPaymentDuration(Number(event.target.value));
  };

  const startDateRef = useRef(null);
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleInterestRateChange = (event) => {
    const { value } = event.target;
    if (value === "") {
      setInterestRate("");
    } else {
      setInterestRate(Number(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loanAmount || !interestRate) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const data = {
      loanAmount,
      paymentDuration,
      startDate,
      interestRate,
    };
    onSubmitBasicYear(data);
  };

  const resetFields = () => {
    setLoanAmount("");
    setPaymentDuration(1);
    setInterestRate("");
    setStartDate(new Date().toISOString().split("T")[0]);
    onResetBasicYear();
  };

  useEffect(() => {
    if (BasicYearInitialInput) {
      setLoanAmount(BasicYearInitialInput.loanAmount || "");
      setPaymentDuration(BasicYearInitialInput.paymentDuration || 1);
      setInterestRate(BasicYearInitialInput.interestRate || "");
      setStartDate(
        BasicYearInitialInput.startDate ||
          new Date().toISOString().split("T")[0]
      );
    }
  }, [BasicYearInitialInput]);

  return (
    <div>
      <div className="bg-white rounded-b-lg px-6 py-4">
        <h2 className="text-xl font-bold">คำนวณแบบอัตราดอกเบี้ยเดียว</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <div className="relative">
              <label
                htmlFor="Loan-Amount"
                className="block text-l font-medium text-gray-700"
              >
                จำนวนเงินที่กู้ (บาท)
              </label>
              <input
                type="text"
                name="Loan-Amount"
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md"
                onChange={handleLoanAmountChange}
                value={loanAmount}
                placeholder="ใส่จำนวนเงินกู้"
              />
            </div>
            <div
              className="relative cursor-pointer"
              onClick={() =>
                startDateRef.current && startDateRef.current.showPicker?.()
              }
            >
              <label
                htmlFor="startDate"
                className="block text-l font-medium text-gray-700"
              >
                เลือกวันที่ (MM/DD/YYYY)
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                ref={startDateRef}
                onChange={handleStartDateChange}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm cursor-pointer shadow-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <div className="relative">
              <label
                htmlFor="interestRate"
                className="block text-l font-medium text-gray-700"
              >
                อัตราดอกเบี้ย (%)
              </label>
              <input
                type="number"
                name="interestRate"
                value={interestRate}
                onChange={handleInterestRateChange}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md"
                placeholder="อัตราดอกเบี้ย"
              />
            </div>
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
                value={paymentDuration}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm cursor-pointer shadow-md"
              >
                {Array.from({ length: 40 }, (_, i) => i + 1).map((year) => (
                  <option key={year} value={year}>
                    {year} ปี
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="relative">
              <label
                htmlFor="monthly-payment"
                className="block text-l font-medium text-gray-700"
              >
                จำนวนเงินผ่อนต่อเดือน
              </label>
              <input
                type="text"
                name="monthly-payment"
                value={monthlyPayment}
                onChange={handleMonthlyPaymentChange}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md"
                placeholder="ผ่อนต่อเดือน"
              />
            </div> */}
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto mr-2"
            >
              คำนวณ
            </button>
            <button
              type="button"
              onClick={resetFields}
              className="inline-block w-full rounded-lg bg-red-500 px-5 py-3 font-medium text-white sm:w-auto"
            >
              ล้างข้อมููล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

BasicForm.propTypes = {
  onSubmitBasicYear: PropTypes.func.isRequired,
  onResetBasicYear: PropTypes.func.isRequired,
  BasicYearInitialInput: PropTypes.object,
};

export default BasicForm;
