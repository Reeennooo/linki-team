import React from "react"
import styles from "./HeroThird.module.scss"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"

interface Props {
  children
}

const HeroThird: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className={`${styles["wrapper"]} container container--small`}>
        <h1 className={`${styles["title"]} section-title`}>
          Запускаете
          <br />
          новый проект?
        </h1>
      </div>
      <div className={styles["hero"]}>
        <img className={styles["hero-img"]} src="./img/secondHero/hero.png" />
        {children}
      </div>
    </>
  )
}

export default HeroThird
