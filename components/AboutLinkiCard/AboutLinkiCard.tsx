import styles from "./AboutLinkiCard.module.scss"

interface Props {
  addClass?: string
  data: {
    img: string
    label?: string
    title: string
    txt: string
  }
}

const AboutLinkiCard: React.FC<Props> = ({ addClass, data }) => {
  return (
    <div className={`${styles["about-linki-card"]} ${addClass ? addClass : ""}`}>
      <img className={`${styles["about-linki-card__img"]}`} src={`${data.img}`} alt="" />
      {data.label && <span className={`${styles["about-linki-card__label"]}`}>{data.label}</span>}
      <h4 className={`${styles["about-linki-card__title"]}`}>{data.title}</h4>
      <p className={`${styles["about-linki-card__txt"]}`}>{data.txt}</p>
    </div>
  )
}

export default AboutLinkiCard
