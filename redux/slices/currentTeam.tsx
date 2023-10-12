import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "redux/store"

export interface currentTeamState {
  currentTeamId: number
  creatingTeamId: number
  name: string
  project_categories: string[]
  cover: string
  description: string
  teammates: string[]
  totalJobs: number
  avatar: string
  expertsInTeam: string[]
  updateTeams: boolean
  updateTeamMembers: boolean
  greeting: boolean
  resetForm: number
}

const initialState: currentTeamState = {
  currentTeamId: null,
  creatingTeamId: null,
  name: "",
  project_categories: [],
  cover: "",
  description: "",
  teammates: [],
  totalJobs: 0,
  avatar: "",
  expertsInTeam: [],
  updateTeams: false,
  updateTeamMembers: false,
  greeting: false,
  resetForm: 0,
}

type Updater<T, K extends keyof T = keyof T> = {
  [P in K]: {
    field: P
    data: T[P]
  }
}[K]

export const currentTeamSlice = createSlice({
  name: "currentTeam",
  initialState,
  reducers: {
    resetCurrentTeam: (state: currentTeamState, { payload }: PayloadAction<keyof currentTeamState | "all">) => {
      if (payload === "all") return initialState
      // @ts-ignore
      state[payload] = initialState[payload]
    },
    updateCurrentTeam: (
      state: currentTeamState,
      { payload: { field, data } }: PayloadAction<Updater<currentTeamState>>
    ) => {
      // @ts-ignore
      state[field] = data
    },
  },
})

export const { updateCurrentTeam, resetCurrentTeam } = currentTeamSlice.actions
export const seletCurrentTeam = (state: RootState) => state[currentTeamSlice.name]
