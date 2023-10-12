import styles from "./TagItemFlag.module.scss"

interface Props {
  txt: string
  addClass?: string
  id: string | number
  flag: string
}

const TagItemFlag: React.FC<Props> = ({ txt, addClass, flag, id, ...props }) => {
  return (
    <button type={"button"} className={`${styles["tag-item-flag"]} ${addClass ? addClass : ""}`} {...props}>
      <div className={`${styles["tag-item-flag__txt"]}`}>
        <img className={`${styles["tag-item-flag__flag"]}`} src={`/assets/flags/${flag}.svg`} alt="" />
        {txt}
      </div>
    </button>
  )
}

export default TagItemFlag
