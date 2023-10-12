import PortfolioInfoLink from "components/PortfolioInfoLink/PortfolioInfoLink"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import InputGroup from "components/ui/InputGroup/InputGroup"
import { useEffect, useState } from "react"
import { getLinksWithOG } from "utils/getLinksWithOG"
import styles from "./TelegramLink.module.scss"
import IconInfo from "public/assets/svg/info-circle.svg"

interface Props {
  title: string
  subtitle?: string
  addClass?: string
  formik: any
  fieldName: string
  fieldToSendName: string
  type?: "group"
  update: number
}

const TelegramLink: React.FC<Props> = ({
  addClass,
  formik,
  title,
  subtitle,
  fieldName,
  type,
  fieldToSendName,
  update,
}) => {
  const [tgState, setTgState] = useState({
    description: "",
    url: "",
    title: "",
    image_url: "",
    site_name: "",
  })

  const clearTgState = () => {
    setTgState({
      description: "",
      url: "",
      title: "",
      image_url: "",
      site_name: "",
    })
    if (type === "group") {
      formik.setFieldValue(fieldToSendName, "")
    }
  }

  const handleAddLink = async (name) => {
    try {
      const fieldValue =
        type === "group"
          ? formik.values.telegram_link
            ? `joinchat/${formik.values.telegram_link?.split("/").pop().replace("+", "")}`
            : ""
          : formik.values.telegram_link?.replace("@", "")
      const url = new URL(`https://t.me/` + `${fieldValue}`)
      if (url.protocol?.length <= 3 && url.host?.length <= 2) return
      const result = await getLinksWithOG(url.href)
      if (result?.length > 0) {
        if (
          (result[0].description && result[0].description !== "Fast. Secure. Powerful.") ||
          (type === "group" &&
            result[0].title.indexOf("Telegram:") !== 0 &&
            result[0].title.indexOf("Telegram – a new era of messaging") !== 0 &&
            result[0].image_url.indexOf("https://telegram.org/img/t_logo.png") !== 0)
        ) {
          const ogData = result[0]
          formik.setFieldValue(fieldToSendName, ogData.url)
          setTgState({
            description: ogData.description,
            url: ogData.url,
            title: ogData.title,
            image_url: type === "group" ? ogData.image_url : null,
            site_name: "",
          })
        } else {
          clearTgState()
          setTimeout(() => {
            if (type === "group") {
              if (formik.values.telegram_link?.length > 1) {
                formik.setFieldError(name, "Invalid group name")
              }
            } else {
              formik.setFieldError(name, "Invalid nickname")
            }
          }, 0)
        }
      }
    } catch (e) {
      formik.setFieldValue(fieldToSendName, "")
      formik.setFieldError(name, "Invalid nickname")
    }
  }

  useEffect(() => {
    if (!fieldName) return
    handleAddLink(fieldName)
  }, [fieldName, update])

  return (
    <>
      <div className={addClass ? addClass : ""}>
        <div className={`def-form__title`}>{title}</div>
        {subtitle && (
          <span className={`def-form__subtitle`}>
            {subtitle}{" "}
            {fieldName === "telegram_link" && (
              <span
                className={"def-form__subtitle-tooltip"}
                data-for="global-tooltip-html"
                data-tip={
                  "<a href='https://telegram.org/faq#q-what-are-usernames-how-do-i-get-one' target='_blank'>How to do it?</a>"
                }
              >
                <IconInfo />
              </span>
            )}
          </span>
        )}
        <div className={`def-form__input-wrp ${styles["tg-link__input-wrp"]}`}>
          <InputGroup
            placeholder={"Group link"}
            type={"text"}
            fieldProps={formik.getFieldProps(fieldName)}
            addClass={styles["tg-link__input"]}
            smClass
            error={
              formik.touched[fieldName] && formik.errors && formik.errors[fieldName] ? formik.errors[fieldName] : ""
            }
          />
          <DefaultBtn
            type={"button"}
            txt={"Add"}
            onClick={() => {
              handleAddLink(fieldName)
            }}
            disabled={!formik.values[fieldName]}
          />
        </div>
        <div className={`${styles["settings-team__portfolio"]}`}>
          {(tgState.description ||
            (type === "group" &&
              tgState.title &&
              tgState.title.indexOf("Telegram:") !== 0 &&
              tgState.title.indexOf("Telegram – a new era of messaging") !== 0)) && (
            <PortfolioInfoLink
              id={1}
              img={tgState.image_url ? tgState.image_url : "generate"}
              imgLetter={tgState.url?.replace("https://t.me/", "")[0]}
              url={tgState.url}
              site={tgState.url}
              text={type === "group" ? tgState.title : tgState.description}
              onClose={() => {
                formik.setFieldValue(fieldName, "")
                clearTgState()
              }}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default TelegramLink
