import styles from "./ProjectsFilter.module.scss"
import {
  useGetManagerProjectCategoriesQuery,
  useLazyGetExecutorJobRolesQuery,
  useLazyGetManagerProjectCategoriesQuery,
} from "redux/api/project"
import { useEffect, useMemo, useRef, useState } from "react"
import SelectDropBlock from "../../ui/SelectDropBlock/SelectDropBlock"
import Checkbox from "../../ui/Checkbox/Checkbox"
import InputSearch from "../../ui/InputSearch/InputSearch"
import SelectBlock from "../../ui/SelectBlock/SelectBlock"
import { clearEmptiesFromObject } from "utils/clearEmptiesFromObject"
import DefaultBtn from "../../ui/btns/DefaultBtn/DefaultBtn"
import ToggleBtn from "../../ui/btns/ToggleBtn/ToggleBtn"
import TagItem from "../../ui/TagItem/TagItem"
import { useAppDispatch, useAppSelector } from "hooks"
import { clearFilter, selectBoardFilter, setFilter } from "redux/slices/boardFilter"
import { ProjectsIncomingParams } from "types/project"
import { useAuth } from "hooks/useAuth"
import { useLazyGetVacanciesSalaryQuery } from "redux/api/team"
import RangeSliderBlock from "components/ui/RangeSliderBlock/RangeSliderBlock"
import { USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"

interface Props {
  data?: any
  searchFunc?(args: ProjectsIncomingParams | void): void
  addClass?: string
}

const ProjectsFilter: React.FC<Props> = ({ data, searchFunc, addClass }) => {
  const {
    user: { id: userID, type: userType, job_roles },
  } = useAuth()
  const dispatch = useAppDispatch()
  const filterParams = useAppSelector(selectBoardFilter)

  const [getManagerProjectCategories, { data: categoriesListManager }] = useLazyGetManagerProjectCategoriesQuery()
  const [getExecutorJobRoles, { data: categoriesListExecutor }] = useLazyGetExecutorJobRolesQuery()
  const [getVacanciesSalary, { data: vacanciesSalary }] = useLazyGetVacanciesSalaryQuery()

  const [categoriesList, setCategoriesList] = useState(null)
  const [isInnerOpen, setInnerOpen] = useState("")
  const [isSelectOpen, setSelectOpen] = useState(false)
  const [checkedCategories, setCheckedCategories] = useState([])
  const [rangeValues, setRangeValues] = useState(null)
  const [isFilterOpen, setFilterOpen] = useState<boolean>(false)
  const [selectedFilters, setSelectedFilters] = useState<number>(0)

  useEffect(() => {
    if (userType === USER_TYPE_EXPERT) {
      getExecutorJobRoles()
      getVacanciesSalary({ job_roles: job_roles.map(({ id }) => id) })
    } else {
      getManagerProjectCategories()
    }
  }, [])
  useEffect(() => {
    if (categoriesListManager?.length) setCategoriesList(categoriesListManager)
    if (categoriesListExecutor?.length) setCategoriesList(categoriesListExecutor)
  }, [categoriesListManager, categoriesListExecutor])

  useEffect(() => {
    if (!isSelectOpen) {
      setTimeout(() => {
        setInnerOpen("")
      }, 200)
    }
  }, [isSelectOpen])

  useEffect(() => {
    if (searchFunc) {
      if (userType === USER_TYPE_EXPERT) {
        if (!filterParams.job_roles.length) {
          searchFunc(clearEmptiesFromObject({ ...filterParams, job_roles: job_roles.map(({ id }) => id) }))
        } else {
          searchFunc(clearEmptiesFromObject(filterParams))
        }
      } else {
        searchFunc(clearEmptiesFromObject(filterParams))
      }
    }
  }, [filterParams, searchFunc])

  useEffect(() => {
    if (!vacanciesSalary) return
    setRangeValues(vacanciesSalary)
  }, [vacanciesSalary])

  const categoriesListBlock = useMemo(() => {
    if (!categoriesList?.length) return null

    const li = categoriesList.map((item) => {
      const innerCategory = userType === USER_TYPE_EXPERT ? item.roles : item.categories
      const li2 = innerCategory.map((category) => (
        <li key={category.id} className={`${styles["ul__li--inner"]}`}>
          <Checkbox
            name={category.name}
            text={category.name}
            value={category.id}
            checked={checkedCategories.filter((i) => i.id === category.id).length > 0}
            onChange={(e) => {
              if (e.target.checked) {
                setCheckedCategories((prevState) => [...prevState, category])
                if (userType === USER_TYPE_EXPERT) {
                  dispatch(
                    setFilter({
                      job_roles: [...filterParams.job_roles, category.id],
                    })
                  )
                } else {
                  dispatch(
                    setFilter({
                      project_categories: [...filterParams.project_categories, category.id],
                    })
                  )
                }
              } else {
                setCheckedCategories((prevState) => prevState.filter((i) => i.id !== category.id))
                if (userType === USER_TYPE_EXPERT) {
                  dispatch(
                    setFilter({
                      job_roles: filterParams.job_roles.filter((id) => id !== category.id),
                    })
                  )
                } else {
                  dispatch(
                    setFilter({
                      project_categories: filterParams.project_categories.filter((id) => id !== category.id),
                    })
                  )
                }
              }
            }}
          />
        </li>
      ))

      if (categoriesList.length < 2) return li2
      return (
        <li
          key={item.id}
          className={`${styles["ul__li"]} ${isInnerOpen === item.name ? styles["ul__li--active"] : ""}`}
        >
          <button
            className={styles["ul__main-btn"]}
            type="button"
            onClick={() => {
              setInnerOpen(item.name)
            }}
          >
            {item.name}
          </button>
          {innerCategory.length ? (
            <ul className={styles["ul__inner"]}>
              <li className={styles["ul__li--inner-btn"]}>
                <button
                  type="button"
                  className={styles["ul__inner-btn"]}
                  onClick={() => {
                    setInnerOpen("")
                  }}
                >
                  <span>
                    <svg width="10" height="6" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.396447 0.146447C0.591709 -0.0488155 0.908291 -0.0488155 1.10355 0.146447L7 6.04289L12.8964 0.146447C13.0917 -0.0488155 13.4083 -0.0488155 13.6036 0.146447C13.7988 0.341709 13.7988 0.658291 13.6036 0.853553L7.35355 7.10355C7.15829 7.29882 6.84171 7.29882 6.64645 7.10355L0.396447 0.853553C0.201184 0.658291 0.201184 0.341709 0.396447 0.146447Z"
                      />
                    </svg>
                  </span>
                  {item.name}
                </button>
              </li>
              {li2}
            </ul>
          ) : (
            ""
          )}
        </li>
      )
    })

    return <ul className={`${styles["ul"]} ${isInnerOpen ? styles["ul--inner-active"] : ""}`}>{li}</ul>
  }, [categoriesList, checkedCategories, isInnerOpen])

  const rangeSlider = useMemo(() => {
    if (userType === USER_TYPE_PM || !vacanciesSalary) return null
    return (
      <div className={styles["range-block"]}>
        <RangeSliderBlock
          values={filterParams.hourly_pay.length > 0 ? filterParams.hourly_pay : vacanciesSalary}
          min={vacanciesSalary[0]}
          max={vacanciesSalary[1]}
          suffix={"$"}
          onAfterChange={(val) => {
            dispatch(setFilter({ hourly_pay: val }))
          }}
        />
      </div>
    )
  }, [rangeValues, vacanciesSalary, filterParams.hourly_pay])

  const dateOptions = [
    { id: 1, value: "all", label: "During all this time" },
    { id: 2, value: "month", label: "Per month" },
    { id: 3, value: "week", label: "Per week" },
    { id: 4, value: "3_days", label: "Per three days" },
  ]
  const [dateSelectData, setDateSelectData] = useState({ id: 0, value: "", label: "" })

  const onSelectChange = (val) => {
    setDateSelectData(val)
    dispatch(
      setFilter({
        date: val.value,
      })
    )
  }

  const tagsBtnsRef = useRef()
  const [isToggleBtnVisible, setToggleBtnVisible] = useState(false)
  const [isToggleBtnActive, setToggleBtnActive] = useState(false)
  const handleClear = () => {
    setDateSelectData({ id: 0, value: "", label: "" })
    setCheckedCategories([])
    if (userType === USER_TYPE_EXPERT) setRangeValues(vacanciesSalary)
    dispatch(clearFilter())
  }
  useEffect(() => {
    if (!tagsBtnsRef?.current) return
    const tagRef = tagsBtnsRef.current as HTMLElement
    setToggleBtnVisible(tagRef.offsetHeight > 50)
    if (tagRef.offsetHeight < 50) setToggleBtnActive(false)
  }, [checkedCategories, dateSelectData])

  useEffect(() => {
    let outputNumber = 0
    if (filterParams?.search.length > 0) outputNumber++
    if (checkedCategories?.length > 0) outputNumber = outputNumber + checkedCategories.length
    if (dateSelectData?.label) outputNumber++
    if (filterParams?.hourly_pay.length > 0) outputNumber++
    setSelectedFilters(outputNumber)
  }, [filterParams.search, checkedCategories, dateSelectData, filterParams.hourly_pay])

  return (
    <div className={`${addClass ? addClass : ""} ${styles.filter} ${isFilterOpen ? styles["filter--is-open"] : ""}`}>
      <div className={styles.filter__header}>
        <ToggleBtn
          txt={`Filters ${selectedFilters ? "(" + selectedFilters + ")" : ""}`}
          addClass={styles["filter__toggle-selected-btn"]}
          isActive={!isFilterOpen}
          img={"assets/icons/arr-up-black.svg"}
          onClick={() => {
            setFilterOpen((prev) => !prev)
          }}
        />
        {selectedFilters > 0 && (
          <button className={styles["filter__header-btn-clear"]} onClick={handleClear}>
            Clear all
          </button>
        )}
      </div>
      <div className={styles.filter__wrap}>
        <div className={styles.filter__main}>
          <InputSearch
            isDrop
            value={filterParams.search}
            dropData={data}
            addClass={`${styles.filter__item} ${styles.filter__search}`}
            searchBy={"order"}
            onChange={(val) => {
              dispatch(
                setFilter({
                  search: val,
                })
              )
            }}
          />
          <SelectDropBlock
            placeholder={`Categories ${checkedCategories?.length ? "(" + checkedCategories.length + ")" : ""}`}
            child={categoriesListBlock}
            isSelectOpen={isSelectOpen}
            setSelectBlockOpen={setSelectOpen}
            isFilled={checkedCategories.length > 0}
            disabled={!categoriesList?.length}
            addClass={`${styles.filter__item} ${styles.filter__category}`}
          />
          <SelectBlock
            placeholder={"Publication date"}
            options={dateOptions}
            value={dateOptions.filter((i) => i.id === dateSelectData.id)}
            onChange={onSelectChange}
            addClass={
              dateSelectData.label
                ? `${styles.filter__item} ${styles.filter__date} ${styles["select-active"]}`
                : `${styles.filter__item} ${styles.filter__date}`
            }
          />
          {userType === USER_TYPE_EXPERT && (
            <SelectDropBlock
              placeholder={`${
                filterParams.hourly_pay.length > 0
                  ? "$" + filterParams.hourly_pay[0] + " - $" + filterParams.hourly_pay[1]
                  : "Hourly rate"
              }`}
              isFilled={filterParams.hourly_pay.length > 0}
              child={rangeSlider}
              addClass={`${styles.filter__item} ${styles.filter__range}`}
            />
          )}
          <DefaultBtn
            txt={"Clear all"}
            mod={"transparent-grey"}
            addClass={styles["btn-clear"]}
            minWidth={false}
            disabled={
              checkedCategories.length > 0 ||
              dateSelectData.label ||
              filterParams.search ||
              filterParams.hourly_pay.length > 0
                ? undefined
                : true
            }
            onClick={handleClear}
          />
        </div>
        {(checkedCategories.length > 0 || dateSelectData.label) && (
          <div className={`${styles.filter__tags} ${isToggleBtnActive ? styles["filter__tags--shown-all"] : ""}`}>
            <div ref={tagsBtnsRef} className={styles["filter__tags-main"]}>
              {checkedCategories.map((item) => {
                return (
                  <TagItem
                    key={item.id}
                    id={item.id}
                    txt={item.name}
                    addClass={styles["btn-tag"]}
                    mod={"gray"}
                    onClose={() => {
                      setCheckedCategories((prevState) => prevState.filter((i) => i.id !== item.id))
                      if (userType === USER_TYPE_EXPERT) {
                        dispatch(
                          setFilter({
                            job_roles: filterParams.job_roles.filter((id) => id !== item.id),
                          })
                        )
                      } else {
                        dispatch(
                          setFilter({
                            project_categories: filterParams.project_categories.filter((id) => id !== item.id),
                          })
                        )
                      }
                    }}
                  />
                )
              })}
              {dateSelectData.label && (
                <TagItem
                  id={dateSelectData.id}
                  txt={dateSelectData.label}
                  addClass={styles["btn-tag"]}
                  mod={"gray"}
                  onClose={() => {
                    setDateSelectData({ id: 0, value: "", label: "" })
                    dispatch(
                      setFilter({
                        date: "",
                      })
                    )
                  }}
                />
              )}
            </div>
            {isToggleBtnVisible && (
              <ToggleBtn
                txt={`${isToggleBtnActive ? "Hide" : "Show all"}`}
                isActive={isToggleBtnActive}
                addClass={styles["filter__toggle-btn"]}
                onClick={() => {
                  setToggleBtnActive(!isToggleBtnActive)
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsFilter
