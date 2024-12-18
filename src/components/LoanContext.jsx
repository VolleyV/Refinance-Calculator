import React, { createContext, useState, useContext } from "react";

const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const [loanData, setLoanData] = useState({
    loanAmount: "",
    interestRate: 0,
    paymentDuration: 0,
    monthlyPayment: "",
  });

  const updateLoanData = (data) => {
    setLoanData(data);
  };

  return (
    <LoanContext.Provider value={{ loanData, updateLoanData }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoanContext = () => {
  return useContext(LoanContext);
};
