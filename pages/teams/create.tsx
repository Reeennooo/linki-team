import type { NextPage } from "next"
import Head from "next/head"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import Stub from "components/Stub/Stub"
import { useAuth } from "hooks/useAuth"
import { USER_TYPE_PM } from "utils/constants"
import SettingsTeam from "components/SettingsTeam/SettingsTeam"
import TeamSideInfo from "components/TeamSideInfo/TeamSideInfo"
import { useEffect, useState } from "react"
import { useGetManagerTeamsQuery } from "redux/api/pmteam"
import TeamsList from "components/TeamsList/TeamsList"
import useUnmount from "hooks/useUnmount"
import { useAppDispatch, useAppSelector } from "hooks"
import { resetCurrentTeam, seletCurrentTeam } from "redux/slices/currentTeam"
import TeamsGreeting from "components/TeamsGreeting/TeamsGreeting"
import dynamic from "next/dynamic"
const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
})

const CreateTeam: NextPage = () => {
  const { user } = useAuth()

  const { data: getAllTeamsData, isSuccess } = useGetManagerTeamsQuery()

  const { greeting, currentTeamId } = useAppSelector(seletCurrentTeam)

  const dispatch = useAppDispatch()

  useUnmount(() => {
    dispatch(resetCurrentTeam("all"))
  })

  return (
    <>
      <PageHead
        title="My teams on Linki"
        description="Teams are an association of experts and professional project managers for the implementation of ideas. Create teams, participate in awesome projects and earn money together with your team on the Linki platform"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Teams" />
        <PageLayoutContent
          mod={user.type === USER_TYPE_PM ? "aside-mob-top" : "content-flex"}
          child={
            <>
              {user.type === USER_TYPE_PM ? (
                getAllTeamsData?.length > 0 || greeting ? (
                  <SettingsTeam />
                ) : isSuccess ? (
                  <TeamsGreeting />
                ) : null
              ) : (
                <Stub />
              )}
            </>
          }
          aside={
            user.type === USER_TYPE_PM && (getAllTeamsData?.length > 0 || greeting) ? (
              <>
                {(getAllTeamsData?.length > 0 || currentTeamId) && <TeamsList addClass="page-layout__team-list" />}
                <TeamSideInfo />
              </>
            ) : null
          }
        />
        <ReactTooltip id={"global-tooltip"} className={"custom-tooltip-theme2"} effect={"solid"} />
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
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
