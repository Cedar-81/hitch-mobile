import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Trip, TripEditing } from "@/lib/types"; // Assuming you have a Trip type

interface CreateTripStepsState {
  last_route: string;
  steps: { id: number; state: string }[];
  currentStep: number;
  currentlyEditing: TripEditing;
}

const initialState: CreateTripStepsState = {
  last_route: "",
  steps: [
    { id: 1, state: "untouched" },
    { id: 2, state: "untouched" },
    { id: 3, state: "untouched" },
  ],
  currentStep: 3, // Default step (ID 3 as the current step)
  currentlyEditing: {
    start_location_city: "",
    car_type: "",
    destination_location_city: "",
    destination_location_state: "",
    end_date_time: "",
    passenger_count: 0,
    price: 1000,
    start_date_time: "",
    start_location_state: "",
    users: "",
  },
};

const createTripStepsSlice = createSlice({
  name: "create_trip_steps",
  initialState,
  reducers: {
    goToNextStep: (state) => {
      const nextIndex =
        state.steps.findIndex((step) => step.id === state.currentStep) + 1;

      if (nextIndex < state.steps.length) {
        state.currentStep = state.steps[nextIndex].id;
      }
    },
    goToStep: (state, action: PayloadAction<number>) => {
      const stepId = action.payload;
      const stepExists = state.steps.find((step) => step.id === stepId);

      if (stepExists) {
        state.currentStep = stepId;
      }
    },
    updateLastRoute: (state, action: PayloadAction<string>) => {
      state.last_route = action.payload;
    },
    setCurrentlyEditingTrip: (
      state,
      action: PayloadAction<Partial<TripEditing>>
    ) => {
      if (state.currentlyEditing) {
        state.currentlyEditing = {
          ...state.currentlyEditing,
          ...action.payload,
        };
      }
    },
  },
});

export const {
  goToNextStep,
  goToStep,
  updateLastRoute,
  setCurrentlyEditingTrip,
} = createTripStepsSlice.actions;

export default createTripStepsSlice.reducer;
