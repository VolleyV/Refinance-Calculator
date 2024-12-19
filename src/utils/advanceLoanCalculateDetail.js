/* eslint-disable no-unused-vars */
import React from "react";

export const advanceLoanCalculateDetail = (data) => {
    const  {
        loanAmount,
        monthlyPayment,
        termMonths,
        startDate,
        interestRates,
        startTerm,
        endTerm,
        calculationDetails,
      }= data;

  const isLeapYear = (year) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const daysInYear = (year) => (isLeapYear(year) ? 366 : 365);

  const daysInMonth = (year, month) => {
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 1 && isLeapYear(year)) return 29;
    return daysInMonths[month];
  };
  if (!loanAmount || !startDate) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  let loanAmountRemaining = parseFloat(loanAmount) || 0;
  const totalTermMonths = parseFloat(termMonths) * 12 || 0; // Convert years to months
  const initialStartDate = new Date(startDate);
  const details = [];
  let monthsElapsed = 0;

  // Initialize default values for the first term
  let currentInterestRate = parseFloat(interestRates[0]) / 100 || 0.025; // Default 2.5%
  let currentMonthlyPayment = parseFloat(monthlyPayment[0]) || 0;

  // Determine "ถึงงวดที่" (endTerm)
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

    // Update interest rate and monthly payment if within a specified range
    for (let i = 0; i < startTerm.length; i++) {
      const start = parseInt(startTerm[i]) || 0;
      const end = parseInt(endTerm[i]) || 0;

      // If current month falls within a specified range, update values
      if (monthsElapsed + 1 >= start && monthsElapsed + 1 <= end) {
        currentInterestRate =
          parseFloat(interestRates[i]) / 100 || currentInterestRate;
        currentMonthlyPayment =
          parseFloat(monthlyPayment[i]) || currentMonthlyPayment;
        break;
      }
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

    loanAmountRemaining = Math.max(0, loanAmountRemaining - loanAmountPortion);

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
  return details
}


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