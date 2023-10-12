import React from "react"
import styles from "./CallSection.module.scss"
import InfinityIcon from "public/assets/svg/infinity.svg"
import PlusIcon from "public/assets/svg/plus.svg"
import PhoneIcon from "public/assets/svg/phone.svg"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"

const CallSection: React.FC = () => {
  return (
    <>
      <div className={`${styles["wp"]} container container--small`}>
        <div className={styles["wrapper"]}>
          <InfinityIcon className={styles["infinity-icon"]} />
          <h1 className={`${styles["title"]} section-title`}>Расскажите нам про ваши задачи</h1>
          <div className={styles["btn-container"]}>
            <DefaultBtn
              addClass={styles["call-btn"]}
              txt="Выбрать время"
              icon={<PhoneIcon className={styles["phone-icon"]} />}
              isTargetBlank={true}
              href={"https://calendly.com/semyon-linki/client-30-min"}
            />
          </div>
          <div className={`${styles["decorate"]} ${styles["decorate1"]}`}>
            <div className={styles["plus"]}>
              <PlusIcon />
            </div>
            <p>Ваш проект</p>
          </div>
          <div className={`${styles["decorate"]} ${styles["decorate2"]}`}>
            <p>Ниша бизнеса</p>
          </div>
          <div className={`${styles["decorate"]} ${styles["decorate3"]}`}>
            <p>Количество экспертов</p>
          </div>
          <div className={`${styles["decorate"]} ${styles["decorate4"]}`}>
            <p>Бюджет</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CallSection
