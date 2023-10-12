import React, { useEffect, useState } from "react"
import ModalChat from "components/Modals/ModalChat/ModalChat"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { useAppDispatch, useAppSelector } from "hooks"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"

const ModalChatNotification = () => {
  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)
  const { chatID } = useAppSelector(selectApiParams)

  const [isChatOpen, setChatOpen] = useState<boolean>(false)
  const [currentChatID, setCurrentChatID] = useState<number | null>(null)

  useEffect(() => {
    if (!chatID) return
    setCurrentChatID(chatID)
    setChatOpen(true)
    dispatch(openModal("modal-notification-chat"))
    dispatch(updateApiParams({ field: "chatID", data: null }))
  }, [chatID, dispatch])

  return isChatOpen ? (
    <ModalChat
      isOpen={modalsList.includes("modal-notification-chat")}
      onClose={() => {
        dispatch(closeModal("modal-notification-chat"))
        setTimeout(() => {
          setChatOpen(false)
          setCurrentChatID(null)
        }, 200)
      }}
      chatID={currentChatID}
    />
  ) : null
}

export default ModalChatNotification
