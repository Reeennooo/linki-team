import React, { useEffect } from "react"
import styles from "./RoleSelection.module.scss"
import ArrowLeft from "public/assets/svg/arrow-left.svg"
import { useState } from "react"
import { useRouter } from "next/router"
import { useSetRoleMutation } from "redux/api/auth"
import { getCookie, removeCookies } from "cookies-next"
import {
  MANAGER_TEAM_CODE,
  REFERRAL_VACANCY_CODE,
  USER_ID_COOKIE,
  USER_TYPE_CUSTOMER,
  USER_TYPE_EXPERT,
  USER_TYPE_PM,
} from "utils/constants"

interface Props {
  formik?: any
  setShowForm?: any
  setClientSteps?: any
}

const RoleSelection: React.FC<Props> = ({ formik, setShowForm }) => {
  const router = useRouter()
  const [updateRole, resultUpdateRole] = useSetRoleMutation()
  const [agreeError, setAgreeError] = useState(false)

  const isReferralVacancy = Boolean(router.query[REFERRAL_VACANCY_CODE])
  const isManagerTeamCode = Boolean(router.query[MANAGER_TEAM_CODE])

  const [roleError, setRoleError] = useState(false)

  useEffect(() => {
    if (isReferralVacancy) {
      formik.setFieldValue("role", USER_TYPE_EXPERT)
    }
  }, [isReferralVacancy])

  useEffect(() => {
    if (isManagerTeamCode) {
      formik.setFieldValue("role", USER_TYPE_EXPERT)
    }
  }, [isManagerTeamCode])
  // const [radioWrappHeight, setRadioWrappHeight] = useState("0")
  // const radiosWrappRef = useRef(null)
  // const radiosRef = useRef(null)

  // function getHeight() {
  //   return radiosRef.current.clientHeight
  // }
  // useEffect(() => {
  //   if (formik.values.role === USER_TYPE_EXPERT || formik.values.role === USER_TYPE_PM) {
  //     setRadioWrappHeight(getHeight())
  //   } else {
  //     formik.setFieldValue("expertType", "")
  //     setRadioWrappHeight("0")
  //   }
  // }, [formik.values.role])

  const setRoleFn = async () => {
    setAgreeError(true)
    if (!router.query.mt_code && !router.query.ref_code && !router.query.rv_code) {
      formik.values.role === 1
        ? router.replace(`${router.pathname}/?type=client`, undefined, { shallow: true })
        : formik.values.role === 2
        ? router.replace(`${router.pathname}/?type=expert`, undefined, { shallow: true })
        : formik.values.role === 3
        ? router.replace(`${router.pathname}/?type=pm`, undefined, { shallow: true })
        : ""
    }

    if (!formik.values.role) {
      setRoleError(true)
      return
    } else {
      setRoleError(false)
    }

    if (formik.values.role < 1 || formik.values.role > 3) return

    if (router.pathname === "/auth/role") {
      const userID = Number(getCookie(USER_ID_COOKIE))
      try {
        const { data, success } = await updateRole({ id: userID, role: formik.values.role }).unwrap()
        await router.push(success && data.api_token ? "/dashboard" : "/signin")
      } catch (err) {
        await router.push("/signin")
      } finally {
        removeCookies(USER_ID_COOKIE, { sameSite: "lax" })
      }
      return
    }

    setShowForm(true)
  }

  useEffect(() => {
    if (!formik.values.role) return
    setRoleFn()
  }, [formik.values.role])

  return (
    <>
      <div className={`${styles["role-selection"]}`}>
        <h2 className={`${styles["role-selection__title"]}`}>Join Us!</h2>
        <p className={`${styles["role-selection__subtitle"]}`}>To get started, choose your role on the platform</p>
        <div className={`${styles["role-selectors"]}`}>
          {!isReferralVacancy && !isManagerTeamCode && (
            <>
              <div
                className={`${styles["role-selectors__role"]} ${
                  formik.values.role === USER_TYPE_CUSTOMER ? styles["is-active"] : ""
                }
                ${roleError ? styles["is-error"] : ""}
                `}
                onClick={() => {
                  formik.setFieldValue("role", USER_TYPE_CUSTOMER)
                  setRoleError(false)
                }}
              >
                <div className={`${styles["role-selectors__role-img"]}`}>
                  <img src="/img/AuthLayout/clients.svg" alt="avatar1" width={54} />
                </div>
                <div className={`${styles["role-selectors__role-txt"]}`}>
                  <p className={`${styles["role-selectors__role-title"]}`}>Client</p>
                  <p className={`${styles["role-selectors__role-descr"]}`}>
                    You can quickly find a team or specialist to perform your tasks
                  </p>
                </div>
                <div className={`${styles["role-selectors__role-icon"]}`}>
                  <ArrowLeft className="svg-arrow-left" width={60} />
                </div>
              </div>

              <div
                className={`${styles["role-selectors__role"]} ${
                  formik.values.role === USER_TYPE_PM ? styles["is-active"] : ""
                }
                ${roleError ? styles["is-error"] : ""}
                `}
                onClick={() => {
                  formik.setFieldValue("role", USER_TYPE_PM)
                  setRoleError(false)
                }}
              >
                <div className={`${styles["role-selectors__role-img"]}`}>
                  <img src="/img/AuthLayout/managers2.svg" alt="avatar1" width={54} />
                </div>
                <div className={`${styles["role-selectors__role-txt"]}`}>
                  <p className={`${styles["role-selectors__role-title"]}`}>Team</p>
                  <p className={`${styles["role-selectors__role-descr"]}`}>
                    You can find big interesting projects that require a teamwork of several specialists
                  </p>
                </div>
                <div className={`${styles["role-selectors__role-icon"]}`}>
                  <ArrowLeft className="svg-arrow-left" width={60} />
                </div>
              </div>
            </>
          )}
          <div
            className={`${styles["role-selectors__role"]} ${
              formik.values.role === USER_TYPE_EXPERT ? styles["is-active"] : ""
            }
            ${roleError ? styles["is-error"] : ""}
            `}
            onClick={() => {
              formik.setFieldValue("role", USER_TYPE_EXPERT)
              setRoleError(false)
            }}
          >
            <div className={`${styles["role-selectors__role-img"]}`}>
              <img src="/img/AuthLayout/experts.svg" alt="avatar1" width={54} />
            </div>
            <div className={`${styles["role-selectors__role-txt"]}`}>
              <p className={`${styles["role-selectors__role-title"]}`}>Expert</p>
              <p className={`${styles["role-selectors__role-descr"]}`}>
                You can find tasks of different levels of complexity that can be performed alone
              </p>
            </div>
            <div className={`${styles["role-selectors__role-icon"]}`}>
              <ArrowLeft className="svg-arrow-left" width={60} />
            </div>
          </div>
          {/* <div
            ref={radiosWrappRef}
            style={{ height: radioWrappHeight }}
            className={`${styles["role-selectors__radio"]} ${
              formik.values.role === USER_TYPE_EXPERT || formik.values.role === USER_TYPE_PM ? styles["is-active"] : ""
            }`}
          >
            <div className="radio-row" ref={radiosRef}>
              <Radio
                name={"role"}
                value={2}
                checked={formik.values.role === USER_TYPE_EXPERT}
                text={"Experts"}
                onChange={(e) => formik.setFieldValue("role", Number(e.target.value))}
                inRow={true}
              />
              <Radio
                name={"role"}
                value={3}
                checked={formik.values.role === USER_TYPE_PM}
                text={"Project Managers"}
                onChange={(e) => formik.setFieldValue("role", Number(e.target.value))}
                inRow={true}
              />
            </div>
            <div
              data-tip={` <span class="custom-tooltip-theme__title">You can choose 2 roles in the project:</span>
              <p class="custom-tooltip-theme__p"><span class="pink">Experts</span> — choice of direction of activity.</p>
              <p class="custom-tooltip-theme__p"><span class="blue">Project Managers</span> — describe his buns</p>
              <p class="custom-tooltip-theme__p"><span class="red">Multispecialist</span> — you can work in several specializations, this can be done further in your account in the “roles” section</p>
              `}
              data-for="global-tooltip"
              className={`${styles["role-selectors__radio-tooltip"]}`}
            >
              <Tooltip className="tooltip" width={20} />
            </div>
          </div> */}

          <p className={styles["role-selectors__p"]}>
            By joining, you agree to{" "}
            <a href="https://www.craft.do/s/xn75VwZHhPM9Az" rel="noreferrer" target="_blank">
              {" "}
              Terms of Service
            </a>
            , as well as to receive occasional emails from us.
          </p>
          {/* <div className={`${styles["role-selectors__check-wrp"]}`}>
            <Checkbox
              name={formik.getFieldProps("agree").name}
              value={formik.values.agree}
              checked={!!formik.values.agree}
              policy={true}
              onChange={() => {
                setRoleError(false)
                formik.setFieldValue("agree", !formik.values.agree)
                setTimeout(() => {
                  formik.setFieldTouched("agree", true)
                }, 0)
              }}
              error={!!agreeError || roleError}
            />
          </div>
          <button
            className={`${styles["role-selection__create"]} 
            ${
              formik.values.role < 1 || formik.values.role > 3 || resultUpdateRole.isLoading || !formik.values.agree
                ? ""
                : ""
            }
            `}
            onClick={async () => {
              formik.values.role === 1
                ? router.replace(`${router.pathname}/?type=client`, undefined, { shallow: true })
                : formik.values.role === 2
                ? router.replace(`${router.pathname}/?type=expert`, undefined, { shallow: true })
                : formik.values.role === 3
                ? router.replace(`${router.pathname}/?type=pm`, undefined, { shallow: true })
                : ""

              if (!formik.values.role) {
                setRoleError(true)
                return
              } else {
                setRoleError(false)
              }

              if (formik.errors.agree) {
                setAgreeError(true)
                return false
              }
              if (formik.values.role < 1 || formik.values.role > 3) return

              if (router.pathname === "/auth/role") {
                const userID = Number(getCookie(USER_ID_COOKIE))
                try {
                  const { data, success } = await updateRole({ id: userID, role: formik.values.role }).unwrap()
                  await router.push(success && data.api_token ? "/dashboard" : "/signin")
                } catch (err) {
                  await router.push("/signin")
                } finally {
                  removeCookies(USER_ID_COOKIE, { sameSite: "lax" })
                }
                return
              }

              setShowForm(true)
            }}
          >
            {router.pathname === "/auth/role" ? "Select" : "Create Account"}
          </button> */}
        </div>
      </div>
    </>
  )
}

export default RoleSelection
