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
  let monthsRemaining = 0;

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
    lastDayOfPaying: lastDate.toLocaleDateString("en-EN", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }),
  };
};
