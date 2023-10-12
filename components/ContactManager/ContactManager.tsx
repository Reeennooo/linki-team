import styles from "./ContactManager.module.scss"
import IconClose from "public/assets/svg/close.svg"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"

interface Props {
  title: string
  txt: string
  addClass?: string
  setShowContManager?: any
}

const ContactManager: React.FC<Props> = ({ title, txt, setShowContManager, addClass }) => {
  const closeHandler = () => {
    if (setShowContManager) setShowContManager(false)
  }
  return (
    <>
      <div className={`${styles["contact-manager"]} ${addClass ? addClass : ""} contact-manager`}>
        <div className={`${styles["contact-manager__close"]}`} onClick={closeHandler}>
          <IconClose />
        </div>
        <h4 className={`${styles["contact-manager__title"]}`}>{title}</h4>
        <p className={`${styles["contact-manager__txt"]}`}>{txt}</p>
        <DefaultBtn txt={"Contact the manager"} />
      </div>
    </>
  )
}

export default ContactManager
