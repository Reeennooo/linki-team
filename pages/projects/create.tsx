import type { NextPage } from "next"
import PageHead from "components/PageHead"
import TasksForm from "components/TasksForm/TasksForm"
import HintSlider from "components/HintSlider/HintSlider"
import ContactManager from "components/ContactManager/ContactManager"
import { useEffect, useState } from "react"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutWrapper, PageLayoutHeader, PageLayoutContent } from "components/PageLayout"
import { useAppDispatch, useAppSelector } from "hooks"
import { selectUIState, toggleSuccessOrder } from "redux/slices/uiSlice"
import RateService from "components/RateService/RateService"
import SubmitSuccess from "components/SubmitSuccess/SubmitSuccess"
import useUnmount from "hooks/useUnmount"
import { selectonboardingRedux, updateOnboardingRedux } from "redux/slices/onboarding"
import OnboardingStart from "components/OnboardingStart/OnboardingStart"
import { useAuth } from "hooks/useAuth"
import { DESKTOP_ONBOARDING_BREAKPOINT } from "utils/constants"

const CreateProject: NextPage = () => {
  const { user } = useAuth()
  const [showContManager, setShowContManager] = useState(true)
  const { taskCreateSuccess } = useAppSelector(selectUIState)
  const dispatch = useAppDispatch()

  const [startActive, setStartActive] = useState(false)

  //ONBOARDING START STATE
  const { mountCreateProjectOnboarding } = useAppSelector(selectonboardingRedux)
  const { startCreateProjectOnboarding } = useAppSelector(selectonboardingRedux)

  useUnmount(() => {
    dispatch(toggleSuccessOrder(false))
  })

  useEffect(() => {
    //activate onboarding
    if (!user.is_onboarder_2 && window.innerWidth >= DESKTOP_ONBOARDING_BREAKPOINT) {
      dispatch(updateOnboardingRedux({ field: "mountCreateProjectOnboarding", data: true }))
    }
  }, [user.is_onboarder_2])

  const onStartFn = () => {
    dispatch(updateOnboardingRedux({ field: "startCreateProjectOnboarding", data: true }))
  }

  useEffect(() => {
    if (!user.is_onboarder_2) {
      setTimeout(() => {
        setStartActive(true)
      }, 300)
    }
  }, [user.is_onboarder_2])
  return (
    <>
      <PageHead
        title="Manage your projects on the linki service"
        description="Add new projects, participate in existing ones, and achieve new results"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Creating a Project" />
        <PageLayoutContent
          page={"create"}
          child={<>{taskCreateSuccess ? <SubmitSuccess addClass={"page-layout__submit-success"} /> : <TasksForm />}</>}
          aside={
            <>
              {taskCreateSuccess ? (
                <RateService addClass="page-layout__rate-service" />
              ) : (
                <>
                  {user.is_onboarder_2 ? null : <HintSlider addClass={"page-layout__hint-slider"} />}

                  {showContManager ? (
                    <ContactManager
                      title={"Can't decide on a project?"}
                      txt={"Contact our linki manager, and we'll help you assemble a team just for you!"}
                      setShowContManager={setShowContManager}
                    />
                  ) : null}
                </>
              )}
            </>
          }
        />
      </PageLayoutWrapper>
      {user.name && !user.is_onboarder_2 && mountCreateProjectOnboarding && !startCreateProjectOnboarding && (
        <OnboardingStart
          isActive={startActive}
          title={`${user.name}, welcome! Now we will show you how to create a project on the linki platform`}
          txt={"The next step is to take a short training on how to use the linki service"}
          numberOfbtns={1}
          onStart={onStartFn}
        />
      )}
    </>
  )
}

export default CreateProject

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async (context, { user }) => {
    if (user.type !== 1) {
      return {
        notFound: true,
      }
    }

    return {
      props: {},
    }
  })
)
