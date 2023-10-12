import { IManagerOffersParams } from "types/project"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "redux/store"

export interface ApiParamsState {
  projectID: number
  orderID: number
  teamMemberID: number
  currentUserID: number
  managerID: number
  chatID: number | undefined | null
  activeProjectIDAtWork: number
  activeVacancyIDAtWork: number
  activeTeamMemberIDVacancy: number
  getManagerOffers: IManagerOffersParams
  modalJobRoleId: number
  currentPmTeamID: number
  updateUserInfo: boolean
}

const initialState: ApiParamsState = {
  projectID: null,
  orderID: null,
  teamMemberID: null,
  currentUserID: null,
  managerID: null,
  chatID: null,
  activeProjectIDAtWork: null,
  activeVacancyIDAtWork: null,
  activeTeamMemberIDVacancy: null,
  getManagerOffers: null,
  modalJobRoleId: null,
  currentPmTeamID: null,
  updateUserInfo: false,
}

type Updater<T, K extends keyof T = keyof T> = {
  [P in K]: {
    field: P
    data: T[P]
  }
}[K]

export const apiParamsSlice = createSlice({
  name: "apiParams",
  initialState,
  reducers: {
    resetApiParams: (state: ApiParamsState, { payload }: PayloadAction<keyof ApiParamsState | "all">) => {
      if (payload === "all") return initialState
      // @ts-ignore
      state[payload] = initialState[payload]
    },
    updateApiParams: (state: ApiParamsState, { payload: { field, data } }: PayloadAction<Updater<ApiParamsState>>) => {
      // @ts-ignore
      state[field] = data
    },
  },
})

export const { updateApiParams, resetApiParams } = apiParamsSlice.actions
export const selectApiParams = (state: RootState) => state[apiParamsSlice.name]
