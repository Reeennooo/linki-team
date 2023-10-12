import ProjectCard from "../ProjectCard/ProjectCard"
import styles from "./ProjectSelection.module.scss"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import { useAppDispatch, useAppSelector } from "hooks"
import ModalProject from "components/Modals/ModalProject/ModalProject"
import { Swiper, SwiperSlide } from "swiper/react"
import { Scrollbar } from "swiper"
import { useEffect, useState } from "react"
import TailCard from "components/ui/TailCards/TailCard"

import "swiper/css"

interface Props {
  data: any[]
  minLength?: number
  activeTaskId?: number
  setActiveTaskId?: any
  isLoading?: boolean
  mobileTitle?: string
  onboarding?: boolean
}

const ProjectSelection: React.FC<Props> = ({
  data,
  minLength = 4,
  activeTaskId,
  setActiveTaskId,
  isLoading,
  mobileTitle,
  onboarding,
}) => {
  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)
  const { projectID } = useAppSelector(selectApiParams)

  const [isMobile, setMobile] = useState<boolean>(false)
  useEffect(() => {
    setMobile(window.innerWidth <= 767)
  }, [])

  const [swipers, setSwipers] = useState(null)

  useEffect(() => {
    if (!data || !data.length) {
      setSwipers(null)
      return
    }
    setSwipers(data)
  }, [data])

  const tailsList = () => {
    if (!swipers) {
      const defaultTails = []
      for (let i = 0; i < 4; i++) {
        defaultTails.push(
          <SwiperSlide key={i}>
            <TailCard icon={"plus"} href={"/projects/create"} />
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
            <TailCard icon={"plus"} href={"/projects/create"} />
          </SwiperSlide>
        )
      }
    } else {
      list.push(
        <SwiperSlide key={Math.random()}>
          <TailCard icon={"plus"} href={"/projects/create"} />
        </SwiperSlide>
      )
    }
    return list
  }

  return (
    <>
      <div className={styles.block}>
        {mobileTitle && <h2 className={styles["block__mob-title"]}>{mobileTitle}</h2>}
        <div className={styles.list}>
          {isLoading ? (
            <>
              <div className={styles.loading} />
              <div className={styles.loading} />
              <div className={styles.loading} />
              <div className={styles.loading} />
            </>
          ) : (
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
                return (
                  <SwiperSlide key={project.id}>
                    <ProjectCard
                      mod={"md"}
                      data={project}
                      responses={project.candidates_count > 0 ? project.candidates_count : null}
                      responsesStyle={true}
                      addClass={`${onboarding ? "tour-customer-project-card" : ""} ${
                        activeTaskId === project.id ? `${styles.card} ${styles["card--active"]}` : styles.card
                      }`}
                      headerNextLink
                      onClickBtnNext={() => {
                        if (modalsList.includes("modal-project-info")) {
                          if (projectID === project.id) {
                            dispatch(closeModal("modal-project-info"))
                          } else {
                            dispatch(updateApiParams({ field: "projectID", data: project.id }))
                          }
                        } else {
                          dispatch(updateApiParams({ field: "projectID", data: project.id }))
                          dispatch(openModal("modal-project-info"))
                        }
                      }}
                      onClick={() => {
                        setActiveTaskId(project.id)
                        return project.id
                      }}
                    />
                  </SwiperSlide>
                )
              })}
              {tailsList()}
            </Swiper>
          )}
        </div>
      </div>
      <ModalProject
        modalType={"modal-project-info"}
        isOpen={modalsList.includes("modal-project-info")}
        onClose={() => {
          dispatch(closeModal("modal-project-info"))
        }}
        hasProjectInfo
        closeOutside={(target) => {
          const isBtnNext = target.closest(".project-card__btn-next") !== null
          return !isBtnNext
        }}
      />
    </>
  )
}

export default ProjectSelection
