import { useAppDispatch } from "hooks/index"
import { useAuth } from "hooks/useAuth"
import { useEffect } from "react"
import { socket } from "packages/socket"
import { chatApi, useLazyGetDialogsQuery } from "redux/api/chat"

const useAppChat = () => {
  const dispatch = useAppDispatch()
  const [getDialogs, { data: dialogs }] = useLazyGetDialogsQuery()
  const {
    user: { id: user_id },
    isAuthenticated,
  } = useAuth()

  useEffect(() => {
    // getDialogs()
  }, [])
  useEffect(() => {
    if (!dialogs) return
    // console.log("dialogs: ", dialogs)
    // получение сообщений в лайв режиме
    // dialogs?.dialogs.map((dialog) => {
    //   console.log("dialog: ", dialog.id)
    //   socket.on(`private-dialog.${dialog.id}:chat.message`, messageHandler)
    // })

    function messageHandler(data) {
      console.log("data: ", data)
    }
    // socket.on(`private-dialog.${dialog_id}:chat.message`, messageHandler)
    // return () => {
    //   socket.off(`private-dialog.${dialog_id}:chat.message`, messageHandler)
    // }
  }, [dialogs])
}

export default useAppChat
