import styles from "./ProjectCard.module.scss"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import ProgressBar from "components/ProgressBar/ProgressBar"
import React, { useEffect, useRef, useState } from "react"
import moment from "moment"
import { useAuth } from "hooks/useAuth"
import IconChat from "public/assets/svg/chat.svg"
import IconArchive from "public/assets/svg/archive-box-sm.svg"
import IconUser from "public/assets/svg/user.svg"
import IconArchiveTray from "public/assets/svg/archive-tray.svg"
import { IProjectCard } from "types/project"
import { ITeammate } from "types/team"
import { useSetCandidatesStatusMutation } from "redux/api/project"
import { numberFormat } from "utils/formatters"
import { BACKEND_HOST, USER_TYPE_CUSTOMER, USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"
import ProgressLine from "components/ProgressLine/ProgressLine"
import ProjectCardCompleted from "components/ProjectCard/ProjectCardCompleted/ProjectCardCompleted"
import { useRouter } from "next/router"
import ReactTooltip from "react-tooltip"
import Image from "next/image"
import ModalChat from "components/Modals/ModalChat/ModalChat"
import { useAppDispatch, useAppSelector } from "hooks"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { ChatTypeList } from "types/chat"
import StatusBar from "components/ui/StatusBar/StatusBar"
import { addPopupNotification } from "utils/addPopupNotification"
import UseWindowSize from "hooks/useWindowSIze"

interface Props {
  data?: IProjectCard
  team?: ITeammate[]
  activeTabType?: string
  wait?: string | null
  price?: number
  started_at?: string
  durationDays?: number
  responses?: number
  responsesStyle?: boolean
  headerNextLink?: boolean
  onClickBtnNext?: () => void
  props?: any
  addClass?: string
  mod?: string
  isActive?: boolean
  isCompleted?: boolean
  isDraft?: boolean
  headerBtn?: string
  headerBtnClick?: () => void
  isBtnOffer?: boolean
  isBtnChat?: boolean
  chatLink?: string | boolean
  chatType?: ChatTypeList
  isBtnEditDesc?: boolean
  mainBtn?: string
  isMainBtnDisabled?: boolean
  onClickBtnMain?: () => void
  onClickBtnChat?: () => void
  onClick?: () => void
  onClickBtnOffer?: () => void
  onClickBtnStartProject?: () => void
  onClickBtnEditDesc?: () => void
  person?: {
    avatar: string
    name: string
    surname: string
  }
  isBtnShortMob?: boolean
}

const ProjectCard: React.FC<Props> = ({
  data,
  team,
  activeTabType,
  wait,
  price,
  started_at,
  durationDays,
  responses,
  responsesStyle,
  addClass,
  mod,
  isActive,
  isCompleted,
  isDraft,
  onClick,
  headerBtn,
  headerBtnClick,
  headerNextLink,
  onClickBtnNext,
  isBtnOffer,
  isBtnChat,
  chatLink,
  chatType,
  isBtnEditDesc,
  mainBtn,
  isMainBtnDisabled,
  onClickBtnMain,
  onClickBtnChat,
  onClickBtnOffer,
  onClickBtnStartProject,
  onClickBtnEditDesc,
  person,
  isBtnShortMob,
  ...props
}) => {
  const { user } = useAuth()
  const [setStatusProject, resultStatus] = useSetCandidatesStatusMutation()

  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)

  const router = useRouter()

  const [width, height] = UseWindowSize()

  function renderBtnChat(width) {
    if (width < 767 && isBtnOffer && router.pathname === "/dashboard") {
    } else if (
      width < 767 &&
      data.candidate_statuses?.filter((candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 4)
        ?.length > 0 &&
      router.pathname === "/dashboard"
    ) {
    } else if (isBtnChat) {
      return (
        <DefaultBtn
          txt={"Chat"}
          mod={"transparent-grey"}
          addClass={`project-card__btn-chat ${styles["project-card__btn"]} ${styles["project-card__btn-chat"]}`}
          icon={"chat"}
          minWidth={false}
          size={"md"}
          onClick={() => {
            if (onClickBtnChat) onClickBtnChat()
            if (modalsList.includes("modal-chat")) {
              dispatch(closeModal("modal-chat"))
              setChatOpen(false)
            } else {
              dispatch(openModal("modal-chat"))
              setChatOpen(true)
            }
          }}
        />
      )
    }
  }

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const emptyCardImgSelector = () => {
    switch (user.type) {
      case USER_TYPE_CUSTOMER:
        return <img src="/img/ProjectCard/x2empty-card-min.png" alt="" />
      case USER_TYPE_EXPERT:
        return <img src="/img/ProjectCard/x2empty-card-2-min.png" alt="" />
      case USER_TYPE_PM:
        return <img src="/img/ProjectCard/x2empty-card-2-min.png" alt="" />
    }
  }
  const emptyCardTitleSelector = () => {
    switch (user.type) {
      case USER_TYPE_CUSTOMER:
        return (
          <div className={`${styles["project-card__empty-title"]}`}>You don&apos;t have any active contracts yet</div>
        )
      case USER_TYPE_EXPERT:
      case USER_TYPE_PM:
        return <div className={`${styles["project-card__empty-title-expert"]}`}>Project not selected</div>
    }
  }
  const emptyCardTxtSelector = () => {
    switch (user.type) {
      case USER_TYPE_CUSTOMER:
        return null
      case USER_TYPE_EXPERT:
      case USER_TYPE_PM:
        return (
          <div className={`${styles["project-card__empty-txt"]}`}>
            Here are the projects you have shown interest in.
          </div>
        )
    }
  }
  const emptyCardBtnSelector = () => {
    switch (user.type) {
      case USER_TYPE_CUSTOMER:
        return (
          <button className={`${styles["project-card__empty-btn"]}`} onClick={() => router.push("/projects/create")}>
            <span className={`${styles["project-card__empty-btn-plus"]}`}></span>
            <span>Post project</span>
          </button>
        )
      case USER_TYPE_EXPERT:
        return null
    }
  }

  const btnOfferRef = useRef()
  const cardRef = useRef()

  const modList = mod
    ?.split(",")
    .map((cl) => {
      const clName = cl.replace(/\s/g, "")
      return styles["project-card--" + clName]
    })
    .join(" ")

  const emptyCardPaddingSelector = () => {
    switch (user.type) {
      case USER_TYPE_CUSTOMER:
        return styles["project-card--empty-customer"]
      case USER_TYPE_EXPERT:
        return styles["project-card--empty-expert"]
      case USER_TYPE_PM:
        return styles["project-card--empty-pm"]
    }
  }

  const projectClasses = [
    "project-card",
    styles["project-card"],
    data ? "" : emptyCardPaddingSelector(),
    addClass ? addClass : "",
    modList ? modList : "",
    isActive ? styles["project-card--is-active"] : "",
    isBtnShortMob ? styles["project-card--is-btn-short-mob"] : "",
  ].join(" ")

  const teamCount = () => {
    if (!team) return null
    let count = 0
    team.forEach((teammate) => {
      count = count + teammate.candidates_count
    })
    return <>{count}</>
  }
  const deadlineDate =
    data?.started_at && durationDays
      ? moment(data.started_at, "DD.MM.YYYY").add(durationDays, "days").format("MMM D YYYY")
      : null
  const daysRemain = deadlineDate
    ? moment.duration(moment(deadlineDate, "MMM D YYYY").diff(moment().startOf("day"))).asDays()
    : null
  const progressCount = deadlineDate
    ? daysRemain <= 0
      ? 100
      : 100 - Math.floor((daysRemain * 100) / durationDays)
    : null

  const [isChatOpen, setChatOpen] = useState<boolean>(false)

  return (
    <>
      <div
        ref={cardRef}
        className={projectClasses}
        {...props}
        onClick={(e) => {
          const isButton = (e.target as HTMLElement).closest<HTMLElement>("button") as HTMLButtonElement
          const isLink = (e.target as HTMLElement).closest<HTMLElement>("a") as HTMLLinkElement
          if (isButton) {
            e.preventDefault()
            return
          }
          if (!isLink && onClick) onClick()
          if (!data) {
            if (user.type === USER_TYPE_CUSTOMER) {
              router.push("/projects/create")
            } else {
              router.push("/projects")
            }
          }
        }}
      >
        {data ? (
          <>
            <div className={`${styles["project-card__header"]} project-card__header`}>
              {started_at ? (
                <div className={`${styles["project-card__created"]}`}>
                  <span>{moment(started_at, "DD.MM.YYYY").format("MMM D")}</span>
                </div>
              ) : data.created_at ? (
                <div className={`${styles["project-card__created"]}`}>
                  <span>{moment(data.created_at, "DD.MM.YYYY").format("MMM D")}</span>
                </div>
              ) : (
                ""
              )}
              {headerNextLink ? (
                <button
                  type={"button"}
                  onClick={() => {
                    if (onClickBtnNext) onClickBtnNext()
                  }}
                  className={`project-card__btn-next ${styles["project-card__btn-next"]}`}
                >
                  <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.690857 0.853022C0.875587 0.647767 1.19173 0.631128 1.39699 0.815857L4.52199 3.62836C4.62734 3.72318 4.6875 3.85826 4.6875 4C4.6875 4.14175 4.62734 4.27683 4.52199 4.37165L1.39699 7.18415C1.19173 7.36888 0.875587 7.35224 0.690857 7.14699C0.506128 6.94173 0.522767 6.62559 0.728022 6.44086L3.44008 4L0.728022 1.55915C0.522767 1.37442 0.506128 1.05828 0.690857 0.853022Z"
                    />
                  </svg>
                </button>
              ) : (
                ""
              )}
              {headerBtn && (
                <button
                  className={styles["project-card__header-btn"]}
                  data-for="global-tooltip"
                  data-tip={
                    headerBtn === "Incoming" || headerBtn === "Under consideration"
                      ? "Add to archive"
                      : "Add to inbound"
                  }
                  // - --
                  data-place={"top"}
                  onClick={() => {
                    if (headerBtnClick) headerBtnClick()
                    addPopupNotification({
                      title: "Project selection",
                      txt: `You moved the project "${data?.name}" to the "Archive"`,
                    })
                  }}
                >
                  {headerBtn === "Incoming" || headerBtn === "Under consideration" ? (
                    <IconArchive />
                  ) : headerBtn === "Archive" ? (
                    <IconArchiveTray />
                  ) : (
                    ""
                  )}
                </button>
              )}
            </div>
            <div className={`${styles["project-card__text-info"]} card__text-info`}>
              <div className={`project-card__title ${styles["project-card__title"]}`}>{data.name}</div>
              {isDraft && !data.description ? (
                <div
                  className={`project-card__txt ${styles["project-card__txt"]} ${styles["project-card__txt--empty"]}`}
                >
                  No description
                </div>
              ) : data.description ? (
                <div
                  className={`project-card__txt ${styles["project-card__txt"]}`}
                  dangerouslySetInnerHTML={{ __html: `${data.description}` }}
                />
              ) : (
                ""
              )}
            </div>
            {price && (
              <div className={styles["project-card__price"]}>
                <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.24219 1V1.91572C2.64578 2.20761 0.778117 3.9361 0.778117 6.35999C0.778117 8.39999 2.09812 9.76799 4.61812 10.92L6.32212 11.688C7.78612 12.36 8.33812 12.744 8.33812 13.656C8.33812 14.736 7.49812 15.408 6.08212 15.408C4.47412 15.408 3.34612 14.448 2.69812 13.776C2.45812 13.56 2.14612 13.464 1.85812 13.464C1.09012 13.464 0.394117 14.04 0.370117 14.904C0.370117 15.36 0.586117 15.768 0.970117 16.152C1.97214 17.2563 3.61886 18.0295 5.24219 18.2341V19C5.24219 19.5523 5.6899 20 6.24219 20C6.79447 20 7.24219 19.5523 7.24219 19V18.202C9.81277 17.8093 11.6261 16.0939 11.6261 13.536C11.6261 11.376 10.3541 10.08 7.71412 8.90399L5.91412 8.11199C4.49812 7.46399 4.06612 7.08 4.06612 6.28799C4.06612 5.30399 4.88212 4.75199 6.03412 4.75199C7.16212 4.75199 7.88212 5.30399 8.53012 5.88C8.81812 6.11999 9.13012 6.21599 9.41812 6.21599C10.1621 6.21599 10.9061 5.59199 10.9061 4.776C10.9061 4.46399 10.8101 4.10399 10.4741 3.74399C9.92519 3.11665 8.89585 2.26511 7.24219 1.97424V1C7.24219 0.447715 6.79447 0 6.24219 0C5.6899 0 5.24219 0.447715 5.24219 1Z"
                  />
                </svg>
                {numberFormat(price)}
              </div>
            )}
            {team && (
              <>
                {team.length > 0 && (team.filter((teammate) => teammate.name).length > 0 || responses) ? (
                  <div className={`${styles["project-card__teammates"]}`}>
                    {team.filter((teammate) => teammate.name).length > 0 ? (
                      <>
                        <div className={styles["project-card__team-wrap"]}>
                          <div className={`${styles["project-card__team"]}`}>
                            {team
                              .filter((teammate) => teammate.name)
                              .map((teammate) =>
                                teammate.avatar ? (
                                  <div key={teammate.team_member_id} className={styles["project-card__team-el-wrap"]}>
                                    <Image
                                      src={
                                        data.owner === "onboarding" ? teammate.avatar : BACKEND_HOST + teammate.avatar
                                      }
                                      alt="avatar"
                                      width={28}
                                      height={28}
                                      // layout={"fill"}
                                      objectFit={"cover"}
                                      objectPosition={"center"}
                                      // placeholder="blur"
                                      // blurDataURL={BLUR_IMAGE_DATA_URL}
                                    />
                                  </div>
                                ) : (
                                  <div
                                    key={teammate.team_member_id}
                                    className={`${styles["project-card__team-el-wrap"]}`}
                                  >
                                    <div className={styles["project-card__team-no-avatar"]}>
                                      <IconUser />
                                    </div>
                                  </div>
                                )
                              )}
                          </div>
                          {!isCompleted && (
                            <span className={team.filter((teammate) => teammate.name).length > 1 ? styles["some"] : ""}>
                              {team.filter((teammate) => teammate.name).length}
                            </span>
                          )}
                        </div>
                        {!isCompleted && chatLink && (
                          <button
                            className={styles["project-card__teammates-res-chat"]}
                            onClick={() => {
                              if (onClickBtnChat) onClickBtnChat()
                              if (modalsList.includes("modal-chat")) {
                                dispatch(closeModal("modal-chat"))
                                setChatOpen(false)
                              } else {
                                dispatch(openModal("modal-chat"))
                                setChatOpen(true)
                              }
                            }}
                          >
                            <IconChat />
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <div className={styles["project-card__teammates-res-wrap"]}>
                          <span className={styles["project-card__teammates-res"]}>{teamCount()}</span> responses
                        </div>
                        {!isCompleted && chatLink && (
                          <button
                            className={styles["project-card__teammates-res-chat"]}
                            onClick={() => {
                              if (onClickBtnChat) onClickBtnChat()
                              if (modalsList.includes("modal-chat")) {
                                dispatch(closeModal("modal-chat"))
                                setChatOpen(false)
                              } else {
                                dispatch(openModal("modal-chat"))
                                setChatOpen(true)
                              }
                            }}
                          >
                            <IconChat />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className={styles["project-card__empty-team"]}>
                    <img src={"/assets/icons/user-circle.svg"} alt={"user"} /> 0
                  </div>
                )}
              </>
            )}
            {person && (
              <div className={`${styles["project-card__teammates"]}`}>
                <div className={styles["project-card__team-wrap"]}>
                  <div className={`${styles["project-card__team"]}`}>
                    <div className={styles["project-card__team-el-wrap"]}>
                      <Image
                        src={
                          person.avatar
                            ? person.avatar.includes("/img/onboarding/")
                              ? person.avatar
                              : `${BACKEND_HOST}${person.avatar}`
                            : "/assets/icons/user-circle.svg"
                        }
                        alt={person.name}
                        width={28}
                        height={28}
                        // layout={"fill"}
                        objectFit={"cover"}
                        objectPosition={"center"}
                        // placeholder="blur"
                        // blurDataURL={BLUR_IMAGE_DATA_URL}
                      />
                    </div>
                  </div>
                  <span>
                    {person.name} {person?.surname ? person.surname[0].toUpperCase() + "." : ""}
                  </span>
                </div>
                {chatLink && (
                  <button
                    className={styles["project-card__teammates-res-chat"]}
                    onClick={() => {
                      if (onClickBtnChat) onClickBtnChat()
                      if (modalsList.includes("modal-chat")) {
                        dispatch(closeModal("modal-chat"))
                        setChatOpen(false)
                      } else {
                        dispatch(openModal("modal-chat"))
                        setChatOpen(true)
                      }
                    }}
                  >
                    <IconChat />
                  </button>
                )}
              </div>
            )}
            {data.team && (
              <div className={`${styles["project-card__team"]}`}>
                {data.team.map((member, i) => (
                  <img key={i} src={member} alt="" />
                ))}
              </div>
            )}
            {data.author && (
              <div className={`${styles["project-card__author"]}`}>
                <img src={`${data.author.img}`} alt="" />
                <span className={`${styles["project-card__author-name"]}`}>{data.author.name}</span>
              </div>
            )}
            {data.progress && !mainBtn ? (
              <div className={`${styles["project-card__progress"]}`}>
                {data.progress < 100 && <ProgressBar title={"Progress"} progress={data.progress} />}
                {data.progress === 100 && (
                  <div className={`${styles["project-card__progress"]}`}>
                    <DefaultBtn txt={"Complete"} addClass={`${styles["project-card__progress-btn"]}`} />
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
            {!isBtnEditDesc && durationDays && !isCompleted && progressCount >= 0 && !mainBtn ? (
              <>
                <div className={styles["project-card__progress-block"]}>
                  <div className={`${styles["project-card__progress-txt"]}`}>
                    {daysRemain < 0 ? "Execution of the project late" : `Progress ${progressCount}%`}
                  </div>
                  <span className={`${styles["project-card__progress-date"]}`}>{deadlineDate}</span>
                </div>
                <ProgressLine
                  mod={daysRemain < 0 ? "overdue" : progressCount === 100 ? "complete" : null}
                  percents={progressCount}
                />
              </>
            ) : (
              ""
            )}
            {responsesStyle ? (
              <div className={`${styles["project-card__res"]} ${styles["bold-text"]}`}>
                <div className={styles["project-card__res-number"]}>{responses === null ? 0 : responses}</div> responses
              </div>
            ) : (
              responses > 0 && !team && <div className={styles["project-card__res"]}>{responses} responses</div>
            )}
            {isCompleted && activeTabType !== "customer-atwork" && <ProjectCardCompleted />}
            <div
              className={`project-card__btn-wrap ${styles["project-card__btn-wrap"]} ${
                isBtnChat &&
                (isBtnOffer ||
                  data.candidate_statuses?.filter(
                    (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 4
                  )?.length > 0)
                  ? "project-card__two-btns"
                  : ""
              }`}
              ref={btnOfferRef}
            >
              {renderBtnChat(width)}

              {isBtnOffer && (
                <DefaultBtn
                  txt={data?.offers?.includes(user.id) ? "Edit offer" : "Edit offer"}
                  addClass={`project-card__btn-offer ${styles["project-card__btn"]} ${styles["project-card__btn-offer"]}`}
                  minWidth={false}
                  size={"md"}
                  onClick={() => {
                    if (onClickBtnOffer) onClickBtnOffer()
                  }}
                />
              )}
              {data.candidate_statuses?.filter(
                (candidate) => candidate.hasOwnProperty(user.id) && candidate[user.id] === 4
              )?.length > 0 && (
                <DefaultBtn
                  txt={"Start project"}
                  size={"md"}
                  minWidth={false}
                  addClass={`${styles["project-card__btn"]} ${styles["project-card__btn-start"]}`}
                  mod={"success"}
                  onClick={() => {
                    if (onClickBtnStartProject) {
                      onClickBtnStartProject()
                    } else {
                      setStatusProject({ manager_id: user.id, status: 5, order_id: data.id })
                      addPopupNotification({
                        title: "Congratulations!",
                        txt: "You confirmed your willingness to work",
                        mod: "success",
                        icon: "check",
                      })
                    }
                  }}
                />
              )}
              {isBtnEditDesc && (
                <DefaultBtn
                  txt={"Edit description"}
                  addClass={`project-card__btn-edit-desc ${styles["project-card__btn"]} ${styles["project-card__btn-edit-desc"]}`}
                  onClick={() => {
                    if (onClickBtnEditDesc) onClickBtnEditDesc()
                  }}
                />
              )}
              {mainBtn && (
                <DefaultBtn
                  txt={mainBtn}
                  disabled={isMainBtnDisabled || modalsList.includes("modal-evaluate")}
                  addClass={`project-card__btn-main ${styles["project-card__btn"]} ${styles["project-card__btn-main"]}`}
                  onClick={() => {
                    if (onClickBtnMain) onClickBtnMain()
                  }}
                />
              )}
            </div>
            {wait && <StatusBar txt={wait} className={styles["project-card__wait"]} />}
          </>
        ) : (
          <>
            <div>
              <div className={`${styles["project-card__empty-img"]}`}>{emptyCardImgSelector()}</div>
              {emptyCardTitleSelector()}
              {emptyCardTxtSelector()}
              {emptyCardBtnSelector()}
            </div>
          </>
        )}
      </div>
      {isChatOpen && (
        <ModalChat
          isOpen={modalsList.includes("modal-chat")}
          onClose={() => {
            dispatch(closeModal("modal-chat"))
            setTimeout(() => {
              setChatOpen(false)
            }, 200)
          }}
          closeOutside={(target) => {
            return target.closest(".project-card__btn-chat") === null
          }}
          personID={data?.manager_id || data?.owner_id}
          orderID={data?.id}
          // modalName={`modal-chat-${data["manager_id"]}`}
          chatType={chatType}
        />
      )}
    </>
  )
}

export default ProjectCard
