import styles from "./FavoriteInner.module.scss"
import React, { useEffect, useState } from "react"
import { useAuth } from "hooks/useAuth"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import FavoriteFilter from "components/FavoriteFilter/FavoriteFilter"
import { useGetFavoritesQuery } from "redux/api/user"
import FavoriteList from "components/FavoriteList/FavoriteList"
import ToggleBtn from "components/ui/btns/ToggleBtn/ToggleBtn"
import DisplayTags from "components/ui/DisplayTags/DisplayTags"

interface IFavoriteInnerProps {
  addClass?: string
}

const FavoriteInner: React.FC<IFavoriteInnerProps> = ({ addClass }) => {
  const {
    user: { type: userType },
  } = useAuth()

  const { data: initialFavList, isLoading } = useGetFavoritesQuery()

  const [favList, setFavList] = useState([])
  const [filtered, setFiltered] = useState(false)
  const [isFilterOpen, setFilterOpen] = useState<boolean>(false)
  const [activeTabId, setActiveTabId] = useState(1)
  const [tabData, setTabData] = useState([
    { id: 1, txt: "Experts", tabUserType: 2, count: 0, searchPlaceholder: "Favorite Expert..." },
    {
      id: 2,
      txt: "Project managers",
      tabUserType: 3,
      count: 0,
      userType: [1, 2],
      searchPlaceholder: "Favorite Project Manager...",
    },
    { id: 3, txt: "Clients", tabUserType: 1, count: 0, userType: [2, 3], searchPlaceholder: "Favorite Client..." },
  ])
  const [tabNames, setTabNames] = useState<string[]>([])
  const [filterState, setFilterState] = useState([
    {
      id: 1,
      search: "",
      checkedAreas: [],
    },
    {
      id: 2,
      search: "",
      checkedAreas: [],
    },
    {
      id: 3,
      search: "",
      checkedAreas: [],
    },
  ])
  const [checkedNum, setCheckedNum] = useState<number>(0)

  useEffect(() => {
    const names = []
    setTabData((prev) => {
      return [...prev].filter((tab) => {
        if (!tab?.userType || tab.userType.includes(userType)) {
          names.push(tab.txt)
          return tab
        }
      })
    })
    setTabNames(names)
  }, [userType])
  useEffect(() => {
    if (!initialFavList) return
    setTabData((prev) => {
      return [...prev].map((tab) => {
        tab.count = initialFavList.filter((favItem) => favItem.type === tab.tabUserType).length || 0
        return tab
      })
    })
  }, [initialFavList])

  useEffect(() => {
    const currentTab = tabData.filter((tab) => tab.id === activeTabId)
    setFavList(initialFavList?.filter((favItem) => favItem.type === currentTab[0].tabUserType))
  }, [initialFavList, activeTabId])

  useEffect(() => {
    const currentTab = tabData.filter((tab) => tab.id === activeTabId)
    const currentFilter = filterState?.filter((item) => item.id === activeTabId)[0]
    const filterSearchVal = currentFilter?.search.toLocaleLowerCase()
    let outputFavList = initialFavList?.filter((favItem) => favItem.type === currentTab[0].tabUserType)
    if (filterSearchVal?.length) {
      outputFavList = outputFavList?.filter(
        (favItem) =>
          favItem.name.toLocaleLowerCase().includes(filterSearchVal) ||
          favItem?.surname?.toLocaleLowerCase().includes(filterSearchVal)
      )
    }

    if (currentFilter.checkedAreas.length) {
      outputFavList = outputFavList?.filter((favItem) => {
        if (activeTabId === 1) {
          // Experts
          return currentFilter.checkedAreas.find(
            (checkItem) =>
              checkItem.id ===
              favItem.job_roles?.find((job) => job.area_expertise_id === checkItem.id)?.area_expertise_id
          )
        }
        if (activeTabId === 2) {
          // PM
          return currentFilter.checkedAreas.find(
            (checkItem) => checkItem.id === favItem.project_directions?.find((dir) => dir.id === checkItem.id)?.id
          )
        }
      })
    }

    setFavList(outputFavList)

    if (filterSearchVal?.length || currentFilter.checkedAreas.length) {
      setFiltered(true)
    } else {
      setFiltered(false)
    }
  }, [filterState, initialFavList, activeTabId])

  useEffect(() => {
    const currentFilter = filterState?.filter((item) => item.id === activeTabId)[0]
    let outputNumber = 0
    if (currentFilter?.search?.length > 0) outputNumber++
    if (currentFilter?.checkedAreas.length > 0) outputNumber = outputNumber + currentFilter.checkedAreas.length
    setCheckedNum(outputNumber)
  }, [filterState, activeTabId])

  const handleClear = () => {
    setFilterState((prev) => {
      return [...prev].map((item) => {
        if (item.id === activeTabId) {
          item.search = ""
          item.checkedAreas = []
        }
        return item
      })
    })
  }

  return (
    <div className={`${addClass ? addClass : ""}`}>
      <TabsLinear
        list={tabData}
        activeId={activeTabId}
        onClick={(id) => {
          setActiveTabId(id)
        }}
      />

      <div className={`${isFilterOpen ? styles["fav-filter--is-open"] : ""}`}>
        <div className={styles["fav-filter__header"]}>
          <ToggleBtn
            txt={`Filters ${checkedNum > 0 ? "(" + checkedNum + ")" : ""}`}
            isActive={!isFilterOpen}
            onClick={() => {
              setFilterOpen((prev) => !prev)
            }}
            addClass={styles["fav-filter__toggle-selected-btn"]}
            img={"assets/icons/arr-up-black.svg"}
          />
          {checkedNum > 0 && (
            <button className={styles["fav-filter__header-btn-clear"]} onClick={handleClear}>
              Clear all
            </button>
          )}
        </div>
        <div className={styles["fav-filter__wrap"]}>
          <FavoriteFilter
            searchPlaceholder={tabData.filter((tab) => tab.id === activeTabId)[0].searchPlaceholder}
            filterState={filterState}
            setFilterState={setFilterState}
            tabData={tabData}
            activeTabId={activeTabId}
            tabNames={tabNames}
            handleClear={handleClear}
            favList={favList}
            initialFavList={initialFavList}
          />
          <DisplayTags
            className={styles["fav-filter__tags-wrap"]}
            tagsList={filterState?.filter((item) => item.id === activeTabId)[0].checkedAreas}
            onClose={(id) => {
              setFilterState((prev) => {
                return [...prev].map((item) => {
                  if (item.id === activeTabId) {
                    item.checkedAreas = item.checkedAreas.filter((checkItem) => checkItem.id !== id)
                  }
                  return item
                })
              })
            }}
          />
        </div>
      </div>

      <FavoriteList favList={favList} filtered={filtered} isLoading={isLoading} />
    </div>
  )
}

export default FavoriteInner
