import styles from "./CatalogTeamsCardSmall.module.scss"
import IconStar from "public/assets/svg/star.svg"
import IconStarEmpty from "public/assets/svg/starEmpty.svg"
import { BACKEND_HOST, BLUR_IMAGE_DATA_URL } from "utils/constants"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { updateApiParams } from "redux/slices/apiParams"
import { useAppDispatch, useAppSelector } from "hooks"
import Image from "next/image"
import { useRouter } from "next/router"
import { ratingConverter } from "../../../utils/ratingConverter"

interface Props {
  avatar: string
  name: string
  rating: number
  projects: number
  addClass?: string
  loading?: boolean
  mainpage?: boolean
  id: number
}

const CatalogTeamsCardSmall: React.FC<Props> = ({
  avatar,
  name,
  rating,
  projects,
  addClass,
  loading,
  id,
  mainpage,
}) => {
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

  const ratingToShow = ratingConverter(rating)
  const isNewBie = ratingToShow === "Newbie"

  const router = useRouter()
  function openPage(mainpage) {
    if (mainpage) {
      router.push("/signup")
    }
  }

  return (
    <div
      className={`${styles["catalogteams-card-small"]} ${addClass ?? ""} ${loading ? styles["is-loading"] : ""}`}
      onClick={() => {
        openPmModalFn(id)
        openPage(mainpage)
      }}
    >
      <div className={`${styles["catalogteams-card-small__avatar"]}`}>
        <Image
          src={avatar.includes("http") ? avatar : avatar.includes("hardcode") ? avatar : BACKEND_HOST + avatar}
          alt=""
          layout="fill"
          quality={50}
          objectFit={"cover"}
          placeholder="blur"
          blurDataURL={BLUR_IMAGE_DATA_URL}
        />
      </div>
      <div className={`${styles["catalogteams-card-small__data"]}`}>
        <p className={`${styles["catalogteams-card-small__name"]}`}>{name}</p>
        <div className={`${styles["catalogteams-card-small__info"]}`}>
          <div
            className={`${styles["catalogteams-card-small__rating"]} ${
              isNewBie ? styles["catalogteams-card-small__rating-empty"] : null
            }`}
          >
            {isNewBie ? <IconStarEmpty /> : <IconStar />}
            <span className={`${styles["catalogteams-card-small__rating-value"]}`}>{ratingToShow}</span>
          </div>
          {projects >= 0 && (
            <>
              <p className={`${styles["catalogteams-card-small__info-separate"]}`}></p>
              <p>{projects} projects</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CatalogTeamsCardSmall
