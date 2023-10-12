import styles from "./AuthLayout.module.scss"
import RoleSelection from "./RoleSelection/RoleSelection"
import AuthForm from "./AuthForm/AuthForm"
import { useFormik } from "formik"
import React, { useEffect, useState } from "react"
import {
  EMAIL_REGEXP,
  MANAGER_TEAM_CODE,
  PASS_REGEXP,
  REFERRAL_USER_CODE,
  REFERRAL_VACANCY_CODE,
  REFERRAL_WRONG_USER_MSG,
  USER_TYPE_CUSTOMER,
  USER_TYPE_EXPERT,
  USER_TYPE_PM,
} from "utils/constants"
import {
  useLoginMutation,
  useRegisterMutation,
  useResetPasswordConfirmMutation,
  useResetPasswordMutation,
} from "redux/api/auth"
import { useRouter } from "next/router"
import ResetPasswordConfirm from "components/AuthLayout/ResetPasswordConfirm/ResetPasswordConfirm"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "hooks"
import { addBackErrors, selectUIState, toggleWindowLoaded } from "redux/slices/uiSlice"
import useUnmount from "hooks/useUnmount"
import { LoginRequest, RegisterRequest } from "types/auth"
import AuthSlider from "components/AuthLayout/AuthSlider/AuthSlider"
import { setDatalayer } from "utils/setDatalayer"
import { getCookie, removeCookies } from "cookies-next"
// import ClientsSteps from "./ClientsSteps/ClientsSteps"

interface Props {
  purpose: "recovery" | "changepass" | "signup" | "signin"
}

const AuthLayout: React.FC<Props> = ({ purpose }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [signup] = useRegisterMutation()
  const [login] = useLoginMutation()
  const [resetPassword] = useResetPasswordMutation()
  const [resetPasswordConfirm] = useResetPasswordConfirmMutation()

  const [showForm, setShowForm] = useState(false)
  const [clientSteps, setClientSteps] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const { backErrors } = useAppSelector(selectUIState)

  const formik = useFormik({
    initialValues: {
      role: null,
      name: "",
      email: "",
      password: "",
      password_new: "",
      password_confirm: "",
      agree: true,
      ideaType: "",
      remember: false,
    },
    validate() {
      let errors = {}
      if (!formik.values.name && purpose === "signup") {
        errors = { ...errors, name: "Name is required" }
      }
      if (!formik.values.agree && purpose === "signup") {
        errors = { ...errors, agree: "The agree field is required" }
      }
      if (!PASS_REGEXP.test(formik.values.password) && purpose === "signup") {
        errors = {
          ...errors,
          password: "Password must be at least 8 characters long, contain at least 1 letter, 1 number and 1 symbol",
        }
      }

      if (purpose === "signup" || purpose === "signin" || purpose === "recovery") {
        if (!formik.values.email) {
          errors = { ...errors, email: "Email is required" }
        } else if (formik.values.email !== "" && !EMAIL_REGEXP.test(formik.values.email)) {
          errors = {
            ...errors,
            email: `The email must be a valid email address`,
          }
        }
      }
      if (purpose === "changepass") {
        if (!PASS_REGEXP.test(formik.values.password_new)) {
          errors = {
            ...errors,
            password_new:
              "Password must be at least 8 characters long, contain at least 1 letter, 1 number and 1 symbol",
          }
        }
        if (formik.values.password_confirm !== formik.values.password_new) {
          errors = { ...errors, password_confirm: "Enter new password again" }
        }
      }
      return errors
    },
    async onSubmit(values) {
      const vacancyCode = router.query[REFERRAL_VACANCY_CODE] as string
      const userReferralCode = router.query[REFERRAL_USER_CODE] as string
      const managerTeamCode = router.query[MANAGER_TEAM_CODE] as string
      switch (purpose) {
        case "signin":
          const signinData: LoginRequest = {
            email: values.email,
            password: values.password,
            remember: values.remember,
          }

          if (vacancyCode) {
            signinData.referal_code = vacancyCode
          }
          if (userReferralCode) signinData.register_code = userReferralCode
          if (managerTeamCode) signinData.manager_team_code = managerTeamCode
          try {
            await login(signinData)
              .unwrap()
              .then((res) => {
                //Clear errors from back to uistate
                dispatch(addBackErrors(null))
                const userType = res?.data?.type
                if (res?.data?.is_verified) {
                  setDatalayer({
                    event: "autoEvent",
                    eventCategory: "login",
                    eventAction: "login",
                    eventLabel: "Website", // (Google , Facebook , LinkedIn, Website)
                    login: {
                      email: res?.data?.email,
                      // 'phone' : ‘{phone_value}’,
                      role:
                        userType === USER_TYPE_CUSTOMER
                          ? "Client"
                          : userType === USER_TYPE_PM
                          ? "Project manager"
                          : userType === USER_TYPE_EXPERT
                          ? "Expert"
                          : "",
                    },
                  })
                }
                if (res.data.type === USER_TYPE_PM && res.data.is_confirmed !== 2) return router.push("/waitlist")
                if (res.message === REFERRAL_WRONG_USER_MSG) {
                  return router.push("/dashboard")
                }
                return router.push(res.data.is_verified ? "/dashboard" : "/auth/email-verification")
              })
          } catch (err) {
            console.log("err", err)
            //Add errors from back to uistate
            if (err.data?.data) {
              dispatch(addBackErrors(err.data.data))
            }
            if (err.data?.errors) {
              dispatch(addBackErrors(err.data.errors))
            }
          }
          break
        case "signup":
          const signupData: RegisterRequest = {
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.password,
            role: values.role,
            agree: values.agree,
          }

          if (vacancyCode) {
            signupData.referal_code = vacancyCode
          }
          if (userReferralCode) signupData.register_code = userReferralCode
          if (managerTeamCode) signupData.manager_team_code = managerTeamCode

          try {
            await signup(signupData)
              .unwrap()
              .then((res) => {
                //Clear errors from back to uistate
                dispatch(addBackErrors(null))
                setDatalayer({
                  event: "autoEvent",
                  eventCategory: "login",
                  eventAction: "unverified",
                  eventLabel: "Website",
                  login: {
                    email: signupData.email,
                    role:
                      signupData.role === USER_TYPE_CUSTOMER
                        ? "Client"
                        : signupData.role === USER_TYPE_PM
                        ? "Project manager"
                        : signupData.role === USER_TYPE_EXPERT
                        ? "Expert"
                        : "",
                  },
                })
                return router.push("/auth/email-verification")
              })
          } catch (err) {
            //Add errors from back to uistate
            dispatch(addBackErrors(err.data.errors))
          }
          break
        case "recovery":
          try {
            await resetPassword({ email: values.email })
              .unwrap()
              .then((res) => {
                setShowResetConfirm(true)
              })
          } catch (err) {
            dispatch(addBackErrors(err.data.errors))
          }
          break
        case "changepass":
          const { code } = router.query
          if (!code) return
          try {
            await resetPasswordConfirm({
              password: values.password_new,
              token: code as string,
            })
              .unwrap()
              .then((res) => {
                return router.push(res.data.is_verified ? "/dashboard" : "/auth/email-verification")
              })
          } catch (err) {
            if (err.data?.data) dispatch(addBackErrors(err.data.data))
            if (err.data?.errors) dispatch(addBackErrors(err.data.errors))
          }
          break
      }
    },
  })

  const registerFormPermission =
    showForm &&
    (formik.values.role === USER_TYPE_CUSTOMER ||
      formik.values.role === USER_TYPE_EXPERT ||
      formik.values.role === USER_TYPE_PM)
  const loginFormPermission = purpose === "signin"
  const recoveryFormPermission = purpose === "recovery"
  const changepassFormPermission = purpose === "changepass"

  useEffect(() => {
    if (backErrors) {
      //Clear errors from back to uistate
      dispatch(addBackErrors(null))
    }
  }, [formik.values])

  useUnmount(() => {
    //Clear errors from back to uistate
    dispatch(addBackErrors(null))
  })

  return (
    <>
      <div className={`${styles["auth-layout"]}`}>
        <div className={`${styles["auth-layout__img"]}`}>
          <AuthSlider />
        </div>
        <div className={`${styles["auth-layout__inner"]}`}>
          {purpose === "signup" && !showForm && !clientSteps && (
            <RoleSelection formik={formik} setShowForm={setShowForm} setClientSteps={setClientSteps} />
          )}

          {(registerFormPermission || loginFormPermission || recoveryFormPermission || changepassFormPermission) &&
            !showResetConfirm && <AuthForm purpose={purpose} formik={formik} />}

          {showResetConfirm && (
            <ResetPasswordConfirm onClick={async () => await resetPassword({ email: formik.values.email })} />
          )}

          {/* To Do шаги в регистрации оставляем на потом */}
          {/* {formik.values.role === "clients" &&
            clientSteps &&
            <ClientsSteps formik={formik} />
          } */}
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
    </>
  )
}

export default AuthLayout
