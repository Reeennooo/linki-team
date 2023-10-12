import React from "react"
import styles from "./NeedList.module.scss"
import NeedListEl from "./NeedListEl"

interface Props {
  titleText: string
  reverse?: boolean
  addClass?: "padding" | "with-flash"
  // otherPadding?: boolean
  // borderRadius?: boolean
}

const NeedList: React.FC<Props> = ({ titleText, reverse, addClass }) => {
  const list = [
    {
      id: 1,
      text: "Нужен сайт\nс современным дизайном?",
      img: false,
    },
    {
      id: 2,
      text: "Нужно продвижение\nв социальных сетях?",
      img: false,
    },
    {
      id: 3,
      text: "Нужен лендинг\nдля продаж?",
      img: false,
    },
    {
      id: 4,
      text: "Нужно приложение\nдля IOS и Android?",
      img: false,
    },
    {
      id: 5,
      text: "Нужно расчитать\nбизнесмодель?",
      img: false,
    },
    {
      id: 6,
      text: "Нужно запустить рекламу\nна вашу целевую\nаудиторию?",
      img: true,
    },
  ]

  return (
    <>
      {addClass === "with-flash" ? (
        <div className={`${styles["needList"]} container container--small ${addClass ? styles[addClass] : ""}`}>
          <h3 className={`section-title`}>{titleText}</h3>
          <div className={styles["el-wrapper"]}>
            {list.map((el) => (
              <NeedListEl key={el.id} text={el.text} img={el.img} reverse={reverse} />
            ))}
          </div>
          <img className={styles["flash"]} src="./img/decorate/flash.png" />
        </div>
      ) : (
        <div className={`${styles["needList"]} container container--small ${addClass ? styles[addClass] : ""}`}>
          <h3 className={`section-title`}>{titleText}</h3>
          <div className={styles["el-wrapper"]}>
            {list.map((el) => (
              <NeedListEl key={el.id} text={el.text} img={el.img} reverse={reverse} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default NeedList
