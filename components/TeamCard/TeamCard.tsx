import { IPmTeamsListItem } from "types/pmteam"
import styles from "./TeamCard.module.scss"
import IconUser from "public/assets/svg/user.svg"
import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import { useExpertAcceptInviteToTeamMutation, useExpertRejectInviteToTeamMutation } from "redux/api/pmteam"
import { useAppDispatch } from "hooks"
import { updateApiParams } from "redux/slices/apiParams"
import { BACKEND_HOST, BLUR_IMAGE_DATA_URL } from "utils/constants"
import Image from "next/image"

interface Props {
  data: IPmTeamsListItem
  pmAvatar?: string
  addClass?: string
  onClick?: () => void
  openExclusive?: () => void
  type: "chat" | "exclusive" | "exclusive-invite" | "invite" | "none"
}

const TeamCard: React.FC<Props> = ({ data, addClass, onClick, openExclusive, type, pmAvatar }) => {
  const [acceptInviteToTeam] = useExpertAcceptInviteToTeamMutation()
  const [rejjectInviteToTeam] = useExpertRejectInviteToTeamMutation()
  const dispatch = useAppDispatch()
  const acceptTeamInvite = (e) => {
    e.stopPropagation()
    if (data.id) {
      try {
        acceptInviteToTeam({ teamId: data.id })
          .unwrap()
          .then((res) => {
            dispatch(updateApiParams({ field: "updateUserInfo", data: true }))
          })
      } catch (e) {
        dispatch(updateApiParams({ field: "updateUserInfo", data: false }))
      }
    }
  }
  const rejecttTeamInvite = (e) => {
    e.stopPropagation()
    if (data.id) {
      try {
        rejjectInviteToTeam({ teamId: data.id })
          .unwrap()
          .then((res) => {
            dispatch(updateApiParams({ field: "updateUserInfo", data: true }))
          })
      } catch (e) {
        dispatch(updateApiParams({ field: "updateUserInfo", data: false }))
      }
    }
  }

  const openExclusiveModal = (e) => {
    e.stopPropagation()
    if (openExclusive) openExclusive()
  }

  return (
    <div
      className={`
    ${styles["team-card"]} 
    ${addClass ? addClass : ""}
    ${type === "invite" || type === "exclusive-invite" ? styles["team-card_invite"] : ""}
    `}
      onClick={onClick}
    >
      <div className={styles["team-card__wrapper"]}>
        <div className={`${styles["team-card__avatar"]} ${type === "invite" ? styles["invite"] : ""} `}>
          {type === "invite" ? (
            <>
              {data.avatar ? (
                <img src={data.avatar} alt="" />
              ) : (
                <span className={styles["team-card__avatar--empty"]}>
                  <IconUser />
                </span>
              )}
              {pmAvatar ? (
                <img className={styles["pmavatar"]} src={pmAvatar} alt="" />
              ) : (
                <span className={`${styles["team-card__avatar--empty"]} ${styles["team-card__avatar--pmempty"]}`}>
                  <IconUser />
                </span>
              )}
            </>
          ) : data.avatar ? (
            <Image
              src={data.avatar}
              alt="avatar"
              // width={"46px"}
              // height={"46px"}
              layout={"fill"}
              quality={75}
              objectFit={"cover"}
              objectPosition={"center"}
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_DATA_URL}
            />
          ) : (
            <span className={styles["team-card__avatar--empty"]}>
              <IconUser />
            </span>
          )}
        </div>
        {type === "invite" && (
          <p className={`${styles["team-card__info-exclusive"]}`}>
            <b>
              {data.manager?.name && data.manager.name} {data.manager?.surname && data.manager.surname}{" "}
            </b>{" "}
            invited you to join the team{" "}
            <span className={`${styles["team-card__info-team-name"]}`}>&quot;{data.name}&quot;</span>
          </p>
        )}
        {type === "exclusive-invite" && (
          <div className={`${styles["team-card__info"]}`}>
            <p className={`${styles["team-card__info-exclusive"]}`}>
              <b>{data.name}</b> invites you to create a connection with the team
            </p>
          </div>
        )}
      </div>
      {type === "exclusive" && (
        <div className={`${styles["team-card__info"]}`}>
          <p className={`${styles["team-card__info-exclusive"]}`}>
            <b>{data.name}</b> invites you to create a connection with the team
          </p>
        </div>
      )}
      {type === "none" && (
        <div className={`${styles["team-card__info"]}`}>
          <p className={`${styles["team-card__name"]}`}>{data.name}</p>
          {data.project_categories?.length > 0 && (
            <p className={`${styles["team-card__directions"]}`}>
              {data.project_categories.map((dir, i) => {
                if (i === 0) {
                  return <span key={i}>{dir.name}</span>
                } else {
                  return <span key={i}>, {dir.name}</span>
                }
              })}
            </p>
          )}
        </div>
      )}

      {type === "chat" && (
        <>
          <div className={`${styles["team-card__info"]}`}>
            <p className={`${styles["team-card__name"]}`}>{data.name}</p>
            {data.project_categories?.length > 0 && (
              <p className={`${styles["team-card__directions"]}`}>
                {data.project_categories.map((dir, i) => {
                  if (i === 0) {
                    return <span key={i}>{dir.name}</span>
                  } else {
                    return <span key={i}>, {dir.name}</span>
                  }
                })}
              </p>
            )}
          </div>

          <IconBtn
            icon={"chat"}
            size={"md"}
            // href={data?.telegram_link}
            // isTargetBlank={!!data?.telegram_link}
            // disabled={data?.telegram_link ? undefined : true}
          />
        </>
      )}
      {type === "invite" && (
        <>
          <div className={`${styles["team-card__btns"]}`}>
            <DefaultBtn txt={"Accept"} onClick={acceptTeamInvite} size={"md"} minWidth={false} />
            <DefaultBtn
              txt={"Reject"}
              mod={"transparent-grey"}
              onClick={rejecttTeamInvite}
              size={"md"}
              minWidth={false}
            />
          </div>
        </>
      )}
      {type === "exclusive-invite" && (
        <div className={`${styles["team-card__btns"]}`}>
          <DefaultBtn txt={"Learn more"} onClick={openExclusiveModal} size={"md"} minWidth={false} />
        </div>
      )}
    </div>
  )
}

export default TeamCard
