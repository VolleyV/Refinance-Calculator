/* eslint-disable no-unused-vars */
export const advanceLoanCalculateDetail = (advanceData) => {
  const {
    loanAmount,
    monthlyPayment,
    termMonths,
    startDate,
    interestRates,
    startTerm = ["1"],
    endTerm = ["12"],
  } = advanceData;
  console.log(
    loanAmount,
    monthlyPayment,
    termMonths,
    startDate,
    interestRates,
    startTerm,
    endTerm
  );
  if (!advanceData || !advanceData.loanAmount || !advanceData.startDate) {
    console.error(
      "Missing required data in advanceLoanCalculateDetail:",
      advanceData
    );
    return [];
  }

  const isLeapYear = (year) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const daysInYear = (year) => (isLeapYear(year) ? 366 : 365);

  const daysInMonth = (year, month) => {
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 1 && isLeapYear(year)) return 29;
    return daysInMonths[month];
  };

  let loanAmountRemaining = parseFloat(loanAmount.replace(/,/g, "")) || 0;
  if (isNaN(loanAmountRemaining) || loanAmountRemaining <= 0) {
    console.error("Invalid loanAmount:", loanAmount);
    return [];
  }
  const totalTermMonths = parseFloat(termMonths) * 12 || 12; // Convert years to months
  const initialStartDate = new Date(startDate);
  const details = [];
  let monthsElapsed = 0;

  // Initialize default values
  let currentInterestRate =
    parseFloat(interestRates[0]?.replace(/,/g, "")) / 100 || 0.025; // Default 2.5%
  let currentMonthlyPayment =
    parseFloat(monthlyPayment[0]?.replace(/,/g, "")) || 0;

  const maxEndTerm = totalTermMonths > 0 ? totalTermMonths : Infinity;
  const untilTerm = parseInt(endTerm[endTerm.length - 1]) || maxEndTerm;

  if (currentMonthlyPayment === 0) {
    alert("จำนวนเงินผ่อนรายเดือนต้องมากกว่า 0");
    return [];
  }

  // Calculate until loanAmountRemaining is 0 or untilTerm is reached
  while (loanAmountRemaining > 0 && monthsElapsed < untilTerm) {
    const dateClone = new Date(initialStartDate);
    dateClone.setMonth(initialStartDate.getMonth() + monthsElapsed);

    const currentYear = dateClone.getFullYear();
    const currentMonth = dateClone.getMonth();
    const daysInCurrentMonth = daysInMonth(currentYear, currentMonth);
    const daysInCurrentYear = isLeapYear(currentYear) ? 366 : 365;

    for (let i = 0; i < startTerm.length; i++) {
      const start = parseInt(startTerm[i]) || 0;
      const end = parseInt(endTerm[i]) || 0;

      if (monthsElapsed + 1 >= start && monthsElapsed + 1 <= end) {
        currentInterestRate =
          parseFloat(interestRates[i]?.replace(/,/g, "")) / 100 ||
          currentInterestRate;
        currentMonthlyPayment =
          parseFloat(monthlyPayment[i]?.replace(/,/g, "")) ||
          currentMonthlyPayment;
        break;
      }
    }

    if (isNaN(currentMonthlyPayment) || currentMonthlyPayment <= 0) {
      alert("Invalid monthly payment value.");
      return [];
    }

    const interest =
      (loanAmountRemaining * currentInterestRate * daysInCurrentMonth) /
      daysInCurrentYear;
    const loanAmountPortion = Math.max(0, currentMonthlyPayment - interest);

    if (currentMonthlyPayment <= interest) {
      alert(
        `จำนวนเงินผ่อนรายเดือน (${currentMonthlyPayment}) ต่ำเกินไปที่จะครอบคลุมดอกเบี้ย (${interest.toFixed(
          2
        )}).`
      );
      return []; // Exit the function entirely
    }

    loanAmountRemaining = Math.max(0, loanAmountRemaining - loanAmountPortion);

    details.push({
      month: monthsElapsed + 1,
      date: dateClone.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      interest: interest.toFixed(2),
      loanAmountPortion: loanAmountPortion.toFixed(2),
      remainingLoanAmount: loanAmountRemaining.toFixed(2),
      monthlyPayment: currentMonthlyPayment.toFixed(2),
      interestRate: (currentInterestRate * 100).toFixed(2),
    });

    monthsElapsed++;
  }
  if (loanAmountRemaining <= 0) {
    console.log("Loan fully paid off");
  }
  return details;
};

export const advanceThreeYearsSummary = (detail) => {
  const threeYears = 3 * 12;
  const limitedDetails = detail.slice(0, threeYears);
  const loanAmountAfterThreeYears =
    limitedDetails[limitedDetails.length - 1]?.remainingLoanAmount || 0;
  const totalInterestThreeYears = limitedDetails.reduce(
    (sum, item) => sum + item.interest,
    0
  );

  return {
    loanAmountAfterThreeYears,
    totalInterestThreeYears,
  };
};
