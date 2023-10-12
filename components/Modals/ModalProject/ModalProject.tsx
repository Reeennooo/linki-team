import Modal from "components/ui/Modal/Modal"
import React, { useEffect, useState } from "react"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import styles from "../../ui/Modal/Modal.module.scss"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import { useAuth } from "hooks/useAuth"
import {
  useDeleteCandidateMutation,
  useLazyGetExactProjectQuery,
  useLazyGetManagerOffersQuery,
  useLazyGetOfferQuery,
  useSetCandidatesStatusMutation,
  useUpdateOfferMutation,
} from "redux/api/project"
import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import IconClock from "public/assets/svg/clock-2.svg"
import DetailedPopupName from "components/DetailedPopup/DetailedPopupName/DetailedPopupName"
import DetailedPopupDetails from "components/DetailedPopup/DetailedPopupDetails/DetailedPopupDetails"
import DetailedPopupFiles from "components/DetailedPopup/DetailedPopupFiles/DetailedPopupFiles"
import DetailedPopupCategory from "components/DetailedPopup/DetailedPopupCategory/DetailedPopupCategory"
import ModalOffer from "components/Modals/ModalOffer/ModalOffer"
import { useLazyGetUserQuery } from "redux/api/user"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import DetailedPopupSpecList from "components/DetailedPopup/DetailedPopupSpecList/DetailedPopupSpecList"
import DetailedTotalDaysAndSum from "components/DetailedPopup/DetailedTotalDaysAndSum/DetailedTotalDaysAndSum"
import { useAppDispatch, useAppSelector } from "hooks"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import DetailedPopupTotal from "components/DetailedPopup/DetailedPopupTotal/DetailedPopupTotal"
import { PERCENT_PM, PERCENT_SERVICE, PERCENT_VAT } from "utils/constants"
import RichText from "components/RichText/RichText"
import DetailedPopupProject from "components/DetailedPopup/DetailedPopupProject/DetailedPopupProject"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import PersonCard from "components/PersonCard/PersonCard"
import ModalProjectFooter from "components/Modals/ModalProject/ModalProjectFooter/ModalProjectFooter"
import Complain from "components/Complain/Complain"
import InputGroup from "components/ui/InputGroup/InputGroup"
import Link from "next/link"
import ReactTooltip from "react-tooltip"
import ModalEvaluate from "components/Modals/ModalEvaluate/ModalEvaluate"
import ModalChat from "components/Modals/ModalChat/ModalChat"
import { ChatTypeList } from "types/chat"
import { addPopupNotification } from "utils/addPopupNotification"

interface Props {
  isOpen: boolean
  onClose: () => void
  modalType?: string
  modalName?: string
  localIndexObject?: any
  closeOutside?: (param: HTMLElement) => boolean
  activeTabID?: number
  hasProjectInfo?: boolean
  isFooterExist?: boolean
}

const ModalProject: React.FC<Props> = ({
  isOpen,
  onClose,
  modalType,
  modalName = "modal-project",
  localIndexObject,
  closeOutside,
  activeTabID,
  hasProjectInfo,
  isFooterExist = true,
}) => {
  const {
    user: { id: userID },
  } = useAuth()
  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)
  const { projectID, currentUserID, getManagerOffers } = useAppSelector(selectApiParams)
  const [neighbourList, setNeighbourList] = useState([])
  const [projectStatus, setProjectStatus] = useState(null)
  const [setStatusProject, resultStatus] = useSetCandidatesStatusMutation()
  const [deleteCandidate, resultDelete] = useDeleteCandidateMutation()
  const [getManagerOffersLazy, { data: teams }] = useLazyGetManagerOffersQuery()

  const [getProject, { data: projectData, isFetching: isFetchingProject }] = useLazyGetExactProjectQuery()
  const [getUser, { data: userData, isFetching: isFetchingUser }] = useLazyGetUserQuery()
  const [getOffer, { data: offerData }] = useLazyGetOfferQuery()

  const [updateOffer, resultUpdateOffer] = useUpdateOfferMutation()

  const [isChatOpen, setChatOpen] = useState<boolean>(false)
  const [chatType, setChatType] = useState<ChatTypeList>(null)
  const [isLoading, setLoading] = useState(true)
  const [isTeamMemberExist, setTeamMemberExist] = useState<boolean>(false)
  const [isTeamJobsDone, setTeamJobsDone] = useState<boolean>(false)

  const [newDescr, setNewDescr] = useState(offerData?.description)
  const [offerIsSaving, setOfferIsSaving] = useState(false)

  const [editDeskrState, setEditDeskrState] = useState(false)
  // const [tgTeamLink, setTgTeamLink] = useState("")

  const [isWaitWide, setWaitWide] = useState<boolean>(true)
  const [isWaitTxtOpacity, setWaitTxtOpacity] = useState<boolean>(false)

  const [teamChatOrderID, setTeamChatOrderID] = useState<number>(null)

  const changeStatus = (status) => {
    if (status === 0) {
      deleteCandidate({ manager_id: userID, order_id: projectID })
    } else {
      setStatusProject({ manager_id: userID, status: status, order_id: projectID }).then((res) => {
        const colNameTo = status === 3 ? "Ready for work" : status === 1 || status === 2 ? "Under consideration" : ""
        if (status === -1) {
          addPopupNotification({
            title: "Project selection",
            txt: `You moved the project "${projectData?.name}" to the "Archive"`,
          })
        } else {
          addPopupNotification({
            title: "Project selection",
            txt: `You moved the project "${projectData?.name}" to the "${colNameTo}" column`,
          })
        }
      })
    }
    onClose()
  }

  useEffect(() => {
    ReactTooltip.rebuild()
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

  // useEffect(() => {
  //   if (!isOpen) {
  //     setTgTeamLink("")
  //   }
  // }, [isOpen])

  useEffect(() => {
    if (isOpen && projectID) {
      getProject(projectID)
      if (projectID !== projectData?.id) setLoading(true)
    }
  }, [projectID, isOpen])

  useEffect(() => {
    if (!projectData?.owner_id) return
    if (["client draft", "modal-project-info"].includes(modalType)) {
      setLoading(false)
      return
    }
    getUser(
      ["expert at work", "client at work", "client finish", "expert finish"].includes(modalType)
        ? currentUserID
        : projectData.owner_id
    )
  }, [projectData])

  useEffect(() => {
    if (!isFetchingUser) setLoading(false)
  }, [isFetchingUser])

  useEffect(() => {
    if (projectData) {
      const candidateStatus = projectData.candidate_statuses.find((obj) => obj.hasOwnProperty(userID))
      setProjectStatus(projectData.candidate_statuses.length && candidateStatus ? candidateStatus[userID] : null)
    }
  }, [projectData, userID])

  useEffect(() => {
    let newD = []
    localIndexObject?.map((col, index) => {
      if (col.ids?.includes(projectID)) newD = localIndexObject[index].ids
    })
    setNeighbourList(newD)
  }, [localIndexObject, projectID])

  const [activeId, setActiveId] = useState(1)
  const [linksTabsData, setLinksTabsData] = useState([
    {
      id: 1,
      txt: "Project Information",
      modalType: [
        "board",
        "pm at work",
        "expert at work",
        "client at work",
        "pm finish",
        "client finish",
        "expert finish",
      ],
    },
    { id: 2, txt: "Cooperation offer", modalType: ["board", "client at work", "client finish"] },
    {
      id: 3,
      txt: "Technical task",
      modalType: ["pm at work", "expert at work", "pm finish", "expert finish"],
    },
    { id: 4, txt: "Team & Budget", modalType: ["pm at work", "pm finish"] },
    { id: 5, txt: "Project team", modalType: ["expert at work", "expert finish"] },
  ])

  useEffect(() => {
    if (activeTabID) {
      setActiveId(activeTabID)
    } else {
      setActiveId(modalType === "board" ? 2 : 1)
    }
  }, [modalType, activeTabID])

  useEffect(() => {
    if (isOpen) {
      setLinksTabsData((prevState) => prevState.filter((tab) => tab.modalType.includes(modalType)))
    }
  }, [modalType, isOpen, activeTabID])

  const [updateData, setUpdateData] = useState(1)

  useEffect(() => {
    if (!projectID || !userID) return
    if (["client at work"].includes(modalType) && !currentUserID) return
    if (
      (modalType === "board" && projectStatus >= 3) ||
      ["client at work", "pm at work", "expert at work", "client finish", "pm finish", "expert finish"].includes(
        modalType
      )
    ) {
      getOffer({
        order_id: projectID,
        manager_id: ["expert at work", "client at work", "pm finish", "client finish", "expert finish"].includes(
          modalType
        )
          ? currentUserID
          : userID,
      })
    }
  }, [projectStatus, projectID, updateData])

  useEffect(() => {
    if (offerData) {
      setTeamMemberExist((offerData.team as any).filter((teammate) => teammate?.user?.id).length > 0)
      setTeamJobsDone((offerData.team as any).filter((teammate) => !teammate?.finished_at).length === 0)
      // setTgTeamLink(offerData.telegram_link)
    } else {
      setTeamMemberExist(false)
    }
  }, [offerData])

  const calculateTotalTeam = (team) => {
    let total = 0
    team?.length > 0 &&
      team.forEach((el) => {
        total = total + el.hours * el.salary_per_hour
      })
    return total
  }

  const sendUpdateOffer = async () => {
    if (offerData) {
      try {
        setOfferIsSaving(true)
        await updateOffer({
          days: offerData.days,
          description: offerData.description,
          id: offerData.id,
          work_description: newDescr,
          // telegram_link: tgTeamLink,
          price: offerData?.price,
          // team: offerData.team.map((el) => ({
          //   job_role_id: el.job_role_id,
          //   hours: el.hours,
          //   salary_per_hour: el.salary_per_hour,
          //   user_id: el?.user?.id,
          // })),
        })
          .unwrap()
          .then((res) => {
            onClose()
            getOffer({
              order_id: projectID,
              manager_id: userID,
            })
            dispatch(updateApiParams({ field: "activeProjectIDAtWork", data: projectID }))
            dispatch(updateApiParams({ field: "getManagerOffers", data: getManagerOffers }))
            getManagerOffersLazy(getManagerOffers)
          })
        setOfferIsSaving(false)
        setEditDeskrState(false)
      } catch (err) {
        onClose()
        setOfferIsSaving(false)
      }
    }
  }

  const finishProjectExpert = async () => {
    const teamMID = (offerData?.team as any).filter((jobRole) => jobRole.user?.id === userID)[0].id
    if (!teamMID) return
    dispatch(openModal("modal-evaluate"))
  }
  const finishProjectPM = async () => {
    dispatch(openModal("modal-evaluate"))
  }
  const finishProjectClient = async () => {
    dispatch(openModal("modal-evaluate"))
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        name={modalName}
        closeOutside={closeOutside}
        isLoading={isLoading}
        header={
          ["client draft", "modal-project-info"].includes(modalType) ? (
            <DetailedPopupHeader title={projectData?.name} onClose={onClose} headerUserClickable={false} />
          ) : (
            <DetailedPopupHeader
              img={userData?.avatar}
              name={userData?.name}
              surname={userData?.surname}
              id={userData?.id}
              rating={userData?.rating}
              chatLink={
                [
                  "client at work",
                  "client finish",
                  "pm at work",
                  "pm finish",
                  "expert at work",
                  "expert finish",
                ].includes(modalType) || projectStatus > 1
              }
              premiumSubscribe={userData?.premium_subscribe}
              onClose={onClose}
              onBtnChat={() => {
                setChatOpen(true)
                setChatType("private")
                dispatch(openModal("modal-chat"))
              }}
            />
          )
        }
        additionalInfo={
          ["modal-project-info", "client draft"].includes(modalType) ? (
            <DetailedPopupProject
              data={{
                status: ["client draft"].includes(modalType) ? "In draft" : "Manager search",
                created: projectData?.created_at,
                responses: projectData?.candidates_count,
              }}
            />
          ) : hasProjectInfo ? (
            <DetailedPopupProject
              data={{
                start: projectData?.started_at,
                days: offerData?.days,
                sum: offerData?.price,
                progress: !(["pm at work"].includes(modalType) && offerData?.work_description?.length <= 1),
              }}
              progressType={["client finish", "pm finish", "expert finish"].includes(modalType) ? "completed" : null}
            />
          ) : null
        }
        isFooterExist={projectData?.status !== 5}
        footer={
          isFooterExist ? (
            <>
              {modalType === "board" && (
                <>
                  {neighbourList.length > 1 && (
                    <div className={styles["footer__nav-btns"]}>
                      <button
                        type="button"
                        className={styles.arr}
                        disabled={neighbourList.findIndex((el) => el === projectID) === 0}
                        onClick={() => {
                          dispatch(
                            updateApiParams({
                              field: "projectID",
                              data: neighbourList[neighbourList.findIndex((el) => el === projectID) - 1],
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
                        disabled={neighbourList.findIndex((el) => el === projectID) === neighbourList.length - 1}
                        onClick={() => {
                          dispatch(
                            updateApiParams({
                              field: "projectID",
                              data: neighbourList[neighbourList.findIndex((el) => el === projectID) + 1],
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
                    className={`${styles.footer__btns} ${neighbourList.length < 2 ? styles["footer__btns--wide"] : ""}`}
                  >
                    {projectStatus === 1 && (
                      <div className={`${styles.footer__wait} ${isWaitWide ? styles["footer__wait--wide"] : ""}`}>
                        <span className={styles["footer__wait-icon"]} onClick={handlerWait}>
                          <IconClock />
                        </span>
                        <span
                          className={`${styles["footer__wait-txt"]} ${
                            isWaitTxtOpacity ? styles["footer__wait-txt--opacity"] : ""
                          }`}
                        >
                          Your request has been sent to the client for verification, please wait
                        </span>
                      </div>
                    )}
                    {projectStatus !== 1 && (
                      <Complain
                        isCheckboxes
                        title={"Complain about the project"}
                        subtitle={"Why do you want to complain about this project?"}
                        orderID={projectID}
                      />
                    )}
                    {projectStatus < 3 && projectStatus !== -1 && projectStatus !== -2 && (
                      <IconBtn
                        icon={"archive"}
                        dataFor={"global-tooltip"}
                        dataTip={"Add to archive"}
                        width={18}
                        height={18}
                        onClick={() => {
                          changeStatus(-1)
                        }}
                      />
                    )}
                    {projectStatus < 0 && (
                      <IconBtn
                        icon={"incoming"}
                        dataFor={"global-tooltip"}
                        dataTip={"Add to inbound"}
                        width={18}
                        height={18}
                        onClick={() => {
                          changeStatus(0)
                        }}
                      />
                    )}
                    {!projectStatus && (
                      <DefaultBtn
                        txt={"Respond"}
                        addClass={styles["footer__btn-respond"]}
                        onClick={() => {
                          changeStatus(1)
                        }}
                      />
                    )}
                    {(projectStatus === 2 || projectStatus === 3) && (
                      <DefaultBtn
                        txt={projectData?.offers?.includes(userID) ? "Edit offer" : "Edit offer"}
                        addClass={styles["footer__btn-edit-offer"]}
                        onClick={() => {
                          dispatch(updateApiParams({ field: "orderID", data: projectID }))
                          dispatch(openModal("modal-offer-inner"))
                        }}
                      />
                    )}
                    {projectStatus === 4 && (
                      <DefaultBtn
                        txt={"Start project"}
                        addClass={styles["footer__btn-start"]}
                        mod={"success"}
                        onClick={() => {
                          changeStatus(5)
                          addPopupNotification({
                            title: "Congratulations!",
                            txt: "You confirmed your willingness to work",
                            mod: "success",
                            icon: "check",
                          })
                        }}
                      />
                    )}
                  </div>
                </>
              )}
              {modalType === "pm at work" && (
                <div className={`${styles.footer__btns}`}>
                  {(offerData?.work_description?.length <= 1 || editDeskrState) && activeId === 3 && (
                    <DefaultBtn
                      txt={"Save"}
                      onClick={sendUpdateOffer}
                      disabled={newDescr === "<p></p>" || !newDescr || newDescr?.length < 1 || offerIsSaving}
                    />
                  )}
                  {offerData?.work_description.length >= 1 && activeId === 3 && !editDeskrState && (
                    <DefaultBtn
                      txt={"Edit description"}
                      addClass={styles["footer__btn-edit-descr"]}
                      onClick={() => setEditDeskrState(true)}
                    />
                  )}
                  {isTeamMemberExist && (
                    <DefaultBtn
                      txt={"Team Chat"}
                      addClass={styles["footer__btn-team-chat"]}
                      mod={"transparent-grey"}
                      icon={"chat"}
                      onClick={() => {
                        setTeamChatOrderID(projectID)
                        setChatType("work")
                        setChatOpen(true)
                        dispatch(openModal("modal-chat"))
                      }}
                    />
                  )}
                  {isTeamJobsDone && (
                    <DefaultBtn
                      txt={"Finish project"}
                      addClass={styles["footer__btn-finish"]}
                      onClick={finishProjectPM}
                    />
                  )}
                </div>
              )}
              {modalType === "expert at work" && (
                <div className={`${styles.footer__btns} ${styles["footer__btns--wide"]}`}>
                  <Complain
                    isCheckboxes
                    title={"Complain about the project"}
                    subtitle={"Why do you want to complain about this project?"}
                    orderID={projectID}
                  />
                  <DefaultBtn
                    txt={"Team Chat"}
                    addClass={styles["footer__btn-team-chat"]}
                    mod={"transparent-grey"}
                    icon={"chat"}
                    onClick={() => {
                      setTeamChatOrderID(projectID)
                      console.log("projectID: ", projectID)
                      setChatType("work")
                      setChatOpen(true)
                      dispatch(openModal("modal-chat"))
                    }}
                  />
                  <DefaultBtn
                    txt={"Finish project"}
                    addClass={styles["footer__btn-finish"]}
                    onClick={finishProjectExpert}
                  />
                </div>
              )}
              {modalType === "client at work" && (
                <div className={`${styles.footer__btns} ${styles["footer__btns--wide"]}`}>
                  <Complain orderID={projectID} />
                  <div
                    data-for={!projectData?.finished_at && "global-tooltip"}
                    data-place="top"
                    data-tip="Payment is possible only after confirmation by the project manager"
                  >
                    <DefaultBtn
                      txt={"Finish"}
                      addClass={styles["footer__btn-finish-and-pay"]}
                      disabled={!projectData?.finished_at}
                      onClick={finishProjectClient}
                    />
                  </div>
                </div>
              )}
              {["pm finish", "expert finish"].includes(modalType) && projectData?.status !== 5 && (
                <div className={`${styles.footer__btns} ${styles["footer__btns--alone"]}`}>
                  <DefaultBtn
                    txt={"Team Chat"}
                    mod={"transparent-grey"}
                    icon={"chat"}
                    onClick={() => {
                      setTeamChatOrderID(projectID)
                      setChatType("work")
                      setChatOpen(true)
                      dispatch(openModal("modal-chat"))
                    }}
                  />
                </div>
              )}
              {["client draft", "modal-project-info"].includes(modalType) && (
                <ModalProjectFooter modalType={modalType} project={projectData} onClose={onClose} />
              )}
            </>
          ) : (
            ""
          )
        }
      >
        {modalType === "board" && projectStatus >= 3 ? (
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
                {projectData?.name && (
                  <DetailedPopupName
                    addClass="popup-body__section"
                    name={projectData.name}
                    cover={projectData?.cover}
                    created_at={projectData?.created_at}
                    response={projectData?.candidates_count}
                  />
                )}
                {projectData?.description && (
                  <DetailedPopupDetails
                    defOpen={true}
                    addClass="popup-body__section"
                    description={projectData?.description}
                  />
                )}
                {projectData?.categories?.length > 0 && (
                  <DetailedPopupCategory addClass="popup-body__section" categories={projectData.categories} />
                )}
                {projectData?.media?.length > 0 && (
                  <DetailedPopupFiles addClass="popup-body__section" files={projectData.media} />
                )}
              </>
            )}
            {activeId === 2 && (
              <>
                {offerData?.team?.length > 0 && <DetailedPopupSpecList specList={offerData.team} />}
                {offerData?.days && offerData?.price && (
                  <DetailedTotalDaysAndSum sum={offerData?.price} days={offerData?.days} />
                )}
              </>
            )}
          </>
        ) : ["pm at work", "pm finish", "expert at work", "client at work", "client finish", "expert finish"].includes(
            modalType
          ) ? (
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
                {projectData?.name && (
                  <DetailedPopupName
                    addClass="popup-body__section"
                    name={projectData.name}
                    cover={projectData?.cover}
                    created_at={projectData?.created_at}
                  />
                )}
                {projectData?.description && (
                  <DetailedPopupDetails
                    defOpen={true}
                    addClass="popup-body__section"
                    description={projectData?.description}
                  />
                )}
                {projectData?.categories?.length > 0 && (
                  <DetailedPopupCategory addClass="popup-body__section" categories={projectData.categories} />
                )}
                {projectData?.media?.length > 0 && (
                  <DetailedPopupFiles addClass="popup-body__section" files={projectData.media} />
                )}
              </>
            )}
            {activeId === 2 && (
              <>
                {offerData?.team?.length > 0 && <DetailedPopupSpecList specList={offerData.team} />}
                {offerData?.days && offerData?.price && (
                  <DetailedTotalDaysAndSum sum={offerData?.price} days={offerData?.days} />
                )}
              </>
            )}
            {activeId === 3 && (
              <>
                {offerData?.work_description?.length > 1 && !editDeskrState && (
                  <DetailedPopupDetails
                    defOpen={true}
                    addClass="popup-body__section"
                    description={offerData?.work_description}
                    addTitle={"Description for project participants"}
                  />
                )}
                {(offerData?.work_description?.length <= 1 || editDeskrState) && (
                  <>
                    <div className={`popup-body__section`}>
                      <h3 className={`popup-body__section-title`}>Description for project participants</h3>
                      <p className={`popup-body__section-subtitle`}>
                        Describe below what each participant in this project needs to do
                      </p>
                      <RichText
                        mod={"sm"}
                        setDescriptionValue={setNewDescr}
                        initText={offerData?.work_description}
                        projectID={projectID}
                        modalType={modalType}
                      />
                    </div>
                    {/*<div className={`popup-body__section`}>*/}
                    {/*  <h3 className={`popup-body__section-title`}>Team chat</h3>*/}
                    {/*  <p className={`popup-body__section-subtitle`}>*/}
                    {/*    Create a group in Telegram and provide a link to it for the team to communicate*/}
                    {/*  </p>*/}
                    {/*  <InputGroup*/}
                    {/*    placeholder={"Group link"}*/}
                    {/*    type={"text"}*/}
                    {/*    fieldProps={{*/}
                    {/*      value: tgTeamLink || "",*/}
                    {/*      onChange: (e) => {*/}
                    {/*        setTgTeamLink(e.target.value)*/}
                    {/*      },*/}
                    {/*    }}*/}
                    {/*  />*/}
                    {/*</div>*/}
                  </>
                )}
                {offerData?.description && (
                  <DetailedPopupDetails
                    defOpen={true}
                    addClass="popup-body__section"
                    description={offerData?.description}
                    addTitle={"Description of the end result"}
                  />
                )}
                {/*{offerData?.telegram_link && (*/}
                {/*  <div className={`popup-body__section`}>*/}
                {/*    <h3 className={`popup-body__section-title`}>Team chat</h3>*/}
                {/*    <Link href={offerData.telegram_link}>*/}
                {/*      <a target={"_blank"}>{offerData.telegram_link}</a>*/}
                {/*    </Link>*/}
                {/*  </div>*/}
                {/*)}*/}
              </>
            )}
            {activeId === 4 && (
              <>
                <div className="popup-body__cards-list">
                  {offerData?.team?.length > 0 &&
                    offerData.team.map((expert) => {
                      return (
                        <PersonCard
                          userId={expert.user?.id}
                          key={expert.id}
                          rating={expert.user?.rating}
                          expertAvatar={expert.user?.main_image?.path}
                          expertName={expert.user?.name}
                          expertSurname={expert.user?.surname}
                          expertJobRole={expert.job_role}
                          area_expertise_id={expert.area_expertise_id}
                        />
                      )
                    })}
                </div>
                <DetailedPopupTotal
                  readonly={true}
                  totalTeamSum={calculateTotalTeam(offerData?.team)}
                  pmTotal={Math.round(calculateTotalTeam(offerData?.team) * PERCENT_PM)}
                  comission={Math.round(calculateTotalTeam(offerData?.team) * PERCENT_SERVICE)}
                  totalSum={offerData?.price}
                  period={offerData?.days}
                  vat={Math.round(
                    (calculateTotalTeam(offerData?.team) +
                      Math.round(calculateTotalTeam(offerData?.team) * PERCENT_PM) +
                      Math.round(calculateTotalTeam(offerData?.team) * PERCENT_SERVICE)) *
                      PERCENT_VAT
                  )}
                />
              </>
            )}
            {activeId === 5 && (
              <div className="popup-body__cards-list">
                {offerData?.team?.length > 0 &&
                  offerData.team.map((teamMember) => (
                    <PersonCard
                      key={teamMember.job_role_id}
                      userId={teamMember.user.id}
                      expertAvatar={teamMember.user.main_image?.path}
                      expertName={teamMember.user?.name}
                      surname={teamMember.user?.surname}
                      rating={teamMember.user?.rating}
                      expertJobRole={teamMember.job_role}
                    />
                  ))}
              </div>
            )}
          </>
        ) : (
          <>
            {projectData?.name && (
              <DetailedPopupName
                addClass="popup-body__section"
                name={["client draft", "modal-project-info"].includes(modalType) ? null : projectData.name}
                cover={projectData?.cover}
                isCoverAlways={["client draft"].includes(modalType) || null}
                created_at={["client draft", "modal-project-info"].includes(modalType) ? null : projectData?.created_at}
                response={
                  ["client draft", "modal-project-info"].includes(modalType) ? null : projectData?.candidates_count
                }
              />
            )}

            {projectData?.description && (
              <DetailedPopupDetails
                defOpen={true}
                addClass="popup-body__section"
                description={projectData?.description}
                addTitle={["client draft", "modal-project-info"].includes(modalType) ? "Description" : null}
              />
            )}
            {!projectData?.description && ["client draft"].includes(modalType) && (
              <div className={styles["modal-empty-section"]}>
                <h3 className={styles["modal-empty-section__title"]}>Description</h3>
                <p className={styles["modal-empty-section__txt"]}>No description</p>
              </div>
            )}

            {projectData?.categories?.length > 0 && (
              <DetailedPopupCategory addClass="popup-body__section" categories={projectData.categories} />
            )}
            {!projectData?.categories?.length && ["client draft"].includes(modalType) && (
              <div className={styles["modal-empty-section"]}>
                <h3 className={styles["modal-empty-section__title"]}>Category</h3>
                <p className={styles["modal-empty-section__txt"]}>No category</p>
              </div>
            )}

            {projectData?.media?.length > 0 && (
              <DetailedPopupFiles addClass="popup-body__section" files={projectData.media} />
            )}
            {!projectData?.media?.length && ["client draft"].includes(modalType) && (
              <div className={styles["modal-empty-section"]}>
                <h3 className={styles["modal-empty-section__title"]}>Files</h3>
                <p className={styles["modal-empty-section__txt"]}>No files</p>
              </div>
            )}
          </>
        )}
      </Modal>
      <ModalOffer
        isOpen={modalsList.includes("modal-offer-inner")}
        onClose={() => {
          dispatch(closeModal("modal-offer-inner"))
        }}
        managerID={userID}
        modalName={`modal-offer-inner`}
        setUpdateData={setUpdateData}
        cardStatus={projectStatus}
      />
      {isOpen && (
        <ModalEvaluate
          isOpen={modalsList.includes("modal-evaluate")}
          onClose={() => {
            dispatch(closeModal("modal-evaluate"))
          }}
          client={["pm at work"].includes(modalType) && userData}
          manager={["expert at work", "client at work"].includes(modalType) && userData}
          team={["pm at work"].includes(modalType) ? offerData?.team : undefined}
          orderID={
            ["expert at work"].includes(modalType)
              ? (offerData?.team as any)?.filter((jobRole) => jobRole.user?.id === userID)[0]?.id
              : projectID
          }
          modalType={modalType}
        />
      )}
      {isChatOpen && (
        <ModalChat
          isOpen={modalsList.includes("modal-chat")}
          onClose={() => {
            dispatch(closeModal("modal-chat"))
            setTimeout(() => {
              setChatOpen(false)
              setTeamChatOrderID(null)
            }, 200)
          }}
          personID={userData?.id}
          orderID={teamChatOrderID && projectData ? projectData.id : null}
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

export default ModalProject
