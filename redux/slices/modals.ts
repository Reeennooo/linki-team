import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "redux/store"

export interface modalsState {
  modalsList: string[]
}

const initialState: modalsState = {
  modalsList: [],
}

export const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    closeAllModals: () => {
      return initialState
    },
    triggerModal: (state: modalsState, action: PayloadAction<string>) => {
      const index = state.modalsList.indexOf(action.payload)
      if (index > -1) {
        state.modalsList.splice(index, 1)
      } else {
        state.modalsList.push(action.payload)
      }
    },
    openModal: (state: modalsState, action: PayloadAction<string>) => {
      state.modalsList.push(action.payload)
    },
    closeModal: (state: modalsState, action: PayloadAction<string>) => {
      const index = state.modalsList.indexOf(action.payload)
      if (index > -1) state.modalsList.splice(index, 1)
    },
  },
})

export const { closeAllModals, triggerModal, openModal, closeModal } = modalsSlice.actions
export const selectModals = (state: RootState) => state[modalsSlice.name]
