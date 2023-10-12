import CatalogTeamsHero from "components/CatalogTeams/CatalogTeamsHero/CatalogTeamsHero"
import { useEffect } from "react"
import { useGetCatalogTeamsQuery } from "redux/api/pmteam"
import CatalogTeamsList from "../CatalogTeamsList/CatalogTeamsList"
import CatalogTeamsMost from "../CatalogTeamsMost/CatalogTeamsMost"
import CatalogTeamsSlider from "../CatalogTeamsSlider/CatalogTeamsSlider"
import styles from "./CatalogTeamsSection.module.scss"

interface Props {
  addClass?: string
}

const CatalogTeamsSection: React.FC<Props> = ({ addClass }) => {
  const { data: teams, isFetching } = useGetCatalogTeamsQuery()

  return (
    <>
      <CatalogTeamsHero
        addClass={`page-section ${styles.hero}`}
        title={"Find a dream team"}
        txt={"Join the team and take projects<br> to the next level"}
      />
      <CatalogTeamsSlider
        slides={teams?.week_teams?.length > 0 ? teams?.week_teams : []}
        addClass="page-section"
        title={"Teams of the week"}
      />
      <CatalogTeamsMost
        teams={teams?.week_teams?.length > 0 ? teams?.week_teams : []}
        title={"Most completed projects"}
        txt={"Teams per month"}
        addClass={` ${styles.most}`}
      />
      <div className={`${styles["team-list-wrp"]}`}>
        {teams?.grouped_teams?.length > 0 &&
          teams.grouped_teams.map((group) => {
            return (
              <CatalogTeamsList
                isFetching={isFetching}
                addClass={`${styles["team-list"]} page-section`}
                teams={group.managers_teams}
                id={group.direction.id}
                key={group.direction.id}
                title={`${group.direction.name}`}
              />
            )
          })}
      </div>
    </>
  )
}

export default CatalogTeamsSection
