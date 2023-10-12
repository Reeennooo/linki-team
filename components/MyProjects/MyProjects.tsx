import ProjectCard from "components/ProjectCard/ProjectCard"
import TabsHandler from "components/ui/TabsHandler/TabsHandler"
import React, { useState, useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import styles from "./MyProjects.module.scss"
import Link from "next/link"
import ProjectPlug from "components/ProjectCard/ProjectPlug"
import { useLazyGetUserQuery } from "../../redux/api/user"
import {
  useChangeProjectStatusMutation,
  useGetProjectsFinishedQuery,
  useLazyGetExecutingOffersQuery,
  useLazyGetManagerOffersQuery,
  useLazyGetProjectsIncomingQuery,
  useLazyGetProjectsQuery,
  useSetCandidatesStatusMutation,
} from "redux/api/project"
import { useAppDispatch, useAppSelector } from "hooks"
import { useAuth } from "hooks/useAuth"
import {
  CHAT_TYPE_PRIVATE,
  PROJECT_STATUS_OPEN,
  USER_TYPE_CUSTOMER,
  USER_TYPE_EXPERT,
  USER_TYPE_PM,
} from "utils/constants"
import { useLazyGetVacanciesIncomingQuery } from "redux/api/team"
import { useRouter } from "next/router"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import ModalOffer from "components/Modals/ModalOffer/ModalOffer"
import ModalEvaluate from "../Modals/ModalEvaluate/ModalEvaluate"
import useUnmount from "../../hooks/useUnmount"

interface Props {
  props?: any
  addClass?: string
}

const MyProjects: React.FC<Props> = ({ addClass, ...props }) => {
  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)
  const { projectID } = useAppSelector(selectApiParams)
  const { user } = useAuth()
  const { orderID } = useAppSelector(selectApiParams)

  const router = useRouter()

  const [getProjects, { data: projects }] = useLazyGetProjectsQuery()
  // const { data: projects, isFetching: fetchingProjects } = useGetProjectsQuery()
  const [getExecutingOffers, { data: teams, isFetching: isFetchingManagersOffers }] = useLazyGetExecutingOffersQuery()
  //запрос на получение клиентом ПМ-а, для завершения проекта и оценки ПМ-а
  const [getUser, { data: userData }] = useLazyGetUserQuery()

  const { data: projectsFinished, isFetching: isFetchingProjectsFinished } = useGetProjectsFinishedQuery()
  //запрос на получение вакансий экспертом
  const [getVacanciesIncoming, { data: vacanciesIncoming, isFetching }] = useLazyGetVacanciesIncomingQuery()
  //запрос на получение входящих проектов ПМом
  const [getProjectsIncoming, { data: projectsIncomingLazy, isFetching: isFetchingLazyProjectsIncoming }] =
    useLazyGetProjectsIncomingQuery()
  //запрос на получение проектов в работе ПМом
  const [getManagerOffers, { data: pmTeams, isFetching: isFetchingManagersTeams }] = useLazyGetManagerOffersQuery()
  const [changeProjectStatus, resultChangeProjectStatus] = useChangeProjectStatusMutation()
  const [setStatusProject, resultStatus] = useSetCandidatesStatusMutation()

  const [activeTab, setActiveTab] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const linksForCustomer = [
    { id: 1, txt: "Responses", tabType: "customer-response", count: 0 },
    { id: 2, txt: "At Work", tabType: "customer-atwork", count: 0 },
    { id: 3, txt: "Completed", tabType: "customer-completed", count: 0 },
    { id: 4, txt: "Drafts", tabType: "ustomer-draft", count: 0 },
  ]
  const linksForExpert = [
    { id: 1, txt: "For consideration", tabType: "expert-consideration", count: 0 },
    { id: 2, txt: "Ready for work", tabType: "expert-ready", count: 0 },
    { id: 3, txt: "At work", tabType: "expert-at-work", count: 0 },
  ]
  const linksForPM = [
    { id: 1, txt: "Edit offer", tabType: "", count: 0 },
    { id: 2, txt: "Ready for work", tabType: "", count: 0 },
    { id: 3, txt: "At work", tabType: "pm-at-work", count: 0 },
  ]

  const [linksTabData, setLinksTabData] = useState([])

  //Массивы проектов под разные табы
  const [projectsResponses, setProjectsResponses] = useState([])
  const [projectsAtWork, setProjectsAtWork] = useState([])
  const [projectsCompleted, setProjectsCompleted] = useState([])
  const [projectsDraft, setProjectsDraft] = useState([])

  const [mainBtnText, setMainBtnText] = useState("")

  //функции для кнопок
  const onClickBtnMainFunction = useRef(null)

  const pickManagerFn = (project) => {
    router.push("/projects")
  }

  const finishAndPayFn = (project) => {
    getUser(project?.manager_id)
    dispatch(updateApiParams({ field: "projectID", data: project.id }))

    dispatch(openModal("modal-evaluate"))
  }

  const publishProject = async (project) => {
    try {
      await changeProjectStatus({ project_id: project.id, status: PROJECT_STATUS_OPEN })
        .unwrap()
        .then((res) => {
          getProjects()
        })
    } catch (err) {
      console.log(err)
    }
  }

  const startProjectFunction = async (project) => {
    await setStatusProject({ manager_id: user.id, status: 5, order_id: project.id })
      .unwrap()
      .then((res) => {
        getProjectsIncomingFunction()
      })
  }

  const [projectsToShow, setProjectsToShow] = useState([])

  const getProjectsIncomingFunction = () => {
    if (user.type === USER_TYPE_PM && (activeTab === 1 || activeTab === 2)) {
      getProjectsIncoming()
    }
  }

  const goToProjects = () => {
    router.push("/projects")
  }

  useEffect(() => {
    if (user.job_roles?.length > 0) {
      getVacanciesIncoming({ job_roles: user.job_roles.map(({ id }) => id) })
    }

    getProjectsIncomingFunction()

    getProjects()
  }, [user])

  useEffect(() => {
    if (user.type === USER_TYPE_CUSTOMER) {
      setLinksTabData(linksForCustomer)
    }
    if (user.type === USER_TYPE_EXPERT) {
      setLinksTabData(linksForExpert)
    }
    if (user.type === USER_TYPE_PM) {
      setLinksTabData(
        linksForPM.map((tab) => {
          switch (tab.id) {
            case 1:
              if (
                projectsIncomingLazy?.filter(
                  (prj) =>
                    (prj.candidate_statuses?.length > 0 &&
                      prj.offers?.includes(user.id) &&
                      prj.candidate_statuses?.filter(
                        (candidate) =>
                          candidate.hasOwnProperty(user.id) && (candidate[user.id] === 3 || candidate[user.id] === 4)
                      )?.length === 0) ||
                    (prj.candidate_statuses?.filter(
                      (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 1
                    )?.length > 0 &&
                      !prj.offers?.includes(user.id))
                ).length > 0
              )
                tab.count = projectsIncomingLazy.filter(
                  (prj) =>
                    (prj.candidate_statuses?.length > 0 &&
                      prj.offers?.includes(user.id) &&
                      prj.candidate_statuses?.filter(
                        (candidate) =>
                          candidate.hasOwnProperty(user.id) &&
                          (candidate[user.id] === 3 || candidate[user.id] === 4 || candidate[user.id] === -1)
                      )?.length === 0) ||
                    (prj.candidate_statuses?.filter(
                      (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 1
                    )?.length > 0 &&
                      !prj.offers?.includes(user.id))
                ).length
              break
            case 2:
              if (
                projectsIncomingLazy?.filter(
                  (project) =>
                    project.candidate_statuses?.filter(
                      (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 3
                    )?.length > 0 ||
                    project.candidate_statuses?.filter(
                      (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 4
                    )?.length > 0
                ).length > 0
              )
                tab.count = projectsIncomingLazy.filter(
                  (project) =>
                    project.candidate_statuses?.filter(
                      (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 3
                    )?.length > 0 ||
                    project.candidate_statuses?.filter(
                      (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 4
                    )?.length > 0
                ).length
              break
            case 3:
              if (projects?.length) tab.count = projects.length
              break
          }
          return tab
        })
      )
    }
    if (projects?.length > 0) {
      setProjectsResponses(projects.filter((prj) => prj.status === 3 && prj.candidates_count > 0))
      setProjectsAtWork(projects.filter((prj) => prj.status === 4))
      setProjectsDraft(projects.filter((prj) => prj.status === 1))
    }

    //Получение команды
    if (projects?.length && user.type === USER_TYPE_EXPERT) {
      const ordersIDs = []
      projects?.map((project) => {
        ordersIDs.push(project.id)
      })
      if (ordersIDs.length > 0) {
        getExecutingOffers({ orders_id: ordersIDs })
      }
    }
    //Получение команды Пмом
    if (projects?.length && user.type === USER_TYPE_PM) {
      const ordersIDs = []
      projects?.map((project) => {
        ordersIDs.push(project.id)
      })
      if (ordersIDs.length > 0) {
        getManagerOffers({ orders_id: ordersIDs })
      }
    }
  }, [projects, projectsIncomingLazy, user])

  // Устанавливаем массивы для вывода
  useEffect(() => {
    onClickBtnMainFunction.current = null
    setMainBtnText("")
    setProjectsToShow([])

    if (activeTab === 1 && user.type === USER_TYPE_CUSTOMER) {
      setProjectsToShow(projectsResponses)
      onClickBtnMainFunction.current = pickManagerFn
      setMainBtnText("Pick manager")
    }
    if (activeTab === 2 && user.type === USER_TYPE_CUSTOMER) {
      setProjectsToShow(projectsAtWork)
      onClickBtnMainFunction.current = finishAndPayFn
      setMainBtnText("Finish")
    }
    if (activeTab === 3 && user.type === USER_TYPE_CUSTOMER) {
      setProjectsToShow(projectsFinished)
    }
    if (activeTab === 4 && user.type === USER_TYPE_CUSTOMER) {
      onClickBtnMainFunction.current = publishProject
      setProjectsToShow(projectsDraft)
      setMainBtnText("Publish")
    }
    if (activeTab === 1 && user.type === USER_TYPE_EXPERT) {
      if (vacanciesIncoming?.length > 0) {
        setProjectsToShow(
          vacanciesIncoming
            .filter(
              (el) =>
                el?.work_candidate_statuses?.executor_status === 1 && el?.work_candidate_statuses?.manager_status === 0
            )
            .map(
              (vac) =>
                vac.order &&
                vac.team_member && {
                  ...vac.order,
                  created_at: vac.order.started_at,
                  id: vac.team_member.id,
                  price: vac.team_member?.salary * vac.team_member?.hours,
                  candidates_count: vac.team_member?.candidates_count,
                  wait: "Under consideration",
                }
            )
        )
      }
    }
    if (activeTab === 2 && user.type === USER_TYPE_EXPERT) {
      if (vacanciesIncoming?.length > 0) {
        setProjectsToShow(
          vacanciesIncoming
            .filter(
              (el) =>
                el?.work_candidate_statuses?.executor_status === 2 && el?.work_candidate_statuses?.manager_status === 0
            )
            .map(
              (vac) =>
                vac.order &&
                vac.team_member && {
                  ...vac.order,
                  created_at: vac.order.started_at,
                  id: vac.team_member.id,
                  price: vac.team_member?.salary * vac.team_member?.hours,
                  candidates_count: vac.team_member?.candidates_count,
                  wait: "Under consideration",
                }
            )
        )
      }
    }
    if (activeTab === 3 && user.type === USER_TYPE_EXPERT) {
      setProjectsToShow(projectsAtWork)
    }
    if (activeTab === 1 && user.type === USER_TYPE_PM) {
      projectsIncomingLazy &&
        setProjectsToShow(
          projectsIncomingLazy
            .filter(
              (prj) =>
                (prj.candidate_statuses?.length > 0 &&
                  prj.offers?.includes(user.id) &&
                  prj.candidate_statuses?.filter(
                    (candidate) =>
                      candidate.hasOwnProperty(user.id) &&
                      (candidate[user.id] === 3 || candidate[user.id] === 4 || candidate[user.id] === -1)
                  )?.length === 0) ||
                (prj.candidate_statuses?.filter(
                  (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 1
                )?.length > 0 &&
                  !prj.offers?.includes(user.id))
            )
            .map((project) => {
              return {
                ...project,
                isBtnOffer:
                  project.candidate_statuses.filter(
                    (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 2
                  ).length > 0 && project.offers?.includes(user.id),
                isBtnChat:
                  project.candidate_statuses.filter(
                    (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 2
                  ).length > 0 && project.offers?.includes(user.id),
                wait:
                  project.candidate_statuses?.filter(
                    (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 1
                  )?.length > 0
                    ? "Under consideration"
                    : null,
              }
            })
        )
    }
    if (activeTab === 2 && user.type === USER_TYPE_PM) {
      onClickBtnMainFunction.current = startProjectFunction
      projectsIncomingLazy &&
        setProjectsToShow(
          projectsIncomingLazy
            .filter(
              (project) =>
                project.candidate_statuses?.filter(
                  (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 3
                )?.length > 0 ||
                project.candidate_statuses?.filter(
                  (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 4
                )?.length > 0
            )
            .map((prjEl) => {
              return {
                ...prjEl,
                isBtnChat: true,
              }
            })
        )
    }
    if (activeTab === 3 && user.type === USER_TYPE_PM) {
      projects && setProjectsToShow(projects)
    }
  }, [
    activeTab,
    teams,
    projectsResponses,
    isFetchingProjectsFinished,
    projectsAtWork,
    projectsCompleted,
    projectsDraft,
    vacanciesIncoming,
    projectsIncomingLazy,
  ])

  useEffect(() => {
    getProjectsIncomingFunction()
  }, [modalsList])

  useEffect(() => {
    if (userData && projectID) setIsLoading(false)
  }, [userData, projectID])

  useUnmount(() => {
    dispatch(closeModal("modal-evaluate"))
  })

  return (
    <>
      <div className={` ${addClass ? addClass : ""}`} {...props}>
        <h4 className={`${styles["my-projects__title"]}`}>
          My projects
          <Link href={"/projects"}>
            <a>
              <span>View all</span>
            </a>
          </Link>
        </h4>
        <TabsHandler
          tabsList={linksTabData}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          link={{
            txt: "View all",
            href: "/projects",
          }}
        />
        <Swiper spaceBetween={12} slidesPerView={"auto"} className={`${styles["my-projects-slider"]}`}>
          {projectsToShow?.length ? (
            projectsToShow.map((project, i) => {
              const maxShownCard = 6
              if (i < maxShownCard) {
                const activeTabType = linksTabData.filter((tabItem) => tabItem.id === activeTab)[0]?.tabType
                const needButton = project?.status !== 4 || (project?.status === 4 && project?.finished_at)
                let team = []
                if (activeTabType === "expert-at-work" && project?.id && teams && teams[project?.id]?.users?.length) {
                  team = teams[project?.id]?.users
                }
                if (activeTabType === "pm-at-work" && project?.id && pmTeams[project?.id]?.users?.length) {
                  team = pmTeams[project?.id]?.users
                }
                return (
                  <SwiperSlide key={i} className={`${styles["my-projects-slider__slide"]}`}>
                    <ProjectCard
                      key={project?.id}
                      isBtnShortMob
                      data={project}
                      activeTabType={activeTabType}
                      durationDays={project?.offers?.length > 0 ? project?.offers[0]["days"] : null}
                      mainBtn={needButton && mainBtnText?.length > 0 ? mainBtnText : null}
                      onClickBtnMain={() => onClickBtnMainFunction.current(project)}
                      responses={
                        project?.candidates_count &&
                        (activeTabType === "customer-response" ||
                          activeTabType === "expert-consideration" ||
                          activeTabType === "expert-ready")
                          ? project?.candidates_count
                          : null
                      }
                      isCompleted={project?.finished_at?.length > 0}
                      person={
                        (activeTabType === "customer-atwork" || activeTabType === "customer-completed") &&
                        project?.manager_avatar && {
                          avatar: project.manager_avatar,
                          name: project.manager,
                          surname: project.manager_surname,
                        }
                      }
                      price={
                        (activeTabType === "expert-consideration" || activeTabType === "expert-ready") && project?.price
                      }
                      wait={project?.wait ? project.wait : null}
                      team={team?.length ? team : null}
                      isBtnOffer={project?.isBtnOffer}
                      isBtnChat={project?.isBtnChat}
                      isMainBtnDisabled={
                        !project?.name || !project?.description || !project.categories?.length ? true : undefined
                      }
                      onClickBtnOffer={() => {
                        if (modalsList.includes("modal-offer")) {
                          if (orderID === project.id) {
                            dispatch(closeModal("modal-offer"))
                          } else {
                            dispatch(updateApiParams({ field: "orderID", data: project.id }))
                          }
                        } else {
                          dispatch(updateApiParams({ field: "orderID", data: project.id }))
                          dispatch(openModal("modal-offer"))
                        }
                      }}
                      onClickBtnStartProject={() => onClickBtnMainFunction.current(project)}
                      onClick={() => {
                        if (project) goToProjects()
                      }}
                    />
                  </SwiperSlide>
                )
              }
            })
          ) : (
            <>
              <SwiperSlide className={`${styles["my-projects-slider__slide"]}`}>
                <ProjectCard />
              </SwiperSlide>
            </>
          )}
          <SwiperSlide className={`${styles["my-projects-slider__slide"]}`}>
            <ProjectPlug userType={user.type} length={1} icon={true} />
          </SwiperSlide>
        </Swiper>

        <div className={`projects-list ${styles["projects-list"]}`}>
          {projectsToShow?.length ? (
            projectsToShow.map((project, i) => {
              const maxShownCard = 6
              if (i < maxShownCard) {
                const activeTabType = linksTabData.filter((tabItem) => tabItem.id === activeTab)[0]?.tabType
                const needButton = project?.status !== 4 || (project?.status === 4 && project?.finished_at)
                let team = []
                if (activeTabType === "expert-at-work" && project?.id && teams && teams[project?.id]?.users?.length) {
                  team = teams[project?.id]?.users
                }
                if (activeTabType === "pm-at-work" && project?.id && pmTeams[project?.id]?.users?.length) {
                  team = pmTeams[project?.id]?.users
                }
                return (
                  <ProjectCard
                    key={project?.id}
                    data={project}
                    activeTabType={activeTabType}
                    isBtnShortMob
                    durationDays={project?.offers?.length > 0 ? project?.offers[0]["days"] : null}
                    mainBtn={needButton && mainBtnText?.length > 0 ? mainBtnText : null}
                    onClickBtnMain={() => onClickBtnMainFunction.current(project)}
                    responses={
                      project?.candidates_count &&
                      (activeTabType === "customer-response" ||
                        activeTabType === "expert-consideration" ||
                        activeTabType === "expert-ready")
                        ? project?.candidates_count
                        : null
                    }
                    responsesStyle={activeTabType === "customer-response"}
                    isCompleted={project?.finished_at?.length > 0}
                    person={
                      (activeTabType === "customer-atwork" || activeTabType === "customer-completed") &&
                      project?.manager_avatar && {
                        avatar: project.manager_avatar,
                        name: project.manager,
                        surname: project.manager_surname,
                      }
                    }
                    chatLink={["customer-atwork"].includes(activeTabType)}
                    chatType={["customer-atwork"].includes(activeTabType) ? CHAT_TYPE_PRIVATE : null}
                    price={
                      (activeTabType === "expert-consideration" || activeTabType === "expert-ready") && project?.price
                    }
                    wait={project?.wait ? project.wait : null}
                    team={team?.length ? team : null}
                    isBtnOffer={project?.isBtnOffer}
                    isBtnChat={project?.isBtnChat}
                    isMainBtnDisabled={
                      !project?.name || !project?.description || !project.categories?.length ? true : undefined
                    }
                    onClickBtnOffer={() => {
                      if (modalsList.includes("modal-offer")) {
                        if (orderID === project.id) {
                          dispatch(closeModal("modal-offer"))
                        } else {
                          dispatch(updateApiParams({ field: "orderID", data: project.id }))
                        }
                      } else {
                        dispatch(updateApiParams({ field: "orderID", data: project.id }))
                        dispatch(openModal("modal-offer"))
                      }
                    }}
                    onClickBtnStartProject={() => onClickBtnMainFunction.current(project)}
                    onClick={() => {
                      if (project) goToProjects()
                    }}
                  />
                )
              }
            })
          ) : (
            <ProjectCard />
          )}
          {projectsToShow?.length < 3 && (
            <ProjectPlug userType={user.type} length={3 - projectsToShow.length} icon={true} />
          )}
        </div>
      </div>
      {user.type === USER_TYPE_PM && activeTab === 1 && (
        <ModalOffer
          isOpen={modalsList.includes("modal-offer")}
          onClose={() => {
            dispatch(closeModal("modal-offer"))
          }}
          managerID={user.id}
          cardStatus={
            projectsIncomingLazy
              ?.filter((item) => item.id === projectID)[0]
              ?.candidate_statuses?.find((obj) => obj.hasOwnProperty(user.id))?.[user.id]
          }
          closeOutside={(target) => {
            return target.closest(".project-card__btn-offer") === null
          }}
        />
      )}
      {user.type === USER_TYPE_CUSTOMER && activeTab === 2 && (
        <ModalEvaluate
          isOpen={modalsList.includes("modal-evaluate")}
          isLoading={isLoading}
          onClose={() => {
            dispatch(closeModal("modal-evaluate"))
          }}
          manager={userData}
          orderID={projectID}
          modalType={"client at work"}
        />
      )}
    </>
  )
}

export default MyProjects
