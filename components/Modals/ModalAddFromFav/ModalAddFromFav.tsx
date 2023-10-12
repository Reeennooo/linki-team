import Modal from "components/ui/Modal/Modal"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import DetailedPopupSearchMember from "components/DetailedPopup/DetailedPopupSearchMember/DetailedPopupSearchMember"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import styles from "components/ui/Modal/Modal.module.scss"
import { useAppDispatch, useAppSelector } from "hooks"
import { openModal } from "redux/slices/modals"
import { useGetFavoritesQuery } from "redux/api/user"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import { usePublishVacancyMutation } from "redux/api/team"

interface ModalAddFromFavProps {
  isOpen: boolean
  onClose: () => void
  closeOutside?: (param: HTMLElement) => boolean
  modalName?: string
  jobName?: string
  isPosted?: boolean
}

const ModalAddFromFav: React.FC<ModalAddFromFavProps> = ({
  isOpen,
  onClose,
  closeOutside,
  modalName = "modal-add-from-fav",
  jobName,
  isPosted,
}) => {
  const dispatch = useAppDispatch()

  const { data: favList, isLoading } = useGetFavoritesQuery()
  const [publishVacancy, resultPublishVacancy] = usePublishVacancyMutation()

  const { activeTeamMemberIDVacancy, teamMemberID } = useAppSelector(selectApiParams)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOutside={closeOutside}
      name={modalName}
      header={<DetailedPopupHeader onClose={onClose} title={`Add from favorites —`} titleTag={jobName} />}
      isFooterExist={
        !favList?.filter(
          (el) => el.job_roles && el.job_roles.filter((job) => job.id === activeTeamMemberIDVacancy).length > 0
        ).length
      }
      footer={
        <div className={`${styles.footer__btns}`}>
          <DefaultBtn
            txt={"Share link"}
            mod={"transparent-grey"}
            onClick={() => {
              onClose()
              setTimeout(() => {
                dispatch(openModal("modal-share-link"))
              }, 200)
            }}
          />
          {!isPosted && (
            <DefaultBtn
              txt={"Post a job"}
              onClick={() => {
                publishVacancy(teamMemberID)
                  .unwrap()
                  .then((res) => {
                    if (res.success) {
                      dispatch(updateApiParams({ field: "activeVacancyIDAtWork", data: teamMemberID }))
                      onClose()
                    }
                  })
              }}
            />
          )}
        </div>
      }
    >
      <DetailedPopupSearchMember onClose={onClose} favList={favList} />
    </Modal>
  )
}

export default ModalAddFromFav
