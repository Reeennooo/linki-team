import styles from "./ExpertsSection.module.scss"
import { useGetExecutorListQuery, useLazyGetExecutorListQuery } from "redux/api/team"
import Filter from "components/ui/Filter/Filter"
import { useEffect, useState } from "react"
import HumanInfoCard from "components/HumanInfoCard/HumanInfoCard"
import NoSearchResult from "components/NoSearchResult/NoSearchResult"

interface IExpertsSectionProps {
  props?: any
}

const ExpertsSection: React.FC<IExpertsSectionProps> = ({ props }) => {
  const { data: expertsQuery, isFetching } = useGetExecutorListQuery()
  const [getExecutorList, { data: expertsLazy, isFetching: isFetchingLazy }] = useLazyGetExecutorListQuery()

  const [expertsList, setExpertsList] = useState([])
  const [isNoResult, setNoResult] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!expertsQuery) return
    setExpertsList(expertsQuery)
  }, [expertsQuery])

  useEffect(() => {
    if (!expertsLazy) return
    setExpertsList(expertsLazy)
  }, [expertsLazy])

  useEffect(() => {
    if (isFetching || isFetchingLazy) {
      setLoading(true)
      setNoResult(false)
    } else {
      setNoResult(Boolean(expertsLazy?.length < 1))
      setLoading(false)
    }
  }, [expertsLazy, isFetching, isFetchingLazy])

  const cards = expertsList?.map((expert, index) => <HumanInfoCard key={expert.id} data={expert} cardIndex={index} />)

  return (
    <div className={styles.body}>
      <div className={styles.aside}>
        <Filter
          searchFunc={getExecutorList}
          options={{
            search: true,
            selectLang: true,
            selectAreasExpertise: true,
            selectSkills: true,
            selectProfessions: true,
            rangeRating: true,
            rangeRate: true,
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
        ) : isNoResult || !cards?.length ? (
          <NoSearchResult />
        ) : (
          <div className={styles.grid}>{cards}</div>
        )}
      </div>
    </div>
  )
}

export default ExpertsSection
