import styles from "./Filter.module.scss"
import React, { useEffect, useState } from "react"
import InputSearch from "components/ui/InputSearch/InputSearch"
import { IExecutorListParams } from "types/team"
import { clearEmptiesFromObject } from "utils/clearEmptiesFromObject"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import FilterSelect from "components/ui/Filter/FilterSelect/FilterSelect"
import FilterRange from "components/ui/Filter/FilterRange/FilterRange"
import ToggleBtn from "components/ui/btns/ToggleBtn/ToggleBtn"

interface IFilterProps {
  searchFunc(args: IExecutorListParams | void): void
  options: {
    search?: boolean
    selectLang?: boolean
    selectAreasExpertise?: boolean
    selectCategories?: number
    selectSkills?: boolean
    selectProfessions?: boolean
    rangeRating?: boolean
    rangeRate?: boolean
    rangeJobs?: boolean
  }
}

const Filter: React.FC<IFilterProps> = ({ searchFunc, options }) => {
  const [selectedState, setSelectedState] = useState(null)
  const [isFilterOpen, setFilterOpen] = useState<boolean>(false)
  const [selectedFilters, setSelectedFilters] = useState<number>(0)

  useEffect(() => {
    if (!searchFunc || selectedState === null) return
    searchFunc(clearEmptiesFromObject(selectedState))
  }, [searchFunc, selectedState])

  useEffect(() => {
    let outputNumber = 0
    if (selectedState?.search?.length > 0) outputNumber++
    if (selectedState?.areas_expertise?.length > 0) outputNumber++
    if (selectedState?.job_roles?.length > 0) outputNumber++
    if (selectedState?.skills?.length > 0) outputNumber++
    if (selectedState?.hourly_pay_min || selectedState?.hourly_pay_max) outputNumber++
    if (selectedState?.rating_min || selectedState?.rating_max) outputNumber++
    if (selectedState?.job_count_min || selectedState?.job_count_max) outputNumber++
    if (selectedState?.languages?.length > 0) outputNumber++
    if (selectedState?.project_categories?.length > 0) outputNumber++
    setSelectedFilters(outputNumber)
  }, [selectedState])

  const handleClear = () => {
    setSelectedState(null)
    searchFunc()
  }

  return (
    <div className={`${styles.filter} ${isFilterOpen ? styles["filter--is-open"] : ""}`}>
      <div className={styles.filter__header}>
        <ToggleBtn
          txt={`Filters ${selectedFilters ? "(" + selectedFilters + ")" : ""}`}
          addClass={styles["filter__toggle-selected-btn"]}
          isActive={!isFilterOpen}
          img={"/assets/icons/arr-up-black.svg"}
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
          {options.search && (
            <InputSearch
              value={selectedState?.search}
              onChange={(val) => {
                setSelectedState((prev) => {
                  return { ...prev, search: val }
                })
              }}
            />
          )}

          {options.selectAreasExpertise && (
            <FilterSelect
              type={"areas_expertise"}
              placeholder={"Areas of Expertise"}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              checkedLength={selectedState?.areas_expertise?.length}
            />
          )}

          {options.selectCategories !== 0 && options.selectCategories && (
            <FilterSelect
              type={"project_categories"}
              typeValue={options.selectCategories}
              placeholder={"Categories"}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              checkedLength={selectedState?.project_categories}
            />
          )}

          {options.selectProfessions && (
            <FilterSelect
              type={"job_roles"}
              placeholder={"Profession"}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
            />
          )}

          {options.selectSkills && (
            <FilterSelect
              type={"skills"}
              placeholder={"Skills"}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              checkedLength={selectedState?.skills?.length}
            />
          )}

          {options.rangeRate && (
            <FilterRange
              type={"hourly_pay"}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              suffix={"$"}
              placeholder={"Hourly rate"}
              addClass={styles.filter__range}
              checkedString={
                selectedState?.hourly_pay_min || selectedState?.hourly_pay_max
                  ? "$" + selectedState?.hourly_pay_min + " - $" + selectedState?.hourly_pay_max
                  : ""
              }
            />
          )}

          {options.rangeRating && (
            <FilterRange
              type={"rating"}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              limits={[0, 5]}
              placeholder={"Rating"}
              addClass={styles.filter__range}
              checkedString={
                selectedState?.rating_min || selectedState?.rating_max
                  ? "Rating (" + selectedState?.rating_min + " - " + selectedState?.rating_max + ")"
                  : ""
              }
            />
          )}
          {options.rangeJobs && (
            <>
              <FilterRange
                type={"job_count"}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                placeholder={"Total jobs"}
                addClass={styles.filter__range}
                checkedString={
                  selectedState?.job_count_min || selectedState?.job_count_max
                    ? "Jobs (" + selectedState?.job_count_min + " - " + selectedState?.job_count_max + ")"
                    : ""
                }
              />
            </>
          )}

          {options.selectLang && (
            <FilterSelect
              type={"languages"}
              placeholder={"Language"}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              checkedLength={selectedState?.languages?.length}
            />
          )}
        </div>
      </div>
      <DefaultBtn
        txt={"Clear all"}
        mod={"transparent-grey"}
        minWidth={false}
        addClass={styles["filter__btn-clear"]}
        disabled={clearEmptiesFromObject(selectedState) ? undefined : true}
        onClick={handleClear}
      />
    </div>
  )
}

export default Filter
