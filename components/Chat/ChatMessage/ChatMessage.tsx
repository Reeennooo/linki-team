import styles from "./ChatMessage.module.scss"
import React, { useMemo } from "react"
import { IChatMessageData } from "types/chat"
import { useAuth } from "hooks/useAuth"
import moment from "moment"
import IconUser from "public/assets/svg/user.svg"
import { BACKEND_HOST, BLUR_IMAGE_DATA_URL } from "utils/constants"
import Image from "next/image"
import ChatMessageFile from "components/Chat/ChatMessageFile/ChatMessageFile"

interface IPropsChatMessage extends IChatMessageData {
  showUserInfo?: boolean
}

const ChatMessage: React.FC<IPropsChatMessage> = ({
  text,
  id,
  dialog_id,
  links,
  files,
  user,
  created_at,
  showUserInfo,
}) => {
  const {
    user: { id: userID },
  } = useAuth()

  const mesClasses = ["message", styles.message, user?.id === userID ? styles["message--self"] : ""].join(" ")
  const time = useMemo(() => {
    if (!created_at) return null
    return moment(created_at).format("HH:mm")
  }, [created_at])

  const fileContent = useMemo(() => {
    if (!files || !files.length) return ""
    return files.map((file) => <ChatMessageFile key={file.id} {...file} messageID={id} />)
  }, [files])
  function replaceURLs(message: string) {
    if (!message) return
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
    return message.replace(urlRegex, function (url) {
      let hyperlink = url
      if (!hyperlink.match("^https?://")) {
        hyperlink = "http://" + hyperlink
      }
      return '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + "</a>"
    })
  }
  const textContent = useMemo(() => {
    if (!text) return null
    return replaceURLs(text)
  }, [text])

  return (
    <div className={mesClasses}>
      {user?.id !== userID && showUserInfo && (
        <div className={`${styles.message__avatar} ${!user?.main_image?.path ? styles["message__avatar--empty"] : ""}`}>
          {user?.main_image?.path ? (
            <Image
              src={
                user?.main_image?.path.includes("http")
                  ? user?.main_image?.path
                  : `${BACKEND_HOST}${user?.main_image?.path}`
              }
              alt="avatar"
              layout={"fill"}
              quality={75}
              objectFit={"cover"}
              objectPosition={"center"}
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_DATA_URL}
            />
          ) : (
            <IconUser />
          )}
        </div>
      )}
      <div className={styles.message__inner}>
        {user && user?.id !== userID && showUserInfo && (
          <p className={styles.message__name}>
            {user.name} {user.surname}
          </p>
        )}
        <div>
          <span
            className={styles.message__txt}
            dangerouslySetInnerHTML={{
              __html: `${textContent}`,
            }}
          />{" "}
          {fileContent} <span className={styles.message__time}>{time ?? ""}</span>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
