import type { NextPage } from "next"
import PageHead from "components/PageHead"
import Layout404 from "components/Layout404/Layout404"

const Page404: NextPage = () => {
  return (
    <div>
      <PageHead title={"Linki 404"} noIndex={true} />
      <Layout404 />
    </div>
  )
}

export default Page404
