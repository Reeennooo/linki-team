import React, { useMemo } from "react"
import styles from "components/ui/NotificationPopup/NotificationPopup.module.scss"
import IconClose from "public/assets/svg/close.svg"
import IconInfo from "public/assets/svg/info-circle.svg"
import IconCheck from "public/assets/svg/check-circle.svg"
import IconDelete from "public/assets/svg/delete.svg"
import IconError from "public/assets/svg/error-circle.svg"
import IconWait from "public/assets/svg/clock.svg"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import { IPopupNotificationIcon, IPopupNotificationMod } from "types/user"

interface NotificationPopupProps {
  title: string
  txt?: string
  icon?: IPopupNotificationIcon
  mod?: IPopupNotificationMod
  onClose?: () => void
  btnLeft?: string
  isFilling?: boolean
  onClick?: () => void
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  title,
  txt,
  icon = "info",
  mod,
  onClose,
  btnLeft,
  isFilling = true,
  onClick,
}) => {
  const classList = ["notification-popup", styles.notification, mod ? styles["notification--" + mod] : ""].join(" ")
  const currentIcon = useMemo(() => {
    if (!icon) return null
    switch (icon) {
      case "info":
        return <IconInfo />
      case "error":
        return <IconError />
      case "wait":
        return <IconWait />
      case "check":
        return <IconCheck />
      case "delete":
        return <IconDelete />
      default:
        return null
    }
  }, [icon])

  return (
    <div
      className={classList}
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
      {isFilling && (
        <div className={`notification-popup__timer ${styles.notification__timer}`}>
          <div className={`notification-popup__timer-filler ${styles["notification__timer-filler"]}`} />
        </div>
      )}
      {currentIcon && <div className={styles["notification__icon-wrap"]}>{currentIcon}</div>}
      <div className={styles.notification__main}>
        <h4 className={styles.notification__title}>{title}</h4>
        {txt && <p className={styles.notification__txt}>{txt}</p>}
        {btnLeft && (
          <div className={styles["notification__btn-wrap"]}>
            <DefaultBtn txt={btnLeft} minWidth={false} />
          </div>
        )}
      </div>
      <button
        className={styles.notification__close}
        onClick={() => {
          if (onClose) onClose()
        }}
      >
        <IconClose />
      </button>
    </div>
  )
}

export default NotificationPopup
