import React, { Dispatch, SetStateAction } from "react"
import styles from "./Nav.module.scss"
import { useRouter } from "next/router"
import { scrollToFn } from "utils/scrollTo"

interface Props {
  addClass?: string
  setMenuIsOPen?: Dispatch<SetStateAction<boolean>>
  mainpage?: boolean
}

const Nav: React.FC<Props> = ({ addClass, setMenuIsOPen, mainpage }) => {
  const { pathname } = useRouter()
  const linksArr = [
    {
      id: 1,
      txt: "About",
      href: "about",
      disabled: false,
    },
    {
      id: 2,
      txt: "How it works",
      href: "howworks",
      disabled: false,
    },
    {
      id: 3,
      txt: "Use cases",
      href: "about",
      disabled: true,
    },
    {
      id: 4,
      txt: "Pricing",
      href: "about",
      disabled: true,
    },
    {
      id: 5,
      txt: "For Freelancers",
      href: "subscribe",
      disabled: false,
    },
  ]

  const mainlinks = [
    {
      id: 1,
      txt: "For Client",
      href: "for-client",
      disabled: false,
    },
    {
      id: 2,
      txt: "For Team",
      href: "for-team",
      disabled: false,
    },
    {
      id: 3,
      txt: "For Expert",
      href: "for-expert",
      disabled: false,
    },
  ]

  if (pathname === "/promo-team-launch" || pathname === "/promo-team" || pathname === "/promo-team-project") {
    return null
  }

  return (
    <>
      <nav className={`${addClass ? addClass : ""}`}>
        {mainpage
          ? mainlinks.map((el) => {
              return (
                <a
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToFn(el.href, false, 0)
                    setMenuIsOPen(false)
                  }}
                  className={`${styles.link} ${el.disabled ? styles["is-disabled"] : ""} ${
                    mainpage ? styles["link-mainpage"] : ""
                  } `}
                  key={el.id}
                  href={`#${el.href}`}
                >
                  {el.txt}
                </a>
              )
            })
          : linksArr.map((el) => {
              return (
                <a
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToFn(el.href, false, 50)
                    setMenuIsOPen(false)
                  }}
                  className={`${styles.link} ${el.disabled ? styles["is-disabled"] : ""} `}
                  key={el.id}
                  href={`#${el.href}`}
                >
                  {el.txt}
                </a>
              )
            })}
      </nav>
    </>
  )
}

export default Nav
