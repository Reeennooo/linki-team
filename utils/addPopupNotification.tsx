import React from "react"
import { Store, NOTIFICATION_CONTAINER, NOTIFICATION_INSERTION } from "react-notifications-component"
import NotificationPopup from "components/ui/NotificationPopup/NotificationPopup"
import { IPopupNotificationIcon, IPopupNotificationMod } from "types/user"

interface notifyHelperProps {
  id?: string
  title: string
  txt?: string
  icon?: IPopupNotificationIcon
  mod?: IPopupNotificationMod
  container?: NOTIFICATION_CONTAINER
  insert?: NOTIFICATION_INSERTION
  duration?: number
  onClick?: () => void
}

export const addPopupNotification = (data: notifyHelperProps) => {
  const noteID = data?.id || Store.getCounter() + ""
  const handleClose = () => {
    Store.removeNotification(noteID)
  }
  Store.addNotification({
    id: noteID,
    content: (
      <NotificationPopup
        title={data.title}
        txt={data?.txt}
        icon={data?.icon}
        mod={data?.mod}
        onClose={handleClose}
        isFilling={data?.duration !== 0}
        onClick={data?.onClick}
      />
    ),
    insert: data?.insert || "top",
    container: data?.container || "bottom-left",
    dismiss: {
      duration: data?.duration ?? 4500,
      click: false,
      pauseOnHover: true,
    },
    animationIn: ["animate__animated animate__fadeInBottomLeft"],
    animationOut: ["animate__animated animate__fadeOutBottomLeft"],
  })
}
