import { useEffect, useState } from "react"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import { useRouter } from "next/router"
import {
  useChangeExecutorStatusMutation,
  useDeleteTeamCandidateMutation,
  useGetVacanciesIncomingQuery,
  useLazyGetVacanciesIncomingQuery,
} from "redux/api/team"
import { useAuth } from "hooks/useAuth"
import SortableBoard from "components/ui/SortableBoard/SortableBoard"
import {
  useGetProjectsFinishedQuery,
  useGetProjectsQuery,
  useLazyGetExecutingOffersQuery,
  useLazyGetManagerOffersQuery,
} from "redux/api/project"
import styles from "components/Projects/Projects.module.scss"
import ProjectsAtWork from "components/ProjectsAtWork/ProjectsAtWork"
import { useAppDispatch, useAppSelector } from "hooks"
import { updateApiParams } from "redux/slices/apiParams"
import ProjectsFilter from "components/Projects/ProjectsFilter/ProjectsFilter"
import { clearFilter, selectBoardFilter } from "redux/slices/boardFilter"
import { selectonboardingRedux, updateOnboardingRedux } from "redux/slices/onboarding"
import FakeSortableBoard from "components/ui/FakeSortableBoard/FakeSortableBoard"
import { DESKTOP_ONBOARDING_BREAKPOINT } from "utils/constants"
import { addPopupNotification } from "utils/addPopupNotification"

interface Props {
  props?: any
}

const ProjectsExpert: React.FC<Props> = ({ props }) => {
  const router = useRouter()
  const {
    user: { id: userID, type: userType, job_roles, is_onboarder_2, is_onboarder_3 },
  } = useAuth()
  const dispatch = useAppDispatch()
  const filterParams = useAppSelector(selectBoardFilter)

  const [getVacanciesIncoming, { data: vacanciesIncoming, isFetching }] = useLazyGetVacanciesIncomingQuery()
  // const { data: vacanciesIncoming } = useGetVacanciesIncomingQuery()
  const [setStatusVacancy, resultStatus] = useChangeExecutorStatusMutation()
  const [deleteTeamCandidate, resultDeleteTeamCandidate] = useDeleteTeamCandidateMutation()
  const [getExecutingOffers, { data: teams, isFetching: isFetchingExecutingOffers }] = useLazyGetExecutingOffersQuery()
  const { data: projectsAtWork, isLoading, isFetching: isFetchingProjectsAtWork } = useGetProjectsQuery()
  const { data: projectsFinished, isFetching: isFetchingProjectsFinished } = useGetProjectsFinishedQuery()

  //EXPERT ONBOARDING START STATE
  const { mountExpertProjectsOnboarding } = useAppSelector(selectonboardingRedux)
  const { expertProjectOnboardingAddInbound } = useAppSelector(selectonboardingRedux)
  const { expertProjectOnboardingСonsideration } = useAppSelector(selectonboardingRedux)
  const { expertProjectOnboardingСonsiderationChat } = useAppSelector(selectonboardingRedux)
  const { expertProjectOnboardingReadyForWork } = useAppSelector(selectonboardingRedux)
  const { mountExpertProjectsAtWorkOnboarding } = useAppSelector(selectonboardingRedux)
  const { expertProjectOnboardingCompletedkTab } = useAppSelector(selectonboardingRedux)

  const [incomingVacanciesData, setIncomingVacanciesData] = useState([])
  const [activeTabID, setActiveTabID] = useState(router?.query?.tab ? Number(router.query.tab) : 1)
  const [linksTabsData, setLinksTabsData] = useState([
    { id: 1, txt: "Incoming", count: 0 },
    { id: 2, txt: "At Work", count: 0 },
    { id: 3, txt: "Completed", count: 0 },
  ])
  const [isLoadingAtWork, setLoadingAtWork] = useState(true)

  useEffect(() => {
    setIncomingVacanciesData(vacanciesIncoming)
    setLinksTabsData(
      linksTabsData.map((tab) => {
        switch (tab.id) {
          case 1:
            if (
              vacanciesIncoming?.length &&
              !filterParams.date &&
              !filterParams.search &&
              !filterParams.project_categories.length &&
              !filterParams.job_roles.length &&
              !filterParams.hourly_pay.length
            ) {
              tab.count = vacanciesIncoming.filter(
                (vacancy) => vacancy.work_candidate_statuses.executor_status !== -1
              ).length
            }
            break
          case 2:
            tab.count = projectsAtWork?.length || 0
            break
          case 3:
            tab.count = projectsFinished?.length || 0
            break
        }
        return tab
      })
    )
  }, [vacanciesIncoming, projectsAtWork, projectsFinished, setIncomingVacanciesData])

  useEffect(() => {
    if (!projectsFinished?.length) setLoadingAtWork(false)
    if (!projectsAtWork?.length && !projectsFinished?.length) return
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
      getExecutingOffers({ orders_id: ordersIDs })
    }
  }, [projectsAtWork, activeTabID])

  useEffect(() => {
    dispatch(clearFilter())
    if (job_roles.length) {
      getVacanciesIncoming({ job_roles: job_roles.map(({ id }) => id) })
    }
  }, [activeTabID, userID])

  useEffect(() => {
    if ([2, 3].includes(activeTabID) && teams && !isFetchingExecutingOffers) setLoadingAtWork(false)
  }, [teams, isFetchingExecutingOffers])

  useEffect(() => {
    if (!router?.query?.tab || router?.query?.tab === "1") return
    router.push({
      query: { ...router.query, tab: activeTabID },
    })
  }, [])

  const fakePmList = [
    {
      id: 1,
      column:
        expertProjectOnboardingСonsideration && !expertProjectOnboardingReadyForWork
          ? "Under consideration"
          : expertProjectOnboardingReadyForWork
          ? "Ready for work"
          : "Incoming",
      offer: {
        description: "<p>descr</p>",
        work_description: "<p>тест</p>",
      },
      order: {
        description: "<p>It is best to drink milk two hours before</p>",
        id: 1,
        manager_id: 1,
        name: "Create a milk site",
        started_at: "05.10.2022",
      },
      team_member: {
        candidates_count: 1,
        hours: 1,
        id: 1,
        job_role: "",
        job_role_id: 7,
        salary: 15555,
      },
      work_candidate_statuses: {
        executor_status: expertProjectOnboardingСonsideration ? 1 : 0,
        manager_status: expertProjectOnboardingСonsiderationChat ? 1 : 0,
      },
      owner_telegram_link: "https://fakelglink.com",
    },
    {
      id: 2,
      column: "Incoming",
      offer: {
        description: "<p>descr</p>",
        work_description: "<p>тест</p>",
      },
      order: {
        description: "<p>It is best to drink milk two hours before</p>",
        id: 2,
        manager_id: 2,
        name: "Create a milk site",
        started_at: "05.10.2022",
      },
      team_member: {
        candidates_count: 1,
        hours: 100,
        id: 2,
        job_role: "",
        job_role_id: 7,
        salary: 86,
      },
      work_candidate_statuses: {
        executor_status: 0,
        manager_status: 0,
      },
    },
  ]

  const fakeExpertProjects = [
    {
      budget: 1,
      candidate_statuses: [],
      candidates_count: 0,
      cover: "",
      created_at: "25.05.2022",
      started_at: null,
      description: "It is best to drink milk two hours before or after a meal",
      finished_at: null,
      id: 0,
      manager_percent: 0,
      media: [],
      name: "Create a milk site",
      offers: [],
      owner: "onboarding",
      status: expertProjectOnboardingCompletedkTab ? 5 : 4,
      text_status: null,
      categories: [],
      owner_id: 0,
      progress: expertProjectOnboardingCompletedkTab ? null : 12,
      manager: "Proj",
      manager_avatar: "/img/onboarding/7.jpg",
    },
  ]

  const fakeTeams = [
    {
      telegram_link: "",
      work_description: "asdasd",
      users: [
        {
          avatar: "/img/onboarding/7.jpg",
          candidates_count: 0,
          id: 1,
          in_search: false,
          job_role: "Front End Developer",
          job_role_id: 7,
          job_role_rating: "0",
          name: "Expert",
          rating: 0,
          referal_code: null,
          surname: "ываыаыва",
          team_member_id: 115,
          telegram_link: null,
        },
      ],
    },
  ]

  useEffect(() => {
    if (activeTabID === 1) {
      if (mountExpertProjectsAtWorkOnboarding)
        dispatch(updateOnboardingRedux({ field: "mountExpertProjectsAtWorkOnboarding", data: false }))
      if (!is_onboarder_2 && window.innerWidth >= DESKTOP_ONBOARDING_BREAKPOINT) {
        dispatch(updateOnboardingRedux({ field: "mountExpertProjectsOnboarding", data: true }))
      }
    } else if (activeTabID === 2) {
      if (mountExpertProjectsOnboarding)
        dispatch(updateOnboardingRedux({ field: "mountExpertProjectsOnboarding", data: false }))
      setTimeout(() => {
        if (!is_onboarder_3 && window.innerWidth >= DESKTOP_ONBOARDING_BREAKPOINT) {
          dispatch(updateOnboardingRedux({ field: "mountExpertProjectsAtWorkOnboarding", data: true }))
        }
      }, 1000)
    }
  }, [activeTabID])

  useEffect(() => {
    if (expertProjectOnboardingCompletedkTab && activeTabID !== 3) {
      setActiveTabID(3)
    }
  }, [expertProjectOnboardingCompletedkTab])

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
          <ProjectsFilter
            addClass={"tour-projects-filter"}
            searchFunc={getVacanciesIncoming}
            data={vacanciesIncoming}
          />
          {mountExpertProjectsOnboarding ? (
            <FakeSortableBoard
              columns={[
                {
                  id: 1,
                  name: "Incoming",
                  placeholder: "Here are the projects you can take part in",
                },
                { id: 2, name: "Archive" },
                {
                  id: 3,
                  name: "Under consideration",
                  placeholder: "You show your interest in the project by moving the card to this column",
                },
                {
                  id: 4,
                  name: "Ready for work",
                  placeholder: "You show your agreement to take part in the project by moving the card to this column",
                },
              ]}
              data={expertProjectOnboardingAddInbound ? fakePmList : []}
              cardType={"projectCardExpert"}
              onAdd={() => {
                console.log("")
              }}
              userID={userID}
            />
          ) : (
            <SortableBoard
              columns={[
                { id: 1, name: "Incoming", placeholder: "Here are the projects you can take part in" },
                { id: 2, name: "Archive", placeholder: "Here are the projects you can take part in" },
                {
                  id: 3,
                  name: "Under consideration",
                  placeholder: "You show your interest in the project by moving the card to this column",
                },
                {
                  id: 4,
                  name: "Ready for work",
                  placeholder: "You show your agreement to take part in the project by moving the card to this column",
                },
              ]}
              cardType={"projectCardExpert"}
              userID={userID}
              data={incomingVacanciesData}
              isLoading={isFetching}
              onAdd={(evt, instance) => {
                const colNameTo = instance.options.group["name"]
                // const colNameFrom = evt.from.parentElement.dataset.col
                const cardID = +evt.item.dataset.id
                const currentProject = incomingVacanciesData?.filter((item) => item?.team_member?.id === cardID)
                let settableStatus = null
                switch (colNameTo) {
                  case "Archive":
                    settableStatus = -1
                    break
                  case "Under consideration": // 2 column
                    settableStatus = 1
                    break
                  case "Ready for work": // 3 column
                    settableStatus = 2
                    break
                }
                if (colNameTo === "Incoming") {
                  deleteTeamCandidate({ team_member_id: cardID })
                } else {
                  if (!settableStatus) return
                  setStatusVacancy({ executor_status: settableStatus, team_member_id: cardID }).then((res) => {
                    const projectName = currentProject?.length > 0 ? currentProject[0]?.order?.name : ""
                    const wait = colNameTo === "Ready for work" ? "Please wait for the PM's decision" : ""
                    addPopupNotification({
                      title: "Project selection",
                      txt: `You moved the project "${projectName}" to the "${colNameTo}" column ${wait}`,
                    })
                  })
                }
              }}
            />
          )}
        </>
      ) : activeTabID === 2 ? (
        <div className={styles["at-work"]}>
          <ProjectsAtWork
            projects={mountExpertProjectsAtWorkOnboarding ? fakeExpertProjects : projectsAtWork}
            offers={mountExpertProjectsAtWorkOnboarding ? fakeTeams : teams}
            setActiveTabID={setActiveTabID}
            atWorkType={"expert at work"}
            isLoading={projectsAtWork?.length ? isLoadingAtWork : false}
          />
        </div>
      ) : activeTabID === 3 ? (
        <div className={styles["at-work"]}>
          <ProjectsAtWork
            projects={expertProjectOnboardingCompletedkTab ? fakeExpertProjects : projectsFinished}
            offers={expertProjectOnboardingCompletedkTab ? fakeTeams : teams}
            setActiveTabID={setActiveTabID}
            isLoading={isLoadingAtWork}
            atWorkType={"expert finish"}
            isCompleted
          />
        </div>
      ) : (
        ""
      )}
    </>
  )
}

export default ProjectsExpert
