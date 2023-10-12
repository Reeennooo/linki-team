import React, { useEffect, useState } from "react"
import { Sortable, SortableEvent } from "react-sortablejs"
import styles from "./SortableBoard.module.scss"
import SortableBoardCol from "./SortableBoardCol/SortableBoardCol"
import { isArraysEqual } from "utils/isArraysEqual"
import ModalProject from "components/Modals/ModalProject/ModalProject"
import ModalUser from "components/Modals/ModalUser/ModalUser"
import ModalOffer from "components/Modals/ModalOffer/ModalOffer"
import { useAuth } from "hooks/useAuth"
import { useAppDispatch, useAppSelector } from "hooks"
import { closeModal, selectModals } from "redux/slices/modals"
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

const SortableBoard: React.FC<Props> = ({ columns, cardType, data, isLoading, onAdd, userID, activeTaskId }) => {
  const {
    user: { type: userType },
  } = useAuth()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { modalsList } = useAppSelector(selectModals)
  const { managerID, currentUserID, projectID } = useAppSelector(selectApiParams)

  const [colHideName, setColHideName] = useState("Archive")
  const [colHoverName, setColHoverName] = useState("")
  const [localIndexObject, setLocalIndexObject] = useState({})

  // TODO: в localStorage добавляется null?
  const getUpdatedObject = (params) => {
    const localIndexObjectTemplate = {
      [userID]: [
        { name: "Incoming", ids: [] },
        { name: "Archive", ids: [] },
        { name: "Under consideration", ids: [] },
        { name: "Ready for work", ids: [] },
      ],
    }
    params?.map((i) => {
      if (cardType === "projectCard") {
        // PM
        const projectStatus = i.candidate_statuses?.find((obj) => obj.hasOwnProperty(userID))
        if (i.candidate_statuses.length && projectStatus) {
          if (projectStatus[userID] === 0) localIndexObjectTemplate[userID][0].ids.push(i.id)
          if (projectStatus[userID] === -1) localIndexObjectTemplate[userID][1].ids.push(i.id)
          if ([1, 2].includes(projectStatus[userID])) localIndexObjectTemplate[userID][2].ids.push(i.id)
          if ([3, 4, 5].includes(projectStatus[userID])) localIndexObjectTemplate[userID][3].ids.push(i.id)
        } else {
          localIndexObjectTemplate[userID][0].ids.push(i.id)
        }
      } else if (cardType === "humanCard") {
        // Customer
        if ([1].includes(i.status)) localIndexObjectTemplate[userID][0].ids.push(i.manager.id)
        if ([-2].includes(i.status)) localIndexObjectTemplate[userID][1].ids.push(i.manager.id)
        if ([2, 3].includes(i.status)) localIndexObjectTemplate[userID][2].ids.push(i.manager.id)
        if ([4, 5].includes(i.status)) localIndexObjectTemplate[userID][3].ids.push(i.manager.id)
      } else if (cardType === "projectCardExpert") {
        // Expert
        if (!i.work_candidate_statuses.executor_status) localIndexObjectTemplate[userID][0].ids.push(i.team_member.id)
        if ([-1].includes(i.work_candidate_statuses.executor_status)) {
          localIndexObjectTemplate[userID][1].ids.push(i.team_member.id)
        }
        if ([1].includes(i.work_candidate_statuses.executor_status)) {
          localIndexObjectTemplate[userID][2].ids.push(i.team_member.id)
        }
        if ([2].includes(i.work_candidate_statuses.executor_status)) {
          localIndexObjectTemplate[userID][3].ids.push(i.team_member.id)
        }
      } else if (cardType === "humanCardPMAtWork") {
        // PM at work, humanCard(Expert)
        if ([0].includes(i.manager_status)) localIndexObjectTemplate[userID][0].ids.push(i.user.id)
        if ([-1].includes(i.manager_status)) localIndexObjectTemplate[userID][1].ids.push(i.user.id)
        if ([1].includes(i.manager_status)) localIndexObjectTemplate[userID][2].ids.push(i.user.id)
        if ([2].includes(i.manager_status)) localIndexObjectTemplate[userID][3].ids.push(i.user.id)
      } else {
        localIndexObjectTemplate[userID][0].ids.push(i.id)
      }
    })
    return localIndexObjectTemplate
  }

  // TODO: в модалках при изменении колонки по кнопке тоже менять LocalStorage
  useEffect(() => {
    if (!data?.length) {
      setLocalIndexObject({
        [userID]: [
          { name: "Incoming", ids: [] },
          { name: "Archive", ids: [] },
          { name: "Under consideration", ids: [] },
          { name: "Ready for work", ids: [] },
        ],
      })
      return
    }
    const boardProjects = JSON.parse(localStorage.getItem("BoardProjects"))
    const updatedData = getUpdatedObject(data)
    if (boardProjects && boardProjects[userID]) {
      let isEqualLen = true
      let isEqualIds = true
      updatedData[userID].forEach((el, index) => {
        if (el.ids.length !== boardProjects[userID][index].ids.length) {
          isEqualLen = false
          return
        }
        if (!isArraysEqual(el.ids, boardProjects[userID][index].ids)) {
          isEqualIds = false
          return
        }
      })
      if (isEqualLen && isEqualIds) {
        // если данные в data и в localStorage равны
        // setLocalIndexObject(boardProjects)
        setLocalIndexObject(updatedData)
      } else if (!isEqualLen) {
        // если кол-во id в data и localStorage разные, то устанавливаем всё заново опираясь на новую data
        localStorage.setItem("BoardProjects", JSON.stringify(updatedData))
        setLocalIndexObject(updatedData)
      } else if (!isEqualIds) {
        // если индексы ids в data и localStorage разные, то устанавливаем индексы и localStorage
        // setLocalIndexObject(boardProjects)
        setLocalIndexObject(updatedData)
      } else {
        //   // если данные в data и в localStorage не равны
        localStorage.setItem("BoardProjects", JSON.stringify(updatedData))
        setLocalIndexObject(updatedData)
      }
    } else {
      // если нет localStorage
      localStorage.setItem("BoardProjects", JSON.stringify(updatedData))
      setLocalIndexObject(updatedData)
    }
  }, [data, userID, activeTaskId])

  useEffect(() => {
    if (!localIndexObject[userID]) return
    localStorage.setItem("BoardProjects", JSON.stringify(localIndexObject))
  }, [localIndexObject])

  const cols = columns.map((i) => {
    return (
      <SortableBoardCol
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
        setLocalIndexObject={setLocalIndexObject}
        activeTaskId={activeTaskId}
      />
    )
  })

  return (
    <div className={`sortable-board scrollbar-transparent-tablet ${styles.board}`}>
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
      <ModalUser
        isOpen={modalsList.includes("modal-user")}
        onClose={() => {
          dispatch(closeModal("modal-user"))
        }}
        localIndexObject={localIndexObject[userID]}
        headerUserClickable={false}
        // cardStatus={data?.length ? data?.filter((item) => item.manager?.id === currentUserID)[0]?.status : null}
        cardStatus={
          data?.length && cardType === "humanCardPMAtWork"
            ? {
                manager_status: data?.filter((item) => item.user.id === currentUserID)[0]?.manager_status,
                executor_status: data?.filter((item) => item.user.id === currentUserID)[0]?.executor_status,
              }
            : data?.length
            ? data?.filter((item) => item.manager?.id === currentUserID)[0]?.status
            : null
        }
        btnSuccDisabled={data?.filter((item) => item.manager?.id === currentUserID)[0]?.invoice === "paid"}
        closeOutside={(target) => {
          setTimeout(() => {
            const sortableItem = target?.closest(".sortable-item")
            if (sortableItem) {
              // если карточку начали тащить на доске
              const list = [...sortableItem.classList]?.filter((i) => i.includes("sortable-item--draggable"))
              if (list?.length) dispatch(closeModal("modal-user"))
            }
          }, 160)
          return target.closest(".human-card") === null || target.nodeName === "BUTTON"
        }}
        modalType={cardType === "humanCardPMAtWork" ? "humanCardPMAtWork" : null}
      />
      {cardType !== "humanCardPMAtWork" && (
        <ModalOffer
          isOpen={modalsList.includes("modal-offer")}
          onClose={() => {
            dispatch(closeModal("modal-offer"))
          }}
          managerID={cardType === "humanCard" ? managerID : userID}
          cardStatus={
            userType === USER_TYPE_CUSTOMER
              ? data?.filter((item) => item.manager.id === managerID)[0]?.status
              : userType === USER_TYPE_PM
              ? data
                  ?.filter((item) => item.id === projectID)[0]
                  ?.candidate_statuses?.find((obj) => obj.hasOwnProperty(userID))?.[userID]
              : null
          }
          readonly={cardType === "humanCard"}
          closeOutside={(target) => {
            return target.closest(".project-card__btn-offer") === null
          }}
        />
      )}
      <ModalVacancy
        isOpen={modalsList.includes("modal-incoming-vacancy")}
        onClose={() => {
          if (router.query.vacancy) {
            const newQuery = router.query
            delete newQuery.vacancy
            router.push({
              query: newQuery,
            })
          }
          dispatch(closeModal("modal-incoming-vacancy"))
        }}
        closeOutside={(target) => {
          setTimeout(() => {
            const sortableItem = target?.closest(".sortable-item")
            if (sortableItem) {
              // если карточку начали тащить на доске
              const list = [...sortableItem.classList]?.filter((i) => i.includes("sortable-item--draggable"))
              // if (list?.length) setModalUserOpen(false)
              if (list?.length) dispatch(closeModal("modal-incoming-vacancy"))
            }
          }, 160)
          return target.closest(".project-card") === null || target.nodeName === "BUTTON"
        }}
        hasProjectInfo={true}
        localIndexObject={localIndexObject[userID]}
      />
    </div>
  )
}

export default SortableBoard
