import { numberFormat } from "utils/formatters"
import styles from "./DetailedPopupTotal.module.scss"
import Dollar from "public/assets/svg/dollar.svg"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import IconPancil from "public/icons/pencil-icon.svg"
import { PERCENT_PM } from "utils/constants"
import NumberFormat from "react-number-format"
import { useEffect, useRef, useState } from "react"

interface Props {
  readonly?: boolean
  addClass?: string
  totalTeamSum: number
  pmTotal: number
  comission: number
  vat: number
  totalSum: number
  applyFn?: () => void
  editMod?: boolean
  showBtn?: boolean
  changePeriodFn?: (val: number) => void
  tempPeriod?: number
  period: number
  setEditMOd?: (val: boolean) => void
  setPmPercent?: (val: number) => void
  pmPrice?: number
}
const DetailedPopupTotal: React.FC<Props> = ({
  totalTeamSum,
  pmTotal,
  comission,
  vat,
  addClass,
  totalSum,
  applyFn,
  editMod,
  showBtn,
  changePeriodFn,
  tempPeriod,
  period,
  setEditMOd,
  readonly,
  setPmPercent,
  pmPrice,
}) => {
  const inputAmountParentRef = useRef(null)
  const [pmPayment, setPmPayment] = useState("percent")
  const [percentAmount, setPercentAmount] = useState(null)
  const [showMask, setShowMask] = useState<boolean>(false)

  useEffect(() => {
    if (pmPayment === "percent" && setPmPercent) setPmPercent(PERCENT_PM)
    if (pmPayment === "amount") {
      if (typeof percentAmount === "string") {
        if (setPmPercent) setPmPercent(Number(percentAmount.replace("$", "")))
      } else if (typeof percentAmount === "number") {
        setPmPercent(percentAmount)
      }
    }
  }, [pmPayment, percentAmount])

  useEffect(() => {
    if (pmPrice > 0.99) {
      setPmPayment("amount")
      setPercentAmount(pmPrice)
    }
  }, [pmPrice])

  return (
    <>
      <div className={`${styles["total"]} ${addClass ? addClass : ""}`}>
        {!readonly && (
          <div className={`${styles["total__calc-method"]} `}>
            <h3 className={`${styles["total__title"]} `}>Payment calculation method</h3>
            <p className={`${styles["total__txt"]} `}>Choose the method of calculating your payment for the project</p>
            <div className={`${styles["total-method-selectors"]} `}>
              <div
                className={`${styles["total-method-selector"]} ${pmPayment === "percent" ? styles["is-active"] : ""}`}
                onClick={() => {
                  setPmPayment("percent")
                  setPercentAmount("")
                  setShowMask(false)
                }}
              >
                <div className={styles["total-method-selector__left"]}>
                  <div className={styles["total-method-selector__indicator"]}></div>
                  <div className={styles["total-method-selector__txt"]}>{PERCENT_PM * 100}% of all payments</div>
                </div>
              </div>
              <div
                className={`${styles["total-method-selector"]} ${pmPayment === "amount" ? styles["is-active"] : ""}`}
                ref={inputAmountParentRef}
                onClick={() => {
                  setPmPayment("amount")
                  inputAmountParentRef.current.querySelector("input").focus()
                }}
              >
                <div className={styles["total-method-selector__left"]}>
                  <div className={styles["total-method-selector__indicator"]}></div>
                  <div className={styles["total-method-selector__txt"]}>Enter the amount</div>
                </div>
                <NumberFormat
                  autoComplete="false"
                  className={`input-global  ${styles["total-method-selector__input"]}`}
                  placeholder="$0.00"
                  allowEmptyFormatting={showMask}
                  allowNegative={false}
                  prefix={"$"}
                  value={percentAmount}
                  onBlur={(e) => {
                    if (e.target.value <= 0) {
                      setPmPayment("percent")
                      setPercentAmount("")
                      setShowMask(false)
                    }
                  }}
                  onFocus={() => {
                    setShowMask(true)
                  }}
                  onChange={(e) => setPercentAmount(e.target.value)}
                  decimalScale={0}
                  isAllowed={(values) => {
                    const { floatValue } = values
                    return typeof floatValue === "undefined" || (floatValue > -1 && floatValue < 9999)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className={`${styles["total__item"]} ${styles["total__item-team"]}`}>
          <p className={`${styles["total__item-title"]}`}>Team Сosts</p>
          <p className={`${styles["total__item-value"]}`}>
            <Dollar width={11} />
            <span>{numberFormat(totalTeamSum)}</span>
          </p>
        </div>
        <div className={`${styles["total__item"]} ${styles["total__item-team"]}`}>
          <p className={`${styles["total__item-title"]}`}>Project Manager Salary</p>
          <p className={`${styles["total__item-value"]}`}>
            <Dollar width={11} />
            <span>{numberFormat(pmTotal)}</span>
          </p>
        </div>
        <div className={`${styles["total__item"]} ${styles["total__item-team"]}`}>
          <p className={`${styles["total__item-title"]}`}>Exchange Commission</p>
          <p className={`${styles["total__item-value"]}`}>
            <Dollar width={11} />
            <span>{numberFormat(comission)}</span>
          </p>
        </div>
        <div className={`${styles["total__item"]} ${styles["total__item-team"]}`}>
          <p className={`${styles["total__item-title"]}`}>VAT</p>
          <p className={`${styles["total__item-value"]}`}>
            <Dollar width={11} />
            <span>{numberFormat(vat)}</span>
          </p>
        </div>

        <div className={`${styles["total__border"]}`}></div>
        <div className={`${styles["total__item"]}`}>
          <p className={`${styles["total__item-title"]}`}>Total sum</p>
          <p className={`${styles["total__item-value"]}`}>
            <Dollar width={11} />
            <span>{numberFormat(totalSum)}</span>
          </p>
        </div>
        <div className={`${styles["total__item"]}`}>
          <p className={`${styles["total__item-title"]}`}>Realization period</p>
          <p className={`${styles["total__item-value"]}`}>
            {editMod && !readonly ? (
              <>
                {showBtn && <DefaultBtn minWidth={false} mod={"success"} onClick={applyFn} txt={"Apply"} size={"md"} />}
                <span className={`${styles["total__input-wrp"]}`}>
                  <input
                    onChange={(e) => {
                      changePeriodFn && changePeriodFn(Number(e.target.value))
                    }}
                    type="text"
                    value={tempPeriod}
                    style={{ width: `${String(tempPeriod).length * 12}px` }}
                  />
                </span>
              </>
            ) : (
              <>
                {!readonly && (
                  <>
                    <button onClick={() => setEditMOd(true)} className={`${styles["total__edit"]}`}>
                      <IconPancil />
                    </button>{" "}
                  </>
                )}
                <span>{period}</span>
              </>
            )}{" "}
            days
          </p>
        </div>
      </div>
    </>
  )
}
export default DetailedPopupTotal
