import { api } from "redux/api/index"
import { BaseResponseType } from "types/content"
import { paramsStringify } from "utils/queryStringUtils"
import { INotificationsData } from "types/user"

export const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<INotificationsData[], void>({
      query: () => ({
        url: `user/notifications`,
      }),
      transformResponse: (response: BaseResponseType<INotificationsData[]>) => response.data,
    }),
    setNotificationsRead: builder.mutation<{ success: boolean }, number[]>({
      query: (data) => ({
        url: `notification/read`,
        method: "PATCH",
        body: { notifications_ids: data },
      }),
      transformResponse: (response: BaseResponseType<{ success: boolean }>) => response.data,
      async onQueryStarted(queryArg, { dispatch, getState }) {
        try {
          const notificationsIDs = queryArg
          dispatch(
            notificationsApi.util.updateQueryData("getNotifications", undefined, (draft) => {
              draft.map((notification) => {
                if (notificationsIDs.includes(notification.id)) notification.status = true
                return notification
              })
            })
          )
        } catch (e) {
          console.log(e)
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useGetNotificationsQuery, useLazyGetNotificationsQuery, useSetNotificationsReadMutation } =
  notificationsApi
