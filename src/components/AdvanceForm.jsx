import React, { useState, useRef } from "react";

const AdvanceForm = () => {
  const [principal, setPrincipal] = useState(""); // Principal loan amount
  const [monthlyPayment, setMonthlyPayment] = useState(["", "", "", "", ""]); // Array for monthly payments
  const [termMonths, setTermMonths] = useState(1); // Loan term in years
  const [startDate, setStartDate] = useState(""); // Loan start date
  const [interestRates, setInterestRates] = useState(["", "", "", "", ""]); // Array for interest rates
  const [startTerm, setStartTerm] = useState([1, "", "", "", ""]); // Array for start terms
  const [endTerm, setEndTerm] = useState(["", "", "", "", ""]); // Array for end terms
  const [calculationDetails, setCalculationDetails] = useState([]); // Array to hold calculation results
  const [remainingMonths, setRemainingMonths] = useState(0); // Remaining months for loan

  // Handlers
  const handlePrincipalChange = (event) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^0-9]/g, "");
    if (Number(rawValue) <= 999_000_000) {
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setPrincipal(formattedValue);
    }
  };

  const handleTermMonthsChange = (event) => {
    setTermMonths(Number(event.target.value));
  };

  const startDateRef = useRef(null);
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleStartTerm = (event) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^0-9]/g, "");
    if (Number(rawValue) <= 999_000_000) {
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setStartTerm(formattedValue);
    }
  };

  const handleEndTermm = (event) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^0-9]/g, "");
    if (Number(rawValue) <= 999_000_000) {
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setEndTermm(formattedValue);
    }
  };

  const handleMonthlyPayment = (event) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^0-9]/g, "");
    if (Number(rawValue) <= 999_000_000) {
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setMonthlyPayment(formattedValue);
    }
  };

  // Check if it's a leap year
  const isLeapYear = (year) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  // Get the number of days in a specific month
  const daysInMonth = (year, month) => {
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 1 && isLeapYear(year)) return 29; // February
    return daysInMonths[month];
  };

  // Handle change for inputs that update state
  const handleInputChange = (setter) => (event) => setter(event.target.value);

  // Handle calculation of loan details
  const calculateRefinanceDetails = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!principal || !termMonths || !startDate) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    let principalRemaining = parseFloat(principal) || 0;
    const totalTermMonths = parseFloat(termMonths) * 12 || 0; // Convert years to months
    const initialStartDate = new Date(startDate);
    const details = [];
    let monthsElapsed = 0;

    while (monthsElapsed < totalTermMonths && principalRemaining > 0) {
      const currentYear = initialStartDate.getFullYear();
      const currentMonth = initialStartDate.getMonth();
      const daysInCurrentMonth = daysInMonth(currentYear, currentMonth);
      const daysInCurrentYear = isLeapYear(currentYear) ? 366 : 365;

      // Update interest rate and monthly payment based on terms
      let interestRate = parseFloat(interestRates[0]) / 100 || 0.025; // Default to the first rate or 2.5%
      let monthlyPaymentAmount = parseFloat(monthlyPayment[0]) || 0;

      for (let i = 0; i < startTerm.length; i++) {
        const start = parseInt(startTerm[i]) || 0;
        const end = parseInt(endTerm[i]) || 0;
        if (monthsElapsed + 1 >= start && monthsElapsed + 1 <= end) {
          interestRate = parseFloat(interestRates[i]) / 100 || interestRate;
          monthlyPaymentAmount =
            parseFloat(monthlyPayment[i]) || monthlyPaymentAmount;
          break;
        }
      }

      // Calculate interest and principal portions
      const interest =
        (principalRemaining * interestRate * daysInCurrentMonth) /
        daysInCurrentYear;
      const principalPortion = Math.max(0, monthlyPaymentAmount - interest);
      principalRemaining = Math.max(0, principalRemaining - principalPortion);

      // Store details for the month
      details.push({
        month: monthsElapsed + 1,
        date: initialStartDate.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }),
        interest: interest.toFixed(2),
        principalPortion: principalPortion.toFixed(2),
        remainingPrincipal: principalRemaining.toFixed(2),
        monthlyPayment: monthlyPaymentAmount.toFixed(2),
        interestRate: (interestRate * 100).toFixed(2),
      });

      // Move to the next month
      initialStartDate.setMonth(initialStartDate.getMonth() + 1);
      monthsElapsed++;
    }

    // Update state with calculation results
    setCalculationDetails(details);
    setRemainingMonths(monthsElapsed);
  };

  const resetFields = () => {
    setPrincipal("");
    setMonthlyPayment(["", "", "", "", ""]);
    setTermMonths("");
    setStartDate("");
    setInterestRates(["", "", "", "", ""]);
    setStartTerm(["", "", "", "", ""]);
    setEndTerm(["", "", "", "", ""]);
    setCalculationDetails([]);
    setRemainingMonths(0);
  };

  return (
    <div className="bg-white rounded-b-lg px-6 py-4">
      <h2 className="text-xl font-bold">คำนวณดอกเบี้ยแบบมีหลายอัตราดอกเบี้ย</h2>
      <div className="mt-4"></div>
      <form
        id="loan-form-advance"
        className="space-y-4"
        onSubmit={calculateRefinanceDetails}
      >
        {/* Principal */}
        <div className="mt-4">
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
            onChange={handlePrincipalChange}
            value={principal}
            placeholder="ใส่จำนวนเงินกู้"
          />
        </div>

        {/* Term Months and Start Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="payment-duration"
              className="block text-l font-medium text-gray-700"
            >
              เลือกระยะเวลาในการผ่อน
            </label>
            <select
              id="payment-duration"
              name="payment-duration"
              onChange={handleTermMonthsChange}
              value={termMonths}
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
            className="cursor-pointer"
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

        {/* Interest Rates, Start Term, End Term, and Monthly Payments */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mt-4">
          <div>
            <label
              htmlFor="startTerm"
              className="block text-l font-medium text-gray-700"
            >
              งวดที่
            </label>
            {startTerm.map((term, index) => (
              <input
                key={`startTerm-${index}`}
                type="number"
                name="startTerm"
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
            <label
              htmlFor="endTerm"
              className="block text-l font-medium text-gray-700"
            >
              ถึงงวดที่
            </label>
            {endTerm.map((term, index) => (
              <input
                key={`endTerm-${index}`}
                type="number"
                name="endTerm"
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
            <label
              htmlFor="rate"
              className="block text-l font-medium text-gray-700"
            >
              อัตราดอกเบี้ย
            </label>
            {interestRates.map((rate, index) => (
              <input
                key={`interestRate-${index}`}
                type="number"
                name="rate"
                value={rate}
                placeholder="อัตราดอกเบี้ย"
                onChange={(e) => {
                  const updatedRates = [...interestRates];
                  updatedRates[index] = e.target.value;
                  setInterestRates(updatedRates);
                }}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md mt-2"
              />
            ))}
          </div>

          <div>
            <label
              htmlFor="monthPay"
              className="block text-l font-medium text-gray-700"
            >
              จำนวนเงินที่จะผ่อน
            </label>
            {monthlyPayment.map((payment, index) => (
              <input
                key={`monthlyPayment-${index}`}
                type="number"
                name="monthPay"
                value={payment}
                placeholder="จำนวนเงินที่จะผ่อน"
                onChange={(e) => {
                  const updatedPayments = [...monthlyPayment];
                  updatedPayments[index] = e.target.value;
                  setMonthlyPayment(updatedPayments);
                }}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm shadow-md mt-2"
              />
            ))}
          </div>
        </div>

        {/* Submit and Reset Buttons */}
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

      {/* Calculation Results */}
      <div className="mt-8">
        <h3>ผลลัพธ์การคำนวณ</h3>
        {calculationDetails.length === 0 ? (
          <p className="text-red-500">กรุณากรอกข้อมูลเพื่อเริ่มการคำนวณ</p>
        ) : (
          <table className="w-full mt-4">
            <thead>
              <tr>
                <th>เดือน</th>
                <th>วันที่</th>
                <th>ดอกเบี้ย</th>
                <th>ส่วนของเงินต้น</th>
                <th>เงินต้นคงเหลือ</th>
                <th>จำนวนเงินผ่อน</th>
                <th>อัตราดอกเบี้ย</th>
              </tr>
            </thead>
            <tbody>
              {calculationDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.month}</td>
                  <td>{detail.date}</td>
                  <td>{detail.interest}</td>
                  <td>{detail.principalPortion}</td>
                  <td>{detail.remainingPrincipal}</td>
                  <td>{detail.monthlyPayment}</td>
                  <td>{detail.interestRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdvanceForm;
