import styles from "./FavoritePerson.module.scss"
import Rating from "components/ui/Rating/Rating"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import {
  CHAT_TYPE_PRIVATE,
  CHAT_TYPE_TEAM,
  BLUR_IMAGE_DATA_URL,
  USER_TYPE_CUSTOMER,
  USER_TYPE_EXPERT,
  USER_TYPE_PM,
} from "utils/constants"
import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import IconUser from "public/assets/svg/user.svg"
import CheckboxToggler from "components/ui/CheckboxToggler/CheckboxToggler"
import ConfirmPrompt from "components/ui/ConfirmPrompt/ConfirmPrompt"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import ModalChat from "components/Modals/ModalChat/ModalChat"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { useAppDispatch, useAppSelector } from "hooks"
import { ChatTypeList } from "types/chat"

interface Person {
  avatar: string
  name: string
  surname?: string | null
  project_categories?: any[]
  project_directions?: any[]
  rating?: number
  id: number
  type?: number
  status?: number
}
interface Props {
  data: Person
  addClass?: string
  onClick?(): void
  openUser?: boolean
  onAdd?: () => void
  addBtnText?: string
  onCheckFunction?: () => void
  onUncheckFunction?: () => void
  editMode?: boolean
  dellPerson?: () => void
  isWaiting?: boolean
  personJob?: string
  chatType?: ChatTypeList
}

const FavoritePerson: React.FC<Props> = ({
  dellPerson,
  editMode,
  data,
  addClass,
  openUser,
  onClick,
  onAdd,
  addBtnText,
  onCheckFunction,
  onUncheckFunction,
  isWaiting,
  personJob,
  chatType,
}) => {
  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)

  const [isChatOpen, setChatOpen] = useState<boolean>(false)
  const [checked, setChecked] = useState(data.status === 1 ? false : true)
  const [checkCount, setCheckCount] = useState(0)

  useEffect(() => {
    if (data.status === -1 || checkCount <= 0) return
    if (checked) {
      if (onCheckFunction) onCheckFunction()
    } else {
      if (onUncheckFunction) onUncheckFunction()
    }
  }, [checked])

  return (
    <>
      <div
        className={`${styles["favorite-person"]} ${isWaiting ? styles["is-waiting"] : ""} ${
          openUser ? styles["favorite-person--open-user"] : ""
        } ${addClass ? addClass : ""} `}
        onClick={(e) => {
          const isButton = (e.target as HTMLElement).closest<HTMLElement>("button") as HTMLButtonElement
          if (isButton) {
            e.preventDefault()
            return
          }
          if (onClick) onClick()
        }}
      >
        <div
          className={`${styles["favorite-person__avatar"]} ${
            data?.avatar ? "" : styles["favorite-person__avatar--empty"]
          }`}
        >
          {data?.avatar ? (
            <Image
              src={data.avatar}
              alt="avatar"
              layout={"fill"}
              quality={75}
              objectFit={"cover"}
              objectPosition={"center"}
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_DATA_URL}
            />
          ) : (
            <IconUser />
          )}
        </div>
        <div className={`${styles["favorite-person__info"]}`}>
          <div className={`${styles["favorite-person__name"]}`}>
            {data.name ? data.name : ""} {data.surname ? data.surname : ""}
            {data?.rating > 0 && (
              <div className={styles["favorite-person__rating-header"]}>
                {data.rating}
                <svg width="11" height="11" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.3446 14.901L14.2849 17.3974C14.7886 17.7165 15.4139 17.2419 15.2644 16.654L14.126 12.1756C14.0939 12.0509 14.0977 11.9197 14.137 11.797C14.1762 11.6743 14.2492 11.5652 14.3477 11.4822L17.8811 8.54132C18.3453 8.1549 18.1057 7.38439 17.5092 7.34567L12.8949 7.0462C12.7706 7.03732 12.6514 6.99332 12.5511 6.91931C12.4509 6.84531 12.3737 6.74435 12.3286 6.62819L10.6076 2.29436C10.5609 2.17106 10.4777 2.06492 10.3692 1.99002C10.2606 1.91511 10.1319 1.875 10 1.875C9.86813 1.875 9.73938 1.91511 9.63085 1.99002C9.52232 2.06492 9.43914 2.17106 9.39236 2.29436L7.6714 6.62819C7.6263 6.74435 7.54914 6.84531 7.4489 6.91931C7.34865 6.99332 7.22944 7.03732 7.10515 7.0462L2.49078 7.34567C1.89429 7.38439 1.65466 8.1549 2.11894 8.54132L5.65232 11.4822C5.75079 11.5652 5.82383 11.6743 5.86305 11.797C5.90226 11.9197 5.90606 12.0509 5.874 12.1756L4.81824 16.3288C4.63889 17.0343 5.38929 17.6038 5.99369 17.2209L9.65539 14.901C9.75837 14.8354 9.87792 14.8006 10 14.8006C10.1221 14.8006 10.2416 14.8354 10.3446 14.901V14.901Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
          {!personJob && data.type === USER_TYPE_CUSTOMER && (
            <div className={`${styles["favorite-person__job"]}`}>Client</div>
          )}
          {!personJob && data.type === USER_TYPE_PM && (
            <div className={`${styles["favorite-person__job"]}`}>Project Manager</div>
          )}
          {!personJob && data.type === USER_TYPE_EXPERT && data.project_directions?.length > 0 ? (
            <div className={`${styles["favorite-person__job"]}`}>{data.project_directions[0].name}</div>
          ) : data.type === USER_TYPE_EXPERT ? (
            !personJob ? (
              <div className={`${styles["favorite-person__job"]}`}>Expert</div>
            ) : null
          ) : (
            ""
          )}
          {personJob && <div className={`${styles["favorite-person__job"]}`}>{personJob}</div>}
        </div>
        {(data.rating || data.rating === 0) && (
          <div className={`${styles["favorite-person__rating"]}`}>
            {!openUser && onAdd && (
              <DefaultBtn
                addClass={`${styles["button"]}`}
                txt={addBtnText ? addBtnText : "Add to project"}
                onClick={() => {
                  if (onAdd) onAdd()
                }}
              />
            )}
            <Rating rating={data.rating} mod={"md"} disabled label />
          </div>
        )}
        {onCheckFunction || onUncheckFunction ? (
          editMode ? (
            <ConfirmPrompt
              className={styles["favorite-person__btn-delete"]}
              title={"Are you sure you want to remove the member from this project?"}
              onClick={dellPerson}
            />
          ) : (
            <CheckboxToggler
              subChecked={data.status === -2}
              checked={checked && (data.status === 2 || data.status === -2)}
              onChange={() => {
                setCheckCount((prev) => prev + 1)
                setChecked(!checked)
              }}
            />
          )
        ) : (
          <IconBtn
            icon={"chat"}
            size={"md"}
            onClick={() => {
              setChatOpen((prev) => !prev)
              if (modalsList.includes("modal-chat")) {
                dispatch(closeModal("modal-chat"))
              } else {
                dispatch(openModal("modal-chat"))
              }
            }}
          />
        )}

        {!openUser && onAdd && (
          <IconBtn
            icon={"plus"}
            addClass={styles["button-add-mob"]}
            onClick={() => {
              if (onAdd) onAdd()
            }}
          />
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
          personID={![CHAT_TYPE_TEAM].includes(chatType) ? data?.id : null}
          teamID={[CHAT_TYPE_TEAM].includes(chatType) ? data?.id : null}
          modalName={`modal-chat-${data?.id}`}
          chatType={chatType || CHAT_TYPE_PRIVATE}
        />
      )}
    </>
  )
}

export default FavoritePerson
