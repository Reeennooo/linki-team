import type { NextPage } from "next"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import Stub from "components/Stub/Stub"
import AsideInfoBlock from "components/AsideInfoBlock/AsideInfoBlock"
import TariffsSection from "components/TariffsSection/TariffsSection"
import dynamic from "next/dynamic"
import { useAuth } from "hooks/useAuth"
import { USER_TYPE_PM } from "utils/constants"
import styles from "/components/TariffsSection/TariffsSection.module.scss"
const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
})

const Tariffs: NextPage = () => {
  const { user } = useAuth()

  return (
    <>
      <PageHead
        title="Check out the tariffs on the linki platform"
        description="Get more from the linki platform: enhance your opportunities, receive priority support and earn more with us"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Pricing" />
        {user?.type === USER_TYPE_PM ? (
          <div className={styles.tariffs__textblock}>
            <h2 className={styles.tariffs__title}>Choose your right plan</h2>
            <p className={styles.tariffs__subtitle}>
              {user.type === USER_TYPE_PM
                ? "Upgrade to Pro & Get more Advantages"
                : "Upgrade to Premium & Get more Advantages"}
            </p>
          </div>
        ) : (
          ""
        )}
        <PageLayoutContent
          mod={user?.type === USER_TYPE_PM ? null : "content-flex"} /* для заглушек */
          child={<>{user?.type === USER_TYPE_PM ? <TariffsSection /> : <Stub />}</>}
          aside={
            user?.type === USER_TYPE_PM ? (
              <AsideInfoBlock
                title={"Referral program"}
                txt={
                  "linki's referral program allows users to share their unique referral link with a friend who has not yet joined the platform. <b>We give 10% of the budget of the first completed project</b>"
                }
                img={"assets/referrals.png"}
                href={"/referrals"}
                btnTxt={"Share link"}
                bg={true}
              />
            ) : null
          }
          addClass="page-layout__other-padding"
        />
        <ReactTooltip id={"global-tooltip"} className={"custom-tooltip-theme2"} effect={"solid"} place={"bottom"} />
      </PageLayoutWrapper>
    </>
  )
}

export default Tariffs

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
