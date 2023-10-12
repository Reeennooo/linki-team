import React from "react"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import styles from "./WaitList.module.scss"

const WaitListThx: React.FC = () => {
  return (
    <div className={styles.thx}>
      <div className={styles.thx__main}>
        <h1 className={styles.thx__title}>Thanks for submitted application</h1>
        <p className={styles.thx__description}>
          You are almost finished! The last step is to build your team profile so you can open the door to new clients.
        </p>
        <img className={styles.thx__img} src={"/assets/completed.png"} alt={"completed"} />
      </div>
      <div className={styles.thx__footer}>
        <DefaultBtn addClass={styles.thx__btn} txt={"Go to team profile"} size={"lg"} href={"/teams/create"} />
      </div>
    </div>
  )
}

export default WaitListThx
