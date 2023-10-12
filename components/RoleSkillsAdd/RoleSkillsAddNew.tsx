import styles from "components/RoleSkillsAdd/RoleSkillsAdd.module.scss"
import React from "react"

interface IRoleSkillsAddNewProps {
  onClick: () => void
}

const RoleSkillsAddNew: React.FC<IRoleSkillsAddNewProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      className={`${styles["calculate__btn"]} ${styles.roleSkills__btn}`}
      onClick={onClick}
      id={"rolesedit"}
    >
      <span className={`${styles["calculate__btn-plus"]}`}></span>
      Add new
    </button>
  )
}

export default RoleSkillsAddNew
