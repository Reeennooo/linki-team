import styles from "./List.module.scss"
import ToggleBtn from "components/ui/btns/ToggleBtn/ToggleBtn"
import { useState } from "react"
import IconCheck from "../../../public/assets/svg/check.svg"

interface ListProps {
  list: string[]
  mod?: "checked"
  hideOptions?: {
    hideTxt: string
    viewTxt: string
    count: number
    active?: boolean
  }
}

const List: React.FC<ListProps> = ({ list, mod, hideOptions }) => {
  const [isToggle, setToggle] = useState<boolean>(hideOptions.active ? hideOptions.active : false)

  const listItems = list?.map((item, index) => (
    <li
      key={index}
      className={`${styles.list__item} ${!isToggle && hideOptions?.count <= index ? styles["list__item--hide"] : ""}`}
    >
      {mod === "checked" ? <IconCheck /> : ""}
      {item}
    </li>
  ))

  return (
    <div className={"list-wrap"}>
      <ul className={`${styles.list} ${mod ? styles["list--" + mod] : ""}`}>{listItems}</ul>
      {hideOptions?.count < list.length && (
        <ToggleBtn
          addClass={`list__toggle ${styles.list__toggle}`}
          txt={isToggle ? hideOptions.hideTxt : hideOptions.viewTxt}
          isActive={isToggle}
          onClick={() => {
            setToggle((prev) => !prev)
          }}
        />
      )}
    </div>
  )
}

export default List
