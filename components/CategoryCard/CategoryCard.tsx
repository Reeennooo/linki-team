import styles from "./CategoryCard.module.scss"
import IconPancil from "public/assets/svg/ic-pancil.svg"
import IconNote from "public/assets/svg/ic-note.svg"
import IconCode from "public/icons/category/Code.svg"
import IconRocketLaunch from "public/icons/category/RocketLaunch.svg"
import IconGitFork from "public/icons/category/GitFork.svg"
import IconBriefcase from "public/icons/category/Briefcase.svg"
import IconSmile from "public/icons/category/Smile.svg"
import IconLayout from "public/icons/category/Layout.svg"
import IconTrending from "public/icons/category/Trending-up.svg"
import IconPencilSimple from "public/icons/category/PencilSimple.svg"
import IconFilm from "public/icons/category/Film.svg"
import IconMusicNotes from "public/icons/category/MusicNotes.svg"

interface Props {
  txt: string
  addClass?: string
  props?: any
  active?: boolean
  onClick?(id: string | number): void
  id: string | number
  mod?: "lg" | "lg-row"
}

const CategoryCard: React.FC<Props> = ({ txt, addClass, active, onClick, id, mod }) => {
  const iconSelector = (id) => {
    switch (id) {
      case 1:
        return <IconPancil />
      case 2:
        return <IconNote />
      case 3:
        return <IconCode className={"stroke-icon"} />
      case 4:
        return <IconRocketLaunch className={"stroke-icon"} />
      case 5:
        return <IconGitFork className={"stroke-icon"} />
      case 6:
        return <IconBriefcase className={"stroke-icon"} />
      case 7:
        return <IconSmile className={"stroke-icon"} />
      case 8:
        return <IconLayout className={"stroke-icon"} />
      case 9:
        return <IconTrending className={"stroke-icon"} />
      case 10:
        return <IconPencilSimple className={"stroke-icon"} />
      case 11:
        return <IconFilm className={"stroke-icon"} />
      case 12:
        return <IconMusicNotes className={"stroke-icon"} />
      default:
        break
    }
  }

  return (
    <>
      <div
        className={`${styles["category-card"]} ${addClass ? addClass : ""} ${active ? styles["is-active"] : ""} ${
          mod ? styles["category-card--" + mod] : ""
        }`}
        onClick={() => onClick(id)}
      >
        <div className={`${styles["category-card__img"]} `}>{iconSelector(id)}</div>
        <div className={`${styles["category-card__txt"]} `}>{txt}</div>
      </div>
    </>
  )
}

export default CategoryCard
