import Modal from "components/ui/Modal/Modal"
import styles from "../../ui/Modal/Modal.module.scss"
import React, { memo, useEffect, useState } from "react"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import { IPmTeamsListItem } from "types/pmteam"
import { useAppDispatch, useAppSelector } from "hooks"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import useUnmount from "hooks/useUnmount"
import TeamCard from "components/TeamCard/TeamCard"
import { BACKEND_HOST } from "utils/constants"
import { useExpertAcceptExclusiveMutation, useExpertRejectExclusiveMutation } from "redux/api/pmteam"
import { useLazyCheckTokenQuery } from "redux/api/auth"

interface Props {
  isOpen: boolean
  onClose: () => void
  modalName?: string
  modalType?: string
  closeOutside?: (param: HTMLElement) => boolean
  isFooterExist?: boolean
  headerUserClickable?: boolean
  teams?: IPmTeamsListItem[]
}

const ModalExclusive: React.FC<Props> = ({
  isOpen,
  onClose,
  modalName = "modal-exclusive",
  modalType,
  closeOutside,
  isFooterExist = true,
  teams,
}) => {
  const [acceptExclusive] = useExpertAcceptExclusiveMutation()
  const [rejectExclusive] = useExpertRejectExclusiveMutation()
  const [chackToken] = useLazyCheckTokenQuery()

  const dispatch = useAppDispatch()

  const { currentPmTeamID } = useAppSelector(selectApiParams)

  const closeModalExclusive = () => {
    onClose()
  }

  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsFetching(false)
    }, 300)
  }, [])

  useUnmount(() => {
    dispatch(updateApiParams({ field: "currentPmTeamID", data: null }))
  })

  const exclusiveTeam = teams.filter((team) => team.id === currentPmTeamID)[0]

  const acceptFn = () => {
    if (currentPmTeamID) {
      try {
        acceptExclusive({ teamId: currentPmTeamID })
          .unwrap()
          .then((res) => {
            dispatch(updateApiParams({ field: "updateUserInfo", data: true }))
            setTimeout(() => {
              chackToken()
            }, 100)
          })
      } catch (e) {
        dispatch(updateApiParams({ field: "updateUserInfo", data: false }))
      }
    }

    onClose()
  }

  const rejectFn = () => {
    rejectExclusive({ teamId: currentPmTeamID })
    onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isFetching}
        name={modalName}
        closeOutside={closeOutside}
        isFooterExist={isFooterExist}
        header={
          <DetailedPopupHeader
            title={`Confirming connection with the team`}
            onClose={closeModalExclusive}
            headerUserClickable={false}
          />
        }
        footer={
          isFooterExist ? (
            <>
              <div className={`${styles.footer__btns}`}>
                <DefaultBtn addClass={styles["footer__btn-accept"]} txt={"Accept"} isTargetBlank onClick={acceptFn} />
                <DefaultBtn
                  addClass={styles["footer__btn-reject"]}
                  txt={"Reject"}
                  isTargetBlank
                  mod={"transparent-grey"}
                  onClick={rejectFn}
                />
              </div>
            </>
          ) : (
            ""
          )
        }
      >
        <>
          <div className={`popup-body__section exclusive-team`}>
            <h3 className={"popup-body__section-title"}>
              You are invited to create a connection with the team and work on projects only within the team
            </h3>
            {exclusiveTeam && (
              <TeamCard
                data={{
                  ...exclusiveTeam,
                  avatar: exclusiveTeam.avatar ? `${BACKEND_HOST}/${exclusiveTeam.avatar}` : null,
                }}
                type={"none"}
              />
            )}
          </div>
          <div className={`popup-body__section`}>
            {teams.filter((team) => team.status === 1).length >= 1 && (
              <p>
                By accepting this offer, you automatically leave other teams and will no longer be able to work in those
                teams.
              </p>
            )}
            {/* {teams?.length > 1 && (
              <p>
                By accepting this offer, you automatically leave other teams and will no longer be able to work in those
                teams.
              </p>
            )} */}
          </div>
          <div className={`popup-body__section`}>
            {teams.filter((team) => team.status === 1).length >= 1 && (
              <h3 className={"popup-body__section-title"}>The teams you&apos;re leaving from:</h3>
            )}
            <div className={`popup-body__cards-list`}>
              {teams?.length > 0 &&
                teams
                  .filter((team) => {
                    return team.id !== currentPmTeamID && team.status === 1
                  })
                  .map((t) => {
                    return (
                      <TeamCard
                        key={t.id}
                        type={"chat"}
                        data={{ ...t, avatar: t.avatar ? `${BACKEND_HOST}/${t.avatar}` : null }}
                      />
                    )
                  })}
            </div>
          </div>
        </>
      </Modal>
    </>
  )
}

export default memo(ModalExclusive)
