/* eslint-disable react/no-unknown-property */
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { IoReload } from "react-icons/io5";

const BasicFormYear = ({
  onSubmitBasicYear,
  onResetBasicYear,
  basicYearInitialInput,
}) => {
  // States
  const [loanAmount, setLoanAmount] = useState("");
  const [paymentDuration, setPaymentDuration] = useState(1);
  const [interestRate, setInterestRate] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateText, setDateText] = useState(
    new Date().toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }) || "Invalid Date"
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
    setDateText(
      new Date(event.target.value).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    );
  };

  const handleInterestRateChange = (event) => {
    const { value } = event.target;

    // Allow empty input for clearing the field
    if (value === "") {
      setInterestRate("");
      return;
    }

    // Validate decimal numbers and ensure value is <= 10
    const decimalRegex = /^\d*\.?\d*$/; // Allows digits and one optional decimal point
    const numericValue = parseFloat(value);

    if (
      decimalRegex.test(value) &&
      (numericValue <= 20 || isNaN(numericValue))
    ) {
      setInterestRate(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loanAmount || !interestRate) {
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
    if (basicYearInitialInput) {
      setLoanAmount(basicYearInitialInput.loanAmount || "");
      setPaymentDuration(basicYearInitialInput.paymentDuration || 1);
      setInterestRate(basicYearInitialInput.interestRate || "");
      setStartDate(
        basicYearInitialInput.startDate ||
          new Date().toISOString().split("T")[0]
      );
    }
  }, [basicYearInitialInput]);

  return (
    <div>
      <h2 className="font-sans text-xl font-bold mb-4">
        คำนวณแบบอัตราดอกเบี้ยเดียว
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* จำนวนเงินที่กู้ */}
          <div className="flex flex-col space-y-2">
            <label
              className="text-gray-700 font-medium text-lg"
              htmlFor="Loan-Amount"
            >
              จำนวนเงินที่กู้ (บาท)
            </label>
            <div className="relative">
              <input
                type="text"
                name="Loan-Amount"
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none px-2 h-[48px]"
                onChange={handleLoanAmountChange}
                value={loanAmount}
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                บาท
              </span>
            </div>
          </div>

          {/* วันที่เริ่ม */}
          <div className="flex flex-col space-y-2">
            <label
              className="text-gray-700 font-medium text-lg"
              htmlFor="startDate"
            >
              วันที่เริ่ม ({dateText})
            </label>
            <div className="relative">
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                ref={startDateRef}
                onChange={handleStartDateChange}
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none px-2 h-[48px]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* อัตราดอกเบี้ย (%) */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700 font-medium text-lg">
              อัตราดอกเบี้ย (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="interestRate"
                step={0.1}
                value={interestRate}
                onChange={handleInterestRateChange}
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none px-2 h-[48px]"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                %
              </span>
            </div>
          </div>

          {/* เลือกระยะเวลาในการผ่อน */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="payment-duration"
              className="text-gray-700 font-medium text-lg"
            >
              เลือกระยะเวลาในการผ่อน
            </label>
            <div className="relative">
              <select
                id="payment-duration"
                name="payment-duration"
                onChange={handleDurationChange}
                value={paymentDuration}
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none px-2 h-[48px]"
              >
                <style jsx>{`
                  input[type="number"]::-webkit-inner-spin-button,
                  input[type="number"]::-webkit-outer-spin-button {
                    position: relative;
                    left: -20px; /* Move arrow buttons left */
                  }
                `}</style>
                {Array.from({ length: 40 }, (_, i) => i + 1).map((year) => (
                  <option key={year} value={year}>
                    {year} ปี
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          {/* ค่าประกัน */}
          <div className="flex-1">
            <label className="text-gray-700 font-medium text-lg">
              ค่าประกัน (ถ้ามี)
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                id="insurance-input"
                /*value={insurance}
                onChange={handleInsuranceChange}*/
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none px-2 h-[48px]"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                บาท
              </span>
            </div>
          </div>

          {/* ค่าจดจำนอง */}
          <div className="flex-1">
            <label className="text-gray-700 font-medium text-lg">
              ค่าจดจำนอง (ถ้ามี)
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                id="additional-input2"
                /*value={mortgageFee}
                onChange={handleMorgageFeeChange}*/
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12a7.5 7.5 0 1113.91 3.06M9 11.25L4.5 12l2.25-4.5M16.5 12l-2.25 4.5M12 12h.008v.008H12v-.008z"
              />
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

BasicFormYear.propTypes = {
  onSubmitBasicYear: PropTypes.func.isRequired,
  onResetBasicYear: PropTypes.func.isRequired,
  basicYearInitialInput: PropTypes.object,
};

export default BasicFormYear;
