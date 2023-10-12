import type { NextPage } from "next"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import { useAuth } from "hooks/useAuth"
import ProjectsPM from "components/Projects/ProjectsPM"
import ProjectsCustomer from "components/Projects/ProjectsCustomer"
import ProjectsExpert from "components/Projects/ProjectsExpert"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "hooks"
import { useRouter } from "next/router"
import { updateApiParams } from "redux/slices/apiParams"
import { openModal } from "redux/slices/modals"
import { DESKTOP_ONBOARDING_BREAKPOINT, USER_TYPE_CUSTOMER, USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"
import { selectonboardingRedux, updateOnboardingRedux } from "redux/slices/onboarding"
import OnboardingStart from "components/OnboardingStart/OnboardingStart"
import OnboardingTour from "components/OnboardingTour/OnboardingTour"
import { useGetProjectsQuery } from "redux/api/project"
import { usePassOnboardingMutation } from "redux/api/user"
const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
})

const Projects: NextPage = () => {
  const {
    user: { type: userType, name: userName, is_onboarder_2: is_onboarder_2, is_onboarder_3: is_onboarder_3 },
  } = useAuth()

  const dispatch = useAppDispatch()

  const [passOnboardingRequest] = usePassOnboardingMutation()

  const [startActive, setStartActive] = useState(false)
  const [startActiveExpert, setStartActiveExpert] = useState(false)
  const [startActiveExpertAtWork, setStartActiveExpertAtWork] = useState(false)
  const [startActivePm, setStartActivePm] = useState(false)
  const [startActivePmAtWork, setStartActivePmAtWork] = useState(false)

  const { data: projects } = useGetProjectsQuery()
  const [projectsExist, setProjectsExist] = useState(false)

  useEffect(() => {
    if (!projects?.length) {
      setProjectsExist(false)
      return
    }
    const responsesProjects = [...projects].filter((project) => project.status === 3)
    if (responsesProjects.length > 0) {
      setProjectsExist(true)
    }
  }, [projects])

  //ONBOARDING START STATE
  const { mountClientProjectsOnboarding } = useAppSelector(selectonboardingRedux)
  const { startClientProjectstOnboarding } = useAppSelector(selectonboardingRedux)
  const { clientProjectOnboardingReadyForWorkTab } = useAppSelector(selectonboardingRedux)
  const { clientProjectOnboardingCompletedkTab } = useAppSelector(selectonboardingRedux)

  //EXPERT ONBOARDING START STATE
  const { mountExpertProjectsOnboarding } = useAppSelector(selectonboardingRedux)
  const { startExpertProjectstOnboarding } = useAppSelector(selectonboardingRedux)

  const { mountExpertProjectsAtWorkOnboarding } = useAppSelector(selectonboardingRedux)
  const { startExpertProjectsAtWorktOnboarding } = useAppSelector(selectonboardingRedux)
  const { expertProjectOnboardingCompletedkTab } = useAppSelector(selectonboardingRedux)

  //PM ONBOARDING START STATE
  const { mountPmProjectsOnboarding } = useAppSelector(selectonboardingRedux)
  const { startPmProjectsOnboarding } = useAppSelector(selectonboardingRedux)
  const { mountPmProjectsAtWorkOnboarding } = useAppSelector(selectonboardingRedux)
  const { startPmProjectsAtWorkOnboarding } = useAppSelector(selectonboardingRedux)
  const { pmProjectOnboardingCompletedTab } = useAppSelector(selectonboardingRedux)

  const router = useRouter()
  useEffect(() => {
    if (router.query.vacancy) {
      dispatch(updateApiParams({ field: "teamMemberID", data: Number(router.query.vacancy) }))
      dispatch(openModal("modal-incoming-vacancy"))
    }
  }, [])

  //customer
  const onStartCustomerPrjFn = () => {
    dispatch(updateOnboardingRedux({ field: "startClientProjectstOnboarding", data: true }))
  }
  //expert
  const onStartExpertPrjFn = () => {
    dispatch(updateOnboardingRedux({ field: "startExpertProjectstOnboarding", data: true }))
  }
  //expert
  const onStartExperAtWOrktPrjFn = () => {
    dispatch(updateOnboardingRedux({ field: "startExpertProjectsAtWorktOnboarding", data: true }))
  }
  //pm
  const onStartPmPrjFn = () => {
    dispatch(updateOnboardingRedux({ field: "startPmProjectsOnboarding", data: true }))
  }
  const onStartPmPrjAtworkFn = () => {
    dispatch(updateOnboardingRedux({ field: "startPmProjectsAtWorkOnboarding", data: true }))
  }

  //ONBOARDING CODE MOUNTING (ТУТ БУДУТ ЗАПРОСЫ НА СЕРВЕР!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!)
  useEffect(() => {
    //activate onboarding
    if (
      projectsExist &&
      userType === USER_TYPE_CUSTOMER &&
      !is_onboarder_3 &&
      window.innerWidth >= DESKTOP_ONBOARDING_BREAKPOINT
    ) {
      dispatch(updateOnboardingRedux({ field: "mountClientProjectsOnboarding", data: true }))
    }
  }, [projectsExist])

  useEffect(() => {
    if (mountClientProjectsOnboarding) {
      setTimeout(() => {
        setStartActive(true)
      }, 300)
    }

    if (mountExpertProjectsOnboarding) {
      setTimeout(() => {
        setStartActiveExpert(true)
      }, 300)
    }
    if (mountExpertProjectsAtWorkOnboarding) {
      setTimeout(() => {
        setStartActiveExpertAtWork(true)
      }, 300)
    }
    if (mountPmProjectsOnboarding) {
      setTimeout(() => {
        setStartActivePm(true)
      }, 300)
    }

    if (mountPmProjectsAtWorkOnboarding) {
      setTimeout(() => {
        setStartActivePmAtWork(true)
      }, 300)
    }
  }, [
    mountPmProjectsAtWorkOnboarding,
    mountPmProjectsOnboarding,
    mountExpertProjectsAtWorkOnboarding,
    mountClientProjectsOnboarding,
    mountExpertProjectsOnboarding,
  ])

  const [targetTour, setTargetTour] = useState("")

  useEffect(() => {
    if (
      mountClientProjectsOnboarding &&
      !clientProjectOnboardingReadyForWorkTab &&
      !clientProjectOnboardingCompletedkTab
    )
      setTargetTour("tour-client-prj")
    if (clientProjectOnboardingReadyForWorkTab) setTargetTour("tour-client-prj-at-work")
    if (clientProjectOnboardingCompletedkTab) setTargetTour("tour-client-prj-completed")
    if (mountExpertProjectsOnboarding) setTargetTour("tour-expert-projects")
    if (mountExpertProjectsAtWorkOnboarding) setTargetTour("tour-expert-projects-at-wrok")
    if (expertProjectOnboardingCompletedkTab) setTargetTour("tour-expert-completed")
    if (mountPmProjectsOnboarding) setTargetTour("tour-pm-projects")
    if (mountPmProjectsAtWorkOnboarding) setTargetTour("tour-pm-projects-at-work")
    if (pmProjectOnboardingCompletedTab) setTargetTour("tour-pm-projects-completed")
  }, [
    pmProjectOnboardingCompletedTab,
    mountPmProjectsAtWorkOnboarding,
    mountPmProjectsOnboarding,
    expertProjectOnboardingCompletedkTab,
    mountExpertProjectsAtWorkOnboarding,
    mountClientProjectsOnboarding,
    clientProjectOnboardingReadyForWorkTab,
    clientProjectOnboardingCompletedkTab,
    clientProjectOnboardingCompletedkTab,
    mountExpertProjectsOnboarding,
  ])

  return (
    <>
      <PageHead
        title="Manage your projects on the linki service"
        description="Add new projects, participate in existing ones, and achieve new results"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Projects" />
        <PageLayoutContent
          child={
            userType === USER_TYPE_CUSTOMER ? (
              <ProjectsCustomer />
            ) : userType === USER_TYPE_EXPERT ? (
              <ProjectsExpert />
            ) : userType === USER_TYPE_PM ? (
              <ProjectsPM />
            ) : (
              ""
            )
          }
        />
        <ReactTooltip id={"global-tooltip"} className={"custom-tooltip-theme2"} effect={"solid"} place={"bottom"} />
      </PageLayoutWrapper>
      {userType === USER_TYPE_CUSTOMER &&
        !is_onboarder_3 &&
        projectsExist &&
        mountClientProjectsOnboarding &&
        !startClientProjectstOnboarding && (
          <OnboardingStart
            isActive={startActive}
            title={`Congratulations, ${userName}! Now you are starting your first project with linki`}
            txt={
              "Your project is published and our artificial intelligence is already selecting project managers for you, as soon as we start getting responses we will send notifications, but in the meantime we offer to take a demo scenario on choosing a PM, if you are ready, click 'Next'"
            }
            numberOfbtns={2}
            onStart={onStartCustomerPrjFn}
            onSkip={() => {
              passOnboardingRequest({ block: 3 })
              dispatch(updateOnboardingRedux({ field: "mountClientProjectsOnboarding", data: false }))
            }}
          />
        )}
      {!is_onboarder_2 &&
        userType === USER_TYPE_EXPERT &&
        mountExpertProjectsOnboarding &&
        !startExpertProjectstOnboarding && (
          <OnboardingStart
            isActive={startActiveExpert}
            title={`Congratulations, ${userName}! You are now embarking on a fascinating journey of working on linki`}
            txt={
              "And for a better understanding of how our service works, we offer to take a demo scenario on choosing an interesting project, and if you're ready, click Next."
            }
            numberOfbtns={2}
            onStart={onStartExpertPrjFn}
            onSkip={() => {
              passOnboardingRequest({ block: 2 })
              dispatch(updateOnboardingRedux({ field: "mountExpertProjectsOnboarding", data: false }))
            }}
          />
        )}
      {!is_onboarder_3 &&
        userType === USER_TYPE_EXPERT &&
        mountExpertProjectsAtWorkOnboarding &&
        !startExpertProjectsAtWorktOnboarding && (
          <OnboardingStart
            isActive={startActiveExpertAtWork}
            title={`Congratulations, ${userName}! You have completed 1/2 of the demo training!`}
            txt={"You can click on Next to continue or skip Part 2"}
            numberOfbtns={2}
            onStart={onStartExperAtWOrktPrjFn}
            onSkip={() => {
              passOnboardingRequest({ block: 3 })
              dispatch(updateOnboardingRedux({ field: "mountExpertProjectsAtWorkOnboarding", data: false }))
            }}
          />
        )}
      {!is_onboarder_2 && userType === USER_TYPE_PM && mountPmProjectsOnboarding && !startPmProjectsOnboarding && (
        <OnboardingStart
          isActive={startActivePm}
          title={`Congratulations, ${userName}! You are now embarking on a fascinating journey of working on linki`}
          txt={
            "And for a better understanding of how our service works, we offer to take a demo scenario on choosing an interesting project, and if you're ready, click Next."
          }
          numberOfbtns={2}
          onStart={onStartPmPrjFn}
          onSkip={() => {
            passOnboardingRequest({ block: 2 })
            dispatch(updateOnboardingRedux({ field: "mountPmProjectsOnboarding", data: false }))
          }}
        />
      )}
      {!is_onboarder_3 &&
        userType === USER_TYPE_PM &&
        mountPmProjectsAtWorkOnboarding &&
        !startPmProjectsAtWorkOnboarding && (
          <OnboardingStart
            isActive={startActivePmAtWork}
            title={`Congratulations, ${userName}! You have completed 1/2 of the demo training!`}
            txt={"You can click on Next to continue or skip Part 2"}
            numberOfbtns={2}
            onStart={onStartPmPrjAtworkFn}
            onSkip={() => {
              passOnboardingRequest({ block: 3 })
              dispatch(updateOnboardingRedux({ field: "mountPmProjectsAtWorkOnboarding", data: false }))
            }}
          />
        )}
      {((projectsExist && mountClientProjectsOnboarding) ||
        startExpertProjectstOnboarding ||
        startExpertProjectsAtWorktOnboarding ||
        startPmProjectsOnboarding ||
        startPmProjectsAtWorkOnboarding ||
        pmProjectOnboardingCompletedTab) &&
        ((userType === USER_TYPE_CUSTOMER && !is_onboarder_3) ||
          (userType === USER_TYPE_EXPERT && !is_onboarder_2) ||
          (userType === USER_TYPE_EXPERT && !is_onboarder_3) ||
          (userType === USER_TYPE_PM && !is_onboarder_2) ||
          (userType === USER_TYPE_PM && !is_onboarder_3)) && <OnboardingTour targetTour={`${targetTour}`} />}
    </>
  )
}

export default Projects

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
