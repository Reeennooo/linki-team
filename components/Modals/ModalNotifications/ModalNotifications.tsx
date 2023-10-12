import Modal from "components/ui/Modal/Modal"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import React, { useEffect, useState } from "react"
import { useLazyGetNotificationsQuery, useSetNotificationsReadMutation } from "redux/api/notifications"
import ModalNotificationsItem from "components/Modals/ModalNotifications/ModalNotificationsItem/ModalNotificationsItem"
import styles from "./ModalNotifications.module.scss"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import { NOTIFICATION_TYPE_CHAT, NOTIFICATION_TYPE_PAYMENT, NOTIFICATION_TYPE_PROJECT } from "utils/constants"
import ModalChat from "components/Modals/ModalChat/ModalChat"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { useAppDispatch, useAppSelector } from "hooks"
import { INotificationsData } from "types/user"

interface ModalNotificationsProps {
  isOpen: boolean
  modalName?: string
  isFooterExist?: boolean
  onClose: () => void
  closeOutside?: (param: HTMLElement) => boolean
}

const ModalNotifications: React.FC<ModalNotificationsProps> = ({
  isOpen,
  onClose,
  closeOutside,
  modalName = "modal-notifications",
  isFooterExist = false,
}) => {
  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)

  const [getNotifications, { data: notificationData }] = useLazyGetNotificationsQuery()
  const [setNotificationsRead] = useSetNotificationsReadMutation()

  const [paymentsNotifications, setPaymentsNotifications] = useState<INotificationsData[]>([])
  const [projectsNotifications, setProjectsNotifications] = useState<INotificationsData[]>([])
  const [chatsNotifications, setChatsNotifications] = useState<INotificationsData[]>([])
  const [notReadIDs, setNotReadIDs] = useState<number[] | []>([])
  const [activeTabID, setActiveTabID] = useState<number>(1)
  const [linksTabsData, setLinksTabsData] = useState([
    { id: 1, txt: "All", count: 0 },
    { id: 2, txt: "Payments", count: 0 },
    { id: 3, txt: "Projects", count: 0 },
    { id: 4, txt: "Chats", count: 0 },
  ])
  const [isChatOpen, setChatOpen] = useState<boolean>(false)
  const [chatID, setChatID] = useState<number | null>(null)

  useEffect(() => {
    if (!isOpen) return
    getNotifications(undefined, true)
  }, [getNotifications, isOpen])

  useEffect(() => {
    const pay = notificationData?.filter((notification) => notification.type === NOTIFICATION_TYPE_PAYMENT) || []
    const proj = notificationData?.filter((notification) => notification.type === NOTIFICATION_TYPE_PROJECT) || []
    const chat = notificationData?.filter((notification) => notification.type === NOTIFICATION_TYPE_CHAT) || []
    setNotReadIDs(notificationData?.filter((notification) => !notification.status).map((note) => note.id) || [])
    setPaymentsNotifications(pay)
    setProjectsNotifications(proj)
    setChatsNotifications(chat)
    setLinksTabsData((prev) => {
      return [...prev].map((tab) => {
        switch (tab.id) {
          case 1:
            tab.count = notificationData?.filter((notification) => !notification.status).length || 0
            break
          case 2:
            tab.count = pay?.filter((notification) => !notification.status).length
            break
          case 3:
            tab.count = proj?.filter((notification) => !notification.status).length
            break
          case 4:
            tab.count = chat?.filter((notification) => !notification.status).length
            break
        }
        return tab
      })
    })
  }, [notificationData])

  const onClickRead = (id: number, type?: number, dialog_id?: number) => {
    setNotificationsRead([id])
    if (type && type === NOTIFICATION_TYPE_CHAT && dialog_id) {
      // только для новых сообщений. Старые сообщения, до обновы, не присылают dialog_id
      setChatID(dialog_id)
      setChatOpen(true)
      dispatch(openModal("modal-notifications-chat"))
    } else {
      onClose()
    }
  }
  const onClickReadAll = () => {
    setNotificationsRead(notReadIDs)
  }

  const noNewNotifications = (
    <div className={styles.modal__empty}>
      <p>No new notifications</p>
      <img src={"/assets/notifications-no.png"} alt={"no new notifications"} />
    </div>
  )

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        name={modalName}
        isFooterExist={isFooterExist}
        closeOutside={closeOutside}
        header={
          <>
            <DetailedPopupHeader onClose={onClose} title={"Notifications"} />
            {notReadIDs?.length > 0 && (
              <button
                type={"button"}
                className={`${styles["modal__btn-all-header"]} ${styles["modal__btn-all"]}`}
                onClick={onClickReadAll}
              >
                Mark all as read
              </button>
            )}
          </>
        }
        addClass={styles.modal}
      >
        <div className={styles.modal__tabs}>
          <TabsLinear
            list={linksTabsData}
            activeId={activeTabID}
            onClick={(id) => {
              setActiveTabID(id)
            }}
          />
          {notReadIDs?.length > 0 ? (
            <button type={"button"} className={styles["modal__btn-all"]} onClick={onClickReadAll}>
              Mark all as read
            </button>
          ) : (
            ""
          )}
        </div>

        {activeTabID === 1 ? (
          <>
            {notificationData?.length
              ? notificationData.map((item) => (
                  <ModalNotificationsItem
                    key={item.id}
                    data={item}
                    onClick={onClickRead}
                    href={
                      item.type === NOTIFICATION_TYPE_PAYMENT
                        ? "/payments"
                        : item.type === NOTIFICATION_TYPE_PROJECT
                        ? "/projects"
                        : undefined
                    }
                  />
                ))
              : noNewNotifications}
          </>
        ) : activeTabID === 2 ? (
          <>
            {paymentsNotifications?.length ? (
              <>
                {paymentsNotifications.map((notification) => (
                  <ModalNotificationsItem
                    key={notification.id}
                    data={notification}
                    onClick={onClickRead}
                    href={"/wallet"}
                  />
                ))}
              </>
            ) : (
              noNewNotifications
            )}
          </>
        ) : activeTabID === 3 ? (
          <>
            {projectsNotifications?.length ? (
              <>
                {projectsNotifications.map((notification) => (
                  <ModalNotificationsItem
                    key={notification.id}
                    data={notification}
                    onClick={onClickRead}
                    href={"/projects"}
                  />
                ))}
              </>
            ) : (
              noNewNotifications
            )}
          </>
        ) : activeTabID === 4 ? (
          <>
            {chatsNotifications?.length ? (
              <>
                {chatsNotifications.map((notification) => (
                  <ModalNotificationsItem key={notification.id} data={notification} onClick={onClickRead} />
                ))}
              </>
            ) : (
              noNewNotifications
            )}
          </>
        ) : (
          ""
        )}
      </Modal>
      {isChatOpen && (
        <ModalChat
          isOpen={modalsList.includes("modal-notifications-chat")}
          onClose={() => {
            dispatch(closeModal("modal-notifications-chat"))
            setTimeout(() => {
              setChatOpen(false)
            }, 200)
          }}
          chatID={chatID}
        />
      )}
    </>
  )
}

export default ModalNotifications
