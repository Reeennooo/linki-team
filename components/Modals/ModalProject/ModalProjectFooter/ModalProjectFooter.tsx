import styles from "components/ui/Modal/Modal.module.scss"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import { ExactProject, ProjectStatuses } from "types/project"
import { PROJECT_STATUS_DRAFT, PROJECT_STATUS_OPEN } from "utils/constants"
import {
  useChangeProjectStatusMutation,
  useDeleteOpenProjectMutation,
  useDeleteProjectMutation,
  useLazyGetProjectsQuery,
} from "redux/api/project"
import { useAppDispatch } from "hooks"
import { closeAllModals } from "redux/slices/modals"
import ConfirmPrompt from "components/ui/ConfirmPrompt/ConfirmPrompt"
import { addPopupNotification } from "utils/addPopupNotification"
import React from "react"

interface ModalProjectFooterProps {
  modalType?: string
  project: ExactProject
  onClose?: () => void
}

const ModalProjectFooter: React.FC<ModalProjectFooterProps> = ({ modalType = "", project, onClose }) => {
  const dispatch = useAppDispatch()

  const [changeProjectStatus] = useChangeProjectStatusMutation()
  const [getProjects] = useLazyGetProjectsQuery()
  const [deleteProject] = useDeleteProjectMutation()
  const [deleteOpenProject] = useDeleteOpenProjectMutation()

  const handleDeleteProject = () => {
    if (!project?.id) return
    if (["client draft"].includes(modalType)) {
      deleteProject({ project_id: project.id })
    } else {
      deleteOpenProject({ project_id: project.id })
    }
    if (onClose) onClose()
  }

  const handleChangeProjectStatus = async (status: ProjectStatuses) => {
    try {
      await changeProjectStatus({ project_id: project.id, status: status })
        .unwrap()
        .then(() => {
          getProjects()
          if (status === PROJECT_STATUS_OPEN) {
            addPopupNotification({
              title: "Congratulations!",
              txt: "Your task has been successfully completed and submitted",
              icon: "check",
              mod: "success",
            })
          } else {
            addPopupNotification({
              title: "Save draft",
              txt: "You saved the project as a draft",
            })
          }
          if (onClose) onClose()
        })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={`${styles.footer__btns} ${styles["footer__btns--wide"]}`}>
      {["client draft", "modal-project-info"].includes(modalType) && (
        <ConfirmPrompt
          className={styles["footer__btn-delete"]}
          title={
            ["client draft"].includes(modalType)
              ? "Are you sure you want to delete this draft?"
              : "Are you sure you want to delete this project?"
          }
          onClick={handleDeleteProject}
        />
      )}
      {["modal-project-info"].includes(modalType) && (
        <DefaultBtn
          txt={"In draft"}
          mod={"transparent-grey"}
          minWidth={false}
          addClass={styles["footer__btn-draft"]}
          onClick={() => {
            handleChangeProjectStatus(PROJECT_STATUS_DRAFT)
          }}
        />
      )}
      {["client draft", "modal-project-info"].includes(modalType) && (
        <DefaultBtn
          txt={"Edit"}
          mod={["client draft"].includes(modalType) ? "transparent-grey" : undefined}
          minWidth={!["client draft"].includes(modalType)}
          addClass={styles["footer__btn-edit"]}
          href={project?.id ? `/projects/create?projectid=${project.id}` : undefined}
          onClick={() => {
            dispatch(closeAllModals())
          }}
        />
      )}
      {["client draft"].includes(modalType) && (
        <DefaultBtn
          txt={"Publish"}
          addClass={styles["footer__btn-publish"]}
          disabled={!project?.categories.length || !project?.name || !project?.description ? true : undefined}
          onClick={() => {
            handleChangeProjectStatus(PROJECT_STATUS_OPEN)
          }}
        />
      )}
    </div>
  )
}

export default ModalProjectFooter
