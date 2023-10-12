import type { NextPage } from "next"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import Stub from "components/Stub/Stub"
import { useAuth } from "hooks/useAuth"
import { BACKEND_HOST, USER_TYPE_PM } from "utils/constants"
import SettingsTeam from "components/SettingsTeam/SettingsTeam"
import TeamSideInfo from "components/TeamSideInfo/TeamSideInfo"
import { useEffect } from "react"
import { pmteamApi } from "redux/api/pmteam"
import TeamsList from "components/TeamsList/TeamsList"
import { resetCurrentTeam, updateCurrentTeam } from "redux/slices/currentTeam"
import { useAppDispatch } from "hooks"
import useUnmount from "hooks/useUnmount"
import dynamic from "next/dynamic"
const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
})
interface Props {
  teamToEditId: number
  initialData: any
}

const CreateTeam: NextPage<Props> = ({ teamToEditId, initialData }) => {
  const { user } = useAuth()

  const dispatch = useAppDispatch()

  useEffect(() => {
    teamToEditId && dispatch(updateCurrentTeam({ field: "currentTeamId", data: teamToEditId }))
    initialData?.jobs_count >= 0 && dispatch(updateCurrentTeam({ field: "totalJobs", data: initialData?.jobs_count }))
    document.querySelector(".page-layout__content-wrp")?.scrollTo(0, 0)
  }, [teamToEditId, initialData])

  useUnmount(() => {
    dispatch(resetCurrentTeam("all"))
  })

  return (
    <>
      <PageHead
        title="Check out the tariffs on the linki platform"
        description="Get more from the linki platform: enhance your opportunities, receive priority support and earn more with us"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Teams" />
        <PageLayoutContent
          mod={user.type === USER_TYPE_PM ? "aside-mob-top" : "content-flex"}
          child={
            <>
              {user.type === USER_TYPE_PM ? (
                <SettingsTeam
                  initialAvatar={initialData.avatar ? `${BACKEND_HOST}/${initialData.avatar}` : null}
                  initialName={initialData.name}
                  initialCover={initialData.image ? `${BACKEND_HOST}/${initialData.image}` : null}
                  initialDescription={initialData.description}
                  initialTelegram={initialData.telegram_link}
                  initLinks={initialData.links}
                  initDirections={initialData.directions}
                  initCategories={initialData.categories}
                  teamToEditId={teamToEditId}
                  refCode={initialData.team_code}
                />
              ) : (
                <Stub />
              )}
            </>
          }
          aside={
            user.type === USER_TYPE_PM ? (
              <>
                <TeamsList addClass="page-layout__team-list" teamToEditId={teamToEditId} />
                <TeamSideInfo />
              </>
            ) : null
          }
        />
        <ReactTooltip
          id={"global-tooltip-html"}
          className={"custom-tooltip-theme2"}
          effect={"solid"}
          clickable={true}
          delayHide={300}
          html={true}
        />
        <ReactTooltip
          id={"global-tooltip-white"}
          className={"custom-tooltip-theme-white"}
          effect={"solid"}
          place={"top"}
        />
      </PageLayoutWrapper>
    </>
  )
}

export default CreateTeam

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async (context) => {
    const teamToEditId = context.query.id
    const { data: initialData } = await store.dispatch(
      pmteamApi.endpoints.getTeamInfo.initiate(Number(context.query.id))
    )
    await Promise.all(pmteamApi.util.getRunningOperationPromises())
    if (!initialData) {
      return {
        redirect: {
          permanent: false,
          destination: "/teams/create",
        },
      }
    }
    return {
      props: { teamToEditId, initialData },
    }
  })
)
