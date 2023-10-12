import { useEffect, useRef } from "react"
import { selectNotifications, setNewNotificationArrived, setNotificationAllowed } from "redux/slices/notifications"
import { useAppDispatch, useAppSelector } from "hooks/index"
import { useAuth } from "hooks/useAuth"
import { INotificationsData } from "types/user"
import { socket } from "packages/socket"
import { useLazyGetNotificationSettingsQuery } from "redux/api/user"
import { NOTIFICATION_TYPE_CHAT, NOTIFICATION_TYPE_PAYMENT, NOTIFICATION_TYPE_PROJECT, SITE_URL } from "utils/constants"
import { notificationsApi, useSetNotificationsReadMutation } from "redux/api/notifications"
import { addPopupNotification } from "utils/addPopupNotification"
import { updateApiParams } from "redux/slices/apiParams"

const soundUrl = "../assets/not.mp3"
export function showNotification({ title }) {
  new Notification(title, {
    icon: `${SITE_URL}assets/logo-small.svg`,
  })
}

const useAppNotification = () => {
  const dispatch = useAppDispatch()
  const { isAllowed, settingsWeb } = useAppSelector(selectNotifications)
  const [getNotificationSettings] = useLazyGetNotificationSettingsQuery()
  const [setNotificationsRead] = useSetNotificationsReadMutation()
  const {
    user: { id: user_id },
    isAuthenticated,
  } = useAuth()
  const notificationSound = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio(soundUrl) : undefined
  )

  useEffect(() => {
    if (!("Notification" in window) || !isAuthenticated) return

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        dispatch(setNotificationAllowed(true))
        getNotificationSettings()
      }
    })
  }, [isAuthenticated])

  useEffect(() => {
    if (!user_id) return

    function notificationHandler(data) {
      const entity = data.notification as INotificationsData

      dispatch(
        notificationsApi.util.updateQueryData("getNotifications", undefined, (draft) => {
          draft.unshift(entity)
        })
      )

      if (!entity.text) return

      // если пришло уведомление с чатом и этот чат уже открыт
      if (entity?.dialog_id && document.querySelector(`#modal-chat-${entity.dialog_id}`)) {
        setNotificationsRead([entity.id])
        return
      } else {
        addPopupNotification({
          title: entity?.name || "",
          txt: entity.text,
          onClick: () => {
            setNotificationsRead([entity.id])
            if (entity?.dialog_id) dispatch(updateApiParams({ field: "chatID", data: entity.dialog_id }))
          },
        })
      }
      dispatch(setNewNotificationArrived(true))
      notificationSound.current?.play()

      if (!isAllowed) return

      if (entity.type === NOTIFICATION_TYPE_CHAT && settingsWeb.chats) {
        showNotification({
          title: entity.text,
        })
      }

      if (entity.type === NOTIFICATION_TYPE_PAYMENT && settingsWeb.payments) {
        showNotification({
          title: entity.text,
        })
      }

      if (entity.type === NOTIFICATION_TYPE_PROJECT && settingsWeb.projects) {
        showNotification({
          title: entity.text,
        })
      }
    }

    socket.on(`private-notification.${user_id}:notification.message`, notificationHandler)

    return () => {
      socket.off(`private-notification.${user_id}:notification.message`, notificationHandler)
    }
  }, [user_id, isAllowed, settingsWeb])
}

export default useAppNotification
