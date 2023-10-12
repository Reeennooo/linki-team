import { IManagerOffersData, IProjectCard } from "types/project"
import ProjectCard from "components/ProjectCard/ProjectCard"
import styles from "./ProjectsAtWork.module.scss"
import ModalProject from "components/Modals/ModalProject/ModalProject"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { useAppDispatch, useAppSelector } from "hooks"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import { useChangeProjectStatusMutation, useLazyGetProjectsQuery } from "redux/api/project"
import { CHAT_TYPE_PRIVATE, CHAT_TYPE_WORK, PROJECT_STATUS_OPEN } from "utils/constants"
import { Swiper, SwiperSlide } from "swiper/react"
import { Scrollbar } from "swiper"
import TailCard from "components/ui/TailCards/TailCard"

import "swiper/css"
import { updateOnboardingRedux } from "redux/slices/onboarding"
import { addPopupNotification } from "utils/addPopupNotification"
import useUnmount from "../../hooks/useUnmount"

interface ProjectsAtWorkProps {
  projects: IProjectCard[]
  offers: IManagerOffersData
  setActiveTabID?: Dispatch<SetStateAction<number>>
  atWorkType?: string
  isLoading?: boolean
  isCompleted?: boolean
  minLength?: number
  hrefTails?: string
  onboarding?: "atwork" | "completed" | "pm-completed"
}

const ProjectsAtWork: React.FC<ProjectsAtWorkProps> = ({
  projects,
  offers,
  setActiveTabID,
  atWorkType = "pm at work",
  isLoading,
  isCompleted,
  minLength = 4,
  hrefTails,
  onboarding,
}) => {
  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)
  const { projectID, activeProjectIDAtWork } = useAppSelector(selectApiParams)
  const [activeModalProjectTabID, setActiveModalProjectTabID] = useState(null)
  const [swipers, setSwipers] = useState(null)

  const [changeProjectStatus] = useChangeProjectStatusMutation()
  const [getProjects, { data: projectsAtWork }] = useLazyGetProjectsQuery()

  const handleChangeProjectStatus = async (project: IProjectCard) => {
    try {
      await changeProjectStatus({ project_id: project.id, status: PROJECT_STATUS_OPEN })
        .unwrap()
        .then((res) => {
          getProjects()
          addPopupNotification({
            title: "Congratulations!",
            txt: "Your task has been successfully completed and submitted",
            icon: "check",
            mod: "success",
          })
        })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!projects || !projects.length) {
      setSwipers(null)
      return
    }
    setSwipers(projects)

    if (onboarding === "atwork") {
      setTimeout(() => {
        dispatch(updateOnboardingRedux({ field: "clientProjectOnboardingReadyForWorkTabStart", data: true }))
      }, 1000)
    }
    if (onboarding === "completed") {
      setTimeout(() => {
        dispatch(updateOnboardingRedux({ field: "clientProjectOnboardingReadyForWorkTabStart", data: false }))
        dispatch(updateOnboardingRedux({ field: "clientProjectOnboardingCompletedkTabStart", data: true }))
      }, 1000)
    }
    if (onboarding === "pm-completed") {
      setTimeout(() => {
        dispatch(updateOnboardingRedux({ field: "pmProjectOnboardingReadyForWorkTabStart", data: true }))
      }, 1000)
    }
  }, [projects])

  const [isMobile, setMobile] = useState<boolean>(false)
  useEffect(() => {
    setMobile(window.innerWidth <= 767)
  }, [])

  useUnmount(() => {
    localStorage.removeItem("descriptions")
  })

  const tailsList = () => {
    if (!swipers) {
      const defaultTails = []
      for (let i = 0; i < 4; i++) {
        defaultTails.push(
          <SwiperSlide key={i}>
            <TailCard
              icon={"plus"}
              href={hrefTails || null}
              onClick={() => {
                if (hrefTails) return
                setActiveTabID(1)
              }}
            />
          </SwiperSlide>
        )
      }
      return defaultTails
    }
    const list = []
    const countNeeded = minLength - swipers.length
    if (countNeeded > 0) {
      for (let i = 0; i < countNeeded; i++) {
        list.push(
          <SwiperSlide key={i}>
            <TailCard
              icon={"plus"}
              href={hrefTails || null}
              onClick={() => {
                if (hrefTails) return
                setActiveTabID(1)
              }}
            />
          </SwiperSlide>
        )
      }
    } else {
      list.push(
        <SwiperSlide key={Math.random()}>
          <TailCard
            icon={"plus"}
            href={hrefTails || null}
            onClick={() => {
              if (hrefTails) return
              setActiveTabID(1)
            }}
          />
        </SwiperSlide>
      )
    }
    return list
  }

  return (
    <>
      <div className={`${styles.grid} ${isLoading ? styles["grid--loading"] : ""}`}>
        {isLoading ? (
          <>
            <div className={styles.loading} />
            <div className={styles.loading} />
            <div className={styles.loading} />
            <div className={styles.loading} />
          </>
        ) : (
          <>
            <Swiper
              modules={[Scrollbar]}
              scrollbar={{ draggable: true }}
              slidesPerView={"auto"}
              spaceBetween={isMobile ? 16 : 20}
              observer={true}
              observeSlideChildren={true}
              observeParents={true}
            >
              {swipers?.map((project) => {
                let candidateCounts = 0
                if (offers) {
                  const projectUsers = offers[project.id]?.users
                  if (projectUsers?.length) {
                    projectUsers.map((user) => {
                      candidateCounts = candidateCounts + user.candidates_count
                    })
                  }
                }
                return (
                  <SwiperSlide key={project.id}>
                    <ProjectCard
                      addClass={"tour-customer-project-at-work-card"}
                      data={{ ...project }}
                      durationDays={!["client draft"].includes(atWorkType) ? project.offers[0]?.days : null}
                      person={
                        ["client at work", "client finish"].includes(atWorkType)
                          ? { avatar: project.manager_avatar, name: project.manager, surname: project.manager_surname }
                          : null
                      }
                      chatLink={
                        ["client at work", "pm at work", "expert at work"].includes(atWorkType) ||
                        (["pm finish", "expert finish"].includes(atWorkType) && project?.status !== 5)
                      }
                      team={offers ? offers[project.id]?.users : null}
                      responses={candidateCounts}
                      mod={"default, md"}
                      isActive={
                        (["client finish", "pm finish"].includes(atWorkType) &&
                          modalsList.includes("modal-project-at-work") &&
                          projectID === project.id) ||
                        (["client draft"].includes(atWorkType) &&
                          modalsList.includes("modal-project-draft") &&
                          projectID === project.id) ||
                        activeProjectIDAtWork === project.id
                      }
                      onClick={() => {
                        if (["client draft"].includes(atWorkType)) {
                          if (modalsList.includes("modal-project-draft")) {
                            if (projectID === project.id) {
                              dispatch(closeModal("modal-project-draft"))
                            } else {
                              dispatch(updateApiParams({ field: "projectID", data: project.id }))
                            }
                          } else {
                            dispatch(updateApiParams({ field: "projectID", data: project.id }))
                            dispatch(openModal("modal-project-draft"))
                          }
                          return
                        }
                        if (["client finish", "pm finish", "expert finish"].includes(atWorkType)) {
                          if (modalsList.includes("modal-project-at-work")) {
                            if (projectID === project.id) {
                              dispatch(closeModal("modal-project-at-work"))
                            } else {
                              dispatch(updateApiParams({ field: "projectID", data: project.id }))
                              dispatch(
                                updateApiParams({ field: "currentUserID", data: project["offers"][0]["manager_id"] })
                              )
                            }
                          } else {
                            dispatch(updateApiParams({ field: "projectID", data: project.id }))
                            dispatch(
                              updateApiParams({ field: "currentUserID", data: project["offers"][0]["manager_id"] })
                            )
                            dispatch(openModal("modal-project-at-work"))
                          }
                          return
                        }
                        if (["expert at work", "expert finish"].includes(atWorkType)) return
                        if (offers && offers[project.id].work_description.length) {
                          dispatch(updateApiParams({ field: "activeProjectIDAtWork", data: project.id }))
                        }
                      }}
                      headerNextLink={!isCompleted && !["client draft"].includes(atWorkType)}
                      isCompleted={isCompleted}
                      isDraft={["client draft"].includes(atWorkType)}
                      onClickBtnNext={() => {
                        dispatch(updateApiParams({ field: "projectID", data: project.id }))
                        if (atWorkType && atWorkType === "expert at work") {
                          dispatch(updateApiParams({ field: "currentUserID", data: project.manager_id }))
                        }
                        if (atWorkType && atWorkType === "client at work") {
                          if (project["offers"].length) {
                            dispatch(
                              updateApiParams({ field: "currentUserID", data: project["offers"][0]["manager_id"] })
                            )
                          }
                        }
                        if (modalsList.includes("modal-project-at-work")) {
                          if (projectID === project.id && activeModalProjectTabID === 1) {
                            dispatch(closeModal("modal-project-at-work"))
                          }
                        } else {
                          dispatch(updateApiParams({ field: "projectID", data: project.id }))
                          dispatch(openModal("modal-project-at-work"))
                        }
                        if (activeModalProjectTabID !== 1) setActiveModalProjectTabID(1)
                      }}
                      isBtnEditDesc={offers && !offers[project.id]?.work_description.length}
                      onClickBtnEditDesc={() => {
                        dispatch(updateApiParams({ field: "projectID", data: project.id }))
                        if (modalsList.includes("modal-project-at-work")) {
                          if (projectID === project.id && activeModalProjectTabID === 3) {
                            dispatch(closeModal("modal-project-at-work"))
                          }
                        } else {
                          dispatch(updateApiParams({ field: "projectID", data: project.id }))
                          dispatch(openModal("modal-project-at-work"))
                        }
                        if (activeModalProjectTabID !== 3) setActiveModalProjectTabID(3)
                      }}
                      mainBtn={["client draft"].includes(atWorkType) ? "Publish" : undefined}
                      isMainBtnDisabled={
                        ["client draft"].includes(atWorkType) &&
                        (!project?.name || !project?.description || !project.categories?.length)
                          ? true
                          : undefined
                      }
                      onClickBtnMain={() => {
                        handleChangeProjectStatus(project)
                      }}
                      chatType={
                        ["client at work"].includes(atWorkType)
                          ? CHAT_TYPE_PRIVATE
                          : ["pm at work", "expert at work"].includes(atWorkType)
                          ? CHAT_TYPE_WORK
                          : null
                      }
                    />
                  </SwiperSlide>
                )
              })}
              {tailsList()}
            </Swiper>
          </>
        )}
      </div>
      <ModalProject
        modalType={atWorkType}
        isOpen={modalsList.includes("modal-project-at-work")}
        onClose={() => {
          dispatch(closeModal("modal-project-at-work"))
        }}
        hasProjectInfo={true}
        activeTabID={activeModalProjectTabID}
        closeOutside={(target) => {
          const isBtnNext = target.closest(".project-card__btn-next") !== null
          const isBtnEditDesc = target.closest(".project-card__btn-edit-desc") !== null
          return !(isBtnNext || isBtnEditDesc)
        }}
      />
      <ModalProject
        modalType={atWorkType}
        isOpen={modalsList.includes("modal-project-draft")}
        onClose={() => {
          dispatch(closeModal("modal-project-draft"))
        }}
        closeOutside={(target) => {
          return target.closest(".project-card") === null || target.nodeName === "BUTTON"
        }}
      />
    </>
  )
}

export default ProjectsAtWork
