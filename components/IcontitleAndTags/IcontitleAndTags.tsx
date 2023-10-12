import styles from "./IcontitleAndTags.module.scss"
import IconClose from "public/assets/svg/close.svg"
import IconPancil from "public/icons/pencil-icon.svg"

import IconCaretDown from "public/assets/svg/CaretDown.svg"

import IconGear from "public/assets/svg/ic-gear.svg"

import IconCode from "public/assets/svg/directions/Code.svg"
import IconRocketLaunch from "public/assets/svg/directions/RocketLaunch.svg"
import IconRocket from "public/assets/svg/rocket.svg"
import IconGitFork from "public/assets/svg/directions/GitFork.svg"
import IconBriefcase from "public/assets/svg/directions/Briefcase.svg"
import IconSmile from "public/assets/svg/directions/Smile.svg"
import IconLayout from "public/assets/svg/directions/Layout.svg"
import IconTrending from "public/assets/svg/directions/Trending-up.svg"
import IconPencilSimple from "public/assets/svg/directions/PencilSimple.svg"
import IconFilm from "public/assets/svg/directions/Film.svg"
import IconMusicNotes from "public/assets/svg/directions/MusicNotes.svg"
import { useEffect, useRef, useState } from "react"

interface Props {
  title: string
  id?: number
  tags?: {
    id: number
    name: string
  }[]
  addClass?: string
  isEdit?: boolean
  isDelete?: boolean
  deleteFcn?: (id) => void
  editFcn?: (id) => void
  iconId: number | null
  price?: number | string
  userType?: number
  tagsName?: string
  topBlockPrice?: number
}

const IcontitleAndTags: React.FC<Props> = ({
  title,
  tags,
  addClass,
  isEdit,
  isDelete,
  deleteFcn,
  editFcn,
  id,
  iconId,
  price,
  userType,
  tagsName,
  topBlockPrice,
}) => {
  const tagsRef = useRef()

  const [tagsWrapHeight, setTagsWrapHeight] = useState<string>("auto")
  const [open, setOPen] = useState(false)

  const getHeight = () => {
    const innerElement = tagsRef.current as HTMLElement
    return innerElement.offsetHeight
  }
  useEffect(() => {
    setTagsWrapHeight(open ? getHeight() + "px" : "0")
  }, [open])

  const iconSelector = (id) => {
    if (userType === 2) {
      switch (id) {
        case 9:
        case 13:
          return <IconCode />
        case 4:
          return <IconRocket />
        case 5:
          return <IconGitFork />
        case 14:
        case 17:
          return <IconBriefcase />
        case 7:
          return <IconSmile />
        case 10:
          return <IconLayout />
        case 12:
          return <IconTrending />
        case 11:
          return <IconPencilSimple />
        case 11:
          return <IconFilm />
        case 12:
          return <IconMusicNotes />
        case 15:
          return <IconGear />
        default:
          break
      }
    } else {
      switch (id) {
        case 3:
          return <IconCode />
        case 4:
          return <IconRocket />
        case 5:
          return <IconGitFork />
        case 6:
          return <IconBriefcase />
        case 7:
          return <IconSmile />
        case 8:
          return <IconLayout />
        case 9:
          return <IconTrending />
        case 10:
          return <IconPencilSimple />
        case 11:
          return <IconFilm />
        case 12:
          return <IconMusicNotes />
        default:
          break
      }
    }
  }

  return (
    <>
      <div
        className={`iat ${styles.iat} ${addClass ? addClass : ""} ${tags?.length > 0 ? "" : styles["no-tags"]} ${
          open ? styles["is-open"] : ""
        }`}
      >
        {(isEdit || isDelete) && (
          <div className={`${styles["iat__edit"]}`}>
            {isEdit && (
              <button
                className={`${styles["iat__edit-edit"]}`}
                type={"button"}
                onClick={() => {
                  editFcn(id)
                }}
              >
                <IconPancil />
              </button>
            )}
            {isDelete && (
              <button
                className={`iat__edit-close ${styles["iat__edit-close"]}`}
                type={"button"}
                onClick={() => {
                  deleteFcn(id)
                }}
              >
                <IconClose />
              </button>
            )}
          </div>
        )}
        <div
          className={`${styles.iat__top}`}
          onClick={() => {
            setOPen(!open)
          }}
        >
          <div className={`${styles["iat__icon"]}`}>{iconId && iconSelector(iconId)}</div>
          <div className={styles["iat__title-wrap"]}>
            <p className={`${styles["iat__title"]}`}>{title}</p>
            <div className={`${styles["iat__category-count"]}`}>
              {tags?.length > 0 && (
                <>
                  {tagsName ? tagsName : "Category"} {`(${tags ? tags.length : 0})`}
                  <IconCaretDown />
                </>
              )}
            </div>
          </div>
          {topBlockPrice && (
            <p className={`${styles["iat__top-price"]}`}>
              ${topBlockPrice} <span>Per hour</span>
            </p>
          )}
        </div>
        <div
          className={`${styles["iat__tags-wrp"]} ${price ? styles["iat__tags-wrp--with-price"] : ""}`}
          style={{ height: tagsWrapHeight }}
        >
          <div className={`${styles["iat__tags-inner"]}`} ref={tagsRef}>
            {tags && (
              <div className={`${styles.iat__list}`}>
                {tags.map((tag) => {
                  return (
                    <span key={tag.id} className={styles.iat__tag}>
                      {tag.name}
                    </span>
                  )
                })}
              </div>
            )}
            {price && (
              <div className={`${styles.iat__price}`}>
                <span className={`${styles["iat__price-sign"]}`}>$</span>
                <span className={`${styles["iat__price-val"]}`}>{String(price).replace("$", "")}</span>
                <span className={`${styles["iat__price-txt"]}`}>Per hour</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default IcontitleAndTags
