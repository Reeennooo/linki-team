import styles from "./UserInfo.module.scss"
import BellIcon from "public/assets/svg/bell.svg"
import React, { memo, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "hooks/useAuth"
import { LoaderUserInfo } from "../ui/Loaders/Loaders"
import { useOnClickOutside } from "hooks/useOnClickOutside"
import IconLink from "components/ui/IconLink/IconLink"
import IconUser from "public/assets/svg/user.svg"
import { useLogout } from "hooks/useLogout"
import ModalUser from "components/Modals/ModalUser/ModalUser"
import { useAppDispatch, useAppSelector } from "hooks"
import { updateApiParams } from "redux/slices/apiParams"
import { BACKEND_HOST, BLUR_IMAGE_DATA_URL, USER_TYPE_CUSTOMER, USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"
import IconCrown2 from "public/assets/svg/crown-icon-2.svg"
import ArrowDown from "public/assets/svg/arr-down.svg"
import Image from "next/image"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import UserInfoBell from "components/UserInfo/UserInfoBell/UserInfoBell"
import { INotificationsData } from "types/user"
import { setNewNotificationArrived } from "redux/slices/notifications"

interface Props {
  mod: "desk" | "mob"
  isModalNotificationOpen?: any
  setIsModalNotificationOpen?: any
  notificationData?: any
  onMenuClose?: () => void
}

const UserInfo: React.FC<Props> = ({
  mod,
  isModalNotificationOpen,
  setIsModalNotificationOpen,
  notificationData,
  onMenuClose,
}) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAuth()
  const [isActiveUserDropdown, setIsActiveUserDropdown] = useState(false)
  const userBlockRef = useRef()
  const { modalsList } = useAppSelector(selectModals)

  const [isModalUserOpen, setIsModalUserOpen] = useState(false)

  const logout = useLogout()

  useOnClickOutside(userBlockRef, () => setIsActiveUserDropdown(false))

  //Выход из лк и редирект
  const logOutFunc = () => {
    logout()
    router.push("/signin")
  }

  const userDropBtns = [
    {
      action: "openUserModal",
      href: "/profile",
      icon: "/img/icons/user.svg",
      txt: "Profile",
    },
    {
      href: "/settings/profile",
      icon: "/assets/icons/settings.svg",
      txt: "Settings",
    },
    {
      href: "",
      icon: "/img/icons/signout.svg",
      txt: "Log Out",
      onclick: logOutFunc,
    },
  ]

  const openModalNotifications = () => {
    setIsModalNotificationOpen((prev) => !prev)
  }

  const [expertTeamAvatar, setExpertTeamAvatar] = useState(null)
  const [pmTeamAvatar, setPmtTeamAvatar] = useState(null)

  useEffect(() => {
    if (
      user.type === USER_TYPE_EXPERT &&
      user.manager_teams?.length > 0 &&
      user.manager_teams.filter((team) => team.status === 2)?.length > 0
    ) {
      setExpertTeamAvatar(user.manager_teams.filter((team) => team.status === 2)[0].avatar)
    }
    if (user.type === USER_TYPE_PM && user.manager_teams?.length > 0) {
      setPmtTeamAvatar(user.manager_teams[0].avatar)
    }
  }, [user])

  const handleUserClick = () => {
    if (window.innerWidth >= 768) {
      setIsActiveUserDropdown((prevState) => !prevState)
      return
    }
    setIsActiveUserDropdown(false)
    if (onMenuClose) onMenuClose()
    setIsModalUserOpen(true)
    dispatch(openModal("modal-user-header"))
    dispatch(updateApiParams({ field: "currentUserID", data: user.id }))
  }
  const handleProfileClick = () => {
    setIsActiveUserDropdown(false)
    setIsModalUserOpen(true)
    dispatch(openModal("modal-user-header"))
    dispatch(updateApiParams({ field: "currentUserID", data: user.id }))
  }

  return (
    <>
      <div className={`${styles["user-info"]} ${styles["user-info--" + mod]} page-layout__user-info`}>
        {!isAuthenticated ? (
          <LoaderUserInfo />
        ) : (
          <div
            ref={userBlockRef}
            className={`${styles["user-info__content"]} ${isActiveUserDropdown ? styles["is-active"] : ""}`}
          >
            <div className={styles["user-info__toggle"]} onClick={handleUserClick}>
              <div
                className={`${styles["user-info__content-img"]} ${user?.avatar ? "" : styles["no-avatar"]} ${
                  expertTeamAvatar || expertTeamAvatar === "" || pmTeamAvatar || pmTeamAvatar === ""
                    ? styles["expert-team-avatar"]
                    : ""
                }`}
              >
                {expertTeamAvatar && expertTeamAvatar !== "" && (
                  <Image
                    src={expertTeamAvatar.includes("http") ? expertTeamAvatar : BACKEND_HOST + expertTeamAvatar}
                    alt="avatar"
                    width={"46px"}
                    height={"46px"}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    placeholder="blur"
                    blurDataURL={BLUR_IMAGE_DATA_URL}
                  />
                )}
                {expertTeamAvatar && expertTeamAvatar === "" && (
                  <div className={`${styles["no-avatar-wrp"]}`}>
                    <IconUser />
                  </div>
                )}
                {pmTeamAvatar && pmTeamAvatar !== "" && (
                  <Image
                    src={pmTeamAvatar.includes("http") ? pmTeamAvatar : BACKEND_HOST + pmTeamAvatar}
                    alt="avatar"
                    width={"46px"}
                    height={"46px"}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    placeholder="blur"
                    blurDataURL={BLUR_IMAGE_DATA_URL}
                  />
                )}
                {pmTeamAvatar === "" && (
                  <div className={`${styles["no-avatar-wrp"]}`}>
                    <IconUser />
                  </div>
                )}
                {user?.avatar ? (
                  <Image
                    src={user.avatar.includes("http") ? user.avatar : BACKEND_HOST + user.avatar}
                    alt="avatar"
                    layout={"fill"}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    placeholder="blur"
                    blurDataURL={BLUR_IMAGE_DATA_URL}
                  />
                ) : (
                  <div className={`${styles["no-avatar-wrp"]}`}>
                    <IconUser />
                  </div>
                )}
                {user.premium_subscribe && (
                  <div className={`${styles["user-info__content-img-premium"]}`}>
                    <IconCrown2 />
                  </div>
                )}
              </div>
              <div>
                <p className={`${styles["user-info__content-name"]}`}>
                  {user.name} {user.surname}
                </p>
                <p className={`${styles["user-info__content-role"]}`}>
                  {user.type === USER_TYPE_CUSTOMER
                    ? "Client"
                    : user.type === USER_TYPE_EXPERT
                    ? "Expert"
                    : "Project manager"}
                </p>
              </div>
              <ArrowDown className={styles["user-info__arrowdown"]} stroke="none" />
            </div>
            <div className={`${styles["user-info__dropdown"]}`}>
              {userDropBtns.map((link, i) => {
                if (link.action) {
                  return (
                    <IconLink
                      key={i}
                      icon={link.icon}
                      txt={link.txt}
                      onClick={handleProfileClick}
                      isActive={router.pathname === link.href}
                    />
                  )
                } else {
                  return (
                    <IconLink
                      key={i}
                      icon={link.icon}
                      href={link.href}
                      txt={link.txt}
                      onClick={link.onclick ? link.onclick : undefined}
                      isActive={router.pathname === link.href}
                    />
                  )
                }
              })}
            </div>
          </div>
        )}
        <UserInfoBell
          onClick={openModalNotifications}
          isNew={notificationData?.filter((notification: INotificationsData) => !notification.status).length > 0}
          className={styles["user-info__note-btn"]}
        />
      </div>
      {isModalUserOpen && (
        <ModalUser
          isOpen={modalsList.includes("modal-user-header")}
          onClose={() => {
            dispatch(closeModal("modal-user-header"))
            setTimeout(() => {
              setIsModalUserOpen(false)
            }, 200)
          }}
          headerUserClickable={false}
          modalName={"modal-user-header"}
          modalType={"user-info-header"}
        />
      )}
    </>
  )
}

export default memo(UserInfo)
