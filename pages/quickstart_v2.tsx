import type { NextPage } from "next"
import { wrapper } from "redux/store"
import { getCookie, removeCookies } from "cookies-next"
import { USER_TOKEN_COOKIE } from "utils/constants"
import { authApi } from "redux/api/auth"
import Footer from "components/footer/footer"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { TextPlugin } from "gsap/dist/TextPlugin"
import QuikStart from "components/QuikStart/QuikStart"

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(TextPlugin)

const Quickstart2: NextPage = () => {
  return (
    <>
      <div className="wrapper sticky">
        {/* <Header /> */}
        <main className="landing-main">
          <QuikStart />
          {/* <SubscribeToGet /> */}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Quickstart2

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
