import { api } from "./index"
import { IModerationQuestionsGroup, LoginRequest, RegisterRequest, SetRoleRequest, UserData } from "types/auth"
import { BaseResponseType } from "types/content"

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    checkToken: builder.query<BaseResponseType<UserData>, string | boolean | void>({
      query: (token) => ({
        url: `user`,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    login: builder.mutation<BaseResponseType<UserData>, LoginRequest>({
      query: (data) => ({
        url: `user/login`,
        params: data,
      }),
    }),
    register: builder.mutation<BaseResponseType<UserData>, RegisterRequest>({
      query: (data) => ({
        url: `user/register`,
        method: "POST",
        body: data,
      }),
    }),
    emailVerify: builder.mutation<BaseResponseType<UserData>, { code: string }>({
      query: (data) => ({
        url: `email/verify`,
        method: "POST",
        body: data,
      }),
    }),
    resendEmailVerify: builder.mutation<BaseResponseType<UserData>, { email: string }>({
      query: (data) => ({
        url: `email/verify/resend`,
        method: "POST",
        body: data,
      }),
    }),
    setRole: builder.mutation<BaseResponseType<UserData>, SetRoleRequest>({
      query: (data) => ({
        url: `user/role/set`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<{ success: boolean }, { email: string }>({
      query: (data) => ({
        url: `reset/password/email/request`,
        method: "POST",
        body: data,
      }),
    }),
    resetPasswordConfirm: builder.mutation<BaseResponseType<UserData>, { password: string; token: string }>({
      query: (data) => ({
        url: `reset/password/email/confirm`,
        method: "POST",
        body: data,
      }),
    }),
    getModerationQuestions: builder.query<IModerationQuestionsGroup[], void>({
      query: () => ({
        method: "GET",
        url: "moderation/questions",
      }),
      transformResponse: (response: BaseResponseType<IModerationQuestionsGroup[]>) => response.data,
    }),
    sendModerationAnswers: builder.mutation<{ success: boolean }, { answers: { [key: number]: string } }>({
      query: (data) => ({
        url: "moderation/answers",
        method: "PUT",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useSetRoleMutation,
  useLazyCheckTokenQuery,
  useEmailVerifyMutation,
  useResendEmailVerifyMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
  useGetModerationQuestionsQuery,
  useSendModerationAnswersMutation,
} = authApi

export const { checkToken } = authApi.endpoints
