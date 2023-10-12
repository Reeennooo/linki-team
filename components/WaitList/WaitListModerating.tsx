import React from "react"
import styles from "./WaitList.module.scss"

const WaitListModerating: React.FC = () => {
  return (
    <div className={`${styles.thx} ${styles["thx--wait"]}`}>
      <div className={styles.thx__main}>
        <h1 className={styles.thx__title}>You are on waitlist!</h1>
        <p className={styles.thx__description}>
          Thanks for your submitted application! Your profile is under moderation. We&#39;ll come back to you soon.
        </p>
        <img className={styles.thx__img} src={"/assets/wait.png"} alt={"wait"} />
      </div>
    </div>
  )
}

export default WaitListModerating
