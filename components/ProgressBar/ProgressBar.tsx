import styles from "./ProgressBar.module.scss"
import ProgressLine from "components/ProgressLine/ProgressLine"
interface Props {
  title?: string
  progress: number
  mod?: "lg" | "md"
  addClass?: string
  daysRemain?: number
}

const ProgressBar: React.FC<Props> = ({ progress, title, mod, addClass, daysRemain }) => {
  return (
    <>
      <div
        className={` 
        ${mod ? styles["progress-bar--" + mod] : ""} 
        ${addClass ? addClass : ""}
        ${progress >= 100 && progress === 100 ? styles["progress-bar--complete"] : ""}
        ${progress > 100 ? styles["progress-bar--overdue"] : ""}
        `}
      >
        <div className={`progress-bar__progress-data ${styles["progress-bar__progress-data"]}`}>
          {daysRemain < 0 ? (
            <p className={`${styles["progress-bar__progress-text"]}`}>Late completion of the project</p>
          ) : (
            <>
              <span
                className={`progress-bar__progress-text ${styles["progress-bar__progress-text"]}`}
                dangerouslySetInnerHTML={{ __html: `${title ? title : "Progress"}` }}
              ></span>
              <span className={`progress-bar__percents ${styles["progress-bar__percents"]}`}>
                {progress < 100 ? progress : progress === 100 ? Math.round(progress) : 100}%
              </span>
            </>
          )}
        </div>
        <ProgressLine
          mod={daysRemain < 0 ? "overdue" : progress === 100 ? "complete" : null}
          percents={progress < 100 ? progress : progress === 100 ? Math.round(progress) : 100}
        />
      </div>
    </>
  )
}

export default ProgressBar
