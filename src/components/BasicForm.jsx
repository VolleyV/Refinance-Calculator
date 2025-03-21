/* eslint-disable react/no-unknown-property */
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { IoReload } from "react-icons/io5";

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
  const [insurance, setInsurance] = useState("");
  const [mortgageFee, setMortgageFee] = useState("");

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

  const handleAutoCalculate = () => {
    const loanAmountNum = parseFloat(loanAmount.replace(/,/g, "")) || 0;
    const autoCalculateInsurance = loanAmountNum * 0.01;

    setInsurance(autoCalculateInsurance.toLocaleString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loanAmount || !interestRate || !monthlyPayment) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
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
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
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
      insurance,
      mortgageFee,
    };
    onSubmit(data);
  };

  const resetFields = () => {
    setLoanAmount("");
    setMonthlyPayment("");
    setInterestRate("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setInsurance("");
    setMortgageFee("");
    onReset();
    toast.success("ล้างข้อมูลเรียบร้อยแล้ว!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
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
      setInsurance(initialInput.insurance || 0);
      setMortgageFee(initialInput.mortgageFee || 0);
    }
  }, [initialInput]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          {/* แถวที่ 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* จำนวนเงินที่กู้ */}
            <div className="flex flex-col space-y-2">
              <label className="text-[#35373F] font-[400] text-lg -mb-2">
                จำนวนเงินที่กู้
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="Loan-Amount"
                  className="w-full mb-2 border-b-[1px] border-[#D3D8E2] focus:border-[#082044] text-2xl font-[600] text-[#082044] !text-[#082044]  focus:outline-none px-2 h-[48px]"
                  onChange={handleLoanAmountChange}
                  value={loanAmount}
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                  บาท
                </span>
              </div>
            </div>

            {/* อัตราดอกเบี้ย */}
            <div className="flex flex-col space-y-2">
              <label className="text-[#35373F] font-[400] text-lg -mb-2">
                อัตราดอกเบี้ย
              </label>
              <div className="relative">
                <input
                  type="number"
                  step={0.1}
                  name="interestRate"
                  value={interestRate}
                  onChange={handleInterestRateChange}
                  className="w-full mb-2 border-b-[1px] border-[#D3D8E2] focus:border-[#082044] text-2xl font-[600] text-[#082044] !text-[#082044] focus:outline-none px-2 h-[48px]"
                />
                <style jsx>{`
                  input[type="number"]::-webkit-inner-spin-button,
                  input[type="number"]::-webkit-outer-spin-button {
                    position: relative;
                    left: -20px; /* Move arrow buttons left */
                  }
                `}</style>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                  %
                </span>
              </div>
            </div>

            {/* วันที่เริ่ม */}
            <div
              className="flex flex-col space-y-2"
              onClick={() =>
                startDateRef.current && startDateRef.current.showPicker?.()
              }
            >
              <label className="text-[#35373F] font-[400] text-lg -mb-2">
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
                  className="w-full mb-2 border-b-[1px] border-[#D3D8E2] focus:border-[#082044] text-2xl font-[600] text-[#082044] focus:outline-none px-2 h-[48px]"
                />
              </div>
            </div>
          </div>

          {/* แถวที่ 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* เงินผ่อนต่อเดือน */}
            <div className="flex flex-col space-y-2">
              <label className="text-[#35373F] font-[400] text-lg -mb-2">
                เงินผ่อนต่อเดือน
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="monthly-payment"
                  value={monthlyPayment}
                  onChange={handleMonthlyPaymentChange}
                  className="w-full mb-2 border-b-[1px] border-[#D3D8E2] focus:border-[#082044] text-2xl font-[600] text-[#082044] !text-[#082044] focus:outline-none px-2 h-[48px]"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 text-lg font-medium">
                  บาท
                </span>
              </div>
            </div>

            {/* ค่าประกัน */}
            <div className="flex flex-col space-y-2">
              <label className="text-[#35373F] text-lg font-[400] -mb-2">
                ค่าประกัน&nbsp;
                <span className="text-[#82828E]  text-lg font-[300]">
                  (ถ้ามี)
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  id="insurance-input"
                  value={insurance}
                  onChange={handleInsuranceChange}
                  className="w-full border-b-[1px] border-[#D3D8E2] focus:border-[#082044] text-2xl font-[600] text-[#082044] focus:outline-none px-2 h-[48px]"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 text-lg font-medium">
                  บาท
                </span>
              </div>
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  className="text-green-500 text-lg"
                  onClick={handleAutoCalculate}
                >
                  คำนวณอัตโนมัติ(1%)
                </button>
              </div>
            </div>

            {/* ค่าจดจำนอง */}
            <div className="flex flex-col space-y-2">
              <label className="text-[#35373F] font-[400] text-lg -mb-2">
                ค่าจดจำนอง&nbsp;
                <span className="text-[#82828E] text-lg font-[300]">
                  (ถ้ามี)
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="additional-input2"
                  value={mortgageFee}
                  onChange={handleMorgageFeeChange}
                  className="w-full mb-2 border-b-[1px] border-[#D3D8E2] focus:border-[#082044] text-2xl font-[600] text-[#082044] !text-[#082044] focus:outline-none px-2 h-[48px]"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                  บาท
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* ปุ่มล้างข้อมูล */}
          <div className="order-2 sm:order-1 w-full sm:w-auto flex justify-center sm:justify-start">
            <button
              type="button"
              onClick={resetFields}
              className="flex items-center sm:w-[200px] text-[#82828E] hover:text-gray-800 text-lg font-medium"
            >
              <IoReload className="mr-1" />
              <span>ล้างข้อมูล</span>
            </button>
          </div>

          {/* ปุ่มคำนวณ */}
          <div className="order-1 sm:order-2 w-full flex justify-center sm:justify-end sm:ml-auto h-[60px]">
            <button
              type="submit"
              className="inline-block w-full sm:w-[250px] rounded-full bg-[#30A572] px-8 py-3 text-lg font-bold text-white hover:bg-green-600"
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
