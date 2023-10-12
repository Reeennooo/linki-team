import styles from "./DetailedPopupImg.module.scss"

interface Props {
  data: {
    img: string
    date: string
  }
  addClass?: string
}

const DetailedPopupImg: React.FC<Props> = ({ data, addClass }) => {
  return (
    <>
      <div className={`${styles["prj-img"]} ${addClass ? addClass : ""}`}>
        <img className={`${styles["prj-img__img"]}`} src={`${data.img}`} alt="" />
        <p className={`${styles["prj-img__label"]}`}>
          Create: <span>{data.date}</span>
        </p>
      </div>
    </>
  )
}

export default DetailedPopupImg
