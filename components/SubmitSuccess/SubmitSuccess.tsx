import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import styles from "./SubmitSuccess.module.scss"
import CheckIcon from "public/assets/svg/сheck.svg"
interface Props {
  addClass?: string
}

const SubmitSuccess: React.FC<Props> = ({ addClass }) => {
  return (
    <>
      <div className={`${styles["submit-success"]} ${addClass ? addClass : ""}`}>
        <div className={`${styles["submit-success__img"]}`}>
          <img src="/img/submit-success/x2submit-success-min.png" alt="" />
        </div>
        <div className={`${styles["submit-success__title"]}`}>
          <span>
            <CheckIcon />
          </span>
          Project submitted for review
        </div>
        <p className={`${styles["submit-success__txt"]}`}>If you have any questions, please contact the manager.</p>
        <div className={`${styles["submit-success__btn"]}`}>
          <DefaultBtn href={"/projects"} txt={"My projects"} />
        </div>
      </div>
    </>
  )
}

export default SubmitSuccess
