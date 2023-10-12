import type { NextPage } from "next"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import Stub from "components/Stub/Stub"
import ExpertsSection from "components/ExpertsSection/ExpertsSection"
import Filter from "components/ui/Filter/Filter"
import { USER_TYPE_PM } from "utils/constants"

const Experts: NextPage = () => {
  return (
    <>
      <PageHead
        title="Check out the tariffs on the linki platform"
        description="Get more from the linki platform: enhance your opportunities, receive priority support and earn more with us"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Experts" />
        <PageLayoutContent
          // mod="content-flex" /* для заглушек */
          mod={"aside-mob-top"}
          child={
            <>
              {/*<Stub />*/}
              <ExpertsSection />
            </>
          }
        />
      </PageLayoutWrapper>
    </>
  )
}

export default Experts

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async (context, { user }) => {
    if (user.type !== USER_TYPE_PM || !user.premium_subscribe) {
      return {
        notFound: true,
      }
    }
    return {
      props: {},
    }
  })
)
