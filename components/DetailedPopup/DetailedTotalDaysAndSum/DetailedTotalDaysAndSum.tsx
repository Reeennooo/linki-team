import { numberFormat } from "utils/formatters"
import styles from "./DetailedTotalDaysAndSum.module.scss"
import Dollar from "public/assets/svg/dollar.svg"

interface Props {
  sum: number
  days: number
  addClass?: string
}

const DetailedTotalDaysAndSum: React.FC<Props> = ({ sum, addClass, days }) => {
  return (
    <div className={`${addClass ? addClass : ""}`}>
      <div className={`${styles["total-border"]}`}></div>
      <div className={`${styles["total-row"]}`}>
        <p className={`${styles["total-row__title"]}`}>Total sum</p>
        <p className={`${styles["total-row__value"]}`}>
          <Dollar width={11} />
          <span>{numberFormat(sum)}</span>
        </p>
      </div>
      <div className={`${styles["total-row"]}`}>
        <p className={`${styles["total-row__title"]}`}>Realization period</p>
        <p className={`${styles["total-row__value"]}`}>
          <span>{numberFormat(days)} days</span>
        </p>
      </div>
    </div>
  )
}

export default DetailedTotalDaysAndSum
