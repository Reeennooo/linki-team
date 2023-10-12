import UserInfo from "components/UserInfo/UserInfo"
import { useAppDispatch, useAppSelector } from "hooks"
import { selectMenuCollapsed, toggleDocumentScroll, toggleSideMenu } from "redux/slices/uiSlice"
import React, { memo, useEffect, useState } from "react"
import SearchBlock from "components/SearchBlock/SearchBlock"
import ModalNotifications from "components/Modals/ModalNotifications/ModalNotifications"
import { useLazyGetNotificationsQuery } from "redux/api/notifications"
import { useAuth } from "hooks/useAuth"
// import Intercom from "packages/intercom"
import IconCaretDown from "public/assets/svg/CaretDown.svg"
import { useRouter } from "next/router"
import { INotificationsData } from "types/user"
import { setNewNotificationArrived } from "redux/slices/notifications"
import UserInfoBell from "components/UserInfo/UserInfoBell/UserInfoBell"

interface Props {
  backBtn?: boolean
  title: string
}

const PageLayoutHeader: React.FC<Props> = ({ title, backBtn }) => {
  const { isAuthenticated, user } = useAuth()
  const collapsed = useAppSelector(selectMenuCollapsed)
  const dispatch = useAppDispatch()
  const toggleSlideMenuFn = () => {
    // Intercom.changeVisibility(collapsed)
    dispatch(toggleSideMenu(!collapsed))
    dispatch(toggleDocumentScroll({ data: !collapsed, breakpoint: 768 }))
  }
  const [getNotifications, { data: notificationData, isLoading: isLoadingNotifications }] =
    useLazyGetNotificationsQuery()

  useEffect(() => {
    if (user.id) getNotifications(undefined, true)
  }, [user])

  const [isNotificationsLoaded, setNotificationsLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (isLoadingNotifications) setNotificationsLoaded(true)
  }, [isLoadingNotifications])

  useEffect(() => {
    if (
      isNotificationsLoaded &&
      notificationData &&
      notificationData?.filter((notification: INotificationsData) => !notification.status).length > 0
    ) {
      dispatch(setNewNotificationArrived(true))
      setNotificationsLoaded(false)
    }
  }, [dispatch, notificationData, isNotificationsLoaded])

  const [isModalNotificationOpen, setIsModalNotificationOpen] = useState(false)
  const openModalNotifications = () => {
    setIsModalNotificationOpen((prev) => !prev)
  }

  const router = useRouter()

  const sctollToTop = () => {
    if (window?.innerWidth > 767) {
      document.querySelector(".page-layout__content-wrp")?.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      window?.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <>
      <div className={`page-layout__header`}>
        <div className={`page-layout__header-left`}>
          <div
            className={`burger-menu page-layout__burger ${collapsed ? "is-active" : ""}`}
            onClick={toggleSlideMenuFn}
          >
            <span className="burger-menu__item"></span>
            <span className="burger-menu__item"></span>
            <span className="burger-menu__item"></span>
            <span className="burger-menu__item"></span>
          </div>

          <h1
            onClick={sctollToTop}
            className={`page-layout__header-title ${backBtn ? "page-layout__header-title--btn-back" : ""}`}
          >
            {backBtn && (
              <button onClick={() => router.back()} className="page-layout__header-btn-back" type="button">
                <IconCaretDown /> <span>Back</span>
              </button>
            )}
            {title}
          </h1>
          <div className={`page-layout__mob-btns`}>
            <UserInfoBell
              onClick={openModalNotifications}
              isNew={
                notificationData &&
                notificationData?.filter((notification: INotificationsData) => !notification.status).length > 0
              }
              className={"page-layout__mob-btn"}
            />
          </div>
          <SearchBlock />
        </div>
        <UserInfo
          mod={"desk"}
          isModalNotificationOpen={isModalNotificationOpen}
          setIsModalNotificationOpen={setIsModalNotificationOpen}
          notificationData={notificationData}
        />
      </div>
      <ModalNotifications
        isOpen={isModalNotificationOpen}
        onClose={() => {
          setIsModalNotificationOpen(false)
        }}
        closeOutside={(target) => {
          return target.closest(".user-notifications") === null
        }}
      />
    </>
  )
}

export default memo(PageLayoutHeader)
