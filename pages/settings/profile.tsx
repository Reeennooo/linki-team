import type { NextPage } from "next"
import PageHead from "components/PageHead"
import ProfileInfo from "components/ProfileInfo/ProfileInfo"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import SettingsProfile from "components/SettingsLayout/SettingsProfile"
import dynamic from "next/dynamic"
const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
})

const Profile: NextPage = () => {
  return (
    <>
      <PageHead
        title="Profile on the linki platform"
        description="Description of your profile - an important task for receiving more responses. Fill out your profile as well as possible so that other platform users understand who they are dealing with"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Settings" />
        <PageLayoutContent
          // page={"dashboard"}
          mod={"aside-mob-top"}
          child={
            <>
              <SettingsProfile addClass={"page-layout__welcome"} />
            </>
          }
          aside={
            <>
              <ProfileInfo addClass={"page-layout__profile-info"} profileSetting />
            </>
          }
        />
        <ReactTooltip id={"global-tooltip"} className={"custom-tooltip-theme2"} effect={"solid"} />
        <ReactTooltip
          id={"global-tooltip-html"}
          className={"custom-tooltip-theme2"}
          effect={"solid"}
          clickable={true}
          delayHide={300}
          html={true}
        />
      </PageLayoutWrapper>
    </>
  )
}

export default Profile

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
