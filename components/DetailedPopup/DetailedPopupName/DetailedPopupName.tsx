import styles from "./DetailedPopupName.module.scss"
import { BACKEND_HOST, BLUR_IMAGE_DATA_URL } from "../../../utils/constants"
import Image from "next/image"

interface Props {
  addClass?: string
  name?: string
  cover?: string | null
  created_at?: string
  response?: number
  isCoverAlways?: boolean
}

const DetailedPopupName: React.FC<Props> = ({ name, cover, created_at, response, addClass, isCoverAlways }) => {
  return (
    <>
      <div className={` ${addClass ? addClass : ""}`}>
        {(name || response > 0) && (
          <div className={styles["cover__header"]}>
            {name && <h2 className={styles["cover__title"]}>{name}</h2>}
            {response > 0 && <p className={styles["cover__res"]}>{response} people responded</p>}
          </div>
        )}
        {cover ? (
          <div className={styles["cover__img-wrap"]}>
            <Image
              src={cover.includes("/assets/covers") ? cover : BACKEND_HOST + cover}
              alt="avatar"
              // width={44}
              // height={44}
              layout={"fill"}
              quality={75}
              objectFit={"cover"}
              objectPosition={"center"}
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_DATA_URL}
            />
            {created_at ? (
              <p>
                Create: <span>{created_at}</span>
              </p>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {!cover && isCoverAlways && (
          <div className={`${styles["cover__img-wrap"]} ${styles["cover__img-wrap--empty"]}`}>No cover</div>
        )}
      </div>
    </>
  )
}

export default DetailedPopupName
