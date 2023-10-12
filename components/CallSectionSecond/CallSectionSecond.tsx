import React from "react"
import styles from "./CallSectionSecond.module.scss"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import PhoneIcon from "public/assets/svg/phone.svg"
import IconUser from "public/assets/svg/user.svg"

const CallSectionSecond: React.FC = () => {
  return (
    <>
      <div className="container container--small">
        <div className={styles["wrapper"]}>
          <div className={styles["wp"]}>
            <img src="img/decorate/zigzag2.svg" className={styles["zigzag"]} />
            <h2 className={`section-title ${styles["title"]}`}>
              Расскажите нам
              <br />
              про ваши проблемы
              <br />и мы соберем под них удаленную команду
            </h2>
            <div className={styles["avatars"]}>
              <div className={styles["avatar"]}>
                <img src="img/secondHero/avatar5.jpg" />
              </div>
              <div className={styles["avatar"]}></div>
              <div className={styles["avatar"]}>
                <img src="img/secondHero/avatar6.jpg" />
              </div>
              <div className={styles["avatar"]}>
                <img src="img/secondHero/avatar7.jpg" />
              </div>
              <div className={styles["avatar"]}>
                <img src="img/secondHero/avatar4.png" />
              </div>
              <div className={styles["expert"]}>
                <div className={styles["expert__text"]}>Expert</div>
              </div>
              <div className={styles["noavatar"]}>
                <IconUser />
              </div>
              <div className={styles["avatar"]}>
                <img src="img/secondHero/avatar1.jpg" />
              </div>
              <div className={styles["noavatar"]}>
                <IconUser />
              </div>
              <div className={styles["avatar"]}>
                <img src="img/secondHero/avatar8.jpg" />
              </div>
              <div className={styles["avatar"]}>
                <img src="img/secondHero/avatar9.jpg" />
              </div>
              <div className={styles["noavatar"]}>
                <IconUser />
              </div>
            </div>
            <div className={styles["btn-wrapper"]}>
              <DefaultBtn
                addClass={styles["call-btn"]}
                txt="Выбрать время"
                icon={<PhoneIcon className={styles["phone-icon"]} />}
                isTargetBlank={true}
                href={"https://calendly.com/semyon-linki/client-30-min"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CallSectionSecond
