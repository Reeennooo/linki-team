import styles from "./IdeaCard.module.scss"

interface Props {
  txt: string
  img: string
  addClass: string
}

const IdeaCard: React.FC<Props> = ({ img, txt, addClass }) => {
  return (
    <>
      <div className={`${styles["idea-card"]} ${addClass}`}>
        <div className={`${styles["idea-card__img"]} `}>
          <img src={`${img}`} />
        </div>
        <p className={`${styles["idea-card__txt"]} `}>{txt}</p>
      </div>
    </>
  )
}

export default IdeaCard
