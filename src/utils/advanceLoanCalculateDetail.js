const isLeapYear = (year) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const daysInYear = (year) => (isLeapYear(year) ? 366 : 365);

const daysInMonth = (year, month) => {
  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 1 && isLeapYear(year)) return 29;
  return daysInMonths[month];
};

  export const advanceLoanCalculateDetail = (advanceData) => {
    const {
      loanAmount,
      monthlyPayment,
      startDate,
      interestRates,
      startTerm = ["1"],
      insurance,
      mortgageFee,
    } = advanceData;

    if (!advanceData || typeof advanceData !== "object") {
      console.error("Invalid advanceData:", advanceData);
      return [];
    }

    const filteredMonthlyPayment = (monthlyPayment || []).filter((value) => value !== "");

    const averageMonthlyPayment =
      filteredMonthlyPayment.length > 0
        ? filteredMonthlyPayment.reduce(
            (acc, curr) => acc + (parseFloat(curr.replace(/,/g, "")) || 0),
            0
          ) / filteredMonthlyPayment.length
        : 0;

    let loanAmountRemaining = parseFloat(loanAmount.replace(/,/g, "")) || 0;
    /*   let newInsurance= parseFloat(insurance.replace(/,/g, "")) || 0;
    loanAmountRemaining += newInsurance */
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

      if (monthsElapsed + 1 >= start) {
        currentInterestRate =
          parseFloat(interestRates[i]?.replace(/,/g, "")) / 100 ||
          currentInterestRate;
        currentMonthlyPayment =
          parseFloat(monthlyPayment[i]?.replace(/,/g, "")) ||
          currentMonthlyPayment;
      }
    }

    const interest =
      (loanAmountRemaining * currentInterestRate * daysInCurrentMonth) /
      daysInCurrentYear;
    const loanAmountPortion = Math.max(0, currentMonthlyPayment - interest);

    // Update the remaining loan balance
    loanAmountRemaining = Math.max(0, loanAmountRemaining - loanAmountPortion);

    details.push({
      month: monthsElapsed + 1,
      date: dateClone.toISOString(),
      interest: interest.toFixed(2),
      loanAmountPortion: loanAmountPortion.toFixed(2),
      remainingLoanAmount: loanAmountRemaining.toFixed(2),
      monthlyPayment: currentMonthlyPayment.toFixed(2),
      interestRate: (currentInterestRate * 100).toFixed(2),
      insurance: insurance,
      mortgageFee: mortgageFee,
      averageMonthlyPayment: averageMonthlyPayment,
    });

    monthsElapsed++;
  }

  return details;
};

export const advanceThreeYearsSummary = (details) => {
  const lastDetail = details[details.length - 1];
  const insurance = lastDetail.insurance
    ? parseFloat(lastDetail.insurance.replace(/,/g, ""))
    : 0;

  const mortgageFee = lastDetail.mortgageFee
    ? parseFloat(lastDetail.mortgageFee.replace(/,/g, ""))
    : 0;

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

  const principalPortionAfterThreeYears = limitedDetails.reduce(
    (sum, item) => sum + parseFloat(item.loanAmountPortion || 0),
    0
  );

  const totalMonthlyPaymentThreeYears = limitedDetails.reduce(
    (sum, item) => sum + parseFloat(item.monthlyPayment || 0),
    0
  );

  const averageMonthlyPayment = details[0]?.averageMonthlyPayment || 0;

  const total =
    parseFloat(totalInterestThreeYears) +
    parseFloat(principalPortionAfterThreeYears) +
    parseFloat(insurance) +
    parseFloat(mortgageFee);

  return {
    loanAmountAfterThreeYears: Math.trunc(loanAmountAfterThreeYears),
    totalInterestThreeYears: Math.trunc(totalInterestThreeYears),
    principalPortionAfterThreeYears: Math.trunc(
      principalPortionAfterThreeYears
    ),
    totalMonthlyPaymentThreeYears: Math.trunc(totalMonthlyPaymentThreeYears),
    insurance: Math.trunc(insurance),
    mortgageFee: Math.trunc(mortgageFee),
    total: Math.trunc(total),
    averageMonthlyPayment: Math.trunc(averageMonthlyPayment),
  };
};

export const advanceRemainingToLast = (details) => {
  const lastDetail = details[details.length - 1];
  let remainingLoanAmount = parseFloat(lastDetail.remainingLoanAmount) || 0;
  const monthlyPayment = parseFloat(lastDetail.monthlyPayment) || 0;
  const interestRate = parseFloat(lastDetail.interestRate) || 0;

  let lastDate;
  if (lastDetail?.date) {
    lastDate = new Date(lastDetail.date);
    if (isNaN(lastDate.getTime())) {
      console.error("Invalid date format:", lastDetail.date);
      lastDate = new Date(Date.now()); // fallback ในกรณีผิดพลาด
    }
  } else {
    console.error("Missing date in lastDetail.");
    lastDate = new Date(Date.now());
  }

  let totalInterestPaid = details.reduce(
    (sum, item) => sum + parseFloat(item.interest || 0),
    0
  );
  let monthsRemaining = 0;

  while (remainingLoanAmount > 0) {
    const monthlyInterest = (remainingLoanAmount * (interestRate / 100)) / 12;
    const principalPortion = Math.max(0, monthlyPayment - monthlyInterest);

    totalInterestPaid += monthlyInterest;
    remainingLoanAmount = Math.max(0, remainingLoanAmount - principalPortion);

    monthsRemaining++;
    lastDate.setMonth(lastDate.getMonth() + 1);
  }

  const totalMonths = details.length + monthsRemaining;
  const totalYears = Math.floor(totalMonths / 12);
  const totalMonthsRemainder = totalMonths % 12;

  const totalMonthlyPayment = details.reduce(
    (sum, item) => sum + parseFloat(item.monthlyPayment || 0),
    0
  );

  return {
    totalYears,
    totalMonths: totalMonthsRemainder,
    totalInterestPaid: Math.trunc(totalInterestPaid),
    totalMonthlyPayment: Math.trunc(totalMonthlyPayment),
    lastDayOfPaying: lastDate.toLocaleDateString("en-EN", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }),
  };
};
