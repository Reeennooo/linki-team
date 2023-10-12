import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import styles from "./Complain.module.scss"
import { useEffect, useRef, useState } from "react"
import { useOnClickOutside } from "hooks/useOnClickOutside"
import IconClose from "public/assets/svg/close.svg"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import InputGroup from "components/ui/InputGroup/InputGroup"
import ComplainCheckboxes from "components/Complain/ComplainCheckboxes/ComplainCheckboxes"
import { useMakeComplainMutation } from "redux/api/user"

interface ComplainProps {
  title?: string
  subtitle?: string
  btnText?: string
  isCheckboxes?: boolean
  orderID: number
}

const Complain: React.FC<ComplainProps> = ({
  title = "Complain on the project",
  subtitle = "Please describe your complaint",
  btnText = "Submit a complaint",
  isCheckboxes,
  orderID,
}) => {
  const [makeComplain] = useMakeComplainMutation()

  const complainRef = useRef()

  const [isOpen, setOpen] = useState(false)
  const [complainValue, setComplainValue] = useState([])

  useOnClickOutside(complainRef, () => {
    setOpen(false)
  })
  useEffect(() => {
    if (!isOpen) setComplainValue([])
  }, [isOpen])

  const handleOpen = () => {
    setOpen((prev) => !prev)
  }
  const handleSubmit = () => {
    makeComplain({ order_id: orderID, text: complainValue.join(", ") })
    setOpen(false)
    setComplainValue([])
  }

  const classesList = ["complain", styles.complain, isOpen ? styles["complain--is-active"] : ""].join(" ")

  return (
    <div ref={complainRef} className={classesList}>
      <IconBtn
        dataFor={"global-tooltip"}
        dataTip={title}
        icon={"warning"}
        width={19}
        height={19}
        mod={"warning"}
        onClick={handleOpen}
      />
      <div className={styles.complain__overlay} onClick={handleOpen} />
      <div className={styles["complain__drop"]}>
        <div className={styles["complain__header"]}>
          <h4 className={styles["complain__title"]}>{title}</h4>
          <button type={"button"} className={styles["complain__close"]} onClick={handleOpen}>
            <IconClose />
          </button>
        </div>
        <div className={styles["complain__body"]}>
          <p className={styles["complain__subtitle"]}>{subtitle}</p>
          {isCheckboxes ? (
            <ComplainCheckboxes complainValue={complainValue} setComplainValue={setComplainValue} />
          ) : (
            <InputGroup
              placeholder={"Enter complain..."}
              addClass={styles["complain__input"]}
              type={"text"}
              fieldProps={{
                value: complainValue[0] || "",
                onChange: (e) => {
                  setComplainValue(e.target.value.length ? [e.target.value] : [])
                },
              }}
              smClass
            />
          )}
          <div className={styles["complain__footer"]}>
            <DefaultBtn
              txt={btnText}
              addClass={styles["complain__submit"]}
              onClick={handleSubmit}
              disabled={!complainValue.length}
              size={"md"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Complain
