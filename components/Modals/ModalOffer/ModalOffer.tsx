import DetailedPopupCalculate from "components/DetailedPopup/DetailedPopupCalculate/DetailedPopupCalculate"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import DetailedPopupSpecList from "components/DetailedPopup/DetailedPopupSpecList/DetailedPopupSpecList"
import DetailedTotalDaysAndSum from "components/DetailedPopup/DetailedTotalDaysAndSum/DetailedTotalDaysAndSum"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import Modal from "components/ui/Modal/Modal"
import ModalChat from "../ModalChat/ModalChat"
import styles from "components/ui/Modal/Modal.module.scss"
import { useAuth } from "hooks/useAuth"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import {
  useCreateOfferMutation,
  useLazyGetOfferQuery,
  useLazyGetProjectsIncomingQuery,
  useSetCandidatesStatusMutation,
  useUpdateOfferMutation,
} from "redux/api/project"
import { useLazyGetUserQuery } from "redux/api/user"
import { isArraysEqual } from "utils/isArraysEqual"
import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import { useAppDispatch, useAppSelector } from "hooks"
import { selectApiParams } from "redux/slices/apiParams"
import { closeAllModals, closeModal, openModal, selectModals } from "redux/slices/modals"
import { USER_TYPE_CUSTOMER, USER_TYPE_PM } from "utils/constants"
import DetailedPopupNotation from "components/DetailedPopup/DetailedPopupNotation/DetailedPopupNotation"
import DetailedPopupDetails from "components/DetailedPopup/DetailedPopupDetails/DetailedPopupDetails"
import { addPopupNotification } from "utils/addPopupNotification"

interface Props {
  isOpen: boolean
  onClose: () => void
  managerID?: number
  modalName?: string
  readonly?: boolean
  cardStatus?: number
  closeOutside?: (param: HTMLElement) => boolean
  callbackClose?: () => void
  setUpdateData?: Dispatch<SetStateAction<any>>
}

const ModalOffer: React.FC<Props> = ({
  isOpen,
  onClose,
  managerID,
  modalName = "modal-offer",
  readonly,
  cardStatus,
  closeOutside,
  callbackClose,
  setUpdateData,
}) => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()

  const { orderID } = useAppSelector(selectApiParams)
  const { modalsList } = useAppSelector(selectModals)
  const [getOffer, { data: offerToEdit, isSuccess: isSuccessOfferToEdit, isFetching }] = useLazyGetOfferQuery()
  const [getUser, { data: userData }] = useLazyGetUserQuery()
  const [createOffer, resultOffer] = useCreateOfferMutation()
  const [updateOffer, resultUpdateOffer] = useUpdateOfferMutation()
  const [setStatusProject, resultStatus] = useSetCandidatesStatusMutation()
  const [setStatusCandidate, resultStatusCandidate] = useSetCandidatesStatusMutation()
  const [getProjectsIncoming, { data: projectsIncomingLazy, isFetching: isFetchingLazyProjectsIncoming }] =
    useLazyGetProjectsIncomingQuery()

  const [isEdit, setIsEdit] = useState(false)
  const [isChatOpen, setChatOpen] = useState<boolean>(false)

  const handleCloseModal = () => {
    onClose()
  }

  const closeModalChat = () => {
    dispatch(closeModal("modal-chat"))
    setTimeout(() => {
      setChatOpen(false)
    }, 200)
  }

  useEffect(() => {
    if ([1, 3].includes(user.type) && orderID && isOpen) {
      getOffer({
        order_id: orderID,
        manager_id: managerID,
      })
    }
  }, [orderID, isOpen])

  useEffect(() => {
    if (user.type === USER_TYPE_PM) {
      if (offerToEdit?.price) {
        setIsEdit(true)
      } else {
        setIsEdit(false)
      }
    }
    if (offerToEdit?.manager_id) getUser(offerToEdit?.manager_id)
  }, [offerToEdit])

  const [offerData, setOfferData] = useState({
    order_id: orderID,
    manager_id: managerID,
    days: 0,
    description: "description",
    team: [],
    price: 0,
  })
  const [isDataEqual, setDataEqual] = useState(false)

  useEffect(() => {
    if (offerToEdit?.price) {
      const newData = { ...offerData, id: offerToEdit?.id, order_id: orderID }
      setDataEqual(isArraysEqual(offerToEdit, newData))
    } else {
      setDataEqual(!offerData.price)
    }
  }, [offerData])

  const changeStatus = () => {
    if (setUpdateData) setUpdateData((prev) => prev + 1)
    dispatch(closeAllModals())
    setTimeout(() => {
      setStatusProject({ manager_id: managerID, status: 3, order_id: orderID })
    }, 200)
  }

  const sendOffer = (offerData) => {
    if (user.type === USER_TYPE_PM) {
      if (isEdit) {
        updateOffer({ ...offerData, id: offerToEdit.id }).then(() => {
          changeStatus()
        })
      } else {
        createOffer({ ...offerData, order_id: orderID }).then(() => {
          changeStatus()
        })
      }
      addPopupNotification({
        title: "Congratulations!",
        txt: `Your offer has been successfully sent to the client, please wait for a decision`,
        mod: "success",
        icon: "check",
      })
      getProjectsIncoming(undefined, true).then(() => {
        const currentProject = projectsIncomingLazy?.filter((item) => item?.id === orderID)
        const projectName = currentProject?.length > 0 ? currentProject[0]?.name : ""
        addPopupNotification({
          title: "Project selection",
          txt: `You moved the project "${projectName}" to the "Ready for work" column`,
        })
      })
    }
  }

  const saveOffer = () => {
    if (user.type !== 3) return
    if (offerToEdit?.id) {
      updateOffer({ ...offerData, id: offerToEdit.id })
    } else {
      createOffer({ ...offerData, order_id: orderID })
    }
    onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isFetching}
        closeOutside={closeOutside}
        header={
          readonly ? (
            <DetailedPopupHeader
              name={`${userData?.name ? userData?.name : ""} ${userData?.surname ? userData?.surname : ""}`}
              img={userData?.avatar}
              rating={userData?.rating}
              onClose={handleCloseModal}
              headerUserClickable={user.type === USER_TYPE_PM || user.type === USER_TYPE_CUSTOMER}
              id={userData?.id}
              chatLink={true}
              onBtnChat={() => {
                setChatOpen(true)
                dispatch(openModal("modal-chat"))
              }}
            />
          ) : (
            <DetailedPopupHeader onClose={handleCloseModal} title={"Create an offer"} />
          )
        }
        footer={
          <>
            {user.type === USER_TYPE_PM && (
              <div className={`${styles["footer__btns"]}`}>
                {cardStatus !== 4 && (
                  <DefaultBtn
                    txt={"Save"}
                    mod={"transparent-grey"}
                    addClass={styles["footer__btn-save"]}
                    minWidth={false}
                    onClick={saveOffer}
                    disabled={isDataEqual}
                  />
                )}
                <DefaultBtn
                  onClick={() => {
                    sendOffer(offerData)
                  }}
                  txt={"Send an offer"}
                  disabled={!offerData.price || (cardStatus === 3 && isDataEqual)}
                />
              </div>
            )}
            {user.type === USER_TYPE_CUSTOMER && cardStatus < 4 && (
              <div className={`${styles["footer__btns"]} ${styles["footer__btns--wide"]}`}>
                <IconBtn
                  icon={"archive"}
                  width={18}
                  height={18}
                  onClick={() => {
                    setStatusCandidate({ manager_id: managerID, status: -2, order_id: orderID })
                    onClose()
                    if (callbackClose) callbackClose()
                  }}
                />
                {cardStatus !== 4 && (
                  <DefaultBtn
                    txt={"Ready for work"}
                    onClick={() => {
                      setStatusCandidate({ manager_id: managerID, status: 4, order_id: orderID })
                      onClose()
                      if (callbackClose) callbackClose()
                    }}
                  />
                )}
              </div>
            )}
          </>
        }
        isFooterExist={(user.type === USER_TYPE_CUSTOMER && cardStatus !== 4) || user.type === USER_TYPE_PM}
        name={modalName}
      >
        {readonly ? (
          <>
            {offerToEdit?.description && (
              <DetailedPopupDetails
                defOpen={true}
                addClass="popup-body__section"
                description={offerToEdit?.description}
                addTitle={"Description of the end result"}
              />
            )}
            {offerToEdit?.team?.length > 0 && <DetailedPopupSpecList specList={offerToEdit.team} />}
            {offerToEdit?.days && offerToEdit?.price && (
              <DetailedTotalDaysAndSum
                addClass={"popup-body__section"}
                sum={offerToEdit?.price}
                days={offerToEdit?.days}
              />
            )}
            <DetailedPopupNotation
              title={"Preliminary project evaluation"}
              subtitle={"The cost of the project may vary up or down "}
            />
          </>
        ) : (
          <DetailedPopupCalculate
            addClass={"popup-body__section"}
            initialExperts={isEdit ? offerToEdit?.team : null}
            setOfferData={setOfferData}
            days={offerToEdit?.days}
            description={offerToEdit?.description}
            pmPrice={offerToEdit?.manager_price}
          />
        )}
      </Modal>
      {isChatOpen && (
        <ModalChat
          isOpen={modalsList.includes("modal-chat")}
          onClose={closeModalChat}
          personID={userData?.id}
          chatType={"private"}
        />
      )}
    </>
  )
}

export default ModalOffer
