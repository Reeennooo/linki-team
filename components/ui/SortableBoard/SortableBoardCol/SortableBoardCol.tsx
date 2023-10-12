import styles from "./SortableBoardCol.module.scss"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ReactSortable, Sortable, SortableEvent } from "react-sortablejs"
import IconSignIn from "../../../../public/icons/signIn-icon.svg"
import IconClock from "../../../../public/icons/clock-icon.svg"
import IconCheck from "../../../../public/assets/svg/check.svg"
import IconArchive from "public/assets/svg/archive-box-sm.svg"
import IconArchiveTray from "public/assets/svg/archive-tray.svg"
import SortableBoardItem from "components/ui/SortableBoard/SortableBoardItem/SortableBoardItem"

interface Props {
  column: {
    id: number
    name: string
    placeholder?: string
  }
  cardType: string
  data: {
    id: number
    status?: number
    manager?: {
      id: number
    }[]
    candidate_statuses?: {
      [number: number]: number
    }[]
    offers?: number[]
  }[]
  colHideName: string
  setColHideName: Dispatch<SetStateAction<string>>
  colHoverName: string
  setColHoverName: Dispatch<SetStateAction<string>>
  isLoading?: boolean
  onAdd(evt: SortableEvent, instance: Sortable): void
  userID: number
  localIndexObject?: any
  setLocalIndexObject?: Dispatch<SetStateAction<any>>
  activeTaskId?: number
}

const SortableBoardCol: React.FC<Props> = ({
  column,
  data,
  colHideName,
  setColHideName,
  colHoverName,
  setColHoverName,
  cardType,
  isLoading,
  onAdd,
  userID,
  localIndexObject,
  setLocalIndexObject,
  activeTaskId,
}) => {
  const [state, setState] = useState([])
  useEffect(() => {
    if (!data || !localIndexObject[userID]) return
    const localFiltered = localIndexObject[userID]?.filter((localItem) => column.name === localItem.name)
    setState(
      data
        ?.filter((item) =>
          localFiltered[0]?.ids?.includes(
            cardType === "humanCard"
              ? item.manager["id"]
              : cardType === "projectCardExpert"
              ? item["team_member"].id
              : cardType === "humanCardPMAtWork"
              ? item["user"].id
              : item.id
          )
        )
        .sort((a, b) => {
          const firstEl = localFiltered[0]?.ids.findIndex(
            (i) =>
              +i ===
              (cardType === "humanCard"
                ? +a.manager["id"]
                : cardType === "projectCardExpert"
                ? +a["team_member"].id
                : cardType === "humanCardPMAtWork"
                ? +a["user"].id
                : +a.id)
          )
          const secondEl = localFiltered[0]?.ids.findIndex(
            (i) =>
              +i ===
              (cardType === "humanCard"
                ? +b.manager["id"]
                : cardType === "projectCardExpert"
                ? +b["team_member"].id
                : cardType === "humanCardPMAtWork"
                ? +b["user"].id
                : +b.id)
          )
          return +firstEl - +secondEl
        })
    )
  }, [column.name, data, localIndexObject, userID])

  const handleBtnCol = (name) => {
    setColHideName(name)
  }

  const placeholderSelector = (id) => {
    switch (id) {
      case 1:
        return (
          <p className={styles.header__placeholder}>
            <span className={`${styles["header__placeholder-icon"]}`}>
              <IconSignIn />
            </span>
            <span>
              {column.placeholder
                ? column.placeholder
                : "This column will display project managers who have responded to your project"}
            </span>
          </p>
        )
      case 2:
        return (
          <p className={styles.header__placeholder}>
            <span className={`${styles["header__placeholder-icon"]}`}>
              <IconSignIn />
            </span>
            <span>
              {column.placeholder
                ? column.placeholder
                : "This column will display the project managers who have responded to your project"}
            </span>
          </p>
        )
      case 3:
        return (
          <p className={styles.header__placeholder}>
            <span className={`${styles["header__placeholder-icon"]}`}>
              <IconClock />
            </span>
            <span>
              {column.placeholder
                ? column.placeholder
                : "You show your interest to the project manager by moving the card to this column"}
            </span>
          </p>
        )
      case 4:
        return (
          <p className={styles.header__placeholder}>
            <span className={`${styles["header__placeholder-icon"]}`}>
              <IconCheck />
            </span>
            <span>
              {column.placeholder
                ? column.placeholder
                : "Move the cards of the project managers you are ready to work with to this column"}
            </span>
          </p>
        )
    }
  }

  const changeIndex = (evt, type) => {
    const parentElFrom = evt.from.parentNode as HTMLElement
    const parentElTo = evt.to.parentNode as HTMLElement
    const oldColumn = parentElFrom.dataset.col
    const newColumn = parentElTo.dataset.col
    if (type === "onEnd" && oldColumn !== newColumn) return
    if (oldColumn === newColumn) {
      setLocalIndexObject((prevState) => {
        return {
          ...prevState,
          [userID]: prevState[userID].map((i) => {
            if (newColumn === i.name) {
              // с позиции evt.oldIndex удалить 1 элемент
              i.ids.splice(+evt.oldIndex, 1)
              // с позиции evt.newIndex удалить 0 элементов и добавить evt.item.dataset.id
              i.ids.splice(+evt.newIndex, 0, +evt.item.dataset.id)
            }
            return i
          }),
        }
      })
    } else {
      setLocalIndexObject((prevState) => {
        return {
          ...prevState,
          [userID]: prevState[userID].map((i) => {
            if (oldColumn === i.name) {
              i.ids.splice(+evt.oldIndex, 1)
            } else if (newColumn === i.name) {
              i.ids.splice(+evt.newIndex, 0, +evt.item.dataset.id)
            }
            return i
          }),
        }
      })
    }
  }

  return (
    <div
      className={`${styles.col} ${column.name === colHideName ? styles["col--hide"] : ""} ${
        colHoverName === column.name ? styles["col--hover"] : ""
      } ${isLoading ? styles["col--loading"] : ""}`}
      data-col={column.name}
    >
      <div className={styles.header}>
        {isLoading ? <div className={styles.loading} /> : ""}
        <h3 className={styles.header__title}>{column.name === "Incoming" ? "Inbound" : column.name}</h3>
        {column.name === "Incoming" ? (
          <button
            type="button"
            className={styles.header__label}
            onClick={() => {
              handleBtnCol(column.name)
            }}
            disabled={
              localIndexObject && localIndexObject[userID] && !localIndexObject[userID][1].ids.length ? true : undefined
            }
          >
            Archive
            <IconArchive />
          </button>
        ) : column.name === "Archive" ? (
          <button
            type="button"
            className={styles.header__label}
            onClick={() => {
              handleBtnCol(column.name)
            }}
          >
            Inbound
            <IconArchiveTray />
          </button>
        ) : (
          ""
        )}
        {!state?.length && placeholderSelector(column.id)}
      </div>
      <ReactSortable
        className={`${styles["col__inner"]}`}
        list={state?.map((x) => ({ ...x, chosen: true }))}
        setList={(data) => {
          setState(data)
        }}
        onAdd={(evt, instance) => {
          onAdd && onAdd(evt, instance)
          changeIndex(evt, null)
          evt.item.classList.remove("sortable-item--draggable")
        }}
        onEnd={(evt, instance) => {
          setColHoverName("")
          changeIndex(evt, "onEnd")
          evt.item.classList.remove("sortable-item--draggable")
        }}
        onStart={(evt) => {
          evt.item.classList.add("sortable-item--draggable")
        }}
        onChange={(evt, instance) => {
          setColHoverName(column.name)
        }}
        onMove={(evt, originalEvent, sortable) => {
          if (cardType === "humanCardPMAtWork" || cardType === "projectCardExpert") return true
          const colNameFrom = sortable.options.group["name"]
          const colNameTo = evt.to.parentElement.dataset.col
          const elID = +evt.dragged.dataset.id
          const elementObject = data.filter((item) => {
            const itemID =
              cardType === "humanCard"
                ? item.manager["id"]
                : cardType === "projectCardExpert"
                ? item["team_member"].id
                : item.id
            return itemID === elID
          })[0]
          const isOffer = elementObject?.offers?.includes(userID)
          let disable = false
          switch (colNameTo) {
            case "Ready for work":
              if (colNameFrom === "Incoming" || colNameFrom === "Archive") disable = true
              if (colNameFrom === "Under consideration") {
                if (cardType === "humanCard" && !elementObject["price"]) disable = true
                if (cardType === "projectCard" && !isOffer) disable = true
              }
              break
          }
          return !disable
        }}
        group={{
          name: `${column.name}`,
          put: true,
        }}
        animation={150}
        ghostClass={styles["item--ghost"]}
        dragClass={styles["item--drag"]}
        chosenClass={`${styles["item--chosen"]}`}
        forceFallback={true}
        delay={500}
        delayOnTouchOnly={true}
      >
        {state?.map((item) => (
          <div
            key={
              cardType === "humanCard"
                ? item.manager.id
                : cardType === "projectCardExpert"
                ? item.team_member.id
                : cardType === "humanCardPMAtWork"
                ? item.user.id
                : item.id
            }
            className={`sortable-item ${styles.item}`}
          >
            <SortableBoardItem
              item={item}
              columnName={column.name}
              cardType={cardType}
              userID={userID}
              activeTaskId={activeTaskId}
            />
          </div>
        ))}
      </ReactSortable>
    </div>
  )
}

export default SortableBoardCol
