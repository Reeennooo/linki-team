import { useEffect, useState } from "react"
import TabsLinear from "../ui/TabsLinear/TabsLinear"
import {
  useGetProjectsFinishedQuery,
  useGetProjectsQuery,
  useLazyGetCandidatesQuery,
  useSetCandidatesStatusMutation,
} from "redux/api/project"
import ProjectSelection from "../ProjectSelection/ProjectSelection"
import SortableBoard from "../ui/SortableBoard/SortableBoard"
import { useAuth } from "hooks/useAuth"
import { useRouter } from "next/router"
import ProjectCard from "components/ProjectCard/ProjectCard"
import styles from "components/Projects/Projects.module.scss"
import ProjectsAtWork from "components/ProjectsAtWork/ProjectsAtWork"
import { useAppSelector } from "hooks"
import { selectonboardingRedux } from "redux/slices/onboarding"
import FakeSortableBoard from "components/ui/FakeSortableBoard/FakeSortableBoard"
import OnboardingTour from "components/OnboardingTour/OnboardingTour"
import { addPopupNotification } from "utils/addPopupNotification"

interface Props {
  props?: any
}

const ProjectsCustomer: React.FC<Props> = ({ props }) => {
  const {
    user: { id: userID },
  } = useAuth()
  const router = useRouter()

  const { data: projects, isLoading, isFetching: isFetchingProjects } = useGetProjectsQuery()
  const [getCandidates, { data: candidates, isFetching: isFetchingCandidates }] = useLazyGetCandidatesQuery()
  const [setStatusCandidate, resultStatus] = useSetCandidatesStatusMutation()
  const { data: projectsFinished, isFetching: isFetchingProjectsFinished } = useGetProjectsFinishedQuery()

  //ONBOARDING START STATE
  const { mountClientProjectsOnboarding } = useAppSelector(selectonboardingRedux)
  const { clientProjectOnboardingAddInbound } = useAppSelector(selectonboardingRedux)
  const { clientProjectOnboardingСonsideration } = useAppSelector(selectonboardingRedux)
  const { clientProjectOnboardingReady } = useAppSelector(selectonboardingRedux)
  const { clientProjectOnboardingReadyForWorkTab } = useAppSelector(selectonboardingRedux)
  const { clientProjectOnboardingCompletedkTab } = useAppSelector(selectonboardingRedux)

  const [dndData, setDndData] = useState([])
  const [activeId, setActiveTabID] = useState(router?.query?.tab ? Number(router.query.tab) : 1)
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [linksTabsData, setLinksTabsData] = useState([
    { id: 1, txt: "Responses", count: 0 },
    { id: 2, txt: "At Work", count: 0 },
    { id: 3, txt: "Completed", count: 0 },
    { id: 4, txt: "Drafts", count: 0 },
  ])
  const [projectsData, setProjectsData] = useState([])
  const [projectsAtWork, setProjectsAtWork] = useState([])
  const [projectsDraft, setProjectsDraft] = useState([])

  useEffect(() => {
    if (!projects?.length) {
      setProjectsData([])
      setProjectsAtWork([])
      setProjectsDraft([])
      setLinksTabsData([
        { id: 1, txt: "Responses", count: 0 },
        { id: 2, txt: "At Work", count: 0 },
        { id: 3, txt: "Completed", count: projectsFinished?.length || 0 },
        { id: 4, txt: "Draft", count: 0 },
      ])
      return
    }
    const responsesProjects = [...projects].filter((project) => project.status === 3)
    const atWorkProjects = [...projects].filter((project) => project.status === 4)
    const draftProjects = [...projects].filter((project) => project.status === 1)
    setProjectsData([...responsesProjects]?.reverse())
    setProjectsAtWork([...atWorkProjects]?.reverse())
    setProjectsDraft([...draftProjects]?.reverse())
    setActiveTaskId([...responsesProjects]?.reverse()[0]?.id)
    setLinksTabsData((prev) => {
      return [...prev].map((tab) => {
        switch (tab.id) {
          case 1:
            const resProjects = [...responsesProjects].filter((project) => project.candidate_statuses.length > 0)
            let tabCount = 0
            // убираем из расчета те candidate_statuses, у которых статус -1(у PM'а этот проект в архиве)
            resProjects.map((project) => {
              const candidateLength = project.candidate_statuses.filter(
                (candidate) => !Object.values(candidate).includes(-1)
              )?.length
              tabCount += candidateLength
            })
            tab.count = tabCount
            break
          case 2:
            tab.count = atWorkProjects.length
            break
          case 3:
            tab.count = projectsFinished?.length
            break
          case 4:
            tab.count = draftProjects.length
            break
        }
        return tab
      })
    })
  }, [projects, projectsFinished])

  useEffect(() => {
    if (isFetchingProjects || !projects?.length || !activeTaskId || activeId !== 1) return
    getCandidates({ order_id: activeTaskId })
  }, [projects, activeTaskId, getCandidates, isFetchingProjects, activeId])

  useEffect(() => {
    // console.log("candidates: ", candidates)
    setDndData(candidates)
  }, [setDndData, candidates])

  useEffect(() => {
    if (!router?.query?.tab || router?.query?.tab === "1") return
    router.push({
      query: { ...router.query, tab: activeId },
    })
  }, [])

  const fakePmList = [
    {
      column: clientProjectOnboardingСonsideration
        ? "Under consideration"
        : clientProjectOnboardingReady
        ? "Ready for work"
        : "Incoming",
      id: 1,
      manager: {
        avatar: "/img/onboarding/7.jpg",
        name: "Ivan T.",
        position: "Senior manager in manager",
      },
      status: clientProjectOnboardingReady ? 5 : 1,
      price: clientProjectOnboardingСonsideration || clientProjectOnboardingReady ? 15555 : null,
      manager_status: clientProjectOnboardingReady ? 2 : null,
      executor_status: clientProjectOnboardingReady ? 2 : null,
    },
    {
      column: clientProjectOnboardingReady ? "Ready for work" : "Incoming",
      id: 2,
      manager: {
        avatar: "/img/avatars/5.jpg",
        name: "Pavlina V.",
        position: "Senior manager in manager",
        price: "",
      },
      status: clientProjectOnboardingReady ? 5 : 1,
      price: clientProjectOnboardingReady ? 15555 : null,
      manager_status: clientProjectOnboardingReady ? 2 : null,
      executor_status: clientProjectOnboardingReady ? 2 : null,
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
    },
  ]

  const fakeClientsProjectsAtWork = [
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
      progress: clientProjectOnboardingCompletedkTab ? null : 15,
      manager: "Proj",
      manager_avatar: "/img/onboarding/7.jpg",
    },
  ]

  useEffect(() => {
    if (clientProjectOnboardingReadyForWorkTab && activeId !== 2) {
      setActiveTabID(2)
    }
    if (clientProjectOnboardingCompletedkTab && activeId !== 3) {
      setActiveTabID(3)
    }
  }, [clientProjectOnboardingReadyForWorkTab, clientProjectOnboardingCompletedkTab])

  return (
    <>
      <TabsLinear
        addClass="tour-client-prj-tabslinear"
        list={linksTabsData}
        activeId={activeId}
        onClick={(id) => {
          setActiveTabID(id)
          router.push({
            query: { ...router.query, tab: id },
          })
        }}
      />
      {activeId === 1 ? (
        <>
          <ProjectSelection
            data={projectsData}
            activeTaskId={activeTaskId}
            setActiveTaskId={setActiveTaskId}
            isLoading={isFetchingProjects}
            mobileTitle={"Project selection"}
            onboarding={mountClientProjectsOnboarding}
          />
          {mountClientProjectsOnboarding ? (
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
              data={clientProjectOnboardingAddInbound ? fakePmList : []}
              cardType={"humanCard"}
              onAdd={() => {
                console.log("")
              }}
              userID={userID}
            />
          ) : (
            <SortableBoard
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
              cardType={"humanCard"}
              data={dndData}
              isLoading={isFetchingCandidates}
              userID={userID}
              activeTaskId={activeTaskId}
              onAdd={(evt, instance) => {
                const colNameTo = instance.options.group["name"]
                const colNameFrom = evt.from.parentElement.dataset.col
                const cardID = +evt.item.dataset.id
                const candidate = candidates.filter((candidate) => candidate.manager.id === cardID)[0]
                const orderID = activeTaskId
                const managerID = candidate.manager.id
                let settableStatus = null
                switch (colNameTo) {
                  case "Archive": // 1 column
                    settableStatus = -2
                    break
                  case "Incoming": // 1 column
                    settableStatus = 1
                    break
                  case "Under consideration": // 2 column
                    settableStatus = colNameFrom === "Ready for work" ? 3 : 2
                    break
                  case "Ready for work": // 3 column
                    settableStatus = 4
                    break
                }
                if (!settableStatus) return
                setStatusCandidate({ manager_id: managerID, status: settableStatus, order_id: orderID }).then((res) => {
                  // @ts-ignore
                  const manager = res?.data[0]?.manager
                  if (manager) {
                    switch (colNameTo) {
                      case "Under consideration":
                        addPopupNotification({
                          title: "PM selection",
                          txt: `You moved ${manager.name} ${manager.surname} to the "Under consideration" column`,
                        })
                        // @ts-ignore
                        if (!res?.data[0]?.price) {
                          addPopupNotification({
                            title: "Offer",
                            txt: `PM compiles a suitable offer for your project, please wait`,
                            icon: "wait",
                            mod: "warning",
                          })
                        }
                        break
                      case "Ready for work":
                        addPopupNotification({
                          title: "PM selection",
                          txt: `You moved ${manager.name} ${manager.surname} to the "Ready for work" column, please wait for an agreement to work`,
                        })
                        break
                    }
                  }
                })
              }}
            />
          )}
        </>
      ) : activeId === 2 ? (
        <div className={styles["at-work"]}>
          <ProjectsAtWork
            onboarding={"atwork"}
            projects={mountClientProjectsOnboarding ? fakeClientsProjectsAtWork : projectsAtWork}
            // offers={teams}
            offers={null}
            setActiveTabID={setActiveTabID}
            atWorkType={"client at work"}
            hrefTails={"/projects/create"}
          />
        </div>
      ) : activeId === 3 ? (
        <div className={styles["at-work"]}>
          <ProjectsAtWork
            onboarding={"completed"}
            projects={mountClientProjectsOnboarding ? fakeClientsProjectsAtWork : projectsFinished}
            offers={null}
            setActiveTabID={setActiveTabID}
            atWorkType={"client finish"}
            isCompleted
            hrefTails={"/projects/create"}
          />
        </div>
      ) : activeId === 4 ? (
        <div className={styles["at-work"]}>
          <ProjectsAtWork
            projects={projectsDraft}
            offers={null}
            setActiveTabID={setActiveTabID}
            atWorkType={"client draft"}
            hrefTails={"/projects/create"}
          />
        </div>
      ) : (
        ""
      )}
    </>
  )
}

export default ProjectsCustomer
