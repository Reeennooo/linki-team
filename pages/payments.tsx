import type { NextPage } from "next"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import Stub from "components/Stub/Stub"

const Wallet: NextPage = () => {
  return (
    <>
      <PageHead
        title="Information about your payments and receipts on the linki service"
        description="Receive full information on all your payments: receipts, deposits, withdrawls from the platform, bonuses and rewards"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Wallet" />
        <PageLayoutContent
          mod="content-flex" /* для заглушек */
          child={
            <>
              <Stub />
            </>
          }
        />
      </PageLayoutWrapper>
    </>
  )
}

export default Wallet

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
