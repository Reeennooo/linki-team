import type { NextPage } from "next"
import PageHead from "components/PageHead"
import ProfileInfo from "components/ProfileInfo/ProfileInfo"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import PaymentLayout from "components/PaymentLayout/PaymentLayout"

const Payment: NextPage = () => {
  return (
    <>
      <PageHead
        title="Payment information settings"
        description="Payment information is the main for making payment and receiving mfundsoney for the work performed"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Settings" />
        <PageLayoutContent
          // page={"dashboard"}
          mod={"aside-mob-top"}
          child={
            <>
              <PaymentLayout addClass={"page-layout__welcome"} />
            </>
          }
          aside={
            <>
              <ProfileInfo addClass={"page-layout__profile-info"} profileSetting />
            </>
          }
        />
      </PageLayoutWrapper>
    </>
  )
}

export default Payment

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
