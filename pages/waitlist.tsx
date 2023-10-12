import PageHead from "components/PageHead"
import dynamic from "next/dynamic"
import { NextPage } from "next"
import { wrapper } from "redux/store"
import WaitList from "components/WaitList/WaitList"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { getCookie, removeCookies } from "cookies-next"
import { USER_TOKEN_COOKIE, USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"
import { authApi } from "redux/api/auth"
import { pmteamApi } from "redux/api/pmteam"
const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
})

const WaitListPage: NextPage = () => {
  return (
    <div>
      <PageHead title={"Wait list | Linki"} noIndex={true} />
      <ReactTooltip
        id={"global-tooltip"}
        className={"custom-tooltip-theme"}
        effect={"solid"}
        place={"right"}
        html={true}
      />
      <main>
        <WaitList />
      </main>
    </div>
  )
}

export default WaitListPage

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, res, query }) => {
  const token = getCookie(USER_TOKEN_COOKIE, { req, res })

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
    const isConfirmed = userData.data.is_confirmed
    let dataTeam
    if (userData?.data?.type === USER_TYPE_EXPERT && query?.mt_code) {
      const data = await store.dispatch(
        pmteamApi.endpoints.expertJoinPmTeamViaCode.initiate({ manager_team_code: query?.mt_code })
      )
      if (data) dataTeam = data
    }
    await Promise.all(pmteamApi.util.getRunningOperationPromises())
    if (userData.data.type === USER_TYPE_PM && isConfirmed !== 2) {
      return {
        props: {},
      }
    }
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
    redirect: {
      destination: "/signin",
      permanent: false,
    },
  }
  // return {
  //   props: {},
  // }
})
// export const getServerSideProps = wrapper.getServerSideProps((store) =>
//   withAuthGSSP(store, async () => {
//     return {
//       props: {},
//     }
//   })
// )
