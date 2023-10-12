import styles from "./TagItem.module.scss"

interface Props {
  txt: string
  onClose?(id: any): void
  addInfo?: string
  addClass?: string
  id: string | number
  mod?: "gray-md" | "gray"
  readonly?: boolean
}

const TagItem: React.FC<Props> = ({ txt, addClass, addInfo, onClose, id, mod, readonly, ...props }) => {
  return (
    <button
      type={"button"}
      className={`tag-item ${styles["tag-item"]} ${mod ? styles["tag-item--" + mod] : ""} ${
        readonly ? styles["tag-item--readonly"] : ""
      }  ${addClass ? addClass : ""} ${addInfo ? styles["tag-item--add-info"] : ""}`}
      {...props}
      onClick={() => {
        if (onClose) onClose(id)
      }}
      tabIndex={readonly ? -1 : undefined}
    >
      <div className={`tag-item__txt ${styles["tag-item__txt"]}`}>
        {txt}
        {addInfo && <span className={`${styles["tag-item__add-info"]}`}>{addInfo}</span>}
      </div>

      {onClose && <span className={`${styles["tag-item__close"]}`} />}
    </button>
  )
}

export default TagItem
