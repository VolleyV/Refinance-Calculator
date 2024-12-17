import { useState, useRef } from "react";

const BasicForm = () => {
  // States
  const [loanAmount, setLoanAmount] = useState("");
  const [paymentDuration, setPaymentDuration] = useState(1);
  const [interestRate, setInterestRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [calculationDetails, setCalculationDetails] = useState([]);
  const [remainingMonths, setRemainingMonths] = useState(0);

  // Helper functions for date calculations
  const isLeapYear = (year) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const daysInYear = (year) => (isLeapYear(year) ? 366 : 365);

  const daysInMonth = (year, month) => {
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 1 && isLeapYear(year)) return 29;
    return daysInMonths[month];
  };

  // Handlers
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
    setInterestRate(Number(value));
  };

  const handleMonthlyPaymentChange = (event) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^0-9]/g, "");
    if (Number(rawValue) <= 999_000_000) {
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setMonthlyPayment(formattedValue);
    }
  };

  // Calculate refinance details
  const calculateRefinanceDetails = () => {
    let principalRemaining = parseFloat(loanAmount.replace(/,/g, "")) || 0;
    let monthlyPaymentAmount =
      parseFloat(monthlyPayment.replace(/,/g, "")) || 0;
    const interestRateMonthly = interestRate / 100 / 12;
    const totalTermMonths = paymentDuration * 12;
    const initialStartDate = new Date(startDate);
    const details = [];
    let monthsElapsed = 0;

    while (monthsElapsed < totalTermMonths && principalRemaining > 0) {
      const currentYear = initialStartDate.getFullYear();
      const currentMonth = initialStartDate.getMonth();
      const daysInCurrentMonth = daysInMonth(currentYear, currentMonth);
      const daysInCurrentYear = daysInYear(currentYear);

      // Calculate interest and principal portions
      const interest =
        (principalRemaining * interestRateMonthly * daysInCurrentMonth) /
        daysInCurrentYear;
      const principalPortion = Math.max(0, monthlyPaymentAmount - interest);
      principalRemaining = Math.max(0, principalRemaining - principalPortion);

      // Store details
      details.push({
        month: monthsElapsed + 1,
        date: initialStartDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }),
        interest: interest.toFixed(2),
        principalPortion: principalPortion.toFixed(2),
        remainingPrincipal: principalRemaining.toFixed(2),
        monthlyPayment: monthlyPaymentAmount.toFixed(2),
        interestRate: interestRate.toFixed(2),
      });

      // Advance to the next month
      initialStartDate.setMonth(initialStartDate.getMonth() + 1);
      monthsElapsed++;
    }

    setCalculationDetails(details);
    setRemainingMonths(monthsElapsed);
  };

  const resetFields = () => {
    setLoanAmount("");
    setMonthlyPayment("");
    setPaymentDuration(1);
    setInterestRate("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setCalculationDetails([]);
    setRemainingMonths(0);
  };

  return (
    <div>
      <div className="bg-white rounded-b-lg px-6 py-4 shadow-lg">
        <h2 className="text-xl font-bold">
          คำนวณรีไฟแนนซ์แบบอัตราดอกเบี้ยเดียว
        </h2>
        <form>
          <div className="mt-4">
            <label
              htmlFor="Loan-Amount"
              className="block text-l font-medium text-gray-700"
            >
              ใส่จำนวนเงินที่ผ่อน
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
                เลือกวันที่ (วัน/เดือน/ปี)
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
                ใอัตราดอกเบี้ย (%)
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
              type="button"
              onClick={calculateRefinanceDetails}
              className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto mr-2"
            >
              คำนวณ
            </button>
            <button
              type="button"
              onClick={resetFields}
              className="inline-block w-full rounded-lg bg-red-500 px-5 py-3 font-medium text-white sm:w-auto"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Displaying results */}
      <div className="mt-8">
        {calculationDetails.length > 0 && (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th>เดือน</th>
                <th>วันที่</th>  
                <th>อัตราดอกเบี้ย</th>
                <th>ผ่อนต่อเดือน</th>
                <th>ส่วนที่จ่ายต้น</th>
                <th>ดอกเบี้ย</th>
                <th>ยอดคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {calculationDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.month}</td>
                  <td>{detail.date}</td>
                  <td>{detail.interestRate}%</td>
                  <td>{detail.monthlyPayment}</td>
                  <td>{detail.principalPortion}</td>
                  <td>{detail.interest}</td>
                  <td>{detail.remainingPrincipal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BasicForm;
