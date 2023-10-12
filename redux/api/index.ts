import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../store"
import { getCookie } from "cookies-next"
import { HYDRATE } from "next-redux-wrapper"
import { BACKEND_API_URL } from "utils/constants"

// https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery

const endpointsWithoutAuthorization = [
  "login",
  "register",
  "emailVerify",
  "resendEmailVerify",
  "setRole",
  "resetPassword",
  "createLid",
  "getCatalogTeams",
]

const endpointsFormData = ["createProject", "updateUser", "createTeam", "updateTeam", "sendMessage"]

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_API_URL,
    prepareHeaders: (headers, { endpoint, ...api }) => {
      const token = (api.getState() as RootState).auth.token || getCookie("token")

      if (token && !endpointsWithoutAuthorization.includes(endpoint)) {
        headers.set("authorization", `Bearer ${token}`)
      }

      headers.set("Accept", "application/json")
      if (!endpointsFormData.includes(endpoint)) {
        headers.set("Content-Type", "application/json")
      }
      return headers
    },
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
  endpoints: () => ({}),
})
