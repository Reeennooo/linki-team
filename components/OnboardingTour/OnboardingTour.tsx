import styles from "./OnboardingTour.module.scss"
import { resetonbOardingRedux, selectonboardingRedux, updateOnboardingRedux } from "redux/slices/onboarding"
import { setIsOnboarder3Passed } from "redux/slices/auth"
import { useAppDispatch, useAppSelector } from "hooks"
import dynamic from "next/dynamic"
import { useState } from "react"
import { StoreHelpers } from "react-joyride"
import ModalOnboarding from "components/Modals/ModalOnboarding/ModalOnboarding"
import { usePassOnboardingMutation } from "redux/api/user"
import {
  TOUR_STEPS_CLIENT_Projects,
  TOUR_STEPS_CLIENT_Projects_AT_WORK,
  TOUR_STEPS_CLIENT_Projects_COMPLETED,
  TOUR_STEPS_EXPERT_Projects,
  TOUR_STEPS_EXPERT_Projects_AT_WORK,
  TOUR_STEPS_EXPERT_Projects_COMPLETED,
  TOUR_STEPS_PM_Projects,
  TOUR_STEPS_PM_PROJECTS_AT_WORK,
  TOUR_STEPS_PM_PROJECTS_COMPLETED,
  TOUR_DASHBOARD_EXPERT,
  TOUR_DASHBOARD_CUSTOMER,
  TOUR_DASHBOARD_PM,
} from "./tours"
import Tooltip from "./ToolTip"
import TooltipNoBtns from "./TooltipNoBtns"

const JoyRideComponent = dynamic(() => import("react-joyride"), { ssr: false })

interface Props {
  addClass?: string
  targetTour: string
}

const OnboardingTour: React.FC<Props> = ({ addClass, targetTour }) => {
  const [passOnboardingRequest] = usePassOnboardingMutation()

  const dispatch = useAppDispatch()

  //ONBOARDING START STATE
  const { startClientProjectstOnboarding } = useAppSelector(selectonboardingRedux)
  const { clientProjectOnboardingAddInbound } = useAppSelector(selectonboardingRedux)
  const { clientProjectOnboardingReadyForWorkTabStart } = useAppSelector(selectonboardingRedux)
  const { clientProjectOnboardingCompletedkTabStart } = useAppSelector(selectonboardingRedux)
  const { startExpertProjectstOnboarding } = useAppSelector(selectonboardingRedux)
  const { startExpertProjectsAtWorktOnboarding } = useAppSelector(selectonboardingRedux)
  const { startPmProjectsOnboarding } = useAppSelector(selectonboardingRedux)
  const { startPmProjectsAtWorkOnboarding } = useAppSelector(selectonboardingRedux)
  const { pmProjectOnboardingReadyForWorkTabStart } = useAppSelector(selectonboardingRedux)

  const [fakeModalOpen, setFakeModalOpen] = useState(false)

  const [modalContent, setModalContent] = useState("")
  const [clPickPmSpotlight, setClPickPmSpotlight] = useState(10)

  //CALLBACKS
  const tourClientPrjCallback = ({ status, index }) => {
    if (index === 3) {
      dispatch(updateOnboardingRedux({ field: "clientProjectOnboardingAddInbound", data: true }))
    }
    if (index === 6) {
      dispatch(updateOnboardingRedux({ field: "highlightArchive", data: true }))
    } else {
      dispatch(updateOnboardingRedux({ field: "highlightArchive", data: false }))
    }
    if (index === 10) {
      dispatch(updateOnboardingRedux({ field: "clientProjectOnboardingСonsideration", data: true }))
    }
    if (index === 4 || index === 9 || index === 11) {
      setClPickPmSpotlight(0)
      if (index === 11) {
        setModalContent("pm-offer")
      } else {
        setModalContent("pm")
      }

      setFakeModalOpen(true)
    } else {
      setClPickPmSpotlight(10)
      setFakeModalOpen(false)
    }
    if (index === 12) {
      dispatch(updateOnboardingRedux({ field: "clientProjectOnboardingСonsideration", data: false }))
      dispatch(updateOnboardingRedux({ field: "clientProjectOnboardingReady", data: true }))
    }
    if (status === "ready") {
      dispatch(updateOnboardingRedux({ field: "clientProjectOnboardingReadyForWorkTab", data: true }))
    }
  }

  const tourClientPrjAtWorkCallback = ({ status, index }) => {
    if (index === 1 || index === 3) {
      if (index === 1) {
        setModalContent("wiew-project-card")
      } else if (index === 3) {
        setModalContent("evaluate")
      }
      setFakeModalOpen(true)
    } else {
      setFakeModalOpen(false)
    }
    if (status === "ready") {
      dispatch(updateOnboardingRedux({ field: "clientProjectOnboardingReadyForWorkTab", data: false }))
      dispatch(updateOnboardingRedux({ field: "clientProjectOnboardingCompletedkTab", data: true }))
    }
  }

  const tourClientPrjCompletedkCallback = ({ status, index }) => {
    if (status === "ready") {
      passOnboardingRequest({ block: 3 })
      dispatch(resetonbOardingRedux("all"))
    }
  }

  const tourExpertProjectCallback = ({ status, index }) => {
    if (index === 3) {
      dispatch(updateOnboardingRedux({ field: "expertProjectOnboardingAddInbound", data: true }))
    }
    if (index === 4) {
      setClPickPmSpotlight(0)
      setModalContent("wiew-vacancy-card")
      setFakeModalOpen(true)
    } else {
      setClPickPmSpotlight(10)
      setFakeModalOpen(false)
    }
    if (index === 6) {
      dispatch(updateOnboardingRedux({ field: "highlightArchive", data: true }))
    } else {
      dispatch(updateOnboardingRedux({ field: "highlightArchive", data: false }))
    }
    if (index === 8) {
      dispatch(updateOnboardingRedux({ field: "expertProjectOnboardingСonsideration", data: true }))
    }
    if (index === 9) {
      dispatch(updateOnboardingRedux({ field: "expertProjectOnboardingСonsiderationChat", data: true }))
    }
    if (index === 11) {
      dispatch(updateOnboardingRedux({ field: "expertProjectOnboardingReadyForWork", data: true }))
    }
    if (status === "ready") {
      passOnboardingRequest({ block: 2 })
      dispatch(resetonbOardingRedux("all"))
    }
  }
  const tourExpertProjectAtWorkCallback = ({ status, index }) => {
    if (index === 1 || index === 2 || index === 3) {
      setClPickPmSpotlight(0)
      if (index === 1 || index === 2) {
        setModalContent("wiew-expert-project-card")
      } else {
        setModalContent("evaluate")
      }
      setFakeModalOpen(true)
    } else {
      setFakeModalOpen(false)
      setClPickPmSpotlight(10)
    }
    if (status === "ready") {
      dispatch(updateOnboardingRedux({ field: "mountExpertProjectsAtWorkOnboarding", data: false }))
      dispatch(updateOnboardingRedux({ field: "expertProjectOnboardingCompletedkTab", data: true }))
    }
  }

  const tourExpertProjectCompletedkCallback = ({ status }) => {
    if (status === "ready") {
      passOnboardingRequest({ block: 3 })
      dispatch(resetonbOardingRedux("all"))
    }
  }

  const tourPmProjectsCallback = ({ index, status }) => {
    if (index === 2) {
      dispatch(updateOnboardingRedux({ field: "pmProjectOnboardingAddInbound", data: true }))
    }
    if (index === 4 || index === 11 || index === 12 || index === 13 || index === 14 || index === 15 || index === 16) {
      setClPickPmSpotlight(0)
      if (index === 4) setModalContent("pm-wiews-project")
      if (index === 11) setModalContent("pm-creates-offer")
      if (index === 12) setModalContent("pm-creates-offer-deskr")
      if (index === 13) setModalContent("pm-creates-offer-deskr")
      if (index === 14) setModalContent("pm-creates-offer-search-expert")
      if (index === 15) setModalContent("pm-creates-offer-open-expert-card")
      if (index === 16) setModalContent("pm-creates-offer-open-expert-card-total")

      setFakeModalOpen(true)
    } else {
      setFakeModalOpen(false)
      setClPickPmSpotlight(10)
    }
    if (index === 6) {
      dispatch(updateOnboardingRedux({ field: "highlightArchive", data: true }))
    } else {
      dispatch(updateOnboardingRedux({ field: "highlightArchive", data: false }))
    }
    if (index === 8) {
      dispatch(updateOnboardingRedux({ field: "pmProjectOnboardingСonsideration", data: true }))
    }
    if (index === 9) {
      dispatch(updateOnboardingRedux({ field: "pmProjectOnboardingСonsideration", data: false }))
      dispatch(updateOnboardingRedux({ field: "pmProjectOnboardingСonsiderationOffer", data: true }))
    }
    if (index === 17) {
      dispatch(updateOnboardingRedux({ field: "pmProjectOnboardingСonsiderationOffer", data: false }))
      dispatch(updateOnboardingRedux({ field: "pmProjectOnboardingReadyForWork", data: true }))
    }
    if (index === 18) {
      dispatch(updateOnboardingRedux({ field: "pmProjectOnboardingReadyForWorkStart", data: true }))
    }
    if (status === "ready") {
      passOnboardingRequest({ block: 2 })
      dispatch(resetonbOardingRedux("all"))
    }
  }

  const tourPmProjectsAtWorkCallback = ({ index, status }) => {
    //console.log("INDEX", index)

    if (index === 1 || index === 7 || index === 11 || index === 12 || index === 13) {
      setClPickPmSpotlight(0)
      if (index === 1) setModalContent("pm-wiews-project-at-work")
      if (index === 7) setModalContent("pm-wiews-project-at-work-candidate")
      if (index === 11) setModalContent("pm-project-info")
      if (index === 12) setModalContent("pm-project-done")
      if (index === 13) setModalContent("evaluate")
      setFakeModalOpen(true)
    } else {
      setFakeModalOpen(false)
      setClPickPmSpotlight(10)
    }
    if (index === 2) {
      dispatch(updateOnboardingRedux({ field: "teamPmProjectsAtWorkOnboarding", data: true }))
    }
    if (index === 3) {
      dispatch(updateOnboardingRedux({ field: "teamOpenPmProjectsAtWorkOnboarding", data: true }))
    }
    if (index === 4) {
      dispatch(updateOnboardingRedux({ field: "teamOpenPmProjectsAtWorkOnboarding", data: false }))
      dispatch(updateOnboardingRedux({ field: "teamPmProjectsAtWorkOnboarding", data: false }))
      dispatch(updateOnboardingRedux({ field: "fakeBoardPmProjectsAtWorkOnboarding", data: true }))
    }
    if (index === 5) {
      dispatch(updateOnboardingRedux({ field: "pmProjectAtWorkOnboardingAddInbound", data: true }))
    }
    if (index === 8) {
      dispatch(updateOnboardingRedux({ field: "pmProjectAtWorkOnboardingСonsideration", data: true }))
    }
    if (index === 9) {
      dispatch(updateOnboardingRedux({ field: "pmProjectAtWorkOnboardingReadyForWork", data: true }))
    }
    if (index === 10) {
      dispatch(updateOnboardingRedux({ field: "teamSelectedPmProjectsAtWorkOnboarding", data: true }))
    }
    if (status === "ready") {
      dispatch(updateOnboardingRedux({ field: "pmProjectOnboardingCompletedTab", data: true }))
      // dispatch(resetonbOardingRedux("all"))
    }
  }

  const tourPmProjectsCompletedCallback = ({ status }) => {
    if (status === "ready") {
      passOnboardingRequest({ block: 3 })
      dispatch(resetonbOardingRedux("all"))
      dispatch(setIsOnboarder3Passed())
    }
  }

  const tourDashboardExpertCallback = ({ status }) => {
    if (status === "ready") {
      passOnboardingRequest({ block: 1 })
    }
  }

  const tourDashboardCustomerCallback = ({ status }) => {
    if (status === "ready") {
      passOnboardingRequest({ block: 1 })
    }
  }

  const tourDashboardPmCallback = ({ status }) => {
    if (status === "ready") {
      passOnboardingRequest({ block: 1 })
    }
  }

  return (
    <>
      {targetTour === "tour-client-prj" && (
        <JoyRideComponent
          // @ts-ignore
          steps={TOUR_STEPS_CLIENT_Projects}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          spotlightPadding={clPickPmSpotlight}
          run={startClientProjectstOnboarding}
          scrollOffset={200}
          tooltipComponent={TooltipNoBtns}
          callback={tourClientPrjCallback}
          // spotlightClicks={true}
        />
      )}
      {targetTour === "tour-client-prj-at-work" && (
        <JoyRideComponent
          // @ts-ignore
          steps={TOUR_STEPS_CLIENT_Projects_AT_WORK}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          spotlightPadding={clPickPmSpotlight}
          run={clientProjectOnboardingReadyForWorkTabStart}
          scrollOffset={200}
          tooltipComponent={TooltipNoBtns}
          callback={tourClientPrjAtWorkCallback}
          // spotlightClicks={true}
        />
      )}
      {targetTour === "tour-client-prj-completed" && (
        <JoyRideComponent
          // @ts-ignore
          steps={TOUR_STEPS_CLIENT_Projects_COMPLETED}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          spotlightPadding={clPickPmSpotlight}
          run={clientProjectOnboardingCompletedkTabStart}
          scrollOffset={200}
          tooltipComponent={TooltipNoBtns}
          callback={tourClientPrjCompletedkCallback}
          // spotlightClicks={true}
        />
      )}
      {targetTour === "tour-expert-projects" && (
        <JoyRideComponent
          // @ts-ignore
          steps={TOUR_STEPS_EXPERT_Projects}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          spotlightPadding={clPickPmSpotlight}
          run={startExpertProjectstOnboarding}
          scrollOffset={200}
          tooltipComponent={TooltipNoBtns}
          callback={tourExpertProjectCallback}
          // spotlightClicks={true}
        />
      )}
      {targetTour === "tour-expert-projects-at-wrok" && (
        <JoyRideComponent
          // @ts-ignore
          steps={TOUR_STEPS_EXPERT_Projects_AT_WORK}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          spotlightPadding={clPickPmSpotlight}
          run={startExpertProjectsAtWorktOnboarding}
          scrollOffset={200}
          tooltipComponent={TooltipNoBtns}
          callback={tourExpertProjectAtWorkCallback}
          // spotlightClicks={true}
        />
      )}
      {targetTour === "tour-expert-completed" && (
        <JoyRideComponent
          // @ts-ignore
          steps={TOUR_STEPS_EXPERT_Projects_COMPLETED}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          spotlightPadding={clPickPmSpotlight}
          run={startExpertProjectsAtWorktOnboarding}
          scrollOffset={200}
          tooltipComponent={TooltipNoBtns}
          callback={tourExpertProjectCompletedkCallback}
          // spotlightClicks={true}
        />
      )}
      {targetTour === "tour-pm-projects" && (
        <JoyRideComponent
          // @ts-ignore
          steps={TOUR_STEPS_PM_Projects}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          spotlightPadding={clPickPmSpotlight}
          run={startPmProjectsOnboarding}
          scrollOffset={200}
          tooltipComponent={TooltipNoBtns}
          callback={tourPmProjectsCallback}
          // spotlightClicks={true}
        />
      )}
      {targetTour === "tour-pm-projects-at-work" && (
        <JoyRideComponent
          // @ts-ignore
          steps={TOUR_STEPS_PM_PROJECTS_AT_WORK}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          spotlightPadding={clPickPmSpotlight}
          run={startPmProjectsAtWorkOnboarding}
          scrollOffset={200}
          tooltipComponent={TooltipNoBtns}
          callback={tourPmProjectsAtWorkCallback}
          // spotlightClicks={true}
        />
      )}
      {targetTour === "tour-pm-projects-completed" && (
        <JoyRideComponent
          // @ts-ignore
          steps={TOUR_STEPS_PM_PROJECTS_COMPLETED}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          spotlightPadding={clPickPmSpotlight}
          run={pmProjectOnboardingReadyForWorkTabStart}
          scrollOffset={200}
          tooltipComponent={TooltipNoBtns}
          callback={tourPmProjectsCompletedCallback}
          // spotlightClicks={true}
        />
      )}
      {targetTour === "tour-dasboard-expert" && (
        <JoyRideComponent
          // @ts-ignore
          steps={TOUR_DASHBOARD_EXPERT}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          spotlightPadding={clPickPmSpotlight}
          run={true}
          scrollOffset={200}
          tooltipComponent={Tooltip}
          callback={tourDashboardExpertCallback}
          isableOverlayClose={true}
          // spotlightClicks={true}
        />
      )}
      {targetTour === "tour-dasboard-customer" && (
        <JoyRideComponent
          // @ts-ignore
          steps={TOUR_DASHBOARD_CUSTOMER}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          spotlightPadding={clPickPmSpotlight}
          run={true}
          scrollOffset={200}
          tooltipComponent={Tooltip}
          callback={tourDashboardCustomerCallback}
          isableOverlayClose={true}
          // spotlightClicks={true}
        />
      )}
      {targetTour === "tour-dasboard-pm" && (
        <JoyRideComponent
          // @ts-ignore
          steps={TOUR_DASHBOARD_PM}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          spotlightPadding={clPickPmSpotlight}
          run={true}
          scrollOffset={200}
          tooltipComponent={Tooltip}
          callback={tourDashboardPmCallback}
          isableOverlayClose={true}
          // spotlightClicks={true}
        />
      )}

      <ModalOnboarding
        modalContent={modalContent}
        isOpen={fakeModalOpen}
        onClose={() => {
          setFakeModalOpen(false)
        }}
      />
    </>
  )
}

export default OnboardingTour
