import DirectCatsAdd from "components/DirectCatsAdd/DirectCatsAdd"
import PortfolioInfoLink from "components/PortfolioInfoLink/PortfolioInfoLink"
import RoleSkillsAdd from "components/RoleSkillsAdd/RoleSkillsAdd"
import TagItem from "components/ui/TagItem/TagItem"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import Checkbox from "components/ui/Checkbox/Checkbox"
import InputGroup from "components/ui/InputGroup/InputGroup"
import SelectBlock from "components/ui/SelectBlock/SelectBlock"
import SelectDropBlock from "components/ui/SelectDropBlock/SelectDropBlock"
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react"
import { useGetLanguagesQuery, useGetTimezonesQuery } from "redux/api/content"
import styles from "./ProfileInfoAdditional.module.scss"
import { USER_TYPE_CUSTOMER, USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"
import IconInfo from "public/assets/svg/info-circle.svg"
import ReactTooltip from "react-tooltip"
import RichText from "components/RichText/RichText"
import { useRouter } from "next/router"

interface Props {
  formik: any
  userType: number
  addPortfolioLinkFn: () => void
  handleAddLink: (string) => void
  linksInfoList: {
    id: number
    name: string
    title: string
    inputTitle: string
    subtitle?: string
    image_url: string
    url: string
    description: string
  }[]
  setLinksInfoList: Dispatch<
    SetStateAction<
      {
        id: number
        name: string
        title: string
        inputTitle: string
        subtitle?: string
        image_url: string
        url: string
        description: string
      }[]
    >
  >
  btnAddLinkDisabled?: boolean
}

const ProfileInfoAdditional: React.FC<Props> = ({ formik, userType, addPortfolioLinkFn, btnAddLinkDisabled }) => {
  const router = useRouter()
  const { data: lenguagesAll } = useGetLanguagesQuery()
  const { data: timezonAll } = useGetTimezonesQuery()
  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const timeZoneArr = timezonAll?.map((zone) => ({
    label: zone.name,
    id: zone.id,
    value: zone.code,
  }))

  const onSelectDellItem = (id, field) => {
    if (field === "languages")
      formik.setFieldValue(
        "languages",
        formik.values.languages.filter((el) => el.id !== id)
      )
  }

  const languagesListBlock = useMemo(() => {
    if (!lenguagesAll?.length) return null
    const li = lenguagesAll.map((lang) => {
      return (
        <li key={lang.id} className={`${styles["ul__li--inner"]}`}>
          <Checkbox
            name={lang.name}
            text={lang.name}
            value={lang.id}
            key={lang.id}
            checked={formik.values.languages.filter((i) => i.id === lang.id).length > 0}
            onChange={(e) => {
              if (e.target.checked) {
                formik.setFieldValue("languages", [...formik.values.languages, lang])
              } else {
                formik.setFieldValue(
                  "languages",
                  formik.values.languages.filter((i) => i.id !== lang.id)
                )
              }
            }}
          />
        </li>
      )
    })

    return <ul className={`${styles["ul"]} `}>{li}</ul>
  }, [lenguagesAll, formik.values.languages])

  return (
    <div className={`${styles.profileAddit}`}>
      <div className={`${styles.profileAddit__box}`}>
        <div className={`${styles["profileInfo__form-label"]} ${styles.profileAddit__title}`}>Details</div>
        <div className={`${styles["task-form__multiselect-wrp"]}`}>
          <span className={`${styles.profileAddit__subtitle}`}>Write a little about yourself</span>
          <RichText
            addClass={styles["profileAddit__rich"]}
            setDescriptionValue={(val) => {
              formik.setFieldValue("position", val)
            }}
            initText={formik.values.position}
            error={formik.errors && formik.touched.position && formik.errors.position}
            noAutofocus={![router.query?.area].includes("detailsedit")}
            editId={"detailsedit"}
          />
        </div>
      </div>
      {/*TODO: Подчистить добавление ссылки на телеграм чат*/}
      {/*{linksInfoList.map((linkItem) => {*/}
      {/*  return (*/}
      {/*    <div key={linkItem.id} className={`${styles.profileAddit__box}`}>*/}
      {/*<div className={`${styles["profileInfo__form-label"]} ${styles.profileAddit__title}`}>*/}
      {/*  {linkItem.inputTitle}*/}
      {/*</div>*/}
      {/*{linkItem.subtitle && (*/}
      {/*  <span className={`${styles.profileAddit__subtitle}`}>*/}
      {/*    {linkItem.subtitle}{" "}*/}
      {/*    {linkItem.name === "telegram_link" && (*/}
      {/*      <span*/}
      {/*        className={styles.profileAddit__tooltip}*/}
      {/*        data-for="global-tooltip-html"*/}
      {/*        data-tip={*/}
      {/*          "<a href='https://telegram.org/faq#q-what-are-usernames-how-do-i-get-one' target='_blank'>How to do it?</a>"*/}
      {/*        }*/}
      {/*      >*/}
      {/*        <IconInfo />*/}
      {/*      </span>*/}
      {/*    )}*/}
      {/*  </span>*/}
      {/*)}*/}
      {/*<div className={`${styles["task-form__multiselect-wrp"]} ${styles.profileAddit__portfolio}`}>*/}
      {/*<InputGroup*/}
      {/*  placeholder={"@"}*/}
      {/*  type={"text"}*/}
      {/*  fieldProps={formik.getFieldProps(linkItem.name)}*/}
      {/*  addClass={styles["profileAddit__input"]}*/}
      {/*  smClass*/}
      {/*  error={*/}
      {/*    formik.touched[linkItem.name] && formik.errors && formik.errors[linkItem.name]*/}
      {/*      ? formik.errors[linkItem.name]*/}
      {/*      : ""*/}
      {/*  }*/}
      {/*/>*/}
      {/*<DefaultBtn*/}
      {/*  type={"button"}*/}
      {/*  txt={"Add"}*/}
      {/*  onClick={() => {*/}
      {/*    handleAddLink(linkItem.name)*/}
      {/*  }}*/}
      {/*  disabled={!formik.values[linkItem.name]}*/}
      {/*/>*/}
      {/*</div>*/}
      {/*      <div className={`${styles["profileAddit__portfolio-wrp"]}`}>*/}
      {/*        {linkItem.description && (*/}
      {/*          <PortfolioInfoLink*/}
      {/*            img={linkItem.image_url ? linkItem.image_url : "generate"}*/}
      {/*            imgLetter={linkItem.url?.replace("https://t.me/", "")[0]}*/}
      {/*            url={linkItem.url}*/}
      {/*            site={linkItem.url}*/}
      {/*            text={linkItem.description}*/}
      {/*            id={linkItem.id}*/}
      {/*            onClose={() => {*/}
      {/*              formik.setFieldValue(linkItem.name, "")*/}
      {/*              setLinksInfoList((prevState) => {*/}
      {/*                return [...prevState].map((item) => {*/}
      {/*                  if (item.name !== linkItem.name) return item*/}
      {/*                  return {*/}
      {/*                    ...item,*/}
      {/*                    image_url: "",*/}
      {/*                    description: "",*/}
      {/*                    url: "",*/}
      {/*                    title: "",*/}
      {/*                  }*/}
      {/*                })*/}
      {/*              })*/}
      {/*            }}*/}
      {/*          />*/}
      {/*        )}*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  )*/}
      {/*})}*/}
      {userType === USER_TYPE_CUSTOMER && (
        <div className={`${styles.profileAddit__box}`}>
          <div className={`${styles["profileInfo__form-label"]} ${styles.profileAddit__title}`}>Company</div>
          <div className={`${styles.profileAddit__company}`}>
            <div className={`${styles["profileAddit__company-box"]}`}>
              <InputGroup
                editId="companyedit"
                placeholder={"Enter company name"}
                type={"text"}
                fieldProps={formik.getFieldProps("company")}
                addClass={styles["profileAddit__input"]}
                smClass
                error={formik.touched.company && formik.errors && formik.errors.company ? formik.errors.company : ""}
              />
            </div>
            <div className={`${styles["profileAddit__company-box"]}`}>
              <InputGroup
                placeholder={"Enter link to company"}
                type={"text"}
                fieldProps={formik.getFieldProps("companyLink")}
                addClass={styles["profileAddit__input"]}
                smClass
                error={
                  formik.touched.companyLink && formik.errors && formik.errors.companyLink
                    ? formik.errors.companyLink
                    : ""
                }
              />
            </div>
          </div>
        </div>
      )}
      {userType !== 1 && (
        <div className={`${styles.profileAddit__box}`}>
          <div className={`${styles["profileInfo__form-label"]} ${styles.profileAddit__title}`}>Portfolio</div>
          <div className={`${styles["task-form__multiselect-wrp"]} ${styles.profileAddit__portfolio}`}>
            <InputGroup
              placeholder={"Enter link to your portfolio"}
              type={"text"}
              fieldProps={formik.getFieldProps("portfolioLink")}
              addClass={styles["profileAddit__input"]}
              smClass
              error={formik.touched.portfolioLink && formik.errors && formik.errors.links ? formik.errors.links : ""}
              editId={"portfolioedit"}
            />
            <DefaultBtn
              type={"button"}
              txt={"Add link"}
              onClick={addPortfolioLinkFn}
              disabled={!formik.values.portfolioLink || btnAddLinkDisabled}
            />
          </div>
          <div className={`${styles["profileAddit__portfolio-wrp"]}`}>
            {formik.values.links.length > 0 &&
              formik.values.links.map((link) => {
                return (
                  <PortfolioInfoLink
                    key={link.id}
                    img={link.image_url ? link.image_url : "generate"}
                    url={link.url}
                    site={link.title}
                    text={link.description}
                    formik={formik}
                    id={link.id}
                  />
                )
              })}
          </div>
        </div>
      )}
      {userType === USER_TYPE_EXPERT && (
        <div className={`${styles.profileAddit__box}`}>
          <div className={`${styles["profileInfo__form-label"]} ${styles.profileAddit__title}`}>Roles & Skills</div>
          <div className={`${styles["task-form__multiselect-wrp"]}`}>
            <span className={`${styles.profileAddit__subtitle}`}>
              Let project managers know what you do best (max 3)
            </span>
            <div className={`${styles.profileAddit__role}`}>
              <RoleSkillsAdd formik={formik} max={3} />
              {formik.errors && formik.errors.job_roles && !formik.values?.job_roles.length ? (
                <p className="field-block-error">{formik.errors.job_roles}</p>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {userType === USER_TYPE_PM && (
        <div className={`${styles.profileAddit__box}`}>
          <div className={`${styles["profileInfo__form-label"]} ${styles.profileAddit__title}`}>
            Directions & Categories
          </div>
          <div className={`${styles["task-form__multiselect-wrp"]}`}>
            <span className={`${styles.profileAddit__subtitle}`}>You can choose any category of your activity</span>
            <div className={`${styles.profileAddit__role}`}>
              <DirectCatsAdd formik={formik} max={1000} />
            </div>
          </div>
        </div>
      )}
      <div className={`${styles.profileAddit__box}`}>
        <div className={`${styles.profileAddit__bottom}`}>
          <div className={`${styles.profileAddit__lang}`}>
            <div className={`${styles["profileInfo__form-label"]} ${styles.profileAddit__title}`}>Languages</div>
            <SelectDropBlock
              editId={"langedit"}
              placeholder={"Choose Language"}
              addClass={`${styles["profileAddit__input"]} ${styles.lang}`}
              child={languagesListBlock}
            />
            {formik.errors && formik.touched.languages && formik.errors.languages && (
              <p className={"field-block-error"}>{formik.errors.languages}</p>
            )}
            <div className={`${styles["selected-items"]} ${styles["selected-items--lang"]}`}>
              {formik.values.languages &&
                formik.values.languages.map((item, i) => {
                  return (
                    <TagItem
                      addClass={`${styles["selected-items__item"]}`}
                      key={i}
                      txt={`${item.name}`}
                      // flag={item.code}
                      onClose={() => {
                        onSelectDellItem(item.id, "languages")
                      }}
                      id={`${item.id}`}
                    />
                  )
                })}
            </div>
          </div>
          <div className={`${styles.profileAddit__timezon}`}>
            <div className={`${styles["profileInfo__form-label"]} ${styles.profileAddit__title}`}>Timezone</div>
            <SelectBlock
              editId="timezoneedit"
              addClass={`${styles["profileAddit__input"]}`}
              value={
                formik?.values?.timezone ? timeZoneArr?.filter((el) => el.id === formik?.values?.timezone.id) : null
              }
              onChange={(el) => formik.setFieldValue("timezone", el)}
              options={timeZoneArr}
              size={"md"}
              placeholder={"Choose Timezone"}
              onBlur={() => {
                setTimeout(() => {
                  formik.setFieldTouched(`timezone`, true)
                }, 0)
              }}
            />
            {formik.errors && formik.touched.timezone && formik.errors.timezone && (
              <p className={"field-block-error"}>{formik.errors.timezone}</p>
            )}
          </div>
        </div>
        <div className={`${styles["selected-items"]} ${styles["selected-items--all"]}`}>
          {formik.values.languages &&
            formik.values.languages.map((item, i) => {
              return (
                <TagItem
                  addClass={`${styles["selected-items__item"]}`}
                  key={i}
                  txt={`${item.name}`}
                  // flag={item.code}
                  onClose={() => {
                    onSelectDellItem(item.id, "languages")
                  }}
                  id={`${item.id}`}
                />
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default ProfileInfoAdditional
