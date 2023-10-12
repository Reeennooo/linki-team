import Modal from "components/ui/Modal/Modal"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import DetailedPopupSearchTeammate from "components/DetailedPopup/DetailedPopupSearchTeammate/DetailedPopupSearchTeammate"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import styles from "components/ui/Modal/Modal.module.scss"
import { useAppDispatch, useAppSelector } from "hooks"
import { openModal } from "redux/slices/modals"
import { useGetFavoritesQuery } from "redux/api/user"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import { usePublishVacancyMutation } from "redux/api/team"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import { useEffect, useState } from "react"
import DetailedPopupInviteExpert from "components/DetailedPopup/DetailedPopupInviteExpert/DetailedPopupInviteExpert"
import { MANAGER_TEAM_CODE, USER_TYPE_EXPERT } from "utils/constants"
import { selectAuth } from "redux/slices/auth"
import { seletCurrentTeam } from "redux/slices/currentTeam"
import { useLazyGetTeamInfoQuery } from "redux/api/pmteam"

interface ModalAddTeammateProps {
  isOpen: boolean
  onClose: () => void
  closeOutside?: (param: HTMLElement) => boolean
  modalName?: string
  teamName?: string
  isPosted?: boolean
  refCode?: string
}

const ModalAddTeammate: React.FC<ModalAddTeammateProps> = ({
  isOpen,
  onClose,
  closeOutside,
  modalName = "modal-add-teammate",
  teamName,
  isPosted,
  refCode,
}) => {
  const dispatch = useAppDispatch()
  const [activeId, setActiveId] = useState(1)
  const { user } = useAppSelector(selectAuth)

  const { data: favList, isLoading } = useGetFavoritesQuery()

  const { currentTeamId } = useAppSelector(seletCurrentTeam)

  const [getTeamInfo, { data: pmTeamData, isFetching }] = useLazyGetTeamInfoQuery()

  const [linksTabsData, setLinksTabsData] = useState([
    { id: 1, txt: "Add from Favorites", count: 0 },
    { id: 2, txt: "Share link", count: 0 },
  ])

  const [refCodeState, setRefCodeState] = useState("")

  useEffect(() => {
    if (isOpen) {
      if (refCode) {
        setRefCodeState(refCode)
      }
      getTeamInfo(currentTeamId)
        .unwrap()
        .then((res) => {
          if (res.team_code) setRefCodeState(`${res.team_code}`)
        })
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOutside={closeOutside}
      name={modalName}
      header={<DetailedPopupHeader onClose={onClose} title={`Share the project "${teamName}"`} />}
      isFooterExist={false}
    >
      <>
        <TabsLinear
          list={linksTabsData}
          activeId={activeId}
          onClick={(id) => {
            setActiveId(id)
          }}
        />
        {activeId === 1 && (
          <DetailedPopupSearchTeammate
            searchPlaceholder="Search for an expert"
            onClose={onClose}
            favList={favList?.filter((favPerson) => favPerson.type === USER_TYPE_EXPERT)}
            addedList={pmTeamData?.executors?.map((exec) => exec.id)}
          />
        )}
        {activeId === 2 && (
          <DetailedPopupInviteExpert
            currentPmTeamId={currentTeamId}
            referalType={MANAGER_TEAM_CODE}
            referralCode={refCodeState ? refCodeState : ""}
          />
        )}
      </>
    </Modal>
  )
}

export default ModalAddTeammate
