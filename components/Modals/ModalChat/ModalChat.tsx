import styles from "./ModalChat.module.scss"
import Modal from "components/ui/Modal/Modal"
import React, { useEffect, useMemo, useState } from "react"
import {
  useCreateChatMutation,
  useCreateTeamChatMutation,
  useCreateWorkChatMutation,
  useGetDialogsListMutation,
  useLazyGetDialogQuery,
  useLazyGetMessagesCountQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
} from "redux/api/chat"
import ChatMessage from "components/Chat/ChatMessage/ChatMessage"
import { socket } from "packages/socket"
import { ChatTypeList, IChatMessageData, ISendMesData } from "types/chat"
import ChatFooter from "components/Chat/ChatFooter/ChatFooter"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import {
  BACKEND_HOST,
  CHAT_OFFSET_MESSAGES,
  CHAT_TYPE_CUSTOMER_MANAGER,
  CHAT_TYPE_MANAGER_EXPERT,
  CHAT_TYPE_PRIVATE,
  CHAT_TYPE_TEAM,
  CHAT_TYPE_WORK,
  USER_TYPE_CUSTOMER,
  USER_TYPE_EXPERT,
  USER_TYPE_PM,
} from "utils/constants"
import { useLazyGetUserQuery } from "redux/api/user"
import { useAuth } from "hooks/useAuth"
import ChatObs from "components/Chat/ChatObs"
import moment from "moment"
import { useLazyGetExactProjectQuery, useLazyGetOfferQuery } from "redux/api/project"
import { useLazyGetTeamInfoQuery } from "redux/api/pmteam"

interface Props {
  isOpen: boolean
  onClose: () => void
  closeOutside?: (param: HTMLElement) => boolean
  personID?: number
  orderID?: number
  teamID?: number
  chatID?: number | undefined | null
  modalName?: string
  chatType?: ChatTypeList
}

const ModalChat: React.FC<Props> = ({
  isOpen,
  onClose,
  closeOutside,
  personID,
  orderID,
  teamID,
  chatID,
  modalName,
  chatType,
}) => {
  const { user } = useAuth()

  const [getDialogsList, { data: dialogsList }] = useGetDialogsListMutation()
  const [getDialog, { data: dialogData }] = useLazyGetDialogQuery()
  const [getMessages, { isFetching: isFetchingMessages, isUninitialized }] = useLazyGetMessagesQuery() // 20 сообщений истории чата
  const [getMessagesCount, { data: messagesCount }] = useLazyGetMessagesCountQuery()
  const [sendMessage, { isLoading: isLoadingSendMessage }] = useSendMessageMutation()
  const [getUser, { data: userData, isFetching: isFetchingUser }] = useLazyGetUserQuery()
  const [getProject, { data: projectData, isFetching: isFetchingProject }] = useLazyGetExactProjectQuery()
  const [getTeamInfo, { data: teamInfo, isFetching: isFetchingTeamInfo }] = useLazyGetTeamInfoQuery()
  const [getOffer, { data: offerData, isFetching: isFetchingOffer }] = useLazyGetOfferQuery()
  const [createChat, { data: resultCreateChat }] = useCreateChatMutation()
  const [createWorkChat, { data: resultCreateWorkChat }] = useCreateWorkChatMutation()
  const [createTeamChat, { data: resultCreateTeamChat }] = useCreateTeamChatMutation()

  const [messagesState, setMessagesState] = useState<IChatMessageData[]>([])
  const [dialogID, setDialogID] = useState<number | null | undefined>(null)
  // когда можно проверять, что проскролили к самому верху и подгружать новые сообщения
  const [isOffsetLoading, setOffsetLoading] = useState<boolean>(false)
  const [offset, setOffset] = useState<number>(0)
  const [isNeedLoading, setNeedLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!isOpen) setOffsetLoading(false)
  }, [isOpen])

  // получаяем юзера в шапке
  useEffect(() => {
    if (!personID) return
    getUser(personID)
  }, [getUser, personID])
  // получаяем данные проекта в шапке
  useEffect(() => {
    if (chatType === CHAT_TYPE_PRIVATE) return
    if (!orderID) return
    getProject(orderID)
  }, [chatType, getProject, orderID])
  // получаем offer, чтобы знать кол-во участников в проекте
  useEffect(() => {
    if (chatType !== CHAT_TYPE_WORK || !orderID) return
    getOffer({ order_id: orderID, manager_id: projectData?.manager_id })
  }, [chatType, getOffer, orderID, projectData?.manager_id])
  // получаем данные команды
  useEffect(() => {
    if (!teamID) return
    getTeamInfo(teamID)
  }, [getTeamInfo, teamID])
  // получаем диалоги
  useEffect(() => {
    if (!isOpen) return
    getDialogsList()
  }, [getDialogsList, isOpen])
  // получаем диалог
  useEffect(() => {
    if (!chatID) return
    getDialog(chatID)
  }, [chatID, getDialog])

  useEffect(() => {
    if (!dialogData) return
    switch (dialogData.type) {
      case CHAT_TYPE_PRIVATE:
        setDialogID(chatID)
        const targetUser = dialogData.users.filter((dialogUser) => dialogUser.id !== user.id)
        if (targetUser) getUser(targetUser[0].id)
        break
      case CHAT_TYPE_MANAGER_EXPERT:
      case CHAT_TYPE_CUSTOMER_MANAGER:
        setDialogID(chatID)
        if (dialogData?.order_id) getProject(dialogData.order_id)
        break
      case CHAT_TYPE_WORK:
        setDialogID(chatID)
        if (dialogData?.order_id) {
          getProject(dialogData.order_id).then((res) => {
            getOffer({ order_id: dialogData.order_id, manager_id: res.data?.manager_id })
          })
        }
        break
      case CHAT_TYPE_TEAM:
        setDialogID(chatID)
        if (dialogData?.manager_team_id) getTeamInfo(dialogData.manager_team_id)
        break
    }
  }, [chatID, dialogData, getUser, user.id])

  // назначаем dialogID, если юзер есть в списке диалогов. Либо отправляем запрос на создание чата
  useEffect(() => {
    if (!dialogsList) return
    if (!orderID && !personID && !teamID) return
    let tempDialogID = null
    dialogsList?.map((dialog) => {
      if (chatType !== dialog.type) return
      switch (chatType) {
        case CHAT_TYPE_PRIVATE:
          if (!dialog.order_id && dialog?.users?.some((user) => user.id === personID)) tempDialogID = dialog.id
          break
        case CHAT_TYPE_MANAGER_EXPERT:
          if (orderID && dialog.order_id === orderID && dialog?.users?.some((user) => user.id === personID)) {
            tempDialogID = dialog.id
          }
          break
        case CHAT_TYPE_CUSTOMER_MANAGER:
          if (orderID && dialog.order_id === orderID && dialog?.users?.some((user) => user.id === personID)) {
            tempDialogID = dialog.id
          }
          break
        case CHAT_TYPE_WORK:
          if (orderID && dialog.order_id === orderID) tempDialogID = dialog.id
          break
        case CHAT_TYPE_TEAM:
          if (teamID && dialog.manager_team_id === teamID) tempDialogID = dialog.id
          break
      }
    })
    // если нет чата, оправляем запрос на создание
    if (!tempDialogID) {
      // console.log("создаём чат", chatType)
      switch (chatType) {
        case CHAT_TYPE_PRIVATE:
          createChat({ target_id: personID, type: chatType })
          break
        case CHAT_TYPE_WORK:
          if (orderID) createWorkChat({ order_id: orderID })
          break
        case CHAT_TYPE_CUSTOMER_MANAGER:
          createChat({ target_id: personID, order_id: orderID, type: chatType })
          break
        case CHAT_TYPE_MANAGER_EXPERT:
          createChat({ target_id: personID, order_id: orderID, type: chatType })
          break
        case CHAT_TYPE_TEAM:
          if (teamID) createTeamChat({ team_id: teamID })
          break
      }
      return
    }
    setDialogID(tempDialogID)
  }, [createChat, dialogsList, personID, teamID, orderID])

  // устанавливаем dialogID от id только что созданного чата
  useEffect(() => {
    const chatID = resultCreateChat?.id || resultCreateWorkChat?.id || resultCreateTeamChat?.id || null
    if (!chatID) return
    subscribeHandler(chatID)
  }, [resultCreateChat, resultCreateWorkChat, resultCreateTeamChat])

  // привязываем к сокету, если есть dialogID
  useEffect(() => {
    if (!dialogID) return
    // console.log("%c chatType", "font-size: 16px; font-weight: 700; color: red;", chatType, dialogData?.type)
    socket.on(`private-dialog.${dialogID}:chat.message`, messageHandler)
    return () => {
      socket.off(`private-dialog.${dialogID}:chat.message`, messageHandler)
    }
  }, [dialogID])

  // получаем сообщения, если есть dialogID
  useEffect(() => {
    if (!dialogID) return
    subscribeHandler(dialogID)
    getMessages({ dialog_id: dialogID, offset: offset }).then((res) => {
      if (res?.data?.length) setMessagesState(res.data)
      setNeedLoading(false)
      // setOffsetLoading(true)
    })
    getMessagesCount({ dialog_id: dialogID })
  }, [dialogID])

  useEffect(() => {
    if (!dialogID) return
    getMessages({ dialog_id: dialogID, offset: offset }).then((res) => {
      if (res?.data?.length > 0) {
        setMessagesState((prev) => {
          const oldIDs = [...new Set(prev.map((object) => object.id))]
          return [...prev, ...res.data.filter((mes) => !oldIDs.includes(mes.id))]
        })

        // const m = document.querySelector(`#${modalName} .modal__main-inner`)
        const m = document.querySelector(`#modal-chat-${dialogID} .modal__main-inner`)
        const oldHeight = m?.scrollHeight
        const oldScroll = m?.scrollTop
        setTimeout(() => {
          // const m1 = document.querySelector(`#${modalName} .modal__main-inner`)
          const m1 = document.querySelector(`#modal-chat-${dialogID} .modal__main-inner`)
          m?.scrollTo(0, m1.scrollHeight - oldHeight - oldScroll)
        }, 0)
      }
    })
  }, [offset])

  const scrollBottom = () => {
    // const m = document.querySelector(`#${modalName} .modal__main-inner`)
    const m = document.querySelector(`#modal-chat-${dialogID} .modal__main-inner`)
    setTimeout(() => {
      m?.scrollTo(0, m.scrollHeight)
    }, 0)
    setTimeout(() => {
      setOffsetLoading(true)
    }, 160)
  }
  const closeModal = () => {
    onClose()
  }
  const subscribeHandler = (id) => {
    socket.emit("subscribe", `private-dialog.${id}`, (response) => {
      // console.log("subscribe response?.success: ", response?.success)
      if (!response?.success) return
      if (!dialogID) setDialogID(id)
    })
  }

  // получение сообщений из сокета
  const messageHandler = (data) => {
    const entity = data.message as IChatMessageData
    const dataUser = data?.user
    const mesToAdd = {
      ...entity,
      user: dataUser,
    }
    setOffsetLoading(false)
    setMessagesState((prev) => {
      return [mesToAdd, ...prev]
    })
    // dispatch(
    //   chatApi.util.updateQueryData("getMessages", args, (draft) => {
    //     if (draft.find((mes) => mes.id === entity.id)) return
    //     if (dataUser) {
    //       draft.unshift({ ...entity, user: dataUser })
    //     } else {
    //       draft.unshift(entity)
    //     }
    //   })
    // )
  }

  // отправка сообщения
  const sendHandler = (val: string, files: File[]) => {
    if (!val && !files) return
    if (!dialogID) return
    const formData = new FormData()
    files.length && files.forEach((file: string | File) => formData.append("files[]", file))
    formData.append("dialog_id", String(dialogID))
    formData.append("text", val)
    formData.append("socket", socket.id)
    // const sendData = { dialog_id: dialogID, text: val, files: [files[0]], socket: socket.id }
    sendMessage({ formData: formData, socket: socket.id }).then((res) => {
      setOffsetLoading(false)
      const resData = res["data"] as ISendMesData
      const mesToAdd = {
        // ...formData,
        dialog_id: dialogID,
        text: val,
        socket: socket.id,
        id: resData?.message_id,
        user: user,
        // created_at: String(new Date().toISOString()),
        created_at: resData.message.created_at,
        files: resData.message?.files,
      }
      setMessagesState((prev) => {
        return [mesToAdd, ...prev]
      })
      scrollBottom()
      // dispatch(
      //   chatApi.util.updateQueryData("getMessages", { dialog_id: dialogID, offset: offset }, (draft) => {
      //     draft.unshift({
      //       ...sendData,
      //       created_at: String(new Date().toISOString()),
      //       id: resData?.message_id,
      //       user: user,
      //     })
      //   })
      // )
    })
  }

  const messagesList = useMemo(() => {
    if (!messagesState.length) return null
    const groups = messagesState.reduce((groups, mes) => {
      if (!mes?.created_at || !moment(mes.created_at)) return
      const date = moment(mes.created_at).isSame(new Date(), "day") ? "Today" : moment(mes.created_at).format("DD MMMM")

      if (!groups[date]) groups[date] = []
      groups[date].push(mes)
      return groups
    }, {})
    const groupArrays = Object.keys(groups)
      .map((date) => {
        return {
          date,
          message: groups[date],
        }
      })
      ?.reverse()
    return groupArrays?.map((group, index) => {
      const groupList = group?.message
        ?.map((mes) => {
          return (
            <ChatMessage
              {...mes}
              key={mes.id}
              showUserInfo={
                [CHAT_TYPE_WORK, CHAT_TYPE_TEAM].includes(chatType) ||
                [CHAT_TYPE_WORK, CHAT_TYPE_TEAM].includes(dialogData?.type)
              }
            />
          )
        })
        ?.reverse()

      return (
        <div key={index}>
          <p className={styles.modal__date}>{group.date}</p>
          {groupList}
        </div>
      )
    })
  }, [chatType, dialogData?.type, messagesState])

  const positionTxt = useMemo(() => {
    switch (chatType || dialogData?.type) {
      case CHAT_TYPE_PRIVATE:
        return userData?.type === USER_TYPE_CUSTOMER
          ? "Client"
          : userData?.type === USER_TYPE_PM
          ? "Project manager"
          : userData?.type === USER_TYPE_EXPERT
          ? "Expert"
          : undefined
      case CHAT_TYPE_CUSTOMER_MANAGER:
      case CHAT_TYPE_MANAGER_EXPERT:
        return "2 members"
      case CHAT_TYPE_WORK:
        if (!offerData?.id) return undefined
        const uniqueIDs = []
        const teammatesLength = (offerData.team as any).filter((teammate) => {
          if (!teammate?.user?.id) return false
          if (uniqueIDs.includes(teammate.user.id)) return false
          uniqueIDs.push(teammate.user.id)
          return teammate.user.id
        })?.length
        const outerLength = offerData.manager_id ? teammatesLength + 1 : teammatesLength
        if (!outerLength) return undefined
        return outerLength + " members"
      case CHAT_TYPE_TEAM:
        if (dialogData?.type) return teamInfo?.member_count ? `${teamInfo.member_count + 1} members` : undefined
        return teamID && teamInfo?.member_count ? `${teamInfo.member_count + 1} members` : undefined
      default:
        return undefined
    }
  }, [
    chatType,
    messagesState,
    projectData?.id,
    teamID,
    teamInfo?.member_count,
    user.id,
    userData?.type,
    offerData?.id,
    dialogData,
  ])

  useEffect(() => {
    if (isFetchingUser || isFetchingMessages || isUninitialized) return
    if (!isNeedLoading) return
    scrollBottom()
  }, [isFetchingUser, isFetchingMessages, isUninitialized])

  const orderData = useMemo(() => {
    if (!projectData) return null
    return {
      ...projectData,
      cover: projectData?.cover?.includes("http") ? projectData.cover : BACKEND_HOST + projectData?.cover,
    }
  }, [projectData])

  const [isIntersectionTopView, setIsIntersectionTopView] = useState<boolean>(false)

  useEffect(() => {
    if (!isOffsetLoading) return
    if (offset + CHAT_OFFSET_MESSAGES >= messagesCount) return
    if (!isIntersectionTopView) return
    // console.log("Search")
    setOffset((prev) => prev + CHAT_OFFSET_MESSAGES)
  }, [isIntersectionTopView])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={`modal-chat-${dialogID}`}
      closeOutside={closeOutside}
      isLoading={
        isNeedLoading &&
        (isFetchingUser ||
          isFetchingTeamInfo ||
          isFetchingProject ||
          isFetchingOffer ||
          isFetchingMessages ||
          isUninitialized)
      }
      header={
        <DetailedPopupHeader
          onClose={closeModal}
          name={orderData?.name || teamInfo?.name || userData?.name}
          surname={teamID || orderData?.id ? undefined : userData?.surname}
          img={orderData?.cover || (teamInfo?.avatar && `${BACKEND_HOST}/${teamInfo?.avatar}`) || userData?.avatar}
          headerUserClickable={false}
          id={teamID || orderData?.id ? undefined : userData?.id}
          position={positionTxt}
          videoBtn
        />
      }
      footer={<ChatFooter onSubmit={sendHandler} isLoading={isLoadingSendMessage} />}
      addClass={`modal-chat ${styles.modal}`}
    >
      {messagesList && messagesList?.length > 0 && (
        <div className={styles["modal__main-wrap"]}>
          {isOffsetLoading && (
            <ChatObs modalName={`modal-chat-${dialogID}`} setIsIntersectionTopView={setIsIntersectionTopView} />
          )}
          {messagesList}
        </div>
      )}
    </Modal>
  )
}

export default ModalChat
