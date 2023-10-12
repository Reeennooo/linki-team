import styles from "./PersonCard.module.scss"
import Rating from "components/ui/Rating/Rating"
import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import { BACKEND_HOST, BLUR_IMAGE_DATA_URL, CHAT_TYPE_PRIVATE } from "utils/constants"
import Image from "next/image"

import IconCode from "public/assets/svg/directions/Code.svg"
import IconRocketLaunch from "public/assets/svg/directions/RocketLaunch.svg"
import IconGitFork from "public/assets/svg/directions/GitFork.svg"
import IconBriefcase from "public/assets/svg/directions/Briefcase.svg"
import IconSmile from "public/assets/svg/directions/Smile.svg"
import IconLayout from "public/assets/svg/directions/Layout.svg"
import IconTrending from "public/assets/svg/directions/Trending-up.svg"
import IconPencilSimple from "public/assets/svg/directions/PencilSimple.svg"
import IconFilm from "public/assets/svg/directions/Film.svg"
import IconMusicNotes from "public/assets/svg/directions/MusicNotes.svg"
import IconMChats from "public/assets/svg/directions/Chats.svg"
import IconUser from "public/assets/svg/user.svg"

import IconGear from "public/assets/svg/ic-gear.svg"
import FavoritesButton from "components/ui/btns/FavoritesButton/FavoritesButton"
import ModalChat from "components/Modals/ModalChat/ModalChat"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "hooks"
import { useAuth } from "hooks/useAuth"

interface Props {
  addClass?: string
  avatar?: string
  name?: string
  surname?: string | null
  rating?: number
  project_categories?: any[]
  project_directions?: any[]
  salary_per_hour?: number
  hours?: number
  expertAvatar?: string
  expertName?: string
  expertSurname?: string
  expertJobRole?: string
  area_expertise_id?: number
  userId: number
  position?: string
  onClick?: () => void
  noFavorite?: boolean
}

const PersonCard: React.FC<Props> = ({
  area_expertise_id,
  avatar,
  name,
  surname,
  project_directions,
  rating,
  expertAvatar,
  expertName,
  expertSurname,
  expertJobRole,
  salary_per_hour,
  hours,
  addClass,
  userId,
  position,
  onClick,
  noFavorite,
}) => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)

  const [isChatOpen, setChatOpen] = useState<boolean>(false)

  const iconSelector = (id) => {
    switch (id) {
      case 9:
      case 13:
        return <IconCode />
      case 4:
        return <IconRocketLaunch />
      case 5:
        return <IconGitFork />
      case 14:
      case 17:
        return <IconBriefcase />
      case 7:
        return <IconSmile />
      case 10:
        return <IconLayout />
      case 12:
        return <IconTrending />
      case 11:
        return <IconPencilSimple />
      case 11:
        return <IconFilm />
      case 12:
        return <IconMusicNotes />
      case 15:
        return <IconGear />
      case 62:
        return <IconMChats />
      default:
        break
    }
  }

  return (
    <>
      <div
        className={`person-card ${styles["person-card"]} ${addClass ? addClass : ""} ${
          onClick ? styles["person-card--clickable"] : ""
        }`}
        onClick={(e) => {
          const isButton = (e.target as HTMLElement).closest<HTMLElement>("button") as HTMLButtonElement
          const isLink = (e.target as HTMLElement).closest<HTMLElement>("a") as HTMLLinkElement
          if (isButton) {
            e.preventDefault()
            return
          }
          if (!isLink && onClick) onClick()
        }}
      >
        {area_expertise_id && !expertName && (
          <div
            className={`person-card__avatar ${styles["person-card__avatar"]} ${styles["person-card__avatar--icon"]}`}
          >
            {iconSelector(area_expertise_id)}
          </div>
        )}

        {(avatar || expertAvatar) && (
          <div className={`person-card__avatar ${styles["person-card__avatar"]}`}>
            {avatar && (
              <Image
                src={avatar}
                alt="avatar"
                // width={"46px"}
                // height={"46px"}
                layout={"fill"}
                quality={50}
                objectFit={"cover"}
                objectPosition={"center"}
                placeholder="blur"
                blurDataURL={BLUR_IMAGE_DATA_URL}
                className={styles.card__avatar}
              />
            )}
            {expertAvatar && (
              <Image
                src={expertAvatar.includes("/img/onboarding/") ? expertAvatar : `${BACKEND_HOST}${expertAvatar}`}
                alt="avatar"
                // width={"46px"}
                // height={"46px"}
                layout={"fill"}
                quality={50}
                objectFit={"cover"}
                objectPosition={"center"}
                placeholder="blur"
                blurDataURL={BLUR_IMAGE_DATA_URL}
                className={styles.card__avatar}
              />
            )}
          </div>
        )}

        {!avatar && !expertAvatar && expertName && (
          <div
            className={`person-card__avatar ${styles["person-card__avatar"]} ${styles["person-card__avatar--empty"]}`}
          >
            <IconUser />
          </div>
        )}

        {(name || expertName) && (
          <div className={`person-card__info ${styles["person-card__info"]}`}>
            <div className={`${styles["person-card__name"]}`}>
              {name || expertName ? name || expertName : ""} {surname || expertSurname ? surname || expertSurname : ""}
            </div>
            {project_directions?.length > 0 && (
              <div className={`${styles["person-card__job"]}`}>{project_directions[0].name}</div>
            )}
            {position && !project_directions?.length && (
              <div className={`${styles["person-card__job"]}`}>{position}</div>
            )}
            {expertJobRole && <div className={`${styles["person-card__job"]}`}>{expertJobRole}</div>}
          </div>
        )}

        {expertJobRole && !expertName && (
          <div className={`person-card__info ${styles["person-card__info"]} ${styles["person-card__info--restEmpty"]}`}>
            <div className={`${styles["person-card__name"]}`}>{expertJobRole}</div>
          </div>
        )}

        {salary_per_hour && hours && (
          <div className={`${styles["person-card__price"]}`}>
            ${salary_per_hour} x {hours} h = <span>$ {salary_per_hour * hours}</span>
          </div>
        )}

        {(rating || rating === 0) && (
          <div className={`${styles["person-card__rating"]}`}>
            <Rating rating={rating} mod={"md"} disabled label />
          </div>
        )}

        {(name || expertName) && user?.id !== userId && (
          <div className={`person-card__btns ${styles["person-card__btns"]}`}>
            {!noFavorite && <FavoritesButton addClass={styles["person-card__btn-fav"]} id={userId} />}
            <IconBtn
              icon={"chat"}
              size={"md"}
              addClass={styles["person-card__btn-chat"]}
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
          personID={userId}
          modalName={`modal-chat-${userId}`}
          chatType={CHAT_TYPE_PRIVATE}
        />
      )}
    </>
  )
}

export default PersonCard
