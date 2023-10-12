import styles from "./DisplayTags.module.scss"
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import ToggleBtn from "components/ui/btns/ToggleBtn/ToggleBtn"
import TagItem from "components/ui/TagItem/TagItem"

interface IDisplayTagsProps {
  visibleHeight?: number
  className?: string
  tagsList: any
  setTagList?: Dispatch<SetStateAction<any>>
  onClose?: (id: number) => void
}

const DisplayTags: React.FC<IDisplayTagsProps> = ({ visibleHeight = 50, className, tagsList, setTagList, onClose }) => {
  const tagsRef = useRef()
  const [tags, setTags] = useState([])
  const [isToggleBtnVisible, setToggleBtnVisible] = useState(false)
  const [isToggleBtnActive, setToggleBtnActive] = useState(false)

  const handleVisible = () => {
    if (!tagsRef?.current) return
    const tagRefCurrent = tagsRef.current as HTMLElement
    setToggleBtnVisible(tagRefCurrent.offsetHeight > visibleHeight)
    if (tagRefCurrent.offsetHeight < visibleHeight) setToggleBtnActive(false)
  }

  useEffect(() => {
    setTags(tagsList)
  }, [tagsList])

  useEffect(() => {
    handleVisible()
  }, [handleVisible, tags, visibleHeight])

  useEffect(() => {
    window.addEventListener("resize", handleVisible)
    return () => {
      window.removeEventListener("resize", handleVisible)
    }
  })

  const blockClasses = [
    styles.block,
    "display-tags",
    className ? className : "",
    isToggleBtnActive ? styles["block--shown-all"] : "",
  ].join(" ")

  const list = tagsList?.map((tag) => {
    return (
      <TagItem
        key={tag.id}
        id={tag.id}
        txt={tag.name}
        mod={"gray"}
        addClass={styles.block__tag}
        onClose={(id) => {
          if (onClose) {
            onClose(id)
            return
          }
          setTagList((prev) => prev.filter((tagItem) => tagItem.id !== tag.id))
        }}
      />
    )
  })

  if (!list.length) return null

  return (
    <div className={blockClasses}>
      <div ref={tagsRef} className={styles.block__list}>
        {list}
      </div>
      {isToggleBtnVisible && (
        <ToggleBtn
          txt={`${isToggleBtnActive ? "Hide" : "Show all"}`}
          isActive={isToggleBtnActive}
          addClass={styles["block__toggle-btn"]}
          onClick={() => {
            setToggleBtnActive(!isToggleBtnActive)
          }}
        />
      )}
    </div>
  )
}

export default DisplayTags
