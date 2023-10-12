import FavoritePerson from "components/FavoritePerson/FavoritePerson"
import styles from "./FavoriteList.module.scss"
import IconHeart from "public/assets/icons/heart-grey.svg"
import { useAppDispatch, useAppSelector } from "hooks"
import { closeModal, selectModals, openModal } from "redux/slices/modals"
import ModalUser from "components/Modals/ModalUser/ModalUser"
import { updateApiParams } from "redux/slices/apiParams"
import NoSearchResult from "components/NoSearchResult/NoSearchResult"

interface Props {
  addClass?: string
  filtered?: boolean
  isLoading?: boolean
  favList: {
    avatar: string
    name: string
    surname: string | null
    project_categories?: any[]
    project_directions?: any[]
    rating: number
    id: number
    type: number
  }[]
}

const FavoriteList: React.FC<Props> = ({ filtered, addClass, favList, isLoading }) => {
  const { modalsList } = useAppSelector(selectModals)
  const dispatch = useAppDispatch()

  const openUserModal = (fav) => {
    if (modalsList.includes("modal-user")) return
    dispatch(updateApiParams({ field: "currentUserID", data: fav.id }))
    dispatch(openModal("modal-user"))
  }

  return (
    <>
      <div className={`${styles["favorite-list-wrp"]}`}>
        <div className={`${styles["favorite-list"]} ${addClass ? addClass : ""}`}>
          {isLoading ? (
            <div className={styles["favorite-list__loading"]} />
          ) : favList?.length ? (
            <>
              {favList.map((fav) => {
                return (
                  <FavoritePerson
                    onClick={() => openUserModal(fav)}
                    openUser={true}
                    key={fav.id}
                    addClass={`${styles["favorite-list__item"]}`}
                    data={fav}
                  />
                )
              })}
            </>
          ) : filtered ? (
            <NoSearchResult />
          ) : (
            <div className={`${styles["favorite-list__empty-list"]}`}>
              <span className={`${styles["favorite-list__empty-btn"]}`}>
                <IconHeart />
              </span>
              <p>You haven&apos;t added anyone to your Favorites linki yet</p>
            </div>
          )}
        </div>
      </div>
      <ModalUser
        isOpen={modalsList.includes("modal-user")}
        onClose={() => {
          dispatch(closeModal("modal-user"))
        }}
        headerUserClickable={false}
        isChatHeader={true}
        isFooterExist={false}
      />
    </>
  )
}

export default FavoriteList
