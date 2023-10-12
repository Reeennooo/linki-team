import styles from "./PersonRatingCard.module.scss"
import IconUser from "public/assets/svg/user.svg"
import Rating from "components/ui/Rating/Rating"
import React, { useState } from "react"
import { BACKEND_HOST, BLUR_IMAGE_DATA_URL } from "utils/constants"
import Image from "next/image"

interface IPersonRatingCardProps {
  avatar?: string
  name: string
  surname?: string
  position?: string
  onChange?: (value: number) => void
  className?: string
}

const PersonRatingCard: React.FC<IPersonRatingCardProps> = ({
  avatar,
  name,
  position,
  surname,
  onChange,
  className,
}) => {
  const [personRating, setPersonRating] = useState<number>(0)

  return (
    <div className={`person-rating-card ${styles.card} ${className ? className : ""}`}>
      {avatar ? (
        <div className={styles.card__avatar}>
          <Image
            src={avatar.includes("http") ? avatar : avatar.includes("uploads") ? BACKEND_HOST + avatar : ""}
            alt={"person"}
            layout={"fill"}
            quality={75}
            objectFit={"cover"}
            objectPosition={"center"}
            placeholder="blur"
            blurDataURL={BLUR_IMAGE_DATA_URL}
          />
        </div>
      ) : (
        <div className={styles["card__empty-avatar"]}>
          <IconUser />
        </div>
      )}
      <div className={styles.card__main}>
        <h3 className={styles.card__name}>
          {name} {surname && surname}
        </h3>
        {position && <p className={styles.card__position}>{position}</p>}
      </div>
      <Rating
        rating={personRating}
        mod={"lg"}
        onChange={(value) => {
          setPersonRating(value)
          if (onChange) onChange(value)
        }}
        isEvaluationMode={true}
      />
    </div>
  )
}

export default PersonRatingCard
