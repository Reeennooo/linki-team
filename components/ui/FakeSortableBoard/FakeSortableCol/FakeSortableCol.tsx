import styles from "./FakeSortableCol.module.scss"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ReactSortable, Sortable, SortableEvent } from "react-sortablejs"
import IconSignIn from "../../../../public/icons/signIn-icon.svg"
import IconClock from "../../../../public/icons/clock-icon.svg"
import IconCheck from "../../../../public/assets/svg/check.svg"
import IconArchive from "public/assets/svg/archive-box-sm.svg"
import IconArchiveTray from "public/assets/svg/archive-tray.svg"
import SortableBoardItem from "components/ui/SortableBoard/SortableBoardItem/SortableBoardItem"
import { useAppSelector } from "hooks"
import { selectonboardingRedux } from "redux/slices/onboarding"

interface Props {
  column: {
    id: number
    name: string
    placeholder?: string
  }
  cardType: string
  data: any[]
  colHideName: string
  setColHideName: Dispatch<SetStateAction<string>>
  colHoverName: string
  setColHoverName: Dispatch<SetStateAction<string>>
  isLoading?: boolean
  onAdd(evt: SortableEvent, instance: Sortable): void
  userID: number
  localIndexObject?: any
  activeTaskId?: number
}

const FakeSortableCol: React.FC<Props> = ({
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
  activeTaskId,
}) => {
  const [state, setState] = useState(data)

  useEffect(() => {
    setState(data?.filter((item) => column.name === item.column))
  }, [data])

  const handleBtnCol = (name) => {
    setColHideName(name)
  }

  const { highlightArchive } = useAppSelector(selectonboardingRedux)

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

  return (
    <div
      className={`${styles.col} ${column.name === colHideName ? styles["col--hide"] : ""} ${
        colHoverName === column.name ? styles["col--hover"] : ""
      } ${isLoading ? styles["col--loading"] : ""}
        ${column.name === "Incoming" ? "tour-sortable-inbound-col" : ""}
        ${column.name === "Under consideration" ? "tour-sortable-under-consider-col" : ""}
        ${column.name === "Ready for work" ? "tour-sortable-ready-for-wrok-col" : ""}
      `}
      data-col={column.name}
    >
      <div className={styles.header}>
        {isLoading ? <div className={styles.loading} /> : ""}
        <h3 className={styles.header__title}>{column.name === "Incoming" ? "Inbound" : column.name}</h3>
        {column.name === "Incoming" ? (
          <button
            type="button"
            className={`${styles.header__label} ${highlightArchive && styles["is-active"]}`}
            onClick={() => {
              handleBtnCol(column.name)
            }}
            disabled={!highlightArchive}
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
          evt.item.classList.remove("sortable-item--draggable")
        }}
        onEnd={(evt, instance) => {
          setColHoverName("")
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
      >
        {state?.map((item) => (
          <div key={item.id} className={`sortable-item ${styles.item}`}>
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

export default FakeSortableCol
