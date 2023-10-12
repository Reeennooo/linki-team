import Link from "next/link"
import styles from "./IconBtn.module.scss"
import React, { useEffect, useMemo, useState } from "react"
import IconArchive from "public/assets/svg/archive-box.svg"
import IconArchiveTray from "public/assets/svg/archive-tray.svg"
import IconDwl from "public/assets/svg/download.svg"
import IconUpl from "public/assets/svg/upload.svg"
import IconChat from "public/assets/svg/chat-md.svg"
import IconHeart from "public/assets/svg/heart.svg"
import IconWarning from "public/assets/svg/warning-octagon.svg"
import IconDelete from "public/assets/svg/delete.svg"
import IconBack from "public/assets/svg/arr-left-lg.svg"
import IconSignOut from "public/assets/svg/SignOut.svg"
import IconPaperclip from "public/assets/svg/paperclip.svg"
import IconPaperPlaneRight from "public/assets/svg/paper-plane-right.svg"

interface Props {
  icon:
    | JSX.Element
    | "dwl"
    | "upl"
    | "chat"
    | "archive"
    | "archive-tray"
    | "heart"
    | "warning"
    | "incoming"
    | "delete"
    | "plus"
    | "back"
    | "signout"
    | "paperclip"
    | "paper-plane-right"
  href?: string
  mod?: string
  size?: "md" | "lg"
  width?: number
  height?: number
  addClass?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  isActive?: boolean
  isOnline?: boolean
  isTargetBlank?: boolean
  onClick?: () => void
  dataFor?: string
  dataTip?: string
}

const IconBtn: React.FC<Props> = ({
  href,
  mod,
  size,
  width,
  height,
  addClass,
  icon,
  disabled,
  type = "button",
  isActive,
  isOnline,
  isTargetBlank,
  onClick,
  dataFor,
  dataTip,
}) => {
  const modList = mod?.split(",").map((cl) => {
    const clName = cl.replace(/\s/g, "")
    return styles["btn--" + clName]
  })

  const iconEl = useMemo(() => {
    const attributes = {}
    if (width) attributes["width"] = width
    if (height) attributes["height"] = height
    switch (icon) {
      case "dwl":
        return <IconDwl {...attributes} />
      case "upl":
        return <IconUpl {...attributes} />
      case "chat":
        return <IconChat {...attributes} />
      case "archive":
        return <IconArchive {...attributes} />
      case "archive-tray":
        return <IconArchiveTray {...attributes} />
      case "heart":
        return <IconHeart {...attributes} />
      case "warning":
        return <IconWarning {...attributes} />
      case "delete":
        return <IconDelete {...attributes} />
      case "back":
        return <IconBack {...attributes} />
      case "signout":
        return <IconSignOut {...attributes} />
      case "paperclip":
        return <IconPaperclip {...attributes} />
      case "paper-plane-right":
        return <IconPaperPlaneRight {...attributes} />
      case "incoming":
        return (
          <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.14233 0.321212C1.21008 0.185699 1.34859 0.100098 1.5001 0.100098H10.5001C10.6516 0.100098 10.7901 0.185699 10.8579 0.321212L11.8579 2.32121C11.8856 2.37675 11.9001 2.438 11.9001 2.5001V11.0001C11.9001 11.2388 11.8053 11.4677 11.6365 11.6365C11.4677 11.8053 11.2388 11.9001 11.0001 11.9001H1.0001C0.761403 11.9001 0.532485 11.8053 0.363702 11.6365C0.194919 11.4677 0.100098 11.2388 0.100098 11.0001V2.5001C0.100098 2.438 0.114556 2.37675 0.142327 2.32121L1.14233 0.321212ZM1.74731 0.900098L0.900098 2.59453V11.0001C0.900098 11.0266 0.910634 11.0521 0.929387 11.0708C0.94814 11.0896 0.973575 11.1001 1.0001 11.1001H11.0001C11.0266 11.1001 11.0521 11.0896 11.0708 11.0708C11.0896 11.0521 11.1001 11.0266 11.1001 11.0001V2.59453L10.2529 0.900098H1.74731Z"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.40433 6.90433C8.24812 7.06054 7.99485 7.06054 7.83864 6.90433L6.00017 5.06586L4.1617 6.90433C4.00549 7.06054 3.75223 7.06054 3.59602 6.90433C3.43981 6.74812 3.43981 6.49485 3.59602 6.33864L5.71733 4.21733C5.87354 4.06112 6.1268 4.06112 6.28301 4.21733L8.40433 6.33864C8.56054 6.49485 8.56054 6.74812 8.40433 6.90433Z"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.9999 9.90015C5.77899 9.90015 5.5999 9.72106 5.5999 9.50015L5.5999 4.50015C5.5999 4.27923 5.77899 4.10015 5.9999 4.10015C6.22082 4.10015 6.3999 4.27923 6.3999 4.50015L6.3999 9.50015C6.3999 9.72106 6.22082 9.90015 5.9999 9.90015Z"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.100098 2.5001C0.100098 2.27918 0.279184 2.1001 0.500098 2.1001H11.5001C11.721 2.1001 11.9001 2.27918 11.9001 2.5001C11.9001 2.72101 11.721 2.9001 11.5001 2.9001H0.500098C0.279184 2.9001 0.100098 2.72101 0.100098 2.5001Z"
            />
          </svg>
        )
      case "plus":
        return <div className={styles["btn__plus"]} />
      default:
        return icon
    }
  }, [height, icon, width])

  const [isMobile, setMobile] = useState<boolean>(false)
  useEffect(() => {
    setMobile(window.innerWidth <= 767)
  }, [])

  const btnClasses = [
    "icon-btn",
    styles.btn,
    size ? styles["btn--" + size] : "",
    modList ? modList : "",
    isActive ? styles["btn--is-active"] : "",
    addClass ? addClass : "",
    isOnline ? styles["btn--is-online"] : "",
    disabled ? styles["btn--disabled"] : "",
  ].join(" ")

  return href ? (
    <Link href={href}>
      <a
        className={btnClasses}
        target={isTargetBlank ? "_blank" : undefined}
        onClick={onClick}
        data-for={dataFor || undefined}
        data-tip={dataTip || undefined}
        data-tip-disable={isMobile}
      >
        {isOnline ? <span>{iconEl}</span> : iconEl}
      </a>
    </Link>
  ) : (
    <button
      type={type}
      className={btnClasses}
      disabled={disabled}
      onClick={onClick}
      data-for={dataFor || undefined}
      data-tip={dataTip || undefined}
      data-tip-disable={isMobile}
    >
      {isOnline ? <span>{iconEl}</span> : iconEl}
    </button>
  )
}

export default IconBtn
