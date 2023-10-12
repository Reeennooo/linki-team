import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import styles from "./ConfirmPrompt.module.scss"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import { useRef, useState } from "react"
import { useOnClickOutside } from "hooks/useOnClickOutside"

interface IProps {
  title: string
  className?: string
  onClick?: () => void
  mainBtnTxt?: string
  mainBtnTxtMod?: string
  btnTip?: string
  btnIcon?:
    | JSX.Element
    | "dwl"
    | "upl"
    | "chat"
    | "archive"
    | "heart"
    | "warning"
    | "incoming"
    | "delete"
    | "plus"
    | "back"
    | "signout"
  cancelBtnTxt?: string
  dropMainBtnTxt?: string
  mod?: string
  disabled?: boolean
}

const ConfirmPrompt: React.FC<IProps> = ({
  title,
  className,
  onClick,
  mainBtnTxt,
  mainBtnTxtMod,
  btnTip = "Delete",
  btnIcon = "delete",
  mod = "warning",
  cancelBtnTxt = "Cancel",
  dropMainBtnTxt = "Remove",
  disabled,
}) => {
  const promptRef = useRef()

  const [isOpen, setOpen] = useState<boolean>(false)
  const [dropPos, setDropPos] = useState("")

  const handleClose = () => {
    setOpen(false)
  }

  const handleClick = () => {
    if (isOpen) {
      handleClose()
      return
    }
    const promptRefCurrent = promptRef.current as HTMLElement
    const coord = {
      left: promptRefCurrent.getBoundingClientRect().left,
      right: promptRefCurrent.getBoundingClientRect().right,
    }
    if (window.innerWidth <= 575) {
      setDropPos("")
    } else {
      setDropPos(coord.left < 150 ? "left" : window.innerWidth - coord.right < 150 ? "right" : "")
    }
    setOpen((prev) => !prev)
  }

  useOnClickOutside(promptRef, () => {
    setOpen(false)
  })

  return (
    <div
      ref={promptRef}
      className={`confirm-prompt ${styles.prompt} ${className ? className : ""} ${
        isOpen ? styles["prompt--is-active"] : ""
      }`}
    >
      {mainBtnTxt ? (
        <DefaultBtn
          txt={mainBtnTxt}
          onClick={handleClick}
          mod={mainBtnTxtMod}
          disabled={disabled ? disabled : undefined}
        />
      ) : (
        <IconBtn
          icon={btnIcon}
          mod={mod}
          dataFor={"global-tooltip"}
          dataTip={btnTip}
          width={19}
          height={19}
          onClick={handleClick}
          disabled={disabled ? disabled : undefined}
        />
      )}

      <div className={`${styles.prompt__drop} ${dropPos ? styles["prompt__drop--" + dropPos] : ""}`}>
        <div className={styles.prompt__overlay} onClick={handleClose} />
        <div className={styles.prompt__inner}>
          <div className={styles.prompt__body}>
            <h3 className={styles.prompt__title}>{title}</h3>
          </div>
          <div className={styles.prompt__footer}>
            <DefaultBtn
              txt={cancelBtnTxt}
              minWidth={false}
              mod={"transparent-grey"}
              size={"md"}
              onClick={handleClose}
            />
            <DefaultBtn
              txt={dropMainBtnTxt}
              minWidth={false}
              mod={"warning"}
              size={"md"}
              onClick={() => {
                if (onClick) onClick()
                handleClose()
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmPrompt
