import IconStar from "public/assets/svg/star.svg"
import IconStarEmpty from "public/assets/svg/starEmpty.svg"
import { BACKEND_HOST, BLUR_IMAGE_DATA_URL } from "utils/constants"
import styles from "./CatalogTeamsCard.module.scss"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { updateApiParams } from "redux/slices/apiParams"
import { useAppDispatch, useAppSelector } from "hooks"
import IconUser from "public/assets/svg/user.svg"
import Image from "next/image"
import { useRouter } from "next/router"
import { ratingConverter } from "../../../utils/ratingConverter"

interface Props {
  cover: string
  avatar: string
  name: string
  directions?: { id: number; name: string }[]
  rating: number
  addClass?: string
  id: number
  mainpage?: boolean
}

const CatalogTeamsCard: React.FC<Props> = ({ cover, avatar, name, directions, rating, id, addClass, mainpage }) => {
  const { modalsList } = useAppSelector(selectModals)
  const dispatch = useAppDispatch()
  const openPmModalFn = (id) => {
    if (!id) return
    if (modalsList.includes("modal-pm-team")) {
      dispatch(closeModal("modal-pm-team"))
    }
    dispatch(updateApiParams({ field: "currentPmTeamID", data: id }))
    dispatch(openModal("modal-pm-team"))
  }

  const router = useRouter()
  function openPage(mainpage) {
    if (mainpage) {
      router.push("/signup")
    }
  }

  const ratingToShow = ratingConverter(rating)
  const isNewBie = ratingToShow === "Newbie"
  const ratingIcon = ratingToShow === "Newbie" ? <IconStarEmpty /> : <IconStar />

  return (
    <div
      className={`${styles["teams-card"]} ${addClass ? addClass : ""}`}
      onClick={() => {
        openPmModalFn(id)
        openPage(mainpage)
      }}
    >
      <div className={styles["teams-card__cover-wp"]}>
        {cover ? (
          <Image
            src={cover.includes("http") ? cover : cover.includes("hardcode") ? cover : BACKEND_HOST + cover}
            alt=""
            layout={"fill"}
            quality={75}
            objectFit={"cover"}
            placeholder="blur"
            blurDataURL={BLUR_IMAGE_DATA_URL}
            className={`${styles["teams-card__cover"]}`}
          />
        ) : (
          <span>No cover</span>
        )}
      </div>
      <div className={`${styles["teams-card__data"]} ${mainpage ? styles["mainpage"] : ""}`}>
        <div className={`${styles["teams-card__avatar"]}`}>
          {avatar ? (
            <Image
              src={avatar.includes("http") ? avatar : avatar.includes("hardcode") ? avatar : BACKEND_HOST + avatar}
              alt=""
              width={"42px"}
              height={"42px"}
              objectFit={"cover"}
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_DATA_URL}
            />
          ) : (
            <span className={styles["teams-card__avatar_default"]}>
              <IconUser />
            </span>
          )}
        </div>
        <div className={`${styles["teams-card__info"]}`}>
          <p className={`${styles["teams-card__name"]}`}>{name}</p>
          <div className={`${styles["teams-card__directions"]}`}>
            {directions.length > 0 &&
              directions.map((dir, i) => {
                if (i === 0) {
                  return <span key={dir.id}>{dir.name}</span>
                } else {
                  return <span key={dir.id}>{`, ${dir.name}`}</span>
                }
              })}
          </div>
        </div>
        <div className={`${styles["teams-card__rating"]} ${isNewBie ? styles["teams-card__rating-empty"] : null}`}>
          {ratingIcon}
          <span>{ratingToShow}</span>
        </div>
      </div>
    </div>
  )
}

export default CatalogTeamsCard
