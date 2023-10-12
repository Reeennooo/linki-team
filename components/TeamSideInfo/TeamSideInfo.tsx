import ModalPmTeam from "components/Modals/ModalPmTeam/ModalPmTeam"
import { useAppDispatch, useAppSelector } from "hooks"
import { updateApiParams } from "redux/slices/apiParams"
import { seletCurrentTeam } from "redux/slices/currentTeam"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { BACKEND_HOST, BLUR_IMAGE_DATA_URL } from "utils/constants"
import styles from "./TeamSideInfo.module.scss"
import Image from "next/image"

interface Props {
  addClass?: string
}

const TeamSideInfo: React.FC<Props> = ({ addClass }) => {
  const currentteamState = useAppSelector(seletCurrentTeam)
  const { modalsList } = useAppSelector(selectModals)
  const dispatch = useAppDispatch()

  const openPmModalFn = () => {
    if (!currentteamState.currentTeamId) return
    dispatch(updateApiParams({ field: "currentPmTeamID", data: currentteamState.currentTeamId }))
    dispatch(openModal("modal-pm-team"))
  }

  return (
    <>
      <div className={`${styles["team-side-info"]} ${addClass ? addClass : ""} `}>
        <div className={`${styles["team-side-info__top"]} `}>
          {currentteamState.currentTeamId && (
            <button className={`${styles["team-side-info__open-pm-modal"]}`} onClick={openPmModalFn}>
              <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.690857 0.853022C0.875587 0.647767 1.19173 0.631128 1.39699 0.815857L4.52199 3.62836C4.62734 3.72318 4.6875 3.85826 4.6875 4C4.6875 4.14175 4.62734 4.27683 4.52199 4.37165L1.39699 7.18415C1.19173 7.36888 0.875587 7.35224 0.690857 7.14699C0.506128 6.94173 0.522767 6.62559 0.728022 6.44086L3.44008 4L0.728022 1.55915C0.522767 1.37442 0.506128 1.05828 0.690857 0.853022Z"
                />
              </svg>
            </button>
          )}

          <div className={`${styles["team-side-info__avatar"]} `}>
            {currentteamState.avatar && (
              <Image
                src={currentteamState.avatar}
                alt=""
                // width={38}
                // height={38}
                layout={"fill"}
                quality={75}
                objectFit={"cover"}
                placeholder="blur"
                blurDataURL={BLUR_IMAGE_DATA_URL}
              />
            )}
          </div>
          <div className={`${styles["team-side-info__top-info"]}`}>
            <p className={`${styles["team-side-info__name"]} `}>
              {currentteamState.name ? currentteamState.name : "Team name"}
            </p>
            <p className={`${styles["team-side-info__activity"]} `}>
              {currentteamState.project_categories?.length > 0
                ? currentteamState.project_categories.map((cat, i) => {
                    if (i === 0) {
                      return cat
                    } else {
                      return `, ${cat}`
                    }
                  })
                : "Field of activity"}
            </p>
          </div>
        </div>

        <div className={`${styles["team-side-info__cover"]} `}>
          {!currentteamState.cover && <span className={styles["team-side-info__cover-empty"]}>No cover</span>}
          {/*{currentteamState.cover && <img src={currentteamState.cover} alt="" />}*/}
          {currentteamState.cover && (
            <Image
              src={currentteamState.cover}
              alt=""
              layout={"fill"}
              quality={75}
              objectFit={"cover"}
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_DATA_URL}
            />
          )}
        </div>

        <div className={`${styles["team-side-info__deskr"]} `}>
          {currentteamState.description?.length > 0 && currentteamState.description !== "<p></p>" ? (
            <span dangerouslySetInnerHTML={{ __html: `${currentteamState.description}` }}></span>
          ) : (
            "Tell us about your team - clients trust the completed team profiles more"
          )}
        </div>

        <div className={`${styles["team-side-info__bottom"]} `}>
          <div className={`${styles["team-side-info__bottom-team"]} `}>
            {currentteamState.expertsInTeam?.length > 0 ? (
              <div className={`${styles["team-side-info__team"]}`}>
                {currentteamState.expertsInTeam.map((avatar, i) => {
                  if (i >= 4) return
                  return (
                    <Image
                      key={i}
                      src={avatar ? `${avatar}` : "/assets/icons/user-circle-bg-white.svg"}
                      alt=""
                      width={28}
                      height={28}
                      // layout={"fill"}
                      // quality={75}
                      objectFit={"cover"}
                      objectPosition={"center"}
                      placeholder="blur"
                      blurDataURL={BLUR_IMAGE_DATA_URL}
                    />
                  )
                })}
              </div>
            ) : (
              <div className={styles["team-side-info__empty-team"]}>
                <img src={"/assets/icons/user-circle-bg-white.svg"} alt={"user"} />
              </div>
            )}

            {<span>{currentteamState.expertsInTeam?.length >= 4 ? "4+" : currentteamState.expertsInTeam?.length}</span>}
          </div>
          <div className={`${styles["team-side-info__jobs-count"]} `}>
            <span>Total jobs</span>
            <span className={`${styles["team-side-info__jobs-count-val"]} `}>{currentteamState.totalJobs}</span>
          </div>
        </div>
      </div>
      <ModalPmTeam
        isOpen={modalsList.includes("modal-pm-team")}
        onClose={() => {
          dispatch(closeModal("modal-pm-team"))
        }}
        headerUserClickable={false}
        modalName={"modal-pm-teamr"}
      />
    </>
  )
}

export default TeamSideInfo
