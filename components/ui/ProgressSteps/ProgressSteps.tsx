import styles from "./ProgressSteps.module.scss"
import React, { useMemo } from "react"

interface Props {
  steps: number
  step: number
  className?: string
}

const ProgressSteps: React.FC<Props> = ({ steps, step, className }) => {
  const progressLines = useMemo(() => {
    const output = []
    for (let i = 1; i < steps + 1; i++) {
      output.push(
        <div key={i} className={`${styles.progress__line} ${i <= step ? styles["progress__line--is-active"] : ""}`} />
      )
    }
    return <div className={styles.progress__lines}>{output}</div>
  }, [step, steps])

  return (
    <div className={`progress-steps ${styles.progress} ${className ? className : ""}`}>
      <p className={styles.progress__content}>
        {step}/{steps}
      </p>
      {progressLines}
    </div>
  )
}

export default ProgressSteps
