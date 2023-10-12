import styles from "./CatalogTeamsHero.module.scss"

interface Props {
  title: string
  txt: string
  addClass?: string
}

const CatalogTeamsHero: React.FC<Props> = ({ title, txt, addClass }) => {
  return (
    <div className={`${styles["hero"]} ${addClass ?? ""}`}>
      <h2 className={styles["hero__title"]}>{title}</h2>
      <p className={styles["hero__txt"]} dangerouslySetInnerHTML={{ __html: `${txt}` }}></p>
    </div>
  )
}

export default CatalogTeamsHero
