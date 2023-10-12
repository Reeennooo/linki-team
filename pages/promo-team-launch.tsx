import type { NextPage } from "next"
import Header from "components/header"
import Footer from "components/footer/footer"
import NeedList from "components/NeedList/NeedList"
import WhatTask from "components/WhatTask/WhatTask"
import HeroSecond from "components/HeroSecond/HeroSecond"
import CallSection from "components/CallSection/CallSection"
import CallSectionSecond from "components/CallSectionSecond/CallSectionSecond"
import HeroThird from "components/HeroThird/HeroThird"

const OtherHomePage3: NextPage = () => {
  return (
    <>
      <Header small={true} />
      <HeroThird>
        <NeedList
          titleText="Тогда у вас точно есть задачи, которые смогут решить удаленные команды"
          reverse={false}
          addClass="with-flash"
        />
      </HeroThird>
      <CallSectionSecond />
      <Footer />
    </>
  )
}

export default OtherHomePage3
