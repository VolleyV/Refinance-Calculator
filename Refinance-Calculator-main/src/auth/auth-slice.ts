import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../redux-toolkit/store";

interface AuthState {
  principal: any | null;
}

const initialState: AuthState = {
  principal: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPrincipal(state, action: PayloadAction<any | null>) {
      state.principal = action.payload;
    },
  },
});

export const {setPrincipal} = authSlice.actions;

export const selectAuthState = (state: RootState) => state.authState;

export default authSlice.reducer;
