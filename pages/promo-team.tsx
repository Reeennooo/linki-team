import type { NextPage } from "next"
import Header from "components/header"
import Footer from "components/footer/footer"
import OtherHero from "components/OtherHero/OtherHero"
import NeedList from "components/NeedList/NeedList"
import WhatTask from "components/WhatTask/WhatTask"
import CallSection from "components/CallSection/CallSection"

const OtherHomePage: NextPage = () => {
  return (
    <>
      <Header small={true} noburger={true} />
      <OtherHero />
      <NeedList titleText="Когда это нужно?" />
      <WhatTask title={`Какие задачи\nможно решить`} />
      <CallSection />
      <Footer />
    </>
  )
}

export default OtherHomePage
