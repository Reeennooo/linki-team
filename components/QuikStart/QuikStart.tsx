import UserDataForm from "components/UserDataForm/UserDataForm"
import styles from "./QuikStart.module.scss"
import IconLinki from "public/assets/svg/linki-logo.svg"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"

interface Props {
  newmain?: boolean
  withoutForm?: boolean
  sectionData?: {
    title?: any
    subtitle?: string
    class?: string
    searchText?: string
  }
}

const QuikStart: React.FC<Props> = ({ newmain, sectionData, withoutForm }) => {
  let title, subtitle
  if (sectionData) ({ title = null, subtitle = null } = sectionData)

  return (
    <section
      className={`
      ${styles["quikstart"]} 
      ${newmain ? styles["quikstart_new"] : ""}
      ${sectionData ? styles[`quikstart_${sectionData.class}`] : ""}
      ${withoutForm ? styles["quikstart_without"] : ""}
      `}
    >
      {newmain ? "" : <div className={styles["quikstart__circle1"]} />}
      {newmain ? "" : <div className={styles["quikstart__circle2"]} />}
      {newmain ? "" : <div className={`${styles["quikstart__circle3"]}`} />}
      <div className="container container--large">
        {newmain ? (
          <div className={styles["quikstart__wrapper"]}>
            <div className={`${styles["quikstart__text"]}`}>
              {newmain && <div className={styles["quikstart__circle"]} />}
              {/* - - - Вставка нового текста */}
              {title ? (
                <h1
                  className={`${styles["quikstart__title"]} ${styles["quikstart__title_new"]}`}
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              ) : (
                <h1 className={`${styles["quikstart__title"]} ${styles["quikstart__title_new"]}`}>
                  <span>Marketplace</span>
                  <br className={styles["quikstart__mobile-br"]} /> of
                  <br className={styles["quikstart__desktop-br"]} /> remote teams
                  <br /> and experts
                </h1>
              )}

              {subtitle ? (
                <p
                  className={`${styles["quikstart__subtitle"]} ${styles["quikstart__subtitle_new"]}`}
                  dangerouslySetInnerHTML={{ __html: subtitle }}
                />
              ) : (
                <p className={`${styles["quikstart__subtitle"]} ${styles["quikstart__subtitle_new"]}`}>
                  Simplify your workflow with a platform that
                  <br /> connects clients with contractors who can
                  <br /> help your company grow rapidly
                </p>
              )}
              {withoutForm && (
                <div className={styles["quikstart__btn-wp"]}>
                  <DefaultBtn href="/signup" txt={"Sign Up"} addClass={styles["quikstart__button"]} />
                </div>
              )}
            </div>
            {!withoutForm && (
              <UserDataForm newmain={newmain} searchTitle={sectionData ? sectionData.searchText : null} />
            )}
          </div>
        ) : (
          <div className={styles["quikstart__wrapper"]}>
            <div className={styles["quikstart__text"]}>
              <IconLinki className={styles["quikstart__linki"]} />
              <h1 className={styles["quikstart__title"]}>
                Marketplace
                <br /> of remote teams and experts
              </h1>
              <p className={styles["quikstart__subtitle"]}>
                Simplify your workflow with a platform that
                <br />
                connects clients with contractors who can
                <br />
                help your company grow rapidly
              </p>
            </div>
            <UserDataForm />
          </div>
        )}
      </div>
    </section>
  )
}

export default QuikStart
