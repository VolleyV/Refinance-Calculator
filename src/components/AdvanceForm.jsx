import React, { useState } from "react";

const AdvanceForm = () => {
  const [loanAmount, setLoanAmount] = useState(""); // loanAmount loan amount
  const [monthlyPayment, setMonthlyPayment] = useState(["", "", "", "", ""]); // Array for monthly payments
  const [termMonths, setTermMonths] = useState(""); // Loan term in years
  const [startDate, setStartDate] = useState(""); // Loan start date
  const [interestRates, setInterestRates] = useState(["", "", "", "", ""]); // Array for interest rates
  const [startTerm, setStartTerm] = useState(["", "", "", "", ""]); // Array for start terms
  const [endTerm, setEndTerm] = useState(["", "", "", "", ""]); // Array for end terms
  const [calculationDetails, setCalculationDetails] = useState([]); // Array to hold calculation results
  const [remainingMonths, setRemainingMonths] = useState(0); // Remaining months for loan
  const cleanNumber = (value) => parseFloat(value.replace(/,/g, "")) || 0;


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
  const handleLoanAmountChange = (event) => {
    const { value } = event.target;

    // Remove all non-numeric characters except for the decimal point
    const rawValue = value.replace(/[^0-9.]/g, "");

    // Check if the value is a valid number and non-negative
    const numericValue = parseFloat(rawValue);
    if (!isNaN(numericValue) && numericValue >= 0) {
      // Limit the value to 999,000,000 or less
      if (numericValue <= 999_000_000) {
        // Format the number with commas
        const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setLoanAmount(formattedValue); // Set formatted value in state
      }
    } else {
      // Optionally, handle invalid input (negative or non-numeric values)
      alert("Negative values or invalid input are not allowed.");
    }
  };

  const handleStartDateChange = (setter) => (event) =>
    setter(event.target.value);

  const handleInterestRateChange = (index, value) => {
    const rawValue = value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal point
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
        updated[index] = ""; // Clear input when empty
        return updated;
      });
    } else {
      alert("Invalid input. Only positive numbers are allowed.");
    }
  };

  const handleMonthlyPaymentChange = (index, value) => {
    const rawValue = value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal point
    const numericValue = parseFloat(rawValue);

    if (!isNaN(numericValue) && numericValue >= 0) {
      setMonthlyPayment((prev) => {
        const updated = [...prev];
        updated[index] = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
        return updated;
      });
    } else if (rawValue === "") {
      setMonthlyPayment((prev) => {
        const updated = [...prev];
        updated[index] = ""; // Clear input when empty
        return updated;
      });
    } else {
      alert("Invalid input. Only positive numbers are allowed.");
    }
  };

  const handleDurationChange = (event) => {
    setTermMonths(Number(event.target.value));
  };

  // Handle calculation of loan details
  const calculateRefinanceDetails = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    if (!loanAmount || !startDate) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
  
    let loanAmountRemaining = cleanNumber(loanAmount); // Cleaned value
    const totalTermMonths = parseFloat(termMonths) * 12 || 0; // Convert years to months
    const initialStartDate = new Date(startDate);
    const details = [];
    let monthsElapsed = 0;
  
    // Initialize default values
    let currentInterestRate = cleanNumber(interestRates[0]) / 100 || 0.025; // Default 2.5%
    let currentMonthlyPayment = cleanNumber(monthlyPayment[0]);
  
    const maxEndTerm = totalTermMonths > 0 ? totalTermMonths : Infinity;
    const untilTerm = parseInt(endTerm[endTerm.length - 1]) || maxEndTerm;
  
    if (currentMonthlyPayment === 0) {
      alert("จำนวนเงินผ่อนรายเดือนต้องมากกว่า 0");
      return;
    }
  
    // Calculate until loanAmountRemaining is 0 or untilTerm is reached
    while (loanAmountRemaining > 0 && monthsElapsed < untilTerm) {
      const dateClone = new Date(initialStartDate);
      dateClone.setMonth(initialStartDate.getMonth() + monthsElapsed);
  
      const currentYear = dateClone.getFullYear();
      const currentMonth = dateClone.getMonth();
      const daysInCurrentMonth = daysInMonth(currentYear, currentMonth);
      const daysInCurrentYear = isLeapYear(currentYear) ? 366 : 365;
  
      // Update interest rate and monthly payment for the current term
      let foundRange = false;
      for (let i = 0; i < startTerm.length; i++) {
        const start = parseInt(startTerm[i]) || 0;
        const end = parseInt(endTerm[i]) || 0;
  
        if (monthsElapsed + 1 >= start && monthsElapsed + 1 <= end) {
          currentInterestRate =
            cleanNumber(interestRates[i]) / 100 || currentInterestRate;
          currentMonthlyPayment =
            cleanNumber(monthlyPayment[i]) || currentMonthlyPayment;
          foundRange = true;
          break; // Stop looking once a valid range is found
        }
      }
  
      // If no range is found, retain the previous values
      if (!foundRange) {
        currentInterestRate = currentInterestRate; // Retain the previous interest rate
        currentMonthlyPayment = currentMonthlyPayment; // Retain the previous payment
      }
  
      // Calculate interest and loanAmount portions
      const interest =
        (loanAmountRemaining * currentInterestRate * daysInCurrentMonth) /
        daysInCurrentYear;
      const loanAmountPortion = Math.max(0, currentMonthlyPayment - interest);
  
      if (loanAmountPortion <= 0) {
        alert("จำนวนเงินผ่อนรายเดือนต่ำเกินไปสำหรับการลดเงินต้น");
        return;
      }
  
      loanAmountRemaining = Math.max(
        0,
        loanAmountRemaining - loanAmountPortion
      );
  
      // Store details for the month
      details.push({
        month: monthsElapsed + 1,
        date: dateClone.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }),
        interest: interest.toFixed(2),
        loanAmountPortion: loanAmountPortion.toFixed(2),
        remainingloanAmount: loanAmountRemaining.toFixed(2),
        monthlyPayment: currentMonthlyPayment.toFixed(2),
        interestRate: (currentInterestRate * 100).toFixed(2),
      });
  
      monthsElapsed++;
    }
  
    // Update state with calculation results
    setCalculationDetails(details);
    setRemainingMonths(monthsElapsed);
  };
  

  const resetFields = () => {
    setLoanAmount("");
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
      <form
        id="loan-form-advance"
        className="mt-4"
        onSubmit={calculateRefinanceDetails}
      >
        {/* loanAmount */}
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
              className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm cursor-pointer shadow-md"
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
              className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm cursor-pointer shadow-md"
              value={startDate}
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
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm cursor-pointer shadow-md mt-2"
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
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm cursor-pointer shadow-md mt-2"
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
                  className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm cursor-pointer shadow-md mt-2"
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
                  className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm cursor-pointer shadow-md mt-2"
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
                <th>อัตราดอกเบี้ย</th>
                <th>จำนวนเงินผ่อน</th>
                <th>ดอกเบี้ย</th>
                <th>ส่วนของเงินต้น</th>
                <th>เงินต้นคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {calculationDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.month}</td>
                  <td>{detail.date}</td>
                  <td>{detail.interestRate}%</td>
                  <td>{detail.monthlyPayment}</td>
                  <td>{detail.interest}</td>
                  <td>{detail.loanAmountPortion}</td>
                  <td>{detail.remainingloanAmount}</td>
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
