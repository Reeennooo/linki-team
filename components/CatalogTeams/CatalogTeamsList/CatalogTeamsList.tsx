import Link from "next/link"
import { useEffect, useState } from "react"
import { ICatalogMabagerTeams } from "types/pmteam"
import CatalogTeamsCardSmall from "../CatalogTeamsCardSmall/CatalogTeamsCardSmall"
import styles from "./CatalogTeamsList.module.scss"

interface Props {
  isFetching: boolean
  id: number
  teams: ICatalogMabagerTeams
  title: string
  addClass?: string
}

const CatalogTeamsList: React.FC<Props> = ({ teams, title, id, addClass, isFetching }) => {
  const [tempData, setTempData] = useState([])
  const maxTeams = 12

  useEffect(() => {
    const newTeamsData = []
    for (const key in teams) {
      if (newTeamsData.length < maxTeams) {
        newTeamsData.push(teams[key])
      }
    }
    if (newTeamsData.length > 0) setTempData(newTeamsData)
  }, [teams])
  return (
    <div className={`${styles["catalog-teams-list"]} ${addClass ?? ""}`}>
      <h3 className={`${styles["catalog-teams-list__title"]} page-section__title`}>
        {title}{" "}
        <Link href={`/catalog-teams/${id}`}>
          <a className={`${styles["catalog-teams-list__title-btn"]}`}>All</a>
        </Link>
      </h3>
      <div className={`${styles["catalog-teams-list__teams"]}`}>
        {isFetching &&
          ["1", "2", "3"].map((el, i) => {
            return <CatalogTeamsCardSmall id={i} loading={true} key={i} avatar={el} name={el} rating={i} projects={i} />
          })}
        {!isFetching &&
          tempData.length > 0 &&
          tempData.map((team) => {
            return (
              <CatalogTeamsCardSmall
                id={team.id}
                key={team.id}
                avatar={team.avatar}
                name={team.name}
                rating={team.rating}
                projects={team.jobs_count}
              />
            )
          })}
      </div>
    </div>
  )
}

export default CatalogTeamsList
