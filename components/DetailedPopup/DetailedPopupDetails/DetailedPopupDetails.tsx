import { useEffect, useRef, useState } from "react"
import styles from "./DetailedPopupDetails.module.scss"
import ToggleBtn from "components/ui/btns/ToggleBtn/ToggleBtn"

interface Props {
  description: string | JSX.Element
  addClass?: string
  defOpen?: boolean
  addTitle?: string
}

const DetailedPopupDetails: React.FC<Props> = ({ description, defOpen, addClass, addTitle }) => {
  const descRef = useRef()

  const [radioWrapHeight, setRadioWrapHeight] = useState<string>("auto")
  const [open, setOPen] = useState(defOpen ? defOpen : false)

  const getHeight = () => {
    const innerElement = descRef.current as HTMLElement
    return innerElement.offsetHeight
  }
  useEffect(() => {
    setRadioWrapHeight(open ? getHeight() + "px" : "0")
  }, [open])

  return (
    <>
      <div className={`${styles["toggle-block"]} ${addClass ? addClass : ""}`}>
        <ToggleBtn
          addClass={styles["toggle-block__btn"]}
          txt={`${addTitle ? addTitle : "Details"}`}
          isActive={open}
          onClick={() => {
            setOPen(!open)
          }}
        />
        <div className={styles["toggle-block__main"]} style={{ height: radioWrapHeight }}>
          <div
            ref={descRef}
            className={styles["toggle-block__inner"]}
            dangerouslySetInnerHTML={{ __html: `${description}` }}
          />
        </div>
      </div>
    </>
  )
}

export default DetailedPopupDetails
