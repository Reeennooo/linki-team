import Modal from "components/ui/Modal/Modal"
import { useLazyGetUserQuery } from "redux/api/user"
import React, { memo, useEffect, useState } from "react"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import DetailedPopupDetails from "components/DetailedPopup/DetailedPopupDetails/DetailedPopupDetails"
import DetailedPopupPortfolio from "components/DetailedPopup/DetailedPopupPortfolio/DetailedPopupPortfolio"
import IcontitleAndTags from "components/IcontitleAndTags/IcontitleAndTags"
import DetailedPopupLangList from "components/DetailedPopup/DetailedPopupLangList/DetailedPopupLangList"
import styles from "components/ui/Modal/Modal.module.scss"
import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import {
  useLazyGetManagerOffersQuery,
  useLazyGetOfferQuery,
  useLazyGetPayQuery,
  useSetCandidatesStatusMutation,
  useStartProjectMutation,
} from "redux/api/project"
import ModalOffer from "components/Modals/ModalOffer/ModalOffer"
import { BACKEND_HOST, CHAT_TYPE_PRIVATE, PROJECT_STATUS_WORK, USER_TYPE_EXPERT } from "utils/constants"
import { useAppDispatch, useAppSelector } from "hooks"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { useRouter } from "next/router"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import { useAssignToJobMutation, useChangeManagerStatusMutation, useEditVacancyMutation } from "redux/api/team"
import { useAuth } from "hooks/useAuth"
import { OfferMember } from "types/project"
import Link from "next/link"
import ReactTooltip from "react-tooltip"
import ConfirmPrompt from "components/ui/ConfirmPrompt/ConfirmPrompt"
import ModalUserEmpty from "components/Modals/ModalUser/ModalUserEmpty/ModalUserEmpty"
import ModalUserBody from "components/Modals/ModalUser/ModalUserBody/ModalUserBody"
import TeamCard from "components/TeamCard/TeamCard"
import ModalPmTeam from "../ModalPmTeam/ModalPmTeam"
import ModalExclusive from "../ModalExclusive/ModalExclusive"
import ModalChat from "components/Modals/ModalChat/ModalChat"
import { addPopupNotification } from "utils/addPopupNotification"
import Section from "./ModalUserBody/ModalUserSections/Section"

interface Props {
  isOpen: boolean
  onClose: () => void
  modalName?: string
  modalType?: string
  closeOutside?: (param: HTMLElement) => boolean
  isFooterExist?: boolean
  headerUserClickable?: boolean
  isChatHeader?: boolean
  localIndexObject?: any
  cardStatus?: any
  btnSuccDisabled?: boolean
}

const ModalUser: React.FC<Props> = ({
  isOpen,
  onClose,
  modalName = "modal-user",
  modalType,
  closeOutside,
  isFooterExist = true,
  isChatHeader,
  headerUserClickable = true,
  localIndexObject,
  cardStatus,
  btnSuccDisabled = false,
}) => {
  const {
    user: { id: userID, type: userType },
  } = useAuth()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)
  const {
    projectID,
    currentUserID,
    activeProjectIDAtWork,
    activeTeamMemberIDVacancy,
    getManagerOffers: managersIDs,
    teamMemberID,
    modalJobRoleId,
    updateUserInfo,
  } = useAppSelector(selectApiParams)

  const [getUser, { data: userData, isFetching }] = useLazyGetUserQuery()
  const [setStatusCandidate, resultStatus] = useSetCandidatesStatusMutation()
  const [startProject, resultProject] = useStartProjectMutation()
  const [editVacancy, resultEditVacancy] = useEditVacancyMutation()
  const [getManagerOffers, { data: teams }] = useLazyGetManagerOffersQuery()
  const [getOffer, { data: offerData }] = useLazyGetOfferQuery()
  const [changeManagerStatus, resultManagerStatus] = useChangeManagerStatusMutation()
  const [assignToJob, resultAssignToJob] = useAssignToJobMutation()
  const [getPay, { data: payData }] = useLazyGetPayQuery()

  const [isChatOpen, setChatOpen] = useState<boolean>(false)
  const [neighbourList, setNeighbourList] = useState([])
  const [isVacancyDone, setVacancyDone] = useState<boolean>(false)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [isOpen])

  useEffect(() => {
    if (!updateUserInfo) return
    try {
      getUser(currentUserID)
        .unwrap()
        .then((res) => {
          dispatch(updateApiParams({ field: "updateUserInfo", data: false }))
        })
    } catch (e) {
      dispatch(updateApiParams({ field: "updateUserInfo", data: false }))
    }
  }, [updateUserInfo])

  useEffect(() => {
    if (!currentUserID) return
    if (isOpen) getUser(currentUserID)
    if (localIndexObject) {
      let newD = []
      localIndexObject?.map((col, index) => {
        if (col.ids?.includes(currentUserID)) newD = localIndexObject[index].ids
      })
      setNeighbourList(newD)
    }
  }, [getUser, currentUserID, isOpen])

  useEffect(() => {
    if (modalType === "humanCardPMAtWorkVacancy" && isOpen) {
      getOffer({ order_id: activeProjectIDAtWork, manager_id: userID })
    }
  }, [modalType, isOpen])

  const [isMobile, setMobile] = useState<boolean>(false)
  useEffect(() => {
    setMobile(window.innerWidth <= 767)
  }, [])

  useEffect(() => {
    if (modalType !== "humanCardPMAtWorkVacancy") {
      setVacancyDone(false)
      return
    }
    if (!offerData?.team || !activeTeamMemberIDVacancy) {
      setVacancyDone(false)
      return
    }
    const currentOffer: OfferMember = (offerData.team as any).filter(
      (teammate) => teammate.id === activeTeamMemberIDVacancy
    )[0]
    if (!currentOffer) {
      setVacancyDone(false)
      return
    }
    setVacancyDone(Boolean(currentOffer["finished_at"]))
  }, [activeTeamMemberIDVacancy, offerData, modalType])

  const closeModalUser = () => {
    onClose()
    //очищаем айди роли в редакс
    dispatch(updateApiParams({ field: "modalJobRoleId", data: null }))
  }

  const changeStatusCandidate = (status) => {
    if (modalType === "humanCardPMAtWork") {
      changeManagerStatus({
        team_member_id: teamMemberID,
        manager_status: status,
        executor_id: currentUserID,
      }).then(() => {
        if (status === 2) {
          addPopupNotification({
            title: "Expert selection",
            txt: `You moved ${userData?.name} ${userData?.surname} to the "Ready for work" column`,
          })
        }
      })
    } else {
      setStatusCandidate({ manager_id: currentUserID, status: status, order_id: projectID })
      if (status === 4) {
        addPopupNotification({
          title: "PM selection",
          txt: `You moved ${userData.name} ${userData.surname} to the "Ready for work" column, please wait for an agreement to work`,
        })
      } else if (status === -2) {
        addPopupNotification({
          title: "PM selection",
          txt: `You moved ${userData.name} ${userData.surname} to the "Archive"`,
        })
      } else {
        addPopupNotification({
          title: "PM selection",
          txt: `You moved ${userData.name} ${userData.surname} to the "Under consideration" column`,
        })
      }
    }
    closeModalUser()
  }
  const handleGetStarted = async () => {
    try {
      await assignToJob({
        team_member_id: teamMemberID,
        executor_id: currentUserID,
      })
        .unwrap()
        .then((res) => {
          getManagerOffers(managersIDs)
          dispatch(updateApiParams({ field: "activeVacancyIDAtWork", data: null }))
          onClose()
          addPopupNotification({
            title: "Congratulations!",
            txt: `You appointed ${userData.name} ${userData.surname} to the vacancy`,
            mod: "success",
            icon: "check",
          })
        })
    } catch (err) {
      console.error(err)
    }
  }
  // const handleStartProject = (status) => {
  //   startProject({ manager_id: currentUserID, project_id: projectID })
  //   closeModalUser()
  // }

  const deleteCandidate = async () => {
    const currentOffer: OfferMember = (offerData.team as any).filter(
      (teammate) => teammate.id === activeTeamMemberIDVacancy
    )[0]
    if (!currentOffer) return
    try {
      await editVacancy({
        hours: currentOffer.hours,
        job_role_id: currentOffer.job_role_id,
        salary: currentOffer.salary_per_hour,
        team_member_id: activeTeamMemberIDVacancy,
        user_id: null,
      })
        .unwrap()
        .then((res) => {
          getManagerOffers(managersIDs)
          onClose()
        })
    } catch (err) {
      console.log(`error ${err}`)
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isFetching}
        name={modalName}
        closeOutside={closeOutside}
        isFooterExist={isFooterExist && !isVacancyDone}
        header={
          <DetailedPopupHeader
            name={`${userData?.name ? userData?.name : ""} ${userData?.surname ? userData?.surname : ""}`}
            img={userData?.avatar}
            rating={userData?.rating}
            onClose={closeModalUser}
            chatLink={
              isChatHeader ||
              (modalType === "humanCardPMAtWork" &&
                cardStatus?.manager_status >= 1 &&
                cardStatus?.executor_status >= 1) ||
              ["humanCardPMAtWorkVacancy"].includes(modalType) ||
              cardStatus > 1
            }
            headerUserClickable={
              headerUserClickable || modalType === "humanCardPMAtWork" || modalType === "humanCardPMAtWorkVacancy"
            }
            premiumSubscribe={userData?.premium_subscribe}
            id={userData?.id}
            modalToOpen={"modal-user-in-modal-user"}
            onBtnChat={() => {
              setChatOpen(true)
              dispatch(openModal("modal-chat"))
            }}
          />
        }
        footer={
          isFooterExist ? (
            <>
              {neighbourList.length > 1 && (
                <div className={styles["footer__nav-btns"]}>
                  <button
                    type="button"
                    className={styles.arr}
                    disabled={neighbourList.findIndex((el) => el === currentUserID) === 0}
                    onClick={() => {
                      dispatch(
                        updateApiParams({
                          field: "currentUserID",
                          data: neighbourList[neighbourList.findIndex((el) => el === currentUserID) - 1],
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
                    disabled={neighbourList.findIndex((el) => el === currentUserID) === neighbourList.length - 1}
                    onClick={() => {
                      dispatch(
                        updateApiParams({
                          field: "currentUserID",
                          data: neighbourList[neighbourList.findIndex((el) => el === currentUserID) + 1],
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
                className={`${styles.footer__btns} ${neighbourList.length < 2 ? styles["footer__btns--wide"] : ""} ${
                  cardStatus > 3 || modalType === "humanCardPMAtWorkVacancy" ? styles["footer__btns--alone"] : ""
                }`}
              >
                {modalType === "humanCardPMAtWork" ? (
                  <>
                    {cardStatus?.manager_status !== 2 && (
                      <>
                        {cardStatus?.manager_status === 0 ? (
                          <IconBtn
                            icon={"archive"}
                            dataFor={"global-tooltip"}
                            dataTip={"Add to archive"}
                            width={18}
                            height={18}
                            onClick={() => {
                              changeStatusCandidate(-1)
                            }}
                          />
                        ) : (
                          <IconBtn
                            icon={"archive-tray"}
                            dataFor={"global-tooltip"}
                            dataTip={"Add to inbound"}
                            width={18}
                            height={18}
                            onClick={() => {
                              changeStatusCandidate(0)
                            }}
                          />
                        )}
                        <DefaultBtn
                          txt={"Ready for work"}
                          onClick={() => {
                            changeStatusCandidate(2)
                          }}
                        />
                      </>
                    )}
                    {cardStatus?.manager_status === 2 && (
                      <DefaultBtn
                        txt={"Get Started"}
                        disabled={cardStatus.executor_status !== 2}
                        mod={"success"}
                        onClick={handleGetStarted}
                      />
                    )}
                  </>
                ) : modalType === "humanCardPMAtWorkVacancy" && !isVacancyDone ? (
                  <ConfirmPrompt
                    title={"Are you sure you want to remove the expert from this project?"}
                    mainBtnTxt={"Delete"}
                    mainBtnTxtMod={"transparent-grey"}
                    onClick={deleteCandidate}
                  />
                ) : (
                  <>
                    {cardStatus < 4 && cardStatus !== -2 && (
                      <IconBtn
                        icon={"archive"}
                        dataFor={"global-tooltip"}
                        dataTip={"Add to archive"}
                        width={18}
                        height={18}
                        onClick={() => {
                          changeStatusCandidate(-2)
                        }}
                      />
                    )}
                    {cardStatus === 1 && (
                      <DefaultBtn
                        txt={"Under consideration"}
                        onClick={() => {
                          changeStatusCandidate(2)
                        }}
                      />
                    )}
                    {cardStatus < 0 && (
                      <IconBtn
                        icon={"incoming"}
                        dataFor={"global-tooltip"}
                        dataTip={"Add to inbound"}
                        width={18}
                        height={18}
                        onClick={() => {
                          changeStatusCandidate(1)
                        }}
                      />
                    )}
                    {cardStatus === 3 && (
                      <DefaultBtn
                        txt={isMobile ? "Offer" : "View offer"}
                        addClass={styles["footer__btn-offer"]}
                        mod={"transparent-grey"}
                        onClick={() => {
                          dispatch(updateApiParams({ field: "orderID", data: projectID }))
                          dispatch(openModal("modal-offer-in-user"))
                        }}
                      />
                    )}
                    {[2, 3].includes(cardStatus) && (
                      <DefaultBtn
                        txt={"Ready for work"}
                        addClass={styles["footer__btn-ready"]}
                        disabled={cardStatus === 2}
                        onClick={() => {
                          changeStatusCandidate(4)
                        }}
                      />
                    )}
                    {cardStatus === 4 && (
                      <DefaultBtn
                        txt={isMobile ? "Offer" : "View offer"}
                        onClick={() => {
                          dispatch(updateApiParams({ field: "orderID", data: projectID }))
                          dispatch(openModal("modal-offer-in-user"))
                        }}
                      />
                    )}
                    {cardStatus === 5 && (
                      <DefaultBtn
                        txt={"Start safe deal"}
                        mod={"success"}
                        onClick={() => {
                          if (projectID && userData?.id) {
                            closeModalUser()
                            getPay({ order_id: projectID, manager_id: userData?.id })
                          }
                        }}
                        disabled={btnSuccDisabled}
                      />
                    )}
                  </>
                )}
              </div>
              {modalType === "user-info-header" && (
                <DefaultBtn
                  txt={"Edit"}
                  addClass={styles["footer__btn-edit"]}
                  onClick={() => {
                    if (router.pathname === "/settings/profile") {
                      closeModalUser()
                    } else {
                      router.push("/settings/profile")
                    }
                  }}
                />
              )}
            </>
          ) : (
            ""
          )
        }
      >
        {userData?.manager_teams?.length > 0 && userType !== USER_TYPE_EXPERT && modalType !== "user-info-header" && (
          <Section title={"Teams"}>
            <div className={`popup-body__cards-list`}>
              {userData.manager_teams.map((team) => {
                return (
                  <TeamCard
                    key={team.id}
                    data={{ ...team, avatar: team.avatar ? `${BACKEND_HOST}/${team.avatar}` : null }}
                    type={"none"}
                    onClick={() => {
                      dispatch(updateApiParams({ field: "currentPmTeamID", data: team.id }))
                      dispatch(openModal("modal-pm-team-in-modal-user"))
                    }}
                  />
                )
              })}
            </div>
          </Section>
        )}

        {userData?.company?.links?.length > 0 && modalType !== "user-info-header" && (
          <DetailedPopupPortfolio
            companyTitle={userData?.company?.name}
            addClass="popup-body__section"
            portfolio={userData?.company?.links}
          />
        )}

        {(modalType === "humanCardPMAtWork" || modalType === "humanCardPMAtWorkVacancy") &&
          modalJobRoleId &&
          userData?.job_roles?.length > 0 && (
            <div className={`popup-body__section`}>
              <h3 className={"popup-body__section-title"}>Roles & Skills</h3>
              {userData.job_roles
                .filter((el) => el.id === modalJobRoleId)
                .map((job) => {
                  return (
                    <IcontitleAndTags
                      key={job.id}
                      addClass="iat"
                      title={job.name}
                      tags={job.skills}
                      iconId={job.area_expertise_id}
                      userType={2}
                      tagsName={"Skills"}
                      topBlockPrice={job.hourly_pay}
                    />
                  )
                })}
            </div>
          )}

        {userData?.project_directions?.length > 0 && modalType !== "user-info-header" && (
          <Section title={"Directions & Categories"}>
            {userData.project_directions.map((el) => {
              return (
                <IcontitleAndTags
                  key={el.id}
                  addClass="iat"
                  title={el.name}
                  tags={userData.project_categories.filter((cat) => cat.project_direction_id === el.id)}
                  iconId={el.id}
                />
              )
            })}
          </Section>
        )}
        {userData?.position && modalType !== "user-info-header" && (
          <DetailedPopupDetails defOpen={true} addClass="popup-body__section" description={userData?.position} />
        )}
        {userData?.links?.length > 0 && userData.type !== USER_TYPE_EXPERT && modalType !== "user-info-header" && (
          <DetailedPopupPortfolio addClass="popup-body__section" portfolio={userData?.links} />
        )}
        {/*{userData?.telegram_link && userData.type !== USER_TYPE_EXPERT && (*/}
        {/*  <div className={`popup-body__section`}>*/}
        {/*    <h3 className={"popup-body__section-title"}>Telegram link</h3>*/}
        {/*    <Link href={userData.telegram_link}>*/}
        {/*      <a target={"_blank"} className={styles["popup-body__link"]}>*/}
        {/*        {userData.telegram_link}*/}
        {/*      </a>*/}
        {/*    </Link>*/}
        {/*  </div>*/}
        {/*)}*/}
        {modalType !== "humanCardPMAtWork" &&
          modalType !== "humanCardPMAtWorkVacancy" &&
          userData?.job_roles?.length > 0 &&
          modalType !== "user-info-header" && (
            <div className={`popup-body__section`}>
              <h3 className={"popup-body__section-title"}>Directions & Categories</h3>
              {userData.job_roles.map((el) => {
                return (
                  <IcontitleAndTags
                    key={el.id}
                    addClass="iat"
                    title={el.name}
                    tags={el.skills}
                    iconId={el.area_expertise_id}
                    userType={2}
                    topBlockPrice={el.hourly_pay}
                  />
                )
              })}
            </div>
          )}

        {userData?.languages?.length > 0 && modalType !== "user-info-header" && (
          <Section title="Languages">
            <DetailedPopupLangList langList={userData.languages} />
          </Section>
        )}

        {userData?.timezone && modalType !== "user-info-header" && (
          <Section title="Timezone">
            <p className={"popup-body__p"}>{userData.timezone.code}</p>
          </Section>
        )}

        {modalType === "user-info-header" ? (
          <ModalUserBody userData={userData} />
        ) : !userData?.job_roles?.length &&
          !userData?.position &&
          !userData?.company?.links?.length &&
          !userData?.languages?.length &&
          !userData?.timezone &&
          !userData?.project_categories ? (
          <ModalUserEmpty
            list={[userData?.type === USER_TYPE_EXPERT ? "Roles & Skills" : null, "Details", "Languages", "Timezone"]}
          />
        ) : (
          ""
        )}
      </Modal>
      {modalType !== "user-info-header" && (
        <ModalOffer
          isOpen={modalsList.includes("modal-offer-in-user")}
          onClose={() => {
            dispatch(closeModal("modal-offer-in-user"))
          }}
          managerID={currentUserID}
          modalName={`modal-offer-in-user`}
          readonly={true}
          cardStatus={cardStatus}
          callbackClose={() => {
            onClose()
          }}
        />
      )}
      {headerUserClickable ||
        ((modalType === "humanCardPMAtWork" || modalType === "humanCardPMAtWorkVacancy") && (
          <ModalUser
            isOpen={modalsList.includes("modal-user-in-modal-user")}
            onClose={() => {
              dispatch(closeModal("modal-user-in-modal-user"))
            }}
            isFooterExist={false}
            headerUserClickable={false}
            isChatHeader={
              modalType === "humanCardPMAtWork" && cardStatus?.manager_status >= 1 && cardStatus?.executor_status >= 1
            }
            modalName={"modal-user-in-modal-user"}
          />
        ))}
      {userData?.manager_teams?.length > 0 && (
        <ModalPmTeam
          isOpen={modalsList.includes("modal-pm-team-in-modal-user")}
          onClose={() => {
            dispatch(closeModal("modal-pm-team-in-modal-user"))
          }}
          headerUserClickable={false}
          modalName={"modal-pm-team-in-modal-user"}
        />
      )}
      {userData?.manager_teams?.length > 0 && (
        <ModalExclusive
          isOpen={modalsList.includes("modal-exclusive-in-modal-user")}
          onClose={() => {
            dispatch(closeModal("modal-exclusive-in-modal-user"))
          }}
          headerUserClickable={false}
          modalName={"modal-exclusive-in-modal-user"}
          teams={userData?.manager_teams}
        />
      )}
      {isChatOpen && (
        <ModalChat
          isOpen={modalsList.includes("modal-chat")}
          onClose={() => {
            dispatch(closeModal("modal-chat"))
            setTimeout(() => {
              setChatOpen(false)
            }, 200)
          }}
          personID={userData?.id ?? null}
          // closeOutside={(target) => {
          //   return target.closest(".project-card__btn-chat") === null
          // }}
          chatType={CHAT_TYPE_PRIVATE}
        />
      )}
    </>
  )
}

export default memo(ModalUser)
