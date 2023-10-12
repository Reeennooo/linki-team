import styles from "./CookiesModal.module.scss"
import Link from "next/link"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import { useState } from "react"

interface ICookiesModalProps {
  props?: any
}

const CookiesModal: React.FC<ICookiesModalProps> = ({ props }) => {
  const [isVisible, setVisible] = useState<boolean>(true)

  const handleAgree = () => {
    document.cookie = `AGREE_POLICY2=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; sameSite=lax; path=/`
    setVisible(false)
  }

  const handleCancel = () => {
    setVisible((prev) => !prev)
  }

  return (
    isVisible && (
      <div className={styles.cookiesModal}>
        <h3 className={styles.cookiesModal__title}>Our website uses cookies</h3>
        <p className={styles.cookiesModal__txt}>
          We use cookies to ensure that we give you the best experience on our website. If you continue to use this site
          we will assume that you are happy with it.{" "}
          <Link href={"https://www.craft.do/s/vgyz5JXmLj77Ky"}>
            <a target={"_blank"}>Privacy policy</a>
          </Link>
        </p>
        <div className={styles.cookiesModal__footer}>
          <DefaultBtn txt={"Agree"} minWidth={false} onClick={handleAgree} />
          <DefaultBtn txt={"Dismiss"} minWidth={false} mod={"transparent"} onClick={handleCancel} />
        </div>
        <img className={styles.cookiesModal__decor} src={"/assets/cookies.svg"} alt={"cookies"} />
      </div>
    )
  )
}

export default CookiesModal
