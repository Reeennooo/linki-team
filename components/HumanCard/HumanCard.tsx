import styles from "./HumanCard.module.scss"
import DefaultBtn from "../ui/btns/DefaultBtn/DefaultBtn"
import React, { useEffect, useState } from "react"
import IconArchive from "public/assets/svg/archive-box-sm.svg"
import IconArchiveTray from "public/assets/svg/archive-tray.svg"
import IconUser from "public/assets/svg/user.svg"
import { IHumanCardData } from "types/content"
import { numberFormat } from "utils/formatters"
import ReactTooltip from "react-tooltip"
import { BLUR_IMAGE_DATA_URL } from "utils/constants"
import Image from "next/image"
import ModalChat from "components/Modals/ModalChat/ModalChat"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import { useAppDispatch, useAppSelector } from "hooks"
import { ChatTypeList, IChatDialogsListData } from "types/chat"
import StatusBar from "components/ui/StatusBar/StatusBar"
import IconStar from "public/assets/svg/star.svg"
import { ratingConverter } from "utils/ratingConverter"

// - - - messages
// import { INotificationsData } from "types/user"
// import { useLazyGetNotificationsQuery, useSetNotificationsReadMutation } from "redux/api/notifications"
// import { NOTIFICATION_TYPE_CHAT } from "utils/constants"
// import { useGetDialogsListMutation, useLazyGetDialogQuery } from "redux/api/chat"

interface Props {
  data: IHumanCardData
  price?: number
  headerBtn?: string
  headerBtnClick?: () => void
  btnChat?: boolean
  chatType?: ChatTypeList
  onClickBtnChat?: () => void
  btnOffer?: boolean
  btnSuccess?: string
  onSuccessClick?: () => void
  btnSuccessDisabled?: boolean
  isActive?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onClickBtnOffer?: () => void
  orderID?: number
  wait?: string
}

const HumanCard: React.FC<Props> = ({
  data,
  price,
  btnChat,
  chatType,
  btnOffer,
  headerBtn,
  btnSuccess,
  onSuccessClick,
  btnSuccessDisabled,
  headerBtnClick,
  isActive,
  onClick,
  onClickBtnOffer,
  onClickBtnChat,
  orderID,
  wait,
}) => {
  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const [isChatOpen, setChatOpen] = useState<boolean>(false)

  // // Получаю все уведомления о сообщениях из чатов
  // const [getNotifications, { data: notificationData }] = useLazyGetNotificationsQuery()
  // const [setNotificationsRead] = useSetNotificationsReadMutation()
  // const [getDialogsList, { data: dialogsList }] = useGetDialogsListMutation()
  // const [newMessageId, setNewMessageId] = useState([])
  // const [messages, setMessages] = useState([])

  // // Поиск совпадений между ID чата, и сообщениями которые пришли
  // function compareID(arr1, arr2, newArr) {
  //   arr1?.forEach(item => {
  //     arr2?.forEach(item2 => {
  //       if(item.dialog_id === item2.id) newArr.push(item)
  //     });
  //   });
  // }

  // useEffect(() => {
  //   getNotifications(undefined, true)
  // }, [getNotifications])

  // useEffect(() => {

  //   // Все сообщения которые пришли
  //   let currentMessages = [];
  //   let newMessage = notificationData?.filter((notification) => (notification.type === NOTIFICATION_TYPE_CHAT && notification.status === false))
  //   const currentChats = dialogsList?.filter(chat => chat.order_id === orderID)
  //   getDialogsList()
  //   compareID(newMessage, currentChats, currentMessages)
  //   setMessages(currentMessages)
  //   // Получаем ID, чтобы прочитать сообщения при открытии чата.
  //   setNewMessageId(currentMessages?.map((notification) => notification.id))

  // }, [notificationData, orderID])

  // useEffect(() => {
  //   if(isChatOpen && newMessageId.length) {
  //     setNotificationsRead(newMessageId)
  //   }
  // }, [isChatOpen])

  return (
    <>
      <div
        className={`human-card ${styles.card} ${isActive ? styles["card--is-active"] : ""}`}
        onClick={(e) => {
          const isButton = (e.target as HTMLElement).closest<HTMLElement>("button") as HTMLButtonElement
          const isLink = (e.target as HTMLElement).closest<HTMLElement>("a") as HTMLLinkElement
          if (isButton) {
            e.preventDefault()
            return
          }
          if (!isLink && onClick) onClick(e)
        }}
      >
        <div className={`${styles.card__main} ${data.avatar ? styles["card__main--img"] : ""}`}>
          <div className={styles.card__avatar}>
            {data.avatar ? (
              <Image
                src={data.avatar}
                alt="avatar"
                layout={"fill"}
                quality={75}
                objectFit={"cover"}
                objectPosition={"center"}
                placeholder="blur"
                blurDataURL={BLUR_IMAGE_DATA_URL}
              />
            ) : (
              <span className={styles["card__no-avatar"]}>
                <IconUser />
              </span>
            )}
          </div>
          <div className={styles.card__content}>
            <h3 className={styles.card__name}>
              {data.name} {data?.surname && data.surname[0].toUpperCase() + "."}
              {headerBtn && (
                <button
                  className={styles["card__header-btn"]}
                  data-for="global-tooltip"
                  data-tip={
                    headerBtn === "Incoming" || headerBtn === "Under consideration"
                      ? "Add to archive"
                      : "Add to inbound"
                  }
                  data-place={"top"}
                  onClick={() => {
                    if (headerBtnClick) headerBtnClick()
                  }}
                >
                  {headerBtn === "Incoming" || headerBtn === "Under consideration" ? (
                    <IconArchive />
                  ) : headerBtn === "Archive" ? (
                    <IconArchiveTray />
                  ) : (
                    ""
                  )}
                </button>
              )}
            </h3>
            {data?.position && (
              <p
                className={`human-card__txt ${styles.card__txt}`}
                dangerouslySetInnerHTML={{ __html: `${data.position}` }}
              />
            )}
            <div
              className={`
              ${styles["card__rating"]} 
              ${data.rating > 0 ? styles["card__rating-active"] : ""}`}
            >
              <IconStar />
              <span>{ratingConverter(data.rating)}</span>
            </div>
            {/* <Rating rating={data.rating} disabled={true} /> */}
            {price && (
              <>
                <p className={`human-card__price ${styles.card__price}`}>
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.24219 1V1.91572C2.64578 2.20761 0.778117 3.9361 0.778117 6.35999C0.778117 8.39999 2.09812 9.76799 4.61812 10.92L6.32212 11.688C7.78612 12.36 8.33812 12.744 8.33812 13.656C8.33812 14.736 7.49812 15.408 6.08212 15.408C4.47412 15.408 3.34612 14.448 2.69812 13.776C2.45812 13.56 2.14612 13.464 1.85812 13.464C1.09012 13.464 0.394117 14.04 0.370117 14.904C0.370117 15.36 0.586117 15.768 0.970117 16.152C1.97214 17.2563 3.61886 18.0295 5.24219 18.2341V19C5.24219 19.5523 5.6899 20 6.24219 20C6.79447 20 7.24219 19.5523 7.24219 19V18.202C9.81277 17.8093 11.6261 16.0939 11.6261 13.536C11.6261 11.376 10.3541 10.08 7.71412 8.90399L5.91412 8.11199C4.49812 7.46399 4.06612 7.08 4.06612 6.28799C4.06612 5.30399 4.88212 4.75199 6.03412 4.75199C7.16212 4.75199 7.88212 5.30399 8.53012 5.88C8.81812 6.11999 9.13012 6.21599 9.41812 6.21599C10.1621 6.21599 10.9061 5.59199 10.9061 4.776C10.9061 4.46399 10.8101 4.10399 10.4741 3.74399C9.92519 3.11665 8.89585 2.26511 7.24219 1.97424V1C7.24219 0.447715 6.79447 0 6.24219 0C5.6899 0 5.24219 0.447715 5.24219 1Z"
                    />
                  </svg>
                  {numberFormat(price)}
                </p>
                <p className={`human-card__price-note ${styles["card__price-note"]}`}>Preliminary estimate</p>
              </>
            )}
          </div>
        </div>
        <div
          className={`human-card__footer ${styles.card__footer} ${
            btnChat && data.price ? styles["card__footer--two-btns"] : ""
          }`}
        >
          {btnChat && (
            <DefaultBtn
              // txt={`${messages.length > 0 ? `Chat (${messages.length})` : "Chat"}`}
              txt={"Chat"}
              mod={"transparent-grey"}
              addClass={styles["card__btn-chat"]}
              icon={"chat"}
              size={"md"}
              // href={data.telegram_link || "https://telegram.org/"}
              // disabled={data.telegram_link ? undefined : true}
              // isTargetBlank
              minWidth={false}
              onClick={() => {
                if (onClickBtnChat) onClickBtnChat()
                setChatOpen((prev) => !prev)
                if (modalsList.includes("modal-chat")) {
                  dispatch(closeModal("modal-chat"))
                } else {
                  dispatch(openModal("modal-chat"))
                }
              }}
            />
          )}
          {btnOffer && (
            <DefaultBtn
              txt={"View offer"}
              addClass={styles["card__btn-offer"]}
              size={"md"}
              minWidth={false}
              onClick={() => {
                if (onClickBtnOffer) onClickBtnOffer()
              }}
            />
          )}
          {btnSuccess && (
            <DefaultBtn
              txt={btnSuccess}
              disabled={btnSuccessDisabled}
              addClass={styles["card__btn-start"]}
              size={"md"}
              minWidth={false}
              mod={"success"}
              onClick={() => {
                if (onSuccessClick) onSuccessClick()
              }}
            />
          )}
        </div>
        {wait && <StatusBar txt={wait} className={styles.card__wait} />}
      </div>
      {isChatOpen && (
        <ModalChat
          isOpen={modalsList.includes("modal-chat")}
          onClose={() => {
            dispatch(closeModal("modal-chat"))
            setTimeout(() => {
              setChatOpen(false)
            }, 200)
          }}
          closeOutside={(target) => {
            return target.closest(".project-card__btn-chat") === null
          }}
          // stateDialogID={[dialogID, setDialoggID]}
          personID={data.id}
          modalName={`modal-chat-${data.id}`}
          chatType={chatType}
          orderID={orderID}
        />
      )}
    </>
  )
}

export default HumanCard
