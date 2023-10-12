import type { NextPage } from "next"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import FavoriteInner from "components/FavoriteInner/FavoriteInner"
import AsideInfoBlock from "components/AsideInfoBlock/AsideInfoBlock"
import dynamic from "next/dynamic"
const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
})

const Favorite: NextPage = () => {
  return (
    <>
      <PageHead
        title="Your favorite specialists on the linki platform"
        description="Add specialists to your Favorites on the linki platform to be able to conact them at any moment or add to your projects"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Favorite" />
        <PageLayoutContent
          mod={"aside-mob-top"}
          child={
            <>
              <FavoriteInner />
            </>
          }
          aside={
            <>
              <AsideInfoBlock
                img={"/assets/referal-min.png"}
                title={"Referral program"}
                txt={
                  "linki's referral program allows users to share their unique referral link with a friend who has not yet joined the platform. <b>We give 10% of the budget of the first completed project</b>"
                }
                href={"/referrals"}
                btnTxt={"Share link"}
              />
            </>
          }
        />
        <ReactTooltip id={"global-tooltip"} className={"custom-tooltip-theme2"} effect={"solid"} place={"bottom"} />
      </PageLayoutWrapper>
    </>
  )
}

export default Favorite

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
