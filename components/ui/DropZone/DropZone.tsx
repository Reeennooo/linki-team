import styles from "./DropZone.module.scss"
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import IconDwl from "public/icons/dwl-icon.svg"
import DefaultBtn from "../btns/DefaultBtn/DefaultBtn"
import TagItem from "components/ui/TagItem/TagItem"
import IconClose from "public/assets/svg/close.svg"
import { useAppDispatch, useAppSelector } from "hooks"
import { seletCurrentTeam, updateCurrentTeam } from "redux/slices/currentTeam"
import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import { formatBytes } from "utils/formatBytes"

interface Props {
  onUpload(arg0: File[]): void
  addClass?: string
  maxFiles?: number
  acceptTypes?:
    | {
        [name: string]: string[]
      }
    | false
  multiple?: boolean
  maxNameLength?: number
  maxSize?: number
  tags?: boolean
  isPreview?: boolean
  initialCover?: string
  description?: string
  title?: string
  btnTxt?: string
  additionalBtn?: boolean
  outerTags?: boolean
  isRemoveAllFiles?: boolean
  setRemoveAllFiles?: Dispatch<SetStateAction<boolean>>
}

const DropZone: React.FC<Props> = ({
  addClass,
  onUpload,
  maxFiles = 10,
  acceptTypes = {
    "image/*": [".png", ".gif", ".jpeg", ".jpg", ".pdf"],
  },
  multiple = true,
  maxNameLength,
  maxSize = 10485760,
  tags = true,
  isPreview = false,
  initialCover,
  description,
  title = "Drop files here or",
  btnTxt = "Choose files",
  additionalBtn,
  outerTags,
  isRemoveAllFiles,
  setRemoveAllFiles,
}) => {
  const [myFiles, setMyFiles] = useState([])
  const dispatch = useAppDispatch()
  const currentteamState = useAppSelector(seletCurrentTeam)

  function nameLengthValidator(file) {
    if (maxNameLength && file.name.length > maxNameLength) {
      return {
        code: "name-too-large",
        message: `Name is larger than ${maxNameLength} characters`,
      }
    }
    if (file.size > maxSize) {
      return {
        code: "file-too-large",
        message: `Select a file no larger than ${formatBytes(maxSize)}`,
      }
    }

    return null
  }

  const onDrop = useCallback(
    (acceptedFiles) => {
      const filesPath = acceptedFiles.map((i) => {
        return i.path
      })
      let isSame = false
      myFiles.map((itemFile) => {
        if (filesPath.includes(itemFile.path)) isSame = true
      })
      if (isSame) return
      if (acceptedFiles.length + myFiles.length > maxFiles) return
      if (multiple) {
        setMyFiles([...myFiles, ...acceptedFiles])
        onUpload([...myFiles, ...acceptedFiles])
      } else {
        if (acceptedFiles?.length > 0) {
          const reader = new FileReader()
          reader.readAsDataURL(acceptedFiles[0])
          setMyFiles([...acceptedFiles])
          onUpload([...acceptedFiles])
        }
      }
    },
    [myFiles]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections, open } = useDropzone({
    accept: acceptTypes ? acceptTypes : undefined,
    maxFiles: maxFiles,
    multiple: multiple,
    // disabled: myFiles.length >= maxFiles,
    validator: nameLengthValidator,
    onDrop,
  })

  const removeFile = (file) => {
    const newFiles = [...myFiles]
    newFiles.splice(newFiles.indexOf(file), 1)
    setMyFiles(newFiles)
    onUpload(newFiles)
  }

  const removeAll = () => {
    setMyFiles([])
    onUpload([])
  }

  useEffect(() => {
    if (!isRemoveAllFiles) return
    removeAll()
    if (setRemoveAllFiles) setRemoveAllFiles(false)
  }, [isRemoveAllFiles, removeAll, setRemoveAllFiles])

  const files = myFiles.map((file) => (
    <TagItem
      key={file.path}
      id={file.path}
      txt={file.path}
      addClass={styles["drop-zone__file"]}
      onClose={() => {
        removeFile(file)
      }}
      addInfo={
        file.size / 1048576 < 0.1 ? (file.size / 1024).toFixed(1) + " KB" : (file.size / 1048576).toFixed(1) + " MB"
      }
    />
  ))

  return (
    <>
      <section className={`drop-zone ${styles["drop-zone"]}`}>
        <div
          className={`drop-zone__main ${styles["drop-zone__main"]} ${addClass ? addClass : ""} ${
            isDragActive ? styles["is-active"] : ""
          }
        ${isPreview && currentteamState.cover ? styles["is-preview"] : ""} 
        ${myFiles.length >= maxFiles ? styles["drop-zone__main--disabled"] : ""}`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className={`${styles["drop-zone__icon"]} `}>
            <IconDwl />
          </div>
          <p className={`${styles["drop-zone__txt"]} `}>{title}</p>
          <DefaultBtn addClass={`${styles["drop-zone__btn"]}`} txt={btnTxt} mod={"transparent"} />
          <p className={`${styles["drop-zone__deskr"]} `}>
            {description ? description : "PNG, JPG, PDF files up to 10 MB in size are available for uploading"}
          </p>
          {isPreview && currentteamState.cover && (
            <div className={`${styles["drop-zone__preview"]}`}>
              <img src={currentteamState.cover ? currentteamState.cover : null} alt="" />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeAll()
                  dispatch(updateCurrentTeam({ field: "cover", data: "" }))
                }}
              >
                <IconClose />
              </button>
            </div>
          )}
        </div>
        <div>
          {fileRejections?.length > 0 &&
            fileRejections.map((file, i) => {
              if (i === 0)
                return (
                  <p className={`drop-zone__error ${styles["drop-zone__error"]}`} key={i}>
                    {file?.errors?.length > 0 && file.errors[0].message}
                  </p>
                )
            })}
        </div>
        {tags && !outerTags && files.length > 0 && <div className={styles["drop-zone__list"]}>{files}</div>}
      </section>
      {additionalBtn && <IconBtn icon={"paperclip"} onClick={open} width={16} height={18} addClass={"drop-zone-btn"} />}
      {outerTags && files.length > 0 && <div className={`drop-zone__list ${styles["drop-zone__list"]}`}>{files}</div>}
    </>
  )
}

export default DropZone
