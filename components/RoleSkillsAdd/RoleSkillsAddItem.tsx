import styles from "components/RoleSkillsAdd/RoleSkillsAdd.module.scss"
import SelectDropBlock from "components/ui/SelectDropBlock/SelectDropBlock"
import { USER_TYPE_EXPERT } from "utils/constants"
import NumberFormat from "react-number-format"
import TagItem from "components/ui/TagItem/TagItem"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { useAuth } from "hooks/useAuth"
import IconCaretLeft from "public/icons/caret-left-icon.svg"
import { useLazyGetTechsQuery } from "redux/api/content"
import Checkbox from "components/ui/Checkbox/Checkbox"
import RoleSkillsAddNew from "components/RoleSkillsAdd/RoleSkillsAddNew"
import IcontitleAndTags from "components/IcontitleAndTags/IcontitleAndTags"
import { Speck, Stack } from "types/content"

interface IRoleSkillsAddItemProps {
  formik: any
  directionsList: Speck[]
  stacksList: Stack[]
  roleId?: number
  roleIdEdite?: number
  setRoleIdEdite?: Dispatch<SetStateAction<number>>
  max: number
}

const RoleSkillsAddItem: React.FC<IRoleSkillsAddItemProps> = ({
  formik,
  directionsList,
  stacksList,
  roleId,
  roleIdEdite,
  setRoleIdEdite,
  max,
}) => {
  const {
    user: { type: userType },
  } = useAuth()

  const [getTechsQuery, { data: techIncoming }] = useLazyGetTechsQuery()

  const [step, setStep] = useState(1)
  const [isRoleOpen, setRoleOpen] = useState(false)
  const [selectedMainDirection, setSelectedMainDirection] = useState("") // выбираем категорию ролей
  const [selectExpertsList, setSelectExpertsList] = useState([])
  const [selectedRole, setSelectedRole] = useState("")
  const [selectSkillsList, setSelectSkillsList] = useState([]) // скилы
  const [checkedSkills, setCheckedSkills] = useState([]) // выбранные скилы
  const [hourlyRate, setHourlyRate] = useState(null)
  const [selectedRoleAreaExpertise, setSelectedRoleAreaExpertise] = useState(null)

  useEffect(() => {
    setSelectSkillsList(techIncoming)
  }, [techIncoming])

  useEffect(() => {
    if (roleIdEdite !== roleId) setStep(1)
  }, [roleIdEdite])

  const onSelectDellItem = (id) => {
    setCheckedSkills((prevVal) => prevVal.filter((el) => el.id !== id))
  }
  const clearDirection = () => {
    setSelectedMainDirection("")
    setSelectExpertsList([])
  }
  const selectDirection = (id, name) => {
    setSelectedMainDirection(name)
    if (stacksList) {
      const jobRolesNames = []
      if (formik.values?.job_roles) {
        formik.values.job_roles.forEach((el) => {
          jobRolesNames.push(el.name)
          // if (roleIdEdite && roleIdEdite === el.id) {
          //   if (selectedRole !== el.name) {
          //     jobRolesNames = jobRolesNames?.filter((i) => i !== el.name)
          //   }
          // }
        })
      }
      setSelectExpertsList(
        stacksList.filter((expert) => expert.area_expertise_id === id && !jobRolesNames.includes(expert.name))
      )
    }
  }

  const handleSave = () => {
    let newSkillsArr = []
    if (roleIdEdite) {
      newSkillsArr = [
        ...formik.values.job_roles.map((job) => {
          if (job.id === roleIdEdite) {
            return {
              name: selectedRole,
              skills: checkedSkills,
              id: checkedSkills[0].job_role_id,
              hourly_pay: hourlyRate,
              area_expertise_id: selectedRoleAreaExpertise,
            }
          }
          return job
        }),
      ]
    }
    if (formik.values.job_roles?.length < max) {
      newSkillsArr = [
        ...formik.values.job_roles,
        {
          name: selectedRole,
          skills: checkedSkills,
          id: checkedSkills[0].job_role_id,
          hourly_pay: hourlyRate,
          area_expertise_id: selectedRoleAreaExpertise,
        },
      ]
    }
    if (newSkillsArr.length) formik.setFieldValue("job_roles", newSkillsArr)
    // const formikSkills = formik.values.job_roles
    // Есть ли уже такая роль
    // const skillSet = !!formikSkills.filter((el) => el.id === checkedSkills[0].job_role_id).length
    // Если в списке Ролей\навыков уже есть выбранная, то обновлять её, если нет - создавать новую
    // const newSkillsArr = skillSet
    //   ? [
    //       ...formik.values.job_roles.map((skillEl) => {
    //         if (skillEl.id === checkedSkills[0].job_role_id) {
    //           return {
    //             ...skillEl,
    //             name: selectedRole,
    //             skills: checkedSkills,
    //             hourly_pay: hourlyRate,
    //           }
    //         } else {
    //           return skillEl
    //         }
    //       }),
    //     ]
    //   : [
    //       ...formik.values.job_roles,
    //       {
    //         name: selectedRole,
    //         skills: checkedSkills,
    //         id: checkedSkills[0].job_role_id,
    //         hourly_pay: hourlyRate,
    //         area_expertise_id: selectedRoleAreaExpertise,
    //       },
    //     ]
    // formik.setFieldValue("job_roles", newSkillsArr)
    setStep(1)
    setCheckedSkills([])
    setSelectedRole("")
    setSelectedRoleAreaExpertise(null)
    setSelectedMainDirection("")
    setSelectExpertsList([])
    setHourlyRate(null)
  }

  const handleDelete = () => {
    formik.setFieldValue(
      "job_roles",
      formik.values.job_roles.filter((el) => el.id !== roleId)
    )
  }

  const handleEdit = () => {
    const editEl = formik.values.job_roles.filter((el) => el.id === roleId)[0]
    setHourlyRate(editEl.hourly_pay)
    getTechsQuery(editEl.id, true).then(() => {
      selectDirection(
        editEl.area_expertise_id,
        directionsList.filter((el) => el.id === editEl.area_expertise_id)[0].name
      )
      setRoleOpen(false)
      setSelectedRole(editEl.name)
      setSelectedRoleAreaExpertise(editEl.area_expertise_id)
      setCheckedSkills(editEl.skills)
      if (roleIdEdite) {
        setRoleIdEdite(null)
        setTimeout(() => {
          setRoleIdEdite(roleId)
          setStep(3)
        }, 160)
      } else {
        setRoleIdEdite(roleId)
        setStep(3)
      }
    })
  }

  const RenderSelectDropdown = useMemo(() => {
    return (
      <>
        {selectedMainDirection?.length ? (
          <div className={`${styles["calc-select-dropdown2"]} `}>
            <div onClick={clearDirection} className={`${styles["calc-select-dropdown2__name"]}`}>
              <IconCaretLeft />
              {selectedMainDirection}
            </div>
            <div>
              {selectExpertsList?.map((expert) => {
                return (
                  <p
                    onClick={() => {
                      setRoleOpen(false)
                      // if (stacksList) {
                      //   const jobRolesNames = [] // те роли, которые не нужно показывать в селекте
                      //   if (formik.values?.job_roles) {
                      //     formik.values.job_roles.forEach((el) => {
                      //       if (el.name) {
                      //         jobRolesNames.push(el.name)
                      //         if (roleIdEdite && roleIdEdite === el.id) {
                      //           if (expert.id !== el.id) {
                      //             jobRolesNames = jobRolesNames?.filter((i) => i !== el.name)
                      //           }
                      //         }
                      //       }
                      //     })
                      //   }
                      //   jobRolesNames.push(expert.name)
                      //   setSelectExpertsList(
                      //     stacksList.filter((stack) => {
                      //       return (
                      //         stack.area_expertise_id === expert.area_expertise_id &&
                      //         !jobRolesNames.includes(stack.name)
                      //       )
                      //     })
                      //   )
                      // }
                      setSelectedRole(expert.name)
                      getTechsQuery(expert.id, true).then(() => {
                        setCheckedSkills([])
                        setStep(3)
                        // setSelectedMainDirection("")
                        setSelectedRoleAreaExpertise(expert.area_expertise_id)
                      })
                    }}
                    className={`${styles["calc-select-dropdown2__list-item"]}`}
                    key={expert.id}
                  >
                    {expert.name}
                  </p>
                )
              })}
            </div>
          </div>
        ) : (
          <div className={`${styles["calc-select-dropdown"]}`}>
            {directionsList?.map((direction) => {
              return (
                <p
                  onClick={() => {
                    selectDirection(direction.id, direction.name)
                  }}
                  key={direction.id}
                  className={`${styles["calc-select-dropdown__direction"]}`}
                >
                  {direction.name}
                </p>
              )
            })}
          </div>
        )}
      </>
    )
  }, [directionsList, stacksList, selectedMainDirection, selectExpertsList])

  const categoriesListBlock = useMemo(() => {
    if (!selectSkillsList?.length) return null
    const li = selectSkillsList.map((category) => {
      return (
        <li key={category.id} className={`${styles["ul__li--inner"]}`}>
          <Checkbox
            name={category.name}
            text={category.name}
            value={category.id}
            key={category.id}
            checked={checkedSkills.filter((i) => i.id === category.id).length > 0}
            onChange={(e) => {
              if (e.target.checked) {
                setCheckedSkills((prevState) => [...prevState, category])
              } else {
                setCheckedSkills((prevState) => prevState.filter((i) => i.id !== category.id))
              }
            }}
          />
        </li>
      )
    })

    return <ul className={`${styles["ul"]} `}>{li}</ul>
  }, [selectSkillsList, checkedSkills])

  return (
    <>
      {step > 1 && step < 4 && (
        <div className={styles.roleSkills__wp}>
          <div className={`${styles["roleSkills__box-wrp"]}`}>
            <div className={styles.roleSkills__box}>
              <div className={`${styles["profileInfo__form-label"]} ${styles.profileAddit__title}`}>Role</div>
              <SelectDropBlock
                placeholder={selectedRole !== "" ? selectedRole : "Сhoose your area of expertise and role"}
                addClass={`${styles.roleSkills__select} ${styles["roleSkills__input"]}`}
                child={RenderSelectDropdown}
                isSelectOpen={isRoleOpen}
                setSelectBlockOpen={setRoleOpen}
                isFilled={selectedRole !== ""}
              />
            </div>
            {userType === USER_TYPE_EXPERT && (
              <div className={styles.roleSkills__box}>
                <div className={`${styles["profileInfo__form-label"]} ${styles.profileAddit__title}`}>Hourly rate</div>
                <div className="input-group">
                  <NumberFormat
                    autoComplete="false"
                    className={`input-global ${hourlyRate ? "no-empty" : ""}`}
                    placeholder="$"
                    prefix={"$"}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    decimalScale={0}
                    isAllowed={(values) => {
                      const { floatValue, value } = values
                      return floatValue >= 0 && floatValue < 9999
                    }}
                  />
                  {formik.errors && formik.errors.test123 ? (
                    <p className="field-block-error">{formik.errors.test123}</p>
                  ) : null}
                </div>
              </div>
            )}
          </div>
          {step > 2 && (
            <div className={styles.roleSkills__box}>
              <div className={`${styles["profileInfo__form-label"]} ${styles.profileAddit__title}`}>Skills</div>
              <div className={styles.roleSkills__skills}>
                <SelectDropBlock
                  placeholder={"Choose your Skills"}
                  addClass={styles["roleSkills__skills-select"]}
                  child={categoriesListBlock}
                />
              </div>
            </div>
          )}
          {checkedSkills.length > 0 && (
            <div className={styles.roleSkills__tags}>
              {checkedSkills.map((item, i) => (
                <TagItem
                  addClass={`${styles["selected-items__item"]}`}
                  key={i}
                  txt={`${item.name}`}
                  mod={"gray-md"}
                  onClose={() => {
                    onSelectDellItem(item.id)
                  }}
                  id={`${item.id}`}
                />
              ))}
            </div>
          )}
          <div className={styles["roleSkills__btn-wrap"]}>
            <DefaultBtn
              txt={"Save"}
              minWidth={false}
              onClick={handleSave}
              addClass={styles.roleSkills__save}
              disabled={!checkedSkills?.length || !hourlyRate ? true : undefined}
            />
            {roleId && (
              <DefaultBtn
                txt={"Delete"}
                minWidth={false}
                onClick={handleDelete}
                addClass={styles.roleSkills__delete}
                mod={"transparent-grey"}
              />
            )}
          </div>
        </div>
      )}

      {step === 1 &&
        roleId &&
        formik.values.job_roles
          .filter((role) => role.id === roleId)
          .map((el, kk) => (
            <div key={kk}>
              <IcontitleAndTags
                title={el.name}
                tagsName={"Skills"}
                addClass={styles.roleSkills__role}
                isEdit
                isDelete={true}
                tags={el.skills}
                id={el.id}
                deleteFcn={handleDelete}
                editFcn={handleEdit}
                iconId={el.area_expertise_id}
                price={el.hourly_pay ? el.hourly_pay : null}
                userType={2}
              />
            </div>
          ))}
      {step === 1 && !roleId && (
        <RoleSkillsAddNew
          onClick={() => {
            setStep(2)
          }}
        />
      )}
    </>
  )
}

export default RoleSkillsAddItem
