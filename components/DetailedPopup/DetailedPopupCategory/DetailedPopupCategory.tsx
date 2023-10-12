import TagItem from "components/ui/TagItem/TagItem"
import styles from "./DetailedPopupCategory.module.scss"

interface Props {
  categories: {
    id: number
    name: string
    project_direction_id: number
  }[]
  addClass?: string
  title?: string
}

const DetailedPopupCategory: React.FC<Props> = ({ categories, title, addClass }) => {
  return (
    <>
      <div className={`${styles.category} ${addClass ? addClass : ""}`}>
        <h3 className={styles.category__title}>{title ? title : "Category"}</h3>
        <div className={styles.category__list}>
          {categories.map((category) => {
            return (
              <TagItem
                key={category.id}
                addClass={`${styles["category__item"]}`}
                id={category.id}
                txt={category.name}
                readonly
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default DetailedPopupCategory
