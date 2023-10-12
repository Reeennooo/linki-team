import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "redux/store"

export interface BoardFilterState {
  project_categories: number[]
  search: string
  date: "all" | "3_days" | "week" | "month" | ""
  job_roles?: number[]
  hourly_pay?: number[]
}

const initialState: BoardFilterState = {
  project_categories: [],
  search: "",
  date: "",
  job_roles: [],
  hourly_pay: [],
}

export const boardFilterSlice = createSlice({
  name: "boardFilter",
  initialState,
  reducers: {
    clearFilter: () => {
      return initialState
    },
    setFilter: (state: BoardFilterState, { payload }: PayloadAction<Partial<BoardFilterState>>) => {
      for (const [key, value] of Object.entries(payload)) {
        state[key] = value
      }
    },
  },
})

export const { clearFilter, setFilter } = boardFilterSlice.actions
export const selectBoardFilter = (state: RootState) => state[boardFilterSlice.name]
