import { createSlice, isAsyncThunkAction, isRejectedWithValue, PayloadAction, Action } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { HYDRATE } from "next-redux-wrapper"
import { authApi } from "../api/auth"
import { User, UserData } from "types/auth"
import { removeCookies, setCookies } from "cookies-next"
import { USER_TOKEN_COOKIE, MAX_AGE_TOKEN_30_DAYS_IN_SECONDS, REFERRAL_WRONG_USER_MSG } from "utils/constants"
import { MutationThunkArg, QueryThunkArg } from "@reduxjs/toolkit/dist/query/core/buildThunks"
import { BaseResponseType } from "types/content"

export type AuthState = {
  user: User
  token: string | null
  isAuthenticated: boolean
  isVerified: boolean
}

const initialState: AuthState = {
  user: {
    id: 0,
    name: "",
    surname: "",
    email: "",
    type: null,
    is_verified: false,
    language: null,
    portfolio: null,
    timezone: null,
    hourly_pay: 0,
    job_roles: [],
    skills: [],
    links: [],
    languages: [],
    avatar: "",
    position: "",
    project_directions: [],
    project_categories: [],
    rating: 0,
    company: null,
    telegram_link: null,
    created_at: null,
    referal_code: null,
    premium_subscribe: false,
    is_onboarder_1: false,
    is_onboarder_2: false,
    is_onboarder_3: false,
    is_onboarded_mob: false,
    is_confirmed: 0,
  },
  isAuthenticated: false,
  isVerified: false,
  token: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: logoutFn,
    setIsOnboarder3Passed: (state: AuthState) => {
      state.user.is_onboarder_3 = true
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE as string, (state, action: PayloadAction<RootState>) => {
      return action.payload[authSlice.name]
    })

    builder.addMatcher(authApi.endpoints.login.matchFulfilled, saveUser)
    builder.addMatcher(authApi.endpoints.register.matchFulfilled, saveUser)
    builder.addMatcher(authApi.endpoints.setRole.matchFulfilled, saveUser)
    builder.addMatcher(authApi.endpoints.checkToken.matchFulfilled, saveUser)
    builder.addMatcher(authApi.endpoints.emailVerify.matchFulfilled, saveUser)
    builder.addMatcher(authApi.endpoints.resetPasswordConfirm.matchFulfilled, saveUser)

    builder.addMatcher(authApi.endpoints.login.matchRejected, logoutFn)
    builder.addMatcher(authApi.endpoints.register.matchRejected, logoutFn)
    builder.addMatcher(authApi.endpoints.setRole.matchRejected, logoutFn)
    builder.addMatcher(authApi.endpoints.checkToken.matchRejected, logoutFn)
  },
})

function saveUser(
  state: AuthState,
  { payload, meta }: PayloadAction<BaseResponseType<UserData>, string, { arg: MutationThunkArg | QueryThunkArg }>
) {
  const {
    data: { api_token, ...user },
    success,
    message,
  } = payload
  let remember = false

  if (meta.arg.endpointName !== "checkToken") {
    remember = meta.arg.originalArgs as any["remember"]
  }

  if (message === REFERRAL_WRONG_USER_MSG && api_token) {
    setCookies(
      USER_TOKEN_COOKIE,
      api_token,
      remember ? { maxAge: MAX_AGE_TOKEN_30_DAYS_IN_SECONDS, sameSite: "lax" } : { sameSite: "lax" }
    )
  }

  if (!success) return state

  setCookies(
    USER_TOKEN_COOKIE,
    api_token,
    remember ? { maxAge: MAX_AGE_TOKEN_30_DAYS_IN_SECONDS, sameSite: "lax" } : { sameSite: "lax" }
  )

  state.user = user
  state.isAuthenticated = !!user.email
  state.isVerified = user.is_verified
  state.token = api_token
}
function logoutFn(state: AuthState, action: Action) {
  if (!isRejectedWithValue(action) && isAsyncThunkAction(action)) {
    return state
  }

  removeCookies(USER_TOKEN_COOKIE, { sameSite: "lax" })
  return initialState
}

export const { logout, setIsOnboarder3Passed } = authSlice.actions

export const selectAuth = (state: RootState) => state[authSlice.name]
