import { useEffect, useRef, useState } from "react"
import styles from "./CheckboxToggler.module.scss"
import ReactTooltip from "react-tooltip"

interface Props {
  addClass?: string
  name?: string
  value?: string | number
  checked: boolean
  disabled?: boolean
  onChange?: any
  text?: string
  error?: boolean
  subChecked?: boolean
}

const CheckboxToggler: React.FC<Props> = ({
  addClass,
  name,
  value,
  checked,
  disabled,
  onChange,
  error,
  subChecked,
  ...props
}) => {
  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])
  const [clicked, setClicked] = useState(false)
  const checkboxRef = useRef(null)

  const handleClick = () => {
    if (window?.innerWidth > 767) {
      checkboxRef.current.click()
    }
  }
  return (
    <div className={`${styles["checkgox-toggler-wrp"]} ${addClass ?? ""} `}>
      <span
        onClick={handleClick}
        className={`${styles["checkgox-toggler-wrp__tooltip"]}`}
        data-for="global-tooltip-white"
        data-tip={
          "If you want to block user access to projects outside the team - turn on this switch and wait for confirmation from the performer"
        }
      ></span>
      <input
        ref={checkboxRef}
        className={`${styles["checkgox-toggler"]} ${subChecked ? styles["is-subchecked"] : ""}  ${
          error ? styles["is-error"] : ""
        }`}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          setClicked(true)
          setTimeout(() => {
            setClicked(false)
          }, 1500)
          if (onChange && typeof onChange === "function") {
            onChange(e)
          }
        }}
        style={{ opacity: `${clicked ? 0.8 : 1}`, pointerEvents: `${clicked ? "none" : "all"}` }}
      />
    </div>
  )
}

export default CheckboxToggler
