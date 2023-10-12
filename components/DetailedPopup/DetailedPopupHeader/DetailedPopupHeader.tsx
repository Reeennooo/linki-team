import Rating from "components/ui/Rating/Rating"
import styles from "./DetailedPopupHeader.module.scss"
import IconClose from "public/assets/svg/close.svg"
import IconUser from "public/assets/svg/user.svg"
import { useAppDispatch, useAppSelector } from "hooks"
import ModalUser from "components/Modals/ModalUser/ModalUser"
import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { updateApiParams } from "redux/slices/apiParams"
import React, { useEffect, useState } from "react"
import { useAuth } from "hooks/useAuth"
import FavoritesButton from "components/ui/btns/FavoritesButton/FavoritesButton"
import ReactTooltip from "react-tooltip"
import IconCrown2 from "public/assets/svg/crown-icon-2.svg"
import { BACKEND_HOST, BLUR_IMAGE_DATA_URL } from "utils/constants"
import Image from "next/image"
import useUnmount from "hooks/useUnmount"

interface Props {
  img?: string
  online?: boolean
  rating?: number
  addClass?: string
  name?: string
  surname?: string
  id?: number
  title?: string
  onClose?(): void
  titleTag?: string
  headerUserClickable?: boolean
  chatLink?: boolean
  modalToOpen?: string
  premiumSubscribe?: boolean
  onBtnChat?: () => void
  position?: string
  videoBtn?: boolean
}

const DetailedPopupHeader: React.FC<Props> = ({
  img,
  online,
  rating,
  name,
  surname,
  id,
  title,
  titleTag,
  chatLink,
  onClose,
  addClass,
  headerUserClickable = true,
  modalToOpen,
  premiumSubscribe,
  onBtnChat,
  position,
  videoBtn,
}) => {
  const dispatch = useAppDispatch()

  const { modalsList } = useAppSelector(selectModals)

  const {
    user: { id: userID },
  } = useAuth()

  const [isInfav, setIsInFav] = useState(null)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])
  useUnmount(() => {
    ReactTooltip.hide()
  })

  return (
    <>
      <div className={`detailed-popup-header ${styles["header"]} ${addClass ? addClass : ""}`}>
        {title ? (
          <h3 className="popup-header__title">
            {title}
            {titleTag ? <span className="popup-header__title-tag">{titleTag}</span> : null}
          </h3>
        ) : (
          <div className={styles.header__main}>
            <div className={styles["header__avatar-wrap"]}>
              {img ? (
                <Image
                  src={img.includes("http") || img.includes("onboarding") ? img : BACKEND_HOST + img}
                  alt="avatar"
                  layout={"fill"}
                  quality={75}
                  objectFit={"cover"}
                  objectPosition={"center"}
                  placeholder="blur"
                  blurDataURL={BLUR_IMAGE_DATA_URL}
                />
              ) : (
                <span className={styles["header__no-avatar"]}>
                  <IconUser />
                </span>
              )}
              {online ? <span className={styles.header__online} /> : ""}
              {premiumSubscribe && (
                <div className={`${styles["header__img-premium"]}`}>
                  <IconCrown2 />
                </div>
              )}
            </div>
            {name ? (
              <div
                className={`${styles["header__user-block"]} ${
                  !img && !rating && rating !== 0 ? styles["header__user-block--long"] : ""
                }`}
              >
                <div className={styles["header__user-wrap"]}>
                  <div className={styles["header__name-wrap"]}>
                    {headerUserClickable && !modalsList.includes("modal-user") ? (
                      <button
                        className={styles["header__name-btn"]}
                        type="button"
                        onClick={() => {
                          dispatch(updateApiParams({ field: "currentUserID", data: id }))
                          if (modalToOpen) {
                            dispatch(openModal(modalToOpen))
                          } else {
                            dispatch(openModal("modal-user-inner"))
                          }
                        }}
                      >
                        <h2 className={styles.header__name}>
                          {name} {surname}
                        </h2>
                      </button>
                    ) : (
                      <div className={styles["header__name-btn"]}>
                        <h2 className={styles.header__name}>
                          {name} {surname}
                        </h2>
                      </div>
                    )}
                  </div>
                  {rating || rating === 0 ? (
                    <Rating rating={rating} label={true} disabled={true} ratingAlwaysShown={true} />
                  ) : (
                    ""
                  )}
                  {position && <div className={styles.header__position}>{position}</div>}
                </div>
                {chatLink && (
                  <IconBtn
                    icon={"chat"}
                    size={"md"}
                    onClick={() => {
                      if (onBtnChat) onBtnChat()
                    }}
                    addClass={styles["header__btn-chat"]}
                  />
                )}
                {id && userID !== id && <FavoritesButton addClass={styles["header__btn-fav"]} id={id} />}
                {videoBtn && (
                  <IconBtn
                    href={"https://meet.google.com/"}
                    isTargetBlank
                    icon={<img src={"/assets/icons/google-meet.svg"} alt={"google meet"} />}
                    size={"md"}
                    addClass={styles["header__btn-video"]}
                  />
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        )}
        <button
          type="button"
          className={`detailed-popup-header__close ${styles.close}`}
          data-for="global-tooltip"
          data-tip={"Close"}
          onClick={() => {
            if (onClose) onClose()
          }}
        >
          <IconClose />
        </button>
      </div>
      {headerUserClickable && !modalsList.includes("modal-user") && (
        <ModalUser
          isOpen={modalsList.includes("modal-user-inner")}
          onClose={() => {
            dispatch(closeModal("modal-user-inner"))
          }}
          isFooterExist={false}
          headerUserClickable={false}
          isChatHeader={chatLink}
          modalName={"modal-user-inner"}
        />
      )}
    </>
  )
}

export default DetailedPopupHeader
