import SelectDropBlock from "components/ui/SelectDropBlock/SelectDropBlock"
import React, { useMemo, useState } from "react"
import styles from "./DirectCatsAdd.module.scss"
import IconCaretLeft from "public/icons/caret-left-icon.svg"
import { useGetCategoriesQuery, useGetDirectionsQuery } from "redux/api/content"
import IcontitleAndTags from "components/IcontitleAndTags/IcontitleAndTags"
import Checkbox from "components/ui/Checkbox/Checkbox"

interface IDirectCatsAddProps {
  formik: any
  selectPlaceholderTxt?: string
  addClass?: string
  max: number
}

const DirectCatsAdd: React.FC<IDirectCatsAddProps> = ({ formik, selectPlaceholderTxt, addClass, max }) => {
  const { data: directionsAll } = useGetDirectionsQuery()
  const { data: categories } = useGetCategoriesQuery()

  const [isRoleOpen, setRoleOpen] = useState(false)
  const [selectCategoryList, setSelectCategoryList] = useState([])
  const [selectedDirection, setSelectedDirection] = useState({
    id: null,
    name: "",
  })
  const selectDirection = (id, name) => {
    setSelectedDirection({
      id: id,
      name: name,
    })
    if (categories) {
      setSelectCategoryList(categories.filter((category) => category.project_direction_id === id))
    }
  }
  const clearDirection = () => {
    setSelectedDirection({
      id: null,
      name: "",
    })
    setSelectCategoryList([])
  }
  const deleteCategoryFcn = (id) => {
    const mewDirs = formik.values.project_direction.filter((dir) => dir.id !== id)
    formik.setFieldValue("project_direction", mewDirs)

    formik.setFieldValue(
      "project_categories",
      formik.values.project_categories.filter((cat) => mewDirs.map((dir) => dir.id).includes(cat.project_direction_id))
    )
  }

  const RenderSelectDropdown = useMemo(() => {
    return (
      <>
        {selectedDirection?.name?.length ? (
          <div className={`${styles["calc-select-dropdown2"]} `}>
            <div onClick={clearDirection} className={`${styles["calc-select-dropdown2__name"]}`}>
              <IconCaretLeft />
              {selectedDirection.name}
            </div>

            <ul>
              {selectCategoryList.map((category) => {
                return (
                  <li key={category.id} className={`${styles["ul__li--inner"]}`}>
                    <Checkbox
                      name={category.name}
                      text={category.name}
                      value={category.id}
                      checked={formik.values.project_categories.filter((i) => i.id === category.id).length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (
                            !formik.values.project_direction.filter((dir) => dir.id === selectedDirection.id).length
                          ) {
                            formik.setFieldValue("project_direction", [
                              ...formik.values.project_direction,
                              directionsAll.filter((dir) => dir.id === selectedDirection.id)[0],
                            ])
                          }
                          formik.setFieldValue("project_categories", [...formik.values.project_categories, category])
                        } else {
                          if (
                            formik.values.project_categories.filter(
                              (cat) => cat.project_direction_id === selectedDirection.id
                            ).length === 1
                          ) {
                            formik.setFieldValue(
                              "project_direction",
                              formik.values.project_direction.filter((dir) => dir.id !== selectedDirection.id)
                            )
                          }
                          formik.setFieldValue(
                            "project_categories",
                            formik.values.project_categories.filter((cat) => cat.id !== category.id)
                          )
                        }
                      }}
                    />
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          <div className={`${styles["calc-select-dropdown"]}`}>
            {directionsAll?.map((direction) => {
              const isDisabled =
                formik.values?.project_direction?.length >= max &&
                !formik.values?.project_direction.filter((dir) => dir.id === direction.id).length
              return (
                <p
                  onClick={() => {
                    selectDirection(direction.id, direction.name)
                  }}
                  key={direction.id}
                  className={`${styles["calc-select-dropdown__direction"]} ${
                    isDisabled ? styles["calc-select-dropdown__direction--disabled"] : ""
                  }`}
                >
                  {direction.name}
                </p>
              )
            })}
          </div>
        )}
      </>
    )
  }, [directionsAll, categories, selectedDirection, selectCategoryList, formik.values])

  return (
    <>
      <SelectDropBlock
        placeholder={selectPlaceholderTxt ? selectPlaceholderTxt : "Choose Direction & Category"}
        addClass={`${styles.roleSkills__select} ${styles.directCats__select} ${addClass ? addClass : ""}`}
        child={RenderSelectDropdown}
        isSelectOpen={isRoleOpen}
        setSelectBlockOpen={setRoleOpen}
        editId={"directionsedit"}
      />

      {formik.errors &&
        formik.touched.project_categories &&
        formik.errors.project_categories &&
        !formik.values.project_direction.length && (
          <p className={"field-block-error"}>{formik.errors.project_categories}</p>
        )}
      <div className={styles.directCats__list}>
        {formik.values?.project_direction?.map((dir) => {
          return (
            <IcontitleAndTags
              key={dir.id}
              isDelete={true}
              title={dir.name}
              id={dir.id}
              deleteFcn={deleteCategoryFcn}
              addClass={styles.directCats__tag}
              iconId={dir.id}
              tags={
                !!formik?.values?.project_categories.length &&
                formik.values.project_categories.filter((cat) => cat.project_direction_id === dir.id)
              }
            />
          )
        })}
      </div>
    </>
  )
}

export default DirectCatsAdd
