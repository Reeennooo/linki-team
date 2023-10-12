import React from "react"
import styles from "./NeedList.module.scss"
import CheckIcon from "public/assets/svg/check.svg"

interface Props {
  text: string
  img?: boolean
  reverse?: boolean
}

const NeedListEl: React.FC<Props> = ({ text, img, reverse }) => {
  return (
    <>
      {img ? (
        <div className={`${styles["card"]} ${styles["card-withImg"]} ${reverse ? styles["reverse"] : ""}`}>
          <p>{text}</p>
          <div className={styles["check"]}>
            <CheckIcon />
          </div>
          <img src="./img/card/boy.png" className={styles["image"]}></img>
        </div>
      ) : (
        <div className={`${styles["card"]} ${reverse ? styles["reverse"] : ""}`}>
          <p>{text}</p>
          <div className={styles["check"]}>
            <CheckIcon />
          </div>
        </div>
      )}
    </>
  )
}

export default NeedListEl
