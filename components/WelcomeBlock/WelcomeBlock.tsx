import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import styles from "./WelcomeBlock.module.scss"
import Link from "next/link"
import { useAuth } from "hooks/useAuth"
import { calculatePercentagesFunction } from "utils/profileFillingCalculation"
import { useMemo, useState } from "react"
import { USER_TYPE_CUSTOMER, USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"
import IconClose from "public/assets/svg/close.svg"

interface Props {
  props?: any
  addClass?: string
}

const WelcomeBlock: React.FC<Props> = ({ addClass, ...props }) => {
  const { user } = useAuth()

  const [isVisible, setVisible] = useState<boolean>(true)

  const calculatePercentages: number = useMemo(() => {
    return calculatePercentagesFunction(user)
  }, [user])

  const selectTitle = () => {
    switch (user.type) {
      case USER_TYPE_CUSTOMER:
        return <h3 className={`${styles["welcome-block__title"]}`}>Welcome {user.name}!</h3>
      case USER_TYPE_EXPERT:
        if (calculatePercentages < 100) {
          return <h3 className={`${styles["welcome-block__title"]}`}>Want to be involved in amazing projects?</h3>
        } else {
          return <h3 className={`${styles["welcome-block__title"]}`}>Want to get more bonuses?</h3>
        }
      case USER_TYPE_PM:
        if (calculatePercentages < 100) {
          return <h3 className={`${styles["welcome-block__title"]}`}>Want to be involved in amazing projects?</h3>
        } else {
          return <h3 className={`${styles["welcome-block__title"]}`}>Want to get more bonuses?</h3>
        }
      default:
        return <p>Welcome</p>
    }
  }

  const selectTxt = () => {
    switch (user.type) {
      case USER_TYPE_CUSTOMER:
        return (
          <p className={`${styles["welcome-block__txt"]}`}>
            Congratulations on joining linki! We are here to help you complete your project. You can publish a project
            or contact your personal manager.
          </p>
        )
      case USER_TYPE_EXPERT:
      case USER_TYPE_PM:
        if (calculatePercentages < 100) {
          return (
            <p className={`${styles["welcome-block__txt"]}`}>
              Your profile is off to a good start. Take a moment to complete all the steps to participate in amazing
              projects!
            </p>
          )
        } else {
          return (
            <p className={`${styles["welcome-block__txt"]}`}>
              Take part in our referral program: invite experts to the platform or recommend your experts for projects
              and get extra bonuses!
            </p>
          )
        }

      default:
        return <p>Congratulations on joining linki!</p>
    }
  }

  const selectBtns = () => {
    switch (user.type) {
      case USER_TYPE_CUSTOMER:
        return (
          <div className={`${styles["welcome-block__btns"]}`}>
            <Link href="/projects/create" passHref>
              <a className="btn default-btn">Create a project</a>
            </Link>
            <DefaultBtn
              txt={"Сontact the manager"}
              mod={"transparent-grey"}
              addClass={`${styles["welcome-block__contact-manager"]}`}
            />
          </div>
        )
      case USER_TYPE_EXPERT:
        return (
          <div className={`${styles["welcome-block__btns"]}`}>
            {calculatePercentages < 100 ? (
              <Link href="/settings/profile" passHref>
                <a
                  className={`btn default-btn default-btn--transparent-grey-blue ${styles["welcome-block__contact-manager"]}`}
                >
                  Complete your profile
                </a>
              </Link>
            ) : (
              <Link href="/referrals" passHref>
                <a
                  className={`btn default-btn default-btn--transparent-grey-blue ${styles["welcome-block__contact-manager"]}`}
                >
                  Send an invitation
                </a>
              </Link>
            )}
          </div>
        )
      case USER_TYPE_PM:
        return (
          <div className={`${styles["welcome-block__btns"]}`}>
            {calculatePercentages < 100 ? (
              <Link href="/settings/profile" passHref>
                <a
                  className={`btn default-btn default-btn--transparent-grey-blue ${styles["welcome-block__contact-manager"]}`}
                >
                  Complete your profile
                </a>
              </Link>
            ) : (
              <Link href="/referrals" passHref>
                <a
                  className={`btn default-btn default-btn--transparent-grey-blue ${styles["welcome-block__contact-manager"]}`}
                >
                  Send an invitation
                </a>
              </Link>
            )}
          </div>
        )
      default:
        null
    }
  }

  const selectImg = () => {
    switch (user.type) {
      case USER_TYPE_CUSTOMER:
        return <img src="/img/WelcomeBlock/x2WelcomeBlock.png" alt="" />
      case USER_TYPE_EXPERT:
        if (calculatePercentages < 100) {
          return <img src="/img/WelcomeBlock/x2WelcomeBlock3.png" alt="" />
        } else {
          return <img src="/img/WelcomeBlock/x2WelcomeBlock4.png" alt="" />
        }
      case USER_TYPE_PM:
        if (calculatePercentages < 100) {
          return <img src="/img/WelcomeBlock/WelcomeBlock3.png" alt="" />
        } else {
          return <img src="/img/WelcomeBlock/x2WelcomeBlock4.png" alt="" />
        }
    }
  }

  const handleClose = () => {
    setVisible(false)
  }

  return (
    isVisible && (
      <div className={`${styles["welcome-block"]} ${addClass ? addClass : ""}`} {...props}>
        <button type={"button"} className={styles["welcome-block__close"]} onClick={handleClose}>
          <IconClose />
        </button>
        <div className={`${styles["welcome-block__left"]}`}>
          {selectTitle()}
          {selectTxt()}
          {selectBtns()}
        </div>
        <div
          className={`${styles["welcome-block__img"]} ${
            calculatePercentages < 100 && (user?.type === USER_TYPE_EXPERT || user?.type === USER_TYPE_PM)
              ? ""
              : styles["welcome-block__img--complete"]
          }`}
        >
          {selectImg()}
        </div>
      </div>
    )
  )
}

export default WelcomeBlock
