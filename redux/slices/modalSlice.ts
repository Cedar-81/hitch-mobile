import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ModalStatus {
  SUCCESS,
  FAILURE,
  GRAY,
}

interface ModalState {
  text: string;
  active: boolean;
  link: string | null;
  title: string;
  status: ModalStatus | null;
}

const initialState: ModalState = {
  text: "",
  active: false,
  link: null,
  title: "",
  status: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    updateModal: (state, action: PayloadAction<Partial<ModalState>>) => {
      Object.assign(state, action.payload);
    },
    closeModal: (state) => {
      state.active = false;
    },
  },
});

export const { updateModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
