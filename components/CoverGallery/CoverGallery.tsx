import { useEffect, useState } from "react"
import styles from "./CoverGallery.module.scss"
import { BACKEND_HOST } from "utils/constants"
import { Cover } from "types/content"

interface Props {
  addClass?: string
  items: Cover[]
  onClick?(id: number): void
  onClose?(): void
}

const CoverGallery: React.FC<Props> = ({ addClass, items, onClick, onClose, ...props }) => {
  const [step, setStep] = useState(1)
  const [actId, setActId] = useState(null)

  const selectingCover = (img) => {
    setActId(img)
  }
  const closeChoosenImg = () => {
    setStep(1)
    setActId(null)
    onClose()
  }

  useEffect(() => {
    if (actId) setStep(2)
  }, [actId])

  return (
    <>
      {step === 1 ? (
        <div className={`${styles["cover-gallery"]} ${addClass ? addClass : ""}`} {...props}>
          <div className={`${styles["cover-gallery__inner"]}`}>
            <div className={`${styles["cover-gallery__inner-gallery"]}`}>
              {items
                ? items.map((item) => {
                    const url = item.image.includes("http") ? item.image : BACKEND_HOST + item.image
                    return (
                      <div
                        key={item.id}
                        className={`${styles["cover-gallery__image"]} ${
                          item.image === actId ? styles["is-active"] : ""
                        }`}
                        onClick={() => selectingCover(item.image)}
                      >
                        <img
                          key={item.image}
                          src={url}
                          alt={item.name}
                          onClick={() => {
                            onClick && onClick(item.id)
                          }}
                        />
                      </div>
                    )
                  })
                : null}
            </div>
            <span className={`${styles["cover-gallery__line"]}`}></span>
          </div>
        </div>
      ) : (
        <div className={`${styles["selected-cover"]}`}>
          <img src={`${actId.includes("http") ? actId : BACKEND_HOST + actId}`} alt="" />
          <div className={`${styles["selected-cover__close"]}`} onClick={() => closeChoosenImg()}></div>
        </div>
      )}
    </>
  )
}

export default CoverGallery
