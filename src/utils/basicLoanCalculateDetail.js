// utils/calculationUtils.js
//Calculate Basic of month

const isLeapYear = (year) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const daysInYear = (year) => (isLeapYear(year) ? 366 : 365);

const daysInMonth = (year, month) => {
  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 1 && isLeapYear(year)) return 29;
  return daysInMonths[month];
};
export const basicLoanCalculateDetail = (data) => {
  const { loanAmount, startDate, interestRate, monthlyPayment } = data;

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

    const interest =
      (principalRemaining * interestRateMonthly * daysInCurrentMonth) /
      daysInCurrentYear;
    const principalPortion = Math.max(0, monthlyPaymentAmount - interest);

    if (principalPortion <= 0) {
      console.error("Monthly payment is too low to reduce principal.");
    }

    principalRemaining = Math.max(0, principalRemaining - principalPortion);

    details.push({
      month: monthsElapsed + 1,
      date: initialStartDate.toLocaleDateString("en-EN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      interest: parseFloat(interest.toFixed(2)),
      principalPortion: parseFloat(principalPortion.toFixed(2)),
      remainingPrincipal: parseFloat(principalRemaining.toFixed(2)),
      monthlyPayment: parseFloat(monthlyPaymentAmount.toFixed(2)),
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

export const remainingToLast = (details) => {
  const lastDetail = details[details.length - 1];
  let remainingPrincipal = lastDetail.remainingPrincipal;
  const monthlyPayment = lastDetail.monthlyPayment;
  const interestRate = lastDetail.interestRate;
  let lastDate;

  const fixRemain = remainingPrincipal;

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

    remainingInterest += monthlyInterest;
    totalInterestPaid += monthlyInterest;
    remainingPrincipal = Math.max(0, remainingPrincipal - principalPortion);

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

  // Utility functions
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const daysInYear = (year) =>
    new Date(year, 2, 29).getDate() === 29 ? 366 : 365;

  // Main calculation loop
  while (principalRemaining > 0) {
    const currentYear = initialStartDate.getFullYear();
    const currentMonth = initialStartDate.getMonth();

    // Calculate interest and principal portions
    const monthlyInterest = (principalRemaining * annualRate) / 12; // Monthly interest
    const principalPortion = Math.max(
      0,
      calculatedMonthlyPayment - monthlyInterest
    );

    if (principalPortion <= 0) {
      console.error("Monthly payment is too low to reduce the principal.");
      break;
    }

    principalRemaining = Math.max(0, principalRemaining - principalPortion);

    const daysInCurrentMonth = daysInMonth(currentYear, currentMonth);
    const daysInCurrentYear = daysInYear(currentYear);

    // Push the current month's details
    details.push({
      month: monthsElapsed + 1,
      date: initialStartDate.toLocaleDateString("en-EN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      interest: parseFloat(monthlyInterest.toFixed(2)),
      principalPortion: parseFloat(principalPortion.toFixed(2)),
      remainingPrincipal: parseFloat(principalRemaining.toFixed(2)),
      monthlyPayment: parseFloat(calculatedMonthlyPayment.toFixed(2)),
      interestRate: interestRate,
      daysInMonth: daysInCurrentMonth,
      daysInYear: daysInCurrentYear,
    });

    // Advance date to the next month
    initialStartDate.setMonth(initialStartDate.getMonth() + 1);
    monthsElapsed++;
  }

  return details;
};
