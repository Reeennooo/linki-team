import styles from "./ChatMessageFile.module.scss"
import React from "react"
import IconFile from "/public/assets/svg/file-md.svg"
import { formatBytes } from "utils/formatBytes"
import { useAuth } from "hooks/useAuth"
import { BACKEND_API_URL } from "utils/constants"

interface Props {
  id: number
  messageID: number
  size?: number
  path: string
  description: string
}

const ChatMessageFile: React.FC<Props> = ({ id, messageID, size, path, description }) => {
  const { token } = useAuth()

  if (!description) return null
  const clickHandler = async (urlPath: string) => {
    await fetch(urlPath, {
      // mode: "no-cors",
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) return
        return res.blob()
      })
      .then((blob: Blob | undefined) => {
        if (!blob) return
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = description
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      })
  }

  return (
    <a
      href={`${BACKEND_API_URL}message/${messageID}/file/${id}`}
      download
      className={styles.mes}
      target={"_blank"}
      onClick={(e) => {
        e.preventDefault()
        clickHandler(`${BACKEND_API_URL}message/${messageID}/file/${id}`)
      }}
      rel="noreferrer"
    >
      <IconFile />
      <div>
        <p className={styles.mes__name}>{description}</p>
        {size && <p className={styles.mes__size}>{formatBytes(size, 1)}</p>}
      </div>
    </a>
  )
}

export default ChatMessageFile
