import React from "react"
import styles from "./OtherHero.module.scss"

const OtherHero = () => {
  return (
    <>
      <div className={styles["hero"]}>
        <div className={`container container--small`}>
          <h1 className="section-title">
            Соберём
            <br /> удаленную команду под любую задачу
          </h1>
          <div className={styles["card-container"]}>
            <div className={styles["card-text"]}>
              <h3>Project manager</h3>
              <span>Category 25</span>
            </div>
            <div className={styles["card-decorate-top"]}></div>
            <div className={styles["card-img"]}>
              <img src="./img/secondHero/avatar4.png"></img>
            </div>
            <div className={styles["card-decorate-top"]}></div>
            <div className={styles["card-decorate"]}></div>
            <div className={styles["card-img"]}>
              <img src="./img/secondHero/avatar10.jpg"></img>
            </div>
            <div className={styles["card-decorate"]}></div>
            <div className={styles["card-img"]}>
              <img src="./img/secondHero/avatar6.jpg"></img>
            </div>
            <div className={styles["card-img"]}>
              <img src="./img/secondHero/avatar2.jpg"></img>
            </div>
            <div className={styles["card-decorate"]}></div>
            <div className={styles["card-text"]}>
              <h3>Project manager</h3>
              <span>Category 25</span>
            </div>
            <div className={styles["card-decorate"]}></div>
            <div className={styles["card-decorate"]}></div>
            <div className={styles["card-img"]}>
              <img src="./img/secondHero/avatar1.jpg"></img>
            </div>
            <div className={styles["card-decorate"]}></div>
            <div className={styles["card-decorate"]}></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OtherHero
