export const advanceLoanCalculateDetail = (advanceData) => {
  const {
    loanAmount,
    monthlyPayment,
    startDate,
    interestRates,
    startTerm = ["1"],
    endTerm,
  } = advanceData;

  if (!advanceData || typeof advanceData !== "object") {
    console.error("Invalid advanceData:", advanceData);
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

  const initialStartDate = new Date(startDate);
  const details = [];
  let monthsElapsed = 0;

  let currentInterestRate =
    parseFloat(interestRates[0]?.replace(/,/g, "")) / 100 || 0.025; // Default 2.5%
  let currentMonthlyPayment =
    parseFloat(monthlyPayment[0]?.replace(/,/g, "")) || 0;

  if (currentMonthlyPayment === 0) {
    alert("Monthly payment must be greater than 0.");
    return [];
  }

  // Calculate until loanAmountRemaining is 0
  while (loanAmountRemaining > 0) {
    const dateClone = new Date(initialStartDate);
    dateClone.setMonth(initialStartDate.getMonth() + monthsElapsed);

    const currentYear = dateClone.getFullYear();
    const currentMonth = dateClone.getMonth();
    const daysInCurrentMonth = daysInMonth(currentYear, currentMonth);
    const daysInCurrentYear = isLeapYear(currentYear) ? 366 : 365;

    for (let i = 0; i < startTerm.length; i++) {
      const start = parseInt(startTerm[i]) || 0;
      const end = parseInt(endTerm[i]) || Infinity;

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

    // Add validation to exit if the monthly payment is too low
    if (currentMonthlyPayment <= interest) {
      alert(
        `Monthly payment (${currentMonthlyPayment.toFixed(
          2
        )}) is too low to cover the interest (${interest.toFixed(
          2
        )}). Consider increasing the monthly payment.`
      );
      return details; // Return accumulated details before stopping.
    }

    const loanAmountPortion = Math.max(0, currentMonthlyPayment - interest);

    // Update the remaining loan balance
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

  console.log("Loan fully paid off after", monthsElapsed, "months.");
  return details;
};

export const advanceThreeYearsSummary = (details) => {
  const threeYears = 3 * 12;
  const limitedDetails = details.slice(0, threeYears);
  const loanAmountAfterThreeYears =
    parseFloat(
      limitedDetails[limitedDetails.length - 1]?.remainingLoanAmount
    ) || 0;

  const totalInterestThreeYears = limitedDetails.reduce(
    (sum, item) => sum + parseFloat(item.interest || 0),
    0
  );

  return {
    loanAmountAfterThreeYears,
    totalInterestThreeYears,
  };
};

export const advanceRemainingToLast = (details) => {
  const lastDetail = details[details.length - 1];
  let remainingLoanAmount = lastDetail.remainingLoanAmount;
  const monthlyPayment = lastDetail.monthlyPayment;
  const interestRate = lastDetail.interestRate;
  let lastDate;

  const fixRemain = remainingLoanAmount;

  try {
    lastDate = new Date(lastDetail.date.replace(/-/g, "/"));
    if (isNaN(lastDate)) {
      throw new Error("Invalid Date Format");
    }
  } catch (error) {
    console.error("Error parsing date:", error, lastDetail.date);
    lastDate = new Date();
  }

  let remainingInterest = 0;
  let totalInterestPaid = 0;
  let monthsRemaining = 0;

  totalInterestPaid = details.reduce(
    (sum, item) => sum + parseFloat(item.interest || 0),
    0
  );

  while (remainingLoanAmount > 0) {
    const monthlyInterest = (remainingLoanAmount * (interestRate / 100)) / 12;
    const principalPortion = Math.max(0, monthlyPayment - monthlyInterest);

    if (principalPortion <= 0) {
      console.error("ยอดชำระรายเดือนต่ำเกินไปจนดอกเบี้ยไม่ลด ยุติการลูป", {
        remainingLoanAmount,
        monthlyPayment,
        monthlyInterest,
      });
      break;
    }

    remainingInterest += monthlyInterest;
    totalInterestPaid += monthlyInterest;
    remainingLoanAmount = Math.max(0, remainingLoanAmount - principalPortion);

    monthsRemaining++;
    lastDate.setMonth(lastDate.getMonth() + 1);
  }

  const yearsRemaining = Math.floor(monthsRemaining / 12);
  const remainingMonths = monthsRemaining % 12;

  const totalMonths = details.length + monthsRemaining;
  const totalYears = Math.floor(totalMonths / 12);
  const totalMonthsRemainder = totalMonths % 12;

  return {
    fullyPaid: fixRemain === 0, // Check if it’s fully paid
    totalYears,
    totalMonths: totalMonthsRemainder,
    remainingDate: { years: yearsRemaining, months: remainingMonths },
    remainingInterest: remainingInterest.toFixed(2),
    totalInterestPaid: totalInterestPaid.toFixed(2),
    lastDayOfPaying: lastDate.toLocaleDateString("en-EN", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }),
  };
};
