import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthManagerState {
  fromSignup: boolean;
}

const initialState: AuthManagerState = {
  fromSignup: false,
};

const authManagerSlice = createSlice({
  name: "authManager",
  initialState,
  reducers: {
    updateFromSignup: (
      state: AuthManagerState,
      action: PayloadAction<boolean>
    ) => {
      state.fromSignup = action.payload;
    },
  },
});

export const { updateFromSignup } = authManagerSlice.actions;
export default authManagerSlice.reducer;
