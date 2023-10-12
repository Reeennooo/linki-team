import Modal from "components/ui/Modal/Modal"
import DetailedPopupShareLink from "components/DetailedPopup/DetailedPopupShareLink/DetailedPopupShareLink"
import DetailedPopupInviteExpert from "components/DetailedPopup/DetailedPopupInviteExpert/DetailedPopupInviteExpert"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import { useAppSelector } from "hooks"
import { selectApiParams } from "redux/slices/apiParams"
import { useEffect, useState } from "react"
import { useCreateVacancyCodeMutation } from "redux/api/team"

interface ModalShareLinkProps {
  isOpen: boolean
  onClose: () => void
  closeOutside?: (param: HTMLElement) => boolean
  modalName?: string
  jobName?: string
  referralCode: string
}

const ModalShareLink: React.FC<ModalShareLinkProps> = ({
  isOpen,
  onClose,
  closeOutside,
  modalName = "modal-share-link",
  jobName,
  referralCode,
}) => {
  const { teamMemberID } = useAppSelector(selectApiParams)

  const [createVacancyCode, resultCreateVacancyCode] = useCreateVacancyCodeMutation()

  const [refCode, setRefCode] = useState("")

  useEffect(() => {
    if (isOpen) {
      if (!referralCode) {
        createVacancyCode(teamMemberID)
      } else {
        setRefCode(referralCode)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!resultCreateVacancyCode.data) return
    setRefCode(resultCreateVacancyCode.data)
  }, [resultCreateVacancyCode.data])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOutside={closeOutside}
      name={modalName}
      header={<DetailedPopupHeader onClose={onClose} title={`Share link —`} titleTag={jobName} />}
    >
      <DetailedPopupShareLink />
      <DetailedPopupInviteExpert referralCode={refCode} />
    </Modal>
  )
}

export default ModalShareLink
