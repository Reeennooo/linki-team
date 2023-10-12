import IconCheck from "public/assets/svg/check-sm.svg"
import styles from "./ProjectCardCompleted.module.scss"

interface ProjectCardCompletedProps {
  addClass?: string
}

const ProjectCardCompleted: React.FC<ProjectCardCompletedProps> = ({ addClass }) => {
  return (
    <div className={`completed-block ${styles.completed} ${addClass ? addClass : ""}`}>
      <span>
        <IconCheck />
      </span>
      Completed
    </div>
  )
}

export default ProjectCardCompleted
