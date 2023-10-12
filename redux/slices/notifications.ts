import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
// import { notificationsApi } from "redux/api/notifications"
import { INotificationsData, NotificationNames, NotificationSettings } from "types/user"
import { userApi } from "redux/api/user"

export type NotificationsState = {
  notifications: INotificationsData[]
  isAllowed: boolean
  isNewNotificationArrived: boolean
  settingsWeb: Record<NotificationNames, boolean>
}

const initialState: NotificationsState = {
  notifications: [],
  isAllowed: false,
  isNewNotificationArrived: false,
  settingsWeb: {
    chats: false,
    news: false,
    payments: false,
    projects: false,
  },
}

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationAllowed: (state, { payload }: PayloadAction<boolean>) => {
      state.isAllowed = payload
    },
    setNewNotificationArrived: (state, { payload }: PayloadAction<boolean>) => {
      state.isNewNotificationArrived = payload
    },
  },
  extraReducers: (builder) => {
    // builder.addMatcher(notificationsApi.endpoints.getNotifications.matchFulfilled, (state, { payload }) => {
    //   state.notifications = payload
    // })
    builder.addMatcher(userApi.endpoints.getNotificationSettings.matchFulfilled, (state, { payload }) => {
      state.settingsWeb = settingsWebNotificationNumberToBoolean(payload)
    })
    builder.addMatcher(userApi.endpoints.updateNotificationSettings.matchFulfilled, (state, { meta }) => {
      state.settingsWeb = settingsWebNotificationNumberToBoolean(meta.arg.originalArgs)
    })
  },
})

function settingsWebNotificationNumberToBoolean(data: NotificationSettings) {
  return Object.entries(data).reduce(
    (acc, [name, value]) => {
      acc[name] = value >= 2
      return acc
    },
    { ...initialState.settingsWeb }
  )
}

export const { setNotificationAllowed, setNewNotificationArrived } = notificationsSlice.actions

export const selectNotifications = (state: RootState) => state[notificationsSlice.name]
