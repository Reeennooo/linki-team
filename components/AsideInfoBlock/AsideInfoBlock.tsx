import styles from "./AsideInfoBlock.module.scss"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import IconClose from "public/assets/svg/close.svg"
import { useState } from "react"

interface AsideInfoBlockProps {
  img?: string
  title: string
  txt: string
  href?: string
  btnTxt?: string
  addClass?: string
  onClick?: () => void
  bg?: boolean
}

const AsideInfoBlock: React.FC<AsideInfoBlockProps> = ({ img, title, txt, href, btnTxt, addClass, onClick, bg }) => {
  const [isVisible, setVisibility] = useState<boolean>(true)

  const handleClose = () => {
    setVisibility((prev) => !prev)
  }

  return (
    <div
      className={`aside-info-block ${styles["block"]} ${bg ? styles["block--bg"] : ""} ${addClass ? addClass : ""} ${
        isVisible ? "" : styles["block--hidden"]
      }`}
    >
      <button className={styles.block__close} onClick={handleClose}>
        <IconClose />
      </button>
      {img && (
        <div className={`${styles["block__img"]}`}>
          <img src={img} alt="" />
        </div>
      )}

      <h3 className={`${styles["block__title"]}`}>{title}</h3>
      <p className={`${styles["block__txt"]}`} dangerouslySetInnerHTML={{ __html: txt }} />

      {btnTxt && (
        <div className={styles["block__btn-wrap"]}>
          <DefaultBtn
            txt={btnTxt}
            href={href}
            minWidth={false}
            mod={"transparent-grey"}
            addClass={styles["block__btn"]}
            onClick={() => {
              if (onClick) onClick()
            }}
          />
        </div>
      )}
    </div>
  )
}

export default AsideInfoBlock
