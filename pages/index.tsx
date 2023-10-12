import type { NextPage } from "next"
import PageHead from "components/PageHead"
import Header from "components/header"
import QuikStart from "components/QuikStart/QuikStart"
import UseCases from "components/UseCases/UseCases"
import AreasSection from "components/AreasSection/AreasSection"
import ProductsSection from "components/ProductsSection/ProductsSection"
import WhyLinki from "components/WhyLinki/WhyLinki"
import ForTeamSection from "components/ForTeamSection/ForTeamSection"
import ForExpertSection from "components/ForExpertSection/ForExpertSection"
import FooterLarge from "components/FooterLarge/FooterLarge"
import TeamsSection from "components/TeamsSection/TeamsSection"
import OurPartnersSection from "components/OurPartnersSection/OurPartnersSection"
import { getCookie, removeCookies } from "cookies-next"
import { USER_TOKEN_COOKIE } from "utils/constants"
import { authApi } from "redux/api/auth"
import { wrapper } from "redux/store"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { newText } from "./better-way"

gsap.registerPlugin(ScrollTrigger)

const Main: NextPage = () => {
  return (
    <>
      <PageHead
        title={"Linki - platform for freelance"}
        description={
          "Join Linki - the unique platform connecting customers, experts and project managers of various fields across the world. Launch your own project or join the perfect team"
        }
      />
      <div className="wrapper sticky">
        <Header mainpage={true} large={true} />
        <main className="mainpage">
          <QuikStart newmain={true} sectionData={newText.quikstartSection[1]} withoutForm={true} />
          <UseCases sectionData={newText.usecasesSection} />
          <AreasSection />
          <TeamsSection sectionData={newText.teamsSection} />
          <OurPartnersSection sectionData={newText.partnersSection} />
          <ProductsSection sectionData={newText.productsSection} />
          <WhyLinki sectionData={newText.whySection} />
          <ForTeamSection sectionData={newText.teamSection} />
          <ForExpertSection sectionData={newText.expertSection} />
        </main>
        <FooterLarge sectionData={newText.footer} />
      </div>
    </>
  )
}

export default Main

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
