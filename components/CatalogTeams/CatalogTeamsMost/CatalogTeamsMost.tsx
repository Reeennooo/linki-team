import { useEffect, useRef, useState } from "react"
import styles from "./CatalogTeamsMost.module.scss"
import IconClose from "public/assets/svg/close.svg"
import { ICatalogWeekTeam } from "types/pmteam"
import CatalogTeamsCardSmall from "../CatalogTeamsCardSmall/CatalogTeamsCardSmall"
import { selectModals } from "redux/slices/modals"
import { useAppSelector } from "hooks"
// import Intercom from "packages/intercom"

interface Props {
  title: string
  txt: string
  addClass?: string
  teams: ICatalogWeekTeam[]
}

const CatalogTeamsMost: React.FC<Props> = ({ teams, title, txt, addClass }) => {
  const { modalsList } = useAppSelector(selectModals)

  const blockRef = useRef(null)
  const [active, setActive] = useState(false)
  const [fixed, setFixed] = useState(false)
  const [top, setTop] = useState(null)
  const [height, setHeight] = useState(null)
  const [left, setLeft] = useState(null)

  const openFn = (e) => {
    e.stopPropagation()
    // Intercom.changeVisibility(false)
    document.documentElement.classList.add("no-scroll")
    setFixed(true)
    const rect = blockRef.current.getBoundingClientRect()
    setTop(rect.top)
    setLeft(rect.left)
    setHeight(rect.height)
    setTimeout(() => {
      setActive(true)
    }, 10)
  }

  const closeFn = (e?: any) => {
    if (e) {
      e.stopPropagation()
    }
    document.documentElement.classList.remove("no-scroll")
    // Intercom.changeVisibility(true)
    setActive(false)
    setTimeout(() => {
      setFixed(false)
      setTop(null)
      setLeft(null)
      setHeight(null)
    }, 300)
  }

  useEffect(() => {
    if (modalsList.includes("modal-pm-team")) {
      document.documentElement.classList.remove("no-scroll")
      setActive(false)
      setFixed(false)
      setTop(null)
      setLeft(null)
      setHeight(null)
      setTimeout(() => {
        closeFn()
      }, 100)
    }
  }, [modalsList])

  return (
    <>
      <div style={fixed ? { height: `${height}px` } : {}}></div>
      <div
        ref={blockRef}
        style={
          fixed
            ? {
                position: "fixed",
                zIndex: "9999999",
                transition: "0.3s",
                top: `${top}px`,
                left: `${left}px`,
                height: `${height}px`,
              }
            : { position: "static" }
        }
        className={`${styles["most-month"]} ${active ? styles["is-active"] : ""} ${addClass ?? ""}`}
        onClick={openFn}
      >
        <div className={`${styles["most-month__title-wrp"]}`}>
          <p className={`${styles["most-month__txt"]}`}>{txt}</p>
          <p className={`${styles["most-month__title"]}`}>{title}</p>
          <button className={`${styles["most-month__close"]}`} onClick={closeFn}>
            <IconClose />
          </button>
        </div>
        <div className={`${styles["scroll"]}`} style={{ overflowY: fixed ? "auto" : "hidden" }}>
          <div className={`${styles["most-month__img"]}`}>
            <img src="/assets/avatars-min.png" alt="" />
          </div>
          <div className={`${styles["most-month__list"]}`}>
            <p className={`${styles["most-month__list-title"]}`}>Only the best</p>
            <p className={`${styles["most-month__list-txt"]}`}>
              Teams that have confirmed their competence and are ready for new projects
            </p>
            {teams?.length > 0 &&
              teams.map((team) => {
                return (
                  <CatalogTeamsCardSmall
                    id={team.id}
                    key={team.id}
                    avatar={team.avatar}
                    name={team.name}
                    rating={Number(team.rating)}
                    projects={null}
                  />
                )
              })}
          </div>
        </div>
      </div>
    </>
  )
}

export default CatalogTeamsMost
