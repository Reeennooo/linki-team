import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "redux/store"
import { getScrollbarWidth } from "utils/getScrollbarWidth"

export type UiState = {
  windowLoaded: boolean
  menuCollapsed: boolean
  taskCreateSuccess: boolean
  disableScroll: boolean
  backErrors: object
}

const initialState: UiState = {
  windowLoaded: false,
  menuCollapsed: false,
  taskCreateSuccess: false,
  disableScroll: false,
  backErrors: null,
}

export interface TogScrollType {
  data: boolean
  breakpoint?: number
}

export const uiSlice = createSlice({
  name: "uistate",
  initialState,
  reducers: {
    toggleWindowLoaded: (state: UiState, action: PayloadAction<boolean>) => {
      state.windowLoaded = action.payload
    },
    toggleSideMenu: (state: UiState, action: PayloadAction<boolean>) => {
      state.menuCollapsed = action.payload
    },
    toggleSuccessOrder: (state: UiState, action: PayloadAction<boolean>) => {
      state.taskCreateSuccess = action.payload
    },
    toggleDocumentScroll: (state: UiState, { payload }: PayloadAction<TogScrollType>) => {
      if (typeof document !== "undefined" && (window.innerWidth < payload.breakpoint || !payload.breakpoint)) {
        if (payload.data) {
          document.documentElement.classList.add("no-scroll")
          const scrollBarWidth = getScrollbarWidth()
          // временное решение
          if (scrollBarWidth && window.innerWidth >= 992) {
            document.documentElement.style.marginRight = scrollBarWidth + "px"
          }
        } else {
          document.documentElement.classList.remove("no-scroll")
          document.documentElement.style.marginRight = ""
        }
      }
    },
    addBackErrors: (state: UiState, action: PayloadAction<object | null>) => {
      state.backErrors = action.payload
    },
  },
})

export const { toggleWindowLoaded, toggleSideMenu, toggleSuccessOrder, toggleDocumentScroll, addBackErrors } =
  uiSlice.actions

export const selectUIState = (state: RootState) => state[uiSlice.name]
export const selectMenuCollapsed = (state: RootState) => state[uiSlice.name].menuCollapsed
export const selectWindowLoaded = (state: RootState) => state[uiSlice.name].windowLoaded
