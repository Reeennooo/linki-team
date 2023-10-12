import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import SocBtn from "components/ui/btns/SocBtn/SocBtn"
import InputGroup from "components/ui/InputGroup/InputGroup"
import InputSearch from "components/ui/InputSearch/InputSearch"
import IconPhone from "public/assets/svg/phone2.svg"
import IcolnArrowLeft from "public/assets/svg/arr-left-lg.svg"
import Link from "next/link"
import { useEffect, useState } from "react"
import styles from "./UserDataForm.module.scss"
import { useFormik } from "formik"
import { paramsStringify } from "utils/queryStringUtils"
import { useRouter } from "next/router"
import { useCreateLidMutation } from "redux/api/user"

interface Props {
  newmain?: boolean
  searchTitle?: string
}

const UserDataForm: React.FC<Props> = ({ newmain, searchTitle }) => {
  const router = useRouter()
  const step = Number(router.query.step)
  const [changePass] = useCreateLidMutation()
  const [lidId, setLidId] = useState(null)
  const [btnDisabled, setBtnDisabled] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: "",
      budget: "",
      phone: "",
    },
    validate(values) {
      let errors = {}
      const telValue = values.phone.replace(/[^A-Za-zА-Яа-я0-9]/g, "")
      if (!formik.values.phone) {
        errors = { ...errors, phone: "Field is required" }
      }

      if (!telValue || telValue.length <= 10) {
        errors = { ...errors, phone: "Wrong number" }
      }
      return errors
    },
    onSubmit(values) {
      if (values.name?.length < 1) {
        setActiveSlide(0)
        return
      }
      if (values.budget?.length < 1) {
        setActiveSlide(1)
        return
      }
      setBtnDisabled(true)
      try {
        changePass({
          name: values.name,
          sum: values.budget,
          phone: values.phone,
        })
          .unwrap()
          .then((res) => {
            setTimeout(() => {
              setBtnDisabled(false)
            }, 200)

            if (res.data) {
              setLidId(res.data)
              setActiveSlide((prev) => prev + 1)
            } else {
              setActiveSlide(0)
            }
          })
      } catch (e) {
        setTimeout(() => {
          setBtnDisabled(false)
        }, 200)
        setActiveSlide(0)
      }
    },
  })

  const buttonsArr = ["Up to $1 000", "$1 000 - 10 000", "$10 000 – 50 000", "Over $50 000"]

  const [activeSlide, setActiveSlide] = useState(null)

  useEffect(() => {
    if (step === 0 || step === 1 || step === 2 || step === 3) {
      setActiveSlide(step)
    } else {
      setActiveSlide(0)
    }
  }, [])

  function nextSlide(id) {
    if (activeSlide === 0 && formik.values.name?.length < 15) {
      formik.setFieldError("name", "Enter at least 15 characters")
      return false
    }

    const nextSlideId = id + 1
    if (nextSlideId >= 3) {
      return
    } else {
      setActiveSlide((prev) => prev + 1)
    }
  }

  const [regQuery, setRegQuery] = useState(null)

  useEffect(() => {
    const tempRegQuery = paramsStringify({
      role: 1,
      lid_id: lidId,
    })
    setRegQuery(tempRegQuery)
  }, [lidId])

  const progress = [0, 1, 2, 3]

  const onRegisterBtnClick = (e) => {
    if (!regQuery?.includes(String(lidId))) {
      e.preventDefault()
      setActiveSlide(0)
    }
  }

  const pathName = router.pathname

  useEffect(() => {
    router.replace(`${pathName === "/" ? "" : pathName}/?step=${activeSlide}`, undefined, { shallow: true })
  }, [activeSlide])

  return (
    <div className={`${styles["userdata"]} ${newmain ? styles["userdata_new"] : ""}`}>
      {activeSlide > 0 ? (
        <div
          className={styles["userdata__back"]}
          onClick={() => {
            if (activeSlide > 0) setActiveSlide((prev) => prev - 1)
          }}
        >
          <IcolnArrowLeft /> Back
        </div>
      ) : (
        ""
      )}
      {(activeSlide || activeSlide === 0) && (
        <form onSubmit={formik.handleSubmit}>
          <div className={styles["userdata__slide"]}>
            {activeSlide === 0 && (
              <div>
                <h3 className={` ${styles["userdata__title"]} `}>
                  {searchTitle ? searchTitle : "What will you create?"}
                </h3>
                <div>
                  <InputSearch
                    placeholder="Site, logotype, marketing"
                    value={formik.values.name}
                    onChange={(value) => formik.setFieldValue("name", value)}
                    addClass={`${styles["userdata__search"]}`}
                    error={formik.errors && formik.errors.name}
                    limit={52}
                  />
                  {formik.errors && formik.errors.name && (
                    <p className={styles["userdata__error"]}>{formik.errors.name}</p>
                  )}
                </div>
                <DefaultBtn
                  type="button"
                  txt={"Quick start"}
                  onClick={() => nextSlide(0)}
                  addClass={`${styles["userdata__btn"]}`}
                />
              </div>
            )}
            {activeSlide === 1 && (
              <div>
                <h3 className={` ${styles["userdata__title"]} `}>What is your budget?</h3>
                <div className={styles["userdata__btns-container"]}>
                  {buttonsArr.map((answer) => (
                    <DefaultBtn
                      txt={answer}
                      key={answer}
                      onClick={() => {
                        formik.setFieldValue("budget", answer)
                        nextSlide(1)
                      }}
                      addClass={styles["userdata__btn-answer"]}
                    />
                  ))}
                </div>
              </div>
            )}
            {activeSlide === 2 && (
              <div>
                <h3 className={` ${styles["userdata__title"]} `}>Enter your phone number</h3>
                <div>
                  <InputGroup
                    placeholder="Введите номер"
                    fieldProps={formik.getFieldProps("phone")}
                    type="tel"
                    error={formik.touched.phone && formik.errors && formik.errors.phone ? formik.errors.phone : ""}
                    icon={<IconPhone />}
                    addClass={`${styles["userdata__phone"]}`}
                  />
                </div>
                <DefaultBtn type="submit" txt={"Next"} disabled={btnDisabled} addClass={`${styles["userdata__btn"]}`} />
              </div>
            )}
            {activeSlide === 3 && (
              <div>
                <h3 className={` ${styles["userdata__title"]} ${styles["userdata__title_marginSmall"]} `}>
                  Register to track status
                </h3>
                <p className={styles["userdata__subtitle"]}>
                  Our manager will contact you to clarify
                  <br />
                  the details and select a team of performers
                </p>
                <div>
                  <div className={styles["userdata__soc-wp"]}>
                    <SocBtn
                      txt=""
                      link={`/api/google?${regQuery}`}
                      onClick={onRegisterBtnClick}
                      icon={"assets/auth/google.svg"}
                      addClass={`${styles["userdata__soc"]}`}
                    />
                    <SocBtn
                      txt=""
                      link={`/api/facebook?${regQuery}`}
                      onClick={onRegisterBtnClick}
                      icon={"assets/auth/facebook.svg"}
                      addClass={`${styles["userdata__soc"]}`}
                    />
                    <SocBtn
                      txt=""
                      link={`/api/linkedin?${regQuery}`}
                      onClick={onRegisterBtnClick}
                      icon={"assets/auth/linkedin.svg"}
                      addClass={`${styles["userdata__soc"]}`}
                    />
                  </div>
                  <p className={styles["userdata__agree"]}>
                    By joining, you agree to{" "}
                    <Link href="https://www.craft.do/s/xn75VwZHhPM9Az" target="_blank">
                      Terms of Service
                    </Link>
                    ,<br /> as well as to receive occasional emails from us.
                  </p>
                </div>
              </div>
            )}
            <div className={styles["userdata__progress"]}>
              <span className={` ${styles["userdata__counter"]}  ${activeSlide > 0 ? styles["active"] : ""} `}>
                {activeSlide}/{3}
              </span>
              {progress.map((el, index) =>
                index + 1 < progress.length ? (
                  <div
                    className={`${styles["userdata__progress-el"]} ${el + 1 <= activeSlide ? styles["active"] : ""}`}
                    key={el}
                  />
                ) : (
                  ""
                )
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default UserDataForm
