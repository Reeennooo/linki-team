import styles from "./SocBtn.module.scss"

interface Props {
  icon: string
  txt?: string
  link: string
  addClass?: string
  disabled?: boolean
  onClick?: (e) => void
}

const SocBtn: React.FC<Props> = ({ icon, txt, link, disabled, addClass, onClick }) => {
  return (
    <>
      <a
        className={[styles["soc-btn"], addClass && addClass, disabled && styles["is-disabled"]]
          .filter(Boolean)
          .join(" ")}
        href={link}
        onClick={onClick}
      >
        <img src={icon} alt="" />
        {txt && <span>{txt}</span>}
      </a>
    </>
  )
}

export default SocBtn
