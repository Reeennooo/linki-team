import styles from "./ToggleBtn.module.scss"

interface Props {
  txt: string
  isActive: boolean
  onClick(): void
  addClass?: string
  img?: string
}

const ToggleBtn: React.FC<Props> = ({ txt, onClick, isActive, addClass, img }) => {
  return (
    <button
      className={`toggle-btn ${styles.btn} ${isActive ? styles["btn--active"] : ""} ${addClass ? addClass : ""}`}
      onClick={onClick}
    >
      {txt}{" "}
      {img ? (
        <img src={img} alt={"arrow"} />
      ) : (
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.396447 0.146447C0.591709 -0.0488155 0.908291 -0.0488155 1.10355 0.146447L7 6.04289L12.8964 0.146447C13.0917 -0.0488155 13.4083 -0.0488155 13.6036 0.146447C13.7988 0.341709 13.7988 0.658291 13.6036 0.853553L7.35355 7.10355C7.15829 7.29882 6.84171 7.29882 6.64645 7.10355L0.396447 0.853553C0.201184 0.658291 0.201184 0.341709 0.396447 0.146447Z"
          />
        </svg>
      )}
    </button>
  )
}

export default ToggleBtn
