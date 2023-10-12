import type { NextPage } from "next"
import Header from "components/header"
import Footer from "components/footer/footer"
import NeedList from "components/NeedList/NeedList"
import HeroSecond from "components/HeroSecond/HeroSecond"
import CallSectionSecond from "components/CallSectionSecond/CallSectionSecond"

const OtherHomePage2: NextPage = () => {
  return (
    <>
      <Header small={true} />
      <HeroSecond />
      <NeedList titleText="Когда это нужно?" reverse={true} addClass={"padding"} />
      <CallSectionSecond />
      <Footer />
    </>
  )
}

export default OtherHomePage2
