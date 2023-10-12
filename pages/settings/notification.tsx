import type { NextPage } from "next"
import PageHead from "components/PageHead"
import ProfileInfo from "components/ProfileInfo/ProfileInfo"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import NotificationLayout from "components/NotificationLayout/NotificationLayout"

const Notification: NextPage = () => {
  return (
    <>
      <PageHead
        title="Notifications settings on the linki platform"
        description="You can set up notifications receiving to your liking. The main thing is not to miss an important notification"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Settings" />
        <PageLayoutContent
          // page={"dashboard"}
          mod={"aside-mob-top"}
          child={
            <>
              <NotificationLayout addClass={"page-layout__welcome"} />
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

export default Notification

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
