import styles from "./StatBlock.module.scss"
import IconStar from "public/assets/svg/star.svg"
import IconStarEmpty from "public/assets/svg/starEmpty.svg"
import { useAuth } from "hooks/useAuth"
import { useGetUserStatisticQuery } from "redux/api/user"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import ModalUser from "components/Modals/ModalUser/ModalUser"
import { useAppDispatch } from "hooks"
import { updateApiParams } from "redux/slices/apiParams"
import { ratingConverter } from "utils/ratingConverter"

interface Props {
  props?: any
  addClass?: string
}
interface IStatItem {
  name: string
  value: number | null
  type: string
  href?: string
  userType?: number[]
  prefix?: JSX.Element | string
}

const StatBlock: React.FC<Props> = ({ addClass, ...props }) => {
  const { user } = useAuth()

  const { data: statistic } = useGetUserStatisticQuery()

  const dispatch = useAppDispatch()
  const [isModalUserOpen, setIsModalUserOpen] = useState(false)

  const [statItems, setStatItems] = useState<IStatItem[]>([
    {
      name: "Incoming offers",
      value: null,
      type: "incoming",
      href: "/projects?tab=1",
      userType: [2, 3],
    },
    {
      name: "Completed projects",
      value: null,
      type: "completed",
      href: "/projects?tab=3",
      userType: [2, 3],
    },
    {
      name: "Reputation",
      value: null,
      type: "rating",
      prefix: <IconStar />,
    },
    {
      name: "Earned in 1 month",
      value: null,
      type: "earned",
      href: "/payments",
      userType: [2, 3],
      prefix: "$",
    },
    {
      name: "My projects in linki",
      value: null,
      type: "projects",
      href: "/projects",
      userType: [1],
    },
    {
      name: "People in projects",
      value: null,
      type: "people",
      href: "/projects",
      userType: [1],
    },
    {
      name: "General budget",
      value: null,
      type: "budget",
      href: "/projects",
      userType: [1],
      prefix: "$",
    },
  ])

  useEffect(() => {
    if (!statistic) return
    setStatItems((prev) => {
      return [...prev]
        .map((item) => {
          if (item?.userType && !item.userType.includes(user.type)) return null
          if (item.type in statistic) item.value = statistic[item.type]
          return item
        })
        .filter((item) => item)
    })
  }, [statistic, user.type])

  return (
    <>
      <div className={`${addClass ? addClass : ""}`}>
        <h3 className={`${styles["stat-block__title"]}`}>Statistics</h3>
        <div className={`${styles["stat-block"]} `} {...props}>
          {statItems?.map((card, i) => {
            if (!card?.value) return null
            if (card?.href) {
              return (
                <Link href={card.href} key={i}>
                  <a className={styles.card}>
                    <div className={styles.card__name}>{card.name}</div>
                    <div className={styles.card__value}>
                      {card?.prefix} {card.value}
                    </div>
                  </a>
                </Link>
              )
            } else {
              const ratingToShow = ratingConverter(card.value)
              const isNewBie = ratingToShow === "Newbie"

              const ratingIcon = () => {
                if (typeof card?.prefix === "object" && !Array.isArray(card?.prefix)) {
                  return ratingToShow === "Newbie" ? <IconStarEmpty /> : <IconStar />
                }
                return card?.prefix
              }

              return (
                <button
                  key={i}
                  type={"button"}
                  className={styles.card}
                  onClick={() => {
                    setIsModalUserOpen(true)
                    dispatch(updateApiParams({ field: "currentUserID", data: user.id }))
                  }}
                >
                  <div className={styles.card__name}>{card.name}</div>
                  <div className={`${styles.card__value} ${isNewBie ? styles["card__value-emptyStar"] : null}`}>
                    {ratingIcon()} {ratingToShow}
                  </div>
                </button>
              )
            }
          })}
        </div>
      </div>
      <ModalUser
        isOpen={isModalUserOpen}
        onClose={() => {
          setIsModalUserOpen(false)
        }}
        isFooterExist={true}
        headerUserClickable={false}
        modalName={"modal-user-header"}
        modalType={"user-info-header"}
      />
    </>
  )
}

export default StatBlock
