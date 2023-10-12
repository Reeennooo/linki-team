import { authApi, useResendEmailVerifyMutation } from "redux/api/auth"
import { useRouter } from "next/router"
import styles from "components/AuthLayout/AuthLayout.module.scss"
import RegisterConfirm from "components/AuthLayout/RegisterConfirm/RegisterConfirm"
import { useAuth } from "hooks/useAuth"
import { wrapper } from "redux/store"
import { getCookie, removeCookies } from "cookies-next"
import { USER_TOKEN_COOKIE, USER_TYPE_PM } from "utils/constants"
import Link from "next/link"
import AuthSlider from "components/AuthLayout/AuthSlider/AuthSlider"

const EmailVerifyPage = () => {
  const router = useRouter()
  const [resend] = useResendEmailVerifyMutation()
  const { user } = useAuth()
  return (
    <div className={`${styles["auth-layout"]}`}>
      <div className={`${styles["auth-layout__img"]}`}>
        <AuthSlider />
      </div>
      <div className={`${styles["auth-layout__inner"]}`}>
        <RegisterConfirm email={user.email} onClick={async () => await resend({ email: user.email })} />
        <div className={`${styles["auth-layout__mob-bottom"]}`}>
          <span>{router.pathname === "/signup" ? "Already registered?" : "Don’t have an account?"}&ensp;</span>
          <Link href={router.pathname === "/signup" ? "/signin" : "/signup"}>
            <a className={`${styles["auth-form__remember"]}`}>
              {router.pathname === "/signup" ? "Sign In" : "Sign Up"}
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EmailVerifyPage

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, res }) => {
  const token = getCookie(USER_TOKEN_COOKIE, { req, res })

  if (token) {
    const { data: userData } = await store.dispatch(authApi.endpoints.checkToken.initiate(token))
    if (!userData) {
      removeCookies(USER_TOKEN_COOKIE, { req, res, sameSite: "lax" })
      return {
        redirect: {
          destination: "/signin?error=authApi_me",
          permanent: false,
        },
      }
    }
    const isVerified = userData.data.is_verified
    const isConfirmed = userData.data.is_confirmed

    if (isVerified) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      }
    }
  } else {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
})
