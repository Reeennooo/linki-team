import styles from "./Share.module.scss"
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share"

type ShareNames = "facebook" | "twitter" | "linkedIn" | "whatsapp" | "telegram"

interface ShareProps {
  link: string
  list: ShareNames[]
  title?: string
}

const Share: React.FC<ShareProps> = ({ link, list, title }) => {
  const socialLinks = list.map((soc, index) => {
    let socialItem = null
    switch (soc) {
      case "facebook":
        socialItem = (
          <FacebookShareButton url={link} className={styles.soc__btn}>
            <img src={`/assets/soc/${soc}.svg`} alt={soc} />
          </FacebookShareButton>
        )
        break
      case "twitter":
        socialItem = (
          <TwitterShareButton url={link} title={title ? title : undefined} className={styles.soc__btn}>
            <img src={`/assets/soc/${soc}.svg`} alt={soc} />
          </TwitterShareButton>
        )
        break
      case "linkedIn":
        socialItem = (
          <LinkedinShareButton url={link} title={title ? title : undefined} className={styles.soc__btn}>
            <img src={`/assets/soc/${soc}.svg`} alt={soc} />
          </LinkedinShareButton>
        )
        break
      case "whatsapp":
        socialItem = (
          <WhatsappShareButton url={link} title={title ? title : undefined} className={styles.soc__btn}>
            <img src={`/assets/soc/${soc}.svg`} alt={soc} />
          </WhatsappShareButton>
        )
        break
      case "telegram":
        socialItem = (
          <TelegramShareButton url={link} title={title ? title : undefined} className={styles.soc__btn}>
            <img src={`/assets/soc/${soc}.svg`} alt={soc} />
          </TelegramShareButton>
        )
        break
    }
    return (
      <li key={index} className={styles.soc__item}>
        {socialItem}
      </li>
    )
  })

  return <ul className={`social-share ${styles.soc}`}>{socialLinks}</ul>
}

export default Share
