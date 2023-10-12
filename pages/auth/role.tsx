import type { NextPage } from "next"
import Header from "components/header"
import AuthLayout from "components/AuthLayout/AuthLayout"
import dynamic from "next/dynamic"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { getCookie, removeCookies } from "cookies-next"
import { USER_TOKEN_COOKIE, USER_ID_COOKIE } from "utils/constants"
import { authApi } from "redux/api/auth"
const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
})

const RolePage: NextPage = () => {
  return (
    <div>
      <PageHead title={"Sign up | Linki"} noIndex={true} />
      <Header wide={true} />
      <ReactTooltip
        id={"global-tooltip"}
        className={"custom-tooltip-theme"}
        effect={"solid"}
        place={"right"}
        html={true}
      />
      <main>
        <AuthLayout purpose={"signup"} />
      </main>
    </div>
  )
}

export default RolePage

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, res }) => {
  const token = getCookie(USER_TOKEN_COOKIE, { req, res })
  const userID = getCookie(USER_ID_COOKIE, { req, res })

  if (userID) {
    return {
      props: {},
    }
  }

  if (token) {
    const { data: userData } = await store.dispatch(authApi.endpoints.checkToken.initiate(token))

    if (!userData) {
      removeCookies(USER_TOKEN_COOKIE, { req, res, sameSite: "lax" })
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      }
    }

    const isVerified = userData.data.is_verified

    return {
      redirect: {
        destination: isVerified ? "/dashboard" : "/auth/email-verification",
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: "/signin",
      permanent: false,
    },
  }
})
