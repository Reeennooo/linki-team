import React, { useMemo } from "react"
import styles from "./DefaultBtn.module.scss"
import IconDwl from "public/assets/svg/download.svg"
import IconUpl from "public/assets/svg/upload.svg"
import IconChat from "public/assets/svg/ic-chat.svg"
import IconSignIn from "public/assets/svg/SignIn.svg"
import IconSignOut from "public/assets/svg/SignOut.svg"
import IconShare from "public/icons/share-icon.svg"
import Link from "next/link"

interface Props {
  txt: string
  props?: any
  onClick?: any
  mod?: string
  addClass?: string
  icon?: "dwl" | "upl" | "chat" | "share" | "signin" | "signout" | JSX.Element
  disabled?: boolean
  href?: string
  minWidth?: boolean
  size?: "md" | "lg"
  redBtn?: boolean
  type?: "button" | "submit" | "reset"
  isTargetBlank?: boolean
  btnId?: string
}

const DefaultBtn: React.FC<Props> = ({
  txt,
  mod,
  onClick,
  addClass,
  icon,
  disabled,
  href,
  minWidth = true,
  size,
  redBtn,
  type = "button",
  isTargetBlank,
  btnId,
  ...props
}) => {
  const iconEl = useMemo(() => {
    switch (icon) {
      case "dwl":
        return <IconDwl />
      case "upl":
        return <IconUpl />
      case "chat":
        return <IconChat />
      case "share":
        return <IconShare />
      case "signin":
        return <IconSignIn />
      case "signout":
        return <IconSignOut />
      default:
        return icon
    }
  }, [icon])

  const btnClasses = [
    "default-btn",
    styles.btn,
    minWidth ? "" : styles["btn--min-width-auto"],
    size ? styles["btn--" + size] : "",
    mod ? styles["btn--" + mod] : "",
    addClass ? addClass : "",
    redBtn ? styles.btn_red : "",
    disabled ? styles["btn--disabled"] : "",
  ].join(" ")

  return (
    <>
      {href ? (
        <Link href={href}>
          <a onClick={onClick} className={btnClasses} target={isTargetBlank ? "_blank" : undefined} {...props}>
            {iconEl}
            {txt}
          </a>
        </Link>
      ) : (
        <button onClick={onClick} id={btnId} className={btnClasses} disabled={disabled} type={type} {...props}>
          {iconEl}
          {txt}
        </button>
      )}
    </>
  )
}

export default DefaultBtn
