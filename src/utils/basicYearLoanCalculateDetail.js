// utils/basicYearLoanCalculateDetail.js

const isLeapYear = (year) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const daysInYear = (year) => (isLeapYear(year) ? 366 : 365);

const daysInMonth = (year, month) => {
  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 1 && isLeapYear(year)) return 29;
  return daysInMonths[month];
};

export const basicYearLoanCalculateDetail = (basicYearData) => {
  const { loanAmount, startDate, interestRate, paymentDuration } =
    basicYearData;

  // Parse input values
  const principal = parseFloat(loanAmount.replace(/,/g, "")) || 0; // Loan principal
  const annualRate = interestRate / 100; // Annual interest rate in decimal
  const totalMonths = paymentDuration * 12; // Convert years to months

  // Calculate monthly payment using the provided formula
  const monthlyRate = annualRate / 12;
  const calculatedMonthlyPayment =
    monthlyRate === 0
      ? principal / totalMonths // Edge case: Zero interest
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);

  if (calculatedMonthlyPayment <= 0) {
    console.error("Invalid calculated monthly payment.");
    return [];
  }

  const initialStartDate = new Date(startDate);
  let principalRemaining = principal;
  const details = [];
  let monthsElapsed = 0;

  // Main calculation loop
  while (principalRemaining > 0) {
    const currentYear = initialStartDate.getFullYear();
    const currentMonth = initialStartDate.getMonth();
    const daysInCurrentMonth = daysInMonth(currentYear, currentMonth);
    const daysInCurrentYear = daysInYear(currentYear);

    // Calculate interest and principal portions
    const monthlyInterest =
      (principalRemaining * annualRate * daysInCurrentMonth) /
      daysInCurrentYear; // Monthly interest
    const principalPortion = Math.max(
      0,
      calculatedMonthlyPayment - monthlyInterest
    );

    if (principalPortion <= 0) {
      console.error("Monthly payment is too low to reduce the principal.");
      break;
    }

    principalRemaining = Math.max(0, principalRemaining - principalPortion);

    // Push the current month's details
    details.push({
      month: monthsElapsed + 1,
      date: initialStartDate.toISOString(),
      interest: parseFloat(monthlyInterest.toFixed(2)),
      paymentDuration: paymentDuration,
      principalPortion: parseFloat(principalPortion.toFixed(2)),
      remainingPrincipal: parseFloat(principalRemaining.toFixed(2)),
      monthlyPayment: parseFloat(calculatedMonthlyPayment.toFixed(2)),
      interestRate,
    });

    // Advance date to the next month
    initialStartDate.setMonth(initialStartDate.getMonth() + 1);
    monthsElapsed++;
  }

  return details;
};

export const calculateBasicYearThreeYearSummary = (details) => {
  const threeYears = 3 * 12;
  const limitedDetails = details.slice(0, threeYears);
  const paymentDuration = details[0]?.paymentDuration || 0;

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
    paymentDuration: paymentDuration,
    principalPortionAfterThreeYears: Math.trunc(
      principalPortionAfterThreeYears
    ),
    totalMonthlyPaymentThreeYears: Math.trunc(totalMonthlyPaymentThreeYears),
  };
};

export const remainingBasicYearToLast = (details) => {
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

  let totalInterestPaid = 0;
  let monthsRemaining = 0;

  totalInterestPaid = details.reduce(
    (sum, item) => sum + parseFloat(item.interest || 0),
    0
  );

  while (remainingPrincipal > 0) {
    const monthlyInterest = (remainingPrincipal * (interestRate / 100)) / 12;
    const principalPortion = Math.max(0, monthlyPayment - monthlyInterest);

    if (principalPortion <= 0) {
      console.error("ยอดชำระรายเดือนต่ำเกินไปจนดอกเบี้ยไม่ลด ยุติการลูป", {
        remainingPrincipal,
        monthlyPayment,
        monthlyInterest,
      });
      break;
    }

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
    monthlyPayment: Math.trunc(monthlyPayment),
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
