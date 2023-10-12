import CategoryCard from "components/CategoryCard/CategoryCard"
import RichText from "components/RichText/RichText"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import SelectBlock from "components/ui/SelectBlock/SelectBlock"
import { useEffect, useState } from "react"
import styles from "./TasksForm.module.scss"
import { useFormik } from "formik"
import CoverGallery from "components/CoverGallery/CoverGallery"
import TagItem from "components/ui/TagItem/TagItem"
import DropZone from "components/ui/DropZone/DropZone"
import { useLazyGetCoversQuery, useGetDirectionsQuery, useGetCategoriesQuery } from "redux/api/content"
import { useCreateProjectMutation, useLazyGetExactProjectQuery } from "redux/api/project"
import { LinkiLoader } from "components/ui/Loaders/Loaders"
import { useAppDispatch, useAppSelector } from "hooks"
import { toggleSuccessOrder } from "redux/slices/uiSlice"
import { PROJECT_STATUS_DRAFT, PROJECT_STATUS_OPEN } from "utils/constants"
import { useRouter } from "next/router"
import {
  resetonbOardingRedux,
  selectonboardingRedux,
  updateClientCreateProject,
  updateOnboardingRedux,
} from "redux/slices/onboarding"
import { usePassOnboardingMutation } from "redux/api/user"
import { addPopupNotification } from "utils/addPopupNotification"

interface Props {
  addClass?: string
}

const TasksForm: React.FC<Props> = ({ addClass }) => {
  const router = useRouter()
  //redux
  const dispatch = useAppDispatch()
  //REQUESTS
  const [fetchCovers, { data: covers, isSuccess: isSuccessCovers }] = useLazyGetCoversQuery()
  const { data: direction } = useGetDirectionsQuery()
  const { data: categoriesAll } = useGetCategoriesQuery()
  const [createProject, { isSuccess: isCreateProjectSuccess }] = useCreateProjectMutation()
  const [getProject, { data: projectData, isFetching: isFetchingProject }] = useLazyGetExactProjectQuery()

  //ONBOARDING REQUEST
  const [passOnboardingRequest] = usePassOnboardingMutation()
  //ONBOARDING START STATE
  const { mountCreateProjectOnboarding } = useAppSelector(selectonboardingRedux)

  const [selCoverState, setSelCoverState] = useState(false)
  const [defaultActiveDirection, setDefaultActiveDirection] = useState(0)
  const [isSubmitDisabled, setSubmitDisabled] = useState<boolean>(false)

  useEffect(() => {
    if (!router?.query?.projectid) return
    getProject(+router.query.projectid)
  }, [])
  useEffect(() => {
    if (!projectData?.id) return
    if (projectData?.name) formik.setFieldValue("name", projectData.name)
    if (projectData?.description) formik.setFieldValue("description", projectData.description)
    // if (projectData?.media) formik.setFieldValue("media", projectData.media)
    if (projectData?.categories.length > 0) {
      let projDirID = null
      const catArr = projectData.categories.map((cat) => {
        projDirID = cat.project_direction_id
        return { id: cat.id, label: cat.name, name: cat.name, value: cat.id }
      })
      setDefaultActiveDirection(projDirID)
      formik.setFieldValue("project_categories", catArr)
    }
  }, [projectData])
  useEffect(() => {
    if (selCoverState) {
      setTimeout(
        () => {
          fetchCovers()
        },
        mountCreateProjectOnboarding ? 0 : 1000
      )
    }
  }, [selCoverState])

  useEffect(() => {
    if (mountCreateProjectOnboarding) {
      setSelCoverState(true)
    }
  }, [mountCreateProjectOnboarding])

  useEffect(() => {
    direction && setDefaultActiveDirection(direction[0].id)
  }, [direction])
  //TASKS FORM

  const formik = useFormik({
    initialValues: {
      name: "",
      project_categories: [],
      media: [],
      cover_id: "",
      description: "",
      status: PROJECT_STATUS_DRAFT,
    },
    validate(values) {
      let errors = {}

      if (!formik.values.name) {
        errors = { ...errors, name: "Project name required" }
      }
      // if (!formik.values.cover_id && formik.values.status === 3) {
      //   errors = { ...errors, cover_id: "Cover required" }
      // }
      if (
        (!formik.values.description && formik.values.status === 3) ||
        (formik.values.description === "<p></p>" && formik.values.status === 3)
      ) {
        errors = { ...errors, description: "Description required" }
      }
      if (formik.values.project_categories.length < 1 && formik.values.status === 3) {
        errors = { ...errors, project_categories: "Choose at least one category" }
      }
      return errors
    },
    onSubmit(values) {
      setSubmitDisabled(true)
      const formData = new FormData()
      for (const key in values) {
        if (
          key !== "media" &&
          key !== "project_categories" &&
          values[key] &&
          values[key] !== "<p></p>" &&
          key !== "category"
        ) {
          formData.append(key, values[key])
        }
      }
      values.media.length && values.media.forEach((file) => formData.append("media[]", file))
      values.project_categories.length &&
        values.project_categories.forEach((cat) => formData.append("project_categories[]", cat.id))

      createProject(formData)
        .unwrap()
        .then(() => {
          setSubmitDisabled(false)
          passOnboardingRequest({ block: 2 })
          dispatch(resetonbOardingRedux("all"))
          if (values?.status === PROJECT_STATUS_OPEN) {
            addPopupNotification({
              title: "Congratulations!",
              txt: "Your task has been successfully completed and submitted",
              icon: "check",
              mod: "success",
            })
          } else if (values?.status === PROJECT_STATUS_DRAFT) {
            addPopupNotification({
              title: "Save draft",
              txt: "You saved the project as a draft",
            })
          }
        })
    },
  })
  const onSelectChange = (value) => {
    formik.setFieldValue(`project_categories`, value)
  }
  const onSelectDellItem = (id, field) => {
    if (field === "project_categories")
      formik.setFieldValue(
        "project_categories",
        formik.values.project_categories.filter((stack) => stack.value !== id)
      )
    if (field === "media")
      formik.setFieldValue(
        "media",
        formik.values.media.filter((media) => media.name !== id)
      )
  }
  const onUploadFiles = (media) => {
    formik.setFieldValue(`media`, media)
  }

  const selectCategory = async (id) => {
    setDefaultActiveDirection(id)
    formik.setFieldTouched("project_categories", false)
    formik.setFieldValue("project_categories", formik.initialValues.project_categories)
  }

  const submitForm = (status: number) => {
    formik.setFieldValue("status", status)
    formik.validateForm()
    setTimeout(() => {
      formik.submitForm()
    }, 0)
  }

  const setDescriptionValue = (val) => {
    formik.setFieldValue(`description`, val)
  }

  useEffect(() => {
    if (formik.values.project_categories.length < 1) {
      setTimeout(() => {
        formik.setFieldTouched("project_categories", false)
      }, 500)
    }
  }, [formik.values.project_categories])

  useEffect(() => {
    isCreateProjectSuccess && dispatch(toggleSuccessOrder(true))
  }, [isCreateProjectSuccess])

  //ONBOARDING CODE
  useEffect(() => {
    if (formik.values.name?.length > 0) {
      dispatch(updateClientCreateProject({ field: "projectName", data: true }))
    } else {
      dispatch(updateClientCreateProject({ field: "projectName", data: false }))
    }
    if (formik.values.description?.length > 0 && formik.values.description !== "<p></p>") {
      dispatch(updateClientCreateProject({ field: "projecеtDescription", data: true }))
    } else {
      dispatch(updateClientCreateProject({ field: "projecеtDescription", data: false }))
    }
    if (formik.values.cover_id?.length > 0 || Number(formik.values.cover_id) > 0) {
      dispatch(updateClientCreateProject({ field: "projecеtCover", data: true }))
    } else {
      dispatch(updateClientCreateProject({ field: "projecеtCover", data: false }))
    }
    if (formik.values.project_categories?.length > 0) {
      dispatch(updateClientCreateProject({ field: "projecеtCategories", data: true }))
    } else {
      dispatch(updateClientCreateProject({ field: "projecеtCategories", data: false }))
    }
    if (formik.values.media?.length > 0) {
      dispatch(updateClientCreateProject({ field: "projecеtMedia", data: true }))
    } else {
      dispatch(updateClientCreateProject({ field: "projecеtMedia", data: false }))
    }
  }, [formik.values])

  return (
    <>
      <div className={`${styles["task-form"]} ${addClass ? addClass : ""}`}>
        <div
          className={`
            ${styles["field-block"]} 
            ${formik.errors && formik.touched.name && formik.errors.name ? styles["error"] : ""} tour-field-name`}
        >
          <p className={`${styles["field-block__title"]}`}>Project Name</p>
          <input
            type="text"
            placeholder="Enter the name"
            autoComplete={"off"}
            className={`${styles["field-block__input"]}`}
            {...formik.getFieldProps("name")}
          />
          {formik.errors && formik.touched.name && formik.errors.name && (
            <p className={`${styles["field-block__error"]}`}>{formik.errors.name}</p>
          )}
        </div>
        <div className={` ${styles["field-block"]} tour-field-deskr`}>
          <p className={`${styles["field-block__title"]}`}>Project Description</p>
          <p className={`${styles["field-block__subtitle"]}`}>
            Describe below what needs to be done and targets indicating completion of work
          </p>
          {isFetchingProject ||
          (router?.query?.projectid &&
            (formik.values.description === "<p></p>" || formik.values.description?.length < 1)) ? null : (
            <RichText
              setDescriptionValue={setDescriptionValue}
              initText={formik.values.description}
              error={
                formik.errors && formik.touched.description && formik.errors.description && formik.values.status === 3
              }
            />
          )}

          {formik.errors && formik.touched.description && formik.errors.description && formik.values.status === 3 && (
            <p className={`${styles["field-block__error"]}`}>{formik.errors.description}</p>
          )}
        </div>
        <div className={` ${styles["field-block"]} tour-field-cover`}>
          <p className={`${styles["field-block__title"]}`}>Project Cover</p>
          <p className={`${styles["field-block__subtitle"]}`}>
            The cover should reflect your company or the format of the project. Insert your file or choose one of the
            suggested options
          </p>
          {selCoverState === false ? (
            <DefaultBtn mod={"transparent"} txt={"Choose cover"} onClick={() => setSelCoverState(true)} />
          ) : (
            <div className={` ${styles["cover-gallery"]} ${isSuccessCovers ? styles["is-loaded"] : ""}`}>
              <LinkiLoader />
              {covers && (
                <CoverGallery
                  items={covers}
                  onClick={(id) => {
                    formik.setFieldValue(`cover_id`, id)
                    setTimeout(() => {
                      formik.setFieldTouched(`cover_id`)
                    }, 0)
                  }}
                  onClose={() => {
                    formik.setFieldValue(`cover_id`, "")
                  }}
                />
              )}
            </div>
          )}
          {formik.errors && formik.touched.cover_id && formik.errors.cover_id && formik.values.status === 3 && (
            <p className={`${styles["field-block__error"]}`}>{formik.errors.cover_id}</p>
          )}
        </div>
        {/* Categories --- Directions --- GET /direction */}
        <div className={` ${styles["field-block"]} tour-field-direction`}>
          <p className={`${styles["field-block__title"]}`}>Direction</p>
          <p className={`${styles["field-block__subtitle"]}`}>Choose the direction that best suits your project</p>
          <div className={`${styles["task-form__category"]}`}>
            {direction &&
              direction.map((dir) => {
                return (
                  <CategoryCard
                    active={dir.id === defaultActiveDirection}
                    key={dir.id}
                    txt={dir.name}
                    onClick={selectCategory}
                    id={dir.id}
                  />
                )
              })}
          </div>
        </div>
        <div
          className={` ${styles["field-block"]} ${
            mountCreateProjectOnboarding ? styles["field-block--cat-onboarding"] : ""
          } tour-field-category ${
            formik.touched.project_categories && formik.errors.project_categories && formik.values.status === 3
              ? "error"
              : ""
          }`}
        >
          <p className={`${styles["field-block__title"]}`}>Category</p>
          <p className={`${styles["field-block__subtitle"]}`}>List the categories required to complete your project</p>
          <div className={`${styles["task-form__multiselect-wrp"]}`}>
            <span className={`${styles["task-form__multiselect-label"]}`}>Enter Category</span>
            <SelectBlock
              addClass={`${styles["task-form__multiselect"]}`}
              value={formik.values.project_categories}
              onChange={onSelectChange}
              options={
                categoriesAll
                  ? categoriesAll.filter((cat: any) => cat.project_direction_id === defaultActiveDirection)
                  : []
              }
              isMulti={true}
              size={"lg"}
              onBlur={() => {
                setTimeout(() => {
                  formik.setFieldTouched(`project_categories`, true)
                }, 0)
              }}
            />
          </div>
          <div className={`${styles["selected-items"]}`}>
            {formik.values.project_categories &&
              formik.values.project_categories.map((item, i) => {
                return (
                  <TagItem
                    addClass={`${styles["selected-items__item"]}`}
                    key={i}
                    txt={`${item.label}`}
                    onClose={() => {
                      onSelectDellItem(item.value, "project_categories")
                    }}
                    id={`${item.value}`}
                  />
                )
              })}
          </div>
          {formik.errors &&
            formik.touched.project_categories &&
            formik.errors.project_categories &&
            formik.values.status === 3 && (
              <p className={`${styles["field-block__error"]}`}>Choose at least one category</p>
            )}
        </div>
        <div className={` ${styles["field-block"]} tour-field-files`}>
          <p className={`${styles["field-block__title"]}`}>Files</p>
          <p className={`${styles["field-block__subtitle"]}`}>Add some files to your project (max: 10)</p>
          {/* isRemoveAllFiles={false} addedFiles={formik.getFieldProps("media").value} */}
          <DropZone onUpload={onUploadFiles} />
        </div>
        <div className={`${styles["task-form__submit-block"]} tour-field-publish`}>
          <DefaultBtn
            addClass={`${styles["task-form__save"]} `}
            txt="Save Draft"
            mod={"transparent-grey"}
            onClick={() => submitForm(PROJECT_STATUS_DRAFT)}
            disabled={isSubmitDisabled ? true : undefined}
            href="/projects?tab=4"
          />
          <DefaultBtn
            txt="Publish"
            addClass={`${styles["task-form__publish"]} `}
            onClick={() => submitForm(PROJECT_STATUS_OPEN)}
            disabled={isSubmitDisabled ? true : undefined}
          />
        </div>
      </div>
    </>
  )
}

export default TasksForm
