import type { NextPage } from "next"
import Header from "components/header"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { getCookie, removeCookies } from "cookies-next"
import { USER_TOKEN_COOKIE } from "utils/constants"
import { authApi } from "redux/api/auth"
import AboutLinki from "components/AboutLinki/AboutLinki"
import LinkiSolves from "components/LinkiSolves/LinkiSolves"
import SearchTeams from "components/SearchTeams/SearchTeams"
import SubscribeToGet from "components/SubscribeToGet/SubscribeToGet"
import Footer from "components/footer/footer"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { TextPlugin } from "gsap/dist/TextPlugin"
import QuikStart from "components/QuikStart/QuikStart"

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(TextPlugin)

const Quickstart: NextPage = () => {
  return (
    <>
      <PageHead
        title="Our home page, where you can get to know the service"
        description="Check out our home page: we tell you how we can change the lives of clients and freelancers with the help of our service"
      />
      <div className="wrapper sticky">
        {/* <Header /> */}
        <main className="landing-main">
          <QuikStart />
          <AboutLinki />
          <LinkiSolves />
          <SearchTeams />
          {/* <SubscribeToGet /> */}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Quickstart

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, res }) => {
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

    return {
      redirect: {
        destination: isVerified ? "/dashboard" : "/auth/email-verification",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
})
