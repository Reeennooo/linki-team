import NoSearchResult from "components/NoSearchResult/NoSearchResult"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import Filter from "components/ui/Filter/Filter"
import { useRouter } from "next/router"
import { Fragment, useCallback, useEffect, useState } from "react"
import { useGetCatalogTeamsFilteredQuery, useLazyGetCatalogTeamsFilteredQuery } from "redux/api/pmteam"
import CatalogTeamsCardSmall from "../CatalogTeamsCardSmall/CatalogTeamsCardSmall"
import styles from "./CatalogTeamsDirection.module.scss"

interface Props {
  addClass?: string
}

const CatalogTeamsDirection: React.FC<Props> = () => {
  const router = useRouter()
  const { data: teamsData, isFetching } = useGetCatalogTeamsFilteredQuery({ direction: Number(router.query.id) })
  const [getTeamsQuery, { data: lazyteamsData, isFetching: isFetchingLazy }] = useLazyGetCatalogTeamsFilteredQuery()

  const getTeams = useCallback((args) => {
    getTeamsQuery({ direction: Number(router.query.id), body: args })
  }, [])

  const [teamsList, setTeamssList] = useState([])
  const [isNoResult, setNoResult] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!teamsData) return
    setTeamssList(teamsData)
  }, [teamsData])

  useEffect(() => {
    if (!lazyteamsData) return
    setTeamssList(lazyteamsData)
  }, [lazyteamsData])

  useEffect(() => {
    if (isFetchingLazy) {
      setLoading(true)
      setNoResult(false)
    } else {
      setNoResult(Boolean(teamsData?.length < 1))
      setLoading(false)
    }
  }, [isFetching, isFetchingLazy, lazyteamsData])

  const indexBanner = 2
  const teams = teamsList?.map((team, index) => {
    if (index === indexBanner) {
      return (
        <Fragment key={0}>
          <div className={`${styles["banner" + indexBanner]} ${styles["banner"]}`}>
            <div className={`${styles["banner__left"]}`}>
              <p className={`${styles["banner__txt"]}`}>Teams per month</p>
              <p className={`${styles["banner__title"]}`}>Most completed projects</p>
              <DefaultBtn txt="Button text" />
            </div>
            <div className={`${styles["banner__img"]}`}>
              <img src="/assets/teams-banner.png" alt="" />
            </div>
          </div>
          <CatalogTeamsCardSmall
            id={team.id}
            key={team.id}
            avatar={`${team.avatar}`}
            name={team.name}
            rating={team.rating}
            projects={team.jobs_count}
          />
        </Fragment>
      )
    } else {
      return (
        <CatalogTeamsCardSmall
          id={team.id}
          key={team.id}
          avatar={`${team.avatar}`}
          name={team.name}
          rating={team.rating}
          projects={team.jobs_count}
        />
      )
    }
  })

  return (
    <>
      <div className={styles.body}>
        <div className={styles.aside}>
          <Filter
            searchFunc={getTeams}
            options={{
              search: true,
              selectCategories: Number(router.query.id),
              rangeRating: true,
              rangeJobs: true,
            }}
          />
        </div>

        <div className={styles.main}>
          {isLoading ? (
            <div className={styles.loading}>
              <span />
              <span />
              <span />
              <span />
            </div>
          ) : isNoResult || !teams?.length ? (
            <NoSearchResult subtitle={null} />
          ) : (
            <div className={styles.grid}>{teams}</div>
          )}
        </div>
      </div>
    </>
  )
}

export default CatalogTeamsDirection
