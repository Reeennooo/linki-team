import styles from "./FavoriteFilter.module.scss"
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { useLazyGetDirectionsQuery, useLazyGetSpecksQuery } from "redux/api/content"
import InputSearch from "components/ui/InputSearch/InputSearch"
import Checkbox from "components/ui/Checkbox/Checkbox"
import SelectDropBlock from "components/ui/SelectDropBlock/SelectDropBlock"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import { UserFavoriteData } from "types/user"

interface IFavoriteFilterProps {
  addClass?: string
  searchPlaceholder?: string
  filterState: any
  setFilterState: Dispatch<SetStateAction<any>>
  activeTabId: number
  tabData: any
  tabNames: string[]
  handleClear: () => void
  favList: UserFavoriteData[]
  initialFavList: UserFavoriteData[]
}

const FavoriteFilter: React.FC<IFavoriteFilterProps> = ({
  addClass,
  searchPlaceholder,
  filterState,
  setFilterState,
  activeTabId,
  tabData,
  tabNames,
  handleClear,
  favList,
  initialFavList,
}) => {
  const [getDirections, { data: directionsQuery }] = useLazyGetDirectionsQuery()
  const [getSpecks, { data: specksQuery }] = useLazyGetSpecksQuery()

  const [categoriesList, setCategoriesList] = useState([])
  const [currentFilter, setCurrentFilter] = useState(null)

  useEffect(() => {
    // searching Clients - убираем селект
    // searching PM - getDirections()
    // searching Experts - getSpecks()
    if (tabNames.includes("Experts")) getSpecks()
    if (tabNames.includes("Project managers")) getDirections()
  }, [getDirections, getSpecks, tabNames])

  useEffect(() => {
    setCurrentFilter(filterState?.filter((item) => item.id === activeTabId)[0])
    switch (activeTabId) {
      case 1:
        // Experts
        setCategoriesList(specksQuery)
        break
      case 2:
        // PM
        setCategoriesList(directionsQuery)
        break
      default:
        setCategoriesList([])
    }
  }, [activeTabId, directionsQuery, specksQuery, favList])

  const [isSelectOpen, setSelectOpen] = useState<boolean>(false)

  const categoriesListBlock = useMemo(() => {
    if (!categoriesList?.length) return null
    const uniqueFavRoleIds = []
    const currentTab = tabData.filter((tab) => tab.id === activeTabId)
    initialFavList
      ?.filter((favItem) => favItem.type === currentTab[0].tabUserType)
      ?.map((item) => {
        if (activeTabId === 1) {
          // Experts
          item?.job_roles?.map((job) => {
            if (!uniqueFavRoleIds.includes(job.area_expertise_id)) {
              uniqueFavRoleIds.push(job.area_expertise_id)
            }
          })
        }
        if (activeTabId === 2) {
          // PM
          item?.project_directions?.map((dir) => {
            if (!uniqueFavRoleIds.includes(dir.id)) {
              uniqueFavRoleIds.push(dir.id)
            }
          })
        }
      })
    if (!uniqueFavRoleIds.length) return null
    const li = categoriesList.map((category) => {
      if (!uniqueFavRoleIds.includes(category.id)) return null
      return (
        <li key={category.id} className={`${styles["ul__li--inner"]}`}>
          <Checkbox
            name={category.name}
            text={category.name}
            value={category.id}
            checked={currentFilter?.checkedAreas.filter((i) => i.id === category.id).length > 0}
            onChange={(e) => {
              if (e.target.checked) {
                setFilterState((prev) => {
                  return [...prev].map((item) => {
                    if (item.id === activeTabId) item.checkedAreas.push(category)
                    return item
                  })
                })
              } else {
                setFilterState((prev) => {
                  return [...prev].map((item) => {
                    if (item.id === activeTabId) {
                      item.checkedAreas = item.checkedAreas.filter((chItem) => chItem.id !== category.id)
                    }
                    return item
                  })
                })
              }
            }}
          />
        </li>
      )
    })
    return <ul className={`${styles["ul"]}`}>{li}</ul>
  }, [categoriesList, filterState, initialFavList])

  return (
    <div className={`${styles.filter} ${addClass ? addClass : ""}`}>
      <div className={styles.filter__main}>
        <InputSearch
          value={currentFilter?.search}
          placeholder={searchPlaceholder}
          onChange={(val) => {
            setFilterState((prev) => {
              return [...prev].map((item) => {
                if (item.id === activeTabId) item.search = val
                return item
              })
            })
          }}
        />
        {categoriesListBlock && (
          <SelectDropBlock
            placeholder={`Areas of Expertise ${
              currentFilter?.checkedAreas.length ? "(" + currentFilter.checkedAreas.length + ")" : ""
            }`}
            child={categoriesListBlock}
            isSelectOpen={isSelectOpen}
            setSelectBlockOpen={setSelectOpen}
            isFilled={currentFilter?.checkedAreas.length > 0}
          />
        )}
        <DefaultBtn
          txt={"Clear all"}
          mod={"transparent-grey"}
          addClass={styles["btn-clear"]}
          minWidth={false}
          onClick={handleClear}
          disabled={currentFilter?.checkedAreas.length || currentFilter?.search.length ? undefined : true}
        />
      </div>
    </div>
  )
}

export default FavoriteFilter
