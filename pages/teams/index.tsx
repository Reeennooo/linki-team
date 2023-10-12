import type { NextPage } from "next"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import TeamsGreeting from "components/TeamsGreeting/TeamsGreeting"

const Teams: NextPage = () => {
  return (
    <>
      <PageHead title="Teams" description="Teams" noIndex={true} />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Teams" />
        <PageLayoutContent child={<TeamsGreeting />} />
      </PageLayoutWrapper>
    </>
  )
}

export default Teams

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
