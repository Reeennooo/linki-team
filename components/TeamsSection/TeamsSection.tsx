import CatalogTeamsSlider from "components/CatalogTeams/CatalogTeamsSlider/CatalogTeamsSlider"
import styles from "./TeamsSection.module.scss"
import Link from "next/link"
import IconArrRight from "public/assets/svg/arr-right-big.svg"
import CatalogTeamsCardSmall from "components/CatalogTeams/CatalogTeamsCardSmall/CatalogTeamsCardSmall"
import { ICatalogWeekTeam } from "types/pmteam"
import { createTitle } from "utils/createTitle"
import { useEffect, useRef, useState } from "react"
import { useGetCatalogTeamsQuery } from "redux/api/pmteam"
import gsap from "gsap"

interface Props {
  sectionData?: {
    title: string
  }
}

const TeamsSection: React.FC<Props> = ({ sectionData }) => {
  const sectionRef = useRef(null)

  let sectionTitle
  if (sectionData?.title) {
    sectionTitle = createTitle(sectionData?.title, styles)
  } else {
    sectionTitle = createTitle("We have the best teams", styles)
  }

  const { data: teams, isFetching } = useGetCatalogTeamsQuery()

  function getAllTeams() {
    let arr = []
    teams?.grouped_teams.forEach((el) => {
      for (const key in el.managers_teams) {
        arr.push(el.managers_teams[key])
      }
    })
    arr = arr.filter((el, index) => el.id !== 0)
    return arr
  }

  function uniqueArr(arr) {
    const seen = {}
    const result = []
    const j = 0

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      const key = `${item.id}`

      if (!seen[key]) {
        seen[key] = 1
        result.push(item)
      }
    }

    return result
  }

  let allTeams = getAllTeams()
  allTeams = uniqueArr(allTeams)

  useEffect(() => {
    const section = sectionRef.current
    const words = gsap.utils.toArray(`.${styles["word"]}`)

    gsap.fromTo(
      words,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "top center",
        },
      }
    )
  })

  return (
    <section className={styles["teams-section"]} ref={sectionRef} id="teams-section">
      <div className="container container--large">
        <div className={styles["teams-section__title"]}>
          <h2 dangerouslySetInnerHTML={{ __html: `${sectionTitle}` }} />
          <Link href="/signup">
            <a className={styles["teams-section__showall"]}>
              <span>Show all teams</span>
              <IconArrRight />
            </a>
          </Link>
        </div>
        <CatalogTeamsSlider slides={teams?.week_teams?.length > 0 ? teams?.week_teams : []} mainpage={true} />
      </div>
      <div className={`container container--large ${styles["container"]}`}>
        <div className={styles["teams-section__grid"]}>
          {allTeams.map(
            (el, index) =>
              index <= 11 && (
                <CatalogTeamsCardSmall
                  key={el.id}
                  avatar={el.avatar}
                  name={el.name}
                  rating={Number(el.rating)}
                  projects={el.jobs_count}
                  id={el.id}
                  mainpage={true}
                />
              )
          )}
        </div>
      </div>
    </section>
  )
}

export default TeamsSection
