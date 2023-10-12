import styles from "./SelectDropBlock.module.scss"
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react"
import { useOnClickOutside } from "../../../hooks/useOnClickOutside"

interface Props {
  placeholder: string
  child: ReactNode
  isSelectOpen?: boolean
  setSelectBlockOpen?: Dispatch<SetStateAction<boolean>>
  isFilled?: boolean
  disabled?: boolean
  addClass?: string
  editId?: string
}

const SelectDropBlock: React.FC<Props> = ({
  placeholder,
  child,
  isSelectOpen,
  setSelectBlockOpen,
  isFilled,
  disabled,
  addClass,
  editId,
}) => {
  const selectRef = useRef()
  const [isOpen, setOpen] = useState(isSelectOpen || false)
  const handleOpen = () => {
    const currentOpen = isOpen
    setOpen(!currentOpen)
    if (setSelectBlockOpen) setSelectBlockOpen(!currentOpen)
  }

  useOnClickOutside(selectRef, () => {
    setOpen(false)
    if (setSelectBlockOpen) setSelectBlockOpen(false)
  })

  useEffect(() => {
    setOpen(isSelectOpen)
  }, [isSelectOpen])

  const selectDropBlockClasses = [
    "select-drop-block",
    styles.select,
    isOpen ? `select-drop-block--active ${styles["select--active"]}` : "",
    addClass ? addClass : "",
    isFilled ? styles["select--filled"] : "",
    disabled ? styles["select--disabled"] : "",
  ].join(" ")

  return (
    <div ref={selectRef} className={selectDropBlockClasses}>
      <button id={editId ? editId : null} className={`${styles.select__btn}`} type="button" onClick={handleOpen}>
        {placeholder}
        <svg width="12" height="7" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.396447 0.146447C0.591709 -0.0488155 0.908291 -0.0488155 1.10355 0.146447L7 6.04289L12.8964 0.146447C13.0917 -0.0488155 13.4083 -0.0488155 13.6036 0.146447C13.7988 0.341709 13.7988 0.658291 13.6036 0.853553L7.35355 7.10355C7.15829 7.29882 6.84171 7.29882 6.64645 7.10355L0.396447 0.853553C0.201184 0.658291 0.201184 0.341709 0.396447 0.146447Z"
          />
        </svg>
      </button>
      <div className={`${styles.select__drop} select-drop-block__drop`}>
        <div className={styles.select__inner}>{child}</div>
      </div>
    </div>
  )
}

export default SelectDropBlock
