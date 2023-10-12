import type { NextPage } from "next"
import PageHead from "components/PageHead"
import WelcomeBlock from "components/WelcomeBlock/WelcomeBlock"
import Wallet from "components/Wallet/Wallet"
import StatBlock from "components/StatBlock/StatBlock"
import MyProjects from "components/MyProjects/MyProjects"
import ProfileInfo from "components/ProfileInfo/ProfileInfo"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import OnboardingTour from "components/OnboardingTour/OnboardingTour"
import { useAuth } from "hooks/useAuth"
import { DESKTOP_ONBOARDING_BREAKPOINT, USER_TYPE_CUSTOMER, USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAppDispatch, useAppSelector } from "hooks"
import { updateApiParams } from "redux/slices/apiParams"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import ModalPmTeam from "components/Modals/ModalPmTeam/ModalPmTeam"
import { getCookie, removeCookies } from "cookies-next"
import { setDatalayer } from "utils/setDatalayer"
import dynamic from "next/dynamic"

const Dashboard: NextPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { modalsList } = useAppSelector(selectModals)
  const dispatch = useAppDispatch()
  const ReactTooltip = dynamic(() => import("react-tooltip"), {
    ssr: false,
  })
  const [desktopOnboarding, setDesktopOnboarding] = useState(false)
  useEffect(() => {
    if (window.innerWidth >= DESKTOP_ONBOARDING_BREAKPOINT) {
      setDesktopOnboarding(true)
    } else {
      setDesktopOnboarding(false)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      const authSoc = getCookie("auth_soc")
      if (!user?.id || !authSoc) return
      // @ts-ignore
      const parseAuth = JSON.parse(authSoc)
      setDatalayer({
        event: "autoEvent",
        eventCategory: "login",
        eventAction: parseAuth.type,
        eventLabel: parseAuth.provider,
        login: {
          email: user.email,
          role:
            user.type === USER_TYPE_CUSTOMER
              ? "Client"
              : user.type === USER_TYPE_PM
              ? "Project manager"
              : user.type === USER_TYPE_EXPERT
              ? "Expert"
              : "",
        },
      })
      removeCookies("auth_soc", { sameSite: "lax" })
    }, 0)
  }, [user.email, user?.id, user.type])

  useEffect(() => {
    if (router.query?.datateam && !modalsList.includes("modal-pm-team")) {
      setTimeout(() => {
        dispatch(updateApiParams({ field: "currentPmTeamID", data: Number(router.query.datateam) }))
        dispatch(openModal("modal-pm-team"))
        router.replace("/dashboard", undefined, { shallow: true })
      }, 300)
    }
  }, [router.query])

  return (
    <>
      <PageHead
        title="Manage your tasks and resources on the linki service"
        description="We have collected  for you all relevant information about your activities on the linki platform"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Dashboard" />
        <PageLayoutContent
          page={"dashboard"}
          child={
            <>
              <WelcomeBlock addClass={"page-layout__welcome tour-welcome-block"} />
              <StatBlock addClass={"page-layout__statblock tour-stat-block"} />
              <MyProjects addClass={"page-layout__projects tour-myprojects"} />
            </>
          }
          aside={
            <>
              <Wallet addClass={"page-layout__wallet tour-wallet"} />
              <ProfileInfo addClass={"page-layout__profile-info tour-profile-info"} />
            </>
          }
        />
      </PageLayoutWrapper>
      <ReactTooltip id={"global-tooltip"} className={"custom-tooltip-theme2"} effect={"solid"} place={"bottom"} />
      {desktopOnboarding && user.type === USER_TYPE_EXPERT && !user.is_onboarder_1 && (
        <OnboardingTour targetTour={"tour-dasboard-expert"} />
      )}
      {desktopOnboarding && user.type === USER_TYPE_CUSTOMER && !user.is_onboarder_1 && (
        <OnboardingTour targetTour={"tour-dasboard-customer"} />
      )}
      {desktopOnboarding && user.type === USER_TYPE_PM && !user.is_onboarder_1 && (
        <OnboardingTour targetTour={"tour-dasboard-pm"} />
      )}
      <ModalPmTeam
        isOpen={modalsList.includes("modal-pm-team")}
        onClose={() => {
          dispatch(closeModal("modal-pm-team"))
        }}
        headerUserClickable={false}
        modalName={"modal-pm-team"}
      />
    </>
  )
}

export default Dashboard

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
