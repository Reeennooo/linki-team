import type { NextPage } from "next"
import { useAuth } from "hooks/useAuth"
import Link from "next/link"
import React from "react"
import styles from "./Layout404.module.scss"

const Layout404: NextPage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className={styles.page404} style={{ backgroundImage: "url(/assets/page404/map404.svg)" }}>
      {/* <style jsx>{`
        div {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          text-align: center;
        }
        h1 {
          font-size: calc(5vw + 5vh + 2vmin);
          line-height: 1;
          margin-bottom: 5px;
        }
        p {
          font-size: calc(1vw + 1vh + 2vmin);
          font-weight: 500;
          margin-bottom: 20px;
        }
      `}</style> */}
      <div className={styles.page404__header}>
        <Link href={isAuthenticated ? "/dashboard" : "/"}>
          <a className={`aside-menu__logo`}>
            <img className={styles.desc} src="/img/header/linlilogo.svg" alt="linkilogo" width={114} />
            <img className={styles.mob} src="/img/header/logo-small.svg" alt="linkilogo" width={49} />
          </a>
        </Link>
      </div>
      <div className={styles.page404__body}>
        <h1>Page not found</h1>
        <p>{"We can’t find the page that you’re looking for :("}</p>
        <div className={styles.page404__img}>
          <img src="/assets/page404/404.png" alt="404" width={636} />
        </div>
        <Link href={isAuthenticated ? "/dashboard" : "/"} passHref>
          <a className="default-btn">Go to homepage</a>
        </Link>
      </div>
    </div>
  )
}

export default Layout404
