import Modal from "components/ui/Modal/Modal"
import styles from "../../ui/Modal/Modal.module.scss"
import React, { memo, useEffect, useMemo, useState } from "react"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import { useAppDispatch, useAppSelector } from "hooks"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { useRouter } from "next/router"
import { useAuth } from "hooks/useAuth"
import ReactTooltip from "react-tooltip"
import { useLazyGetTeamInfoQuery, useExitExpertFromTeamMutation, useDellPmTeamMutation } from "redux/api/pmteam"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import useUnmount from "hooks/useUnmount"
import {
  BACKEND_HOST,
  CHAT_TYPE_PRIVATE,
  CHAT_TYPE_TEAM,
  USER_TYPE_CUSTOMER,
  USER_TYPE_EXPERT,
  USER_TYPE_PM,
} from "utils/constants"
import DetailedPopupName from "components/DetailedPopup/DetailedPopupName/DetailedPopupName"
import IcontitleAndTags from "components/IcontitleAndTags/IcontitleAndTags"
import DetailedPopupDetails from "components/DetailedPopup/DetailedPopupDetails/DetailedPopupDetails"
import DetailedPopupPortfolio from "components/DetailedPopup/DetailedPopupPortfolio/DetailedPopupPortfolio"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import DetailedPopupProject from "components/DetailedPopup/DetailedPopupProject/DetailedPopupProject"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import PersonCard from "components/PersonCard/PersonCard"
import ConfirmPrompt from "components/ui/ConfirmPrompt/ConfirmPrompt"
import { seletCurrentTeam, updateCurrentTeam } from "redux/slices/currentTeam"
import ModalChat from "components/Modals/ModalChat/ModalChat"

interface Props {
  isOpen: boolean
  onClose: () => void
  modalName?: string
  modalType?: string
  closeOutside?: (param: HTMLElement) => boolean
  headerUserClickable?: boolean
  isChatHeader?: boolean
  localIndexObject?: any
  cardStatus?: any
}

const ModalPmTeam: React.FC<Props> = ({ isOpen, onClose, modalName = "modal-pm-team", modalType, closeOutside }) => {
  const {
    user: { id: userID, type: userType },
  } = useAuth()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)
  const [getTeamInfo, { data: pmTeamData, isFetching }] = useLazyGetTeamInfoQuery()
  const [exitFromTeam] = useExitExpertFromTeamMutation()
  const [dellTeam] = useDellPmTeamMutation()
  const { currentPmTeamID } = useAppSelector(selectApiParams)
  const { resetForm } = useAppSelector(seletCurrentTeam)
  useEffect(() => {
    ReactTooltip.rebuild()
    if (currentPmTeamID && isOpen) {
      getTeamInfo(currentPmTeamID)
    }
  }, [isOpen])

  useUnmount(() => {
    dispatch(updateApiParams({ field: "currentPmTeamID", data: null }))
  })

  const closeModalPmTeam = () => {
    onClose()
  }

  const [isChatOpen, setChatOpen] = useState<boolean>(false)
  const [activeId, setActiveId] = useState(1)

  const [linksTabsData, setLinksTabsData] = useState([
    { id: 1, txt: "Team Profile", count: 0 },
    { id: 2, txt: "Members", count: 0 },
  ])

  const expertExitFromTeam = (id) => {
    if (!id) return
    try {
      exitFromTeam({ teamId: id })
        .unwrap()
        .then((res) => {
          dispatch(updateApiParams({ field: "updateUserInfo", data: true }))
          onClose()
        })
    } catch (e) {
      console.log("ERR", e)
      dispatch(updateApiParams({ field: "updateUserInfo", data: false }))
      onClose()
    }
  }

  const deleteTeamFn = () => {
    if (!pmTeamData?.id) return
    try {
      dellTeam({ teamId: pmTeamData.id })
        .unwrap()
        .then((res) => {
          router.replace("/teams/create")
          dispatch(updateCurrentTeam({ field: "updateTeams", data: true }))
          dispatch(updateCurrentTeam({ field: "resetForm", data: resetForm + 1 }))
          onClose()
        })
    } catch (e) {
      dispatch(updateCurrentTeam({ field: "updateTeams", data: true }))
      onClose()
    }
  }

  const isExpertInTeam = useMemo(() => {
    return pmTeamData?.executors?.some((expert) => expert.id === userID && expert.status !== -1)
  }, [pmTeamData?.executors, userID])

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isFetching}
        name={modalName}
        closeOutside={closeOutside}
        isFooterExist={!(userType === USER_TYPE_EXPERT && !isExpertInTeam)}
        header={
          <DetailedPopupHeader
            name={`${pmTeamData?.name}`}
            onClose={closeModalPmTeam}
            headerUserClickable={false}
            img={pmTeamData?.avatar ? `${BACKEND_HOST}/${pmTeamData?.avatar}` : ""}
          />
        }
        additionalInfo={
          <DetailedPopupProject
            data={{
              teamMembers: pmTeamData?.member_count,
              teamRate: {
                min:
                  pmTeamData?.executors?.length > 0
                    ? Math.min(
                        ...pmTeamData?.executors.map((exec) => {
                          if (exec.job_roles?.length > 0) {
                            return Math.min(...exec.job_roles?.map((role) => role.hourly_pay))
                          } else {
                            return 0
                          }
                        })
                      )
                    : 0,
                max:
                  pmTeamData?.executors?.length > 0
                    ? Math.max(
                        ...pmTeamData?.executors.map((exec) => {
                          if (exec.job_roles?.length > 0) {
                            return Math.max(...exec.job_roles?.map((role) => role.hourly_pay))
                          } else {
                            return 0
                          }
                        })
                      )
                    : 0,
              },
              teamJobs: pmTeamData?.jobs_count,
              teamEarned: pmTeamData?.total_job_cost,
              teamCreated: pmTeamData?.created_at,
            }}
          />
        }
        footer={
          <div className={`${styles.footer__btns}`}>
            {userID === pmTeamData?.manager?.id && (
              <ConfirmPrompt
                btnIcon={"delete"}
                title={"Are you sure you want to remove this team?"}
                onClick={deleteTeamFn}
                dropMainBtnTxt={"Remove"}
                mod={"warning"}
              />
            )}
            {userType !== USER_TYPE_CUSTOMER && userType !== USER_TYPE_PM && (
              <ConfirmPrompt
                btnIcon={"signout"}
                title={"Are you sure you want to leave this team?"}
                onClick={() => {
                  expertExitFromTeam(pmTeamData.id)
                }}
                dropMainBtnTxt={"Leave"}
                mod={"warning"}
              />
            )}

            {pmTeamData?.executors?.filter((executor) => executor.id === userID) &&
              pmTeamData?.executors?.filter((executor) => executor.id === userID).length > 0 && (
                <DefaultBtn
                  // txt={"Team Chat"}
                  txt={
                    userID === pmTeamData?.manager?.id || pmTeamData?.executors?.some((user) => user.id === userID)
                      ? "Team chat"
                      : "Chat with PM"
                  }
                  // href={pmTeamData?.telegram_link || "#"}
                  addClass={styles["footer__btn-team-chat"]}
                  // isTargetBlank
                  mod={"transparent-grey"}
                  icon={"chat"}
                  // disabled={pmTeamData?.telegram_link ? undefined : true}
                  onClick={() => {
                    setChatOpen(true)
                    dispatch(openModal("modal-chat"))
                  }}
                />
              )}
          </div>
        }
      >
        <TabsLinear
          list={linksTabsData}
          activeId={activeId}
          onClick={(id) => {
            setActiveId(id)
          }}
        />
        <>
          {activeId === 1 && (
            <>
              {pmTeamData?.image && (
                <div className={`popup-body__section`}>
                  <DetailedPopupName cover={pmTeamData.image} />
                </div>
              )}
              {pmTeamData?.directions?.length > 0 && (
                <div className={`popup-body__section`}>
                  <h3 className={"popup-body__section-title"}>Directions & Categories</h3>
                  {pmTeamData.directions.map((el) => {
                    return (
                      <IcontitleAndTags
                        key={el.id}
                        addClass="iat"
                        title={el.name}
                        tags={pmTeamData.categories.filter((cat) => cat.project_direction_id === el.id)}
                        iconId={el.id}
                      />
                    )
                  })}
                </div>
              )}
              {pmTeamData?.description && modalType !== "user-info-header" && (
                <DetailedPopupDetails
                  defOpen={true}
                  addClass="popup-body__section"
                  description={pmTeamData?.description}
                />
              )}
              {pmTeamData?.links?.length > 0 && (
                <DetailedPopupPortfolio addClass="popup-body__section" portfolio={pmTeamData?.links} />
              )}
            </>
          )}
          {activeId === 2 && pmTeamData?.executors?.length > 0 && (
            <>
              <div className={`popup-body__section`}>
                <h3 className={"popup-body__section-title"}>Experts</h3>
                <div className="popup-body__cards-list">
                  {pmTeamData.executors.map((exec) => {
                    return (
                      <PersonCard
                        key={exec?.id}
                        userId={exec?.id}
                        avatar={exec?.avatar}
                        expertName={exec?.name}
                        surname={exec?.surname}
                        rating={exec?.rating}
                        expertJobRole={exec.job_roles?.length > 0 && exec.job_roles[0].name}
                        noFavorite={userID === exec?.id}
                      />
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </>
      </Modal>
      {isChatOpen && (
        <ModalChat
          isOpen={modalsList.includes("modal-chat")}
          onClose={() => {
            dispatch(closeModal("modal-chat"))
            setTimeout(() => {
              setChatOpen(false)
            }, 200)
          }}
          personID={pmTeamData?.manager?.id}
          modalName={`modal-chat-${pmTeamData?.manager?.id}`}
          chatType={
            userID === pmTeamData?.manager?.id || pmTeamData?.executors?.some((user) => user.id === userID)
              ? CHAT_TYPE_TEAM
              : CHAT_TYPE_PRIVATE
          }
          teamID={
            userID === pmTeamData?.manager?.id || pmTeamData?.executors?.some((user) => user.id === userID)
              ? pmTeamData?.id
              : null
          }
        />
      )}
    </>
  )
}

export default memo(ModalPmTeam)
