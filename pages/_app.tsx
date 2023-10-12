import "../styles/global.scss"
import "react-notifications-component/dist/theme.css"
import type { AppProps } from "next/app"
import { wrapper } from "redux/store"
import Head from "next/head"
import PageTriggers from "components/PageTriggers"
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "hooks"
import { selectWindowLoaded, toggleWindowLoaded } from "redux/slices/uiSlice"
import useAppSocket from "hooks/useAppSocket"
import useAppNotification from "hooks/useAppNotification"
// import { useAppIntercom } from "hooks/useAppIntercom"
import CookiesModal from "components/CookiesModal/CookiesModal"
import * as cookie from "cookie"
import { useRouter } from "next/router"
import OnboardingMobile from "components/OnboardingMobile/OnboardingMobile"
import { useAuth } from "hooks/useAuth"
import { DESKTOP_ONBOARDING_BREAKPOINT, USER_TYPE_PM } from "utils/constants"
import { ReactNotifications } from "react-notifications-component"
import ModalChatNotification from "components/Modals/ModalChat/ModalChatNotification"

const WrapperApp = ({ Component, pageProps }: AppProps) => {
  useAppSocket()
  useAppNotification()
  // useAppIntercom()F

  const { pathname, asPath } = useRouter()

  const {
    user: {
      id: userID,
      name: userName,
      is_onboarded_mob: is_onboarded_mob,
      type: userType,
      is_confirmed: userConfirmed,
    },
  } = useAuth()
  const [startMobOnboarding, setStartOnboarding] = useState(false)

  const dispatch = useAppDispatch()
  const windowLoaded = useAppSelector(selectWindowLoaded)

  const [agreeCookie, setAgreeCookie] = useState<boolean>(true)

  useEffect(() => {
    if (!cookie?.parse(document?.cookie)["AGREE_POLICY2"]) setAgreeCookie(false)
  }, [])

  useEffect(() => {
    if (!userID) return
    // @ts-ignore
    if (!window?.dataLayer) return
    // @ts-ignore
    dataLayer.push({
      event: "user-id",
      user_id: userID,
    })
  }, [userID])

  useEffect(() => {
    if (windowLoaded) return
    setTimeout(() => {
      dispatch(toggleWindowLoaded(true))
    }, 500)
  }, [])

  useEffect(() => {
    if (userType === USER_TYPE_PM && userConfirmed !== 2) return
    if (asPath === "/waitlist") return
    if (!is_onboarded_mob && userName && window.innerWidth < DESKTOP_ONBOARDING_BREAKPOINT) {
      setStartOnboarding(true)
    }
  }, [is_onboarded_mob, userConfirmed, userName, userType, asPath])

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>Linki</title>
      </Head>
      <PageTriggers />
      <ReactNotifications />
      <ModalChatNotification />
      <Component {...pageProps} />
      {!agreeCookie &&
        pathname !== "/promo-team-launch" &&
        pathname !== "/promo-team" &&
        pathname !== "/promo-team-project" && <CookiesModal />}
      {startMobOnboarding && <OnboardingMobile />}
    </>
  )
}

export default wrapper.withRedux(WrapperApp)
