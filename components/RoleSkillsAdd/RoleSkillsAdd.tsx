import React, { useEffect, useState } from "react"
import styles from "./RoleSkillsAdd.module.scss"
import { useGetSpecksQuery, useGetStacksQuery } from "redux/api/content"
import RoleSkillsAddItem from "components/RoleSkillsAdd/RoleSkillsAddItem"

interface IRoleSkillsAddProps {
  formik: any
  max: number
}

const RoleSkillsAdd: React.FC<IRoleSkillsAddProps> = ({ formik, max }) => {
  const [directionsList, setDirectionsList] = useState([])
  const [stacksList, setStacksList] = useState([])
  const { data: directionsAll } = useGetSpecksQuery() // roles
  const { data: stacks } = useGetStacksQuery()

  useEffect(() => {
    if (!directionsAll?.length) return
    setDirectionsList(directionsAll)
  }, [directionsAll])
  useEffect(() => {
    if (!stacks?.length) return
    setStacksList(stacks)
  }, [stacks])

  const [roleIdEdite, setRoleIdEdite] = useState<number>(null)

  return (
    <div className={styles.roleSkills}>
      {formik.values?.job_roles.map((role) => {
        return (
          <RoleSkillsAddItem
            key={role.id}
            roleId={role.id}
            formik={formik}
            directionsList={directionsList}
            stacksList={stacksList}
            roleIdEdite={roleIdEdite}
            setRoleIdEdite={setRoleIdEdite}
            max={max}
          />
        )
      })}
      {formik.values?.job_roles?.length < max && (
        <RoleSkillsAddItem formik={formik} directionsList={directionsList} stacksList={stacksList} max={max} />
      )}
    </div>
  )
}

export default RoleSkillsAdd
