import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import RangeSliderBlock from "components/ui/RangeSliderBlock/RangeSliderBlock"
import SelectDropBlock from "components/ui/SelectDropBlock/SelectDropBlock"
import { useLazyGetExecutorsSalaryLimitsQuery } from "redux/api/team"
import { useLazyGetCatalogTeamsFiltersQuery } from "redux/api/pmteam"

interface IFilterRangeProps {
  type: "hourly_pay" | "rating" | "job_count"
  addClass?: string
  selectedState: {
    rating_min?: number
    rating_max?: number
    hourly_pay_min?: number
    hourly_pay_max?: number
    job_count_min?: number
    job_count_max?: number
  }
  setSelectedState: Dispatch<SetStateAction<any>>
  limits?: number[]
  placeholder: string
  suffix?: string
  checkedString?: string
}

const FilterRange: React.FC<IFilterRangeProps> = ({
  type,
  addClass,
  selectedState,
  setSelectedState,
  limits,
  placeholder,
  suffix,
  checkedString,
}) => {
  const [getExecutorsSalaryLimits, { data: executorsSalaryLimits }] = useLazyGetExecutorsSalaryLimitsQuery()
  const [getCatalogTeamsLimits, { data: catTeamsLimits, isFetching }] = useLazyGetCatalogTeamsFiltersQuery()

  const [limitsValue, setLimitsValue] = useState<number[]>([])

  useEffect(() => {
    if (type === "hourly_pay") getExecutorsSalaryLimits()
    if (type === "job_count") getCatalogTeamsLimits()
  }, [getExecutorsSalaryLimits, getCatalogTeamsLimits, type])

  useEffect(() => {
    if (type === "hourly_pay" && !executorsSalaryLimits?.length) return
    if (type === "job_count" && !catTeamsLimits?.jobs_count?.length) return
    if (type === "hourly_pay") {
      setLimitsValue(executorsSalaryLimits)
    } else if (limits?.length) {
      setLimitsValue(limits)
    } else if (type === "job_count") {
      setLimitsValue(catTeamsLimits.jobs_count)
    }
  }, [limits, executorsSalaryLimits, catTeamsLimits, type])

  const rangeBlock = useMemo(() => {
    if (!limitsValue.length) return null
    let selType = [
      selectedState?.rating_min ? selectedState.rating_min : limitsValue[0],
      selectedState?.rating_max ? selectedState.rating_max : limitsValue[1],
    ]
    if (type === "hourly_pay") {
      selType = [
        selectedState?.hourly_pay_min ? selectedState.hourly_pay_min : limitsValue[0],
        selectedState?.hourly_pay_max ? selectedState.hourly_pay_max : limitsValue[1],
      ]
    }
    if (type === "job_count") {
      selType = [
        selectedState?.job_count_min ? selectedState.job_count_min : limitsValue[0],
        selectedState?.job_count_max ? selectedState.job_count_max : limitsValue[1],
      ]
    }
    return (
      <RangeSliderBlock
        values={selType}
        min={limitsValue[0]}
        max={limitsValue[1]}
        suffix={suffix}
        onAfterChange={(val) => {
          switch (type) {
            case "rating":
              setSelectedState((prev) => {
                return { ...prev, rating_min: val[0], rating_max: val[1] }
              })
              break
            case "hourly_pay":
              setSelectedState((prev) => {
                return { ...prev, hourly_pay_min: val[0], hourly_pay_max: val[1] }
              })
            case "job_count":
              setSelectedState((prev) => {
                return { ...prev, job_count_min: val[0], job_count_max: val[1] }
              })
              break
          }
        }}
      />
    )
  }, [
    limitsValue,
    selectedState?.rating_min,
    selectedState?.rating_max,
    selectedState?.hourly_pay_min,
    selectedState?.hourly_pay_max,
    selectedState?.job_count_min,
    selectedState?.job_count_max,
    type,
    suffix,
    setSelectedState,
  ])

  return (
    <>
      {rangeBlock && (
        <SelectDropBlock
          placeholder={checkedString ? checkedString : placeholder}
          child={rangeBlock}
          addClass={addClass}
          isFilled={checkedString?.length > 0}
        />
      )}
    </>
  )
}

export default FilterRange
