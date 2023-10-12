import styles from "./DetailedPopupLangTime.module.scss"

interface Props {
  language?: []
  timezone?: string
  addClass?: string
}

const DetailedPopupLangTime: React.FC<Props> = ({ language, timezone, addClass }) => {
  return (
    <>
      <div className={`${styles["lang-time"]} ${addClass ? addClass : ""}`}>
        {language?.length ? (
          <div className={`${styles["lang-time__item"]}`}>
            <h3 className={styles["lang-time__title"]}>Language</h3>
            {language.map((i, index) => {
              return (
                <p key={index} className={styles["lang-time__txt"]}>
                  {i}
                  {index + 1 < language.length ? ", " : ""}
                </p>
              )
            })}
          </div>
        ) : (
          ""
        )}
        {timezone ? (
          <div className={styles["lang-time__item"]}>
            <h3 className={styles["lang-time__title"]}>Timezone</h3>
            <p className={styles["lang-time__txt"]}>{timezone}</p>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  )
}

export default DetailedPopupLangTime
