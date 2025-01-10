import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast, Bounce } from "react-toastify";

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
      <div className="bg-white rounded-b-lg px-6 py-4">
        <h2 className="font-itim text-xl font-bold">
          คำนวณแบบอัตราดอกเบี้ยเดียว
        </h2>
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
                วันที่เริ่ม ({dateText})
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
          </div>

          {/* <div className="mt-4">
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
          </div> */}
          <div className="mt-4 flex flex-wrap justify-between sm:justify-end gap-2">
            <button
              type="submit"
              className="inline-block w-full sm:w-auto rounded-lg bg-blue-800 px-5 py-3 font-medium text-white"
            >
              คำนวณ
            </button>
            <button
              type="button"
              onClick={resetFields}
              className="text-gray-600 hover:text-gray-800 underline font-medium w-full sm:w-auto sm:ml-2 sm:order-first"
            >
              ล้างข้อมูล
            </button>
          </div>
        </form>
      </div>
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
