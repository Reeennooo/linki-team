import TagItem from "components/ui/TagItem/TagItem"
import styles from "./DetailedPopupLangList.module.scss"

interface Props {
  langList: {
    code: string
    id: number
    name: string
  }[]
  addClass?: string
}

const DetailedPopupLangList: React.FC<Props> = ({ langList, addClass }) => {
  return (
    <>
      <div className={`${styles["lang-list"]} ${addClass ? addClass : ""}`}>
        {langList.map((li) => {
          return (
            <TagItem
              readonly={true}
              mod={"gray-md"}
              addClass={`${styles["lang-list__item"]} `}
              key={li.id}
              id={li.id}
              txt={li.name}
            />
          )
        })}
      </div>
    </>
  )
}

export default DetailedPopupLangList
