import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import styles from "./OnboardingStart.module.scss"
import Triangle1 from "public/assets/svg/onboarding/triangle1.svg"
import Triangle2 from "public/assets/svg/onboarding/triangle2.svg"
import Triangle3 from "public/assets/svg/onboarding/triangle3.svg"
import Triangle4 from "public/assets/svg/onboarding/triangle4.svg"
import Triangle5 from "public/assets/svg/onboarding/triangle5.svg"
import Star from "public/assets/svg/onboarding/star.svg"

interface Props {
  addClass?: string
  title: string
  txt: string
  numberOfbtns: 1 | 2
  isActive: boolean
  onStart: () => void
  onSkip?: () => void
}

const OnboardingStart: React.FC<Props> = ({ title, txt, addClass, numberOfbtns = 1, isActive, onStart, onSkip }) => {
  return (
    <div
      className={`${addClass ? addClass : addClass} ${isActive ? styles["is-active"] : ""} ${
        styles["onboarding-start"]
      }`}
    >
      <div className={`${styles["onboarding-start__content"]}`}>
        <div className={`${styles["onboarding-start__decor"]} ${styles["onboarding-start__decor--1"]}`}>
          <Triangle1 />
        </div>
        <div className={`${styles["onboarding-start__decor"]} ${styles["onboarding-start__decor--2"]}`}>
          <Triangle2 />
        </div>
        <div className={`${styles["onboarding-start__decor"]} ${styles["onboarding-start__decor--3"]}`}>
          <Star />
        </div>
        <div className={`${styles["onboarding-start__decor"]} ${styles["onboarding-start__decor--4"]}`}>
          <Triangle1 />
        </div>
        <div className={`${styles["onboarding-start__decor"]} ${styles["onboarding-start__decor--5"]}`}>
          <Star />
        </div>
        <div className={`${styles["onboarding-start__decor"]} ${styles["onboarding-start__decor--6"]}`}>
          <Triangle3 />
        </div>
        <div className={`${styles["onboarding-start__decor"]} ${styles["onboarding-start__decor--7"]}`}>
          <Triangle4 />
        </div>
        <div className={`${styles["onboarding-start__decor"]} ${styles["onboarding-start__decor--8"]}`}>
          <Triangle5 />
        </div>
        <div className={`${styles["onboarding-start__decor"]} ${styles["onboarding-start__decor--9"]}`}>
          <Star />
        </div>
        {title && <h4 className={`${styles["onboarding-start__title"]}`}>{title}</h4>}
        {txt && <p className={`${styles["onboarding-start__txt"]}`}>{txt}</p>}

        {numberOfbtns === 1 ? (
          <DefaultBtn txt={"Start"} onClick={onStart} addClass={`${styles["onboarding-start__btn-long"]} `} />
        ) : (
          <div className={`${styles["onboarding-start__btns"]}`}>
            <DefaultBtn
              addClass="default-btn default-btn--transparent-grey-grey"
              mod={"transparent-grey-grey"}
              txt={"Skip intro"}
              onClick={onSkip}
            />
            <DefaultBtn txt={"Next"} onClick={onStart} />
          </div>
        )}
      </div>
    </div>
  )
}

export default OnboardingStart
