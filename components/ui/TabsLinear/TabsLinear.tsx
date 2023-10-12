import styles from "./TabsLinear.module.scss"
import { useAuth } from "hooks/useAuth"
import Link from "next/link"
import { useMemo } from "react"

interface Props {
  list: {
    id: number
    txt: string
    count?: number
    user_role?: number[]
    url?: string
  }[]
  activeId: number
  isLinks?: boolean
  isDisabledEmpties?: boolean
  onClick(id: number): void
  mod?: string
  addClass?: string
}

const TabsLinear: React.FC<Props> = ({ list, activeId, onClick, isLinks, isDisabledEmpties, mod, addClass }) => {
  const { user } = useAuth()

  const listData = useMemo(() => {
    return list.map((item) => {
      if (item.user_role && !item.user_role.includes(user.type)) return null

      return (
        <li
          className={`${styles.item} ${item.id === activeId ? styles["item--active"] : ""} ${
            isDisabledEmpties && !item.count ? styles["item--disabled"] : ""
          }`}
          key={item.id}
        >
          {isLinks ? (
            <Link href={item.url}>
              <a
                onClick={() => {
                  if (isDisabledEmpties && !item.count) return
                  onClick(item.id)
                }}
              >
                <span className={styles.btn}>
                  {item.txt} {item.count && item.count > 0 ? <span>({item.count})</span> : ""}
                </span>
              </a>
            </Link>
          ) : (
            <button
              type="button"
              className={styles.btn}
              onClick={() => {
                if (isDisabledEmpties && !item.count) return
                onClick(item.id)
              }}
            >
              {item.txt} {item.count && item.count > 0 ? <span>({item.count})</span> : ""}
            </button>
          )}
        </li>
      )
    })
  }, [activeId, isLinks, list, onClick, user.type])

  const tabsClasses = [
    "tabs-links-list",
    styles.wrap,
    mod ? styles["wrap--" + mod] : "",
    addClass ? addClass : "",
  ].join(" ")

  return (
    <div className={tabsClasses}>
      <ul className={`tabs-links-list__ul scrollbar-transparent-tablet ${styles.list}`}>{listData}</ul>
    </div>
  )
}

export default TabsLinear
