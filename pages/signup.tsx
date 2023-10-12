import type { NextPage } from "next"
import Header from "components/header"
import AuthLayout from "components/AuthLayout/AuthLayout"
import dynamic from "next/dynamic"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { getCookie, removeCookies } from "cookies-next"
import { USER_TOKEN_COOKIE, USER_TYPE_EXPERT } from "utils/constants"
import { authApi } from "redux/api/auth"
import { pmteamApi } from "redux/api/pmteam"
const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
})

const SignupPage: NextPage = () => {
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

export default SignupPage

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, res, query }) => {
  const token = getCookie(USER_TOKEN_COOKIE, { req, res })

  if (token) {
    const { data: userData } = await store.dispatch(authApi.endpoints.checkToken.initiate(token))

    if (!userData) {
      removeCookies(USER_TOKEN_COOKIE, { req, res, sameSite: "lax" })
      return {
        props: {},
      }
    }

    const isVerified = userData.data.is_verified
    let dataTeam
    if (userData?.data?.type === USER_TYPE_EXPERT && query?.mt_code) {
      const data = await store.dispatch(
        pmteamApi.endpoints.expertJoinPmTeamViaCode.initiate({ manager_team_code: query?.mt_code })
      )
      if (data) dataTeam = data
    }
    await Promise.all(pmteamApi.util.getRunningOperationPromises())

    return {
      redirect: {
        destination: isVerified
          ? dataTeam?.data
            ? `/dashboard?datateam=${dataTeam?.data}`
            : "/dashboard"
          : "/auth/email-verification",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
})
