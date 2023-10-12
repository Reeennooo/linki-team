import FavoritePerson from "components/FavoritePerson/FavoritePerson"
import InputSearch from "components/ui/InputSearch/InputSearch"
import { useAppDispatch, useAppSelector } from "hooks"
import { useMemo, useState } from "react"
import { seletCurrentTeam, updateCurrentTeam } from "redux/slices/currentTeam"
import styles from "./DetailedPopupSearchTeammate.module.scss"
import { openModal } from "redux/slices/modals"
import { UserFavoriteData } from "types/user"
import { useAddExpertToTeamMutation } from "redux/api/pmteam"

interface Props {
  addClass?: string
  onClose?: () => void
  favList: UserFavoriteData[]
  searchPlaceholder?: string
  addedList?: number[]
}

const DetailedPopupSearchTeammate: React.FC<Props> = ({ addClass, onClose, favList, searchPlaceholder, addedList }) => {
  const dispatch = useAppDispatch()

  const [addExpertToTeam] = useAddExpertToTeamMutation()

  const [searchTxt, setSearchTxt] = useState("")
  //айдишник команды
  const { currentTeamId } = useAppSelector(seletCurrentTeam)

  const favListToShow = useMemo(() => {
    if (searchTxt.length) {
      return favList.filter((el) => el.name.toLowerCase().includes(searchTxt.toLowerCase()))
    } else {
      return favList
    }
  }, [searchTxt, favList])

  const handleOnAdd = (id) => {
    if (!currentTeamId) return
    try {
      addExpertToTeam({ teamId: currentTeamId, executorId: id })
        .unwrap()
        .then((res) => {
          dispatch(updateCurrentTeam({ field: "updateTeamMembers", data: true }))
        })
    } catch (e) {
      console.log("ERR", e)
    }
    onClose()
  }

  return (
    <>
      <div className={` ${addClass ? addClass : ""} popup-body__section`}>
        <div className={`${styles["search-member__search"]}`}>
          <InputSearch
            onChange={(val) => setSearchTxt(val)}
            placeholder={searchPlaceholder ? searchPlaceholder : "Search for a specialist"}
          />
        </div>
        {favList && favList?.length < 1 ? (
          <div className={`${styles["search-member__empty"]}`}>
            <div className={`${styles["search-member__img"]}`}>
              <img src="/assets/search-member-min.png" alt="" />
            </div>
            <div className={`${styles["search-member__txt"]}`}>
              <p>
                There are no experts with this specialization in your Favorites. Add an expert to your Favorites or
                invite an expert to the platform
              </p>
            </div>
          </div>
        ) : (
          <div className={`${styles["favorite-list"]}`}>
            {favListToShow?.map((fav) => {
              return (
                <FavoritePerson
                  key={fav.id}
                  addClass={`${styles["favorite-list__item"]}`}
                  data={fav}
                  onAdd={
                    addedList?.includes(fav.id)
                      ? null
                      : () => {
                          handleOnAdd(fav.id)
                        }
                  }
                  addBtnText={"Add to the team"}
                />
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default DetailedPopupSearchTeammate
