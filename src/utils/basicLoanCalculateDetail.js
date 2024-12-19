// utils/calculationUtils.js
export const basicLoanCalculateDetail = (data) => {
  const {
    loanAmount,
    startDate,
    interestRate,
    paymentDuration,
    monthlyPayment,
  } = data;

  const isLeapYear = (year) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const daysInYear = (year) => (isLeapYear(year) ? 366 : 365);

  const daysInMonth = (year, month) => {
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 1 && isLeapYear(year)) return 29;
    return daysInMonths[month];
  };

  let principalRemaining = parseFloat(loanAmount.replace(/,/g, "")) || 0;
  let monthlyPaymentAmount = parseFloat(monthlyPayment.replace(/,/g, "")) || 0;
  const termMonthDuration = paymentDuration * 12;
  const interestRateMonthly = interestRate / 100;
  const initialStartDate = new Date(startDate);
  const details = [];
  let monthsElapsed = 0;

  while (monthsElapsed < termMonthDuration && principalRemaining > 0) {
    const currentYear = initialStartDate.getFullYear();
    const currentMonth = initialStartDate.getMonth();
    const daysInCurrentMonth = daysInMonth(currentYear, currentMonth);
    const daysInCurrentYear = daysInYear(currentYear);

    const interest =
      (principalRemaining * interestRateMonthly * daysInCurrentMonth) /
      daysInCurrentYear;
    const principalPortion = Math.max(0, monthlyPaymentAmount - interest);
    principalRemaining = Math.max(0, principalRemaining - principalPortion);

    details.push({
      month: monthsElapsed + 1,
      date: initialStartDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      interest,
      principalPortion,
      remainingPrincipal: principalRemaining,
      monthlyPayment: monthlyPaymentAmount,
      interestRate,
    });

    initialStartDate.setMonth(initialStartDate.getMonth() + 1);
    monthsElapsed++;
  }

  return details;
};

//
export const calculateThreeYearSummary = (details) => {
  const threeYears = 3 * 12;
  const limitedDetails = details.slice(0, threeYears);

  const principalAfterThreeYears =
    limitedDetails[limitedDetails.length - 1]?.remainingPrincipal || 0;

  const totalInterestThreeYears = limitedDetails.reduce(
    (sum, item) => sum + item.interest,
    0
  );

  return {
    principalAfterThreeYears,
    totalInterestThreeYears,
  };
};

export const toLastSummary = (details) => {
  const totalMonths = details.length;
  const totalLastYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  const totalLastInterest = details.reduce(
    (sum, item) => sum + item.interest,
    0
  );
  const lastPaymentDate = details[details.length - 1].date;

  return {
    totalLastYears,
    remainingMonths,
    totalLastInterest,
    lastPaymentDate,
  };
};
