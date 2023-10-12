import React from "react"
import styles from "./HeroSecond.module.scss"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"

const HeroSecond: React.FC = () => {
  return (
    <>
      <div className={`${styles["wrapper"]} container container--small`}>
        <div className={styles["hero"]}>
          <img className={styles["zigzag"]} src="./img/decorate/zigzag.svg" />
          <div className={styles["avatar1"]}>
            <img src="./img/secondHero/avatar1.jpg" />
          </div>
          <div className={styles["avatar2"]}>
            <img src="./img/secondHero/avatar2.jpg" />
          </div>
          <div className={styles["avatar3"]}>
            <img src="./img/secondHero/avatar3.jpg" />
          </div>
          <div className={styles["avatar4"]}>
            <img src="./img/secondHero/avatar4.png" />
          </div>
          <div className={styles["text"]}>
            <div className={styles["text-violet"]}>Запускаете новый проект?</div>
            <h2>Тогда у вас точно есть задачи, которые смогут решить удаленные команды</h2>
          </div>
        </div>
      </div>
    </>
  )
}

export default HeroSecond
