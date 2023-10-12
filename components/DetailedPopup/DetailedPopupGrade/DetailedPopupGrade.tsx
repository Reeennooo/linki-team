import styles from "./DetailedPopupGrade.module.scss"
import { Dispatch, SetStateAction, useState } from "react"
import Rating from "components/ui/Rating/Rating"

interface Props {
  pmData: {
    name: string
    position: string
    img: string
  }
  // rating: number
  // gradeFn: Dispatch<SetStateAction<number>>
  addClass?: string
}

const DetailedPopupGrade: React.FC<Props> = ({ pmData, addClass }) => {
  const [rating, setRating] = useState(0)
  return (
    <>
      <div className={` ${addClass ? addClass : ""}`}>
        <div className={`${styles["grade-pm__img"]} `}>
          <img src="/assets/send2-min.png" alt="" />
        </div>
        {/* <p className={`${styles["grade-pm__txt"]} `}>
          Thank you for the way you have traveled and ask you to evaluate the work with your project manager, after
          which the project will be completed
        </p> */}
        <p className={`${styles["grade-pm__txt"]} `}>
          We thank you for the journey and ask you to evaluate the work with your project manager, after which the
          project will be completed.
        </p>
        <div className={`${styles["grade-block"]}`}>
          <div className={`${styles["grade-block__pm"]}`}>
            <div className={`${styles["grade-block__pm-avatar"]}`}>
              <img src={`${pmData.img}`} alt="" />
            </div>
            <div>
              <p className={`${styles["grade-block__pm-name"]}`}>{pmData.name}</p>
              <p className={`${styles["grade-block__pm-position"]}`}>{pmData.position}</p>
            </div>
          </div>
          <Rating mod={"lg"} rating={rating} />
        </div>
      </div>
    </>
  )
}

export default DetailedPopupGrade
