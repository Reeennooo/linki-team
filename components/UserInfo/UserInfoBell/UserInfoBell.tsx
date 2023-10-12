import React, { useEffect, useState } from "react"
import styles from "./UserInfoBell.module.scss"
import { useAppDispatch, useAppSelector } from "hooks"
import { selectNotifications, setNewNotificationArrived } from "redux/slices/notifications"

interface Props {
  onClick?: () => void
  isNew?: boolean
  className?: string
}

const UserInfoBell: React.FC<Props> = ({ onClick, isNew, className }) => {
  const dispatch = useAppDispatch()
  const { isNewNotificationArrived } = useAppSelector(selectNotifications)

  useEffect(() => {
    if (!isNewNotificationArrived) return
    setIsAnim(true)
    setTimeout(() => {
      setIsAnim(false)
    }, 800)
    dispatch(setNewNotificationArrived(false))
  }, [dispatch, isNewNotificationArrived])

  const [isAnim, setIsAnim] = useState<boolean>(false)

  const bellClasses = [
    "user-notifications",
    styles.bell,
    className ? className : "",
    isNew ? styles["bell--new"] : "",
    isAnim ? styles["bell--is-animating"] : "",
  ].join(" ")

  return (
    <>
      <button
        className={bellClasses}
        type={"button"}
        onClick={() => {
          if (onClick) onClick()
        }}
      >
        <div className={styles.bell__wrap}>
          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              className={styles.bell__bow}
              d="M2.89086 6.13842L2.89085 6.75C2.89085 9.61851 2.28993 11.3326 1.72156 12.3104L1.72067 12.3119C1.70956 12.3309 1.70364 12.3524 1.70352 12.3744C1.7034 12.3964 1.70908 12.418 1.71998 12.437C1.73087 12.4561 1.74661 12.472 1.7656 12.483C1.78447 12.494 1.80587 12.4999 1.82769 12.5H14.1723C14.1941 12.4999 14.2155 12.494 14.2344 12.483C14.2534 12.472 14.2691 12.4561 14.28 12.4371C14.2909 12.418 14.2966 12.3964 14.2965 12.3744C14.2963 12.3524 14.2904 12.3309 14.2793 12.3119L14.2784 12.3104C13.7104 11.3327 13.1098 9.61861 13.1098 6.75V6.19561C13.1098 3.35916 10.8479 1.02102 8.03912 1.00014C5.25129 0.979417 3.04826 3.26686 2.89086 6.13842ZM1.89155 6.09871C2.0675 2.75688 4.65267 -0.0250607 8.04656 0.000170288C11.4236 0.0252763 14.1098 2.82886 14.1098 6.19561V6.75C14.1098 9.47759 14.6799 11.0109 15.1431 11.808L14.7108 12.0592L15.1422 11.8065C15.2422 11.9772 15.2954 12.1712 15.2964 12.3691C15.2975 12.5669 15.2464 12.7615 15.1482 12.9332C15.0501 13.105 14.9084 13.2478 14.7374 13.3473C14.5664 13.4468 14.3722 13.4995 14.1744 13.5L14.1731 13.5H1.82684L1.82556 13.5C1.62771 13.4995 1.43351 13.4468 1.26252 13.3473C1.09154 13.2478 0.949832 13.1049 0.85169 12.9331C0.753548 12.7613 0.702446 12.5667 0.703539 12.3689C0.70463 12.1714 0.75769 11.9777 0.857376 11.8072C1.3207 11.0099 1.89085 9.4767 1.89085 6.75L1.89086 6.125C1.89086 6.11623 1.89109 6.10747 1.89155 6.09871Z"
            />
            <path
              className={styles.bell__clapper}
              d="M5.5 12.5C5.77614 12.5 6 12.7239 6 13V13.625C6 14.1554 6.21071 14.6641 6.58579 15.0392C6.96086 15.4143 7.46957 15.625 8 15.625C8.53043 15.625 9.03914 15.4143 9.41421 15.0392C9.78929 14.6641 10 14.1554 10 13.625V13C10 12.7239 10.2239 12.5 10.5 12.5C10.7761 12.5 11 12.7239 11 13V13.625C11 14.4206 10.6839 15.1837 10.1213 15.7463C9.55871 16.3089 8.79565 16.625 8 16.625C7.20435 16.625 6.44129 16.3089 5.87868 15.7463C5.31607 15.1837 5 14.4206 5 13.625V13C5 12.7239 5.22386 12.5 5.5 12.5Z"
            />
          </svg>
        </div>
      </button>
    </>
  )
}

export default UserInfoBell
