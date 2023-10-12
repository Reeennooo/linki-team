import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import styles from "./RateService.module.scss"
import Rating from "components/ui/Rating/Rating"
import { useState } from "react"
import { addPopupNotification } from "utils/addPopupNotification"

interface Props {
  addClass?: string
}

const RateService: React.FC<Props> = ({ addClass }) => {
  const [rating, setRating] = useState(0)
  return (
    <>
      <div className={`${styles["rate-service"]} ${addClass ? addClass : ""}`}>
        <h4 className={`${styles["rate-service__title"]}`}>Help us get better</h4>
        <p className={`${styles["rate-service__txt"]}`}>Please rate how easy it was for you to complete the project</p>
        <div className={`${styles["rate-service__stars"]}`}>
          <Rating rating={rating} mod={"lg"} onChange={(value) => setRating(value)} />
        </div>
        <div className={`${styles["rate-service__btn"]}`}>
          <DefaultBtn
            mod="transparent-grey"
            txt={"Rate the service"}
            disabled={rating === 0}
            onClick={() => {
              addPopupNotification({
                title: "Feedback accepted",
                txt: `Thank you for appreciating our work`,
              })
            }}
          />
        </div>
      </div>
    </>
  )
}

export default RateService
