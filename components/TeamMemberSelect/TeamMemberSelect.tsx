import styles from "./TeamMemberSelect.module.scss"
import IconCircle from "public/icons/ic-circle-3.svg"
import React, { useEffect, useRef, useState } from "react"
import { useOnClickOutside } from "hooks/useOnClickOutside"
import { ITeammate } from "types/team"
import IconClock from "public/assets/svg/clock.svg"
import IconUser from "public/assets/svg/user.svg"
import { BACKEND_HOST, CHAT_TYPE_PRIVATE } from "utils/constants"
import { useAppDispatch, useAppSelector } from "hooks"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import ModalChat from "components/Modals/ModalChat/ModalChat"

interface Props {
  jobItem: ITeammate
  isActive?: boolean
  addClass?: string
  onClickItem?: (params: ITeammate, arg1: string) => void
  isSelected?: boolean
  onClickAllBtn?: () => void
  initialyOpen?: boolean
}
const TeamMemberSelect: React.FC<Props> = ({
  jobItem,
  isActive,
  isSelected,
  onClickAllBtn,
  addClass,
  onClickItem,
  initialyOpen,
}) => {
  const [isOpen, setIsOpen] = useState(initialyOpen ? initialyOpen : false)
  const [dropHeight, setDropHeight] = useState(60)
  const dropRef = useRef(null)
  const selectRef = useRef(null)

  const dispatch = useAppDispatch()
  const { currentUserID } = useAppSelector(selectApiParams)
  const { modalsList } = useAppSelector(selectModals)

  const [isChatOpen, setChatOpen] = useState<boolean>(false)

  function getHeight() {
    return dropRef.current.clientHeight
  }

  useEffect(() => {
    if (isOpen) {
      setDropHeight(getHeight())
    } else {
      setDropHeight(0)
    }
  }, [isOpen])

  useOnClickOutside(selectRef, () => {
    if (isOpen) setIsOpen(false)
  })

  const openCloseBtn = (val) => {
    if (isSelected) {
      if (isOpen) {
        setIsOpen(false)
      }
      return false
    }
    setIsOpen(val)
  }
  const triggerOPen = () => {
    setIsOpen(!isOpen)
  }
  const handleBtnItem = (name) => {
    onClickItem(jobItem, name)
  }

  useEffect(() => {
    if (initialyOpen) openCloseBtn(true)
  }, [initialyOpen])

  return (
    <>
      {jobItem?.id ? (
        <div
          className={`${styles["selected-member"]} ${addClass ? addClass : ""} ${isActive ? styles["is-active"] : ""}`}
          onClick={(e) => {
            const isButton = (e.target as HTMLElement).closest<HTMLElement>("button.icon-btn") as HTMLButtonElement
            if (isButton) {
              e.preventDefault()
              return
            }
            //что бы показать одну рольв модалке
            dispatch(updateApiParams({ field: "modalJobRoleId", data: jobItem.job_role_id }))

            if (modalsList.includes("modal-candidate")) {
              dispatch(closeModal("modal-candidate"))
            } else {
              dispatch(openModal("modal-candidate"))
              dispatch(updateApiParams({ field: "activeVacancyIDAtWork", data: null }))
              dispatch(updateApiParams({ field: "activeTeamMemberIDVacancy", data: jobItem.team_member_id }))
            }
            dispatch(updateApiParams({ field: "currentUserID", data: jobItem?.id }))
            onClickAllBtn()
          }}
        >
          {jobItem?.avatar ? (
            <div className={`${styles["selected-member__avatar"]}`}>
              <img
                src={
                  jobItem?.avatar.includes("/img/onboarding/") ? jobItem?.avatar : `${BACKEND_HOST}${jobItem?.avatar}`
                }
                alt=""
              />
            </div>
          ) : (
            <div className={styles["noavatar-member"]}>
              <IconUser />
            </div>
          )}
          <div className={styles["selected-member__info"]}>
            {jobItem?.name && (
              <div className={`${styles["selected-member__name"]}`}>
                <span>{jobItem?.name}</span>{" "}
                {jobItem?.surname && (
                  <span>
                    {jobItem?.surname?.split("")[0].toUpperCase()}
                    {"."}
                  </span>
                )}
              </div>
            )}
            {jobItem?.job_role && (
              <div className={`${styles["selected-member__job-role"]}`}>
                <span>{jobItem?.job_role}</span>{" "}
              </div>
            )}
          </div>
          <IconBtn
            icon={"chat"}
            size={"md"}
            addClass={styles["selected-member__chat-btn"]}
            // href={jobItem?.telegram_link}
            // isTargetBlank={!!jobItem?.telegram_link}
            // disabled={jobItem?.telegram_link ? undefined : true}
            onClick={() => {
              setChatOpen((prev) => !prev)
              if (modalsList.includes("modal-chat")) {
                dispatch(closeModal("modal-chat"))
              } else {
                dispatch(openModal("modal-chat"))
              }
            }}
          />
        </div>
      ) : (
        <div
          className={`${styles["member-select"]} ${initialyOpen ? styles["is-initialy-open"] : ""}  ${
            addClass ? addClass : ""
          } ${isOpen || isActive ? styles["is-active"] : ""}
            ${isSelected ? styles["is-selected"] : ""}
            `}
          ref={selectRef}
          onMouseLeave={() => openCloseBtn(false)}
          onMouseEnter={() => openCloseBtn(true)}
          onClick={onClickAllBtn}
        >
          <span className={`${styles["member-select__name"]}`}>
            <p>
              {jobItem?.in_search && !jobItem?.candidates_count && (
                <span className={styles["member-select__clock"]}>
                  <IconClock />
                </span>
              )}
              {jobItem?.candidates_count > 0 && (
                <span className={styles["member-select__count"]}>{jobItem?.candidates_count}</span>
              )}
              {jobItem.job_role}
            </p>
            {isSelected && (
              <button
                type={"button"}
                className={`${styles["member-select__name-dots"]}`}
                onClick={(e) => {
                  e.stopPropagation()
                  triggerOPen()
                }}
              >
                <IconCircle />
                <IconCircle />
                <IconCircle />
              </button>
            )}
          </span>
          <div className={`${styles["member-select__drop-wrp"]}`} style={{ height: dropHeight }}>
            <div ref={dropRef}>
              <div className={`${styles["member-select__drop-toggler"]}`}></div>
              <button
                type={"button"}
                className={`${styles["member-select__drop-row"]} ${jobItem?.in_search ? styles["is-active"] : ""}`}
                onClick={() => {
                  if (!jobItem?.in_search) handleBtnItem("post")
                }}
              >
                <div className={`${styles["member-select__drop-icon"]}`}>
                  <img src="/img/icons/Megaphone.svg" alt="" />
                </div>
                <div className={`${styles["member-select__drop-txt"]} `}>
                  <p>{jobItem?.in_search ? "Posted" : "Post a job"}</p>
                </div>
              </button>
              <button
                type={"button"}
                className={`member-select__btn-fav ${styles["member-select__drop-row"]}`}
                onClick={() => handleBtnItem("add fav")}
              >
                <div className={`${styles["member-select__drop-icon"]}`}>
                  <img src="/img/icons/heart.svg" alt="" />
                </div>
                <div className={`${styles["member-select__drop-txt"]}`}>
                  <p>Add from favorites</p>
                </div>
              </button>
              <button
                type={"button"}
                className={`member-select__btn-share ${styles["member-select__drop-row"]} add-link-modal`}
                onClick={() => handleBtnItem("share link")}
              >
                <div className={`${styles["member-select__drop-icon"]}`}>
                  <img src="/img/icons/Link.svg" alt="" />
                </div>
                <div className={`${styles["member-select__drop-txt"]}`}>
                  <p>Share link</p>
                </div>
              </button>
            </div>
          </div>
        </div>
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
          personID={jobItem?.id}
          modalName={`modal-chat-${jobItem?.id}`}
          chatType={CHAT_TYPE_PRIVATE}
        />
      )}
    </>
  )
}

export default TeamMemberSelect
