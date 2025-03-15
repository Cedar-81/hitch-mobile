import { PaymentType } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TripState {
  paymentType: PaymentType | null;
  trip_id: string | null;
  price: number | null;
  creator: string | null;
}

// Initial state
const initialState: TripState = {
  paymentType: null,
  trip_id: null,
  price: null,
  creator: null,
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    updateTripState: (state, action: PayloadAction<Partial<TripState>>) => {
      Object.assign(state, action.payload); // Merges new values into state
    },
    resetTripState: () => initialState, // Resets to initial state
  },
});

// Export actions & reducer
export const { updateTripState, resetTripState } = tripSlice.actions;
export default tripSlice.reducer;
