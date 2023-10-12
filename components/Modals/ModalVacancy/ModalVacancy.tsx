import React, { useEffect, useState } from "react"
import Modal from "components/ui/Modal/Modal"
import { useChangeExecutorStatusMutation, useLazyGetVacancyQuery } from "redux/api/team"
import { useAppDispatch, useAppSelector } from "hooks"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import { useLazyGetUserQuery } from "redux/api/user"
import DetailedPopupProject from "components/DetailedPopup/DetailedPopupProject/DetailedPopupProject"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import DetailedPopupName from "components/DetailedPopup/DetailedPopupName/DetailedPopupName"
import DetailedPopupDetails from "components/DetailedPopup/DetailedPopupDetails/DetailedPopupDetails"
import DetailedPopupCategory from "components/DetailedPopup/DetailedPopupCategory/DetailedPopupCategory"
import DetailedPopupFiles from "components/DetailedPopup/DetailedPopupFiles/DetailedPopupFiles"
import styles from "components/ui/Modal/Modal.module.scss"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import IconClock from "public/assets/svg/clock-2.svg"
import Complain from "components/Complain/Complain"
import ReactTooltip from "react-tooltip"
import ModalChat from "components/Modals/ModalChat/ModalChat"
import { ChatTypeList } from "types/chat"
import { addPopupNotification } from "utils/addPopupNotification"

interface ModalVacancyProps {
  isOpen: boolean
  onClose: () => void
  closeOutside?: (param: HTMLElement) => boolean
  modalName?: string
  hasProjectInfo?: boolean
  localIndexObject?: any
}

const ModalVacancy: React.FC<ModalVacancyProps> = ({
  isOpen,
  onClose,
  closeOutside,
  modalName = "modal-vacancy",
  hasProjectInfo,
  localIndexObject,
}) => {
  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)
  const { teamMemberID } = useAppSelector(selectApiParams)

  const [getVacancy, { data: vacancyData, isFetching: isFetchingVacancy }] = useLazyGetVacancyQuery()
  const [getUser, { data: userData, isFetching: isFetchingUser }] = useLazyGetUserQuery()
  const [setStatusVacancy, resultStatus] = useChangeExecutorStatusMutation()

  const [isChatOpen, setChatOpen] = useState<boolean>(false)
  const [chatType, setChatType] = useState<ChatTypeList>(null)
  const [neighbourList, setNeighbourList] = useState([])
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [columnName, setColumnName] = useState<string>("")
  const [activeId, setActiveId] = useState(1)
  const [linksTabsData, setLinksTabsData] = useState([
    { id: 1, txt: "Project Information" },
    { id: 2, txt: "Technical task" },
  ])

  useEffect(() => {
    if (isOpen && teamMemberID) {
      getVacancy(teamMemberID)
      if (teamMemberID !== vacancyData?.team_member?.id) setLoading(true)
    }
  }, [teamMemberID, isOpen])

  useEffect(() => {
    if (!isFetchingUser) setLoading(false)
  }, [isFetchingUser])

  useEffect(() => {
    if (vacancyData?.team_member?.id) {
      getUser(vacancyData.order.manager_id)
      const vacancyStatusManager = vacancyData.work_candidate_statuses.manager_status
      const vacancyStatusExecutor = vacancyData.work_candidate_statuses.executor_status
      setIsWaiting(false)
      switch (vacancyStatusExecutor) {
        case -1:
          setColumnName("Archive")
          break
        case 1:
          setColumnName("Under consideration")
          if (vacancyStatusManager === 0) setIsWaiting(true)
          break
        case 2:
          setColumnName("Ready for work")
          if (vacancyStatusManager < 2) setIsWaiting(true)
          break
        default:
          setColumnName("Incoming")
      }
    }
  }, [vacancyData])

  useEffect(() => {
    let newD = []
    localIndexObject?.map((col, index) => {
      if (col.ids?.includes(teamMemberID)) newD = localIndexObject[index].ids
    })
    setNeighbourList(newD)
  }, [localIndexObject, teamMemberID])

  const [isLoading, setLoading] = useState(true)

  const changeStatus = (status) => {
    setStatusVacancy({ executor_status: status, team_member_id: teamMemberID }).then((res) => {
      const colNameTo = status === 2 ? "Ready for work" : status === 1 ? "Under consideration" : ""
      const wait = status === 2 ? "Please wait for the PM's decision" : ""
      if (status === -1) {
        addPopupNotification({
          title: "Project selection",
          txt: `You moved the project "${vacancyData?.order?.name}" to the "Archive"`,
        })
      } else {
        addPopupNotification({
          title: "Project selection",
          txt: `You moved the project "${vacancyData?.order?.name}" to the "${colNameTo}" column. ${wait}`,
        })
      }
    })
    onClose()
  }

  const [isWaitWide, setWaitWide] = useState<boolean>(true)
  const [isWaitTxtOpacity, setWaitTxtOpacity] = useState<boolean>(false)

  useEffect(() => {
    if (!isOpen) return
    if (window.innerWidth >= 768) return
    setTimeout(() => {
      setWaitWide(false)
    }, 5000)
    setTimeout(() => {
      setWaitTxtOpacity(true)
    }, 5200)
  }, [isOpen])

  const handlerWait = () => {
    if (window.innerWidth >= 768) return
    setWaitTxtOpacity((prev) => !prev)
    setTimeout(() => {
      setWaitWide((prev) => !prev)
    }, 200)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOutside={closeOutside}
        isLoading={isLoading}
        name={modalName}
        header={
          <DetailedPopupHeader
            img={userData?.avatar}
            name={userData?.name}
            id={userData?.id}
            rating={userData?.rating}
            chatLink={columnName !== "Archive" && columnName !== "Incoming" && !isWaiting}
            onClose={onClose}
            onBtnChat={() => {
              setChatOpen(true)
              setChatType("private")
              dispatch(openModal("modal-chat"))
            }}
          />
        }
        additionalInfo={
          hasProjectInfo ? (
            <DetailedPopupProject
              data={{
                salary: vacancyData?.team_member?.salary,
                hours: vacancyData?.team_member?.hours,
              }}
            />
          ) : null
        }
        isFooterExist={!(columnName === "Ready for work" && !isWaiting)}
        footer={
          <>
            {neighbourList.length > 1 && !isWaiting && (
              <div className={styles["footer__nav-btns"]}>
                <button
                  type="button"
                  className={styles.arr}
                  disabled={neighbourList.findIndex((el) => el === teamMemberID) === 0}
                  onClick={() => {
                    dispatch(
                      updateApiParams({
                        field: "teamMemberID",
                        data: neighbourList[neighbourList.findIndex((el) => el === teamMemberID) - 1],
                      })
                    )
                  }}
                >
                  <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 20.9998L1 10.9998L11 0.999756" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`${styles.arr} ${styles["arr--right"]}`}
                  disabled={neighbourList.findIndex((el) => el === teamMemberID) === neighbourList.length - 1}
                  onClick={() => {
                    dispatch(
                      updateApiParams({
                        field: "teamMemberID",
                        data: neighbourList[neighbourList.findIndex((el) => el === teamMemberID) + 1],
                      })
                    )
                  }}
                >
                  <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 0.999756L11 10.9998L1 20.9998" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
            <div
              className={`${styles.footer__btns} ${
                neighbourList.length < 2 || (isWaiting && columnName === "Ready for work")
                  ? styles["footer__btns--wide"]
                  : ""
              }`}
            >
              {!isWaiting && <Complain orderID={vacancyData?.order.id} isCheckboxes />}
              {isWaiting && (
                <div className={`${styles.footer__wait} ${isWaitWide ? styles["footer__wait--wide"] : ""}`}>
                  <span className={styles["footer__wait-icon"]} onClick={handlerWait}>
                    <IconClock />
                  </span>
                  <span
                    className={`${styles["footer__wait-txt"]} ${
                      isWaitTxtOpacity ? styles["footer__wait-txt--opacity"] : ""
                    }`}
                  >
                    {columnName === "Under consideration"
                      ? "When the manager confirms your candidacy, you will have a chat button"
                      : "Your request has been sent to the project manager, please wait"}
                  </span>
                </div>
              )}
              {(columnName === "Incoming" || columnName === "Under consideration") && (
                <IconBtn
                  icon={"archive"}
                  width={18}
                  height={18}
                  onClick={() => {
                    changeStatus(-1)
                  }}
                />
              )}
              {columnName !== "Ready for work" && (
                <DefaultBtn
                  txt={"Ready for work"}
                  addClass={styles["footer__btn-ready"]}
                  onClick={() => {
                    changeStatus(2)
                  }}
                />
              )}
            </div>
          </>
        }
      >
        <>
          <TabsLinear
            list={linksTabsData}
            activeId={activeId}
            onClick={(id) => {
              setActiveId(id)
            }}
          />
          {activeId === 1 && (
            <>
              {vacancyData?.order?.name && (
                <DetailedPopupName
                  addClass="popup-body__section"
                  name={vacancyData?.order?.name}
                  cover={vacancyData?.order?.cover}
                  created_at={vacancyData?.order?.started_at}
                  response={vacancyData?.team_member?.candidates_count}
                />
              )}

              {vacancyData?.order?.description && (
                <DetailedPopupDetails
                  defOpen={true}
                  addClass="popup-body__section"
                  description={vacancyData.order.description}
                />
              )}
              {vacancyData?.order?.categories?.length > 0 && (
                <DetailedPopupCategory
                  title={"Category"}
                  addClass="popup-body__section"
                  categories={vacancyData.order.categories}
                />
              )}
              {vacancyData?.order?.media?.length > 0 && (
                <DetailedPopupFiles addClass="popup-body__section" files={vacancyData?.order?.media} />
              )}
            </>
          )}
          {activeId === 2 && (
            <>
              {vacancyData?.offer?.description?.length > 1 && (
                <DetailedPopupDetails
                  defOpen={true}
                  addClass="popup-body__section"
                  description={vacancyData?.offer?.description}
                  addTitle={"Description of the end result"}
                />
              )}
              {vacancyData?.offer?.work_description?.length > 1 && (
                <DetailedPopupDetails
                  defOpen={true}
                  addClass="popup-body__section"
                  description={vacancyData?.offer?.work_description}
                  addTitle={"Description for project participants"}
                />
              )}
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
          personID={userData?.id}
          modalName={`modal-chat-${userData?.id}`}
          chatType={chatType}
          // closeOutside={(target) => {
          //   return target.closest(".project-card__btn-chat") === null
          // }}
        />
      )}
    </>
  )
}

export default ModalVacancy
