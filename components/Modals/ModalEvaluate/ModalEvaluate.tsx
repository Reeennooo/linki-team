import styles from "./ModalEvaluate.module.scss"
import React, { useMemo, useState } from "react"
import Modal from "components/ui/Modal/Modal"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import { useAppDispatch, useAppSelector } from "hooks"
import { closeAllModals, openModal, selectModals } from "redux/slices/modals"
import { useAuth } from "hooks/useAuth"
import PersonRatingCard from "components/PersonRatingCard/PersonRatingCard"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import { useFinishJobMutation } from "redux/api/team"
import {
  useCloseOrderMutation,
  useFinishOrderMutation,
  useLazyGetProjectsFinishedQuery,
  useLazyGetProjectsQuery,
} from "redux/api/project"
import ModalProjectCompleted from "components/Modals/ModalProjectCompleted/ModalProjectCompleted"
import { updateApiParams } from "redux/slices/apiParams"
import { addPopupNotification } from "utils/addPopupNotification"
import { OfferMember } from "types/project"
import Image from "next/image"

interface IModalEvaluateProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  modalName?: string
  client?: any
  manager?: any
  team?: any
  modalType: string | undefined | null
  orderID: number
}

const ModalEvaluate: React.FC<IModalEvaluateProps> = ({
  isOpen,
  isLoading,
  onClose,
  modalName = "modal-evaluate",
  client,
  manager,
  team,
  modalType,
  orderID,
}) => {
  const {
    user: { id: userID },
  } = useAuth()

  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)

  const [finishJob, resultFinishJob] = useFinishJobMutation()
  const [finishOrder, resultFinishOrder] = useFinishOrderMutation()
  const [closeOrder, resultCloseOrder] = useCloseOrderMutation()
  const [getProjectsFinished, { data: projectsFinished }] = useLazyGetProjectsFinishedQuery()
  const [getProjects, { data: projectsAtWork }] = useLazyGetProjectsQuery()

  const [managerRating, setManagerRating] = useState<number>(null)
  const [clientRating, setClientRating] = useState<number>(null)
  const [teamRating, setTeamRating] = useState([])

  const clientItem = client ? (
    <PersonRatingCard
      className={styles.modal__card}
      avatar={client?.avatar}
      name={client?.name}
      surname={client?.surname}
      position={"Client"}
      onChange={(value) => {
        setClientRating(value)
      }}
    />
  ) : null

  const managerItem = manager ? (
    <PersonRatingCard
      className={styles.modal__card}
      avatar={manager?.avatar}
      name={manager?.name}
      surname={manager?.surname}
      position={"Project Manager"}
      onChange={(value) => {
        setManagerRating(value)
      }}
    />
  ) : null

  const teamList = team
    ? team.map((teamMember) => {
        if (teamMember.user?.id === userID) return null
        return (
          <PersonRatingCard
            className={styles.modal__card}
            key={teamMember.job_role_id}
            avatar={teamMember.user?.main_image?.path}
            name={teamMember.user?.name}
            surname={teamMember.user?.surname}
            position={teamMember.job_role}
            onChange={(value) => {
              setTeamRating((prev) => {
                if (value) {
                  const filteredPrev = [...prev].filter((member) => member.job_role_id !== teamMember.job_role_id)
                  return [
                    ...filteredPrev,
                    { rating: value, about_id: teamMember.user.id, job_role_id: teamMember.job_role_id },
                  ]
                } else {
                  return [...prev].filter((member) => member.job_role_id !== teamMember.job_role_id)
                }
              })
            }}
          />
        )
      })
    : null

  const finishThen = () => {
    getProjects()
    getProjectsFinished()
    dispatch(updateApiParams({ field: "activeProjectIDAtWork", data: null }))
    dispatch(openModal("modal-project-completed"))
  }

  const handleSubmit = async () => {
    switch (modalType) {
      case "expert at work":
        if (!orderID || !managerRating) return
        try {
          await finishJob({ team_member_id: orderID, rating: managerRating })
            .unwrap()
            .then((res) => {
              finishThen()
              addPopupNotification({
                title: "Congratulations!",
                txt: `You have successfully completed the task`,
                mod: "success",
                icon: "check",
              })
              addPopupNotification({
                title: "Thank you for appreciating your PM",
                mod: "success",
                icon: "check",
              })
            })
        } catch (err) {
          console.log(err)
          onClose()
        }
        break

      case "pm at work":
        if (!orderID) return
        const teamRatingList = teamRating.map((el) => ({
          rating: el.rating,
          about_id: el.about_id,
        }))
        try {
          await finishOrder({
            order_id: orderID,
            ratings: [...teamRatingList, { rating: clientRating, about_id: client.id }],
          })
            .unwrap()
            .then((res) => {
              finishThen()
              addPopupNotification({
                title: "Thank you for appreciating the client and the performers",
                mod: "success",
                icon: "check",
              })
            })
        } catch (err) {
          console.log(err)
          onClose()
        }
        break

      case "client at work":
        if (!orderID || !managerRating) return
        try {
          await closeOrder({ order_id: orderID, rating: managerRating })
            .unwrap()
            .then((res) => {
              finishThen()
              addPopupNotification({
                title: "Congratulations!",
                txt: `Task completed successfully`,
                mod: "success",
                icon: "check",
              })
              addPopupNotification({
                title: "Thank you for appreciating your PM",
                mod: "success",
                icon: "check",
              })
            })
        } catch (err) {
          console.log(err)
          onClose()
        }
    }
  }

  const subTitle = useMemo(() => {
    switch (modalType) {
      case "expert at work":
        return (
          <p className={styles.modal__txt}>
            Evaluate your satisfaction with the project manager&apos;s work. After the project is completed, payment
            will be credited to your account.
          </p>
        )
      case "pm at work":
        return (
          <p className={styles.modal__txt}>
            Evaluate your level of satisfaction with the client and the team. After the client accepts the results of
            the project, payment will be credited to your account.
          </p>
        )
      case "client at work":
        return (
          <p className={styles.modal__txt}>
            Evaluate your level of satisfaction with the project manager. By clicking Submit, you confirm completion of
            the project and accept the results.
          </p>
        )
      default:
        return null
    }
  }, [modalType])

  return (
    <>
      <Modal
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={onClose}
        name={modalName}
        header={<DetailedPopupHeader title={"Evaluate the work on the project"} onClose={onClose} />}
        footer={
          <DefaultBtn
            addClass={styles.modal__btn}
            txt={"Submit"}
            onClick={handleSubmit}
            disabled={
              (manager && !managerRating) ||
              (client && !clientRating) ||
              (team && teamRating.length < team.filter((teamMember) => teamMember.user?.id !== userID)?.length)
                ? true
                : undefined
            }
          />
        }
      >
        <div className={`${styles["modal__evaluate-content"]}`}>
          <div className={`${styles["modal__img-container"]}`}>
            <Image src={"/assets/send2-min.png"} quality={85} width={192} height={179} alt="congratulation" />
          </div>
          {subTitle}
          {clientItem}
          {managerItem}
          {teamList}
        </div>
      </Modal>
      {isOpen && (
        <ModalProjectCompleted
          isOpen={modalsList.includes("modal-project-completed")}
          onClose={() => {
            dispatch(closeAllModals())
          }}
        />
      )}
    </>
  )
}

export default ModalEvaluate
