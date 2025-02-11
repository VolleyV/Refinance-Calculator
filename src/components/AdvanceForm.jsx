/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { IoReload } from "react-icons/io5";

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
  const [dateText, setDateText] = useState(
    new Date().toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }) || "Invalid Date"
  );
  const [visibleRows, setVisibleRows] = useState(1); // แถวที่แสดงอยู่
  const [insurance, setInsurance] = useState("");
  const [mortgageFee, setMortgageFee] = useState("");


  // Ref สำหรับ div ที่มีข้อความ "อัตราดอกเบี้ย"
  const titleRef = useRef(null);
  // state สำหรับเก็บความกว้างของ div ที่มี title
  const [titleWidth, setTitleWidth] = useState(0);

  useEffect(() => {
    const updateTitleWidth = () => {
      if (titleRef.current) {
        const rect = titleRef.current.getBoundingClientRect();
        setTitleWidth(rect.width - 40); // ลดค่าลงเพื่อป้องกันเส้นเกิน
      }
    };

    updateTitleWidth(); // อัปเดตครั้งแรก
    window.addEventListener("resize", updateTitleWidth); // อัปเดตเมื่อ resize

    return () => window.removeEventListener("resize", updateTitleWidth); // Cleanup
  }, []);


  const handleLoanAmountChange = (event) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^0-9]/g, "");
    if (Number(rawValue) <= 999_000_000) {
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setLoanAmount(formattedValue);
    }
  };

  const startDateRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // กำหนด threshold สำหรับ mobile
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loanAmount <= 0) {
      toast.error("จำนวนเงินที่กู้ห้ามน้อยกว่าหรือเท่ากับ 0", {
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

    if (!loanAmount || !startDate) {
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
    for (let i = 0; i < visibleRows; i++) {
      const monthlyPaymentRaw = monthlyPayment[i]?.replace(/,/g, "");
      const interestRateRaw = interestRates[i]?.trim();

      // ตรวจสอบว่าแถวแรกต้องใส่ทั้งอัตราดอกเบี้ยและจำนวนเงินที่จะผ่อน
      if (i === 0 && (!interestRateRaw || !monthlyPaymentRaw)) {
        toast.error(
          `กรุณาใส่ข้อมูลอัตราดอกเบี้ยและจำนวนเงินผ่อนในแถวที่ ${i + 1}`,
          {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
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
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
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
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
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
      insurance,
      mortgageFee,
    };
    console.log(advanceData);

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

    setInsurance("");
    setMortgageFee("");
    onAdvanceReset();
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
    if (advanceInitialInput) {
      setLoanAmount(advanceInitialInput.loanAmount || 0);
      setMonthlyPayment(advanceInitialInput.monthlyPayment || 0);
      setStartDate(advanceInitialInput.startDate || 0);
      setInterestRates(advanceInitialInput.interestRates || 0);
      setStartTerm(advanceInitialInput.startTerm || 0);
      setEndTerm(advanceInitialInput.endTerm || 0);
      setVisibleRows(advanceInitialInput.visibleRows || 1);
      setInsurance(advanceInitialInput.insurance || 0);
      setMortgageFee(advanceInitialInput.mortgageFee || 0);
    }
  }, [advanceInitialInput]);

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
              className="text-gray-700 font-[400] text-lg"
              htmlFor="Loan-Amount"
            >
              จำนวนเงินที่กู้
            </label>
            <div className="relative">
              <input
                type="text"
                name="Loan-Amount"
                className="w-full border-b-2 border-gray-300 focus:border-[#082044] text-2xl font-[600] text-gray-900 focus:outline-none px-2 h-[48px]"
                onChange={handleLoanAmountChange}
                value={loanAmount}
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                บาท
              </span>
            </div>
          </div>

          <div
            className="flex flex-col space-y-2"
            onClick={() =>
              startDateRef.current && startDateRef.current.showPicker?.()
            }
          >
            <label
              htmlFor="start-date-advance"
              className="text-gray-700 font-[400] text-lg"
            >
              วันที่เริ่ม ({dateText})
            </label>
            <div className="relative">
              <input
                type="date"
                name="start-date-advance"
                id="start-date-advance"
                className="w-full border-b-2 border-gray-300 focus:border-[#082044] text-2xl font-[600] text-gray-900 focus:outline-none px-2 h-[48px]"
                value={startDate}
                ref={startDateRef}
                onChange={handleStartDateChange}
              />
            </div>
          </div>
        </div>

        <div
          ref={titleRef}
          className="relative border-2 box-border border-dashed border-[#bbbbbb] rounded-md p-4 mt-8 ">
          <div className="absolute -top-3 left-4 bg-white px-4 text-gray-700 font-medium">
            อัตราดอกเบี้ย
          </div>
          <div className="grid grid-cols-1 gap-6 mt-6">
            {Array.from({ length: visibleRows }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols- sm:grid-cols-4 lg:grid-cols-4 gap-4 items-center relative whitespace-nowrap"
              >
                {/* สำหรับ Mobile */}
                <div className="flex items-center sm:hidden">
                  <div className="bg-[#082044] text-white font-medium py-1 px-4 rounded-md relative">
                    อัตราที่ {index + 1}
                    <hr
                      style={{ width: `${titleWidth}px` }}
                      className="absolute bottom-0 left-1 border-[#082044] border-t-[2px] " />
                  </div>
                </div>

                {/* อัตราดอกเบี้ย */}
                <div className="hidden sm:flex flex-col justify-center relative">
                  {(index === 0 || isMobile) && ( // แสดง label ในบรรทัดแรกหรือถ้าเป็น Mobile */}
                    <div className="font-medium text-lg mt-8"></div>
                  )}
                  <div className=" sm:flex relative justify-center items-center text-center">
                    {/* แสดงเป็นข้อความแทน input */}
                    <span className=" sm:inline text-gray-700 font-medium text-lg">
                      อัตราดอกเบี้ยที่ {index + 1}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-center relative">
                  {(index === 0 || isMobile) && ( // แสดง label ในบรรทัดแรกหรือถ้าเป็น Mobile */}
                    <label
                      className="text-gray-700 font-[400] text-lg mb-2"
                      htmlFor={`interest-rate-${index}`}
                    >
                      อัตราดอกเบี้ย
                    </label>
                  )}
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      id={`interest-rate-${index}`}
                      value={interestRates[index]}
                      onChange={(e) =>
                        handleInterestRateChange(index, e.target.value)
                      }
                      className="w-full border-b-2 border-gray-300 focus:border-[#082044] text-2xl font-[600] text-gray-900 focus:outline-none px-2 h-[48px] appearance-none pr-8"
                    />
                    <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                      %
                    </span>
                  </div>
                </div>

                {/* งวดที่เริ่ม */}
                <div className="flex flex-col justify-center">
                  {(index === 0 || isMobile) && ( // แสดง label ในบรรทัดแรกหรือถ้าเป็น Mobile */}
                    <label
                      className="text-gray-700 font-[400] text-lg mb-2"
                      htmlFor={`start-term-${index}`}
                    >
                      งวดที่เริ่ม
                    </label>
                  )}
                  <input
                    type="text"
                    id={`start-term-${index}`}
                    value={startTerm[index]}
                    onChange={(e) => {
                      const updatedStartTerm = [...startTerm];
                      updatedStartTerm[index] = e.target.value;
                      setStartTerm(updatedStartTerm);
                    }}
                    className="w-full border-b-2 border-gray-300 focus:border-[#082044] text-2xl font-[600] text-gray-900 focus:outline-none px-2 h-[48px]"
                  />
                </div>

                {/* เงินผ่อนต่อเดือน */}
                <div className="flex flex-col justify-center relative">
                  {(index === 0 || isMobile) && ( // แสดง label ในบรรทัดแรกหรือถ้าเป็น Mobile */}
                    <label
                      className="text-gray-700 font-medium text-lg mb-2"
                      htmlFor={`monthly-payment-${index}`}
                    >
                      เงินผ่อนต่อเดือน
                    </label>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      id={`monthly-payment-${index}`}
                      value={monthlyPayment[index]}
                      onChange={(e) =>
                        handleMonthlyPaymentChange(index, e.target.value)
                      }
                      className="w-full border-b-2 border-gray-300 focus:border-[#082044] text-2xl font-[600] text-gray-900 focus:outline-none px-2 h-[48px]"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                      บาท
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {/* ปุ่มเพิ่ม/ลบบรรทัด */}
            <div className="hidden sm:flex space-x-4 mt-4">
              {visibleRows < 5 && (
                <button
                  type="button"
                  className="bg-[#082044] text-white text-2xl font-[700] w-8 h-8 rounded-md flex items-center justify-center z-10 absolute left-[78px] transform -translate-x-1/2 -translate-y-1/2"
                  onClick={addRow}
                >
                  +
                </button>
              )}
              {visibleRows > 1 && (
                <button
                  type="button"
                  className="bg-[#82828E] text-white text-3xl font-[700] w-8 h-8 rounded-md flex items-center justify-center z-10 absolute left-[100px] transform -translate-x-1/2 -translate-y-1/2"
                  onClick={removeRow}
                >
                  -
                </button>
              )}
            </div>

            {/* ปุ่มสำหรับ Mobile */}
            <div className="grid grid-cols-1 gap-6 mt-6">
              {/* ปุ่ม +/- สำหรับ Mobile */}
              <div className="relative sm:hidden mt-4">
                <div className="absolute inset-x-0 bottom-[-32px] flex justify-center">
                  {visibleRows < 5 && (
                    <div className="relative">
                      {/* เส้นสีขาว */}
                      <div className="absolute top-1/2 left-[-12px] right-[-12px] h-[2px] bg-white z-10 transform -translate-y-1/2"></div>
                      {/* ปุ่ม + */}
                      <button
                        type="button"
                        className="relative bg-[#082044] text-white text-2xl font-[700] w-8 h-8 rounded-md flex items-center justify-center z-20"
                        onClick={addRow}
                      >
                        +
                      </button>
                    </div>
                  )}
                  {visibleRows > 1 && (
                    <div className="relative ml-2">
                      {/* เส้นสีขาว */}
                      <div className="absolute top-1/2 left-[-12px] right-[-12px] h-[2px] bg-white z-10 transform -translate-y-1/2"></div>
                      {/* ปุ่ม - */}
                      <button
                        type="button"
                        className="relative bg-[#82828E] text-white text-2xl font-[700] w-8 h-8 rounded-md flex items-center justify-center z-20"
                        onClick={removeRow}
                      >
                        -
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {/* ค่าประกัน */}
          <div className="flex-1">
            <label className="text-gray-700 font-[400] text-lg">
              ค่าประกัน&nbsp;
              <span className="text-[#82828E] text-lg font-[300]">(ถ้ามี)</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                id="insurance-input"
                value={insurance}
                onChange={handleInsuranceChange}
                className="w-full border-b-2 border-gray-300 focus:border-[#082044] text-2xl font-[600] text-gray-900 focus:outline-none px-2 h-[48px]"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                บาท
              </span>
            </div>
          </div>

          {/* ค่าจดจำนอง */}
          <div className="flex-1">
            <label className="text-gray-700 font-[400] text-lg">
              ค่าจดจำนอง&nbsp;
              <span className="text-[#82828E] text-lg font-[300]">(ถ้ามี)</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                id="additional-input2"
                value={mortgageFee}
                onChange={handleMorgageFeeChange}
                className="w-full border-b-2 border-gray-300 focus:border-[#082044] text-2xl font-[600] text-gray-900 focus:outline-none px-2 h-[48px]"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-lg">
                บาท
              </span>
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
          <div className="order-1 sm:order-2 w-full sm:w-auto flex justify-center sm:justify-end sm:ml-auto">
            <button
              type="submit"
              className="inline-block w-full sm:w-[250px] rounded-full bg-[#30A572] px-8 py-3 text-base font-bold text-white hover:bg-green-600"
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

AdvanceForm.propTypes = {
  onAdvanceSubmit: PropTypes.func.isRequired,
  onAdvanceReset: PropTypes.func.isRequired,
  advanceInitialInput: PropTypes.object,
};

export default AdvanceForm;
