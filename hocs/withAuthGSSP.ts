import { getCookie, removeCookies } from "cookies-next"
import { USER_TOKEN_COOKIE, USER_TYPE_PM } from "utils/constants"
import { authApi } from "redux/api/auth"
import { logout } from "redux/slices/auth"
import { GetServerSidePropsContext } from "next"
import { AppStore } from "redux/store"
import { User } from "types/auth"
import { CookieValueTypes } from "cookies-next/src/types"

export function withAuthGSSP(
  store: AppStore,
  gssp: (context: GetServerSidePropsContext, response: { token: CookieValueTypes; user: User }) => any
) {
  return async (context: GetServerSidePropsContext) => {
    const { req, res } = context
    const token = getCookie(USER_TOKEN_COOKIE, { req, res })

    let user
    if (token) {
      const { data: userData } = await store.dispatch(authApi.endpoints.checkToken.initiate(token))
      if (!userData) {
        removeCookies(USER_TOKEN_COOKIE, { req, res, sameSite: "lax" })
        await store.dispatch(logout())

        return {
          redirect: {
            destination: "/signin",
            permanent: false,
          },
        }
      }
      const isVerified = userData.data.is_verified
      const isConfirmed = userData.data.is_confirmed

      if (!isVerified) {
        return {
          redirect: {
            destination: "/auth/email-verification",
            permanent: false,
          },
        }
      }

      user = { ...userData.data }

      if (userData.data.type === USER_TYPE_PM && isConfirmed !== 2) {
        return {
          redirect: {
            destination: "/waitlist",
            permanent: false,
          },
        }
      }
    } else {
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      }
    }

    const gsspData = await gssp(context, { token, user })

    return gsspData
  }
}
