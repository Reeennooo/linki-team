import BackErrors from "components/ui/BackErrors/BackErrors"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import InputGroup from "components/ui/InputGroup/InputGroup"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import { useFormik } from "formik"
import { useAppDispatch, useAppSelector } from "hooks"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useChangePasswordMutation, useDeleteAccountMutation } from "redux/api/user"
import { selectAuth } from "redux/slices/auth"
import { addBackErrors, selectUIState } from "redux/slices/uiSlice"
import { PASS_REGEXP } from "utils/constants"
import styles from "./SecurityLayout.module.scss"
import ConfirmPrompt from "components/ui/ConfirmPrompt/ConfirmPrompt"

interface Props {
  addClass?: string
  props?: any
}

const SecurityLayout: React.FC<Props> = ({ ...props }) => {
  const [linksTabsData, setLinksTabsData] = useState([
    { id: 1, txt: "Profile", url: "/settings/profile" },
    // { id: 2, txt: "Payment", url: "/settings/payment" },
    { id: 3, txt: "Notifications", url: "/settings/notification" },
    { id: 4, txt: "Security", url: "/settings/security" },
  ])

  const [disableSubmitPass, setDisablesubmitPass] = useState(true)
  const [disableDellAcc, setDisableDellAcc] = useState(true)

  const router = useRouter()

  const { user } = useAppSelector(selectAuth)
  const dispatch = useAppDispatch()

  const [changePass] = useChangePasswordMutation()

  const [deleteAccount] = useDeleteAccountMutation()

  const [sendType, setSendType] = useState("")

  const formikPass = useFormik({
    initialValues: {
      password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    validate() {
      let errors = {}
      if (!formikPass.values.password) {
        errors = { ...errors, password: "Field is required" }
      }
      if (!formikPass.values.new_password) {
        errors = { ...errors, new_password: "Field is required" }
      }
      if (!PASS_REGEXP.test(formikPass.values.new_password)) {
        errors = {
          ...errors,
          new_password: "Password must be at least 8 characters long, contain at least 1 letter, 1 number and 1 symbol",
        }
      }
      if (formikPass.values.password === formikPass.values.new_password) {
        errors = { ...errors, new_password: "Password matches the old one" }
      }
      if (!formikPass.values.new_password_confirmation) {
        errors = { ...errors, new_password_confirmation: "Field is required" }
      }
      if (
        formikPass.values.new_password_confirmation &&
        formikPass.values.new_password_confirmation !== formikPass.values.new_password
      ) {
        errors = { ...errors, new_password_confirmation: "Passwords do not match" }
      }
      return errors
    },
    async onSubmit(values) {
      setDisablesubmitPass(true)
      setSendType("changepass")
      try {
        await changePass({
          password: values.password,
          new_password: values.new_password,
          new_password_confirmation: values.new_password_confirmation,
        })
          .unwrap()
          .then((res) => {
            if (res?.success) {
              //Clear errors from back to uistate
              dispatch(addBackErrors(null))
              setTimeout(() => {
                setDisablesubmitPass(false)
              }, 300)
            } else {
              setDisablesubmitPass(false)
              console.log("RES", res)

              dispatch(addBackErrors({ name: "incorrect current password" }))
            }
          })
      } catch (err) {
        //Add errors from back to uistate
        dispatch(addBackErrors({ name: "incorrect current password" }))
        setDisablesubmitPass(false)
        dispatch(addBackErrors(err.data.errors))
      }
    },
  })

  const formikDellAcc = useFormik({
    initialValues: {
      email: "",
      // password: "",
    },
    validate() {
      let errors = {}
      if (!formikDellAcc.values.email) {
        errors = { ...errors, email: "The email field is required" }
      } else if (
        formikDellAcc.values.email !== "" &&
        !/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(
          formikDellAcc.values.email
        )
      ) {
        errors = {
          ...errors,
          email: `Enter the correct registered mail`,
        }
      }
      // if (!formikDellAcc.values.password) {
      //   errors = { ...errors, password: "Field is required" }
      // }
      return errors
    },
    async onSubmit(values) {
      setSendType("delete")
      try {
        await deleteAccount(values)
          .unwrap()
          .then((res) => {
            if (res.success) {
              router.push("/signin")
              //Clear errors from back to uistate
              dispatch(addBackErrors(null))
            } else {
              dispatch(addBackErrors({ name: "incorrect email" }))
            }
            console.log("res", res)
          })
      } catch (err) {
        dispatch(addBackErrors({ name: "incorrect email" }))
      }
    },
  })

  useEffect(() => {
    if (!formikPass.values.new_password_confirmation) {
      setDisablesubmitPass(true)
    } else {
      setDisablesubmitPass(false)
    }
    dispatch(addBackErrors(null))
  }, [formikPass.values])

  return (
    <>
      <TabsLinear list={linksTabsData} activeId={4} onClick={(id) => null} isLinks />
      <div className={styles.security}>
        <div className={styles.security__box}>
          <div className={styles["profileInfo__form-label"]}>E-mail</div>
          <InputGroup
            placeholder={"E-mail"}
            type={"text"}
            fieldProps={{
              defaultValue: user.email,
              readOnly: true,
            }}
            smClass
            addClass={styles["profileInfo__form-input"]}
          />
        </div>
        <form onSubmit={formikPass.handleSubmit}>
          <div className={styles.security__box}>
            <div className={styles["profileInfo__form-label"]}>Change Password</div>
            <div className={styles["security__box-pass"]}>
              <InputGroup
                placeholder={"Current Password"}
                type={"password"}
                fieldProps={formikPass.getFieldProps("password")}
                smClass
                addClass={`${styles["profileInfo__form-input"]} ${styles["security__form-input"]}`}
                error={
                  formikPass.touched.password && formikPass.errors && formikPass.errors.password
                    ? formikPass.errors.password
                    : ""
                }
              />
              <InputGroup
                placeholder={"New Password"}
                type={"password"}
                fieldProps={formikPass.getFieldProps("new_password")}
                smClass
                addClass={`${styles["profileInfo__form-input"]} ${styles["security__form-input"]}`}
                error={
                  formikPass.touched.new_password && formikPass.errors && formikPass.errors.new_password
                    ? formikPass.errors.new_password
                    : ""
                }
              />
              <InputGroup
                placeholder={"Repeat new password"}
                type={"password"}
                fieldProps={formikPass.getFieldProps("new_password_confirmation")}
                smClass
                addClass={`${styles["profileInfo__form-input"]} ${styles["security__form-input"]}`}
                error={
                  formikPass.touched.new_password_confirmation &&
                  formikPass.errors &&
                  formikPass.errors.new_password_confirmation
                    ? formikPass.errors.new_password_confirmation
                    : ""
                }
              />
            </div>
            <DefaultBtn
              type={"submit"}
              txt={"Change password"}
              disabled={disableSubmitPass}
              addClass={styles.security__passBtn}
            />
            {sendType === "changepass" && <BackErrors />}
          </div>
        </form>

        <form onSubmit={formikDellAcc.handleSubmit}>
          <div className={styles.security__box}>
            <div className={styles["profileInfo__form-label"]}>Delete account</div>
            <div className={styles["security__box-pass"]}>
              <InputGroup
                placeholder={"Current E-mail"}
                type={"text"}
                fieldProps={formikDellAcc.getFieldProps("email")}
                smClass
                addClass={`${styles["profileInfo__form-input"]} ${styles["security__form-input-dell"]}`}
                error={
                  formikDellAcc.touched.email && formikDellAcc.errors && formikDellAcc.errors.email
                    ? formikDellAcc.errors.email
                    : ""
                }
              />
              {/* <InputGroup
                placeholder={"Current Password"}
                type={"password"}
                fieldProps={formikDellAcc.getFieldProps("password")}
                smClass
                addClass={`${styles["profileInfo__form-input"]} ${styles["security__form-input"]}`}
                error={
                  formikDellAcc.touched.password && formikDellAcc.errors && formikDellAcc.errors.password
                    ? formikDellAcc.errors.password
                    : ""
                }
              /> */}
              <ConfirmPrompt
                title={"Are you sure you want to delete this account? This action is irreversible"}
                mainBtnTxt={"Delete account"}
                mainBtnTxtMod={"warning"}
                className={styles.security__delBtn}
                disabled={
                  !!(
                    (formikDellAcc.touched.email && formikDellAcc.errors && formikDellAcc.errors.email) ||
                    !formikDellAcc.values.email
                  )
                }
                onClick={() => {
                  formikDellAcc.handleSubmit()
                }}
              />
            </div>
            {sendType === "delete" && <BackErrors />}
          </div>
        </form>
      </div>
    </>
  )
}

export default SecurityLayout
