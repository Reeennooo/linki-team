import styles from "./IconLink.module.scss"
import Link from "next/link"

interface Props {
  href?: string
  icon: string
  txt: string
  addClass?: string
  onClick?: () => void
  isActive?: boolean
}

const IconLink: React.FC<Props> = ({ href, icon, txt, onClick, isActive, addClass }) => {
  return (
    <>
      {href ? (
        <>
          {isActive ? (
            <span
              className={`${styles["icon-link"]} ${styles["is-active"]} ${addClass ? addClass : ""} `}
              onClick={onClick}
            >
              <div className={`${styles["icon-link__icon"]}`}>
                <img src={`${icon}`} alt="" />
              </div>
              <span>{txt}</span>
            </span>
          ) : (
            <Link href={href}>
              <a className={`${styles["icon-link"]} ${addClass ? addClass : ""}`} onClick={onClick}>
                <div className={`${styles["icon-link__icon"]}`}>
                  <img src={`${icon}`} alt="" />
                </div>
                <span>{txt}</span>
              </a>
            </Link>
          )}
        </>
      ) : (
        <button onClick={onClick} type={"button"} className={`${styles["icon-link"]} ${addClass ? addClass : ""}`}>
          <div className={`${styles["icon-link__icon"]}`}>
            <img src={`${icon}`} alt="" />
          </div>
          <span>{txt}</span>
        </button>
      )}
    </>
  )
}

export default IconLink
