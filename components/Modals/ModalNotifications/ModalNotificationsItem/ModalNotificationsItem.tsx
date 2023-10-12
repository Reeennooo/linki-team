import { INotificationsData } from "types/user"
import styles from "./ModalNotificationsItem.module.scss"
import moment from "moment"
import Link from "next/link"
import IconUser from "public/assets/svg/user.svg"
import React from "react"
import { BLUR_IMAGE_DATA_URL } from "utils/constants"
import Image from "next/image"

interface ModalNotificationsItemProps {
  data: INotificationsData
  href?: string
  onClick?: (id: number, type: number, dialog_id?: number) => void
}

const ModalNotificationsItem: React.FC<ModalNotificationsItemProps> = ({ data, href, onClick }) => {
  const btnClasses = ["notification-item", styles.item].join(" ")

  const dateTime = data?.created_at ? moment(data.created_at).fromNow() : null

  const body = (
    <>
      <div className={styles.item__avatar}>
        {data?.image && (
          <Image
            src={data.image}
            alt={data.name}
            layout={"fill"}
            quality={75}
            objectFit={"cover"}
            objectPosition={"center"}
            placeholder="blur"
            blurDataURL={BLUR_IMAGE_DATA_URL}
          />
        )}
        {!data?.image && [2, 3].includes(data.type) && (
          <span className={styles["item__no-avatar"]}>
            <IconUser />
          </span>
        )}
      </div>
      <div className={styles.item__content}>
        <div className={styles.item__header}>
          <p className={styles.item__title}>{data.name}</p>
          <p className={styles.item__date}>{dateTime}</p>
        </div>
        <div className={styles.item__body}>
          <p className={styles.item__txt} title={data.text}>
            {data.text}
          </p>
          {!data.status && <span className={styles["item__not-read"]} />}
        </div>
      </div>
    </>
  )

  return href ? (
    <Link href={href}>
      <a
        onClick={() => {
          if (onClick) onClick(data.id, data.type, data?.dialog_id)
        }}
        className={btnClasses}
      >
        {body}
      </a>
    </Link>
  ) : (
    <button
      type={"button"}
      onClick={() => {
        if (onClick) onClick(data.id, data.type, data?.dialog_id)
      }}
      className={btnClasses}
    >
      {body}
    </button>
  )
}

export default ModalNotificationsItem
