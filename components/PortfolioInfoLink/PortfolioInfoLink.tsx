import React from "react"
import styles from "./PortfolioInfoLink.module.scss"
import IconClose from "public/assets/svg/close.svg"
import { generateLetter } from "utils/generateLetter"

interface Props {
  img: string
  imgLetter?: string
  site: string
  text?: string
  url: string
  formik?: any
  id: number
  isLink?: boolean
  onClose?: () => void
}

const PortfolioInfoLink: React.FC<Props> = ({ img, imgLetter, site, text, url, formik, id, isLink, onClose }) => {
  const removeLink = (id) => {
    const links = formik.values.links
    formik.setFieldValue(
      "links",
      links.filter((link) => link.id !== id)
    )
  }

  return (
    <>
      {isLink ? (
        <a
          className={`${styles.portfolioLnk} ${styles["portfolioLnk--link"]}`}
          target="_blank"
          rel="noreferrer"
          href={url}
        >
          <div className={styles.portfolioLnk__photo}>
            {img === "generate" ? <span>{generateLetter(url)}</span> : <img src={img} alt="" />}
          </div>
          <div className={styles.portfolioLnk__info}>
            <div className={styles.portfolioLnk__site}>{site ? site : url}</div>
            <div className={styles.portfolioLnk__txt}>{text}</div>
          </div>
        </a>
      ) : (
        <div className={styles.portfolioLnk}>
          <div className={styles.portfolioLnk__photo}>
            {img === "generate" ? <span>{imgLetter ? imgLetter : generateLetter(url)}</span> : <img src={img} alt="" />}
          </div>
          <div className={styles.portfolioLnk__info}>
            <div className={styles.portfolioLnk__site}>{site}</div>
            <div className={styles.portfolioLnk__txt}>{text}</div>
          </div>
          <button
            type="button"
            className={styles.portfolioLnk__close}
            onClick={() => {
              if (onClose) {
                onClose()
                return
              }
              removeLink(id)
            }}
          >
            <IconClose />
          </button>
        </div>
      )}
    </>
  )
}

export default PortfolioInfoLink
