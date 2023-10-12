import {
  useDeleteCandidateMutation,
  useGetProjectsFinishedQuery,
  useGetProjectsIncomingQuery,
  useGetProjectsQuery,
  useLazyGetManagerOffersQuery,
  useLazyGetProjectsIncomingQuery,
  useSetCandidatesStatusMutation,
} from "redux/api/project"
import { useEffect, useState } from "react"
import TabsLinear from "../ui/TabsLinear/TabsLinear"
import SortableBoard from "../ui/SortableBoard/SortableBoard"
import ProjectsFilter from "./ProjectsFilter/ProjectsFilter"
import { useAuth } from "../../hooks/useAuth"
import { useRouter } from "next/router"
import ProjectsAtWork from "components/ProjectsAtWork/ProjectsAtWork"
import ProjectsTeam from "components/ProjectsTeam/ProjectsTeam"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import { useAppDispatch, useAppSelector } from "hooks"
import { useChangeManagerStatusMutation, useLazyGetVacancyCandidatesQuery } from "redux/api/team"
import styles from "./Projects.module.scss"
import { clearFilter } from "redux/slices/boardFilter"
import { selectonboardingRedux, updateOnboardingRedux } from "redux/slices/onboarding"
import FakeSortableBoard from "components/ui/FakeSortableBoard/FakeSortableBoard"
import FakeProjectsTeam from "components/FakeProjectsTeam/FakeProjectsTeam"
import { DESKTOP_ONBOARDING_BREAKPOINT } from "utils/constants"
import { addPopupNotification } from "utils/addPopupNotification"

interface Props {
  props?: any
}

const ProjectsPM: React.FC<Props> = () => {
  const {
    user: { id: userID, is_onboarder_2, is_onboarder_3 },
  } = useAuth()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { projectID, activeProjectIDAtWork, activeVacancyIDAtWork } = useAppSelector(selectApiParams)

  const [getProjectsIncoming, { data: projectsIncomingLazy, isFetching: isFetchingLazyProjectsIncoming }] =
    useLazyGetProjectsIncomingQuery() // запрос только для менеджера
  const { data: projectsIncoming, isFetching } = useGetProjectsIncomingQuery()
  const { data: projectsAtWork, isLoading, isFetching: isFetchingProjectsAtWork } = useGetProjectsQuery()
  const { data: projectsFinished, isFetching: isFetchingProjectsFinished } = useGetProjectsFinishedQuery()
  const [setStatusProject, resultStatus] = useSetCandidatesStatusMutation()
  const [deleteCandidate, resultDelete] = useDeleteCandidateMutation()
  const [changeManagerStatus, resultManagerStatus] = useChangeManagerStatusMutation()
  const [getManagerOffers, { data: teams, isFetching: isFetchingManagersOffers }] = useLazyGetManagerOffersQuery()
  const [getVacancyCandidates, { data: vacancyCandidates, isFetching: isFetchingVacancyCandidate }] =
    useLazyGetVacancyCandidatesQuery()

  //ONBOARDING START STATE
  const { mountPmProjectsOnboarding } = useAppSelector(selectonboardingRedux)
  const { pmProjectOnboardingAddInbound } = useAppSelector(selectonboardingRedux)
  const { pmProjectOnboardingСonsideration } = useAppSelector(selectonboardingRedux)
  const { pmProjectOnboardingСonsiderationOffer } = useAppSelector(selectonboardingRedux)
  const { pmProjectOnboardingReadyForWork } = useAppSelector(selectonboardingRedux)
  const { pmProjectOnboardingReadyForWorkStart } = useAppSelector(selectonboardingRedux)
  const { mountPmProjectsAtWorkOnboarding } = useAppSelector(selectonboardingRedux)
  const { teamPmProjectsAtWorkOnboarding } = useAppSelector(selectonboardingRedux)
  const { fakeBoardPmProjectsAtWorkOnboarding } = useAppSelector(selectonboardingRedux)
  const { teamOpenPmProjectsAtWorkOnboarding } = useAppSelector(selectonboardingRedux)
  const { pmProjectAtWorkOnboardingAddInbound } = useAppSelector(selectonboardingRedux)
  const { pmProjectAtWorkOnboardingСonsideration } = useAppSelector(selectonboardingRedux)
  const { pmProjectAtWorkOnboardingReadyForWork } = useAppSelector(selectonboardingRedux)
  const { teamSelectedPmProjectsAtWorkOnboarding } = useAppSelector(selectonboardingRedux)
  const { pmProjectOnboardingCompletedTab } = useAppSelector(selectonboardingRedux)

  const [dndData, setDndData] = useState([])
  const [activeTabID, setActiveTabID] = useState(router?.query?.tab ? Number(router.query.tab) : 1)
  const [linksTabsData, setLinksTabsData] = useState([
    { id: 1, txt: "Incoming", count: 0 },
    { id: 2, txt: "At Work", count: 0 },
    { id: 3, txt: "Completed", count: 0 },
  ])
  const [isLoadingAtWork, setLoadingAtWork] = useState(true)

  useEffect(() => {
    const dataProj = projectsIncoming?.length ? [...projectsIncoming].reverse() : projectsIncoming
    const atWorkProjects = projectsAtWork?.length
      ? [...projectsAtWork].filter((project) => !project["finished_at"])?.reverse()
      : projectsAtWork
    setDndData(dataProj)
    setLinksTabsData(
      linksTabsData.map((tab) => {
        switch (tab.id) {
          case 1:
            if (projectsIncoming?.length) {
              // в таб count вставляем кол-во проектов, которые пришли как incoming и без статуса -1(архив)
              tab.count = projectsIncoming.filter((project) => {
                const candidateStatus = project.candidate_statuses.find(
                  (obj) => obj.hasOwnProperty(userID) && obj[userID] === -1
                )
                if (candidateStatus) return null
                return project
              }).length
            }
            break
          case 2:
            tab.count = atWorkProjects?.length || 0
            break
          case 3:
            tab.count = projectsFinished?.length || 0
            break
        }
        return tab
      })
    )
  }, [projectsIncoming, projectsAtWork, projectsFinished, setDndData, userID])

  useEffect(() => {
    setDndData(projectsIncomingLazy?.length ? [...projectsIncomingLazy].reverse() : projectsIncomingLazy)
  }, [projectsIncomingLazy])

  useEffect(() => {
    dispatch(updateApiParams({ field: "activeVacancyIDAtWork", data: null }))
    dispatch(updateApiParams({ field: "activeProjectIDAtWork", data: null }))
    dispatch(clearFilter())
  }, [activeTabID, userID])

  useEffect(() => {
    if (!projectsAtWork?.length) return
    if ([1].includes(activeTabID)) return
    const ordersIDs = []
    if (activeTabID === 2) {
      projectsAtWork?.map((project) => {
        ordersIDs.push(project.id)
      })
    } else if (activeTabID === 3) {
      projectsFinished?.map((project) => {
        ordersIDs.push(project.id)
      })
    }
    if (ordersIDs.length) {
      dispatch(updateApiParams({ field: "getManagerOffers", data: { orders_id: ordersIDs } }))
      getManagerOffers({ orders_id: ordersIDs })
    }
  }, [projectsAtWork, activeTabID, userID])

  useEffect(() => {
    if (activeVacancyIDAtWork) getVacancyCandidates({ team_member_id: activeVacancyIDAtWork })
  }, [activeVacancyIDAtWork])

  useEffect(() => {
    if (activeTabID === 2 && teams && !isFetchingManagersOffers) setLoadingAtWork(false)
  }, [teams, isFetchingManagersOffers])

  useEffect(() => {
    if (!router?.query?.tab || router?.query?.tab === "1") return
    router.push({
      query: { ...router.query, tab: activeTabID },
    })
  }, [])

  const fakePmList = [
    {
      column:
        pmProjectOnboardingСonsideration || pmProjectOnboardingСonsiderationOffer
          ? "Under consideration"
          : pmProjectOnboardingReadyForWork
          ? "Ready for work"
          : "Incoming",
      id: 1,
      manager: {
        avatar: "/img/onboarding/7.jpg",
        name: "Ivan T.",
        position: "Senior manager in manager",
      },
      status: 1,
      price: 15555,
      manager_status: null,
      executor_status: null,
      name: "Create a milk site",
      description: "<p>It is best to drink milk two hours before</p>",
      created_at: "16.11.2022",
      candidates_count: 12,
      candidate_statuses: pmProjectOnboardingСonsideration
        ? [{ [userID]: 1 }]
        : pmProjectOnboardingСonsiderationOffer
        ? [{ [userID]: 2 }]
        : pmProjectOnboardingReadyForWorkStart
        ? [{ [userID]: 4 }]
        : [],
    },
    {
      column: "Incoming",
      id: 2,
      manager: {
        avatar: "/img/onboarding/7.jpg",
        name: "Ivan T.",
        position: "Senior manager in manager",
      },
      status: 1,
      price: 15555,
      manager_status: null,
      executor_status: null,
      name: "Create a milk site",
      description: "<p>It is best to drink milk two hours before</p>",
      created_at: "16.11.2022",
      candidates_count: 9,
      candidate_statuses: [],
    },
    {
      column: "Incoming",
      id: 3,
      manager: {
        avatar: "/img/onboarding/7.jpg",
        name: "Ivan T.",
        position: "Senior manager in manager",
      },
      status: 1,
      price: 15555,
      manager_status: null,
      executor_status: null,
      name: "Create a milk site",
      description: "<p>It is best to drink milk two hours before</p>",
      created_at: "16.11.2022",
      candidates_count: 22,
      candidate_statuses: [],
    },
  ]

  useEffect(() => {
    if (activeTabID === 1) {
      //activate onboarding
      if (!is_onboarder_2 && window.innerWidth >= DESKTOP_ONBOARDING_BREAKPOINT) {
        dispatch(updateOnboardingRedux({ field: "mountPmProjectsOnboarding", data: true }))
      }
    }

    if (activeTabID === 2) {
      //activate onboarding
      if (!is_onboarder_3 && window.innerWidth >= DESKTOP_ONBOARDING_BREAKPOINT) {
        dispatch(updateOnboardingRedux({ field: "mountPmProjectsAtWorkOnboarding", data: true }))
      }
    }

    //deactivate onboarding
    if (is_onboarder_3 && mountPmProjectsAtWorkOnboarding && window.innerWidth >= DESKTOP_ONBOARDING_BREAKPOINT) {
      dispatch(updateOnboardingRedux({ field: "mountPmProjectsAtWorkOnboarding", data: false }))
    }
  }, [activeTabID])

  useEffect(() => {
    if (pmProjectOnboardingCompletedTab && activeTabID !== 3) {
      setActiveTabID(3)
      router.push({
        query: { ...router.query, tab: 3 },
      })
    }
  }, [pmProjectOnboardingCompletedTab])

  const fakePmsProjectsAtWork = [
    {
      budget: 1,
      candidate_statuses: [],
      candidates_count: 0,
      cover: "",
      created_at: "25.05.2022",
      started_at: null,
      description: "Creation of a modern mobile application for purring a cat",
      finished_at: null,
      id: 1,
      manager_percent: 0,
      media: [],
      name: "Mobile development",
      offers: [],
      owner: "onboarding",
      status: 1,
      text_status: null,
      categories: [],
      owner_id: 0,
      progress: null,
      manager: "Proj",
      manager_avatar: "/img/onboarding/7.jpg",
    },
  ]

  const fakeExpertList = [
    {
      column:
        pmProjectAtWorkOnboardingСonsideration && !pmProjectAtWorkOnboardingReadyForWork
          ? "Under consideration"
          : pmProjectAtWorkOnboardingReadyForWork
          ? "Ready for work"
          : "Incoming",
      id: 1,
      manager: {
        avatar: "/img/onboarding/7.jpg",
        name: "Ivan T.",
        position: "Senior manager in manager",
      },
      status: 1,
      price: null,
      manager_status: pmProjectAtWorkOnboardingReadyForWork ? 2 : null,
      executor_status: 2,
      team_member: {
        area_expertise_id: 9,
        finished_at: null,
        hours: 1,
        id: 88,
        job_role: "Full Stack Developer",
        job_role_id: 8,
        salary_per_hour: 50,
        started_at: null,
        user: null,
      },
      user: {
        avatar: "/img/onboarding/7.jpg",
        created_at: "2022-09-16T09:58:17.000000Z",
        email: "expert@linki.team",
        id: 1,
        name: "Ivan T.",
        job_roles: [
          {
            area_expertise_id: 9,
            hourly_pay: 12,
            id: 7,
            name: "Front End Developer",
            rating: "0",
          },
        ],
      },
    },
    {
      column: pmProjectAtWorkOnboardingСonsideration ? "Under consideration" : "Incoming",
      id: 2,
      manager: {
        avatar: "/img/avatars/5.jpg",
        name: "Pavlina V.",
        position: "Senior manager in manager",
        price: "",
      },
      status: 1,
      price: null,
      manager_status: null,
      executor_status: null,
      team_member: {
        area_expertise_id: 9,
        finished_at: null,
        hours: 1,
        id: 88,
        job_role: "Full Stack Developer",
        job_role_id: 8,
        salary_per_hour: 50,
        started_at: null,
        user: null,
      },
      user: {
        avatar: "/img/avatars/5.jpg",
        name: "Pavlina V.",
        created_at: "2022-09-16T09:58:17.000000Z",
        email: "expert@linki.team",
        id: 1,
        job_roles: [
          {
            area_expertise_id: 9,
            hourly_pay: 12,
            id: 7,
            name: "Front End Developer",
            rating: "0",
          },
        ],
      },
    },
    {
      column: "Incoming",
      id: 3,
      manager: {
        avatar: "/img/avatars/1.jpg",
        name: "Denzel W.",
        position: "Senior manager in manager",
        price: "",
        status: 1,
      },
      team_member: {
        area_expertise_id: 9,
        finished_at: null,
        hours: 1,
        id: 88,
        job_role: "Full Stack Developer",
        job_role_id: 8,
        salary_per_hour: 50,
        started_at: null,
        user: null,
      },
      user: {
        avatar: "/img/avatars/1.jpg",
        name: "Denzel W.",
        created_at: "2022-09-16T09:58:17.000000Z",
        email: "expert@linki.team",
        id: 1,
        job_roles: [
          {
            area_expertise_id: 9,
            hourly_pay: 12,
            id: 7,
            name: "Front End Developer",
            rating: "0",
          },
        ],
      },
    },
    {
      column: "Incoming",
      id: 4,
      manager: {
        avatar: "/img/avatars/8.jpg",
        name: "Alexandr V.",
        position: "Senior manager in manager",
        price: "",
        status: 1,
      },
      team_member: {
        area_expertise_id: 9,
        finished_at: null,
        hours: 1,
        id: 88,
        job_role: "Full Stack Developer",
        job_role_id: 8,
        salary_per_hour: 50,
        started_at: null,
        user: null,
      },
      user: {
        avatar: "/img/avatars/8.jpg",
        name: "Alexandr V.",
        created_at: "2022-09-16T09:58:17.000000Z",
        email: "expert@linki.team",
        id: 1,
        job_roles: [
          {
            area_expertise_id: 9,
            hourly_pay: 12,
            id: 7,
            name: "Front End Developer",
            rating: "0",
          },
        ],
      },
    },
    {
      column: "Incoming",
      id: 5,
      manager: {
        avatar: "/img/avatars/5.jpg",
        name: "Garrison P..",
        position: "Senior manager in manager",
        price: "",
        status: 1,
      },
      team_member: {
        area_expertise_id: 9,
        finished_at: null,
        hours: 1,
        id: 88,
        job_role: "Full Stack Developer",
        job_role_id: 8,
        salary_per_hour: 50,
        started_at: null,
        user: null,
      },
      user: {
        avatar: "/img/avatars/5.jpg",
        name: "Garrison P..",
        created_at: "2022-09-16T09:58:17.000000Z",
        email: "expert@linki.team",
        id: 1,
        job_roles: [
          {
            area_expertise_id: 9,
            hourly_pay: 12,
            id: 7,
            name: "Front End Developer",
            rating: "0",
          },
        ],
      },
    },
  ]

  return (
    <>
      <TabsLinear
        addClass="tour-expert-prj-tabslinear"
        list={linksTabsData}
        activeId={activeTabID}
        onClick={(id) => {
          setLoadingAtWork(true)
          setActiveTabID(id)
          router.push({
            query: { ...router.query, tab: id },
          })
        }}
      />
      {activeTabID === 1 ? (
        <>
          <ProjectsFilter addClass="tour-projects-filter" searchFunc={getProjectsIncoming} data={projectsIncoming} />
          {mountPmProjectsOnboarding ? (
            <FakeSortableBoard
              columns={[
                {
                  id: 1,
                  name: "Incoming",
                  placeholder: "This column will display the project managers who have responded to your project",
                },
                { id: 2, name: "Archive" },
                {
                  id: 3,
                  name: "Under consideration",
                  placeholder: "You show your interest to the project manager by moving the card to this column",
                },
                {
                  id: 4,
                  name: "Ready for work",
                  placeholder: "Move the cards of the project managers you are ready to work with to this column",
                },
              ]}
              data={pmProjectOnboardingAddInbound ? fakePmList : []}
              cardType={"projectCard"}
              onAdd={() => {
                console.log("")
              }}
              userID={userID}
            />
          ) : (
            <SortableBoard
              columns={[
                { id: 1, name: "Incoming", placeholder: "Here are the projects you can take part in" },
                { id: 2, name: "Archive" },
                {
                  id: 3,
                  name: "Under consideration",
                  placeholder: "You respond to the project by moving the card to this column",
                },
                {
                  id: 4,
                  name: "Ready for work",
                  placeholder: "You will be able to move the project to this column after making the offer",
                },
              ]}
              cardType={"projectCard"}
              userID={userID}
              data={dndData}
              isLoading={isFetching}
              onAdd={(evt, instance) => {
                const colNameTo = instance.options.group["name"]
                const colNameFrom = evt.from.parentElement.dataset.col
                const orderID = +evt.item.dataset.id
                const currentProject = dndData?.filter((item) => item?.id === orderID)
                let settableStatus = null
                switch (colNameTo) {
                  case "Archive":
                    settableStatus = -1
                    break
                  case "Under consideration": // 2 column
                    if (colNameFrom === "Incoming" || colNameFrom === "Archive") settableStatus = 1
                    if (colNameFrom === "Ready for work") settableStatus = 2
                    break
                  case "Ready for work": // 3 column
                    settableStatus = 3
                    break
                }
                if (colNameTo === "Incoming") {
                  deleteCandidate({ manager_id: userID, order_id: orderID })
                } else {
                  if (!settableStatus) return
                  setStatusProject({ manager_id: userID, status: settableStatus, order_id: orderID }).then((res) => {
                    const projectName = currentProject?.length > 0 ? currentProject[0]?.name : ""
                    if (colNameTo === "Under consideration") {
                      addPopupNotification({
                        title: "Project selection",
                        txt: `You moved the project "${projectName}" to the "${colNameTo}" column`,
                      })
                    }
                    if (colNameTo === "Ready for work") {
                      addPopupNotification({
                        title: "Congratulations!",
                        txt: `Your offer has been successfully sent to the client, please wait for a decision`,
                        mod: "success",
                        icon: "check",
                      })
                      addPopupNotification({
                        title: "Project selection",
                        txt: `You moved the project "${projectName}" to the "${colNameTo}" column`,
                      })
                    }
                  })
                }
              }}
            />
          )}
        </>
      ) : activeTabID === 2 ? (
        <div className={styles["at-work"]}>
          <ProjectsAtWork
            projects={
              mountPmProjectsAtWorkOnboarding
                ? fakePmsProjectsAtWork
                : projectsAtWork?.length
                ? [...projectsAtWork]?.filter((project) => !project["finished_at"])
                : null
            }
            offers={teams}
            setActiveTabID={setActiveTabID}
            isLoading={projectsAtWork?.length ? isLoadingAtWork : false}
          />
          {mountPmProjectsAtWorkOnboarding && (
            <>
              <FakeProjectsTeam
                user={teamSelectedPmProjectsAtWorkOnboarding}
                show={teamPmProjectsAtWorkOnboarding || teamSelectedPmProjectsAtWorkOnboarding}
                open={teamOpenPmProjectsAtWorkOnboarding}
                addClass="tour-fake-projects-team"
              />
              <div
                style={
                  fakeBoardPmProjectsAtWorkOnboarding && !teamSelectedPmProjectsAtWorkOnboarding
                    ? { opacity: "1" }
                    : { opacity: "0" }
                }
              >
                <FakeSortableBoard
                  columns={[
                    {
                      id: 1,
                      name: "Incoming",
                      placeholder: "This column will display the project managers who have responded to your project",
                    },
                    { id: 2, name: "Archive" },
                    {
                      id: 3,
                      name: "Under consideration",
                      placeholder: "You show your interest to the project manager by moving the card to this column",
                    },
                    {
                      id: 4,
                      name: "Ready for work",
                      placeholder: "Move the cards of the project managers you are ready to work with to this column",
                    },
                  ]}
                  data={pmProjectAtWorkOnboardingAddInbound ? fakeExpertList : []}
                  cardType={"humanCardPMAtWork"}
                  onAdd={() => {
                    console.log("")
                  }}
                  userID={userID}
                />
              </div>
            </>
          )}

          {activeProjectIDAtWork && (
            <>
              <ProjectsTeam
                team={teams?.hasOwnProperty(activeProjectIDAtWork) ? teams[activeProjectIDAtWork]?.users : null}
              />
              <div className={styles["at-work__candidates-wrap"]}>
                {teams?.hasOwnProperty(activeProjectIDAtWork) &&
                  activeVacancyIDAtWork &&
                  (teams[activeProjectIDAtWork]?.users.filter(
                    (item) => item.team_member_id === activeVacancyIDAtWork
                  )[0]?.in_search ||
                    teams[activeProjectIDAtWork]?.users.filter(
                      (item) => item.team_member_id === activeVacancyIDAtWork
                    )[0]?.candidates_count > 0) && (
                    <SortableBoard
                      columns={[
                        {
                          id: 1,
                          name: "Incoming",
                          placeholder: "The experts who responded to this project will be in this column",
                        },
                        {
                          id: 2,
                          name: "Archive",
                          placeholder: "Move the experts you are not interested in to this column",
                        },
                        {
                          id: 3,
                          name: "Under consideration",
                          placeholder: "Move the experts you are interested in to this column",
                        },
                        {
                          id: 4,
                          name: "Ready for work",
                          placeholder: "Move the experts you are ready to work with to this column",
                        },
                      ]}
                      cardType={"humanCardPMAtWork"}
                      data={vacancyCandidates}
                      isLoading={isFetchingVacancyCandidate}
                      onAdd={(evt, instance) => {
                        const colNameTo = instance.options.group["name"]
                        const cardID = +evt.item.dataset.id
                        const vacancyD = vacancyCandidates.filter((vacancy) => vacancy.user.id === cardID)[0]
                        let settableStatus = null
                        switch (colNameTo) {
                          case "Archive":
                            settableStatus = -1
                            break
                          case "Incoming":
                            settableStatus = 0
                            break
                          case "Under consideration": // 2 column
                            settableStatus = 1
                            break
                          case "Ready for work": // 3 column
                            settableStatus = 2
                            break
                        }
                        if (settableStatus === null) return
                        changeManagerStatus({
                          team_member_id: vacancyD.team_member.id,
                          manager_status: settableStatus,
                          executor_id: vacancyD.executor_id,
                        })
                        if (settableStatus === 1 || settableStatus === 2) {
                          addPopupNotification({
                            title: "Expert selection",
                            txt: `You moved ${vacancyD?.user?.name} ${vacancyD?.user?.surname} to the "${colNameTo}" column`,
                          })
                        }
                      }}
                      userID={userID}
                    />
                  )}
              </div>
            </>
          )}
        </div>
      ) : activeTabID === 3 ? (
        <div className={styles["at-work"]}>
          <ProjectsAtWork
            onboarding={"pm-completed"}
            projects={mountPmProjectsAtWorkOnboarding ? fakePmsProjectsAtWork : projectsFinished}
            offers={teams}
            setActiveTabID={setActiveTabID}
            isLoading={isFetchingManagersOffers}
            atWorkType={"pm finish"}
            isCompleted
          />
        </div>
      ) : (
        ""
      )}
    </>
  )
}

export default ProjectsPM
