import styles from "./ExpertCard.module.scss"

import IconPancil from "public/icons/pencil-icon.svg"
import IconNote from "public/assets/svg/ic-note.svg"
import IconCursor from "public/assets/svg/ic-cursor.svg"
import IconGear from "public/assets/svg/ic-gear.svg"
import IconBitcoin from "public/assets/svg/ic-bitcoin.svg"
import IconFile from "public/assets/svg/ic-file.svg"
import IconSoft from "public/assets/svg/ic-soft.svg"
import IconPeople from "public/assets/svg/ic-people.svg"
import IconX from "public/icons/x-icon.svg"
import IconTrash from "public/icons/trash-icon.svg"
import { numberFormat } from "utils/formatters"
import { useEffect, useRef, useState } from "react"
import RangeSlider from "components/ui/RangeSlider/RangeSlider"
import ReactTooltip from "react-tooltip"
import useUnmount from "hooks/useUnmount"

interface Props {
  expert: {
    id: number
    salary_per_hour: number
    hours: number
    job_role: string
    area_expertise_id: number
  }
  readonly?: boolean
  addClass?: string
  dellExpert?(id: number): void
  changePrice?(id: number, salary_per_hour: number): void
  changeHours?(id: number, hours: number): void
  initialOpen?: boolean
}
const ExpertCard: React.FC<Props> = ({
  expert,
  addClass,
  dellExpert,
  changePrice,
  changeHours,
  readonly,
  initialOpen,
}) => {
  //Изменение прайса
  const onChangePrice = (val) => {
    if (/^-?\d*[.,]?\d*$/.test(val) === false) {
      return false
    }

    let newVal = null

    if (typeof val === "string") {
      newVal = val.replace("-", "").replace(",", ".")
      if (newVal.includes(".") && newVal.split(".")[1].length > 2) return false
    }

    changePrice(expert.id, newVal ? Number(newVal) : val)
  }
  const onChangeHours = (val) => {
    if (/^-?\d*[.,]?\d*$/.test(val) === false) {
      return false
    }
    let newVal = null

    if (typeof val === "string") {
      newVal = val.replace("-", "").replace(",", ".")
      if (newVal.includes(".") && newVal.split(".")[1].length > 2) return false
    }

    changeHours(expert.id, newVal ? Number(newVal) : val)
  }
  const iconSelector = (id) => {
    switch (id) {
      case 11:
        return <IconPancil />
      case 2:
        return <IconNote />
      case 10:
        return <IconCursor />
      case 13:
        return <IconGear />
      case 11115:
        return <IconBitcoin />
      case 111164:
        return <IconFile />
      case 9:
        return <IconSoft />
      case 48:
        return <IconPeople />
      default:
        return <p>Def</p>
    }
  }

  function getHeight() {
    return controllsRef.current.clientHeight
  }
  const [radioWrappHeight, setRadioWrappHeight] = useState("0")
  const [experOpen, setExpertOpen] = useState(initialOpen ? initialOpen : false)
  const [overflow, setOverFlow] = useState(true)
  const controllsRef = useRef(null)

  useEffect(() => {
    if (experOpen) {
      setRadioWrappHeight(getHeight())
    } else {
      setRadioWrappHeight("0")
    }
  }, [experOpen])

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  useUnmount(() => {
    ReactTooltip.hide()
  })

  useEffect(() => {
    if (experOpen) {
      setTimeout(() => {
        setOverFlow(false)
      }, 200)
    } else {
      setOverFlow(true)
    }
  }, [experOpen])

  return (
    <>
      <div className={`${styles["expert-card-wrp"]} ${addClass ? addClass : ""} `}>
        <div
          className={`${styles["expert-card"]} ${addClass ? addClass : ""} ${
            readonly ? styles["expert-card--readonly"] : ""
          }`}
        >
          <div className={`${styles["expert-card__icon"]}`}>{iconSelector(expert.area_expertise_id)}</div>
          <div className={`${styles["expert-card__name"]}`}>{expert.job_role}</div>
          <div className={`${styles["expert-card__price"]}`}>
            <span className={`${styles["price"]}`}>
              $
              {readonly ? (
                <span>{expert.salary_per_hour}</span>
              ) : (
                <input
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onChangePrice(e.target.value)}
                  style={{
                    width: `${
                      String(expert.salary_per_hour).length * (String(expert.salary_per_hour).length === 1 ? 12 : 10)
                    }px`,
                  }}
                  value={expert.salary_per_hour}
                />
              )}
              /hr
            </span>
            <IconX />
            <span className={`${styles["hours"]}`}>
              {readonly ? (
                <span>{expert.hours}</span>
              ) : (
                <input
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onChangeHours(e.target.value)}
                  style={{
                    width: `${String(expert.hours).length * (String(expert.hours).length === 1 ? 12 : 10)}px`,
                  }}
                  value={expert.hours}
                />
              )}
              hr
            </span>
            <span className={`${styles["evenly"]}`}>=</span>
            <span className={`${styles["total"]}`}>${numberFormat(expert.salary_per_hour * expert.hours)}</span>
          </div>
          {!readonly && (
            <div className={`${styles["expert-card__btns"]}`}>
              <div
                className={`${styles["expert-card__btn-icon"]}`}
                data-for="global-tooltip"
                data-tip={"Edit Price"}
                onClick={() => setExpertOpen(!experOpen)}
              >
                <IconPancil />
              </div>
              <div
                className={`${styles["expert-card__btn-icon"]} ${styles["dell"]}`}
                data-for="global-tooltip"
                data-tip={"Delete"}
                onClick={() => {
                  dellExpert(expert.id)
                }}
              >
                <IconTrash />
              </div>
            </div>
          )}
        </div>
        {!readonly && (
          <div
            className={`${styles["controlls-wrp"]} ${overflow ? styles["is-overflow"] : ""} ${
              experOpen ? styles["is-active"] : ""
            }`}
            style={{ height: radioWrappHeight }}
          >
            <div className={`${styles["controlls"]}`} ref={controllsRef}>
              <span
                className={`${styles["controlls__close"]}`}
                onClick={() => {
                  setExpertOpen(false)
                }}
              ></span>
              <div className={`${styles["controlls__item"]}`}>
                <div className={`${styles["controlls__top"]}`}>
                  <p className={`${styles["controlls__title"]}`}>Select the approximate hourly rate of a specialist</p>
                </div>
                <RangeSlider
                  values={expert.salary_per_hour}
                  min={50}
                  max={210}
                  prefix={"$"}
                  handlerColor={"green"}
                  onChange={onChangePrice}
                />
              </div>
              <div className={`${styles["controlls__item"]}`}>
                <div className={`${styles["controlls__top"]}`}>
                  <p className={`${styles["controlls__title"]}`}>Select the number of hours of operation:</p>
                </div>
                <RangeSlider values={expert.hours} min={1} max={160} suffix={"hours"} onChange={onChangeHours} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
export default ExpertCard
