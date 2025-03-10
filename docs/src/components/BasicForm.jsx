import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const BasicForm = ({ onSubmit, onReset, initialInput }) => {
  // States
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
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

  const startDateRef = useRef(null);
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleInterestRateChange = (event) => {
    const { value } = event.target;
    if (value === "") {
      setInterestRate("");
    } else {
      setInterestRate(Number(value)); // หากมีค่าก็แปลงเป็นตัวเลข
    }
  };

  const handleMonthlyPaymentChange = (event) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^0-9]/g, "");
    if (Number(rawValue) <= 999_000_000) {
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setMonthlyPayment(formattedValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loanAmount || !interestRate || !monthlyPayment) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const loanAmountNum = parseFloat(loanAmount.replace(/,/g, ""));
    const monthlyPaymentNum = parseFloat(monthlyPayment.replace(/,/g, ""));
    const interestRateNum = interestRate / 100;
    const monthlyInterestOnly = (loanAmountNum * interestRateNum) / 12;

    if (monthlyPaymentNum <= monthlyInterestOnly) {
      alert(
        "จำนวนเงินผ่อนต่อเดือนน้อยเกินไปจนดอกเบี้ยไม่ลด กรุณาใส่จำนวนเงินที่มากกว่าดอกเบี้ยรายเดือน"
      );
      return;
    }

    // ส่งข้อมูลกลับไปที่ App
    const data = {
      loanAmount,
      startDate,
      interestRate,
      monthlyPayment,
    };
    onSubmit(data);
  };

  const resetFields = () => {
    setLoanAmount("");
    setMonthlyPayment("");
    setInterestRate("");
    setStartDate(new Date().toISOString().split("T")[0]);
    onReset();
  };

  useEffect(() => {
    if (initialInput) {
      setLoanAmount(initialInput.loanAmount || "");
      setInterestRate(initialInput.interestRate || "");
      setMonthlyPayment(initialInput.monthlyPayment || "");
      setStartDate(
        initialInput.startDate || new Date().toISOString().split("T")[0]
      );
    }
  }, [initialInput]);

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
            </div>
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
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  initialInput: PropTypes.object,
};

export default BasicForm;
