import styles from "./ProgressLine.module.scss"
import IconCheck from "public/assets/svg/check-sm.svg"
import IconCross from "public/assets/svg/cross.svg"

interface Props {
  percents: number
  mod?: "complete" | "overdue" | null
}

const ProgressLine: React.FC<Props> = ({ percents, mod }) => {
  return (
    <>
      <div className={`${styles["progress-line"]} ${mod ? styles["progress-line--" + mod] : ""}`}>
        <span style={{ width: `${percents}%` }} className={`${styles.line}`}>
          <span className={`${styles.circle}`}>
            <span className={`${styles["circle-border"]}`}></span>
            {mod === "overdue" ? <IconCross /> : <IconCheck />}
          </span>
        </span>
      </div>
    </>
  )
}

export default ProgressLine
