import {
  useLazyGetCategoriesQuery,
  useLazyGetLanguagesQuery,
  useLazyGetSpecksQuery,
  useLazyGetTechsQuery,
} from "redux/api/content"
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import styles from "components/ui/Filter/Filter.module.scss"
import Checkbox from "components/ui/Checkbox/Checkbox"
import SelectDropBlock from "components/ui/SelectDropBlock/SelectDropBlock"
import { useLazyGetManagerProjectCategoriesQuery } from "redux/api/project"

interface FilterSelectProps {
  type: "languages" | "areas_expertise" | "skills" | "job_roles" | "project_categories"
  typeValue?: number
  placeholder: string
  selectedState: {
    languages?: number[]
    areas_expertise?: number[]
    skills?: number[]
    job_roles?: number[]
    project_categories?: number[]
  }
  setSelectedState: Dispatch<SetStateAction<any>>
  checkedLength?: number
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  type,
  typeValue,
  placeholder,
  selectedState,
  setSelectedState,
  checkedLength,
}) => {
  const [newPlaceholder, setNewPlaceholder] = useState(null)
  const [getLanguages, { data: languagesQuery }] = useLazyGetLanguagesQuery()
  const [getSpecks, { data: categoriesQuery }] = useLazyGetSpecksQuery() // areas_expertise
  const [getCategories, { data: categoriesData }] = useLazyGetCategoriesQuery() // project_categories
  const [getTechsQuery, { data: techsQuery }] = useLazyGetTechsQuery() // skills
  const [getManagerProjectCategories, { data: categoriesListManager }] = useLazyGetManagerProjectCategoriesQuery() // job_roles

  const [catList, setCatList] = useState([])

  useEffect(() => {
    if (type === "languages") getLanguages()
    if (type === "areas_expertise") getSpecks()
    if (type === "project_categories") getCategories()
    if (type === "skills") getTechsQuery()
    if (type === "job_roles") getManagerProjectCategories()
  }, [getLanguages, getManagerProjectCategories, getSpecks, getTechsQuery, type])

  useEffect(() => {
    if (type === "languages") setCatList(languagesQuery)
    if (type === "areas_expertise") setCatList(categoriesQuery)
    if (type === "project_categories" && categoriesData?.length > 0)
      setCatList(categoriesData.filter((cat) => cat.project_direction_id === typeValue))
    if (type === "skills") setCatList(techsQuery)
    if (type === "job_roles") setCatList(categoriesListManager)
  }, [languagesQuery, categoriesQuery, type, techsQuery, categoriesListManager, categoriesData])

  const [isInnerOpen, setInnerOpen] = useState("")
  const categoriesListBlock = useMemo(() => {
    if (!catList?.length) return null
    let selType = selectedState?.languages
    if (type === "areas_expertise") selType = selectedState?.areas_expertise
    if (type === "project_categories") selType = selectedState?.project_categories
    if (type === "skills") selType = selectedState?.skills
    if (type === "job_roles") selType = selectedState?.job_roles

    const li = catList.map((category) => {
      if (category?.categories) {
        const li2 = category.categories.map((cat) => (
          <li key={cat.id} className={`${styles["ul__li--inner"]}`}>
            <Checkbox
              name={cat.name}
              text={cat.name}
              value={cat.id}
              checked={selectedState?.job_roles?.includes(cat.id) || false}
              onChange={(e) => {
                if (e.target.checked) {
                  if (selectedState?.job_roles?.length) {
                    setSelectedState((prev) => {
                      return { ...prev, job_roles: [...prev.job_roles, cat.id] }
                    })
                  } else {
                    setSelectedState((prev) => {
                      return { ...prev, job_roles: [cat.id] }
                    })
                  }
                } else {
                  setSelectedState((prev) => {
                    return { ...prev, job_roles: prev.job_roles.filter((i) => i !== cat.id) }
                  })
                }
              }}
            />
          </li>
        ))
        if (catList.length < 2) return li2
        return (
          <li
            key={category.id}
            className={`${styles["ul__li"]} ${isInnerOpen === category.name ? styles["ul__li--active"] : ""}`}
          >
            <button
              className={styles["ul__main-btn"]}
              type="button"
              onClick={() => {
                setInnerOpen(category.name)
              }}
            >
              {category.name}
            </button>
            {category?.categories.length ? (
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
                    {category.name}
                  </button>
                </li>
                {li2}
              </ul>
            ) : (
              ""
            )}
          </li>
        )
      } else {
        return (
          <li key={category.id} className={`${styles["ul__li--inner"]}`}>
            <Checkbox
              name={category.name}
              text={category.name}
              value={category.id}
              key={category.id}
              checked={selType?.includes(category.id) || false}
              onChange={(e) => {
                switch (type) {
                  case "areas_expertise":
                    if (e.target.checked) {
                      if (selectedState?.areas_expertise?.length) {
                        setSelectedState((prev) => {
                          return { ...prev, areas_expertise: [...prev.areas_expertise, category.id] }
                        })
                      } else {
                        setSelectedState((prev) => {
                          return { ...prev, areas_expertise: [category.id] }
                        })
                      }
                    } else {
                      setSelectedState((prev) => {
                        return { ...prev, areas_expertise: prev.areas_expertise.filter((i) => i !== category.id) }
                      })
                    }
                    break
                  case "project_categories":
                    if (e.target.checked) {
                      setSelectedState((previousState) => {
                        const prev = previousState || { project_categories: [] }

                        return { ...prev, project_categories: [...prev?.project_categories, category.id] }
                      })
                      setNewPlaceholder(category.name)
                    } else {
                      setSelectedState((previousState) => {
                        const prev = previousState || { project_categories: [] }
                        return {
                          ...prev,
                          project_categories: prev.project_categories
                            ? prev.project_categories.filter((categoryId) => categoryId !== category.id)
                            : [],
                        }
                      })
                      setNewPlaceholder(null)
                    }
                    break
                  case "languages":
                    if (e.target.checked) {
                      if (selectedState?.languages?.length) {
                        setSelectedState((prev) => {
                          return { ...prev, languages: [...prev.languages, category.id] }
                        })
                      } else {
                        setSelectedState((prev) => {
                          return { ...prev, languages: [category.id] }
                        })
                      }
                    } else {
                      setSelectedState((prev) => {
                        return { ...prev, languages: prev.languages.filter((i) => i !== category.id) }
                      })
                    }
                    break
                  case "skills":
                    if (e.target.checked) {
                      if (selectedState?.skills?.length) {
                        setSelectedState((prev) => {
                          return { ...prev, skills: [...prev.skills, category.id] }
                        })
                      } else {
                        setSelectedState((prev) => {
                          return { ...prev, skills: [category.id] }
                        })
                      }
                    } else {
                      setSelectedState((prev) => {
                        return { ...prev, skills: prev.skills.filter((i) => i !== category.id) }
                      })
                    }
                    break
                }
              }}
            />
          </li>
        )
      }
    })

    return <ul className={`${styles["ul"]} ${isInnerOpen ? styles["ul--inner-active"] : ""}`}>{li}</ul>
  }, [
    catList,
    selectedState?.languages,
    selectedState?.areas_expertise,
    selectedState?.skills,
    selectedState?.job_roles,
    selectedState?.project_categories,
    type,
    isInnerOpen,
    setSelectedState,
  ])

  return (
    <SelectDropBlock
      placeholder={`${
        type === "project_categories" && newPlaceholder && checkedLength > 0 ? newPlaceholder : placeholder
      } ${checkedLength && type !== "project_categories" ? "(" + checkedLength + ")" : ""}`}
      child={categoriesListBlock}
      isFilled={checkedLength > 0}
    />
  )
}

export default FilterSelect
