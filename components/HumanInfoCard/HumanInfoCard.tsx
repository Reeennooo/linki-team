import styles from "./HumanInfoCard.module.scss"
import { IExecutorListData } from "types/team"
import IconUser from "public/assets/svg/user.svg"
import IconUserSm from "public/assets/svg/user.svg"
import IconStar from "public/assets/svg/star.svg"
import IconStarEmpty from "public/assets/svg/starEmpty.svg"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import React, { useEffect, useRef, useState } from "react"
import TagItem from "components/ui/TagItem/TagItem"
import ModalUser from "components/Modals/ModalUser/ModalUser"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { useAppDispatch, useAppSelector } from "hooks"
import { updateApiParams } from "redux/slices/apiParams"
import { BLUR_IMAGE_DATA_URL, CHAT_TYPE_PRIVATE } from "utils/constants"
import Image from "next/image"
import ModalChat from "components/Modals/ModalChat/ModalChat"
import { ratingConverter } from "../../utils/ratingConverter"

interface IHumanInfoCard {
  data: IExecutorListData
  cardIndex: number
  onClick?: () => void
}

const HumanInfoCard: React.FC<IHumanInfoCard> = ({ data, cardIndex, onClick }) => {
  const cardRef = useRef()
  const skillsRef = useRef()

  const dispatch = useAppDispatch()

  const { modalsList } = useAppSelector(selectModals)

  const [skillsList, setSkillsList] = useState([])
  const [skillsRow, setSkillsRow] = useState("")
  const [isChatOpen, setChatOpen] = useState<boolean>(false)
  const ratingToShow = ratingConverter(data.rating)
  const isNewBie = ratingToShow === "Newbie"

  const setRolesWidth = () => {
    const cardRefCurrent = cardRef.current as HTMLElement
    const skillsRefCurrent = skillsRef.current as HTMLElement
    let optWidth = 80 - 40
    if (window.innerWidth <= 1439) optWidth = 40 - 20
    skillsRefCurrent.style.width = cardRefCurrent.offsetWidth + optWidth + "px"
  }

  useEffect(() => {
    data?.job_roles.map((job_role) => {
      job_role?.skills.map((skill) => {
        setSkillsList((prev) => {
          return [...prev, skill.name]
        })
      })
    })
    setRolesWidth()
  }, [])
  useEffect(() => {
    window.addEventListener("resize", setRolesWidth)
    return () => {
      window.removeEventListener("resize", setRolesWidth)
    }
  })

  const handleHover = () => {
    if (window.innerWidth <= 1199) return
    const cardRefCurrent = cardRef.current as HTMLElement
    const skillsRefCurrent = skillsRef.current as HTMLElement
    cardRefCurrent.style.zIndex = "2"
    if (skillsRefCurrent.offsetHeight > 105) {
      setSkillsRow("three")
    } else if (skillsRefCurrent.offsetHeight > 70 && skillsRefCurrent.offsetHeight <= 104) {
      setSkillsRow("two")
    } else {
      setSkillsRow("")
    }
  }
  const handleHoverLeave = () => {
    if (window.innerWidth <= 1199) return
    const cardRefCurrent = cardRef.current as HTMLElement
    cardRefCurrent.style.zIndex = ""
  }

  const handleOpenModalUser = () => {
    if (modalsList.includes(`modal-user-card-info-${cardIndex}`)) {
      dispatch(closeModal(`modal-user-card-info-${cardIndex}`))
    } else {
      dispatch(updateApiParams({ field: "currentUserID", data: data.id }))
      dispatch(openModal(`modal-user-card-info-${cardIndex}`))
    }
  }

  const handleClick = () => {
    if (window.innerWidth >= 1200) return
    if (onClick) onClick()
    handleOpenModalUser()
  }

  const classes = ["human-card-info", styles.card, skillsRow ? styles["card--skills-row-" + skillsRow] : ""].join(" ")

  return (
    <>
      <div
        className={classes}
        ref={cardRef}
        onPointerOver={handleHover}
        onPointerLeave={handleHoverLeave}
        onClick={handleClick}
      >
        <div className={`human-card-info__inner ${styles.card__inner}`}>
          {ratingToShow && (
            <div className={`${styles.card__rating} ${isNewBie ? styles["card__rating-empty"] : null}`}>
              {ratingToShow} {isNewBie ? <IconStarEmpty width={13} height={13} /> : <IconStar width={13} height={13} />}
            </div>
          )}
          <div className={styles["card__avatar-wrap"]}>
            {data.avatar ? (
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
                className={styles.card__avatar}
              />
            ) : (
              <div className={styles["card__no-avatar"]}>
                <IconUser />
              </div>
            )}
          </div>

          <h3 className={styles.card__name}>
            {data?.name} {data?.surname && data.surname[0].toUpperCase() + "."}
          </h3>

          {data?.job_roles.length > 0 && (
            <>
              <p className={styles.card__roles}>
                <span className={styles["card__roles-txt"]}>{data.job_roles[0].name}</span>
                {data.job_roles.length > 1 && (
                  <span className={styles["card__roles-num"]}>+{data.job_roles.length - 1}</span>
                )}
              </p>

              <p className={styles.card__price}>
                ${data.job_roles[0].hourly_pay}/hr
                {data.job_roles.length > 1 && (
                  <span className={styles["card__price-num"]}>+{data.job_roles.length - 1}</span>
                )}
              </p>

              <p ref={skillsRef} className={styles.card__skills}>
                {skillsList?.map((skill, index) => {
                  if (index > 2) return null
                  return <TagItem key={index} txt={skill} id={index} readonly mod={"gray-md"} />
                })}
                {skillsList.length > 3 && <span className={styles["card__skills-num"]}>+{skillsList.length - 3}</span>}
              </p>
            </>
          )}

          <div className={styles.card__footer}>
            <DefaultBtn
              txt={"Chat"}
              mod={"transparent-grey"}
              icon={"chat"}
              minWidth={false}
              size={"md"}
              onClick={() => {
                setChatOpen(true)
                dispatch(openModal("modal-chat"))
              }}
            />
            <DefaultBtn
              txt={"Profile"}
              mod={"transparent-grey"}
              icon={<IconUserSm />}
              minWidth={false}
              size={"md"}
              onClick={handleOpenModalUser}
            />
          </div>
        </div>
      </div>

      <ModalUser
        isOpen={modalsList.includes(`modal-user-card-info-${cardIndex}`)}
        onClose={() => {
          dispatch(closeModal(`modal-user-card-info-${cardIndex}`))
        }}
        isFooterExist={false}
        headerUserClickable={false}
        modalName={`modal-user-card-info-${cardIndex}`}
        modalType={`modal-user-card-info-${cardIndex}`}
      />
      {isChatOpen && (
        <ModalChat
          isOpen={modalsList.includes("modal-chat")}
          onClose={() => {
            dispatch(closeModal("modal-chat"))
            setTimeout(() => {
              setChatOpen(false)
            }, 200)
          }}
          personID={data?.id}
          chatType={CHAT_TYPE_PRIVATE}
        />
      )}
    </>
  )
}

export default HumanInfoCard
