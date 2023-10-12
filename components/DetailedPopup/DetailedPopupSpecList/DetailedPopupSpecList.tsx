import { OfferMember } from "types/project"
import styles from "./DetailedPopupSpecList.module.scss"

interface Props {
  specList: OfferMember[] | string[]
  addClass?: string
}

const DetailedPopupSpecList: React.FC<Props> = ({ specList, addClass }) => {
  return (
    <>
      <div className={`${styles["spec-list"]} ${addClass ? addClass : ""}`}>
        <div className={`${styles["spec-list__content"]}`}>
          <div>
            <h3 className={`${styles["spec-list__title"]}`}>Specialists in the project</h3>
            {specList?.length && (
              <ul className={`${styles["spec-list__list"]}`}>
                {typeof specList[0] === "string" ? (
                  <>
                    {specList.map((li, i) => {
                      return (
                        <li key={i} className={`${styles["spec-list__list-item"]}`}>
                          {li}
                        </li>
                      )
                    })}
                  </>
                ) : (
                  <>
                    {specList.map((li) => {
                      return (
                        <li key={li.id} className={`${styles["spec-list__list-item"]}`}>
                          {li.job_role}
                        </li>
                      )
                    })}
                  </>
                )}
              </ul>
            )}
          </div>
          <div className={`${styles["spec-list__img"]}`}>
            <img src="/img/DetailedPopupSpecList/x2DetailedPopupSpecList-min.png" alt="" />
          </div>
        </div>
      </div>
    </>
  )
}

export default DetailedPopupSpecList
