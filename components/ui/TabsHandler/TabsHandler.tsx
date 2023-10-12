import { useState } from "react"
import styles from "./TabsHandler.module.scss"
import Link from "next/link"
interface Props {
  tabsList: {
    id: number
    txt: string
    count: number
  }[]
  setActiveTab: any
  activeTab: number
  props?: any
  addClass?: string
  link?: {
    txt: string
    href: string
  }
}

const TabsHandler: React.FC<Props> = ({ tabsList, setActiveTab, activeTab, addClass, link, ...props }) => {
  return (
    <>
      <div className={`${styles["tabs-handler"]} ${addClass ? addClass : ""}`} {...props}>
        <div className={`${styles["tabs-handler__btns"]}`}>
          {tabsList.map((tabBtn) => {
            return (
              <div
                key={tabBtn.id}
                className={`${styles["tabs-handler__btn"]} ${activeTab === tabBtn.id ? styles["is-active"] : ""}`}
                onClick={() => setActiveTab(tabBtn.id)}
              >
                {tabBtn.txt}
                {tabBtn.count > 0 ? ` (${tabBtn.count})` : ""}
              </div>
            )
          })}
        </div>
        {link && (
          <Link href={link.href}>
            <a className={`${styles["tabs-handler__link"]}`}>
              <span>{link.txt}</span>
            </a>
          </Link>
        )}
      </div>
    </>
  )
}

export default TabsHandler
