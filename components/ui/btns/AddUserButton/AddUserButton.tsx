import styles from "./AddUserButton.module.scss"
import IconLock from "public/assets/svg/Lock.svg"

interface Props {
  addClass?: string
  txt: string
  onClick: () => void
  locked?: boolean
}

const AddUserButton: React.FC<Props> = ({ addClass, onClick, txt, locked }) => {
  return (
    <div className={`${addClass ? addClass : ""}   ${styles.btn}`} onClick={onClick}>
      {locked ? (
        <span className={styles.btn__lock}>
          <IconLock />
        </span>
      ) : (
        <span className={`${styles["btn__plus"]}`}></span>
      )}
      {txt}
    </div>
  )
}

export default AddUserButton
