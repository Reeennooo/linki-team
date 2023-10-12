import React, { useEffect, useState } from "react"
import { Sortable, SortableEvent } from "react-sortablejs"
import styles from "../SortableBoard/SortableBoard.module.scss"
import FakeSortableCol from "./FakeSortableCol/FakeSortableCol"
import { isArraysEqual } from "utils/isArraysEqual"
import ModalProject from "components/Modals/ModalProject/ModalProject"
import ModalUser from "components/Modals/ModalUser/ModalUser"
import ModalOffer from "components/Modals/ModalOffer/ModalOffer"
import { useAuth } from "hooks/useAuth"
import { useAppDispatch, useAppSelector } from "hooks"
import { closeModal, selectModals } from "redux/slices/modals"
import ModalChat from "components/Modals/ModalChat/ModalChat"
import ModalVacancy from "components/Modals/ModalVacancy/ModalVacancy"
import { useRouter } from "next/router"
import { selectApiParams } from "redux/slices/apiParams"
import { USER_TYPE_CUSTOMER, USER_TYPE_PM } from "utils/constants"

interface Props {
  columns: {
    id: number
    name: string
    placeholder?: string
  }[]
  cardType: string
  data: any[]
  isLoading?: boolean
  onAdd(evt: SortableEvent, instance: Sortable): void
  userID: number
  activeTaskId?: number
}

const FakeSortableBoard: React.FC<Props> = ({ columns, cardType, data, isLoading, onAdd, userID, activeTaskId }) => {
  const {
    user: { type: userType },
  } = useAuth()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { modalsList } = useAppSelector(selectModals)
  const { managerID, currentUserID, projectID } = useAppSelector(selectApiParams)

  const [colHideName, setColHideName] = useState("Archive")
  const [colHoverName, setColHoverName] = useState("")
  const [localIndexObject, setLocalIndexObject] = useState({
    [userID]: [
      { name: "Incoming", ids: [] },
      { name: "Archive", ids: [] },
      { name: "Under consideration", ids: [] },
      { name: "Ready for work", ids: [] },
    ],
  })

  const cols = columns.map((i) => {
    return (
      <FakeSortableCol
        key={i.id}
        column={i}
        data={data}
        colHideName={colHideName}
        setColHideName={setColHideName}
        colHoverName={colHoverName}
        setColHoverName={setColHoverName}
        cardType={cardType}
        isLoading={isLoading}
        onAdd={onAdd}
        userID={userID}
        localIndexObject={localIndexObject}
        activeTaskId={activeTaskId}
      />
    )
  })

  return (
    <div className={`sortable-board tour-sortable-board ${styles.board}`}>
      {cols}
      <ModalProject
        modalType={"board"}
        isOpen={modalsList.includes("modal-project")}
        onClose={() => {
          dispatch(closeModal("modal-project"))
        }}
        localIndexObject={localIndexObject[userID]}
        closeOutside={(target) => {
          setTimeout(() => {
            const sortableItem = target?.closest(".sortable-item")
            if (sortableItem) {
              // если карточку начали тащить на доске
              const list = [...sortableItem.classList]?.filter((i) => i.includes("sortable-item--draggable"))
              // if (list?.length) setModalProjectOpen(false)
              if (list?.length) dispatch(closeModal("modal-project"))
            }
          }, 160)
          return target.closest(".project-card") === null || target.nodeName === "BUTTON"
        }}
      />
    </div>
  )
}

export default FakeSortableBoard
