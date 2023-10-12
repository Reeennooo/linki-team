import PortfolioInfoLink from "components/PortfolioInfoLink/PortfolioInfoLink"
import ProfileInfoBlock from "components/ProfileInfoBlock/ProfileInfoBlock"
import RichText from "components/RichText/RichText"
import BackErrors from "components/ui/BackErrors/BackErrors"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import DropZone from "components/ui/DropZone/DropZone"
import InputGroup from "components/ui/InputGroup/InputGroup"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import { useFormik } from "formik"
import { useAppDispatch, useAppSelector } from "hooks"
import useUnmount from "hooks/useUnmount"
import React, { useEffect, useState } from "react"
import { selectAuth } from "redux/slices/auth"
import { addBackErrors } from "redux/slices/uiSlice"
import { clearEmptiesFromObject } from "utils/clearEmptiesFromObject"
import { getLinksWithOG } from "utils/getLinksWithOG"
import styles from "./SettingsTeam.module.scss"
import AddUserButton from "components/ui/btns/AddUserButton/AddUserButton"
import FavoritePerson from "components/FavoritePerson/FavoritePerson"
import ModalAddTeammate from "components/Modals/ModalAddTeammate/ModalAddTeammate"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import {
  useCreateTeamMutation,
  useDellExpertFromTeamMutation,
  useLazyGetPmTeamExecutorsQuery,
  useRevokeExclusiveToExpertMutation,
  useSuggestExclusiveToExpertMutation,
  useUpdateTeamMutation,
} from "redux/api/pmteam"
import DirectCatsAdd from "components/DirectCatsAdd/DirectCatsAdd"
import { resetCurrentTeam, seletCurrentTeam, updateCurrentTeam } from "redux/slices/currentTeam"
import { LinkWithOG } from "types/content"
import { useRouter } from "next/router"
import ReactTooltip from "react-tooltip"
import { useLazyCheckTokenQuery } from "redux/api/auth"
import { addPopupNotification } from "utils/addPopupNotification"

interface Props {
  initialAvatar?: string
  initialName?: string
  initialCover?: string
  initialDescription?: string
  initialTelegram?: string
  initLinks?: LinkWithOG[]
  initDirections?:
    | [
        {
          id: number
          name: string
        }
      ]
    | []
  initCategories?:
    | [
        {
          id: number
          name: string
          project_direction_id: number
        }
      ]
    | []
  teamToEditId?: number
  refCode?: string
}

const SettingsTeam: React.FC<Props> = ({
  initialAvatar,
  initialName,
  initialCover,
  initialDescription,
  initialTelegram,
  initLinks,
  initDirections,
  initCategories,
  teamToEditId,
  refCode,
}) => {
  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])
  const [activeId, setActiveId] = useState(1)

  const { user } = useAppSelector(selectAuth)
  const dispatch = useAppDispatch()

  const [chackToken] = useLazyCheckTokenQuery()

  //ЗАПРОСЫ НА СОЗДАНИЕ/ИЗМЕНЕНИИЕ/УДАЛЕНИЕ КОМАНДЫ/ИЗМЕНЕНИЕ СТАТУСА ЭКСПЕРТА
  const [createTeam, { isLoading: createLoading }] = useCreateTeamMutation()
  const [updateTeam, { isLoading: updateLoading }] = useUpdateTeamMutation()
  const [dellExpertFromTeam, { isLoading: dellExpLoading }] = useDellExpertFromTeamMutation()
  const [suggestStatus, { isLoading: suggestLoading }] = useSuggestExclusiveToExpertMutation()
  const [revokeStatus, { isLoading: revokeLoading }] = useRevokeExclusiveToExpertMutation()

  const [getPmTeamExecutors, { data: executorsList, isLoading: expertsLoading }] = useLazyGetPmTeamExecutorsQuery()

  const [linksTabsData, setLinksTabsData] = useState([
    { id: 1, txt: "Team Profile", count: 0 },
    { id: 2, txt: "Members", count: 0 },
  ])

  //айдишник команды
  const { currentTeamId, creatingTeamId, updateTeamMembers, resetForm } = useAppSelector(seletCurrentTeam)

  const { modalsList } = useAppSelector(selectModals)

  const [btnSubmitDisabled, setBtnSubmitDisabled] = useState(false)
  const [disabledAddLink, setDisabledAddLink] = useState(true)

  const [editMode, setEditMode] = useState(false)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      teamName: initialName ? initialName : "",
      description: initialDescription ? initialDescription : "",
      portfolioLink: "",
      links: initLinks ? initLinks : [],
      avatar: initialAvatar ? initialAvatar : "",
      avatarFile: null,
      teamImageFile: null,
      teamImageString: initialCover ? initialCover : "",
      project_categories: initCategories ? initCategories : [],
      project_direction: initDirections ? initDirections : [],
      telegram_link: initialTelegram ? initialTelegram : "",
      telegram_link_to_send: "",
      rating: user.rating ?? 0,
    },
    validate() {
      let errors = {}
      if (!formik.values.teamName) {
        errors = { ...errors, teamName: "The Last Name field is required" }
      }
      if (formik.values.project_categories?.length < 1) {
        errors = { ...errors, project_categories: "At least one category must be selected" }
      }
      return errors
    },
    async onSubmit(values) {
      if (createLoading || updateLoading) {
        return false
      }
      setBtnSubmitDisabled(true)
      if (currentTeamId && teamToEditId) {
        //Редактирование команды
        try {
          await updateTeam({
            data: {
              name: values.teamName,
              description: values.description,
              // telegram_link: values.telegram_link_to_send,
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
              project_categories: values.project_categories.map((cat) => cat.id),
              image: values.teamImageFile,
              avatar: values.avatarFile,
            },
            id: currentTeamId,
          })
            .unwrap()
            .then((res) => {
              addPopupNotification({
                title: "Team update",
                txt: "You have successfully updated the team",
              })
              if (res.id) {
                formik.resetForm()
              }
              setActiveId(2)
              setBtnSubmitDisabled(false)
              setTimeout(() => {
                dispatch(updateCurrentTeam({ field: "updateTeams", data: true }))
                chackToken()
              }, 300)
            })
        } catch (e) {
          setBtnSubmitDisabled(false)
        }
      } else {
        //Создание команды
        try {
          await createTeam({
            name: values.teamName,
            description: values.description,
            // telegram_link: values.telegram_link_to_send,
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
            project_categories: values.project_categories.map((cat) => cat.id),
            image: values.teamImageFile,
            avatar: values.avatarFile,
          })
            .unwrap()
            .then((res) => {
              addPopupNotification({
                title: "Congratulations",
                txt: "You have successfully create the team",
                mod: "success",
                icon: "check",
              })
              if (res.id) {
                formik.resetForm()
              }
              //Clear errors from back to uistate
              dispatch(addBackErrors(null))
              setTimeout(() => {
                if (res?.id) dispatch(updateCurrentTeam({ field: "currentTeamId", data: res.id }))
                if (res?.id) dispatch(updateCurrentTeam({ field: "creatingTeamId", data: res.id }))
                dispatch(updateCurrentTeam({ field: "updateTeams", data: true }))
                setBtnSubmitDisabled(false)
                chackToken()
              }, 300)
              setActiveId(2)
            })
        } catch (err) {
          //Add errors from back to uistate
          dispatch(addBackErrors(err.data.errors))
          setBtnSubmitDisabled(false)
        }
      }
    },
  })

  useEffect(() => {
    if (resetForm > 0) {
      formik.resetForm()
      setActiveId(1)
      dispatch(resetCurrentTeam("all"))
    }
  }, [resetForm])

  const router = useRouter()

  //Обновление специалистов
  useEffect(() => {
    if (!currentTeamId || (!router.query?.id && !creatingTeamId) || !updateTeamMembers) return
    try {
      getPmTeamExecutors(currentTeamId)
        .unwrap()
        .then((res) => {
          dispatch(updateCurrentTeam({ field: "updateTeamMembers", data: false }))
        })
    } catch (e) {
      console.log("ERR getPmTeamExecutors")
      dispatch(updateCurrentTeam({ field: "updateTeamMembers", data: false }))
    }
  }, [currentTeamId, updateTeamMembers])

  useEffect(() => {
    if (formik.values.links?.length > 0) {
      formik.setFieldTouched("links", false)
    }
  }, [formik.values.links])

  //ССЫЛКА НА ПОРТФОЛИО
  useEffect(() => {
    if (formik.values.portfolioLink.length > 0) {
      setDisabledAddLink(false)
    } else {
      setDisabledAddLink(true)
    }
  }, [formik.values.portfolioLink])

  useEffect(() => {
    if (executorsList?.length > 0) {
      dispatch(
        updateCurrentTeam({
          field: "expertsInTeam",
          data: executorsList.map((exp) => `${exp.avatar ? exp.avatar : ""}`),
        })
      )
    } else {
      setEditMode(false)
      dispatch(updateCurrentTeam({ field: "expertsInTeam", data: [] }))
    }
  }, [executorsList])

  const addPortfolioLinkFn = async () => {
    try {
      const url = new URL(formik.values.portfolioLink)
      if (url.protocol?.length > 3 && url.host?.length > 2) {
        setDisabledAddLink(true)
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
        setDisabledAddLink(false)
      }
    } catch (e) {
      await formik.setFieldValue("portfolioLink", "")
      return false
    }
  }

  useUnmount(() => {
    //Clear errors from back to uistate
    dispatch(addBackErrors(null))
  })

  //ЗАГРУЗКА КАВЕРА ДЛЯ КОМАНДЫ
  const onUploadFiles = (media) => {
    if (media?.length > 0) {
      const reader = new FileReader()
      reader.readAsDataURL(media[0])
      reader.onload = () => {
        formik.setFieldValue("teamImageString", reader.result)
      }
      formik.setFieldValue(`teamImageFile`, media[0])
    } else {
      formik.setFieldValue(`teamImageString`, null)
    }
  }

  //ДЛЯ УДАЛЕНИЯ КАТЕГОРИИ
  const onSelectDellItem = (id, field) => {
    formik.setFieldValue(
      field,
      formik.values.project_categories.filter((cat) => cat.id !== id)
    )
  }

  //ОТКРЫВАЕМ МОДАЛКУ ДОБАВЛЕНИЯ ТИМЕЙТА
  const openMoadlAddTeammate = () => {
    if (!modalsList.includes("modal-add-teammate")) {
      dispatch(openModal("modal-add-teammate"))
    }
  }

  //НАПОЛНЕНИЕ СОСТОЯНИЯ В РЕДАКС ДЛЯ КАРТОЧКИ В САЙДБАРЕ
  useEffect(() => {
    //Добавляем АвАТАРКУ команды в редакс
    if (formik.values.avatar) {
      dispatch(updateCurrentTeam({ field: "avatar", data: formik.values.avatar }))
    } else {
      dispatch(updateCurrentTeam({ field: "avatar", data: "" }))
    }
    //Добавляем ИМЯ команды в редакс
    if (formik.values.teamName) {
      dispatch(updateCurrentTeam({ field: "name", data: formik.values.teamName }))
    } else {
      dispatch(updateCurrentTeam({ field: "name", data: "" }))
    }
    //Добавляем КАВЕР команды в редакс
    if (formik.values.teamImageString?.length > 0) {
      dispatch(updateCurrentTeam({ field: "cover", data: formik.values.teamImageString }))
    } else {
      dispatch(updateCurrentTeam({ field: "cover", data: "" }))
    }
    //Добавляем КАТЕГОРИИ команды в редакс
    if (formik.values.project_direction?.length > 0) {
      dispatch(
        updateCurrentTeam({
          field: "project_categories",
          data: formik.values.project_direction.map((cat) => cat.name),
        })
      )
    } else {
      dispatch(updateCurrentTeam({ field: "project_categories", data: [] }))
    }
    //Добавляем ОПИСАНИЕ команды в редакс
    if (formik.values.description?.length > 0) {
      dispatch(updateCurrentTeam({ field: "description", data: formik.values.description }))
    } else {
      dispatch(updateCurrentTeam({ field: "description", data: "" }))
    }
  }, [formik.values])

  const dellPerson = (teamId, executorId) => {
    try {
      dellExpertFromTeam({ teamId: teamId, executorId: executorId })
        .unwrap()
        .then((res) => {
          dispatch(updateCurrentTeam({ field: "updateTeamMembers", data: true }))
        })
    } catch (e) {
      console.log("ERR DELL EXPERT FROM TERAM")
    }
  }

  useEffect(() => {
    if (window?.innerWidth > 767) {
      document.querySelector(".page-layout__content-wrp")?.scrollTo(0, 0)
    } else {
      window?.scrollTo(0, 0)
    }
    setEditMode(false)

    if (currentTeamId) {
      dispatch(updateCurrentTeam({ field: "updateTeamMembers", data: true }))
    }
  }, [activeId, currentTeamId])

  useEffect(() => {
    if (teamToEditId) {
      dispatch(updateCurrentTeam({ field: "updateTeamMembers", data: false }))
    }
  }, [teamToEditId])

  // ЗАДЕРЖКА ЧТО БЫ ДАТЬ ФОРМИКУ ОБНОВИТЬ СОСТОЯНИЕ ДЛЯ ТЕЛЕГРАМА
  const [updateTg, setUpdateTg] = useState(0)
  useEffect(() => {
    setUpdateTg((prev) => prev + 1)
  }, [initialTelegram])

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className={`${styles["settings-team"]} ${
          expertsLoading || dellExpLoading || createLoading || updateLoading ? styles["loading"] : ""
        }`}
      >
        <TabsLinear
          list={linksTabsData}
          activeId={activeId}
          onClick={(id) => {
            setActiveId(id)
          }}
        />
        {activeId === 1 && (
          <>
            <ProfileInfoBlock userType={user.type} formik={formik} forPage={"team"} />
            <div className={` ${styles["settings-team__box"]}`}>
              <p className={`${styles["settings-team__form-label"]} ${styles["settings-team__title"]}`}>Cover</p>
              <p className={`${styles["settings-team__subtitle"]} ${styles["settings-team__subtitle--short"]}`}>
                The cover should reflect the character of your team or your direction of activity. Insert your own image
                or choose from the suggested options
              </p>
              <div className={`${styles["settings-team__input-wrp"]}`}>
                <DropZone
                  onUpload={onUploadFiles}
                  acceptTypes={{ "image/*": [".png", ".gif", ".jpeg", ".jpg"] }}
                  tags={false}
                  multiple={false}
                  isPreview={true}
                  initialCover={initialCover}
                  description={"PNG and JPG files are available for uploading, recommended size 631x350"}
                  title={"Drop file here or"}
                  btnTxt={"Choose file"}
                />
              </div>
            </div>
            <div className={`${styles["settings-team__box"]}`}>
              <p className={`${styles["settings-team__form-label"]} ${styles["settings-team__title"]}`}>
                Directions & Categories
              </p>
              <p className={`${styles["settings-team__subtitle"]} ${styles["settings-team__subtitle--short"]}`}>
                You can choose any category of your activity
              </p>
              <DirectCatsAdd
                addClass={`${styles["settings-team__input-wrp"]}`}
                selectPlaceholderTxt={"Choose Directions & Categories"}
                formik={formik}
                max={1000}
              />
            </div>
            <div className={`${styles["settings-team__box"]}`}>
              <div className={`${styles["settings-team__form-label"]} ${styles["settings-team__title"]}`}>Details</div>
              <div className={`${styles["settings-team__multiselect-wrp"]}`}>
                <span className={`${styles["settings-team__subtitle"]}`}>
                  Tell us about your team - clients trust the completed team profiles more
                </span>
                <RichText
                  addClass={styles["settings-team__input-wrp"]}
                  setDescriptionValue={(val) => {
                    formik.setFieldValue("description", val)
                  }}
                  initText={formik.values.description}
                  error={!!formik.errors && !!formik.touched.description && !!formik.errors.description}
                  noAutofocus={true}
                />
              </div>
            </div>
            <div className={`${styles["settings-team__box"]}`}>
              <div className={`${styles["settings-team__form-label"]} ${styles["settings-team__title"]}`}>
                Portfolio
              </div>
              <p className={`${styles["settings-team__subtitle"]} `}>You can insert links to team cases</p>
              <div className={`${styles["settings-team__input-wrp"]} ${styles["settings-team__portfolio"]}`}>
                <InputGroup
                  placeholder={"Enter portfolio links"}
                  type={"text"}
                  fieldProps={formik.getFieldProps("portfolioLink")}
                  addClass={styles["settings-team__portfolio-input"]}
                  smClass
                  error={
                    formik.touched.portfolioLink && formik.errors && formik.errors.links ? `${formik.errors.links}` : ""
                  }
                  editId={"portfolioedit"}
                />
                <DefaultBtn
                  type={"button"}
                  txt={"Add link"}
                  onClick={addPortfolioLinkFn}
                  disabled={!formik.values.portfolioLink || disabledAddLink}
                />
              </div>
              <div className={`${styles["settings-team__input-wrp"]}`}>
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
            {/*<TelegramLink*/}
            {/*  addClass={`${styles["settings-team__box"]}`}*/}
            {/*  formik={formik}*/}
            {/*  title={"Team chat"}*/}
            {/*  subtitle={"Create a group in Telegram and provide a link to it for the team to communicate"}*/}
            {/*  fieldName={"telegram_link"}*/}
            {/*  fieldToSendName={"telegram_link_to_send"}*/}
            {/*  type={"group"}*/}
            {/*  update={updateTg}*/}
            {/*/>*/}
            <BackErrors />
            <div className={`${styles["settings-team__box"]}`}>
              <DefaultBtn
                txt={"Save Changes"}
                type={"submit"}
                disabled={
                  formik.values?.teamName?.length <= 0 ||
                  formik.values?.project_categories?.length <= 0 ||
                  formik.values?.description?.length <= 7 ||
                  formik.values?.teamImageString?.length <= 0 ||
                  formik.values?.avatar?.length <= 0 ||
                  !formik.values?.teamImageString?.length ||
                  btnSubmitDisabled ||
                  formik.errors.telegram_link?.length > 0
                }
                addClass={styles["settings-team__submit"]}
              />
            </div>
          </>
        )}

        {activeId === 2 && (
          <>
            <div className={`${styles["settings-team__experts-title-wrp"]}`}>
              <h2 className={`${styles["settings-team__experts-title"]}`}>
                {formik.values.teamName ? formik.values.teamName : "Add team members"}
              </h2>
              {executorsList?.length > 0 && currentTeamId && (
                <button
                  type="button"
                  className={`${styles["settings-team__experts-title-btn"]} ${editMode ? styles["is-edit"] : ""}`}
                  onClick={() => {
                    setEditMode(!editMode)
                  }}
                >
                  {editMode ? "Done" : "Edit Team"}
                </button>
              )}
            </div>

            <div>
              {executorsList?.length > 0 && currentTeamId
                ? executorsList.map((person) => {
                    return (
                      <FavoritePerson
                        openUser={true}
                        key={person.id}
                        addClass={`${styles["settings-team__experts-list-item"]}`}
                        data={person}
                        onCheckFunction={() => {
                          suggestStatus({ teamId: currentTeamId, executorId: person.id })
                            .unwrap()
                            .then((res) => {
                              setTimeout(() => {
                                dispatch(updateCurrentTeam({ field: "updateTeamMembers", data: true }))
                              }, 200)
                            })
                        }}
                        onUncheckFunction={() => {
                          revokeStatus({ teamId: currentTeamId, executorId: person.id })
                            .unwrap()
                            .then((res) => {
                              setTimeout(() => {
                                dispatch(updateCurrentTeam({ field: "updateTeamMembers", data: true }))
                              }, 200)
                            })
                        }}
                        editMode={editMode}
                        dellPerson={() => dellPerson(currentTeamId, person.id)}
                        isWaiting={person.status === -1}
                        personJob={person.job_roles?.length > 0 && person.job_roles[0].name}
                      />
                    )
                  })
                : null}
            </div>
            {!currentTeamId && !executorsList?.length && (
              <p className={`${styles["settings-team__subtitle"]} `}>Fill out the team profile to add members</p>
            )}
            <AddUserButton
              addClass={`${styles["settings-team__experts-add-btn"]}`}
              txt={"Add Expert"}
              onClick={() => {
                if (currentTeamId) {
                  openMoadlAddTeammate()
                } else {
                  setActiveId(1)
                }
              }}
              locked={!currentTeamId}
            />
          </>
        )}
      </form>
      <ModalAddTeammate
        isOpen={modalsList.includes("modal-add-teammate")}
        onClose={() => {
          dispatch(closeModal("modal-add-teammate"))
        }}
        teamName={formik.values.teamName ? formik.values.teamName : "Team name"}
        refCode={refCode}
      />
    </>
  )
}

export default SettingsTeam
