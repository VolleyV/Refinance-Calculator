// utils/basicLoanCalculateDetail.js
const isLeapYear = (year) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const daysInYear = (year) => (isLeapYear(year) ? 366 : 365);

const daysInMonth = (year, month) => {
  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 1 && isLeapYear(year)) return 29;
  return daysInMonths[month];
};

export const basicLoanCalculateDetail = (data) => {
  const {
    loanAmount,
    startDate,
    interestRate,
    monthlyPayment,
    insurance,
    mortgageFee,
  } = data;

  let principalRemaining = parseFloat(loanAmount.replace(/,/g, "")) || 0;
  let monthlyPaymentAmount = parseFloat(monthlyPayment.replace(/,/g, "")) || 0;
  const interestRateMonthly = interestRate / 100;
  const initialStartDate = new Date(startDate);
  const details = [];
  let monthsElapsed = 0;

  while (principalRemaining > 0) {
    const currentYear = initialStartDate.getFullYear();
    const currentMonth = initialStartDate.getMonth();
    const daysInCurrentMonth = daysInMonth(currentYear, currentMonth);
    const daysInCurrentYear = daysInYear(currentYear);

    const interest = parseFloat(
      (
        (principalRemaining * interestRateMonthly * daysInCurrentMonth) /
        daysInCurrentYear
      ).toFixed(2)
    );
    const principalPortion = Math.max(0, monthlyPaymentAmount - interest);

    principalRemaining = Math.max(0, principalRemaining - principalPortion);

    details.push({
      month: monthsElapsed + 1,
      date: initialStartDate.toISOString(),
      interest: parseFloat(interest.toFixed(2)),
      principalPortion: parseFloat(principalPortion.toFixed(2)),
      remainingPrincipal: parseFloat(principalRemaining.toFixed(2)),
      monthlyPayment: parseFloat(monthlyPaymentAmount.toFixed(2)),
      interestRate,
      insurance,
      mortgageFee,
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
  const monthlyPayment = details[0]?.monthlyPayment || 0;
  const insurance = details[0].insurance
    ? parseFloat(details[0].insurance.replace(/,/g, ""))
    : 0;

  const mortgageFee = details[0].mortgageFee
    ? parseFloat(details[0].mortgageFee.replace(/,/g, ""))
    : 0;

  const principalAfterThreeYears =
    limitedDetails[limitedDetails.length - 1]?.remainingPrincipal || 0;

  const totalInterestThreeYears = limitedDetails.reduce(
    (sum, item) => sum + item.interest,
    0
  );

  const principalPortionAfterThreeYears = limitedDetails.reduce(
    (sum, item) => sum + item.principalPortion,
    0
  );

  const totalMonthlyPaymentThreeYears = limitedDetails.reduce(
    (sum, item) => sum + parseFloat(item.monthlyPayment || 0),
    0
  );

  return {
    principalAfterThreeYears: Math.trunc(principalAfterThreeYears),
    totalInterestThreeYears: Math.trunc(totalInterestThreeYears),
    monthlyPayment: Math.trunc(monthlyPayment),
    principalPortionAfterThreeYears: Math.trunc(
      principalPortionAfterThreeYears
    ),
    totalMonthlyPaymentThreeYears: Math.trunc(totalMonthlyPaymentThreeYears),
    insurance,
    mortgageFee,
  };
};

export const remainingToLast = (details) => {
  const lastDetail = details[details.length - 1];
  let remainingPrincipal = lastDetail.remainingPrincipal;
  const monthlyPayment = lastDetail.monthlyPayment;
  const interestRate = lastDetail.interestRate;
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

  while (remainingPrincipal > 0) {
    const monthlyInterest = (remainingPrincipal * (interestRate / 100)) / 12;
    const principalPortion = Math.max(0, monthlyPayment - monthlyInterest);

    totalInterestPaid += monthlyInterest;
    remainingPrincipal = Math.max(0, remainingPrincipal - principalPortion);

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
