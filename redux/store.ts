import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice"; // Import a reducer
import authReducer from "./slices/api/authSlice"; // Import a reducer
import createTripStepsReducer from "./slices/createTripStepsSlice";
import userReducer from "./slices/userSlice";
import tripReducer from "./slices/tripSlice";
import authManagerReducer from "./slices/authManagerSlice";
import modalReducer from "./slices/modalSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    create_trip_steps: createTripStepsReducer,
    auth: authReducer,
    user: userReducer,
    trip: tripReducer,
    auth_manager: authManagerReducer,
    modal: modalReducer,
  },
});

// Infer RootState & AppDispatch types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
