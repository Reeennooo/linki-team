import styles from "./ProfilePremium.module.scss"
import IconCrown2 from "public/assets/svg/crown-icon-2.svg"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"

interface Props {
  mod?: string
  addClass?: string
}

const ProfilePremium: React.FC<Props> = ({ addClass, mod, ...props }) => {
  return (
    <>
      <div
        className={`
        ${styles["profile-premium"]} 
        ${mod ? styles["profile-premium--" + mod] : ""} 
        ${addClass ? addClass : ""}`}
        {...props}
      >
        <div className={`${styles["profile-premium__info"]}`}>
          <p className={`${styles["profile-premium__title"]}`}>Premium status</p>
          <span className={`${styles["profile-premium__icon"]}`}>
            <IconCrown2 />
          </span>
        </div>
        <div>
          <DefaultBtn href="/pricing" addClass={`${styles["profile-premium__button"]}`} txt={"Сhange Subscription"} />
        </div>
      </div>
    </>
  )
}

export default ProfilePremium
