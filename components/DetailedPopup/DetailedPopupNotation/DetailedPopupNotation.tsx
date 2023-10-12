import styles from "./DetailedPopupNotation.module.scss"

interface Props {
  addClass?: string
  title: string
  subtitle: string
}

const DetailedPopupNotation: React.FC<Props> = ({ title, subtitle, addClass }) => {
  return (
    <>
      <div className={`${styles["notation-block"]} ${addClass ? addClass : ""}`}>
        <h4 className={`${styles["notation-block__title"]} `}>{title}</h4>
        <p className={`${styles["notation-block__subtitle"]} `}>{subtitle}</p>
      </div>
    </>
  )
}

export default DetailedPopupNotation
