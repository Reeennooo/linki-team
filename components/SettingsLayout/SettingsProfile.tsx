import ProfileInfoAdditional from "components/ProfileInfoAdditional/ProfileInfoAdditional"
import ProfileInfoBlock from "components/ProfileInfoBlock/ProfileInfoBlock"
import BackErrors from "components/ui/BackErrors/BackErrors"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import { Formik, useFormik } from "formik"
import { useAppDispatch, useAppSelector } from "hooks"
import useUnmount from "hooks/useUnmount"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { useLazyCheckTokenQuery } from "redux/api/auth"
import { useUpdateUserMutation } from "redux/api/user"
import { selectAuth } from "redux/slices/auth"
import { addBackErrors } from "redux/slices/uiSlice"
import { clearEmptiesFromObject } from "utils/clearEmptiesFromObject"
import { USER_TYPE_CUSTOMER, USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"
import { getLinksWithOG } from "utils/getLinksWithOG"
import { isArraysEqual } from "utils/isArraysEqual"
import { scrollToFn } from "utils/scrollTo"
import styles from "./SettingsProfile.module.scss"
import { addPopupNotification } from "utils/addPopupNotification"

interface Props {
  addClass?: string
  props?: any
}

const SettingsProfile: React.FC<Props> = ({ addClass, ...props }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(selectAuth)
  const [updateUser] = useUpdateUserMutation()
  const [chackToken] = useLazyCheckTokenQuery()

  const [formChanged, setFormChanged] = useState(false)

  const [btnAddLinkDisabled, setBtnAddLinkDisabled] = useState(true)
  const [btnSubmitDisabled, setBtnSubmitDisabled] = useState(true)

  const [linksTabsData, setLinksTabsData] = useState([
    { id: 1, txt: "Profile", url: "/settings/profile" },
    // { id: 2, txt: "Payment", url: "/settings/payment" },
    { id: 3, txt: "Notifications", url: "/settings/notification" },
    { id: 4, txt: "Security", url: "/settings/security" },
  ])
  const [linksInfoList, setLinksInfoList] = useState([
    {
      id: 1,
      name: "telegram_link",
      inputTitle: "Chat",
      subtitle: "Enter Telegram nickname to communicate with other users of the platform",
      title: "",
      image_url: "",
      url: "",
      description: "",
    },
  ])

  const formik = useFormik({
    initialValues: {
      firstName: user.name ?? "",
      lastName: user.surname ?? "",
      position: user.position ?? "",
      timezone: user.timezone ?? null,
      languages: user.languages ?? [],
      portfolioLink: "",
      links: user.links ?? [],
      job_roles: user.job_roles ?? [],
      avatar: user.avatar ?? "",
      avatarFile: null,
      project_direction: user.project_directions ?? [],
      project_categories: user.project_categories ?? [],
      company: user.company?.name ?? "",
      companyLink:
        user.company?.links?.length > 0 && user.company?.links[0].url?.length > 0 ? user.company?.links[0].url : "",
      telegram_link: user?.telegram_link
        ? "@" + user.telegram_link.split("/")[user.telegram_link.split("/").length - 1]
        : "",
      rating: user.rating ?? 0,
      hourly_rates: [],
    },
    validate() {
      let errors = {}
      if (!formik.values.firstName) {
        errors = { ...errors, firstName: "The First Name field is required" }
      }
      if (!formik.values.lastName) {
        errors = { ...errors, lastName: "The Last Name field is required" }
      }
      if (!formik.values.company && user.type === USER_TYPE_CUSTOMER) {
        errors = { ...errors, company: "The company field is required" }
      }
      if (!formik.values.companyLink && user.type === USER_TYPE_CUSTOMER) {
        errors = { ...errors, companyLink: "The company link field is required" }
      }
      if (!formik.values.timezone?.id) {
        errors = { ...errors, timezone: "The timezone field is required" }
      }
      // if (
      //   formik.values.links?.length < 1 &&
      //   (user.type === USER_TYPE_PM || user.type === USER_TYPE_EXPERT) &&
      //   btnAddLinkDisabled &&
      //   formik.values.portfolioLink.length === 0
      // ) {
      //   errors = { ...errors, links: "There must be at least one link" }
      // }
      if (formik.values.languages?.length < 1) {
        errors = { ...errors, languages: "At least one language must be selected" }
      }
      if (formik.values.project_categories?.length < 1 && user.type === USER_TYPE_PM) {
        errors = { ...errors, project_categories: "At least one category must be selected" }
      }
      if (formik.values.job_roles?.length < 1 && user.type === USER_TYPE_EXPERT) {
        errors = { ...errors, job_roles: "At least one job role must be selected" }
      }
      // if (formik.values.job_roles?.length >= 1 && user.type === USER_TYPE_EXPERT) {
      //   if (formik.values.job_roles[0].skills?.length < 1) {
      //     errors = { ...errors, skills: "At least one skill must be selected" }
      //   }
      // }

      return errors
    },
    async onSubmit(values) {
      // const tMeValues = linksInfoList?.filter((item) => item.name === "telegram_link")
      // const tMeUrl = tMeValues.length && tMeValues[0].description ? tMeValues[0].url : ""
      setBtnSubmitDisabled(true)
      initialformikValues.current = values
      const isValuesPositionEmpty = formik.values.position.length === 7
      switch (user.type) {
        case 1:
          try {
            await updateUser({
              name: values.firstName,
              surname: values.lastName,
              description: values.position,
              timezone_id: values.timezone.id,
              languages: values.languages.map((lang) => lang.id),
              company: {
                name: values.company,
                links: [
                  {
                    url: values.companyLink,
                  },
                ],
              },
              avatar: values.avatarFile,
            })
              .unwrap()
              .then((res) => {
                //Clear errors from back to uistate
                dispatch(addBackErrors(null))
                //обновляем данные о пользователе
                chackToken().then((resData) => {
                  // @ts-ignore
                  if (resData?.data?.data?.filled_percent === 100 && !isValuesPositionEmpty) {
                    addPopupNotification({
                      title: "Congratulations!",
                      txt: "Your profile is 100% complete",
                      icon: "check",
                      mod: "success",
                    })
                  }
                })
              })
          } catch (err) {
            //Add errors from back to uistate
            setBtnSubmitDisabled(false)
            dispatch(addBackErrors(err.data.errors))
          }
          break
        case 2:
          const skillsArr = []
          values.job_roles.forEach((el) => {
            el.skills.forEach((item) => skillsArr.push(item.id))
          })
          try {
            await updateUser({
              name: values.firstName,
              surname: values.lastName,
              description: values.position,
              timezone_id: values.timezone.id,
              languages: values.languages.map((lang) => lang.id),
              job_roles: values.job_roles?.length ? values.job_roles.map((el) => el) : [],
              skills: skillsArr,
              links: values.links?.length
                ? values.links.map((link) => {
                    return clearEmptiesFromObject({
                      url: link.url,
                      image_url: link.image_url ? link.image_url : "",
                      site_name: link.site_name ? link.site_name : "",
                      title: link.title ? link.title : "",
                      description: link.description ? link.description : "",
                    })
                  })
                : [],
              avatar: values.avatarFile,
            })
              .unwrap()
              .then((res) => {
                //Clear errors from back to uistate
                dispatch(addBackErrors(null))
                //обновляем данные о пользователе
                chackToken().then((resData) => {
                  // @ts-ignore
                  if (resData?.data?.data?.filled_percent === 100 && !isValuesPositionEmpty) {
                    addPopupNotification({
                      title: "Congratulations!",
                      txt: "Your profile is 100% complete",
                      icon: "check",
                      mod: "success",
                    })
                  }
                })
              })
          } catch (err) {
            //Add errors from back to uistate
            dispatch(addBackErrors(err.data.errors))
            setBtnSubmitDisabled(false)
          }
          break
        case 3:
          try {
            await updateUser({
              name: values.firstName,
              surname: values.lastName,
              description: values.position,
              timezone_id: values.timezone.id,
              languages: values.languages.map((lang) => lang.id),
              project_categories: values.project_categories.map((cat) => cat.id),
              links: values.links?.length
                ? values.links.map((link) => {
                    return clearEmptiesFromObject({
                      url: link.url,
                      image_url: link.image_url ? link.image_url : "",
                      site_name: link.site_name ? link.site_name : "",
                      title: link.title ? link.title : "",
                      description: link.description ? link.description : "",
                    })
                  })
                : [],
              avatar: values.avatarFile,
            })
              .unwrap()
              .then((res) => {
                //Clear errors from back to uistate
                dispatch(addBackErrors(null))
                //обновляем данные о пользователе
                chackToken().then((resData) => {
                  // @ts-ignore
                  if (resData?.data?.data?.filled_percent === 100 && !isValuesPositionEmpty) {
                    addPopupNotification({
                      title: "Congratulations!",
                      txt: "Your profile is 100% complete",
                      icon: "check",
                      mod: "success",
                    })
                  }
                })
              })
          } catch (err) {
            //Add errors from back to uistate
            dispatch(addBackErrors(err.data.errors))
            setBtnSubmitDisabled(false)
          }
          break
      }
    },
  })

  const initialformikValues = useRef(formik.values)

  const addPortfolioLinkFn = async () => {
    try {
      const url = new URL(formik.values.portfolioLink)
      if (url.protocol?.length > 3 && url.host?.length > 2) {
        setBtnAddLinkDisabled(true)
        const result = await getLinksWithOG(url.protocol + "//" + url.host)
        if (result?.length > 0) {
          if (result[0].site_name) {
            await formik.setFieldValue("links", [
              ...formik.values.links,
              { ...result[0], id: Math.random(), new: true, url: formik.values.portfolioLink },
            ])
          } else {
            await formik.setFieldValue("links", [
              ...formik.values.links,
              { ...result[0], id: Math.random(), new: true, url: formik.values.portfolioLink, title: url.host },
            ])
          }
        }
        await formik.setFieldValue("portfolioLink", "")
        setBtnAddLinkDisabled(false)
      }
    } catch (e) {
      await formik.setFieldValue("portfolioLink", "")
      return false
    }
  }

  const handleAddLink = async (name) => {
    try {
      const url = new URL(`https://t.me/` + `${formik.values[name]?.replace("@", "")}`)
      if (url.protocol?.length <= 3 && url.host?.length <= 2) return
      const result = await getLinksWithOG(url.href)
      if (result?.length > 0) {
        if (result[0].description && result[0].description !== "Fast. Secure. Powerful.") {
          const ogData = result[0]
          // setLinksInfoList((prevState) => {
          //   return [...prevState].map((item) => {
          //     if (item.name !== name) return item
          //     return {
          //       ...item,
          //       description: ogData.description,
          //       url: ogData.url,
          //       title: ogData.title,
          //     }
          //   })
          // })
        } else {
          formik.setFieldError(name, "Invalid nickname")
        }
      }
    } catch (e) {
      formik.setFieldError(name, "Invalid nickname")
    }
  }

  useEffect(() => {
    if (formik.values.position === "") {
      initialformikValues.current.position = "<p></p>"
    }
  }, [initialformikValues.current.position])

  useEffect(() => {
    if (formik.values.links?.length > 0) {
      formik.setFieldTouched("links", false)
    }
  }, [formik.values.links])

  useEffect(() => {
    if (formik.values.portfolioLink.length > 0) {
      setBtnAddLinkDisabled(false)
    } else {
      setBtnAddLinkDisabled(true)
    }
  }, [formik.values.portfolioLink])

  // useEffect(() => {
  //   if (!user?.telegram_link) return
  //   handleAddLink("telegram_link")
  // }, [user.telegram_link])

  useEffect(() => {
    if (router.query) {
      router.replace("/settings/profile", undefined, { shallow: true })
    }
  }, [formik.values])

  useEffect(() => {
    if (!router.query.area) return
    scrollToFn(router.query.area, true, 0)
    document.querySelectorAll(".is-attention").forEach((el) => el.classList.remove("is-attention"))
    document.getElementById(`${router.query.area}`)?.focus()
    setTimeout(() => {
      document.getElementById(`${router.query.area}`)?.classList.add("is-attention")
    }, 300)
  }, [router.query.area])

  useEffect(() => {
    if (formChanged && isArraysEqual(initialformikValues.current, formik.values)) setFormChanged(false)

    if (!formChanged && !isArraysEqual(initialformikValues.current, formik.values)) setFormChanged(true)

    if (formChanged && btnSubmitDisabled) setBtnSubmitDisabled(false)

    if ((!formChanged && !btnSubmitDisabled) || formik.values.portfolioLink.length > 0) setBtnSubmitDisabled(true)
  }, [formik.values, formChanged, btnSubmitDisabled])

  useUnmount(() => {
    //Clear errors from back to uistate
    dispatch(addBackErrors(null))
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <TabsLinear
        list={linksTabsData}
        activeId={1}
        onClick={(id) => {
          // console.log("id", id)
        }}
        isLinks
      />
      <ProfileInfoBlock userType={user.type} formik={formik} />
      <ProfileInfoAdditional
        formik={formik}
        userType={user.type}
        addPortfolioLinkFn={addPortfolioLinkFn}
        btnAddLinkDisabled={btnAddLinkDisabled}
        handleAddLink={handleAddLink}
        linksInfoList={linksInfoList}
        setLinksInfoList={setLinksInfoList}
      />
      <BackErrors />
      <DefaultBtn txt={"Save Changes"} type={"submit"} disabled={btnSubmitDisabled} addClass={styles.profile__submit} />
    </form>
  )
}

export default SettingsProfile
