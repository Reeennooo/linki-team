import { useEmailVerifyMutation } from "redux/api/auth"
import { useRouter } from "next/router"
import styles from "../../../components/AuthLayout/AuthLayout.module.scss"
import { LoaderEllipsis } from "components/ui/Loaders/Loaders"
import { useEffect } from "react"
import { getCookie } from "cookies-next"
import { USER_TOKEN_COOKIE, USER_TYPE_PM } from "utils/constants"
import AuthSlider from "components/AuthLayout/AuthSlider/AuthSlider"

const EmailVerifyPage = ({ code }) => {
  const router = useRouter()
  const [verify] = useEmailVerifyMutation()

  useEffect(() => {
    verify({ code })
      .unwrap()
      .then((res) => {
        setTimeout(() => {
          router.push(res.data.type === USER_TYPE_PM && res.data.is_confirmed !== 2 ? "/waitlist" : "/dashboard")
        }, 500)
      })
      .catch(() => {
        const token = getCookie(USER_TOKEN_COOKIE)
        router.push(token ? "/auth/email-verification/" : "/signin")
      })
  }, [verify, code, router])

  return (
    <div className={`${styles["auth-layout"]}`}>
      <div className={`${styles["auth-layout__img"]}`}>
        <AuthSlider />
      </div>
      <div className={`${styles["auth-layout__inner"]}`}>
        <h2 style={{ textAlign: "center" }}>
          Verification <span style={{ color: "var(--blue)" }}>{code}</span>
        </h2>
        <LoaderEllipsis />
      </div>
    </div>
  )
}

export default EmailVerifyPage

export const getServerSideProps = ({ params }) => {
  return {
    props: {
      code: params.code,
    },
  }
}
