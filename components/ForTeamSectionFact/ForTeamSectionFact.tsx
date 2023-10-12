import { useEffect, useRef, useState } from "react"
import styles from "./ForTeamSectionFact.module.scss"
import IconArrow from "public/assets/svg/CaretCircle.svg"
interface Props {
  addClass?: string
  title: string
  text: string
  openBlock?: boolean
}

const ForTeamSectionFact: React.FC<Props> = ({ addClass, title, text, openBlock }) => {
  const tagsRef = useRef(null)
  const [tagsWrapHeight, setTagsWrapHeight] = useState<string>("auto")
  const [open, setOPen] = useState(openBlock)

  useEffect(() => {
    setTagsWrapHeight(open ? getHeight() + "px" : "0")
  }, [open, tagsWrapHeight])

  const getHeight = () => {
    const innerElement = tagsRef.current as HTMLElement
    return innerElement.offsetHeight
  }
  return (
    <div className={`${styles["forteam__mobile-fact"]} ${open ? styles["is-active"] : ""}`}>
      <div
        className={styles["forteam__mobile-fact-title"]}
        onClick={() => {
          setOPen(!open)
        }}
      >
        {title}
        <IconArrow />
      </div>
      <div className={styles["forteam__mobile-text-wrapper"]} style={{ height: tagsWrapHeight }}>
        <div className={styles["forteam__mobile-fact-text"]} ref={tagsRef}>
          <p>{text}</p>
        </div>
      </div>
    </div>
  )
}

export default ForTeamSectionFact
