import type { NextPage } from "next"
import PageHead from "components/PageHead"
import ProfileInfo from "components/ProfileInfo/ProfileInfo"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import SecurityLayout from "components/SecurityLayout/SecurityLayout"

const Security: NextPage = () => {
  return (
    <>
      <PageHead
        title="Security settings on the linki platform"
        description="Configure your account security settings according to your needs. We make sure your privacy is always protected"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Settings" />
        <PageLayoutContent
          // page={"dashboard"}
          mod={"aside-mob-top"}
          child={
            <>
              <SecurityLayout addClass={"page-layout__welcome"} />
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

export default Security

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
