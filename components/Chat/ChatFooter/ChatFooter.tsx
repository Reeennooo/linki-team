import styles from "./ChatFooter.module.scss"
import React, { ChangeEvent, KeyboardEventHandler, useRef, useState } from "react"
import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import { useDropzone } from "react-dropzone"
import DropZone from "components/ui/DropZone/DropZone"
import TagItem from "components/ui/TagItem/TagItem"
import { useAuth } from "hooks/useAuth"

interface IChatFooterProps {
  placeholder?: string
  onSubmit: (value: string, files?: File[] | null) => void
  isLoading?: boolean
}

const MAX_INPUT_HEIGHT = 80 // 256
const TRANSITION_DURATION_FACTOR = 50

const ChatFooter: React.FC<IChatFooterProps> = ({ placeholder = "Message...", onSubmit, isLoading }) => {
  const inputRef = useRef<HTMLDivElement>(null)
  const cloneRef = useRef<HTMLDivElement>(null)

  const [inputValue, setInputValue] = useState<string | "">("")
  const [inputFile, setInputFile] = useState<File[]>([])
  const [isRemoveAllFiles, setRemoveAllFiles] = useState<boolean>(false)
  const submitHandler = () => {
    if (!inputValue) return
    const input = inputRef.current
    onSubmit(inputValue, inputFile || null)
    setInputValue("")
    if (input) {
      input.innerHTML = ""
      input.style.height = ""
    }
    setRemoveAllFiles(true)
  }

  function updateInputHeight(willSend = false) {
    const input = inputRef.current!
    const clone = cloneRef.current!
    const currentHeight = Number(input.style.height.replace("px", ""))
    const newHeight = Math.min(clone.scrollHeight, MAX_INPUT_HEIGHT)
    if (newHeight === currentHeight) {
      return
    }

    const transitionDuration = Math.round(TRANSITION_DURATION_FACTOR * Math.log(Math.abs(newHeight - currentHeight)))

    const exec = () => {
      input.style.height = `${newHeight}px`
      input.style.transitionDuration = `${transitionDuration}ms`
      input.classList.toggle("overflown", clone.scrollHeight > MAX_INPUT_HEIGHT)
    }

    if (willSend) {
      // Sync with sending animation
      requestAnimationFrame(exec)
    } else {
      exec()
    }
  }

  function handleChange(e: ChangeEvent<HTMLDivElement>) {
    const { innerHTML, textContent } = e.currentTarget
    if (cloneRef?.current) cloneRef.current.innerHTML = innerHTML
    setInputValue(textContent ? innerHTML : "")
    if (inputRef?.current && innerHTML.trim() === "<br>") inputRef.current.innerHTML = ""
    updateInputHeight()
  }
  function handleKeyDown(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      // если Enter и не нажата shift
      e.preventDefault()
      submitHandler()
    }
  }

  return (
    <div className={styles.footer}>
      <div className={styles.footer__wrap}>
        <DropZone
          onUpload={(files) => {
            setInputFile(files)
          }}
          acceptTypes={false}
          additionalBtn={true}
          outerTags={true}
          isRemoveAllFiles={isRemoveAllFiles}
          setRemoveAllFiles={setRemoveAllFiles}
        />
        <div className={styles["footer__input-wrap"]}>
          <div
            ref={inputRef}
            onInput={handleChange}
            onKeyDown={handleKeyDown}
            contentEditable={true}
            placeholder={placeholder}
            aria-label={placeholder}
            className={styles.footer__input}
          />
          <div ref={cloneRef} className={styles.footer__clone} dir="auto" />
        </div>
        <IconBtn
          icon={"paper-plane-right"}
          onClick={submitHandler}
          width={20}
          height={23}
          addClass={styles["footer__submit-btn"]}
          disabled={isLoading ? true : undefined}
        />
      </div>
    </div>
  )
}

export default ChatFooter
