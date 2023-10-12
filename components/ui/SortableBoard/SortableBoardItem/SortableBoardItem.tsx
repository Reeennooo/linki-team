import ProjectCard from "components/ProjectCard/ProjectCard"
import HumanCard from "components/HumanCard/HumanCard"
import {
  useDeleteCandidateMutation,
  useLazyGetManagerOffersQuery,
  useLazyGetPayQuery,
  useSetCandidatesStatusMutation,
  useStartProjectMutation,
} from "redux/api/project"
import { useAppDispatch, useAppSelector } from "hooks"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import {
  useAssignToJobMutation,
  useChangeExecutorStatusMutation,
  useChangeManagerStatusMutation,
  useDeleteTeamCandidateMutation,
  useEditVacancyMutation,
} from "redux/api/team"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import { useRouter } from "next/router"
import { CHAT_TYPE_CUSTOMER_MANAGER, CHAT_TYPE_MANAGER_EXPERT, USER_TYPE_CUSTOMER, USER_TYPE_PM } from "utils/constants"
import { useAuth } from "hooks/useAuth"
import { addPopupNotification } from "utils/addPopupNotification"
import { useState } from "react"

interface Props {
  columnName: string
  cardType?: string
  item?: any
  userID?: number
  activeTaskId?: number
}

const SortableBoardItem: React.FC<Props> = ({ columnName, cardType, item, userID, activeTaskId }) => {
  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)
  const {
    getManagerOffers: managersIDs,
    teamMemberID,
    projectID,
    currentUserID,
    orderID,
    managerID,
    activeProjectIDAtWork,
  } = useAppSelector(selectApiParams)
  const {
    user: { type: userType },
  } = useAuth()
  const [setStatusProject, resultStatus] = useSetCandidatesStatusMutation()
  const [setStatusCandidate, resultStatusA] = useSetCandidatesStatusMutation()
  const [deleteCandidate, resultDelete] = useDeleteCandidateMutation()
  const [startProject, resultProject] = useStartProjectMutation()
  const [setStatusVacancy, resultStatusVacancy] = useChangeExecutorStatusMutation()
  const [deleteTeamCandidate, resultDeleteTeamCandidate] = useDeleteTeamCandidateMutation()
  const [changeManagerStatus, resultManagerStatus] = useChangeManagerStatusMutation()
  const [editVacancy, resultEditVacancy] = useEditVacancyMutation()
  const [getManagerOffers, { data: teams }] = useLazyGetManagerOffersQuery()
  const [getPay, { data: payData }] = useLazyGetPayQuery()
  const [assignToJob, resultAssignToJob] = useAssignToJobMutation()

  const router = useRouter()

  const handleAssignToJob = async () => {
    try {
      await assignToJob({
        team_member_id: item.team_member_id,
        executor_id: item.executor_id,
      })
        .unwrap()
        .then((res) => {
          getManagerOffers(managersIDs)
          dispatch(updateApiParams({ field: "activeVacancyIDAtWork", data: null }))
          addPopupNotification({
            title: "Congratulations!",
            txt: `You appointed ${item?.user?.name} ${item?.user?.surname} to the vacancy`,
            mod: "success",
            icon: "check",
          })
        })
    } catch (err) {
      console.error(err)
    }
  }

  const [disabledGetPay, setDisabledGetPay] = useState(false)

  return (
    <>
      {cardType === "projectCard" ? (
        <ProjectCard
          data={item}
          responses={
            (["Under consideration", "Ready for work"].includes(columnName) &&
              !item.candidate_statuses.filter(
                (candidate) => candidate.hasOwnProperty(userID) && candidate[userID] === 1
              ).length) ||
            !item.candidates_count
              ? null
              : item.candidates_count
          }
          isActive={
            (modalsList.includes("modal-project") && projectID === item.id) ||
            (modalsList.includes("modal-offer") && orderID === item.id)
          }
          wait={
            item.candidate_statuses.filter((candidate) => candidate.hasOwnProperty(userID) && candidate[userID] === 1)
              .length
              ? "Response under consideration"
              : item.candidate_statuses.filter(
                  (candidate) => candidate.hasOwnProperty(userID) && candidate[userID] === 3
                ).length
              ? "Waiting for a decision from the client"
              : null
          }
          headerBtn={columnName !== "Ready for work" ? columnName : null}
          headerBtnClick={() => {
            switch (columnName) {
              case "Incoming":
                setStatusProject({ manager_id: userID, status: -1, order_id: item.id })
                addPopupNotification({
                  title: "Project selection",
                  txt: `You moved the project "${item?.name}" to the "Archive"`,
                })
                break
              case "Archive":
                deleteCandidate({ manager_id: userID, order_id: item.id })
                break
              case "Under consideration":
                setStatusProject({ manager_id: userID, status: -1, order_id: item.id })
                break
            }
          }}
          isBtnOffer={
            item.candidate_statuses.filter((candidate) => candidate.hasOwnProperty(userID) && candidate[userID] === 2)
              .length > 0
          }
          isBtnChat={
            ["Under consideration", "Ready for work"].includes(columnName) &&
            !item.candidate_statuses.filter((candidate) => candidate.hasOwnProperty(userID) && candidate[userID] === 1)
              .length
          }
          chatLink={true}
          mod={"trans-border"}
          onClick={() => {
            if (modalsList.includes("modal-project")) {
              if (projectID === item.id) {
                dispatch(closeModal("modal-project"))
              } else {
                dispatch(updateApiParams({ field: "projectID", data: item.id }))
              }
            } else {
              dispatch(openModal("modal-project"))
              dispatch(updateApiParams({ field: "projectID", data: item.id }))
            }
          }}
          onClickBtnOffer={() => {
            if (modalsList.includes("modal-offer")) {
              if (orderID === item.id) {
                dispatch(closeModal("modal-offer"))
              } else {
                dispatch(updateApiParams({ field: "orderID", data: item.id }))
              }
            } else {
              dispatch(updateApiParams({ field: "orderID", data: item.id }))
              dispatch(openModal("modal-offer"))
            }
          }}
          chatType={CHAT_TYPE_CUSTOMER_MANAGER}
        />
      ) : cardType === "projectCardExpert" ? (
        <ProjectCard
          data={{ ...item.order }}
          isActive={modalsList.includes("modal-incoming-vacancy") && teamMemberID === item.team_member.id}
          price={item.team_member.hours * item.team_member.salary}
          started_at={item.order.started_at}
          responses={item?.team_member?.candidates_count > 0 ? item.team_member.candidates_count : null}
          mod={"trans-border"}
          headerBtn={columnName !== "Ready for work" ? columnName : null}
          headerBtnClick={() => {
            switch (columnName) {
              case "Incoming":
                setStatusVacancy({ executor_status: -1, team_member_id: item.team_member.id })
                addPopupNotification({
                  title: "Project selection",
                  txt: `You moved the project "${item?.order?.name}" to the "Archive"`,
                })
                break
              case "Archive":
                deleteTeamCandidate({ team_member_id: item.team_member.id })
                break
              case "Under consideration":
                setStatusVacancy({ executor_status: -1, team_member_id: item.team_member.id })
                break
            }
          }}
          wait={
            columnName === "Under consideration" &&
            (!item.work_candidate_statuses.manager_status || item.work_candidate_statuses.manager_status === 0) &&
            item.work_candidate_statuses.executor_status === 1
              ? "Response under consideration"
              : columnName === "Ready for work" &&
                item.work_candidate_statuses.executor_status === 2 &&
                item.work_candidate_statuses.manager_status < 2
              ? "Waiting for a decision from the PM"
              : null
          }
          isBtnChat={
            item.work_candidate_statuses.executor_status > 0 && item.work_candidate_statuses.manager_status > 0
          }
          chatType={CHAT_TYPE_MANAGER_EXPERT}
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                vacancy: item.team_member.id,
              },
            })
            if (modalsList.includes("modal-incoming-vacancy")) {
              if (teamMemberID === item.team_member.id) {
                dispatch(closeModal("modal-incoming-vacancy"))
              } else {
                dispatch(updateApiParams({ field: "teamMemberID", data: item.team_member.id }))
              }
            } else {
              dispatch(updateApiParams({ field: "teamMemberID", data: item.team_member.id }))
              dispatch(openModal("modal-incoming-vacancy"))
            }
          }}
        />
      ) : cardType === "humanCardPMAtWork" ? (
        <HumanCard
          data={{
            ...item.user,
            position: item.team_member.job_role,
            rating: item.user.rating,
          }}
          isActive={modalsList.includes("modal-user") && currentUserID === item.user.id}
          btnChat={columnName !== "Incoming" && columnName !== "Archive"}
          headerBtn={columnName !== "Ready for work" ? columnName : null}
          btnSuccess={item.manager_status === 2 ? "Get Started" : null}
          btnSuccessDisabled={item.manager_status === 2 && item.executor_status !== 2}
          onSuccessClick={handleAssignToJob}
          headerBtnClick={() => {
            switch (columnName) {
              case "Incoming":
                changeManagerStatus({
                  team_member_id: item.team_member.id,
                  manager_status: -1,
                  executor_id: item.executor_id,
                })
                break
              case "Archive":
                changeManagerStatus({
                  team_member_id: item.team_member.id,
                  manager_status: 0,
                  executor_id: item.executor_id,
                })
                break
              case "Under consideration":
                changeManagerStatus({
                  team_member_id: item.team_member.id,
                  manager_status: -1,
                  executor_id: item.executor_id,
                })
                break
            }
          }}
          onClick={() => {
            if (modalsList.includes("modal-user")) {
              if (currentUserID === item.user.id) {
                dispatch(closeModal("modal-user"))
              } else {
                dispatch(updateApiParams({ field: "currentUserID", data: item.user.id }))
                dispatch(updateApiParams({ field: "projectID", data: activeTaskId }))
                dispatch(updateApiParams({ field: "teamMemberID", data: item.team_member.id }))
              }
            } else {
              dispatch(updateApiParams({ field: "currentUserID", data: item.user.id }))
              dispatch(updateApiParams({ field: "projectID", data: activeTaskId }))
              dispatch(updateApiParams({ field: "teamMemberID", data: item.team_member.id }))
              dispatch(updateApiParams({ field: "modalJobRoleId", data: item?.team_member?.job_role_id }))
              dispatch(openModal("modal-user"))
            }
          }}
          chatType={CHAT_TYPE_MANAGER_EXPERT}
          orderID={activeProjectIDAtWork}
          wait={
            userType === USER_TYPE_PM && columnName === "Ready for work" && item.executor_status !== 2
              ? "Waiting for decision from the performer"
              : null
          }
        />
      ) : //--------------------------
      cardType === "humanCard" ? (
        <HumanCard
          data={item.manager}
          isActive={
            (modalsList.includes("modal-user") && currentUserID === item.manager.id) ||
            (modalsList.includes("modal-offer") && managerID === item.manager.id)
          }
          price={columnName !== "Incoming" && item.price}
          btnChat={columnName !== "Incoming" && columnName !== "Archive"}
          btnOffer={columnName !== "Incoming" && columnName !== "Archive" && item.price && item.status !== 5}
          btnSuccess={
            columnName === "Ready for work" &&
            (item.status === 5 || (item.manager_status === 2 && item.executor_status === 2))
              ? "Start safe deal"
              : null
          }
          headerBtn={columnName !== "Ready for work" ? columnName : null}
          headerBtnClick={() => {
            switch (columnName) {
              case "Incoming":
                setStatusCandidate({ manager_id: item.manager.id, status: -2, order_id: activeTaskId })
                addPopupNotification({
                  title: "Project selection",
                  txt: `You moved the project "${item?.manager?.name}" to the "Archive"`,
                })
                break
              case "Archive":
                setStatusCandidate({ manager_id: item.manager.id, status: 1, order_id: activeTaskId })
                break
              case "Under consideration":
                setStatusCandidate({ manager_id: item.manager.id, status: -2, order_id: activeTaskId })
                addPopupNotification({
                  title: "Project selection",
                  txt: `You moved the project "${item?.manager?.name}" to the "Archive"`,
                })
                break
            }
          }}
          onClick={() => {
            if (modalsList.includes("modal-user")) {
              if (currentUserID === item.manager.id) {
                dispatch(closeModal("modal-user"))
              } else {
                dispatch(updateApiParams({ field: "currentUserID", data: item.manager.id }))
                dispatch(updateApiParams({ field: "projectID", data: activeTaskId }))
              }
            } else {
              dispatch(updateApiParams({ field: "currentUserID", data: item.manager.id }))
              dispatch(updateApiParams({ field: "projectID", data: activeTaskId }))
              dispatch(openModal("modal-user"))
            }
          }}
          onClickBtnOffer={() => {
            if (modalsList.includes("modal-offer")) {
              if (orderID === activeTaskId) {
                dispatch(closeModal("modal-offer"))
              } else {
                dispatch(updateApiParams({ field: "managerID", data: item.manager.id }))
                dispatch(updateApiParams({ field: "projectID", data: activeTaskId }))
              }
            } else {
              dispatch(updateApiParams({ field: "orderID", data: activeTaskId }))
              dispatch(updateApiParams({ field: "managerID", data: item.manager.id }))
              dispatch(updateApiParams({ field: "projectID", data: activeTaskId }))
              dispatch(openModal("modal-offer"))
            }
          }}
          onSuccessClick={() => {
            console.log("TEST")
            if (activeTaskId && item.manager?.id) {
              try {
                setDisabledGetPay(true)
                getPay({ order_id: activeTaskId, manager_id: item.manager.id })
                  .unwrap()
                  .then((res) => {
                    setDisabledGetPay(false)
                  })
              } catch (e) {
                setDisabledGetPay(false)
              }
            }
            // startProject({ manager_id: item.manager.id, project_id: activeTaskId })
          }}
          btnSuccessDisabled={item?.invoice === "paid" || disabledGetPay}
          chatType={CHAT_TYPE_CUSTOMER_MANAGER}
          orderID={activeTaskId}
          wait={
            userType === USER_TYPE_CUSTOMER && columnName === "Under consideration" && !item?.price
              ? "Waiting for an offer from the PM"
              : userType === USER_TYPE_CUSTOMER && columnName === "Ready for work" && item?.price && item.status !== 5
              ? "Waiting for confirmation from the PM"
              : null
          }
        />
      ) : (
        ""
      )}
    </>
  )
}

export default SortableBoardItem
