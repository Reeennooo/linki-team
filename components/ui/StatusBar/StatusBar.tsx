import React from "react"
import IconClock from "public/assets/svg/clock.svg"
import styles from "./StatusBar.module.scss"

interface StatusBarProps {
  txt: string
  className?: string
}

const StatusBar: React.FC<StatusBarProps> = ({ txt, className }) => {
  return (
    <div className={`${styles.status} ${className ? className : ""}`}>
      <IconClock />
      <span className={styles.status__txt}>{txt}</span>
    </div>
  )
}

export default StatusBar
