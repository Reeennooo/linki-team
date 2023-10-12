import styles from "./AuthForm.module.scss"
import InputGroup from "components/ui/InputGroup/InputGroup"
import SocBtn from "components/ui/btns/SocBtn/SocBtn"
import Checkbox from "components/ui/Checkbox/Checkbox"
import Link from "next/link"
import { RegisterRequest } from "types/auth"
import BackErrors from "components/ui/BackErrors/BackErrors"
import { useRouter } from "next/router"
import { MANAGER_TEAM_CODE, REFERRAL_USER_CODE, REFERRAL_VACANCY_CODE, USER_TYPE_CUSTOMER } from "utils/constants"
import { paramsStringify } from "utils/queryStringUtils"

interface Props {
  formik?: any
  purpose?: "recovery" | "changepass" | "signup" | "signin"
  mod?: "main-page"
  disableSoc?: "facebook" | "google" | "linkedin"
}

const AuthForm: React.FC<Props> = ({ formik, mod, disableSoc, purpose }) => {
  const router = useRouter()
  const vacancyCode = router.query[REFERRAL_VACANCY_CODE] as string
  const userReferralCode = router.query[REFERRAL_USER_CODE] as string
  const managerTeamCode = router.query[MANAGER_TEAM_CODE] as string

  const classForSocBtn =
    purpose === "signup" ? `${styles["auth-form__soc-link-signup"]}` : `${styles["auth-form__soc-link-signin"]}`

  const renderFormFields = () => {
    switch (purpose) {
      case "recovery":
        return (
          <InputGroup
            placeholder={"Email"}
            type={"email"}
            fieldProps={formik.getFieldProps("email")}
            addClass={`${styles["auth-form__inp-group"]}`}
            error={formik.touched.email && formik.errors && formik.errors.email ? formik.errors.email : ""}
          />
        )
      case "changepass":
        return (
          <>
            <InputGroup
              placeholder={"New Password"}
              type={"password"}
              fieldProps={formik.getFieldProps("password_new")}
              addClass={`${styles["auth-form__inp-group"]}`}
              error={
                formik.touched.password_new && formik.errors && formik.errors.password_new
                  ? formik.errors.password_new
                  : ""
              }
            />
            <InputGroup
              placeholder={"Confirm Password"}
              type={"password"}
              fieldProps={formik.getFieldProps("password_confirm")}
              addClass={`${styles["auth-form__inp-group"]}`}
              error={
                formik.touched.password_confirm && formik.errors && formik.errors.password_confirm
                  ? formik.errors.password_confirm
                  : ""
              }
            />
          </>
        )
      case "signup":
      case "signin":
        const query = paramsStringify({
          role: formik.values.role,
          [REFERRAL_VACANCY_CODE]: vacancyCode,
          [REFERRAL_USER_CODE]: userReferralCode,
          [MANAGER_TEAM_CODE]: managerTeamCode,
        })
        return (
          <>
            <div
              className={
                purpose === "signup"
                  ? `${styles["auth-form__soc-link-signup-wrp"]}`
                  : `${styles["auth-form__soc-link-signin-wrp"]}`
              }
            >
              <SocBtn
                addClass={classForSocBtn}
                icon={"/assets/auth/google.svg"}
                txt={purpose === "signin" && "Continue with Google"}
                link={`/api/google?${query}`}
                disabled={disableSoc === "google"}
              />
              <SocBtn
                addClass={classForSocBtn}
                icon={"/assets/auth/facebook.svg"}
                txt={purpose === "signin" && "Continue with Facebook"}
                link={`/api/facebook?${query}`}
                disabled={disableSoc === "facebook"}
              />
              <SocBtn
                addClass={classForSocBtn}
                icon={"/assets/auth/linkedin.svg"}
                txt={purpose === "signin" && "Continue with LinkedIn"}
                link={`/api/linkedin?${query}`}
                disabled={disableSoc === "linkedin"}
              />
            </div>
            <div className={`${styles["auth-form__separator"]}`}>
              <span>OR</span>
            </div>
            {purpose === "signup" && (
              <InputGroup
                placeholder={"Name"}
                type={"text"}
                fieldProps={formik.getFieldProps("name")}
                addClass={`${styles["auth-form__inp-group"]}`}
                error={formik.touched.name && formik.errors && formik.errors.name ? formik.errors.name : ""}
              />
            )}
            <InputGroup
              placeholder={"Email"}
              type={"email"}
              fieldProps={formik.getFieldProps("email")}
              addClass={`${styles["auth-form__inp-group"]}`}
              error={formik.touched.email && formik.errors && formik.errors.email ? formik.errors.email : ""}
            />
            <InputGroup
              placeholder={"Password"}
              type={"password"}
              fieldProps={formik.getFieldProps("password")}
              addClass={`${styles["auth-form__inp-group"]}`}
              error={formik.touched.password && formik.errors && formik.errors.password ? formik.errors.password : ""}
            />
            {purpose !== "signup" && (
              <div className={`${styles["auth-form__check-wrp"]}`}>
                <Checkbox
                  name={formik.getFieldProps("remember").name}
                  value={formik.values.remember}
                  checked={!!formik.values.remember}
                  text={"Remember me"}
                  onChange={() => {
                    formik.setFieldValue("remember", !formik.values.remember)
                  }}
                  error={false}
                />
                <Link href="/reset/password">
                  <a className={`${styles["auth-form__remember"]}`}>Forgot password?</a>
                </Link>
              </div>
            )}
          </>
        )

      default:
        break
    }
  }

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className={[
          styles["auth-form"],
          purpose === "signin" && styles["auth-form--signin"],
          purpose === "changepass" && styles["auth-form--changepass"],
          mod && styles["auth-form--" + mod],
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={`${styles["auth-form__mob-logo"]}`}>
          <img src="/img/header/logo-small.svg" alt="" />
        </div>
        <h4 className={`${styles["auth-form__title"]}`}>
          {purpose === "signup" && formik.values.role === USER_TYPE_CUSTOMER && "Bring your projects to life"}
          {purpose === "signup" && formik.values.role !== USER_TYPE_CUSTOMER && "Sign up to find\n work you love"}
          {purpose === "signin" && "Login to linki"}
          {purpose === "recovery" && "Forgot password?"}
          {purpose === "changepass" && "Change password"}
        </h4>

        {purpose === "recovery" && (
          <p className={`${styles["auth-form__subtitle"]}`}>
            Enter your email address below and we will send you a link where you can enter a new password.
          </p>
        )}
        {purpose === "changepass" && (
          <p className={`${styles["auth-form__subtitle"]}`}>
            Password must contain at least 1 letter, 1 number and 1 symbol. Minimum length is 8 characters
          </p>
        )}

        {renderFormFields()}

        <BackErrors />

        <div className={`${styles["auth-form__submit"]}`}>
          <button className={`${styles["auth-form__submit-btn"]} btn`} type="submit">
            {purpose === "signup" && "Create my account"}
            {purpose === "signin" && "Login account"}
            {purpose === "recovery" && "Submit"}
            {purpose === "changepass" && "Submit"}
          </button>
          {purpose === "recovery" && (
            <Link href={`/signin`}>
              <a className={`${styles["auth-form__back"]}`}>Back to sign in</a>
            </Link>
          )}
        </div>
      </form>
    </>
  )
}

export default AuthForm
