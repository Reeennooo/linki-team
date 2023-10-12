import { useFormik } from "formik"
import { EMAIL_REGEXP, USER_TYPE_CUSTOMER, USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"
import styles from "./SubscribeToGet.module.scss"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import AuthForm from "components/AuthLayout/AuthForm/AuthForm"
import { useAppDispatch } from "hooks"
import { addBackErrors } from "redux/slices/uiSlice"
import signup from "pages/signup"
import { useRouter } from "next/router"
import { useRegisterMutation } from "redux/api/auth"
import { RegisterRequest } from "types/auth"
import RoleSelection from "components/AuthLayout/RoleSelection/RoleSelection"

interface Props {
  addClass?: string
}

const SubscribeToGet: React.FC<Props> = ({ addClass }) => {
  const purpose = "signup"
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [clientSteps, setClientSteps] = useState(false)

  const [signup] = useRegisterMutation()

  const formik = useFormik({
    initialValues: {
      role: null,
      name: "",
      email: "",
      password: "",
      password_new: "",
      password_confirm: "",
      agree: false,
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
      if (formik.values.password.length < 5 && (purpose === "signup" || purpose === "signin")) {
        errors = { ...errors, password: "Password must be at least 6 characters long" }
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
      return errors
    },
    async onSubmit(values) {
      switch (purpose) {
        case "signup":
          const signupData: RegisterRequest = {
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.password,
            role: values.role,
            agree: values.agree,
          }

          try {
            await signup(signupData)
              .unwrap()
              .then(() => {
                //Clear errors from back to uistate
                dispatch(addBackErrors(null))
                return router.push("/auth/email-verification")
              })
          } catch (err) {
            //Add errors from back to uistate
            dispatch(addBackErrors(err.data.errors))
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

  const earthRef = useRef(null)

  useEffect(() => {
    const earth = earthRef.current

    gsap.fromTo(
      earth,
      { y: 20, scale: 0, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: earth,
        },
      }
    )
  }, [])

  return (
    <section id={"subscribe"} className={`${styles["subscribe-to-get"]} ${addClass ? addClass : ""}`}>
      <div className="container">
        <div className={`${styles["subscribe-inner"]}`}>
          <div className={`${styles["subscribe-inner__img"]}`} ref={earthRef}>
            <img src="/img/subscribe-to-get/x2earth.png" alt="" />
          </div>
          {purpose === "signup" && !showForm && !clientSteps && (
            <RoleSelection formik={formik} setShowForm={setShowForm} setClientSteps={setClientSteps} />
          )}

          {registerFormPermission && <AuthForm mod={"main-page"} purpose={purpose} formik={formik} />}
        </div>
      </div>
    </section>
  )
}

export default SubscribeToGet
