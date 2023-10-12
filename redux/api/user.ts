import { api } from "redux/api/index"
import {
  IReferralUserData,
  NotificationSettings,
  UpdateUserParams,
  UserFavoriteData,
  UserInfo,
  UserStatistic,
} from "types/user"
import { BaseResponseType } from "types/content"
import { objectToFormData } from "./utils"

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<UserInfo, number>({
      query: (user_id) => ({
        url: `user/${user_id}/data`,
      }),
      transformResponse: (response: BaseResponseType<UserInfo>) => response.data,
    }),
    updateUser: builder.mutation<any, UpdateUserParams>({
      query: (data) => ({
        url: `user/update`,
        method: "POST",
        body: objectToFormData(data),
      }),
    }),
    changePassword: builder.mutation<
      { success: boolean },
      { password: string; new_password: string; new_password_confirmation: string }
    >({
      query: (data) => ({
        url: `user/change/pass`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteAccount: builder.mutation<{ success: boolean }, { email: string }>({
      query: (data) => ({
        url: `user/delete`,
        method: "DELETE",
        body: data,
      }),
    }),
    getNotificationSettings: builder.query<NotificationSettings, void>({
      query: () => ({
        url: `user/notification/settings`,
      }),
      transformResponse: (response: BaseResponseType<NotificationSettings>) => response.data,
    }),
    updateNotificationSettings: builder.mutation<{ success: boolean }, NotificationSettings>({
      query: (data) => ({
        url: `user/set/notification/settings`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(userApi.util.updateQueryData("getNotificationSettings", undefined, () => queryArg))
        } catch (e) {}
      },
    }),
    getFavorites: builder.query<UserFavoriteData[], void>({
      query: () => ({
        url: `favorite/list`,
      }),
      transformResponse: (response: BaseResponseType<UserFavoriteData[]>) => response.data,
    }),
    addFavorite: builder.mutation<{ success: boolean }, number>({
      query: (user_id) => ({
        url: `favorite/add`,
        method: "POST",
        body: { user_id },
      }),
    }),
    deleteFavorite: builder.mutation<{ success: boolean }, number>({
      query: (user_id) => ({
        url: `favorite/delete`,
        method: "DELETE",
        body: { user_id },
      }),
    }),
    getUserStatistic: builder.query<UserStatistic, void>({
      query: () => ({
        url: `user/statistic`,
      }),
      transformResponse: (response: BaseResponseType<UserStatistic>) => response.data,
    }),
    makeComplain: builder.mutation<{ success: boolean }, { text: string; order_id: number }>({
      query: (data) => ({
        url: "complain",
        method: "PUT",
        body: data,
      }),
    }),
    getReferrals: builder.query<IReferralUserData[], void>({
      query: () => ({
        url: `referals`,
        method: "GET",
      }),
      transformResponse: (response: BaseResponseType<IReferralUserData[]>) => response.data,
    }),
    sendUserInviteEmail: builder.mutation<{ success: boolean }, { email: string }>({
      query: ({ email }) => ({
        url: `user/invite`,
        method: "POST",
        body: { email },
      }),
    }),
    getSubscribe: builder.query<string, void>({
      query: () => ({
        url: `/subscribe`,
      }),
      transformResponse: (response: BaseResponseType<string>) => response.data,
    }),
    getPortal: builder.query<string, void>({
      query: () => ({
        url: `/portal`,
      }),
      transformResponse: (response: BaseResponseType<string>) => response.data,
    }),
    passOnboarding: builder.mutation<{ success: boolean }, { block: number }>({
      query: ({ block }) => ({
        url: `user/onboard`,
        method: "PATCH",
        body: { block: block },
      }),
    }),
    passOnboardingMob: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: `user/onboard/mobile`,
        method: "PATCH",
      }),
    }),
    createLid: builder.mutation<{ success: boolean; data: number }, { name: string; sum: string; phone: string }>({
      query: (data) => ({
        url: `lid/create`,
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetUserQuery,
  useLazyGetUserQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useGetNotificationSettingsQuery,
  useLazyGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useGetFavoritesQuery,
  useLazyGetFavoritesQuery,
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetUserStatisticQuery,
  useLazyGetUserStatisticQuery,
  useMakeComplainMutation,
  useGetReferralsQuery,
  useSendUserInviteEmailMutation,
  useLazyGetPortalQuery,
  useLazyGetSubscribeQuery,
  usePassOnboardingMutation,
  usePassOnboardingMobMutation,
  useCreateLidMutation,
} = userApi
