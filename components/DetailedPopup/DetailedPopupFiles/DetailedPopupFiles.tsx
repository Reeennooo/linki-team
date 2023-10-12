import styles from "./DetailedPopupFiles.module.scss"
import IconFileList from "public/icons/file-list-icon.svg"
import { BACKEND_HOST } from "utils/constants"

interface Props {
  files: string[]
  addClass?: string
}

const DetailedPopupFiles: React.FC<Props> = ({ files, addClass }) => {
  return (
    <>
      <div className={`${styles["files"]} ${addClass ? addClass : ""}`}>
        <h3 className={`${styles["files__title"]}`}>Files</h3>
        <div className={`${styles["files-list"]}`}>
          {files.map((file, i) => {
            return (
              <a
                target={"_blank"}
                rel="noreferrer"
                href={`${BACKEND_HOST}${file}`}
                key={i}
                className={`${styles["files-list__item"]}`}
              >
                <div className={`${styles["files-list__item-icon"]}`}>
                  <IconFileList />
                </div>
                <div>
                  <p className={`${styles["files-list__item-name"]}`}>
                    {file.split("/")[files[0]?.split("/").length - 1]?.split(".")[0]}
                  </p>
                  <p className={`${styles["files-list__item-info"]}`}>
                    {file.split("/")[files[0]?.split("/").length - 1]?.split(".")[1]}
                  </p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default DetailedPopupFiles
