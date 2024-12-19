import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loanAmount: "",
  interestRate: 0,
  paymentDuration: 0,
  monthlyPayment: "",
};

const loanSlice = createSlice({
  name: "loan",
  initialState,
  reducers: {
    updateLoanData(state, action) {
      state.loanAmount = action.payload.loanAmount;
      state.interestRate = action.payload.interestRate;
      state.paymentDuration = action.payload.paymentDuration;
      state.monthlyPayment = action.payload.monthlyPayment;
    },
  },
});

export const { updateLoanData } = loanSlice.actions;
export const selectLoanData = (state) => state.loan; // Selector to get loan data

export default loanSlice.reducer;
