import type { NextPage } from "next"
import Header from "components/header"
import AuthLayout from "components/AuthLayout/AuthLayout"
import PageHead from "components/PageHead"

const ChangePassPage: NextPage = () => {
  return (
    <div>
      <PageHead title={"Recovery password | Linki"} noIndex={true} />
      <Header wide={true} />
      <main>
        <AuthLayout purpose={"changepass"} />
      </main>
    </div>
  )
}

export default ChangePassPage
