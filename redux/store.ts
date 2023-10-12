import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit"
import { createWrapper, Context } from "next-redux-wrapper"
import { combineReducers } from "redux"
import { api } from "./api"
import { authSlice } from "./slices/auth"
import { uiSlice } from "./slices/uiSlice"
import { boardFilterSlice } from "./slices/boardFilter"
import { modalsSlice } from "redux/slices/modals"
import { apiParamsSlice } from "redux/slices/apiParams"
import { notificationsSlice } from "redux/slices/notifications"
import { currentTeamSlice } from "./slices/currentTeam"
import { onboardingSlice } from "./slices/onboarding"

const isDev = process.env.NODE_ENV === "development"

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [authSlice.name]: authSlice.reducer,
  [uiSlice.name]: uiSlice.reducer,
  [boardFilterSlice.name]: boardFilterSlice.reducer,
  [modalsSlice.name]: modalsSlice.reducer,
  [apiParamsSlice.name]: apiParamsSlice.reducer,
  [currentTeamSlice.name]: currentTeamSlice.reducer,
  [notificationsSlice.name]: notificationsSlice.reducer,
  [onboardingSlice.name]: onboardingSlice.reducer,
})

const makeStore = (context: Context) => {
  return configureStore({
    reducer: rootReducer,
    devTools: isDev,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>

export const wrapper = createWrapper<AppStore>(makeStore, { debug: false })
//https://github.com/kirill-konshin/next-redux-wrapper#usage
