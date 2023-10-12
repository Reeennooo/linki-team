import type { NextPage } from "next"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import Stub from "components/Stub/Stub"
import ReferralsSection from "components/ReferralsSection/ReferralsSection"
import AsideInfoBlock from "components/AsideInfoBlock/AsideInfoBlock"
import dynamic from "next/dynamic"
const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
})

const Referrals: NextPage = () => {
  return (
    <>
      <PageHead
        title="Referral program from linki"
        description="Take part in the referral program: invite specialists to the platform and get bonuses for it"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Referrals" />
        <PageLayoutContent
          // mod="content-flex" /* для заглушек */
          mod={"aside-mob-top"}
          child={
            <>
              {/*<Stub />*/}
              <ReferralsSection />
            </>
          }
          aside={
            <AsideInfoBlock
              title={"Referral program"}
              txt={
                "linki's referral program allows users to share their unique referral link with a friend who has not yet joined the platform. <b>We give 10% of the budget of the first completed project</b>"
              }
              img={"assets/referrals.png"}
            />
          }
        />
        <ReactTooltip id={"global-tooltip"} className={"custom-tooltip-theme2"} effect={"solid"} place={"bottom"} />
      </PageLayoutWrapper>
    </>
  )
}

export default Referrals

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
