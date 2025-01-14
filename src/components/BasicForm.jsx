import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast, Bounce } from "react-toastify";
const BasicForm = ({ onSubmit, onReset, initialInput }) => {
  // States
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
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
    const monthlyPaymentNum = parseFloat(monthlyPayment.replace(/,/g, ""));
    const interestRateNum = interestRate / 100;
    const monthlyInterestOnly = (loanAmountNum * interestRateNum) / 12;

    if (monthlyPaymentNum <= monthlyInterestOnly) {
      toast.error("จำนวนเงินผ่อนต่อเดือนน้อยเกินไปจนดอกเบี้ยไม่ลด", {
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
    if (initialInput) {
      setLoanAmount(initialInput.loanAmount || "0");
      setInterestRate(initialInput.interestRate || "0");
      setMonthlyPayment(initialInput.monthlyPayment || "0");
      setStartDate(
        initialInput.startDate || new Date().toISOString().split("T")[0]
      );
    }
  }, [initialInput]);

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
              จำนวนเงินที่กู้ (บาท)
            </label>
            <input
              type="text"
              name="Loan-Amount"
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none p-2 h-[48px]"
              onChange={handleLoanAmountChange}
              value={loanAmount}
              placeholder="1,500,000"
            />
          </div>

          {/* วันที่เริ่ม */}
          <div className="flex flex-col justify-center" onClick={() =>
                startDateRef.current && startDateRef.current.showPicker?.()
              }>
            <label
              className="text-gray-700 font-medium text-lg mb-2"
              htmlFor="startDate"
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
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none p-2 h-[48px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium text-lg mb-1">
              อัตราดอกเบี้ย (%)
            </label>
            <input
              type="number"
              name="interestRate"
              value={interestRate}
              onChange={handleInterestRateChange}
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none py-2"
              placeholder="6.75"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium text-lg mb-1">
              เงินผ่อนต่อเดือน (บาท)
            </label>
            <input
              type="text"
              name="monthly-payment"
              value={monthlyPayment}
              onChange={handleMonthlyPaymentChange}
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-2xl font-bold text-gray-900 focus:outline-none py-2"
              placeholder="11,000"
            />
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

BasicForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  initialInput: PropTypes.object,
};

export default BasicForm;
